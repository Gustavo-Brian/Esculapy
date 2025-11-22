/**
 * Hook OOP: useDadosCatalogo
 * Conecta o ServicoCatalogo ao React
 */

import { useState, useEffect, useMemo, useCallback } from 'react';
import { router } from 'expo-router';
import { Alert } from 'react-native';
import { ServicoCatalogo } from '../servicos/ServicoCatalogo';
import { ProdutoCatalogo } from '../tipos/ProdutoCatalogo';
import { EstatisticasCatalogo } from '../tipos/EstatisticasCatalogo';

export function useDadosCatalogo() {
  const [servico] = useState(() => new ServicoCatalogo());
  const [produtos, definirProdutos] = useState<ProdutoCatalogo[]>([]);
  const [carregando, definirCarregando] = useState(true);
  const [erro, definirErro] = useState<string | null>(null);

  /**
   * Carrega produtos na montagem
   */
  useEffect(() => {
    carregarProdutos();
  }, []);

  /**
   * Carrega produtos do serviço
   */
  const carregarProdutos = useCallback(async () => {
    try {
      definirCarregando(true);
      definirErro(null);
      const produtosCarregados = await servico.carregarProdutos();
      definirProdutos(produtosCarregados);
    } catch (erro: any) {
      definirErro(erro.message);
      console.error('[useDadosCatalogo] Erro ao carregar:', erro);
    } finally {
      definirCarregando(false);
    }
  }, [servico]);

  /**
   * Estatísticas do catálogo
   */
  const estatisticas = useMemo(() => {
    return servico.calcularEstatisticas();
  }, [produtos, servico]);

  /**
   * Produtos bem avaliados
   */
  const produtosBemAvaliados = useMemo(() => {
    return servico.obterBemAvaliados();
  }, [produtos, servico]);

  /**
   * Produtos baratos
   */
  const produtosBaratos = useMemo(() => {
    return servico.obterBaratos();
  }, [produtos, servico]);

  /**
   * Resumo do catálogo
   */
  const resumo = useMemo(() => {
    return servico.obterResumo();
  }, [produtos, servico]);

  /**
   * Manipuladores
   */
  const manipuladores = useMemo(() => ({
    /**
     * Volta para tela anterior
     */
    aoVoltar: () => {
      router.back();
    },

    /**
     * Visualiza produto
     */
    aoVisualizarProduto: (produtoId: number) => {
      const produto = servico.obterProdutoPorId(produtoId);
      if (produto) {
        console.log('[useDadosCatalogo] Visualizando produto:', produto.nome);
        router.push(`/product/${produtoId}`);
      }
    },

    /**
     * Adiciona produto ao carrinho
     */
    aoAdicionarAoCarrinho: (produto: ProdutoCatalogo) => {
      Alert.alert(
        '✅ Produto Adicionado',
        `${produto.nome} foi adicionado ao carrinho!`,
        [
          { text: 'Continuar Comprando', style: 'cancel' },
          {
            text: 'Ir para o Carrinho',
            onPress: () => router.push('/cart'),
          },
        ]
      );
      console.log('[useDadosCatalogo] Produto adicionado:', produto.nome);
    },

    /**
     * Busca produtos
     */
    aoBuscar: (termo: string) => {
      const resultados = servico.buscar(termo);
      definirProdutos(resultados);
      console.log('[useDadosCatalogo] Busca realizada:', termo, '- Resultados:', resultados.length);
    },

    /**
     * Ordena por preço menor
     */
    aoOrdenarPorPrecoMenor: () => {
      const ordenados = servico.ordenarPorPrecoMenor();
      definirProdutos(ordenados);
      console.log('[useDadosCatalogo] Ordenado por preço menor');
    },

    /**
     * Ordena por preço maior
     */
    aoOrdenarPorPrecoMaior: () => {
      const ordenados = servico.ordenarPorPrecoMaior();
      definirProdutos(ordenados);
      console.log('[useDadosCatalogo] Ordenado por preço maior');
    },

    /**
     * Ordena por melhor avaliação
     */
    aoOrdenarPorMelhorAvaliacao: () => {
      const ordenados = servico.ordenarPorAvaliacaoMaior();
      definirProdutos(ordenados);
      console.log('[useDadosCatalogo] Ordenado por melhor avaliação');
    },

    /**
     * Ordena por nome
     */
    aoOrdenarPorNome: () => {
      const ordenados = servico.ordenarPorNome();
      definirProdutos(ordenados);
      console.log('[useDadosCatalogo] Ordenado por nome');
    },

    /**
     * Filtra por vendedor
     */
    aoFiltrarPorVendedor: (nomeVendedor: string) => {
      const filtrados = servico.filtrarPorVendedor(nomeVendedor);
      definirProdutos(filtrados);
      console.log('[useDadosCatalogo] Filtrado por vendedor:', nomeVendedor);
    },

    /**
     * Limpa filtros
     */
    aoLimparFiltros: () => {
      definirProdutos(servico.produtos);
      console.log('[useDadosCatalogo] Filtros limpos');
    },

    /**
     * Recarrega produtos
     */
    aoRecarregar: carregarProdutos,
  }), [servico, carregarProdutos]);

  return {
    // Dados
    produtos,
    estatisticas,
    produtosBemAvaliados,
    produtosBaratos,
    resumo,

    // Estado
    carregando,
    erro,

    // Verificações
    temProdutos: servico.temProdutos,
    temErro: erro !== null,

    // Manipuladores
    manipuladores,
  };
}
