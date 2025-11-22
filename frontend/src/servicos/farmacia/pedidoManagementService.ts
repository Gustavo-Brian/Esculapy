/**
 * Serviço de Gerenciamento de Pedidos - Farmácia Admin
 * Funções para farmácias gerenciarem pedidos (ROLE_LOJISTA_ADMIN)
 */

import api from '../api/config';
import { FARMACIA_ADMIN_ENDPOINTS } from '../api/endpoints';
import type { Pedido, PedidoStatusUpdateRequest } from '../types/api.types';

/**
 * Listar todos os pedidos da farmácia
 * Requer: ROLE_LOJISTA_ADMIN
 *
 * @returns Lista de pedidos da farmácia
 */
export const getPedidosFarmacia = async (): Promise<Pedido[]> => {
  try {
    console.log('[PedidoManagementService] Listando pedidos da farmácia...');

    const response = await api.get<any>(
      FARMACIA_ADMIN_ENDPOINTS.LIST_PEDIDOS
    );

    console.log('[PedidoManagementService] Response recebido:', response.data);

    // O backend retorna um objeto paginado: { content: [], pageable: {}, ... }
    // Precisamos extrair o array de pedidos do campo 'content'
    let pedidos: Pedido[] = [];

    if (response.data) {
      // Se retornar objeto paginado com campo 'content'
      if (response.data.content && Array.isArray(response.data.content)) {
        pedidos = response.data.content;
        console.log('[PedidoManagementService] ✅ Pedidos extraídos de response.data.content');
      }
      // Se retornar array direto
      else if (Array.isArray(response.data)) {
        pedidos = response.data;
        console.log('[PedidoManagementService] ✅ Pedidos extraídos de response.data (array direto)');
      }
      // Se tiver ApiResponse wrapper
      else if (response.data.data) {
        if (Array.isArray(response.data.data)) {
          pedidos = response.data.data;
          console.log('[PedidoManagementService] ✅ Pedidos extraídos de response.data.data');
        } else if (response.data.data.content && Array.isArray(response.data.data.content)) {
          pedidos = response.data.data.content;
          console.log('[PedidoManagementService] ✅ Pedidos extraídos de response.data.data.content');
        }
      }
    }

    console.log('[PedidoManagementService] Pedidos obtidos:', {
      total: pedidos.length,
    });

    return pedidos;
  } catch (error: any) {
    console.error('[PedidoManagementService] Erro ao listar pedidos:', error);

    if (error.response?.data) {
      throw new Error(error.response.data.message || 'Erro ao listar pedidos');
    }

    throw new Error('Erro de conexão. Verifique sua internet e tente novamente.');
  }
};

/**
 * Atualizar status de um pedido
 * Requer: ROLE_LOJISTA_ADMIN
 *
 * @param pedidoId - ID do pedido
 * @param status - Novo status (CONFIRMADO, EM_PREPARACAO, PRONTO_PARA_ENTREGA, EM_TRANSPORTE, ENTREGUE)
 * @returns Pedido atualizado
 */
export const updateStatusPedido = async (
  pedidoId: number,
  status: 'CONFIRMADO' | 'EM_PREPARACAO' | 'PRONTO_PARA_ENTREGA' | 'EM_TRANSPORTE' | 'ENTREGUE'
): Promise<Pedido> => {
  try {
    console.log('[PedidoManagementService] Atualizando status do pedido:', {
      pedidoId,
      status,
    });

    const request: PedidoStatusUpdateRequest = { status };

    const response = await api.put<Pedido>(
      FARMACIA_ADMIN_ENDPOINTS.UPDATE_STATUS_PEDIDO(pedidoId),
      request
    );

    console.log('[PedidoManagementService] Status atualizado com sucesso');
    return response.data;
  } catch (error: any) {
    console.error('[PedidoManagementService] Erro ao atualizar status:', error);

    if (error.response?.data) {
      throw new Error(error.response.data.message || 'Erro ao atualizar status do pedido');
    }

    throw new Error('Erro de conexão. Verifique sua internet e tente novamente.');
  }
};

export default {
  getPedidosFarmacia,
  updateStatusPedido,
};
