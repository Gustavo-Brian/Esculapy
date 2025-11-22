/**
 * Serviço de Gerenciamento Admin - Esculapi
 * Funções para admin gerenciar farmácias, usuários e produtos (ROLE_ADMIN)
 */

import api from '../api/config';
import { ADMIN_ENDPOINTS, buildUrlWithParams } from '../api/endpoints';
import type {
  Farmacia,
  ListFarmaciasParams,
  Usuario,
  BuscarUsuarioParams,
  Produto,
  ProdutoRequest,
  ListProdutosParams,
  LojistaStatus,
} from '../types/admin.types';

// ============================================
// GERENCIAMENTO DE FARMÁCIAS
// ============================================

/**
 * Listar farmácias por status
 * Requer: ROLE_ADMIN
 *
 * @param params - Filtros de busca (status)
 * @returns Lista de farmácias
 */
export const listarFarmacias = async (
  params?: ListFarmaciasParams
): Promise<Farmacia[]> => {
  try {
    console.log('[AdminService] Listando farmácias com filtros:', params);

    const endpoint = params?.status
      ? buildUrlWithParams(ADMIN_ENDPOINTS.LIST_FARMACIAS, {
          status: params.status,
        })
      : ADMIN_ENDPOINTS.LIST_FARMACIAS;

    const response = await api.get<Farmacia[]>(endpoint);

    console.log('[AdminService] Farmácias obtidas:', {
      total: response.data.length,
      status: params?.status || 'TODOS',
    });

    return response.data;
  } catch (error: any) {
    console.error('[AdminService] Erro ao listar farmácias:', error);

    if (error.response?.data) {
      throw new Error(
        error.response.data.message || 'Erro ao listar farmácias'
      );
    }

    throw new Error('Erro de conexão. Verifique sua internet.');
  }
};

/**
 * Ativar/Aprovar farmácia
 * Requer: ROLE_ADMIN
 *
 * @param farmaciaId - ID da farmácia
 * @returns Farmácia atualizada com status ATIVO
 */
export const ativarFarmacia = async (farmaciaId: number): Promise<Farmacia> => {
  try {
    console.log('[AdminService] Ativando farmácia:', farmaciaId);

    const response = await api.post<Farmacia>(
      ADMIN_ENDPOINTS.ATIVAR_FARMACIA(farmaciaId)
    );

    console.log('[AdminService] Farmácia ativada com sucesso:', {
      id: response.data.id,
      nomeFantasia: response.data.nomeFantasia,
      status: response.data.status,
    });

    return response.data;
  } catch (error: any) {
    console.error('[AdminService] Erro ao ativar farmácia:', error);

    if (error.response?.data) {
      throw new Error(
        error.response.data.message || 'Erro ao ativar farmácia'
      );
    }

    throw new Error('Erro de conexão. Verifique sua internet.');
  }
};

/**
 * Desativar/Suspender farmácia
 * Requer: ROLE_ADMIN
 *
 * @param farmaciaId - ID da farmácia
 * @returns Farmácia atualizada com status SUSPENSO
 */
export const desativarFarmacia = async (
  farmaciaId: number
): Promise<Farmacia> => {
  try {
    console.log('[AdminService] Desativando farmácia:', farmaciaId);

    const response = await api.post<Farmacia>(
      ADMIN_ENDPOINTS.DESATIVAR_FARMACIA(farmaciaId)
    );

    console.log('[AdminService] Farmácia desativada com sucesso:', {
      id: response.data.id,
      nomeFantasia: response.data.nomeFantasia,
      status: response.data.status,
    });

    return response.data;
  } catch (error: any) {
    console.error('[AdminService] Erro ao desativar farmácia:', error);

    if (error.response?.data) {
      throw new Error(
        error.response.data.message || 'Erro ao desativar farmácia'
      );
    }

    throw new Error('Erro de conexão. Verifique sua internet.');
  }
};

// ============================================
// GERENCIAMENTO DE USUÁRIOS
// ============================================

