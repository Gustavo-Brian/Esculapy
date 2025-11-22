/**
 * Hook useDadosFavoritos
 * Conecta o ServicoFavoritos (OOP) com React
 * Padrão: OOP + Português
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { router } from 'expo-router';
import { ServicoFavoritos } from '../servicos/ServicoFavoritos';
import { ItemFavorito } from '../tipos/ItemFavorito';

// Estados da UI
interface EstadoFiltros {
  busca: string;
  categoria: string;
  ordenacao: 'nome' | 'preco' | 'data';
  crescente: boolean;
}

interface EstadoSnackbar {
  visivel: boolean;
  mensagem: string;
  tipo: 'success' | 'error' | 'info';
}

export const useDadosFavoritos = () => {
  // Instância única do serviço (OOP)
  const [servico] = useState(() => new ServicoFavoritos());

  // Estados da UI
  const [filtros, setFiltros] = useState<EstadoFiltros>({
    busca: '',
    categoria: 'todos',
    ordenacao: 'data',
    crescente: false, // Mais recentes primeiro
  });

  const [snackbar, setSnackbar] = useState<EstadoSnackbar>({
    visivel: false,
    mensagem: '',
    tipo: 'info',
  });

  const [carregando, setCarregando] = useState(true);
  const [removendo, setRemovendo] = useState<number | null>(null);

  /**
   * Mostra snackbar
   */
  const mostrarSnackbar = useCallback((mensagem: string, tipo: EstadoSnackbar['tipo'] = 'info') => {
    setSnackbar({ visivel: true, mensagem, tipo });
  }, []);

  /**
   * Carrega favoritos iniciais
   */
  useEffect(() => {
    const carregarDados = async () => {
      try {
        setCarregando(true);

        console.log('[useDadosFavoritos] Carregando favoritos...');

        await servico.carregarFavoritos();

        console.log('[useDadosFavoritos] Favoritos carregados:', servico.totalItens);
      } catch (erro: any) {
        console.error('[useDadosFavoritos] Erro ao carregar:', erro);
        mostrarSnackbar('Erro ao carregar favoritos', 'error');
      } finally {
        setCarregando(false);
      }
    };

    carregarDados();
  }, [servico, mostrarSnackbar]);

  /**
   * Favoritos filtrados e ordenados
   */
  const favoritosFiltrados = useMemo(() => {
    let itens = servico.itens;

    // Aplica busca
    if (filtros.busca) {
      itens = servico.buscarPorNome(filtros.busca);
    }

    // Aplica categoria
    if (filtros.categoria && filtros.categoria !== 'todos') {
      itens = itens.filter((item) =>
        item.categoria?.toLowerCase() === filtros.categoria.toLowerCase()
      );
    }

    // Aplica ordenação
    return servico.ordenar(filtros.ordenacao, filtros.crescente);
  }, [servico.itens, filtros, servico]);

  /**
   * Estatísticas dos favoritos
   */
  const estatisticas = useMemo(() => {
    return {
      total: servico.totalItens,
      valorTotal: servico.calcularValorTotal(),
      recentes: servico.obterRecentes().length,
    };
  }, [servico]);

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
     * Navega para detalhes do produto
     */
    aoProdutoPress: useCallback((produtoId: number) => {
      router.push(`/product/${produtoId}`);
    }, []),

    /**
     * Remove favorito
     */
    aoRemoverFavorito: useCallback(async (produtoId: number) => {
      try {
        setRemovendo(produtoId);

        console.log('[useDadosFavoritos] Removendo favorito:', produtoId);

        await servico.removerFavorito(produtoId);

        mostrarSnackbar('Removido dos favoritos', 'success');
      } catch (erro: any) {
        console.error('[useDadosFavoritos] Erro ao remover:', erro);
        mostrarSnackbar(erro.message || 'Erro ao remover favorito', 'error');
      } finally {
        setRemovendo(null);
      }
    }, [servico, mostrarSnackbar]),

    /**
     * Adiciona aos favoritos (usado em outras telas)
     */
    aoAdicionarFavorito: useCallback(async (dados: {
      produtoId: number;
      produtoNome: string;
      produtoDescricao?: string;
      preco: number;
      farmaciaId: number;
      farmaciaNome: string;
      categoria?: string;
      tarja?: 'BRANCA' | 'VERMELHA' | 'AMARELA' | 'PRETA';
      imagemUrl?: string;
    }) => {
      try {
        console.log('[useDadosFavoritos] Adicionando favorito:', dados.produtoNome);

        await servico.adicionarFavorito(dados);

        mostrarSnackbar('Adicionado aos favoritos', 'success');
      } catch (erro: any) {
        console.error('[useDadosFavoritos] Erro ao adicionar:', erro);
        mostrarSnackbar(erro.message || 'Erro ao adicionar favorito', 'error');
      }
    }, [servico, mostrarSnackbar]),

    /**
     * Alterna favorito (adiciona ou remove)
     */
    aoAlternarFavorito: useCallback(async (dados: {
      produtoId: number;
      produtoNome: string;
      produtoDescricao?: string;
      preco: number;
      farmaciaId: number;
      farmaciaNome: string;
      categoria?: string;
      tarja?: 'BRANCA' | 'VERMELHA' | 'AMARELA' | 'PRETA';
      imagemUrl?: string;
    }) => {
      try {
        console.log('[useDadosFavoritos] Alternando favorito:', dados.produtoNome);

        const foiAdicionado = await servico.alternarFavorito(dados);

        if (foiAdicionado) {
          mostrarSnackbar('Adicionado aos favoritos', 'success');
        } else {
          mostrarSnackbar('Removido dos favoritos', 'info');
        }
      } catch (erro: any) {
        console.error('[useDadosFavoritos] Erro ao alternar:', erro);
        mostrarSnackbar(erro.message || 'Erro ao atualizar favorito', 'error');
      }
    }, [servico, mostrarSnackbar]),

    /**
     * Limpa todos os favoritos
     */
    aoLimparTodos: useCallback(async () => {
      try {
        console.log('[useDadosFavoritos] Limpando todos os favoritos...');

        await servico.limparTodos();

        mostrarSnackbar('Favoritos limpos', 'success');
      } catch (erro: any) {
        console.error('[useDadosFavoritos] Erro ao limpar:', erro);
        mostrarSnackbar('Erro ao limpar favoritos', 'error');
      }
    }, [servico, mostrarSnackbar]),

    /**
     * Atualiza busca
     */
    aoMudarBusca: useCallback((texto: string) => {
      setFiltros((prev) => ({ ...prev, busca: texto }));
    }, []),

    /**
     * Atualiza categoria
     */
    aoMudarCategoria: useCallback((categoria: string) => {
      setFiltros((prev) => ({ ...prev, categoria }));
    }, []),

    /**
     * Atualiza ordenação
     */
    aoMudarOrdenacao: useCallback((ordenacao: EstadoFiltros['ordenacao']) => {
      setFiltros((prev) => ({
        ...prev,
        ordenacao,
        crescente: prev.ordenacao === ordenacao ? !prev.crescente : true,
      }));
    }, []),

    /**
     * Fecha snackbar
     */
    aoFecharSnackbar: useCallback(() => {
      setSnackbar((prev) => ({ ...prev, visivel: false }));
    }, []),
  };

  /**
   * Verifica se produto está nos favoritos (útil para ícones em outras telas)
   */
  const estaNosFavoritos = useCallback((produtoId: number): boolean => {
    return servico.estaNosFavoritos(produtoId);
  }, [servico]);

  return {
    // Dados do serviço
    favoritos: favoritosFiltrados,
    estatisticas,

    // Estados da UI
    filtros: {
      busca: filtros.busca,
      categoria: filtros.categoria,
      ordenacao: filtros.ordenacao,
      crescente: filtros.crescente,
    },

    // Snackbar
    snackbar: {
      visivel: snackbar.visivel,
      mensagem: snackbar.mensagem,
      tipo: snackbar.tipo,
    },

    // Estados gerais
    carregando: carregando || servico.carregando,
    removendo,
    temFavoritos: servico.temFavoritos,
    estaVazio: servico.estaVazio,
    totalItens: servico.totalItens,

    // Manipuladores
    manipuladores,

    // Utilitários
    estaNosFavoritos,
    mostrarSnackbar,
  };
};
