/**
 * Search Types
 * Tipos e interfaces para a tela de busca
 */

import { ProdutoHome, FarmaciaResponse } from '@/src/servicos/types/api.types';

/**
 * Resultado da busca unificada
 */
export interface SearchResults {
  produtos: ProdutoHome[];
  farmacias: FarmaciaResponse[];
}

/**
 * Categoria de filtro rápido
 */
export interface SearchCategory {
  id: string;
  nome: string;
  icone: string;
  cor: string;
}

/**
 * Aba ativa na busca
 */
export type SearchTab = 'produtos' | 'farmacias';

/**
 * Estado de UI
 */
export interface SearchUIState {
  termoBusca: string;
  abaAtiva: SearchTab;
  categoriaAtiva: string | null;
  loading: boolean;
}

/**
 * Handlers da busca
 */
export interface SearchHandlers {
  onChangeSearchTerm: (termo: string) => void;
  onChangeTab: (aba: SearchTab) => void;
  onSelectCategory: (categoriaId: string) => void;
  onClearSearch: () => void;
  onBackPress: () => void;
  onProductPress: (produtoId: number) => void;
  onPharmacyPress: (farmaciaId: number) => void;
}
