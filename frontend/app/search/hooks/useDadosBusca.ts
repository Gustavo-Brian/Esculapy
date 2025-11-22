/**
 * Hook useDadosBusca
 * Conecta o ServicoBusca (OOP) com React
 * Padrão: OOP + Português
 */

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { router } from 'expo-router';
import { ServicoBusca } from '../servicos/ServicoBusca';

// Estados da UI
type AbaAtiva = 'produtos' | 'farmacias';

interface EstadoUI {
  termoBusca: string;
  abaAtiva: AbaAtiva;
  categoriaAtiva: string | null;
}

export const useDadosBusca = () => {
  // Instância única do serviço (OOP)
  const [servico] = useState(() => new ServicoBusca());

  // Estados da UI
  const [estadoUI, setEstadoUI] = useState<EstadoUI>({
    termoBusca: '',
    abaAtiva: 'produtos',
    categoriaAtiva: null,
  });

  // Ref para debounce
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Realiza busca com debounce
   */
  useEffect(() => {
    // Limpa timeout anterior
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Se termo vazio, limpa resultados
    if (estadoUI.termoBusca.trim().length === 0) {
      servico.limparResultados();
      return;
    }

    // Debounce de 500ms
    timeoutRef.current = setTimeout(() => {
      console.log('[useDadosBusca] Realizando busca com debounce:', estadoUI.termoBusca);
      servico.buscar(estadoUI.termoBusca);
    }, 500);

    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [estadoUI.termoBusca, servico]);

  /**
   * Resultados filtrados por aba ativa
   */
  const resultadosFiltrados = useMemo(() => {
    const resultados = servico.resultados;

    if (estadoUI.abaAtiva === 'produtos') {
      return {
        produtos: resultados.produtos,
        farmacias: [],
      };
    } else {
      return {
        produtos: [],
        farmacias: resultados.farmacias,
      };
    }
  }, [servico.resultados, estadoUI.abaAtiva]);

  /**
   * Mensagem de resumo dos resultados
   */
  const mensagemResumo = useMemo(() => {
    return servico.resultados.obterMensagemResumo();
  }, [servico.resultados]);

  /**
   * Manipuladores de eventos
   */
  const manipuladores = {
    /**
     * Altera termo de busca
     */
    aoMudarTermoBusca: useCallback((termo: string) => {
      setEstadoUI((prev) => ({ ...prev, termoBusca: termo }));
    }, []),

    /**
     * Altera aba ativa
     */
    aoMudarAba: useCallback((aba: AbaAtiva) => {
      setEstadoUI((prev) => ({ ...prev, abaAtiva: aba }));
    }, []),

    /**
     * Seleciona categoria
     */
    aoSelecionarCategoria: useCallback(async (categoriaId: string) => {
      const categoria = servico.obterCategoria(categoriaId);

      if (categoria) {
        console.log('[useDadosBusca] Categoria selecionada:', categoria.nome);

        setEstadoUI((prev) => ({
          ...prev,
          termoBusca: categoria.nome,
          categoriaAtiva: categoriaId,
        }));
      }
    }, [servico]),

    /**
     * Limpa busca
     */
    aoLimparBusca: useCallback(() => {
      console.log('[useDadosBusca] Limpando busca');

      setEstadoUI({
        termoBusca: '',
        abaAtiva: 'produtos',
        categoriaAtiva: null,
      });

      servico.limparResultados();
    }, [servico]),

    /**
     * Volta para tela anterior
     */
    aoVoltarPress: useCallback(() => {
      router.back();
    }, []),

    /**
     * Navega para detalhes do produto
     */
    aoProdutoPress: useCallback((produtoId: number) => {
      router.push(`/product/${produtoId}`);
    }, []),

    /**
     * Navega para página da farmácia
     */
    aoFarmaciaPress: useCallback((farmaciaId: number) => {
      router.push(`/seller/${farmaciaId}`);
    }, []),
  };

  return {
    // Dados do serviço
    resultados: resultadosFiltrados,
    categorias: servico.categorias,
    mensagemResumo,

    // Estados da UI
    estadoUI: {
      termoBusca: estadoUI.termoBusca,
      abaAtiva: estadoUI.abaAtiva,
      categoriaAtiva: estadoUI.categoriaAtiva,
    },

    // Estados gerais
    carregando: servico.carregando,
    erro: servico.erro,
    temResultados: servico.temResultados,
    totalProdutos: servico.totalProdutos,
    totalFarmacias: servico.totalFarmacias,

    // Manipuladores
    manipuladores,
  };
};
