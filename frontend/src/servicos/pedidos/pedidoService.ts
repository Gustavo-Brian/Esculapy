/**
 * Serviço de Pedidos - Esculapi
 * Funções para clientes criarem e gerenciarem pedidos
 */

import api from '../api/config';
import { PEDIDOS_ENDPOINTS } from '../api/endpoints';
import type {
  CarrinhoRequest,
  Pedido,
  MeusPedidosResponse,
} from '../types/api.types';

/**
 * Criar novo pedido (fechar carrinho)
 * Requer: ROLE_CLIENTE
 *
 * @param carrinho - Dados do carrinho com itens e informações de entrega
 * @returns Pedido criado
 */
export const criarPedido = async (carrinho: CarrinhoRequest): Promise<Pedido> => {
  try {
    console.log('[PedidoService] Criando pedido:', {
      itens: carrinho.itens.length,
      enderecoEntrega: carrinho.enderecoEntrega,
    });

    const response = await api.post<Pedido>(
      PEDIDOS_ENDPOINTS.CRIAR,
      carrinho
    );

    console.log('[PedidoService] Pedido criado com sucesso:', {
      pedidoId: response.data.id,
      numero: response.data.numero,
      status: response.data.status,
      total: response.data.total,
    });

    return response.data;
  } catch (error: any) {
    console.error('[PedidoService] Erro ao criar pedido:', error);

    if (error.response?.data) {
      throw new Error(error.response.data.message || 'Erro ao criar pedido');
    }

    throw new Error('Erro de conexão. Verifique sua internet e tente novamente.');
  }
};

/**
 * Buscar lista de pedidos do cliente autenticado
 * Requer: ROLE_CLIENTE
 *
 * @returns Lista de pedidos do cliente
 */
export const getMeusPedidos = async (): Promise<MeusPedidosResponse> => {
  try {
    console.log('[PedidoService] Buscando meus pedidos...');

    const response = await api.get<any>(
      PEDIDOS_ENDPOINTS.MEUS_PEDIDOS
    );

    console.log('[PedidoService] 🔍 Resposta RAW da API:', response.data);
    console.log('[PedidoService] 🔍 Tipo de response.data:', typeof response.data);
    console.log('[PedidoService] 🔍 Chaves de response.data:', Object.keys(response.data));

    // Backend pode retornar ApiResponse<Page<Pedido>>
    // Estrutura esperada: { success: true, data: { content: [...], totalElements: 10 } }
    const dados = response.data.data || response.data;

    console.log('[PedidoService] 🔍 Dados extraídos:', dados);

    // Se for Page do Spring, tem content e totalElements
    if (dados.content && Array.isArray(dados.content)) {
      console.log('[PedidoService] ✅ Formato Page do Spring detectado');
      return {
        pedidos: dados.content,
        total: dados.totalElements || dados.content.length,
      };
    }

    // Se já for array direto
    if (Array.isArray(dados)) {
      console.log('[PedidoService] ✅ Formato array direto detectado');
      return {
        pedidos: dados,
        total: dados.length,
      };
    }

    // Se tiver pedidos e total direto
    if (dados.pedidos && Array.isArray(dados.pedidos)) {
      console.log('[PedidoService] ✅ Formato com pedidos array detectado');
      return {
        pedidos: dados.pedidos,
        total: dados.total || dados.pedidos.length,
      };
    }

    console.warn('[PedidoService] ⚠️ Formato inesperado, retornando vazio');
    return {
      pedidos: [],
      total: 0,
    };
  } catch (error: any) {
    console.error('[PedidoService] Erro ao buscar pedidos:', error);

    if (error.response?.data) {
      throw new Error(error.response.data.message || 'Erro ao buscar pedidos');
    }

    throw new Error('Erro de conexão. Verifique sua internet e tente novamente.');
  }
};

/**
 * Buscar detalhes de um pedido específico
 * Requer: ROLE_CLIENTE
 *
 * @param pedidoId - ID do pedido
 * @returns Detalhes do pedido
 */
export const getDetalhesPedido = async (pedidoId: number): Promise<Pedido> => {
  try {
    console.log('[PedidoService] Buscando detalhes do pedido:', pedidoId);

    const response = await api.get<Pedido>(
      PEDIDOS_ENDPOINTS.DETALHES(pedidoId)
    );

    console.log('[PedidoService] Detalhes obtidos:', {
      numero: response.data.numero,
      status: response.data.status,
    });

    return response.data;
  } catch (error: any) {
    console.error('[PedidoService] Erro ao buscar detalhes:', error);

    if (error.response?.data) {
      throw new Error(error.response.data.message || 'Erro ao buscar detalhes do pedido');
    }

    throw new Error('Erro de conexão. Verifique sua internet e tente novamente.');
  }
};

/**
 * Fazer upload de receita médica para um pedido
 * Requer: ROLE_CLIENTE
 *
 * @param pedidoId - ID do pedido
 * @param arquivo - Arquivo da receita (File ou FormData)
 * @returns Pedido atualizado com receita
 */
export const uploadReceita = async (
  pedidoId: number,
  arquivo: File | FormData
): Promise<Pedido> => {
  try {
    console.log('[PedidoService] Fazendo upload de receita para pedido:', pedidoId);

    const formData = arquivo instanceof FormData ? arquivo : new FormData();
    if (!(arquivo instanceof FormData)) {
      formData.append('arquivo', arquivo);
    }

    const response = await api.post<Pedido>(
      PEDIDOS_ENDPOINTS.UPLOAD_RECEITA(pedidoId),
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    console.log('[PedidoService] Receita enviada com sucesso');
    return response.data;
  } catch (error: any) {
    console.error('[PedidoService] Erro ao enviar receita:', error);

    if (error.response?.data) {
      throw new Error(error.response.data.message || 'Erro ao enviar receita');
    }

    throw new Error('Erro de conexão. Verifique sua internet e tente novamente.');
  }
};

export default {
  criarPedido,
  getMeusPedidos,
  getDetalhesPedido,
  uploadReceita,
};
