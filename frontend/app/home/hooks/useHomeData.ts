/**
 * Hook useHomeData - Esculapi
 * Centraliza toda a lógica de negócio da home
 * Separa lógica da apresentação (separation of concerns)
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { getProdutosHome } from '@/src/servicos/produtos/produtoService';
import { listarFarmacias } from '@/src/servicos/farmacia/farmaciaService';
import { useToast } from '@/src/hooks/useToast';
import { temaMedico } from '@/src/estilos/temaMedico';
import type {
  HomeData,
  HomeLoadingState,
  ProdutoHome,
  OfertaHome,
  FarmaciaHome,
  Categoria,
} from '../types/home.types';

/**
 * Dados mockados para fallback
 */
const DADOS_MOCKADOS: HomeData = {
  ofertas: [
    {
      id: 1,
      nome: 'Analgésico Forte',
      precoAntigo: 15.0,
      preco: 9.99,
      desconto: 33,
      icone: 'medical',
      cor: temaMedico.cores.cardRoxo,
      categoria: 'medicamentos',
    },
    {
      id: 2,
      nome: 'Sabonete Líquido',
      precoAntigo: 22.5,
      preco: 18.0,
      desconto: 20,
      icone: 'water',
      cor: temaMedico.cores.cardAzul,
      categoria: 'higiene',
    },
    {
      id: 3,
      nome: 'Complexo Vitamínico',
      precoAntigo: 45.9,
      preco: 35.9,
      desconto: 22,
      icone: 'fitness',
      cor: temaMedico.cores.cardVerde,
      categoria: 'vitaminas',
    },
  ],
  produtos: [
    { id: 1, nome: 'Paracetamol', descricao: '500mg - 20 comprimidos', preco: 12.9, icone: 'medical', cor: temaMedico.cores.cardRoxo, avaliacao: 4.8, categoria: 'medicamentos' },
    { id: 2, nome: 'Shampoo Anticaspa', descricao: 'Head & Shoulders 400ml', preco: 18.5, icone: 'water', cor: temaMedico.cores.cardAzul, avaliacao: 4.6, categoria: 'higiene' },
    { id: 3, nome: 'Vitamina C', descricao: '1000mg - 60 cápsulas', preco: 24.9, icone: 'fitness', cor: temaMedico.cores.cardVerde, avaliacao: 4.9, categoria: 'vitaminas' },
    { id: 4, nome: 'Protetor Solar', descricao: 'FPS 60 - 120ml', preco: 35.9, icone: 'sunny', cor: temaMedico.cores.cardAmarelo, avaliacao: 4.7, categoria: 'cosmeticos' },
    { id: 5, nome: 'Dipirona', descricao: '500mg - 20 comprimidos', preco: 8.9, icone: 'medical', cor: temaMedico.cores.cardRoxo, avaliacao: 4.7, categoria: 'medicamentos' },
    { id: 6, nome: 'Fralda Infantil', descricao: 'Pampers - Pacote M', preco: 42.9, icone: 'heart', cor: temaMedico.cores.cardAmarelo, avaliacao: 4.8, categoria: 'bebe' },
  ],
  farmacias: [
    { id: 1, nome: 'Farmácia SaúdeBem', status: 'Aberto 24h', icone: 'storefront', cor: temaMedico.cores.cardRoxo, avaliacao: 4.8 },
    { id: 2, nome: 'Drogaria Central', status: 'Entrega rápida', icone: 'business', cor: temaMedico.cores.cardVerde, avaliacao: 4.7 },
    { id: 3, nome: 'BemEstar Farma', status: 'Cosméticos e mais', icone: 'medical', cor: temaMedico.cores.cardAzul, avaliacao: 4.9 },
    { id: 4, nome: 'Pharma Express', status: 'Atendimento 24/7', icone: 'flash', cor: temaMedico.cores.cardAmarelo, avaliacao: 4.6 },
  ],
};

/**
 * Categorias disponíveis
 */
export const CATEGORIAS: Categoria[] = [
  { id: 'todos', nome: 'Todos', icone: 'apps', cor: temaMedico.cores.primaria },
  { id: 'medicamentos', nome: 'Medicamentos', icone: 'medical', cor: temaMedico.cores.cardRoxo },
  { id: 'cosmeticos', nome: 'Cosméticos', icone: 'sparkles', cor: temaMedico.cores.cardVerde },
  { id: 'higiene', nome: 'Higiene', icone: 'water', cor: temaMedico.cores.cardAzul },
  { id: 'bebe', nome: 'Bebê', icone: 'heart', cor: temaMedico.cores.cardAmarelo },
  { id: 'vitaminas', nome: 'Vitaminas', icone: 'fitness', cor: temaMedico.cores.cardRoxo },
];

/**
 * Mapeia produto da API para formato da home
 */
