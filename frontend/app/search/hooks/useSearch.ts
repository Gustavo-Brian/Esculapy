/**
 * Hook useSearch
 * Gerencia toda a lógica da tela de busca
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { router } from 'expo-router';
import { buscarTudo } from '@/src/servicos/busca/buscaService';
import { ProdutoHome, FarmaciaResponse } from '@/src/servicos/types/api.types';
import type {
  SearchResults,
  SearchTab,
  SearchCategory,
  SearchUIState,
  SearchHandlers,
} from '../types/search.types';

// Dados mockados para fallback
const PRODUTOS_MOCKADOS: ProdutoHome[] = [
  {
    id: 1,
    nome: 'Paracetamol 500mg',
    descricao: 'Analgésico e antitérmico',
    preco: 12.9,
    precoPromocional: 9.9,
    categoria: 'Analgésicos',
    imagem: null,
    emEstoque: true,
    farmaciaId: 1,
    farmaciaNome: 'Farmácia Central',
  },
  {
    id: 2,
    nome: 'Vitamina C 1000mg',
    descricao: 'Suplemento vitamínico',
    preco: 24.9,
    precoPromocional: null,
    categoria: 'Vitaminas',
    imagem: null,
    emEstoque: true,
    farmaciaId: 2,
    farmaciaNome: 'Drogaria Popular',
  },
  {
    id: 3,
    nome: 'Dipirona 500mg',
    descricao: 'Analgésico e antitérmico',
    preco: 8.5,
    precoPromocional: 6.9,
    categoria: 'Analgésicos',
    imagem: null,
    emEstoque: true,
    farmaciaId: 1,
    farmaciaNome: 'Farmácia Central',
  },
];

const FARMACIAS_MOCKADAS: FarmaciaResponse[] = [
  {
    id: 1,
    nome: 'Farmácia Central',
    razaoSocial: 'Farmácia Central Ltda',
    cnpj: '12.345.678/0001-90',
    telefone: '(11) 1234-5678',
    email: 'contato@farmaciacentral.com.br',
    endereco: {
      logradouro: 'Rua Principal',
      numero: '123',
      complemento: null,
      bairro: 'Centro',
      cidade: 'São Paulo',
      estado: 'SP',
      cep: '01234-567',
    },
  },
  {
    id: 2,
    nome: 'Drogaria Popular',
    razaoSocial: 'Drogaria Popular S/A',
    cnpj: '98.765.432/0001-10',
    telefone: '(11) 9876-5432',
    email: 'contato@drogariapopular.com.br',
    endereco: {
      logradouro: 'Av. Comercial',
      numero: '456',
      complemento: 'Loja 1',
      bairro: 'Jardim',
      cidade: 'São Paulo',
      estado: 'SP',
      cep: '09876-543',
    },
  },
];

export const CATEGORIAS: SearchCategory[] = [
  { id: 'analgesicos', nome: 'Analgésicos', icone: 'medkit', cor: '#EF4444' },
  { id: 'vitaminas', nome: 'Vitaminas', icone: 'fitness', cor: '#10B981' },
  { id: 'antibioticos', nome: 'Antibióticos', icone: 'shield-checkmark', cor: '#3B82F6' },
  { id: 'dermocosmeticos', nome: 'Dermocosmét.', icone: 'water', cor: '#8B5CF6' },
  { id: 'higiene', nome: 'Higiene', icone: 'sparkles', cor: '#06B6D4' },
  { id: 'infantil', nome: 'Infantil', icone: 'happy', cor: '#F59E0B' },
];

export const useSearch = () => {
  // Estado de UI
  const [uiState, setUiState] = useState<SearchUIState>({
    termoBusca: '',
    abaAtiva: 'produtos',
    categoriaAtiva: null,
    loading: false,
  });

  // Resultados da busca
  const [resultados, setResultados] = useState<SearchResults>({
    produtos: [],
    farmacias: [],
  });

  // Refs
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Realizar busca na API
   */
  const realizarBusca = useCallback(async (termo: string) => {
    try {
      setUiState((prev) => ({ ...prev, loading: true }));
      const resultado = await buscarTudo(termo);

      // Se não houver resultados da API, usa mockados filtrados
      if (resultado.produtos.length === 0 && resultado.farmacias.length === 0) {
        const termoLower = termo.toLowerCase();
        const produtosFiltrados = PRODUTOS_MOCKADOS.filter(
          (p) =>
            p.nome.toLowerCase().includes(termoLower) ||
            p.descricao.toLowerCase().includes(termoLower)
        );
        const farmaciasFiltradas = FARMACIAS_MOCKADAS.filter((f) =>
          f.nome.toLowerCase().includes(termoLower)
        );
        setResultados({
          produtos: produtosFiltrados,
          farmacias: farmaciasFiltradas,
        });
      } else {
        setResultados(resultado);
      }
    } catch (error) {
      console.error('Erro na busca:', error);
      // Em caso de erro, usa mockados
      const termoLower = termo.toLowerCase();
      const produtosFiltrados = PRODUTOS_MOCKADOS.filter(
        (p) =>
          p.nome.toLowerCase().includes(termoLower) ||
          p.descricao.toLowerCase().includes(termoLower)
      );
      const farmaciasFiltradas = FARMACIAS_MOCKADAS.filter((f) =>
        f.nome.toLowerCase().includes(termoLower)
      );
      setResultados({
        produtos: produtosFiltrados,
        farmacias: farmaciasFiltradas,
      });
    } finally {
      setUiState((prev) => ({ ...prev, loading: false }));
    }
  }, []);

  /**
   * Busca com debounce
   */
  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (uiState.termoBusca.trim().length === 0) {
      setResultados({ produtos: [], farmacias: [] });
      return;
    }

    // Debounce de 500ms
    timeoutRef.current = setTimeout(() => {
      realizarBusca(uiState.termoBusca);
    }, 500);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [uiState.termoBusca, realizarBusca]);

  /**
   * Handlers
   */
  const handleChangeSearchTerm = useCallback((termo: string) => {
    setUiState((prev) => ({ ...prev, termoBusca: termo }));
  }, []);

  const handleChangeTab = useCallback((aba: SearchTab) => {
    setUiState((prev) => ({ ...prev, abaAtiva: aba }));
  }, []);

  const handleSelectCategory = useCallback((categoriaId: string) => {
    const categoria = CATEGORIAS.find((c) => c.id === categoriaId);
    if (categoria) {
      setUiState((prev) => ({
        ...prev,
        termoBusca: categoria.nome,
        categoriaAtiva: categoriaId,
      }));
    }
  }, []);

  const handleClearSearch = useCallback(() => {
    setUiState({
      termoBusca: '',
      abaAtiva: 'produtos',
      categoriaAtiva: null,
      loading: false,
    });
    setResultados({ produtos: [], farmacias: [] });
  }, []);

  const handleBackPress = useCallback(() => {
    router.back();
  }, []);

  const handleProductPress = useCallback((produtoId: number) => {
    router.push(`/product/${produtoId}`);
  }, []);

  const handlePharmacyPress = useCallback((farmaciaId: number) => {
    router.push(`/seller/${farmaciaId}`);
  }, []);

  // Handlers agrupados
  const handlers: SearchHandlers = {
    onChangeSearchTerm: handleChangeSearchTerm,
    onChangeTab: handleChangeTab,
    onSelectCategory: handleSelectCategory,
    onClearSearch: handleClearSearch,
    onBackPress: handleBackPress,
    onProductPress: handleProductPress,
    onPharmacyPress: handlePharmacyPress,
  };

  return {
    uiState,
    resultados,
    categorias: CATEGORIAS,
    handlers,
  };
};
