/**
 * Hook useSellers
 * Gerencia lógica da lista de farmácias
 */

import { useState, useCallback, useMemo, useEffect } from 'react';
import { router } from 'expo-router';
import { listarFarmaciasPublicas } from '@/src/servicos/publico/publicoService';
import type { FarmaciaPublica } from '@/src/servicos/publico/publicoService';
import type { Pharmacy, FilterOption, SellersUIState, SellersHandlers } from '../types/sellers.types';

// Cores para capas (rotacionadas)
const CORES_CAPA = [
  'rgba(59, 130, 246, 0.2)',   // Azul
  'rgba(16, 185, 129, 0.2)',   // Verde
  'rgba(139, 92, 246, 0.2)',   // Roxo
  'rgba(245, 158, 11, 0.2)',   // Laranja
  'rgba(236, 72, 153, 0.2)',   // Rosa
];

// Ícones para farmácias (rotacionados)
const ICONES = ['medical', 'fitness', 'storefront', 'flask', 'bandage'];

export const FILTROS: FilterOption[] = [
  { id: 'proximidade', nome: 'Mais próximas', icone: 'location' },
  { id: 'avaliacao', nome: 'Melhor avaliadas', icone: 'star' },
  { id: 'entrega', nome: 'Entrega mais rápida', icone: 'time' },
  { id: 'preco', nome: 'Melhores preços', icone: 'pricetag' },
];

/**
 * Converte FarmaciaPublica para Pharmacy
 */
const converterFarmacia = (farmacia: FarmaciaPublica, index: number): Pharmacy => {
  // TODO: Quando backend implementar avaliações e distância, usar valores reais
  return {
    id: farmacia.id,
    nome: farmacia.nomeFantasia,
    avaliacao: 4.5 + (Math.random() * 0.5), // Mock temporário
    totalAvaliacoes: Math.floor(Math.random() * 300) + 50, // Mock temporário
    distancia: `${(Math.random() * 5 + 0.5).toFixed(1)} km`, // Mock temporário
    tempoEntrega: farmacia.status === 'ATIVA' ? '30-45 min' : 'Fechada', // Mock temporário
    produtos: 0, // Será atualizado quando buscar estoque
    verificada: farmacia.ativo,
    fechada: farmacia.status !== 'ATIVA',
    icone: ICONES[index % ICONES.length],
    corCapa: CORES_CAPA[index % CORES_CAPA.length],
    tags: farmacia.ativo ? ['Verificada'] : [],
  };
};

export const useSellers = () => {
  const [uiState, setUiState] = useState<SellersUIState>({
    busca: '',
    filtroAtivo: 'proximidade',
  });
  const [farmacias, setFarmacias] = useState<Pharmacy[]>([]);
  const [carregando, setCarregando] = useState(true);

  /**
   * Carrega farmácias da API
   */
  useEffect(() => {
    const carregarFarmacias = async () => {
      try {
        setCarregando(true);
        console.log('[useSellers] Carregando farmácias...');

        const farmaciasAPI = await listarFarmaciasPublicas();
        const farmaciasConvertidas = farmaciasAPI.map((f, i) => converterFarmacia(f, i));

        console.log('[useSellers] Farmácias carregadas:', farmaciasConvertidas.length);
        setFarmacias(farmaciasConvertidas);
      } catch (error) {
        console.error('[useSellers] Erro ao carregar farmácias:', error);
        setFarmacias([]);
      } finally {
        setCarregando(false);
      }
    };

    carregarFarmacias();
  }, []);

  /**
   * Filtra farmácias por busca
   */
  const farmaciasFiltradas = useMemo(() => {
    if (!uiState.busca.trim()) return farmacias;

    return farmacias.filter((farmacia) =>
      farmacia.nome.toLowerCase().includes(uiState.busca.toLowerCase())
    );
  }, [farmacias, uiState.busca]);

  /**
   * Ordena farmácias por filtro ativo
   */
  const farmaciasOrdenadas = useMemo(() => {
    const farmaciasArray = [...farmaciasFiltradas];

    switch (uiState.filtroAtivo) {
      case 'avaliacao':
        return farmaciasArray.sort((a, b) => b.avaliacao - a.avaliacao);
      case 'entrega':
        return farmaciasArray.sort((a, b) => {
          if (a.fechada) return 1;
          if (b.fechada) return -1;
          return 0;
        });
      case 'proximidade':
      default:
        return farmaciasArray;
    }
  }, [farmaciasFiltradas, uiState.filtroAtivo]);

  /**
   * Handlers
   */
  const handleSearch = useCallback((text: string) => {
    setUiState((prev) => ({ ...prev, busca: text }));
  }, []);

  const handleFilterChange = useCallback((filterId: string) => {
    setUiState((prev) => ({ ...prev, filtroAtivo: filterId }));
  }, []);

  const handlePharmacyPress = useCallback((id: number) => {
    router.push(`/seller/${id}`);
  }, []);

  const handleBackPress = useCallback(() => {
    router.back();
  }, []);

  const handlers: SellersHandlers = {
    onSearch: handleSearch,
    onFilterChange: handleFilterChange,
    onPharmacyPress: handlePharmacyPress,
    onBackPress: handleBackPress,
  };

  return {
    uiState,
    farmacias: farmaciasOrdenadas,
    filtros: FILTROS,
    handlers,
    carregando,
  };
};
