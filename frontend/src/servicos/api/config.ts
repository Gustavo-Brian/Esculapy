/**
 * Configuração Base da API - Esculapi
 * Axios instance com configurações centralizadas
 */

import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { Platform } from 'react-native';
import { getToken } from '../auth/storage';

/**
 * URL base da API - Configuração automática por plataforma
 *
 * IMPORTANTE: Para testar em dispositivo físico (celular/tablet):
 * 1. Descubra o IP da sua máquina:
 *    - Windows: execute 'ipconfig' no CMD e procure "IPv4 Address"
 *    - Mac/Linux: execute 'ifconfig' e procure "inet"
 * 2. Substitua o valor de LOCAL_NETWORK_IP abaixo (ex: '192.168.1.100')
 * 3. Certifique-se de que o dispositivo está na mesma rede Wi-Fi
 */

const SERVER_PORT = '8080';

// ⚠️ CONFIGURAÇÃO: IP da máquina na rede local
// INSTRUÇÕES:
// 1. Execute 'ipconfig' no CMD/PowerShell
// 2. Procure por "Endereço IPv4" (ex: 192.168.1.100)
// 3. Substitua o IP abaixo
// 4. Certifique-se que o celular está na mesma rede Wi-Fi
const LOCAL_NETWORK_IP = '192.168.1.8'; // ⚠️ ALTERE AQUI com o IP da sua máquina

/**
 * Determina a URL base correta de acordo com a plataforma
 */
const getApiBaseUrl = (): string => {
  if (!__DEV__) {
    // Produção
    return 'https://api.esculapi.com.br/api';
  }

  // Desenvolvimento - detecta a plataforma
  if (Platform.OS === 'web') {
    // Web: usa localhost
    return `http://localhost:${SERVER_PORT}/api`;
  } else if (Platform.OS === 'android') {
    // Android: tenta usar IP local (para dispositivos físicos)
    // Se estiver usando emulador e não funcionar, use: 10.0.2.2
    return `http://${LOCAL_NETWORK_IP}:${SERVER_PORT}/api`;
  } else if (Platform.OS === 'ios') {
    // iOS: usa IP local (funciona em simulador e dispositivo físico)
    return `http://${LOCAL_NETWORK_IP}:${SERVER_PORT}/api`;
  }

  // Fallback
  return `http://localhost:${SERVER_PORT}/api`;
};

const API_BASE_URL = getApiBaseUrl();

// Log da URL sendo usada (apenas em desenvolvimento)
if (__DEV__) {
  console.log(`🌐 API configurada para: ${API_BASE_URL}`);
  console.log(`📱 Plataforma: ${Platform.OS}`);
}

/**
 * Timeout padrão das requisições (10 segundos)
 */
const API_TIMEOUT = 10000;

/**
 * Instância do Axios configurada
 */
export const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

/**
 * Rotas públicas que NÃO devem ter token de autenticação
 * IMPORTANTE: Usa Set para performance O(1)
 */
const PUBLIC_ENDPOINTS = new Set([
  '/auth/login',
  '/auth/register',
  '/auth/register/cliente',
  '/auth/register/farmacia',
  '/auth/forgot-password',
  '/auth/reset-password',
  '/auth/verify-email',
]);

/**
 * Padrões de rotas públicas (para GET apenas)
 */
const PUBLIC_GET_PATTERNS = [
  '/products',
  '/sellers',
  '/produtos',
];

/**
 * Verifica se a URL é uma rota pública
 * CRÍTICO: Método robusto que evita falsos positivos
 */
const isPublicRoute = (url?: string, method?: string): boolean => {
  if (!url) return false;

  // Remove domínio, /api prefix e query params
  const cleanUrl = url
    .replace(/^https?:\/\/[^\/]+/, '')
    .replace('/api', '')
    .split('?')[0];

  // Verifica rotas públicas exatas (qualquer método)
  if (PUBLIC_ENDPOINTS.has(cleanUrl)) return true;

  // Verifica padrões GET públicos
  if (method?.toUpperCase() === 'GET') {
    return PUBLIC_GET_PATTERNS.some(pattern => cleanUrl.startsWith(pattern));
  }

  return false;
};

/**
 * Interceptor de Request
 * CRÍTICO: Remove token de rotas públicas, adiciona em protegidas
 */
