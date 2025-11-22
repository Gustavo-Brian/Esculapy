/**
 * Serviço de Busca - Esculapi
 * Busca unificada de produtos e farmácias
 */

import { apiGet } from '../api/config';
import { ESTOQUE_ENDPOINTS, buildUrlWithParams } from '../api/endpoints';
import { ProdutoHome, FarmaciaResponse } from '../types/api.types';

/**
 * Busca produtos por termo
 * GET /api/estoque/buscar-por-nome?nome=
 */
export const buscarProdutos = async (termo: string): Promise<ProdutoHome[]> => {
  try {
    const url = buildUrlWithParams(ESTOQUE_ENDPOINTS.BUSCAR_POR_NOME, { nome: termo });
    const response = await apiGet<ProdutoHome[]>(url);
    return response;
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    throw error;
  }
};

/**
 * Busca farmácias por termo
 */
export const buscarFarmacias = async (termo: string): Promise<FarmaciaResponse[]> => {
  try {
    const response = await apiGet<FarmaciaResponse[]>(`/farmacias/buscar?q=${encodeURIComponent(termo)}`);
    return response;
  } catch (error) {
    console.error('Erro ao buscar farmácias:', error);
    throw error;
  }
};

/**
 * Busca unificada (produtos + farmácias)
 */
export interface ResultadoBuscaUnificada {
  produtos: ProdutoHome[];
  farmacias: FarmaciaResponse[];
}

export const buscarTudo = async (termo: string): Promise<ResultadoBuscaUnificada> => {
  try {
    const [produtos, farmacias] = await Promise.all([
      buscarProdutos(termo).catch(() => []),
      buscarFarmacias(termo).catch(() => []),
    ]);

    return { produtos, farmacias };
  } catch (error) {
    console.error('Erro na busca unificada:', error);
    return { produtos: [], farmacias: [] };
  }
};
