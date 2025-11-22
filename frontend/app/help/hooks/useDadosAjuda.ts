/**
 * Hook useDadosAjuda
 * Conecta o ServicoAjuda (OOP) com React
 * Padrão: OOP + Português
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { router } from 'expo-router';
import { ServicoAjuda } from '../servicos/ServicoAjuda';
import { CategoriaTopico } from '../tipos/TopicoAjuda';

// Estados da UI
interface EstadoUI {
  busca: string;
  categoriaAtiva: CategoriaTopico | null;
}

export const useDadosAjuda = () => {
  // Instância única do serviço (OOP)
  const [servico] = useState(() => new ServicoAjuda());

  // Estados da UI
  const [estadoUI, setEstadoUI] = useState<EstadoUI>({
    busca: '',
    categoriaAtiva: null,
  });

  /**
   * Carrega tópicos ao montar
   */
  useEffect(() => {
    const carregarDados = async () => {
      try {
        console.log('[useDadosAjuda] Carregando tópicos...');
        await servico.carregarTopicos();
        console.log('[useDadosAjuda] Tópicos carregados:', servico.totalTopicos);
      } catch (erro: any) {
        console.error('[useDadosAjuda] Erro ao carregar:', erro);
      }
    };

    carregarDados();
  }, [servico]);

  /**
   * Tópicos filtrados
   */
  const topicosFiltrados = useMemo(() => {
    let topicos = servico.topicos;

    // Aplica busca
    if (estadoUI.busca) {
      topicos = servico.buscar(estadoUI.busca);
    }

    // Aplica filtro de categoria
    if (estadoUI.categoriaAtiva) {
      topicos = topicos.filter((t) => t.pertenceACategoria(estadoUI.categoriaAtiva!));
    }

    // Ordena por relevância
    return topicos.sort((a, b) => b.calcularRelevancia() - a.calcularRelevancia());
  }, [servico.topicos, estadoUI.busca, estadoUI.categoriaAtiva, servico]);

  /**
   * Estatísticas
   */
  const estatisticas = useMemo(() => {
    return servico.obterEstatisticas();
  }, [servico.topicos, servico]);

  /**
   * Manipuladores de eventos
   */
  const manipuladores = {
    /**
     * Volta para tela anterior
     */
    aoVoltarPress: useCallback(() => {
      router.back();
    }, []),

    /**
     * Atualiza busca
     */
    aoMudarBusca: useCallback((texto: string) => {
      setEstadoUI((prev) => ({ ...prev, busca: texto }));
    }, []),

    /**
     * Limpa busca
     */
    aoLimparBusca: useCallback(() => {
      setEstadoUI((prev) => ({ ...prev, busca: '' }));
    }, []),

    /**
     * Seleciona categoria
     */
    aoSelecionarCategoria: useCallback((categoria: CategoriaTopico | null) => {
      console.log('[useDadosAjuda] Categoria selecionada:', categoria);
      setEstadoUI((prev) => ({ ...prev, categoriaAtiva: categoria }));
    }, []),

    /**
     * Abre tópico
     */
    aoAbrirTopico: useCallback((topicoId: number) => {
      const topico = servico.obterTopicoPorId(topicoId);

      if (topico) {
        console.log('[useDadosAjuda] Abrindo tópico:', topico.titulo);

        // Registra visualização
        servico.registrarVisualizacao(topicoId);

        // TODO: Navegar para tela de detalhes do tópico
        // router.push(`/help/${topicoId}`);

        // Por enquanto, apenas log
        console.log('Conteúdo:', topico.conteudo);
      }
    }, [servico]),

    /**
     * Marca tópico como útil
     */
    aoMarcarUtil: useCallback((topicoId: number) => {
      console.log('[useDadosAjuda] Marcando tópico como útil:', topicoId);
      servico.registrarUtil(topicoId);
    }, [servico]),
  };

  return {
    // Dados dos tópicos
    topicos: topicosFiltrados,
    categorias: servico.categorias,
    estatisticas,

    // Estados da UI
    estadoUI: {
      busca: estadoUI.busca,
      categoriaAtiva: estadoUI.categoriaAtiva,
    },

    // Estados gerais
    carregando: servico.carregando,
    erro: servico.erro,
    totalTopicos: servico.totalTopicos,
    temTopicos: servico.temTopicos,

    // Manipuladores
    manipuladores,
  };
};