/**
 * Buscar usuário por email
 * Requer: ROLE_ADMIN
 *
 * @param email - Email do usuário
 * @returns Dados completos do usuário
 */
export const buscarUsuarioPorEmail = async (
  email: string
): Promise<Usuario> => {
  try {
    console.log('[AdminService] Buscando usuário por email:', email);

    const endpoint = buildUrlWithParams(ADMIN_ENDPOINTS.BUSCAR_USUARIO, {
      email,
    });

    const response = await api.get<Usuario>(endpoint);

    console.log('[AdminService] Usuário encontrado:', {
      id: response.data.id,
      email: response.data.email,
      roles: response.data.roles.map((r) => r.nome),
    });

    return response.data;
  } catch (error: any) {
    console.error('[AdminService] Erro ao buscar usuário:', error);

    if (error.response?.status === 404) {
      throw new Error('Usuário não encontrado');
    }

    if (error.response?.data) {
      throw new Error(
        error.response.data.message || 'Erro ao buscar usuário'
      );
    }

    throw new Error('Erro de conexão. Verifique sua internet.');
  }
};

/**
 * Desativar/Banir usuário
 * Requer: ROLE_ADMIN
 *
 * @param usuarioId - ID do usuário
 * @returns Usuário atualizado com enabled = false
 */
export const desativarUsuario = async (usuarioId: number): Promise<Usuario> => {
  try {
    console.log('[AdminService] Desativando usuário:', usuarioId);

    const response = await api.post<Usuario>(
      ADMIN_ENDPOINTS.DESATIVAR_USUARIO(usuarioId)
    );

    console.log('[AdminService] Usuário desativado com sucesso:', {
      id: response.data.id,
      email: response.data.email,
      enabled: response.data.enabled,
    });

    return response.data;
  } catch (error: any) {
    console.error('[AdminService] Erro ao desativar usuário:', error);

    if (error.response?.data) {
      throw new Error(
        error.response.data.message || 'Erro ao desativar usuário'
      );
    }

    throw new Error('Erro de conexão. Verifique sua internet.');
  }
};

/**
 * Reativar usuário
 * Requer: ROLE_ADMIN
 *
 * @param usuarioId - ID do usuário
 * @returns Usuário atualizado com enabled = true
 */
export const reativarUsuario = async (usuarioId: number): Promise<Usuario> => {
  try {
    console.log('[AdminService] Reativando usuário:', usuarioId);

    const response = await api.post<Usuario>(
      ADMIN_ENDPOINTS.REATIVAR_USUARIO(usuarioId)
    );

    console.log('[AdminService] Usuário reativado com sucesso:', {
      id: response.data.id,
      email: response.data.email,
      enabled: response.data.enabled,
    });

    return response.data;
  } catch (error: any) {
    console.error('[AdminService] Erro ao reativar usuário:', error);

    if (error.response?.data) {
      throw new Error(
        error.response.data.message || 'Erro ao reativar usuário'
      );
    }

    throw new Error('Erro de conexão. Verifique sua internet.');
  }
};

// ============================================
// GERENCIAMENTO DE PRODUTOS (CATÁLOGO)
// ============================================

/**
 * Criar produto no catálogo master
 * Requer: ROLE_ADMIN
 *
 * @param produto - Dados do produto
 * @returns Produto criado
 */
export const criarProduto = async (
  produto: ProdutoRequest
): Promise<Produto> => {
  try {
    console.log('[AdminService] Criando produto:', produto.nome);

    const response = await api.post<Produto>(
      ADMIN_ENDPOINTS.CREATE_PRODUTO,
      produto
    );

    console.log('[AdminService] Produto criado com sucesso:', {
      id: response.data.id,
      nome: response.data.nome,
      ean: response.data.ean,
    });

    return response.data;
  } catch (error: any) {
    console.error('[AdminService] Erro ao criar produto:', error);

    if (error.response?.data) {
      throw new Error(error.response.data.message || 'Erro ao criar produto');
    }

    throw new Error('Erro de conexão. Verifique sua internet.');
  }
};

