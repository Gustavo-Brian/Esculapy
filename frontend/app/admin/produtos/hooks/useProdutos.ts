/**
 * Hook customizado para gerenciamento de produtos (Admin)
 * Gerencia listagem, criação, edição e ações sobre produtos do catálogo master
 */

import { useState, useEffect, useCallback } from 'react';
import {
  criarProduto,
  atualizarProduto,
  desativarProduto,
  reativarProduto,
  deletarProduto,
} from '@/src/servicos/admin/adminService';
import type {
  Produto,
  ProdutoRequest,
  TipoProduto,
  TipoReceita,
} from '@/src/servicos/types/admin.types';

// Mock de produtos para demonstração (substituir por chamada real de API)
const mockProdutos: Produto[] = [];

export const useProdutos = () => {
  // Estados
  const [produtos, setProdutos] = useState<Produto[]>(mockProdutos);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [filtroAtivo, setFiltroAtivo] = useState<boolean | 'TODOS'>('TODOS');
  const [filtroTipo, setFiltroTipo] = useState<TipoProduto | 'TODOS'>('TODOS');
  const [modalFormVisible, setModalFormVisible] = useState(false);
  const [produtoEditando, setProdutoEditando] = useState<Produto | null>(null);
  const [processando, setProcessando] = useState(false);
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
   * Carrega lista de produtos
   * TODO: Implementar endpoint de listagem no backend
   */
  const carregarProdutos = useCallback(async (mostrarLoading = true) => {
    try {
      if (mostrarLoading) {
        setLoading(true);
      }

      console.log('[useProdutos] Carregando produtos...');

      // TODO: Substituir por chamada real quando backend implementar
      // const data = await listarProdutos({ ativo: filtroAtivo !== 'TODOS' ? filtroAtivo : undefined });
      // setProdutos(data);

      // Por enquanto, usa mock
      setProdutos(mockProdutos);
      console.log('[useProdutos] Produtos carregados:', mockProdutos.length);
    } catch (error: any) {
      console.error('[useProdutos] Erro ao carregar produtos:', error);
      showSnackbar(error.message || 'Erro ao carregar produtos', 'error');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [filtroAtivo]);

  /**
   * Efeito: Carrega produtos ao montar
   */
  useEffect(() => {
    carregarProdutos();
  }, [carregarProdutos]);

  /**
   * Refresh manual (pull to refresh)
   */
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    carregarProdutos(false);
  }, [carregarProdutos]);

  /**
   * Cria novo produto
   */
  const handleCriarProduto = useCallback(async (produtoData: ProdutoRequest) => {
    try {
      setProcessando(true);
      console.log('[useProdutos] Criando produto:', produtoData.nome);

      const novoProduto = await criarProduto(produtoData);

      // Adiciona à lista local
      setProdutos(prev => [novoProduto, ...prev]);

      showSnackbar('Produto criado com sucesso!', 'success');
      setModalFormVisible(false);
      setProdutoEditando(null);
    } catch (error: any) {
      console.error('[useProdutos] Erro ao criar produto:', error);
      showSnackbar(error.message || 'Erro ao criar produto', 'error');
      throw error; // Re-throw para o formulário tratar
    } finally {
      setProcessando(false);
    }
  }, []);

  /**
   * Atualiza produto existente
   */
  const handleAtualizarProduto = useCallback(
    async (produtoId: number, produtoData: ProdutoRequest) => {
      try {
        setProcessando(true);
        console.log('[useProdutos] Atualizando produto:', produtoId);

        const produtoAtualizado = await atualizarProduto(produtoId, produtoData);

        // Atualiza lista local
        setProdutos(prev => prev.map(p => (p.id === produtoId ? produtoAtualizado : p)));

        showSnackbar('Produto atualizado com sucesso!', 'success');
        setModalFormVisible(false);
        setProdutoEditando(null);
      } catch (error: any) {
        console.error('[useProdutos] Erro ao atualizar produto:', error);
        showSnackbar(error.message || 'Erro ao atualizar produto', 'error');
        throw error; // Re-throw para o formulário tratar
      } finally {
        setProcessando(false);
      }
    },
    []
  );

  /**
   * Desativa produto
   */
  const handleDesativarProduto = useCallback(async (produtoId: number) => {
    try {
      setProcessando(true);
      console.log('[useProdutos] Desativando produto:', produtoId);

      const produtoAtualizado = await desativarProduto(produtoId);

      // Atualiza lista local
      setProdutos(prev => prev.map(p => (p.id === produtoId ? produtoAtualizado : p)));

      showSnackbar('Produto desativado com sucesso!', 'success');
    } catch (error: any) {
      console.error('[useProdutos] Erro ao desativar produto:', error);
      showSnackbar(error.message || 'Erro ao desativar produto', 'error');
    } finally {
      setProcessando(false);
    }
  }, []);

  /**
   * Reativa produto
   */
  const handleReativarProduto = useCallback(async (produtoId: number) => {
    try {
      setProcessando(true);
      console.log('[useProdutos] Reativando produto:', produtoId);

      const produtoAtualizado = await reativarProduto(produtoId);

      // Atualiza lista local
      setProdutos(prev => prev.map(p => (p.id === produtoId ? produtoAtualizado : p)));

      showSnackbar('Produto reativado com sucesso!', 'success');
    } catch (error: any) {
      console.error('[useProdutos] Erro ao reativar produto:', error);
      showSnackbar(error.message || 'Erro ao reativar produto', 'error');
    } finally {
      setProcessando(false);
    }
  }, []);

  /**
   * Deleta produto permanentemente
   */
  const handleDeletarProduto = useCallback(async (produtoId: number) => {
    try {
      setProcessando(true);
      console.log('[useProdutos] Deletando produto:', produtoId);

      await deletarProduto(produtoId);

      // Remove da lista local
      setProdutos(prev => prev.filter(p => p.id !== produtoId));

      showSnackbar('Produto deletado com sucesso!', 'success');
    } catch (error: any) {
      console.error('[useProdutos] Erro ao deletar produto:', error);
      showSnackbar(error.message || 'Erro ao deletar produto', 'error');
    } finally {
      setProcessando(false);
    }
  }, []);

  /**
   * Abre modal para criar novo produto
   */
  const abrirModalCriar = useCallback(() => {
    setProdutoEditando(null);
    setModalFormVisible(true);
  }, []);

  /**
   * Abre modal para editar produto
   */
  const abrirModalEditar = useCallback((produto: Produto) => {
    setProdutoEditando(produto);
    setModalFormVisible(true);
  }, []);

  /**
   * Fecha modal de formulário
   */
  const fecharModalForm = useCallback(() => {
    setModalFormVisible(false);
    setProdutoEditando(null);
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
   * Produtos filtrados
   */
  const produtosFiltrados = produtos.filter(produto => {
    // Filtro por ativo/inativo
    if (filtroAtivo !== 'TODOS' && produto.ativo !== filtroAtivo) {
      return false;
    }

    // Filtro por tipo
    if (filtroTipo !== 'TODOS' && produto.tipoProduto !== filtroTipo) {
      return false;
    }

    return true;
  });

  /**
   * Estatísticas
   */
  const stats = {
    total: produtos.length,
    ativos: produtos.filter(p => p.ativo).length,
    inativos: produtos.filter(p => !p.ativo).length,
  };

  return {
    // Dados
    produtos: produtosFiltrados,
    loading,
    refreshing,
    filtroAtivo,
    filtroTipo,
    modalFormVisible,
    produtoEditando,
    processando,
    stats,
    snackbar,

    // Setters
    setFiltroAtivo,
    setFiltroTipo,

    // Handlers
    onRefresh,
    handleCriarProduto,
    handleAtualizarProduto,
    handleDesativarProduto,
    handleReativarProduto,
    handleDeletarProduto,
    abrirModalCriar,
    abrirModalEditar,
    fecharModalForm,
    hideSnackbar,
  };
};
