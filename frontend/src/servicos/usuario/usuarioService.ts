/**
 * Serviço de Usuário - Esculapi
 * Gerencia operações relacionadas ao perfil do usuário
 */

import { apiGet, apiPut, apiPost, apiDelete, apiPatch } from '../api/config';
import { USER_ENDPOINTS } from '../api/endpoints';
import {
  User,
  MeResponse,
  UpdateProfileRequest,
  ChangePasswordRequest,
  Address,
  AddressRequest,
  ApiResponse,
  UserRole,
} from '../types/api.types';
import { saveUserData } from '../auth/storage';

/**
 * Busca dados do usuário autenticado do backend (/api/user/me)
 * Retorna dados completos incluindo roles vindos do banco de dados
 * IMPORTANTE: Se backend falhar, usa dados do storage como fallback
 */
export const getMeData = async (loginResponseData?: any): Promise<User> => {
  try {
    console.log('[usuarioService] Buscando dados do usuário do backend...');

    const meResponse = await apiGet<MeResponse>(USER_ENDPOINTS.ME);

    // Converte MeResponse para User
    // Prioriza a primeira role do array (backend sempre retorna array de roles)
    const primaryRole = meResponse.roles && meResponse.roles.length > 0
      ? meResponse.roles[0] as UserRole
      : undefined;

    // Determina o nome baseado no tipo de perfil
    let name = '';
    let phone = '';

    if (meResponse.cliente) {
      name = meResponse.cliente.nome;
    } else if (meResponse.farmaciaAdmin) {
      name = meResponse.farmaciaAdmin.nomeFantasia;
    } else if (meResponse.farmaceutico) {
      name = meResponse.farmaceutico.nome;
    }

    const user: User = {
      id: meResponse.id,
      name: name,
      email: meResponse.email,
      phone: phone,
      role: primaryRole,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Salva os dados completos do usuário
    await saveUserData(user);

    console.log('[usuarioService] ✅ Dados do usuário salvos com sucesso');
    return user;
  } catch (error) {
    console.error('[usuarioService] ❌ Erro ao buscar dados do backend:', error);

    // FALLBACK: Se backend falhar, tenta usar dados do login
    if (loginResponseData) {
      console.log('[usuarioService] ⚠️ Usando dados do login como fallback');

      const fallbackUser: User = {
        id: loginResponseData.id || loginResponseData.usuario?.id || 0,
        name: loginResponseData.nome || loginResponseData.usuario?.nome || '',
        email: loginResponseData.email || loginResponseData.usuario?.email || '',
        phone: loginResponseData.telefone || loginResponseData.usuario?.telefone || '',
        role: loginResponseData.role || loginResponseData.usuario?.role,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      await saveUserData(fallbackUser);
      console.log('[usuarioService] ✅ Dados do fallback salvos com sucesso');
      return fallbackUser;
    }

    // Se não houver fallback, tenta buscar do storage
    console.log('[usuarioService] ⚠️ Tentando buscar do storage como último recurso');
    const { getUserData } = require('../auth/storage');
    const storedUser = await getUserData();

    if (storedUser) {
      console.log('[usuarioService] ✅ Dados recuperados do storage');
      return storedUser;
    }

    // Se nada funcionar, lança erro
    console.error('[usuarioService] ❌ Nenhum dado disponível');
    throw error;
  }
};

/**
 * Busca perfil do usuário
 */
export const getProfile = async (): Promise<User> => {
  try {
    const user = await apiGet<User>(USER_ENDPOINTS.PROFILE);
    await saveUserData(user);
    return user;
  } catch (error) {
    console.error('Erro ao buscar perfil:', error);
    throw error;
  }
};

/**
 * Atualiza dados do perfil
 */
export const updateProfile = async (data: UpdateProfileRequest): Promise<User> => {
  try {
    const user = await apiPut<User>(USER_ENDPOINTS.UPDATE_PROFILE, data);
    await saveUserData(user);
    return user;
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error);
    throw error;
  }
};

/**
 * Altera senha do usuário
 */
export const changePassword = async (data: ChangePasswordRequest): Promise<ApiResponse> => {
  try {
    return await apiPut<ApiResponse>(USER_ENDPOINTS.CHANGE_PASSWORD, data);
  } catch (error) {
    console.error('Erro ao alterar senha:', error);
    throw error;
  }
};

/**
 * Atualiza foto do perfil
 */
export const updatePhoto = async (photoUri: string): Promise<User> => {
  try {
    // Prepara o FormData para upload
    const formData = new FormData();
    formData.append('photo', {
      uri: photoUri,
      type: 'image/jpeg',
      name: 'profile.jpg',
    } as any);

    const user = await apiPost<User>(USER_ENDPOINTS.UPDATE_PHOTO, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    await saveUserData(user);
    return user;
  } catch (error) {
    console.error('Erro ao atualizar foto:', error);
    throw error;
  }
};

// ==================== ENDEREÇOS ====================

/**
 * Lista todos os endereços do usuário
 */
export const getAddresses = async (): Promise<Address[]> => {
  try {
    return await apiGet<Address[]>(USER_ENDPOINTS.ADDRESSES);
  } catch (error) {
    console.error('Erro ao buscar endereços:', error);
    throw error;
  }
};

/**
 * Adiciona novo endereço
 */
export const addAddress = async (data: AddressRequest): Promise<Address> => {
  try {
    return await apiPost<Address>(USER_ENDPOINTS.ADD_ADDRESS, data);
  } catch (error) {
    console.error('Erro ao adicionar endereço:', error);
    throw error;
  }
};

/**
 * Atualiza um endereço existente
 */
export const updateAddress = async (
  addressId: number | string,
  data: AddressRequest
): Promise<Address> => {
  try {
    return await apiPut<Address>(USER_ENDPOINTS.UPDATE_ADDRESS(addressId), data);
  } catch (error) {
    console.error('Erro ao atualizar endereço:', error);
    throw error;
  }
};

/**
 * Remove um endereço
 */
export const deleteAddress = async (addressId: number | string): Promise<ApiResponse> => {
  try {
    return await apiDelete<ApiResponse>(USER_ENDPOINTS.DELETE_ADDRESS(addressId));
  } catch (error) {
    console.error('Erro ao deletar endereço:', error);
    throw error;
  }
};

/**
 * Define um endereço como padrão
 */
export const setDefaultAddress = async (addressId: number | string): Promise<Address> => {
  try {
    return await apiPatch<Address>(USER_ENDPOINTS.SET_DEFAULT_ADDRESS(addressId), {});
  } catch (error) {
    console.error('Erro ao definir endereço padrão:', error);
    throw error;
  }
};

export default {
  getMeData,
  getProfile,
  updateProfile,
  changePassword,
  updatePhoto,
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
};
