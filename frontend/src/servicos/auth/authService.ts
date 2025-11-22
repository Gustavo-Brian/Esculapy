/**
 * Serviço de Autenticação - Esculapi
 * Gerencia login, registro, logout e refresh token
 */

import { apiPost } from '../api/config';
import { AUTH_ENDPOINTS } from '../api/endpoints';
import {
  LoginRequest,
  LoginClienteRequest,
  LoginClienteResponse,
  RegisterRequest,
  RegisterClienteRequest,
  RegisterClienteResponse,
  RegisterFarmaciaRequest,
  RegisterFarmaciaResponse,
  AuthResponse,
  User,
  ApiResponse,
} from '../types/api.types';
import {
  saveToken,
  saveRefreshToken,
  saveUserData,
  clearAuthData,
  getRefreshToken,
} from './storage';

/**
 * Realiza login do usuário
 */
export const login = async (credentials: LoginRequest): Promise<AuthResponse> => {
  try {
    const response = await apiPost<AuthResponse>(AUTH_ENDPOINTS.LOGIN, credentials);

    // Salva token e dados do usuário
    await saveToken(response.access_token);
    if (response.refresh_token) {
      await saveRefreshToken(response.refresh_token);
    }
    await saveUserData(response.user);

    return response;
  } catch (error) {
    console.error('Erro no login:', error);
    throw error;
  }
};

/**
 * Realiza login do cliente
 * Endpoint: POST /api/auth/login
 */
export const loginCliente = async (
  credentials: LoginClienteRequest
): Promise<LoginClienteResponse> => {
  try {
    // Validações locais antes de enviar
    if (!credentials.email || !isValidEmail(credentials.email)) {
      throw new Error('Email inválido');
    }

    if (!credentials.senha || credentials.senha.length < 6) {
      throw new Error('Senha deve ter no mínimo 6 caracteres');
    }

    const response = await apiPost<LoginClienteResponse>(
      AUTH_ENDPOINTS.LOGIN,
      credentials
    );

    // Salva token retornado
    await saveToken(response.token);

    // Busca dados completos do usuário do backend (incluindo role do banco de dados)
    // Passa os dados do login como fallback caso /user/me falhe
    const { getMeData } = require('../usuario/usuarioService');
    await getMeData(response.usuario);

    return response;
  } catch (error) {
    console.error('Erro no login de cliente:', error);
    throw error;
  }
};

/**
 * Registra novo usuário
 */
export const register = async (userData: RegisterRequest): Promise<AuthResponse> => {
  try {
    const response = await apiPost<AuthResponse>(AUTH_ENDPOINTS.REGISTER, userData);

    // Salva token e dados do usuário
    await saveToken(response.access_token);
    if (response.refresh_token) {
      await saveRefreshToken(response.refresh_token);
    }
    await saveUserData(response.user);

    return response;
  } catch (error) {
    console.error('Erro no registro:', error);
    throw error;
  }
};

/**
 * Registra novo cliente
 * Endpoint: POST /api/auth/register/cliente
 */
export const registerCliente = async (
  userData: RegisterClienteRequest
): Promise<RegisterClienteResponse> => {
  try {
    // Validações locais antes de enviar
    if (!userData.nome || userData.nome.length < 3) {
      throw new Error('Nome deve ter no mínimo 3 caracteres');
    }

    if (!userData.email || !isValidEmail(userData.email)) {
      throw new Error('Email inválido');
    }

    if (!userData.senha || userData.senha.length < 6) {
      throw new Error('Senha deve ter no mínimo 6 caracteres');
    }

    if (!userData.cpf) {
      throw new Error('CPF é obrigatório');
    }

    const response = await apiPost<RegisterClienteResponse>(
      AUTH_ENDPOINTS.REGISTER_CLIENTE,
      userData
    );

    // Salva token retornado
    await saveToken(response.token);

    // Busca dados completos do usuário do backend (incluindo role do banco de dados)
    // Passa os dados do registro como fallback caso /user/me falhe
    const { getMeData } = require('../usuario/usuarioService');
    await getMeData(response.usuario);

    return response;
  } catch (error) {
    console.error('Erro no registro de cliente:', error);
    throw error;
  }
};

/**
 * Registra nova farmácia
 * Endpoint: POST /api/auth/register/farmacia
 */
