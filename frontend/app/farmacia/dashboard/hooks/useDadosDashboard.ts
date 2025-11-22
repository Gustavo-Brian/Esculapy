/**
 * Hook useDadosDashboard
 * Conecta os serviços OOP (ServicoDashboard) com React
 * Padrão: OOP + Português
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { router } from 'expo-router';
import { useAuth } from '@/src/hooks/useAuth';
import { ServicoDashboard } from '../servicos/ServicoDashboard';
import { ItemEstoque } from '../tipos/ItemEstoque';
import { Alerta } from '../tipos/Alerta';
import type { EstoqueResponse } from '@/src/servicos/types/api.types';
import { adicionarFarmaceutico } from '@/src/servicos/farmaceutico/farmaceuticoService';
import { temaMedico } from '@/src/estilos/temaMedico';

// Estados da UI
interface EstadoUI {
  abaAtiva: 'dashboard' | 'estoque' | 'relatorios';
  filtroEstoque: 'todos' | 'baixo' | 'esgotado';
  ordenacaoEstoque: 'nome' | 'quantidade' | 'preco';
  modalEditarVisivel: boolean;
  modalFarmaceuticoVisivel: boolean;
  modalAdicionarProdutoVisivel: boolean;
  modalRemoverProdutoVisivel: boolean;
  produtoEditando: EstoqueResponse | null;
  produtoRemovendo: ItemEstoque | null;
}

// Snackbar
interface EstadoSnackbar {
  visivel: boolean;
  mensagem: string;
  tipo: 'success' | 'error' | 'info';
}

export const useDadosDashboard = () => {
  const { user, logout } = useAuth();

  // Instância única do serviço (OOP)
  const [servico] = useState(() => new ServicoDashboard());

  // Estados da UI
  const [estadoUI, setEstadoUI] = useState<EstadoUI>({
    abaAtiva: 'dashboard',
    filtroEstoque: 'todos',
    ordenacaoEstoque: 'nome',
    modalEditarVisivel: false,
    modalFarmaceuticoVisivel: false,
    modalAdicionarProdutoVisivel: false,
    modalRemoverProdutoVisivel: false,
    produtoEditando: null,
    produtoRemovendo: null,
  });

  // Estado de carregamento e erro
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  // Snackbar
  const [snackbar, setSnackbar] = useState<EstadoSnackbar>({
    visivel: false,
    mensagem: '',
    tipo: 'info',
  });

  /**
   * Mostra snackbar
   */
  const mostrarSnackbar = useCallback((mensagem: string, tipo: 'success' | 'error' | 'info' = 'info') => {
    setSnackbar({ visivel: true, mensagem, tipo });
  }, []);

  /**
   * Carrega dados iniciais do dashboard
   */
  useEffect(() => {
    const carregarDados = async () => {
      try {
        setCarregando(true);
        setErro(null);

        console.log('[useDadosDashboard] Carregando dashboard...');

        await servico.carregarDashboard();

        console.log('[useDadosDashboard] Dashboard carregado com sucesso');
        console.log('[useDadosDashboard] Total de itens:', servico.totalItens);
        console.log('[useDadosDashboard] Total de alertas:', servico.alertas.length);

      } catch (erro: any) {
        console.error('[useDadosDashboard] Erro ao carregar:', erro);
        setErro(erro.message);
        mostrarSnackbar('Erro ao carregar dados do dashboard', 'error');
      } finally {
        setCarregando(false);
      }
    };

    carregarDados();
  }, []);

  /**
   * Recarrega o estoque
   */
  const recarregarEstoque = useCallback(async () => {
    try {
      await servico.recarregarEstoque();
    } catch (erro: any) {
      console.error('[useDadosDashboard] Erro ao recarregar:', erro);
      mostrarSnackbar('Erro ao recarregar estoque', 'error');
    }
  }, [servico, mostrarSnackbar]);

  /**
   * Produtos filtrados e ordenados
   */
  const produtosFiltrados = useMemo(() => {
    // Filtra por status
    let itens: ItemEstoque[] = [];

    if (estadoUI.filtroEstoque === 'baixo') {
      itens = servico.filtrarEstoquePorStatus('BAIXO');
    } else if (estadoUI.filtroEstoque === 'esgotado') {
      itens = servico.filtrarEstoquePorStatus('ESGOTADO');
    } else {
      itens = servico.filtrarEstoquePorStatus('TODOS');
    }

    // Ordena
    if (estadoUI.ordenacaoEstoque === 'nome') {
      itens = [...itens].sort((a, b) => {
        const nomeA = a.produtoNome || '';
        const nomeB = b.produtoNome || '';
        return nomeA.localeCompare(nomeB);
      });
    } else if (estadoUI.ordenacaoEstoque === 'quantidade') {
      itens = [...itens].sort((a, b) => (a.quantidade || 0) - (b.quantidade || 0));
    } else if (estadoUI.ordenacaoEstoque === 'preco') {
      itens = [...itens].sort((a, b) => (a.preco || 0) - (b.preco || 0));
    }

    return itens;
  }, [servico.itensEstoque, estadoUI.filtroEstoque, estadoUI.ordenacaoEstoque]);

  /**
   * Ações rápidas com callbacks
   */
  const acoesRapidasComCallbacks = useMemo(() => {
    return servico.acoesRapidas.map((acao) => ({
      ...acao,
      onPress: () => {
        if (acao.acao === 'adicionar') {
          setEstadoUI((prev) => ({ ...prev, modalAdicionarProdutoVisivel: true }));
        } else if (acao.acao === 'farmaceuticos') {
          setEstadoUI((prev) => ({ ...prev, modalFarmaceuticoVisivel: true }));
        } else if (acao.acao === 'relatorio' || acao.acao === 'ajuda') {
          mostrarSnackbar('Função em desenvolvimento', 'info');
        }
      },
    }));
  }, [servico.acoesRapidas, mostrarSnackbar]);

  /**
   * Manipuladores de eventos
   */
  const manipuladores = {
    /**
     * Muda aba ativa
     */
    aoMudarAba: useCallback((aba: EstadoUI['abaAtiva']) => {
      setEstadoUI((prev) => ({ ...prev, abaAtiva: aba }));
    }, []),

    /**
     * Muda filtro de estoque
     */
    aoMudarFiltro: useCallback((filtro: EstadoUI['filtroEstoque']) => {
      setEstadoUI((prev) => ({ ...prev, filtroEstoque: filtro }));
    }, []),

    /**
     * Muda ordenação de estoque
     */
    aoMudarOrdenacao: useCallback((ordenacao: EstadoUI['ordenacaoEstoque']) => {
      setEstadoUI((prev) => ({ ...prev, ordenacaoEstoque: ordenacao }));
    }, []),

    /**
     * Adiciona produto ao estoque
     */
    aoAdicionarProduto: useCallback(async (produtoId: number, preco: number, quantidade: number) => {
      try {
        await servico.adicionarProduto(produtoId, preco, quantidade);
        mostrarSnackbar('Produto adicionado ao estoque com sucesso!', 'success');
        setEstadoUI((prev) => ({ ...prev, modalAdicionarProdutoVisivel: false }));
      } catch (erro: any) {
        console.error('[useDadosDashboard] Erro ao adicionar:', erro);
        mostrarSnackbar(erro.message || 'Erro ao adicionar produto', 'error');
      }
    }, [servico, mostrarSnackbar]),

    /**
     * Abre modal de edição
     */
    aoEditarProduto: useCallback((produto: EstoqueResponse) => {
      setEstadoUI((prev) => ({
        ...prev,
        modalEditarVisivel: true,
        produtoEditando: produto,
      }));
    }, []),

    /**
     * Confirma edição do produto
     */
    aoConfirmarEdicao: useCallback(async (estoqueId: number, preco: number, quantidade: number) => {
      try {
        await servico.atualizarItem(estoqueId, preco, quantidade);
        mostrarSnackbar('Produto atualizado com sucesso!', 'success');
        setEstadoUI((prev) => ({
          ...prev,
          modalEditarVisivel: false,
          produtoEditando: null,
        }));
      } catch (erro: any) {
        console.error('[useDadosDashboard] Erro ao atualizar:', erro);
        mostrarSnackbar(erro.message || 'Erro ao atualizar produto', 'error');
      }
    }, [servico, mostrarSnackbar]),

    /**
     * Abre modal de remoção
     */
    aoRemoverProduto: useCallback((produto: ItemEstoque) => {
      setEstadoUI((prev) => ({
        ...prev,
        modalRemoverProdutoVisivel: true,
        produtoRemovendo: produto,
      }));
    }, []),

    /**
     * Confirma remoção do produto
     */
    aoConfirmarRemocao: useCallback(async () => {
      if (!estadoUI.produtoRemovendo) return;

      try {
        await servico.removerItem(estadoUI.produtoRemovendo.estoqueId);
        mostrarSnackbar('Produto removido do estoque com sucesso!', 'success');
        setEstadoUI((prev) => ({
          ...prev,
          modalRemoverProdutoVisivel: false,
          produtoRemovendo: null,
        }));
      } catch (erro: any) {
        console.error('[useDadosDashboard] Erro ao remover:', erro);
        mostrarSnackbar(erro.message || 'Erro ao remover produto', 'error');
        // Recarrega mesmo com erro para sincronizar
        await recarregarEstoque();
        setEstadoUI((prev) => ({
          ...prev,
          modalRemoverProdutoVisivel: false,
          produtoRemovendo: null,
        }));
      }
    }, [estadoUI.produtoRemovendo, servico, mostrarSnackbar, recarregarEstoque]),

    /**
     * Cancela operação e fecha modal
     */
    aoCancelarOperacao: useCallback((tipo: 'editar' | 'remover' | 'adicionar' | 'farmaceutico') => {
      setEstadoUI((prev) => {
        if (tipo === 'editar') {
          return { ...prev, modalEditarVisivel: false, produtoEditando: null };
        }
        if (tipo === 'remover') {
          return { ...prev, modalRemoverProdutoVisivel: false, produtoRemovendo: null };
        }
        if (tipo === 'adicionar') {
          return { ...prev, modalAdicionarProdutoVisivel: false };
        }
        if (tipo === 'farmaceutico') {
          return { ...prev, modalFarmaceuticoVisivel: false };
        }
        return prev;
      });
    }, []),

    /**
     * Adiciona farmacêutico
     */
    aoAdicionarFarmaceutico: useCallback(async (nome: string, email: string, crfNumero: string) => {
      try {
        await adicionarFarmaceutico({ nome, email, crfNumero });
        mostrarSnackbar('Farmacêutico cadastrado com sucesso!', 'success');
        setEstadoUI((prev) => ({ ...prev, modalFarmaceuticoVisivel: false }));
      } catch (erro: any) {
        console.error('[useDadosDashboard] Erro ao adicionar farmacêutico:', erro);
        mostrarSnackbar(erro.message || 'Erro ao cadastrar farmacêutico', 'error');
      }
    }, [mostrarSnackbar]),

    /**
     * Navega para perfil
     */
    aoClicarPerfil: useCallback(() => {
      router.push('/account');
    }, []),

    /**
     * Faz logout
     */
    aoFazerLogout: useCallback(async () => {
      await logout();
      router.replace('/login');
    }, [logout]),

    /**
     * Fecha snackbar
     */
    aoFecharSnackbar: useCallback(() => {
      setSnackbar((prev) => ({ ...prev, visivel: false }));
    }, []),
  };

  return {
    // Dados do serviço (OOP)
    estatisticas: servico.estatisticas,
    produtosEstoque: produtosFiltrados,
    alertas: servico.alertas,
    acoesRapidas: acoesRapidasComCallbacks,
    dadosVendas: servico.dadosVendas,

    // Estados da UI
    abaAtiva: estadoUI.abaAtiva,
    filtroEstoque: estadoUI.filtroEstoque,
    ordenacaoEstoque: estadoUI.ordenacaoEstoque,
    modalEditarVisivel: estadoUI.modalEditarVisivel,
    modalFarmaceuticoVisivel: estadoUI.modalFarmaceuticoVisivel,
    modalAdicionarProdutoVisivel: estadoUI.modalAdicionarProdutoVisivel,
    modalRemoverProdutoVisivel: estadoUI.modalRemoverProdutoVisivel,
    produtoEditando: estadoUI.produtoEditando,
    produtoRemovendo: estadoUI.produtoRemovendo,

    // Estados gerais
    carregando: carregando || servico.carregando,
    erro,
    temDados: servico.temDados,
    totalItens: servico.totalItens,

    // Snackbar
    snackbar,

    // Manipuladores
    manipuladores,

    // Utilitários
    recarregarEstoque,
    mostrarSnackbar,
  };
};
