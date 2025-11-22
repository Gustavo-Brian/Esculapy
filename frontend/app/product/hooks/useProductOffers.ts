/**
 * Hook useProductOffers
 * Busca todas as ofertas (estoques) de um produto em diferentes farmácias
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useLocalSearchParams, router } from 'expo-router';
import { Alert } from 'react-native';
import { buscarEstoquePorCatalogo, buscarProdutoCatalogo, buscarFarmaciaPublica } from '@/src/servicos/publico/publicoService';
import type { EstoqueResponse, CatalogoResponse } from '@/src/servicos/types/api.types';
import type { FarmaciaPublica } from '@/src/servicos/publico/publicoService';
import { useCart } from '@/src/hooks/useCart';

export interface ProductOffer {
  estoqueId: number;
  farmaciaId: number;
  farmaciaNome: string;
  preco: number;
  quantidade: number;
  ativo: boolean;
  distancia?: string; // Mock por enquanto
  tempoEntrega?: string; // Mock por enquanto
  avaliacao?: number; // Mock por enquanto
}

export const useProductOffers = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { adicionarAoCarrinho } = useCart();

  const [produto, setProduto] = useState<CatalogoResponse | null>(null);
  const [ofertas, setOfertas] = useState<ProductOffer[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [buscaFarmacia, setBuscaFarmacia] = useState('');

  // Estado do modal de quantidade
  const [modalQuantidadeVisivel, setModalQuantidadeVisivel] = useState(false);
  const [ofertaSelecionada, setOfertaSelecionada] = useState<ProductOffer | null>(null);

  /**
   * Carrega produto e todas as suas ofertas
   */
  useEffect(() => {
    const carregar = async () => {
      try {
        setCarregando(true);
        setErro(null);

        if (!id) {
          throw new Error('ID do produto não fornecido');
        }

        const catalogoId = Number(id);
        console.log('[useProductOffers] Carregando produto:', catalogoId);

        // Busca informações do produto
        const produtoData = await buscarProdutoCatalogo(catalogoId);
        setProduto(produtoData);

        // Busca todas as ofertas deste produto
        const estoquesData = await buscarEstoquePorCatalogo(catalogoId);
        console.log('[useProductOffers] Ofertas encontradas:', estoquesData.length);

        // Busca informações das farmácias em paralelo
        const ofertasComFarmacia = await Promise.all(
          estoquesData.map(async (estoque, index) => {
            try {
              const farmacia = await buscarFarmaciaPublica(estoque.farmaciaId);

              // DEBUG: Log dos campos de ativação
              const estoqueAtivo = estoque.ativo !== false; // Se undefined, considera true
              const farmaciaAtiva = farmacia.ativo !== false; // Se undefined, considera true

              console.log(`[useProductOffers] 🏥 Farmácia "${farmacia.nomeFantasia}":`, {
                estoqueAtivoOriginal: estoque.ativo,
                farmaciaAtivoOriginal: farmacia.ativo,
                estoqueAtivo,
                farmaciaAtiva,
                resultado: estoqueAtivo && farmaciaAtiva,
              });

              return {
                estoqueId: estoque.estoqueId,
                farmaciaId: estoque.farmaciaId,
                farmaciaNome: farmacia.nomeFantasia,
                preco: estoque.preco,
                quantidade: estoque.quantidade,
                ativo: estoqueAtivo && farmaciaAtiva,
                // Mocks temporários
                distancia: `${(Math.random() * 5 + 0.5).toFixed(1)} km`,
                tempoEntrega: farmacia.status === 'ATIVA' ? '30-45 min' : 'Fechada',
                avaliacao: 4.5 + (Math.random() * 0.5),
              };
            } catch (error) {
              console.warn('[useProductOffers] Erro ao buscar farmácia:', estoque.farmaciaId, error);
              return {
                estoqueId: estoque.estoqueId,
                farmaciaId: estoque.farmaciaId,
                farmaciaNome: 'Farmácia desconhecida',
                preco: estoque.preco,
                quantidade: estoque.quantidade,
                ativo: estoque.ativo,
                distancia: '-- km',
                tempoEntrega: '--',
                avaliacao: 0,
              };
            }
          })
        );

        setOfertas(ofertasComFarmacia);
      } catch (error: any) {
        console.error('[useProductOffers] Erro ao carregar:', error);
        setErro(error.message || 'Erro ao carregar produto');
      } finally {
        setCarregando(false);
      }
    };

    carregar();
  }, [id]);

  /**
   * Filtra ofertas por nome da farmácia
   */
  const ofertasFiltradas = useMemo(() => {
    if (!buscaFarmacia.trim()) return ofertas;

    return ofertas.filter((oferta) =>
      oferta.farmaciaNome.toLowerCase().includes(buscaFarmacia.toLowerCase())
    );
  }, [ofertas, buscaFarmacia]);

  /**
   * Ordena ofertas por menor preço
   */
  const ofertasOrdenadas = useMemo(() => {
    return [...ofertasFiltradas].sort((a, b) => a.preco - b.preco);
  }, [ofertasFiltradas]);

  /**
   * Estatísticas
   */
  const stats = useMemo(() => {
    if (ofertas.length === 0) {
      return {
        menorPreco: 0,
        maiorPreco: 0,
        precoMedio: 0,
        totalOfertas: 0,
      };
    }

    const precos = ofertas.map((o) => o.preco);
    const menorPreco = Math.min(...precos);
    const maiorPreco = Math.max(...precos);
    const precoMedio = precos.reduce((a, b) => a + b, 0) / precos.length;

    return {
      menorPreco,
      maiorPreco,
      precoMedio,
      totalOfertas: ofertas.length,
    };
  }, [ofertas]);

  /**
   * Handlers
   */
  const handleSearch = useCallback((text: string) => {
    setBuscaFarmacia(text);
  }, []);

  const handleOfferPress = useCallback((farmaciaId: number) => {
    router.push(`/seller/${farmaciaId}`);
  }, []);

  const handleBackPress = useCallback(() => {
    router.back();
  }, []);

  const handleAddToCart = useCallback((offer: ProductOffer) => {
    // Valida se o produto está disponível
    if (!offer.ativo || offer.quantidade === 0) {
      Alert.alert(
        'Produto Indisponível',
        'Este produto não está disponível no momento.'
      );
      return;
    }

    // Abre o modal de seleção de quantidade
    setOfertaSelecionada(offer);
    setModalQuantidadeVisivel(true);
  }, []);

  const handleConfirmarQuantidade = useCallback(async (quantidade: number) => {
    if (!ofertaSelecionada || !produto) return;

    try {
      console.log('[useProductOffers] Adicionar ao carrinho:', {
        produto: produto.nome,
        farmacia: ofertaSelecionada.farmaciaNome,
        preco: ofertaSelecionada.preco,
        quantidade,
        estoqueId: ofertaSelecionada.estoqueId,
      });

      // Converte ProductOffer para EstoqueResponse
      const estoqueData: EstoqueResponse = {
        estoqueId: ofertaSelecionada.estoqueId,
        produtoId: produto.id,
        produtoNome: produto.nome,
        produtoDescricao: produto.descricao || null,
        preco: ofertaSelecionada.preco,
        quantidade: quantidade, // Usa a quantidade selecionada
        ativo: ofertaSelecionada.ativo,
        farmaciaId: ofertaSelecionada.farmaciaId,
        farmaciaRazaoSocial: ofertaSelecionada.farmaciaNome,
        farmaciaEndereco: null,
        farmaciaDistancia: null,
      };

      // Adiciona ao carrinho usando o hook global
      const sucesso = await adicionarAoCarrinho(estoqueData, quantidade);

      if (sucesso) {
        const total = ofertaSelecionada.preco * quantidade;
        Alert.alert(
          'Produto Adicionado! 🛒',
          `${quantidade}x "${produto.nome}" adicionado ao carrinho.\n\nFarmácia: ${ofertaSelecionada.farmaciaNome}\nTotal: R$ ${total.toFixed(2).replace('.', ',')}`,
          [
            {
              text: 'Continuar Comprando',
              style: 'cancel',
            },
            {
              text: 'Ver Carrinho',
              onPress: () => router.push('/cart'),
            },
          ]
        );
      } else {
        Alert.alert(
          'Erro',
          'Não foi possível adicionar o produto ao carrinho. Tente novamente.'
        );
      }
    } catch (error: any) {
      console.error('[useProductOffers] Erro ao adicionar ao carrinho:', error);
      Alert.alert(
        'Erro',
        error.message || 'Não foi possível adicionar o produto ao carrinho.'
      );
    }
  }, [ofertaSelecionada, produto, adicionarAoCarrinho]);

  const handleFecharModal = useCallback(() => {
    setModalQuantidadeVisivel(false);
    setOfertaSelecionada(null);
  }, []);

  return {
    produto,
    ofertas: ofertasOrdenadas,
    carregando,
    erro,
    stats,
    buscaFarmacia,
    handleSearch,
    handleOfferPress,
    handleAddToCart,
    handleBackPress,
    // Modal de quantidade
    modalQuantidadeVisivel,
    ofertaSelecionada,
    handleConfirmarQuantidade,
    handleFecharModal,
  };
};