/**
 * Atualizar produto no catálogo
 * Requer: ROLE_ADMIN
 *
 * @param produtoId - ID do produto
 * @param produto - Dados atualizados do produto
 * @returns Produto atualizado
 */
export const atualizarProduto = async (
  produtoId: number,
  produto: ProdutoRequest
): Promise<Produto> => {
  try {
    console.log('[AdminService] Atualizando produto:', produtoId);

    const response = await api.put<Produto>(
      ADMIN_ENDPOINTS.UPDATE_PRODUTO(produtoId),
      produto
    );

    console.log('[AdminService] Produto atualizado com sucesso:', {
      id: response.data.id,
      nome: response.data.nome,
    });

    return response.data;
  } catch (error: any) {
    console.error('[AdminService] Erro ao atualizar produto:', error);

    if (error.response?.data) {
      throw new Error(
        error.response.data.message || 'Erro ao atualizar produto'
      );
    }

    throw new Error('Erro de conexão. Verifique sua internet.');
  }
};

/**
 * Desativar produto (soft delete)
 * Requer: ROLE_ADMIN
 *
 * @param produtoId - ID do produto
 * @returns Produto atualizado com ativo = false
 */
export const desativarProduto = async (produtoId: number): Promise<Produto> => {
  try {
    console.log('[AdminService] Desativando produto:', produtoId);

    const response = await api.post<Produto>(
      ADMIN_ENDPOINTS.DESATIVAR_PRODUTO(produtoId)
    );

    console.log('[AdminService] Produto desativado com sucesso');

    return response.data;
  } catch (error: any) {
    console.error('[AdminService] Erro ao desativar produto:', error);

    if (error.response?.data) {
      throw new Error(
        error.response.data.message || 'Erro ao desativar produto'
      );
    }

    throw new Error('Erro de conexão. Verifique sua internet.');
  }
};

/**
 * Reativar produto
 * Requer: ROLE_ADMIN
 *
 * @param produtoId - ID do produto
 * @returns Produto atualizado com ativo = true
 */
export const reativarProduto = async (produtoId: number): Promise<Produto> => {
  try {
    console.log('[AdminService] Reativando produto:', produtoId);

    const response = await api.post<Produto>(
      ADMIN_ENDPOINTS.REATIVAR_PRODUTO(produtoId)
    );

    console.log('[AdminService] Produto reativado com sucesso');

    return response.data;
  } catch (error: any) {
    console.error('[AdminService] Erro ao reativar produto:', error);

    if (error.response?.data) {
      throw new Error(
        error.response.data.message || 'Erro ao reativar produto'
      );
    }

    throw new Error('Erro de conexão. Verifique sua internet.');
  }
};

/**
 * Deletar produto permanentemente
 * Requer: ROLE_ADMIN
 *
 * @param produtoId - ID do produto
 */
export const deletarProduto = async (produtoId: number): Promise<void> => {
  try {
    console.log('[AdminService] Deletando produto:', produtoId);

    await api.delete(ADMIN_ENDPOINTS.DELETE_PRODUTO(produtoId));

    console.log('[AdminService] Produto deletado com sucesso');
  } catch (error: any) {
    console.error('[AdminService] Erro ao deletar produto:', error);

    if (error.response?.status === 409) {
      throw new Error(
        'Não é possível deletar produto em uso. Considere desativar.'
      );
    }

    if (error.response?.data) {
      throw new Error(
        error.response.data.message || 'Erro ao deletar produto'
      );
    }

    throw new Error('Erro de conexão. Verifique sua internet.');
  }
};

// ============================================
// EXPORT DEFAULT
// ============================================

export default {
  // Farmácias
  listarFarmacias,
  ativarFarmacia,
  desativarFarmacia,

  // Usuários
  buscarUsuarioPorEmail,
  desativarUsuario,
  reativarUsuario,

  // Produtos
  criarProduto,
  atualizarProduto,
  desativarProduto,
  reativarProduto,
  deletarProduto,
};
