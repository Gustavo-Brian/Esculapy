/**
 * Hook customizado para gerenciamento de farmácias (Admin)
 * Gerencia estado e ações para listagem e aprovação de farmácias
 */

import { useState, useEffect, useCallback } from 'react';
import { listarFarmacias, ativarFarmacia, desativarFarmacia } from '@/src/servicos/admin/adminService';
import type { Farmacia, LojistaStatus } from '@/src/servicos/types/admin.types';

export const useFarmacias = () => {
  // Estados
  const [farmacias, setFarmacias] = useState<Farmacia[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filtroStatus, setFiltroStatus] = useState<LojistaStatus | 'TODOS'>('TODOS');
  const [snackbar, setSnackbar] = useState<{
    visible: boolean;
    message: string;
    type: 'success' | 'error';
  }>({
    visible: false,
    message: '',
    type: 'success',
  });

  /**
   * Carrega lista de farmácias
   */
  const carregarFarmacias = useCallback(async (mostrarLoading = true) => {
    try {
      if (mostrarLoading) {
        setLoading(true);
      }

      console.log('[useFarmacias] Carregando farmácias com filtro:', filtroStatus);

      const params = filtroStatus !== 'TODOS' ? { status: filtroStatus } : undefined;
      const data = await listarFarmacias(params);

      setFarmacias(data);
      console.log('[useFarmacias] Farmácias carregadas:', data.length);
    } catch (error: any) {
      console.error('[useFarmacias] Erro ao carregar farmácias:', error);
      showSnackbar(error.message || 'Erro ao carregar farmácias', 'error');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [filtroStatus]);

  /**
   * Efeito: Carrega farmácias quando o filtro muda
   */
  useEffect(() => {
    carregarFarmacias();
  }, [carregarFarmacias]);

  /**
   * Refresh manual (pull to refresh)
   */
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    carregarFarmacias(false);
  }, [carregarFarmacias]);

  /**
   * Ativa/Aprova farmácia
   */
  const handleAtivarFarmacia = useCallback(async (farmaciaId: number) => {
    try {
      console.log('[useFarmacias] Ativando farmácia:', farmaciaId);

      const farmaciaAtualizada = await ativarFarmacia(farmaciaId);

      // Atualiza lista local
      setFarmacias(prev =>
        prev.map(f => f.id === farmaciaId ? farmaciaAtualizada : f)
      );

      showSnackbar('Farmácia ativada com sucesso!', 'success');
    } catch (error: any) {
      console.error('[useFarmacias] Erro ao ativar farmácia:', error);
      showSnackbar(error.message || 'Erro ao ativar farmácia', 'error');
    }
  }, []);

  /**
   * Desativa/Suspende farmácia
   */
  const handleDesativarFarmacia = useCallback(async (farmaciaId: number) => {
    try {
      console.log('[useFarmacias] Desativando farmácia:', farmaciaId);

      const farmaciaAtualizada = await desativarFarmacia(farmaciaId);

      // Atualiza lista local
      setFarmacias(prev =>
        prev.map(f => f.id === farmaciaId ? farmaciaAtualizada : f)
      );

      showSnackbar('Farmácia suspensa com sucesso!', 'success');
    } catch (error: any) {
      console.error('[useFarmacias] Erro ao desativar farmácia:', error);
      showSnackbar(error.message || 'Erro ao desativar farmácia', 'error');
    }
  }, []);

  /**
   * Altera filtro de status
   */
  const handleChangeFiltro = useCallback((status: LojistaStatus | 'TODOS') => {
    setFiltroStatus(status);
  }, []);

  /**
   * Mostra snackbar
   */
  const showSnackbar = useCallback((message: string, type: 'success' | 'error') => {
    setSnackbar({ visible: true, message, type });
  }, []);

  /**
   * Esconde snackbar
   */
  const hideSnackbar = useCallback(() => {
    setSnackbar(prev => ({ ...prev, visible: false }));
  }, []);

  /**
   * Estatísticas calculadas
   */
  const stats = {
    total: farmacias.length,
    pendentes: farmacias.filter(f => f.status === 'PENDENTE_APROVACAO').length,
    ativas: farmacias.filter(f => f.status === 'ATIVO').length,
    suspensas: farmacias.filter(f => f.status === 'SUSPENSO').length,
  };

  return {
    // Dados
    farmacias,
    loading,
    refreshing,
    filtroStatus,
    stats,
    snackbar,

    // Handlers
    onRefresh,
    handleAtivarFarmacia,
    handleDesativarFarmacia,
    handleChangeFiltro,
    hideSnackbar,
  };
};
