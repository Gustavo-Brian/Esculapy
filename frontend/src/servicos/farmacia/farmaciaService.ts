/**
 * Serviço de Farmácias - Esculapi
 * Gerencia operações de listagem e busca de farmácias (marketplace)
 */

import { apiGet } from '../api/config';
import { SELLER_ENDPOINTS, buildUrlWithParams } from '../api/endpoints';

/**
 * Interface de Farmácia para listagem
 */
export interface Farmacia {
  id: number;
  nome: string;
  cnpj?: string;
  crfJ?: string;
  telefone?: string;
  email?: string;
  endereco?: string;
  cidade?: string;
  estado?: string;
  cep?: string;
  latitude?: number;
  longitude?: number;
  distancia?: number; // em km
  avaliacaoMedia?: number;
  totalAvaliacoes?: number;
  tempoEntrega?: string; // ex: "30-45 min"
  taxaEntrega?: number;
  aberta?: boolean;
  horarioAbertura?: string;
  horarioFechamento?: string;
  verificada?: boolean;
  destaque?: boolean;
  quantidadeProdutos?: number;
  tags?: string[]; // ex: ["24h", "Entrega rápida", "Melhores preços"]
  logo?: string;
  capa?: string;
  cor?: string; // cor de destaque
}

/**
 * Parâmetros para listagem de farmácias
 */
export interface ListarFarmaciasParams {
  page?: number;
  limit?: number;
  search?: string;
  latitude?: number;
  longitude?: number;
  radius?: number; // raio em km
  orderBy?: 'distancia' | 'avaliacao' | 'tempoEntrega' | 'preco' | 'nome';
  apenasAbertas?: boolean;
  apenasVerificadas?: boolean;
}

/**
 * Response paginada de farmácias
 */
export interface FarmaciasResponse {
  data: Farmacia[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Lista farmácias com filtros e paginação
 * GET /api/sellers
 */
export const listarFarmacias = async (
  params?: ListarFarmaciasParams
): Promise<FarmaciasResponse> => {
  try {
    console.log('[FarmaciaService] Listando farmácias com params:', params);

    const url = params
      ? buildUrlWithParams(SELLER_ENDPOINTS.LIST, params)
      : SELLER_ENDPOINTS.LIST;

    const response = await apiGet<FarmaciasResponse>(url);

    console.log('[FarmaciaService] Farmácias obtidas:', {
      total: response.total,
      quantidade: response.data.length,
    });

    return response;
  } catch (error: any) {
    console.error('[FarmaciaService] Erro ao listar farmácias:', error);

    // Se o endpoint não existir, retorna array vazio
    if (error.response?.status === 404) {
      console.warn('[FarmaciaService] Endpoint não encontrado, retornando vazio');
      return {
        data: [],
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
      };
    }

    throw new Error(error.message || 'Erro ao listar farmácias');
  }
};

/**
 * Busca farmácias próximas com base em coordenadas
 * GET /api/sellers/nearby
 */
export const buscarFarmaciasProximas = async (
  latitude: number,
  longitude: number,
  radius: number = 10 // km
): Promise<Farmacia[]> => {
  try {
    console.log('[FarmaciaService] Buscando farmácias próximas:', {
      latitude,
      longitude,
      radius,
    });

    const url = buildUrlWithParams(SELLER_ENDPOINTS.NEARBY, {
      latitude,
      longitude,
      radius,
    });

    const response = await apiGet<Farmacia[]>(url);

    console.log('[FarmaciaService] Farmácias próximas encontradas:', response.length);

    return response;
  } catch (error: any) {
    console.error('[FarmaciaService] Erro ao buscar farmácias próximas:', error);

    // Se o endpoint não existir, retorna array vazio
    if (error.response?.status === 404) {
      console.warn('[FarmaciaService] Endpoint não encontrado, retornando vazio');
      return [];
    }

    throw new Error(error.message || 'Erro ao buscar farmácias próximas');
  }
};

/**
 * Busca farmácias em destaque
 * GET /api/sellers/featured
 */
export const buscarFarmaciasDestaque = async (): Promise<Farmacia[]> => {
  try {
    console.log('[FarmaciaService] Buscando farmácias em destaque');

    const response = await apiGet<Farmacia[]>(SELLER_ENDPOINTS.FEATURED);

    console.log('[FarmaciaService] Farmácias em destaque encontradas:', response.length);

    return response;
  } catch (error: any) {
    console.error('[FarmaciaService] Erro ao buscar farmácias em destaque:', error);

    // Se o endpoint não existir, retorna array vazio
    if (error.response?.status === 404) {
      console.warn('[FarmaciaService] Endpoint não encontrado, retornando vazio');
      return [];
    }

    throw new Error(error.message || 'Erro ao buscar farmácias em destaque');
  }
};

/**
 * Busca detalhes de uma farmácia específica
 * GET /api/sellers/{id}
 */
export const buscarDetalheFarmacia = async (id: number | string): Promise<Farmacia> => {
  try {
    console.log('[FarmaciaService] Buscando detalhes da farmácia:', id);

    const response = await apiGet<Farmacia>(SELLER_ENDPOINTS.DETAILS(id));

    console.log('[FarmaciaService] Detalhes da farmácia obtidos:', response.nome);

    return response;
  } catch (error: any) {
    console.error('[FarmaciaService] Erro ao buscar detalhes da farmácia:', error);

    throw new Error(error.message || 'Erro ao buscar detalhes da farmácia');
  }
};

/**
 * Busca farmácias por termo de busca
 * GET /api/sellers/search
 */
export const buscarFarmacias = async (
  searchTerm: string,
  params?: Omit<ListarFarmaciasParams, 'search'>
): Promise<FarmaciasResponse> => {
  try {
    console.log('[FarmaciaService] Buscando farmácias por termo:', searchTerm);

    const url = buildUrlWithParams(SELLER_ENDPOINTS.SEARCH, {
      search: searchTerm,
      ...params,
    });

    const response = await apiGet<FarmaciasResponse>(url);

    console.log('[FarmaciaService] Resultados da busca:', response.total);

    return response;
  } catch (error: any) {
    console.error('[FarmaciaService] Erro ao buscar farmácias:', error);

    // Se o endpoint não existir, retorna array vazio
    if (error.response?.status === 404) {
      console.warn('[FarmaciaService] Endpoint não encontrado, retornando vazio');
      return {
        data: [],
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
      };
    }

    throw new Error(error.message || 'Erro ao buscar farmácias');
  }
};

export default {
  listarFarmacias,
  buscarFarmaciasProximas,
  buscarFarmaciasDestaque,
  buscarDetalheFarmacia,
  buscarFarmacias,
};
