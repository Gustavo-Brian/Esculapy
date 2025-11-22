/**
 * Serviço de Farmacêutico - Esculapi
 * Funções para farmacêuticos validarem receitas (ROLE_FARMACEUTICO)
 */

import api from '../api/config';
import { FARMACEUTICO_ENDPOINTS } from '../api/endpoints';
import type {
  PedidosPendentesResponse,
  AprovarReceitaResponse,
  RejeitarReceitaRequest,
  RejeitarReceitaResponse,
} from '../types/api.types';

/**
 * Listar pedidos com receitas pendentes de validação
 * Requer: ROLE_FARMACEUTICO
 */
export const listPedidosPendentes = async (): Promise<PedidosPendentesResponse> => {
  try {
    console.log('[FarmaceuticoService] Listando pedidos pendentes');

    const response = await api.get<PedidosPendentesResponse>(
      FARMACEUTICO_ENDPOINTS.LIST_PEDIDOS_PENDENTES
    );

    console.log('[FarmaceuticoService] Pedidos pendentes obtidos:', {
      total: response.data.total,
      pedidos: response.data.pedidos.length,
    });

    return response.data;
  } catch (error: any) {
    console.error('[FarmaceuticoService] Erro ao listar pedidos pendentes:', error);

    if (error.response?.data) {
      throw new Error(error.response.data.message || 'Erro ao listar pedidos pendentes');
    }

    throw new Error('Erro de conexão. Verifique sua internet e tente novamente.');
  }
};

/**
 * Aprovar receita médica de um pedido
 * Requer: ROLE_FARMACEUTICO
 */
export const aprovarReceita = async (pedidoId: number): Promise<AprovarReceitaResponse> => {
  try {
    console.log('[FarmaceuticoService] Aprovando receita do pedido:', pedidoId);

    const response = await api.post<AprovarReceitaResponse>(
      FARMACEUTICO_ENDPOINTS.APROVAR_RECEITA(pedidoId),
      {} // Request body vazio
    );

    console.log('[FarmaceuticoService] Receita aprovada com sucesso:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('[FarmaceuticoService] Erro ao aprovar receita:', error);

    if (error.response?.data) {
      throw new Error(error.response.data.message || 'Erro ao aprovar receita');
    }

    throw new Error('Erro de conexão. Verifique sua internet e tente novamente.');
  }
};

/**
 * Rejeitar receita médica de um pedido
 * Requer: ROLE_FARMACEUTICO
 */
export const rejeitarReceita = async (
  pedidoId: number,
  data: RejeitarReceitaRequest
): Promise<RejeitarReceitaResponse> => {
  try {
    console.log('[FarmaceuticoService] Rejeitando receita do pedido:', {
      pedidoId,
      justificativa: data.justificativa,
    });

    const response = await api.post<RejeitarReceitaResponse>(
      FARMACEUTICO_ENDPOINTS.REJEITAR_RECEITA(pedidoId),
      data
    );

    console.log('[FarmaceuticoService] Receita rejeitada com sucesso:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('[FarmaceuticoService] Erro ao rejeitar receita:', error);

    if (error.response?.data) {
      throw new Error(error.response.data.message || 'Erro ao rejeitar receita');
    }

    throw new Error('Erro de conexão. Verifique sua internet e tente novamente.');
  }
};

export default {
  listPedidosPendentes,
  aprovarReceita,
  rejeitarReceita,
};
