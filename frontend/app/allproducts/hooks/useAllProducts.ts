/**
 * Hook useAllProducts
 * Gerencia toda a lógica da tela de todos os produtos
 */

import { useState, useCallback, useMemo, useEffect } from 'react';
import { Alert } from 'react-native';
import { router } from 'expo-router';
import { temaMedico } from '@/src/estilos/temaMedico';
import { buscarProdutosComOfertas } from '@/src/servicos/publico/publicoService';
import { useCart } from '@/src/hooks/useCart';
import type { CatalogoResponse, EstoqueResponse } from '@/src/servicos/types/api.types';
import type {
  Product,
  ProductsStats,
  AllProductsHandlers,
} from '../types/allproducts.types';

// Tipo estendido para incluir dados da oferta e catálogo
type ProductWithOffer = Product & {
  ofertaSelecionada?: EstoqueResponse;
  catalogoData?: {
    tipoProduto: 'MEDICAMENTO' | 'CORRELATO';
    tipoReceita: 'NAO_EXIGIDO' | 'RECEITA_BRANCA' | 'RECEITA_AZUL' | 'RECEITA_AMARELA';
    principioAtivo?: string | null;
    laboratorio?: string | null;
  };
};

export const useAllProducts = () => {
  const [products, setProducts] = useState<ProductWithOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [produtoSelecionado, setProdutoSelecionado] = useState<ProductWithOffer | null>(null);
  const { adicionarAoCarrinho } = useCart();

  /**
   * Carrega produtos da API
   */
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      console.log('[AllProducts] Carregando produtos...');

      const produtosComOfertas = await buscarProdutosComOfertas();

      // Converte para formato Product
      const produtosFormatados: ProductWithOffer[] = produtosComOfertas.map((produto) => {
        // Ordena ofertas por preço (menor primeiro)
        const ofertasOrdenadas = [...produto.ofertas].sort((a, b) => a.preco - b.preco);

        // Pega a melhor oferta (menor preço)
        const melhorOferta = ofertasOrdenadas[0];
        const vendedor = melhorOferta?.farmaciaRazaoSocial || 'Farmácia';

        // Define ícone e cor baseado no tipo de produto
        let icone: string = 'medical';
        let cor: string = temaMedico.cores.cardRoxo;

        if (produto.tipoProduto === 'CORRELATO') {
          icone = 'fitness';
          cor = temaMedico.cores.cardVerde;
        }

        return {
          id: produto.id,
          nome: produto.nome,
          vendedor,
          avaliacao: 4.5, // Mock por enquanto
          preco: melhorOferta.preco,
          icone,
          cor,
          ofertaSelecionada: melhorOferta, // Guardar dados completos da oferta
          catalogoData: {
            tipoProduto: produto.tipoProduto,
            tipoReceita: produto.tipoReceita,
            principioAtivo: produto.principioAtivo,
            laboratorio: produto.laboratorio,
          },
        };
      });

      setProducts(produtosFormatados);
      console.log('[AllProducts] ✅ Produtos carregados:', produtosFormatados.length);
    } catch (error) {
      console.error('[AllProducts] Erro ao carregar produtos:', error);
      // Mantém produtos mockados em caso de erro
      setProducts([
    {
      id: 1,
      nome: 'Paracetamol 500mg',
      vendedor: 'Farmácia Central',
      avaliacao: 4.8,
      preco: 15.9,
      icone: 'medical',
      cor: temaMedico.cores.cardRoxo,
    },
    {
      id: 2,
      nome: 'Vitamina C',
      vendedor: 'Drogaria Saúde',
      avaliacao: 4.9,
      preco: 29.99,
      icone: 'fitness',
      cor: temaMedico.cores.cardVerde,
    },
    {
      id: 3,
      nome: 'Protetor Solar FPS 50',
      vendedor: 'Pharma Bem-Estar',
      avaliacao: 4.7,
      preco: 54.5,
      icone: 'sunny',
      cor: temaMedico.cores.cardAmarelo,
    },
    {
      id: 4,
      nome: 'Curativos (10 un)',
      vendedor: 'Farmácia Central',
      avaliacao: 4.6,
      preco: 8.0,
      icone: 'bandage',
      cor: temaMedico.cores.cardAzul,
    },
    {
      id: 5,
      nome: 'Ibuprofeno 400mg',
      vendedor: 'Pharma Bem-Estar',
      avaliacao: 4.9,
      preco: 22.3,
      icone: 'medical',
      cor: temaMedico.cores.cardRoxo,
    },
        {
          id: 6,
          nome: 'Xarope para Tosse',
          vendedor: 'Drogaria Saúde',
          avaliacao: 4.5,
          preco: 35.0,
          icone: 'water',
          cor: temaMedico.cores.cardVerde,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Produtos filtrados pela busca
   */
  const filteredProducts = useMemo(() => {
    if (!searchTerm.trim()) {
      return products;
    }

    const termo = searchTerm.toLowerCase().trim();
    return products.filter((produto) => {
      const nome = produto.nome.toLowerCase();
      const vendedor = produto.vendedor.toLowerCase();
      return nome.includes(termo) || vendedor.includes(termo);
    });
  }, [products, searchTerm]);

  /**
   * Calcula estatísticas
   */
  const stats = useMemo<ProductsStats>(() => {
    const uniqueStores = new Set(filteredProducts.map((p) => p.vendedor));
    return {
      totalProducts: filteredProducts.length,
      totalStores: uniqueStores.size,
    };
  }, [filteredProducts]);

  /**
   * Handler para voltar
   */
  const handleBackPress = useCallback(() => {
    router.back();
  }, []);

  /**
   * Handler para abrir produto
   */
  const handleProductPress = useCallback((id: number) => {
    router.push(`/product/${id}`);
  }, []);

  /**
   * Handler para adicionar ao carrinho - Abre modal
   */
  const handleAddToCart = useCallback((product: ProductWithOffer) => {
    console.log('[AllProducts] handleAddToCart chamado para produto:', product.nome);
    setProdutoSelecionado(product);
    setModalVisible(true);
    console.log('[AllProducts] Modal deve estar visível agora');
  }, []);

  /**
   * Handler para confirmar adição ao carrinho (do modal)
   */
  const handleConfirmAddToCart = useCallback(async (quantidade: number) => {
    if (!produtoSelecionado?.ofertaSelecionada) {
      Alert.alert('Erro', 'Produto não selecionado');
      return;
    }

    // Adicionar múltiplas vezes baseado na quantidade
    for (let i = 0; i < quantidade; i++) {
      await adicionarAoCarrinho(produtoSelecionado.ofertaSelecionada);
    }

    setModalVisible(false);

    Alert.alert(
      '✅ Produto Adicionado',
      `${quantidade}x ${produtoSelecionado.nome} adicionado ao carrinho!`,
      [
        { text: 'Continuar Comprando', style: 'cancel' },
        {
          text: 'Ir para o Carrinho',
          onPress: () => router.push('/cart'),
        },
      ]
    );
  }, [produtoSelecionado, adicionarAoCarrinho]);

  /**
   * Handler para fechar modal
   */
  const handleCloseModal = useCallback(() => {
    setModalVisible(false);
    setProdutoSelecionado(null);
  }, []);

  /**
   * Handler para busca
   */
  const handleSearch = useCallback((text: string) => {
    setSearchTerm(text);
  }, []);

  /**
   * Handler para limpar busca
   */
  const handleClearSearch = useCallback(() => {
    setSearchTerm('');
  }, []);

  // Handlers agrupados
  const handlers: AllProductsHandlers = {
    onBackPress: handleBackPress,
    onProductPress: handleProductPress,
    onAddToCart: handleAddToCart,
  };

  return {
    products: filteredProducts,
    stats,
    handlers,
    loading,
    searchTerm,
    onSearch: handleSearch,
    onClearSearch: handleClearSearch,
    // Modal
    modalVisible,
    produtoSelecionado,
    onConfirmAddToCart: handleConfirmAddToCart,
    onCloseModal: handleCloseModal,
  };
};
