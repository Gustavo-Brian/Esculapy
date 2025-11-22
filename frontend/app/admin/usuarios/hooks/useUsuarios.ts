/**
 * Hook customizado para gerenciamento de usuários (Admin)
 * Gerencia busca, visualização e ações de ban/unban de usuários
 */

import { useState, useCallback } from 'react';
import { buscarUsuarioPorEmail, desativarUsuario, reativarUsuario } from '@/src/servicos/admin/adminService';
import type { Usuario } from '@/src/servicos/types/admin.types';

export const useUsuarios = () => {
  // Estados
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [emailBusca, setEmailBusca] = useState('');
  const [buscando, setBuscando] = useState(false);
  const [processando, setProcessando] = useState(false);
  const [modalDetalhesVisivel, setModalDetalhesVisivel] = useState(false);
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
   * Busca usuário por email
   */
  const buscarUsuario = useCallback(async () => {
    // Validação básica
    if (!emailBusca.trim()) {
      showSnackbar('Digite um email para buscar', 'error');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailBusca.trim())) {
      showSnackbar('Email inválido', 'error');
      return;
    }

    try {
      setBuscando(true);
      console.log('[useUsuarios] Buscando usuário:', emailBusca);

      const data = await buscarUsuarioPorEmail(emailBusca.trim().toLowerCase());

      setUsuario(data);
      setModalDetalhesVisivel(true);
      console.log('[useUsuarios] Usuário encontrado:', data.email);
    } catch (error: any) {
      console.error('[useUsuarios] Erro ao buscar usuário:', error);

      // Se for 404, mostra mensagem específica
      if (error.message.includes('não encontrado')) {
        showSnackbar('Usuário não encontrado', 'error');
      } else {
        showSnackbar(error.message || 'Erro ao buscar usuário', 'error');
      }

      setUsuario(null);
    } finally {
      setBuscando(false);
    }
  }, [emailBusca]);

  /**
   * Desativa/Bane usuário
   */
  const handleDesativarUsuario = useCallback(async (usuarioId: number) => {
    try {
      setProcessando(true);
      console.log('[useUsuarios] Desativando usuário:', usuarioId);

      const usuarioAtualizado = await desativarUsuario(usuarioId);

      // Atualiza usuário local
      setUsuario(usuarioAtualizado);

      showSnackbar('Usuário banido com sucesso!', 'success');
    } catch (error: any) {
      console.error('[useUsuarios] Erro ao desativar usuário:', error);
      showSnackbar(error.message || 'Erro ao banir usuário', 'error');
    } finally {
      setProcessando(false);
    }
  }, []);

  /**
   * Reativa/Desbane usuário
   */
  const handleReativarUsuario = useCallback(async (usuarioId: number) => {
    try {
      setProcessando(true);
      console.log('[useUsuarios] Reativando usuário:', usuarioId);

      const usuarioAtualizado = await reativarUsuario(usuarioId);

      // Atualiza usuário local
      setUsuario(usuarioAtualizado);

      showSnackbar('Usuário desbanido com sucesso!', 'success');
    } catch (error: any) {
      console.error('[useUsuarios] Erro ao reativar usuário:', error);
      showSnackbar(error.message || 'Erro ao desbanir usuário', 'error');
    } finally {
      setProcessando(false);
    }
  }, []);

  /**
   * Limpa busca
   */
  const limparBusca = useCallback(() => {
    setEmailBusca('');
    setUsuario(null);
    setModalDetalhesVisivel(false);
  }, []);

  /**
   * Fecha modal de detalhes
   */
  const fecharModalDetalhes = useCallback(() => {
    setModalDetalhesVisivel(false);
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

  return {
    // Dados
    usuario,
    emailBusca,
    buscando,
    processando,
    modalDetalhesVisivel,
    snackbar,

    // Setters
    setEmailBusca,

    // Handlers
    buscarUsuario,
    handleDesativarUsuario,
    handleReativarUsuario,
    limparBusca,
    fecharModalDetalhes,
    hideSnackbar,
  };
};
