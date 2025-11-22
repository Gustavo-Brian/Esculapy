/**
 * Hook useCompare
 */

import { useCallback, useMemo } from 'react';
import { Alert } from 'react-native';
import { router } from 'expo-router';
import type { CompareProduct, CompareStats, CompareHandlers } from '../types/compare.types';

const MOCK_PRODUCT: CompareProduct = {
  nome: 'Paracetamol 500mg',
  descricao: '20 comprimidos',
  ofertas: [
    {
      id: 1,
      farmacia: 'Farmácia Central',
      nota: 4.8,
      distancia: '2.5 km',
      preco: 12.9,
      precoAntigo: 18.9,
      economia: 6.0,
      entrega: 'Grátis',
      tempoEntrega: '30-40 min',
      estoque: 15,
      verificada: true,
      melhorPreco: true,
    },
    {
      id: 2,
      farmacia: 'Drogaria Popular',
      nota: 4.6,
      distancia: '3.2 km',
      preco: 14.9,
      economia: 0,
      entrega: 'R$ 5,00',
      tempoEntrega: '35-45 min',
      estoque: 8,
      verificada: true,
      melhorPreco: false,
    },
    {
      id: 3,
      farmacia: 'Farmácia São Paulo',
      nota: 4.9,
      distancia: '1.8 km',
      preco: 15.9,
      economia: 0,
      entrega: 'R$ 3,50',
      tempoEntrega: '25-35 min',
      estoque: 20,
      verificada: true,
      melhorPreco: false,
    },
  ],
};

export const useCompare = () => {
  const produto = MOCK_PRODUCT;

  const stats = useMemo<CompareStats>(() => {
    const precos = produto.ofertas.map((o) => o.preco);
    return {
      menorPreco: Math.min(...precos),
      maiorPreco: Math.max(...precos),
      precoMedio: precos.reduce((a, b) => a + b, 0) / precos.length,
      economiaMaxima: Math.max(...produto.ofertas.map((o) => o.economia)),
    };
  }, [produto.ofertas]);

  const handleBackPress = useCallback(() => {
    router.back();
  }, []);

  const handleSelectOffer = useCallback((offerId: number) => {
    const oferta = produto.ofertas.find((o) => o.id === offerId);
    if (oferta) {
      Alert.alert(
        'Adicionar ao Carrinho',
        `Deseja adicionar ${produto.nome} de ${oferta.farmacia} por R$ ${oferta.preco.toFixed(2)}?`,
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Adicionar',
            onPress: () => {
              Alert.alert('Sucesso', 'Produto adicionado ao carrinho!');
            },
          },
        ]
      );
    }
  }, [produto]);

  const handlePharmacyPress = useCallback((farmacia: string) => {
    console.log('Ver farmácia:', farmacia);
  }, []);

  const handlers: CompareHandlers = {
    onBackPress: handleBackPress,
    onSelectOffer: handleSelectOffer,
    onPharmacyPress: handlePharmacyPress,
  };

  return {
    produto,
    stats,
    handlers,
  };
};
