/**
 * Types para a tela de AllProducts (Todos os Produtos)
 */

/**
 * Produto na lista
 */
export interface Product {
  id: number;
  nome: string;
  vendedor: string;
  avaliacao: number;
  preco: number;
  icone: string;
  cor: string;
}

/**
 * Estatísticas da tela
 */
export interface ProductsStats {
  totalProducts: number;
  totalStores: number;
}

/**
 * Handlers da tela
 */
export interface AllProductsHandlers {
  onBackPress: () => void;
  onProductPress: (id: number) => void;
  onAddToCart: (product: Product) => void;
}