const mapearProduto = (produto: any): ProdutoHome => ({
  id: produto.id,
  nome: produto.name || produto.nome,
  descricao: produto.description || produto.descricao || '',
  preco: produto.price || produto.preco || 0,
  icone: 'medical', // TODO: mapear por categoria
  cor: temaMedico.cores.cardRoxo, // TODO: mapear por categoria
  avaliacao: produto.rating || produto.avaliacao || 4.5,
  categoria: produto.category || produto.categoria || 'medicamentos',
});

/**
 * Mapeia oferta da API para formato da home
 */
const mapearOferta = (oferta: any): OfertaHome => ({
  id: oferta.id,
  nome: oferta.name || oferta.nome,
  precoAntigo: oferta.originalPrice || oferta.precoAntigo || (oferta.price || oferta.preco) * 1.3,
  preco: oferta.price || oferta.preco || 0,
  desconto: oferta.discount || oferta.desconto || 20,
  icone: 'pricetag',
  cor: temaMedico.cores.secundaria,
  categoria: oferta.category || oferta.categoria || 'medicamentos',
});

/**
 * Mapeia farmácia da API para formato da home
 */
const mapearFarmacia = (farmacia: any): FarmaciaHome => ({
  id: farmacia.id,
  nome: farmacia.nome || farmacia.name,
  status: farmacia.aberta ? 'Aberto agora' : 'Fechado',
  icone: 'storefront',
  cor: farmacia.cor || temaMedico.cores.cardVerde,
  avaliacao: farmacia.avaliacaoMedia || farmacia.rating || 4.5,
});

/**
 * Hook principal da home
 */
export const useHomeData = () => {
  // Estados
  const [data, setData] = useState<HomeData>(DADOS_MOCKADOS);
  const [loading, setLoading] = useState<HomeLoadingState>({
    initial: false,
    refreshing: false,
  });
  const [categoriaAtiva, setCategoriaAtiva] = useState<string>('todos');

  // Toast
  const { showError } = useToast();

  /**
   * Carrega dados da API
   */
  const carregarDados = useCallback(async (isRefresh = false) => {
    try {
      // Atualiza estado de loading
      setLoading({
        initial: !isRefresh,
        refreshing: isRefresh,
      });

      console.log('[useHomeData] Carregando dados da API...');

      // Busca dados em paralelo
      const [produtosData, farmaciasResponse] = await Promise.all([
        getProdutosHome(),
        listarFarmacias({ limit: 10, apenasAbertas: true }),
      ]);

      console.log('[useHomeData] Dados recebidos:', {
        produtos: produtosData.produtos.length,
        ofertas: produtosData.ofertas.length,
        farmacias: farmaciasResponse.data.length,
      });

      // Mapeia dados
      const produtosMapeados = produtosData.produtos.map(mapearProduto);
      const ofertasMapeadas = produtosData.ofertas.map(mapearOferta);
      const farmaciasMapeadas = farmaciasResponse.data.map(mapearFarmacia);

      // Atualiza estado com dados reais ou fallback
      setData({
        produtos: produtosMapeados.length > 0 ? produtosMapeados : DADOS_MOCKADOS.produtos,
        ofertas: ofertasMapeadas.length > 0 ? ofertasMapeadas : DADOS_MOCKADOS.ofertas,
        farmacias: farmaciasMapeadas.length > 0 ? farmaciasMapeadas : DADOS_MOCKADOS.farmacias,
      });

      console.log('[useHomeData] Dados carregados com sucesso');
    } catch (error) {
      console.error('[useHomeData] Erro ao carregar dados:', error);

      // Fallback para dados mockados
      setData(DADOS_MOCKADOS);

      if (!isRefresh) {
        showError('Alguns dados podem estar desatualizados.');
      }
    } finally {
      setLoading({ initial: false, refreshing: false });
    }
  }, [showError]);

  /**
   * Produtos filtrados por categoria
   */
  const produtosFiltrados = useMemo(() => {
    if (categoriaAtiva === 'todos') {
      return data.produtos;
    }
    return data.produtos.filter(p => p.categoria === categoriaAtiva);
  }, [data.produtos, categoriaAtiva]);

  /**
   * Handler de refresh
   */
  const handleRefresh = useCallback(async () => {
    await carregarDados(true);
  }, [carregarDados]);

  /**
   * Handler de seleção de categoria
   */
  const handleCategoriaSelect = useCallback((categoriaId: string) => {
    setCategoriaAtiva(categoriaId);
  }, []);

  // Carrega dados na montagem
  useEffect(() => {
    carregarDados(false);
  }, [carregarDados]);

  return {
    // Dados
    data,
    produtosFiltrados,
    categorias: CATEGORIAS,
    categoriaAtiva,

    // Loading states
    loading,

    // Handlers
    handleRefresh,
    handleCategoriaSelect,
  };
};