export const registerFarmacia = async (
  userData: RegisterFarmaciaRequest
): Promise<RegisterFarmaciaResponse> => {
  try {
    console.log('[authService.registerFarmacia] ============ FUNÇÃO CHAMADA ============');
    console.log('[authService.registerFarmacia] Dados recebidos:', JSON.stringify(userData, null, 2));
    console.log('[authService.registerFarmacia] Iniciando validações...');

    // Validações locais antes de enviar
    if (!userData.email || !isValidEmail(userData.email)) {
      throw new Error('Email inválido');
    }

    if (!userData.emailContato || !isValidEmail(userData.emailContato)) {
      throw new Error('Email de contato inválido');
    }

    if (!userData.senha || userData.senha.length < 6) {
      throw new Error('Senha deve ter no mínimo 6 caracteres');
    }

    if (!userData.cnpj) {
      throw new Error('CNPJ é obrigatório');
    }

    if (!userData.razaoSocial || userData.razaoSocial.length < 3) {
      throw new Error('Razão Social deve ter no mínimo 3 caracteres');
    }

    if (!userData.nomeFantasia || userData.nomeFantasia.length < 3) {
      throw new Error('Nome Fantasia deve ter no mínimo 3 caracteres');
    }

    if (!userData.crfJ) {
      throw new Error('CRF-J é obrigatório');
    }

    if (!userData.numeroCelularContato) {
      throw new Error('Número de celular de contato é obrigatório');
    }

    console.log('[authService.registerFarmacia] Validações concluídas com sucesso!');
    console.log('[authService.registerFarmacia] Endpoint:', AUTH_ENDPOINTS.REGISTER_FARMACIA);
    console.log('[authService.registerFarmacia] Fazendo requisição POST...');

    const response = await apiPost<RegisterFarmaciaResponse>(
      AUTH_ENDPOINTS.REGISTER_FARMACIA,
      userData
    );

    console.log('[authService.registerFarmacia] Requisição concluída! Resposta:', response);

    // Salva token retornado
    await saveToken(response.token);

    // Busca dados completos do usuário do backend (incluindo role do banco de dados)
    // Passa os dados do registro como fallback caso /user/me falhe
    const { getMeData } = require('../usuario/usuarioService');
    await getMeData(response.usuario);

    return response;
  } catch (error) {
    console.error('Erro no registro de farmácia:', error);
    throw error;
  }
};

/**
 * Valida formato de email
 */
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Realiza logout do usuário
 */
export const logout = async (): Promise<void> => {
  try {
    // Tenta fazer logout no servidor
    await apiPost(AUTH_ENDPOINTS.LOGOUT);
  } catch (error) {
    console.error('Erro ao fazer logout no servidor:', error);
    // Continua mesmo com erro no servidor
  } finally {
    // Sempre limpa dados locais
    await clearAuthData();
  }
};

/**
 * Renova o token de acesso usando refresh token
 */
export const refreshAccessToken = async (): Promise<string> => {
  try {
    const refreshToken = await getRefreshToken();

    if (!refreshToken) {
      throw new Error('Refresh token não encontrado');
    }

    const response = await apiPost<{ access_token: string }>(
      AUTH_ENDPOINTS.REFRESH_TOKEN,
      { refresh_token: refreshToken }
    );

    await saveToken(response.access_token);

    return response.access_token;
  } catch (error) {
    console.error('Erro ao renovar token:', error);
    // Se falhar, faz logout
    await clearAuthData();
    throw error;
  }
};

/**
 * Envia email para recuperação de senha
 */
export const forgotPassword = async (email: string): Promise<ApiResponse> => {
  try {
    return await apiPost<ApiResponse>(AUTH_ENDPOINTS.FORGOT_PASSWORD, { email });
  } catch (error) {
    console.error('Erro ao enviar email de recuperação:', error);
    throw error;
  }
};

/**
 * Reseta a senha com o token recebido por email
 */
export const resetPassword = async (
  token: string,
  password: string,
  passwordConfirmation: string
): Promise<ApiResponse> => {
  try {
    return await apiPost<ApiResponse>(AUTH_ENDPOINTS.RESET_PASSWORD, {
      token,
      password,
      password_confirmation: passwordConfirmation,
    });
  } catch (error) {
    console.error('Erro ao resetar senha:', error);
    throw error;
  }
};

/**
 * Verifica email do usuário
 */
export const verifyEmail = async (token: string): Promise<ApiResponse> => {
  try {
    return await apiPost<ApiResponse>(AUTH_ENDPOINTS.VERIFY_EMAIL, { token });
  } catch (error) {
    console.error('Erro ao verificar email:', error);
    throw error;
  }
};

/**
 * Busca dados do usuário atual
 * Agora busca diretamente do backend para garantir que temos a role correta
 */
export const getCurrentUser = async (): Promise<User> => {
  try {
    const { getMeData } = require('../usuario/usuarioService');
    return await getMeData();
  } catch (error) {
    console.error('Erro ao buscar usuário atual:', error);
    // Se falhar ao buscar do backend, tenta buscar do storage
    const { getUserData } = require('./storage');
    return await getUserData();
  }
};

export default {
  login,
  loginCliente,
  register,
  registerCliente,
  registerFarmacia,
  logout,
  refreshAccessToken,
  forgotPassword,
  resetPassword,
  verifyEmail,
  getCurrentUser,
};