api.interceptors.request.use(
  async (config) => {
    const method = config.method?.toUpperCase();
    const isPublic = isPublicRoute(config.url, config.method);

    if (!isPublic) {
      // Rota protegida - adiciona token
      const token = await getToken();

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log('🔑 Token adicionado (rota protegida)');
      } else {
        console.warn('⚠️ Sem token (rota protegida)');
      }
    } else {
      // Rota pública - GARANTE que não tem token
      delete config.headers.Authorization;
      console.log('🌐 Rota pública - token removido');
    }

    // Log para debug
    if (__DEV__) {
      console.log('🚀 API Request:', {
        method,
        url: config.url,
        isPublic,
        hasToken: !!config.headers.Authorization,
      });
    }

    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

/**
 * Interceptor de Response
 * Trata erros globais e formata respostas
 */
api.interceptors.response.use(
  (response) => {
    // Log para debug (apenas em desenvolvimento)
    if (__DEV__) {
      console.log('✅ API Response:', {
        status: response.status,
        url: response.config.url,
        data: response.data,
      });
    }

    return response;
  },
  (error) => {
    // Log de erro
    console.error('❌ API Error:', {
      status: error.response?.status,
      url: error.config?.url,
      message: error.response?.data?.message || error.message,
    });

    // Tratamento de erros específicos
    if (error.response) {
      // Servidor respondeu com status de erro
      const { status, data } = error.response;

      switch (status) {
        case 401:
          // Token inválido ou expirado
          console.log('🔐 Token inválido - Redirecionando para login...');
          // TODO: Implementar logout e redirect
          break;

        case 403:
          // Sem permissão
          console.log('🚫 Acesso negado');
          break;

        case 404:
          // Recurso não encontrado
          console.log('🔍 Recurso não encontrado');
          break;

        case 500:
          // Erro do servidor
          console.log('⚠️ Erro interno do servidor');
          break;

        default:
          console.log(`⚠️ Erro ${status}`);
      }

      return Promise.reject(data);
    } else if (error.request) {
      // Requisição foi feita mas não houve resposta
      console.error('📡 Erro de rede - Sem resposta do servidor');
      return Promise.reject({
        message: 'Erro de conexão. Verifique sua internet.',
      });
    } else {
      // Erro na configuração da requisição
      console.error('⚙️ Erro na configuração:', error.message);
      return Promise.reject({
        message: 'Erro ao processar requisição.',
      });
    }
  }
);

/**
 * Tipo para respostas do backend que usam ApiResponse<T>
 */
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

/**
 * Helper para requisições GET
 * Extrai automaticamente o campo 'data' do ApiResponse do backend
 */
export const apiGet = async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
  const response = await api.get<ApiResponse<T>>(url, config);
  // Se a resposta tem o campo 'data', extrai ele (ApiResponse)
  // Senão, retorna a resposta diretamente (para compatibilidade)
  const responseData: any = response.data;

  if (__DEV__) {
    console.log('🔍 apiGet - Response structure:', {
      url,
      hasDataField: responseData.data !== undefined,
      dataType: Array.isArray(responseData.data) ? 'array' : typeof responseData.data,
      dataLength: Array.isArray(responseData.data) ? responseData.data.length : 'N/A',
    });
  }

  return responseData.data !== undefined ? responseData.data : responseData;
};

/**
 * Helper para requisições POST
 * Extrai automaticamente o campo 'data' do ApiResponse do backend
 */
export const apiPost = async <T>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<T> => {
  const response = await api.post<ApiResponse<T>>(url, data, config);
  const responseData: any = response.data;
  return responseData.data !== undefined ? responseData.data : responseData;
};

/**
 * Helper para requisições PUT
 * Extrai automaticamente o campo 'data' do ApiResponse do backend
 */
export const apiPut = async <T>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<T> => {
  const response = await api.put<ApiResponse<T>>(url, data, config);
  const responseData: any = response.data;
  return responseData.data !== undefined ? responseData.data : responseData;
};

/**
 * Helper para requisições PATCH
 * Extrai automaticamente o campo 'data' do ApiResponse do backend
 */
export const apiPatch = async <T>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<T> => {
  const response = await api.patch<ApiResponse<T>>(url, data, config);
  const responseData: any = response.data;
  return responseData.data !== undefined ? responseData.data : responseData;
};

/**
 * Helper para requisições DELETE
 * Extrai automaticamente o campo 'data' do ApiResponse do backend
 */
export const apiDelete = async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
  const response = await api.delete<ApiResponse<T>>(url, config);
  const responseData: any = response.data;
  return responseData.data !== undefined ? responseData.data : responseData;
};

export default api;
