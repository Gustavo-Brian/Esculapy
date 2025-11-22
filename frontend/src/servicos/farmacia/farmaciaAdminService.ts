/**
 * Serviço de Farmácia Admin - Esculapi
 * Funções para gerenciamento de farmácia (ROLE_LOJISTA_ADMIN)
 */

import { api } from '../api/config';
import { FARMACIA_ADMIN_ENDPOINTS } from '../api/endpoints';
import type {
  AddFarmaceuticoRequest,
  AddFarmaceuticoResponse,
  AddEstoqueRequest,
  AddEstoqueResponse,
  UpdateEstoqueRequest,
  UpdateEstoqueResponse,
  EstoqueListResponse,
  UpdateFarmaciaInfoRequest,
  UpdateFarmaciaEnderecoRequest,
  UpdateFarmaciaContaBancariaRequest,
  FarmaciaCompleta,
  UpdateFarmaceuticoRequest,
  Farmaceutico,
} from '../types/api.types';

/**
 * Cadastrar novo farmacêutico na farmácia
 * Requer: ROLE_LOJISTA_ADMIN
 */
export const addFarmaceutico = async (
  data: AddFarmaceuticoRequest
): Promise<AddFarmaceuticoResponse> => {
  try {
    console.log('[FarmaciaAdminService] Cadastrando farmacêutico:', {
      nome: data.nome,
      email: data.email,
      cpf: data.cpf,
      crfP: data.crfP,
    });

    const response = await api.post<AddFarmaceuticoResponse>(
      FARMACIA_ADMIN_ENDPOINTS.ADD_FARMACEUTICO,
      data
    );

    console.log('[FarmaciaAdminService] Farmacêutico cadastrado com sucesso:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('[FarmaciaAdminService] Erro ao cadastrar farmacêutico:', error);

    if (error.response?.data) {
      throw new Error(error.response.data.message || 'Erro ao cadastrar farmacêutico');
    }

    throw new Error('Erro de conexão. Verifique sua internet e tente novamente.');
  }
};

/**
 * Adicionar produto ao estoque da farmácia
 * Requer: ROLE_LOJISTA_ADMIN
 */
export const addEstoque = async (
  data: AddEstoqueRequest
): Promise<AddEstoqueResponse> => {
  try {
    console.log('[FarmaciaAdminService] Adicionando produto ao estoque:', {
      produtoId: data.produtoId,
      preco: data.preco,
      quantidade: data.quantidade,
    });

    const response = await api.post<AddEstoqueResponse>(
      FARMACIA_ADMIN_ENDPOINTS.ADD_ESTOQUE,
      data
    );

    console.log('[FarmaciaAdminService] Produto adicionado ao estoque:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('[FarmaciaAdminService] Erro ao adicionar produto ao estoque:', error);

    if (error.response?.data) {
      throw new Error(error.response.data.message || 'Erro ao adicionar produto ao estoque');
    }

    throw new Error('Erro de conexão. Verifique sua internet e tente novamente.');
  }
};

/**
 * Listar estoque da farmácia
 * Requer: ROLE_LOJISTA_ADMIN
 */
export const listEstoque = async (): Promise<EstoqueListResponse> => {
  try {
    console.log('[FarmaciaAdminService] Listando estoque da farmácia');

    const response = await api.get<EstoqueListResponse>(
      FARMACIA_ADMIN_ENDPOINTS.LIST_ESTOQUE
    );

    console.log('[FarmaciaAdminService] Estoque obtido:', {
      total: response.data.total,
      items: response.data.items.length,
    });

    return response.data;
  } catch (error: any) {
    console.error('[FarmaciaAdminService] Erro ao listar estoque:', error);

    if (error.response?.data) {
      throw new Error(error.response.data.message || 'Erro ao listar estoque');
    }

    throw new Error('Erro de conexão. Verifique sua internet e tente novamente.');
  }
};

/**
 * Atualizar item do estoque
 * Requer: ROLE_LOJISTA_ADMIN
 */
export const updateEstoque = async (
  estoqueId: number,
  data: UpdateEstoqueRequest
): Promise<UpdateEstoqueResponse> => {
  try {
    console.log('[FarmaciaAdminService] Atualizando item do estoque:', {
      estoqueId,
      ...data,
    });

    const response = await api.put<UpdateEstoqueResponse>(
      FARMACIA_ADMIN_ENDPOINTS.UPDATE_ESTOQUE(estoqueId),
      data
    );

    console.log('[FarmaciaAdminService] Item do estoque atualizado:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('[FarmaciaAdminService] Erro ao atualizar estoque:', error);

    if (error.response?.data) {
      throw new Error(error.response.data.message || 'Erro ao atualizar estoque');
    }

    throw new Error('Erro de conexão. Verifique sua internet e tente novamente.');
  }
};

/**
 * Deletar item do estoque
 * Requer: ROLE_LOJISTA_ADMIN
 */
export const deleteEstoque = async (estoqueId: number): Promise<{ success: boolean; message: string }> => {
  try {
    console.log('[FarmaciaAdminService] Deletando item do estoque:', estoqueId);

    const response = await api.delete<{ success: boolean; message: string }>(
      FARMACIA_ADMIN_ENDPOINTS.DELETE_ESTOQUE(estoqueId)
    );

    console.log('[FarmaciaAdminService] Item do estoque deletado:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('[FarmaciaAdminService] Erro ao deletar item do estoque:', error);

    if (error.response?.data) {
      throw new Error(error.response.data.message || 'Erro ao deletar item do estoque');
    }

    throw new Error('Erro de conexão. Verifique sua internet e tente novamente.');
  }
};

/**
 * ========================================
 * GERENCIAMENTO DE FARMACÊUTICOS
 * ========================================
 */

/**
 * Listar farmacêuticos da farmácia
 * Requer: ROLE_LOJISTA_ADMIN
 */
export const listFarmaceuticos = async (): Promise<Farmaceutico[]> => {
  try {
    console.log('[FarmaciaAdminService] Listando farmacêuticos');

    const response = await api.get<Farmaceutico[]>(
      FARMACIA_ADMIN_ENDPOINTS.LIST_FARMACEUTICOS
    );

    console.log('[FarmaciaAdminService] Farmacêuticos encontrados:', response.data.length);
    return response.data;
  } catch (error: any) {
    console.error('[FarmaciaAdminService] Erro ao listar farmacêuticos:', error);

    if (error.response?.data) {
      throw new Error(error.response.data.message || 'Erro ao listar farmacêuticos');
    }

    throw new Error('Erro de conexão. Verifique sua internet e tente novamente.');
  }
};

/**
 * Atualizar dados de um farmacêutico
 * Requer: ROLE_LOJISTA_ADMIN
 */
export const updateFarmaceutico = async (
  farmaceuticoId: number,
  data: UpdateFarmaceuticoRequest
): Promise<Farmaceutico> => {
  try {
    console.log('[FarmaciaAdminService] Atualizando farmacêutico:', {
      farmaceuticoId,
      ...data,
    });

    const response = await api.put<Farmaceutico>(
      FARMACIA_ADMIN_ENDPOINTS.UPDATE_FARMACEUTICO(farmaceuticoId),
      data
    );

    console.log('[FarmaciaAdminService] Farmacêutico atualizado:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('[FarmaciaAdminService] Erro ao atualizar farmacêutico:', error);

    if (error.response?.data) {
      throw new Error(error.response.data.message || 'Erro ao atualizar farmacêutico');
    }

    throw new Error('Erro de conexão. Verifique sua internet e tente novamente.');
  }
};

/**
 * Desativar um farmacêutico
 * Requer: ROLE_LOJISTA_ADMIN
 */
export const desativarFarmaceutico = async (farmaceuticoId: number): Promise<{ success: boolean; message: string }> => {
  try {
    console.log('[FarmaciaAdminService] Desativando farmacêutico:', farmaceuticoId);

    const response = await api.post<{ success: boolean; message: string }>(
      FARMACIA_ADMIN_ENDPOINTS.DESATIVAR_FARMACEUTICO(farmaceuticoId)
    );

    console.log('[FarmaciaAdminService] Farmacêutico desativado:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('[FarmaciaAdminService] Erro ao desativar farmacêutico:', error);

    if (error.response?.data) {
      throw new Error(error.response.data.message || 'Erro ao desativar farmacêutico');
    }

    throw new Error('Erro de conexão. Verifique sua internet e tente novamente.');
  }
};

/**
 * Reativar um farmacêutico
 * Requer: ROLE_LOJISTA_ADMIN
 */
export const reativarFarmaceutico = async (farmaceuticoId: number): Promise<{ success: boolean; message: string }> => {
  try {
    console.log('[FarmaciaAdminService] Reativando farmacêutico:', farmaceuticoId);

    const response = await api.post<{ success: boolean; message: string }>(
      FARMACIA_ADMIN_ENDPOINTS.REATIVAR_FARMACEUTICO(farmaceuticoId)
    );

    console.log('[FarmaciaAdminService] Farmacêutico reativado:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('[FarmaciaAdminService] Erro ao reativar farmacêutico:', error);

    if (error.response?.data) {
      throw new Error(error.response.data.message || 'Erro ao reativar farmacêutico');
    }

    throw new Error('Erro de conexão. Verifique sua internet e tente novamente.');
  }
};

/**
 * Excluir um farmacêutico
 * Requer: ROLE_LOJISTA_ADMIN
 */
export const excluirFarmaceutico = async (farmaceuticoId: number): Promise<{ success: boolean; message: string }> => {
  try {
    console.log('[FarmaciaAdminService] Excluindo farmacêutico:', farmaceuticoId);

    const response = await api.delete<{ success: boolean; message: string }>(
      FARMACIA_ADMIN_ENDPOINTS.DELETE_FARMACEUTICO(farmaceuticoId)
    );

    console.log('[FarmaciaAdminService] Farmacêutico excluído:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('[FarmaciaAdminService] Erro ao excluir farmacêutico:', error);

    if (error.response?.data) {
      throw new Error(error.response.data.message || 'Erro ao excluir farmacêutico');
    }

    throw new Error('Erro de conexão. Verifique sua internet e tente novamente.');
  }
};

/**
 * ========================================
 * GERENCIAMENTO DA FARMÁCIA
 * ========================================
 */

/**
 * Obter informações completas da farmácia
 * Requer: ROLE_LOJISTA_ADMIN
 */
export const getMinhaFarmacia = async (): Promise<FarmaciaCompleta> => {
  try {
    console.log('[FarmaciaAdminService] Obtendo informações da farmácia');

    const response = await api.get<FarmaciaCompleta>(
      FARMACIA_ADMIN_ENDPOINTS.GET_MINHA_FARMACIA
    );

    console.log('[FarmaciaAdminService] Farmácia obtida:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('[FarmaciaAdminService] Erro ao obter farmácia:', error);

    if (error.response?.data) {
      throw new Error(error.response.data.message || 'Erro ao obter informações da farmácia');
    }

    throw new Error('Erro de conexão. Verifique sua internet e tente novamente.');
  }
};

/**
 * Atualizar informações básicas da farmácia
 * Requer: ROLE_LOJISTA_ADMIN
 */
export const updateFarmaciaInfo = async (data: UpdateFarmaciaInfoRequest): Promise<FarmaciaCompleta> => {
  try {
    console.log('[FarmaciaAdminService] Atualizando informações da farmácia:', data);

    const response = await api.put<FarmaciaCompleta>(
      FARMACIA_ADMIN_ENDPOINTS.UPDATE_FARMACIA_INFO,
      data
    );

    console.log('[FarmaciaAdminService] Informações atualizadas:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('[FarmaciaAdminService] Erro ao atualizar informações:', error);

    if (error.response?.data) {
      throw new Error(error.response.data.message || 'Erro ao atualizar informações');
    }

    throw new Error('Erro de conexão. Verifique sua internet e tente novamente.');
  }
};

/**
 * Atualizar endereço da farmácia
 * Requer: ROLE_LOJISTA_ADMIN
 */
export const updateFarmaciaEndereco = async (data: UpdateFarmaciaEnderecoRequest): Promise<FarmaciaCompleta> => {
  try {
    console.log('[FarmaciaAdminService] Atualizando endereço da farmácia:', data);

    const response = await api.put<FarmaciaCompleta>(
      FARMACIA_ADMIN_ENDPOINTS.UPDATE_FARMACIA_ENDERECO,
      data
    );

    console.log('[FarmaciaAdminService] Endereço atualizado:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('[FarmaciaAdminService] Erro ao atualizar endereço:', error);

    if (error.response?.data) {
      throw new Error(error.response.data.message || 'Erro ao atualizar endereço');
    }

    throw new Error('Erro de conexão. Verifique sua internet e tente novamente.');
  }
};

/**
 * Atualizar conta bancária da farmácia
 * Requer: ROLE_LOJISTA_ADMIN
 */
export const updateFarmaciaContaBancaria = async (
  data: UpdateFarmaciaContaBancariaRequest
): Promise<FarmaciaCompleta> => {
  try {
    console.log('[FarmaciaAdminService] Atualizando conta bancária da farmácia');

    const response = await api.put<FarmaciaCompleta>(
      FARMACIA_ADMIN_ENDPOINTS.UPDATE_FARMACIA_CONTA,
      data
    );

    console.log('[FarmaciaAdminService] Conta bancária atualizada:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('[FarmaciaAdminService] Erro ao atualizar conta bancária:', error);

    if (error.response?.data) {
      throw new Error(error.response.data.message || 'Erro ao atualizar conta bancária');
    }

    throw new Error('Erro de conexão. Verifique sua internet e tente novamente.');
  }
};

export default {
  // Farmacêuticos
  addFarmaceutico,
  listFarmaceuticos,
  updateFarmaceutico,
  desativarFarmaceutico,
  reativarFarmaceutico,
  excluirFarmaceutico,
  // Estoque
  addEstoque,
  listEstoque,
  updateEstoque,
  deleteEstoque,
  // Farmácia
  getMinhaFarmacia,
  updateFarmaciaInfo,
  updateFarmaciaEndereco,
  updateFarmaciaContaBancaria,
};
