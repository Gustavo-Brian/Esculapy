/**
 * Serviço de Validação de Receitas - Farmacêutico
 * Funções para farmacêuticos validarem receitas médicas
 */

import api, { apiGet, apiPost } from '../api/config';
import type { Pedido } from '../types/api.types';

/**
 * Listar pedidos pendentes de validação de receita
 * Requer: ROLE_FARMACEUTICO
 *
 * @returns Lista de pedidos com receitas pendentes
 */
export const getPedidosPendentesValidacao = async (): Promise<Pedido[]> => {
  try {
    console.log('[ReceitaService] Buscando pedidos pendentes de validação...');

    const response = await apiGet<Pedido[]>('/farmaceutico/pedidos/pendentes');

    console.log('[ReceitaService] Pedidos pendentes obtidos:', response.length);

    return response;
  } catch (error: any) {
    console.error('[ReceitaService] Erro ao buscar pedidos pendentes:', error);

    if (error.response?.status === 404) {
      console.warn('[ReceitaService] Endpoint não encontrado, retornando vazio');
      return [];
    }

    throw new Error(
      error.response?.data?.message || 'Erro ao buscar pedidos pendentes'
    );
  }
};

/**
 * Aprovar receita de um pedido
 * Requer: ROLE_FARMACEUTICO
 *
 * @param pedidoId - ID do pedido
 * @returns Pedido atualizado
 */
export const aprovarReceitaPedido = async (pedidoId: number): Promise<Pedido> => {
  try {
    console.log('[ReceitaService] Aprovando receita do pedido:', pedidoId);

    const response = await apiPost<Pedido>(
      `/farmaceutico/pedidos/${pedidoId}/receita/aprovar`,
      {}
    );

    console.log('[ReceitaService] Receita aprovada com sucesso');

    return response;
  } catch (error: any) {
    console.error('[ReceitaService] Erro ao aprovar receita:', error);

    throw new Error(
      error.response?.data?.message || 'Erro ao aprovar receita'
    );
  }
};

/**
 * Rejeitar receita de um pedido
 * Requer: ROLE_FARMACEUTICO
 *
 * @param pedidoId - ID do pedido
 * @param motivo - Motivo da rejeição
 * @returns Pedido atualizado
 */
export const rejeitarReceitaPedido = async (
  pedidoId: number,
  motivo: string
): Promise<Pedido> => {
  try {
    console.log('[ReceitaService] Rejeitando receita do pedido:', pedidoId);

    const response = await apiPost<Pedido>(
      `/farmaceutico/pedidos/${pedidoId}/receita/rejeitar`,
      { motivo }
    );

    console.log('[ReceitaService] Receita rejeitada com sucesso');

    return response;
  } catch (error: any) {
    console.error('[ReceitaService] Erro ao rejeitar receita:', error);

    throw new Error(
      error.response?.data?.message || 'Erro ao rejeitar receita'
    );
  }
};

export default {
  getPedidosPendentesValidacao,
  aprovarReceitaPedido,
  rejeitarReceitaPedido,
};
