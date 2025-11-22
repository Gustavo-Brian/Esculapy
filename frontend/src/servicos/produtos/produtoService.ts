/**
 * Serviço de Produtos - Esculapi
 * Gerencia operações relacionadas a produtos
 */

import { apiGet } from '../api/config';
import {
  PRODUCT_ENDPOINTS,
  CATALOGO_ENDPOINTS,
  ESTOQUE_ENDPOINTS,
  buildUrlWithParams
} from '../api/endpoints';
import {
  Product,
  Category,
  ProductListParams,
  PaginatedResponse,
} from '../types/api.types';

/**
 * Lista produtos com paginação e filtros
 */
export const getProducts = async (
  params?: ProductListParams
): Promise<PaginatedResponse<Product>> => {
  try {
    const url = params
      ? buildUrlWithParams(PRODUCT_ENDPOINTS.LIST, params)
      : PRODUCT_ENDPOINTS.LIST;

    return await apiGet<PaginatedResponse<Product>>(url);
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    throw error;
  }
};

/**
 * Busca detalhes de um produto específico
 * GET /api/catalogo/{id}
 */
export const getProductDetails = async (productId: number | string): Promise<Product> => {
  try {
    // Usa o novo endpoint de catálogo
    return await apiGet<Product>(CATALOGO_ENDPOINTS.DETALHES(productId));
  } catch (error: any) {
    // Se não funcionar, tenta o endpoint marketplace
    if (error?.response?.status === 404) {
      try {
        return await apiGet<Product>(PRODUCT_ENDPOINTS.DETAILS(productId));
      } catch (fallbackError) {
        console.error('Erro ao buscar detalhes do produto (fallback):', fallbackError);
        throw fallbackError;
      }
    }
    console.error('Erro ao buscar detalhes do produto:', error);
    throw error;
  }
};

/**
 * Pesquisa produtos por termo
 */
export const searchProducts = async (
  searchTerm: string,
  params?: Omit<ProductListParams, 'search'>
): Promise<PaginatedResponse<Product>> => {
  try {
    const url = buildUrlWithParams(PRODUCT_ENDPOINTS.SEARCH, {
      search: searchTerm,
      ...params,
    });

    return await apiGet<PaginatedResponse<Product>>(url);
  } catch (error) {
    console.error('Erro ao pesquisar produtos:', error);
    throw error;
  }
};

/**
 * Busca todas as categorias de produtos
 */
export const getCategories = async (): Promise<Category[]> => {
  try {
    return await apiGet<Category[]>(PRODUCT_ENDPOINTS.CATEGORIES);
  } catch (error) {
    console.error('Erro ao buscar categorias:', error);
    throw error;
  }
};

/**
 * Busca produtos por categoria
 */
export const getProductsByCategory = async (
  categoryId: number | string,
  params?: ProductListParams
): Promise<PaginatedResponse<Product>> => {
  try {
    const url = params
      ? buildUrlWithParams(PRODUCT_ENDPOINTS.BY_CATEGORY(categoryId), params)
      : PRODUCT_ENDPOINTS.BY_CATEGORY(categoryId);

    return await apiGet<PaginatedResponse<Product>>(url);
  } catch (error) {
    console.error('Erro ao buscar produtos da categoria:', error);
    throw error;
  }
};

/**
 * Busca produtos em destaque
 */
export const getFeaturedProducts = async (): Promise<Product[]> => {
  try {
    return await apiGet<Product[]>(PRODUCT_ENDPOINTS.FEATURED);
  } catch (error) {
    console.error('Erro ao buscar produtos em destaque:', error);
    throw error;
  }
};

/**
 * Busca produtos populares/mais vendidos
 */
export const getPopularProducts = async (limit?: number): Promise<Product[]> => {
  try {
    const url = limit
      ? buildUrlWithParams(PRODUCT_ENDPOINTS.POPULAR, { limit })
      : PRODUCT_ENDPOINTS.POPULAR;

    return await apiGet<Product[]>(url);
  } catch (error: any) {
    console.error('Erro ao buscar produtos populares:', error);

    // Se o endpoint não existir, retorna array vazio
    if (error.response?.status === 404) {
      console.warn('[ProdutoService] Endpoint de produtos populares não encontrado, retornando vazio');
      return [];
    }

    throw error;
  }
};

/**
 * Busca ofertas/promoções ativas
 * GET /api/promotions/flash-sales ou /products/featured
 */
