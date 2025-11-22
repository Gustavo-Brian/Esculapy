/**
 * Hook useDadosHome
 * Conecta o Serviço com o React
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { router } from 'expo-router';
import { ServicoHome } from '../servicos/ServicoHome';
import { Produto } from '../tipos/Produto';

export const useDadosHome = () => {
  // Instância única do serviço
  const [servico] = useState(() => new ServicoHome());

  // Estados do React
  const [categoriaAtiva, setCategoriaAtiva] = useState<string>('todos');
  const [atualizando, setAtualizando] = useState(false);

  /**
   * Carrega dados ao montar o componente
   */
  useEffect(() => {
    servico.carregarDados();
  }, [servico]);

  /**
   * Recarrega dados (pull to refresh)
   */
  const recarregar = useCallback(async () => {
    setAtualizando(true);
    await servico.carregarDados();
    setAtualizando(false);
  }, [servico]);

  /**
   * Produtos filtrados pela categoria ativa
   */
  const produtosFiltrados = useMemo(() => {
    return servico.filtrarPorCategoria(categoriaAtiva);
  }, [servico.produtos, categoriaAtiva]);

  /**
   * Handlers
   */
  const manipuladores = {
    aoSelecionarCategoria: (categoria: string) => {
      setCategoriaAtiva(categoria);
    },

    aoClicarProduto: (produto: Produto) => {
      router.push(`/product/${produto.id}`);
    },

    aoClicarFarmacia: (farmaciaId: number) => {
      router.push(`/seller/${farmaciaId}`);
    },

    aoAdicionarCarrinho: (produto: Produto) => {
      console.log('Adicionar ao carrinho:', produto.nome);
      // Lógica de adicionar ao carrinho
    },

    aoClicarBusca: () => {
      router.push('/search');
    },

    aoClicarConta: () => {
      router.push('/account');
    },

    aoClicarFavoritos: () => {
      router.push('/favorites');
    },

    aoClicarCarrinho: () => {
      router.push('/cart');
    },
  };

  /**
   * Categorias únicas dos produtos
   */
  const categorias = useMemo(() => {
    const cats = servico.produtos.map((p) => p.categoria);
    return ['Todos', ...Array.from(new Set(cats))];
  }, [servico.produtos]);

  return {
    // Dados
    produtos: servico.produtos,
    produtosFiltrados,
    ofertas: servico.ofertas,
    farmacias: servico.farmacias,
    melhoresOfertas: servico.melhoresOfertas,
    categorias,

    // Estados
    categoriaAtiva,
    carregando: servico.carregando,
    atualizando,
    erro: servico.erro,

    // Métodos
    recarregar,
    manipuladores,
  };
};
