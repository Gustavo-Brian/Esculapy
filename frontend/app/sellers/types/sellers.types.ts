/**
 * Sellers Types
 * Tipos para a tela de lista de farmácias
 */

export interface Pharmacy {
  id: number;
  nome: string;
  avaliacao: number;
  totalAvaliacoes: number;
  distancia: string;
  tempoEntrega: string;
  produtos: number;
  verificada: boolean;
  fechada?: boolean;
  icone: string;
  corCapa: string;
  tags: string[];
}

export interface FilterOption {
  id: string;
  nome: string;
  icone: string;
}

export interface SellersUIState {
  busca: string;
  filtroAtivo: string;
}

export interface SellersHandlers {
  onSearch: (text: string) => void;
  onFilterChange: (filterId: string) => void;
  onPharmacyPress: (id: number) => void;
  onBackPress: () => void;
}
