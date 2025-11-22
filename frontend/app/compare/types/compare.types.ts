/**
 * Compare Types
 */

export interface ProductOffer {
  id: number;
  farmacia: string;
  nota: number;
  distancia: string;
  preco: number;
  precoAntigo?: number;
  economia: number;
  entrega: string;
  tempoEntrega: string;
  estoque: number;
  verificada: boolean;
  melhorPreco: boolean;
}

export interface CompareProduct {
  nome: string;
  descricao: string;
  ofertas: ProductOffer[];
}

export interface CompareStats {
  menorPreco: number;
  maiorPreco: number;
  precoMedio: number;
  economiaMaxima: number;
}

export interface CompareHandlers {
  onBackPress: () => void;
  onSelectOffer: (offerId: number) => void;
  onPharmacyPress: (farmacia: string) => void;
}
