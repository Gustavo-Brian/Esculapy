/**
 * Hook useDadosFarmacias
 * Conecta o ServicoFarmacias (OOP) com React
 * Padrão: OOP + Português
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { router } from 'expo-router';
import { ServicoFarmacias } from '../servicos/ServicoFarmacias';
import { TipoFiltro } from '../tipos/FiltroFarmacia';

// Estados da UI
interface EstadoUI {
  busca: string;
  filtroAtivo: TipoFiltro;
}

export const useDadosFarmacias = () => {
  // Instância única do serviço (OOP)
  const [servico] = useState(() => new ServicoFarmacias());

  // Estados da UI
  const [estadoUI, setEstadoUI] = useState<EstadoUI>({
    busca: '',
    filtroAtivo: 'proximidade',
  });

  /**
   * Carrega farmácias ao montar
   */
  useEffect(() => {
    const carregarDados = async () => {
      try {
        console.log('[useDadosFarmacias] Carregando farmácias...');
        await servico.carregarFarmacias();
        console.log('[useDadosFarmacias] Farmácias carregadas:', servico.totalFarmacias);
      } catch (erro: any) {
        console.error('[useDadosFarmacias] Erro ao carregar:', erro);
      }
    };

    carregarDados();
  }, [servico]);

  /**
   * Farmácias filtradas e ordenadas
   */
  const farmaciasFiltradas = useMemo(() => {
    return servico.buscarEOrdenar(estadoUI.busca, estadoUI.filtroAtivo);
  }, [servico.farmacias, estadoUI.busca, estadoUI.filtroAtivo, servico]);

  /**
   * Estatísticas das farmácias
   */
  const estatisticas = useMemo(() => {
    return servico.obterEstatisticas();
  }, [servico.farmacias, servico]);

  /**
   * Manipuladores de eventos
   */
  const manipuladores = {
    /**
     * Atualiza termo de busca
     */
    aoBuscar: useCallback((texto: string) => {
      setEstadoUI((prev) => ({ ...prev, busca: texto }));
    }, []),

    /**
     * Altera filtro ativo
     */
    aoMudarFiltro: useCallback((filtroId: string) => {
      console.log('[useDadosFarmacias] Filtro alterado:', filtroId);
      setEstadoUI((prev) => ({ ...prev, filtroAtivo: filtroId as TipoFiltro }));
    }, []),

    /**
     * Navega para página da farmácia
     */
    aoFarmaciaPress: useCallback((farmaciaId: number) => {
      router.push(`/seller/${farmaciaId}`);
    }, []),

    /**
     * Volta para tela anterior
     */
    aoVoltarPress: useCallback(() => {
      router.back();
    }, []),

    /**
     * Limpa busca
     */
    aoLimparBusca: useCallback(() => {
      setEstadoUI((prev) => ({ ...prev, busca: '' }));
    }, []),
  };

  return {
    // Dados do serviço
    farmacias: farmaciasFiltradas,
    filtros: servico.filtros,
    estatisticas,

    // Estados da UI
    estadoUI: {
      busca: estadoUI.busca,
      filtroAtivo: estadoUI.filtroAtivo,
    },

    // Estados gerais
    carregando: servico.carregando,
    erro: servico.erro,
    totalFarmacias: servico.totalFarmacias,
    temFarmacias: servico.temFarmacias,

    // Manipuladores
    manipuladores,
  };
};