export const getOfertas = async (limit?: number): Promise<Product[]> => {
  try {
    console.log('[ProdutoService] Buscando ofertas do dia');

    // Tenta buscar produtos em destaque/promoções
    const url = limit
      ? buildUrlWithParams(PRODUCT_ENDPOINTS.FEATURED, { limit })
      : PRODUCT_ENDPOINTS.FEATURED;

    const response = await apiGet<Product[]>(url);

    console.log('[ProdutoService] Ofertas encontradas:', response.length);

    return response;
  } catch (error: any) {
    console.error('[ProdutoService] Erro ao buscar ofertas:', error);

    // Se o endpoint não existir, retorna array vazio
    if (error.response?.status === 404) {
      console.warn('[ProdutoService] Endpoint de ofertas não encontrado, retornando vazio');
      return [];
    }

    throw new Error(error.message || 'Erro ao buscar ofertas');
  }
};

/**
 * Busca todos os produtos do marketplace (backend brasileiro)
 * GET /api/estoque/buscar-por-nome?nome=
 */
export const buscarProdutosMarketplace = async (nome: string = ''): Promise<any[]> => {
  try {
    console.log('[ProdutoService] Buscando produtos do marketplace...');

    const url = nome
      ? buildUrlWithParams(ESTOQUE_ENDPOINTS.BUSCAR_POR_NOME, { nome })
      : buildUrlWithParams(ESTOQUE_ENDPOINTS.BUSCAR_POR_NOME, { nome: '' });

    const produtos = await apiGet<any[]>(url);
    console.log('[ProdutoService] Produtos encontrados:', produtos.length);

    return produtos;
  } catch (error: any) {
    console.error('[ProdutoService] Erro ao buscar produtos do marketplace:', error);

    // Se o endpoint não existir ou falhar, retorna array vazio
    if (error.response?.status === 404 || error.response?.status === 500) {
      console.warn('[ProdutoService] Endpoint não encontrado ou erro no servidor, retornando vazio');
      return [];
    }

    return [];
  }
};

/**
 * Busca produtos para a home (usa marketplace brasileiro)
 * Retorna produtos e separa os que estão em promoção
 */
export const getProdutosHome = async (): Promise<{
  produtos: Product[];
  ofertas: Product[];
}> => {
  try {
    console.log('[ProdutoService] Buscando produtos para home');

    // Busca produtos do marketplace brasileiro
    const produtosMarketplace = await buscarProdutosMarketplace('');

    // Se não encontrou produtos no marketplace, tenta endpoints marketplace antigos
    if (produtosMarketplace.length === 0) {
      console.log('[ProdutoService] Marketplace vazio, tentando endpoints marketplace...');
      const [produtos, ofertas] = await Promise.all([
        getPopularProducts(10).catch(() => []),
        getOfertas(10).catch(() => []),
      ]);

      console.log('[ProdutoService] Produtos home (marketplace):', {
        produtos: produtos.length,
        ofertas: ofertas.length,
      });

      return { produtos, ofertas };
    }

    // Converte produtos do marketplace para formato Product
    const produtosConvertidos: Product[] = produtosMarketplace.map(p => ({
      id: p.produtoId || p.id,
      name: p.produtoNome || p.nome,
      description: p.produtoDescricao || p.descricao || '',
      price: p.preco,
      price_formatted: `R$ ${p.preco.toFixed(2).replace('.', ',')}`,
      original_price: undefined,
      original_price_formatted: undefined,
      discount_percentage: undefined,
      image_url: undefined,
      images: undefined,
      stock: p.quantidade,
      is_active: p.quantidade > 0,
      is_featured: false,
      is_favorited: undefined,
      rating: undefined,
      reviews_count: undefined,
      seller_id: p.farmaciaId,
      seller: undefined,
      category_id: 1,
      category: undefined,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }));

    // Separa ofertas (produtos com desconto ou estoque baixo)
    const ofertas = produtosConvertidos.filter(p => p.stock < 20 && p.stock > 0);

    console.log('[ProdutoService] Produtos home (marketplace brasileiro):', {
      produtos: produtosConvertidos.length,
      ofertas: ofertas.length,
    });

    return {
      produtos: produtosConvertidos,
      ofertas: ofertas.slice(0, 10), // Limita a 10 ofertas
    };
  } catch (error: any) {
    console.error('[ProdutoService] Erro ao buscar produtos home:', error);

    // Retorna arrays vazios em caso de erro total
    return {
      produtos: [],
      ofertas: [],
    };
  }
};

export default {
  getProducts,
  getProductDetails,
  searchProducts,
  getCategories,
  getProductsByCategory,
  getFeaturedProducts,
  getPopularProducts,
  getOfertas,
  getProdutosHome,
};
