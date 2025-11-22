/**
 * Storage de Autenticação - Esculapi
 * Gerencia armazenamento de tokens e dados de autenticação
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Chaves do AsyncStorage - Padronizadas
 * IMPORTANTE: Usar APENAS estas chaves em todo o app
 */
const STORAGE_KEYS = {
  TOKEN: '@esculapi:token',           // Chave principal de token
  REFRESH_TOKEN: '@esculapi:refresh_token',
  USER: '@esculapi:user',             // Chave principal de usuário
  ROLE: '@esculapi:role',             // Chave principal de role
};

/**
 * Chaves antigas/legadas que devem ser limpas
 * Para garantir compatibilidade e limpeza completa
 */
const LEGACY_KEYS = [
  '@esculapi:access_token',  // Antiga
  '@esculapi:user_data',     // Antiga
  '@auth:token',             // Antiga (useAuth.ts)
  '@auth:usuario',           // Antiga (useAuth.ts)
  '@auth:role',              // Antiga (registro farmácia)
];

/**
 * Salva o token de acesso
 */
export const saveToken = async (token: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.TOKEN, token);
  } catch (error) {
    console.error('[storage] Erro ao salvar token:', error);
    throw error;
  }
};

/**
 * Busca o token de acesso
 * IMPORTANTE: Tenta chaves antigas para compatibilidade
 */
export const getToken = async (): Promise<string | null> => {
  try {
    // Tenta chave nova primeiro
    let token = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);
    if (token) return token;

    // Tenta chaves antigas para migração
    for (const legacyKey of ['@esculapi:access_token', '@auth:token']) {
      token = await AsyncStorage.getItem(legacyKey);
      if (token) {
        // Migra para chave nova
        await saveToken(token);
        await AsyncStorage.removeItem(legacyKey);
        return token;
      }
    }

    return null;
  } catch (error) {
    console.error('[storage] Erro ao buscar token:', error);
    return null;
  }
};

/**
 * Remove o token de acesso
 */
export const removeToken = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.TOKEN);
  } catch (error) {
    console.error('[storage] Erro ao remover token:', error);
    throw error;
  }
};

/**
 * Salva o refresh token
 */
export const saveRefreshToken = async (refreshToken: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
  } catch (error) {
    console.error('Erro ao salvar refresh token:', error);
    throw error;
  }
};

/**
 * Busca o refresh token
 */
export const getRefreshToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
  } catch (error) {
    console.error('Erro ao buscar refresh token:', error);
    return null;
  }
};

/**
 * Remove o refresh token
 */
export const removeRefreshToken = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
  } catch (error) {
    console.error('Erro ao remover refresh token:', error);
    throw error;
  }
};

/**
 * Salva dados do usuário (com role incluído)
 */
export const saveUserData = async (userData: any): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
    // Salva role separadamente para compatibilidade
    if (userData.tipo || userData.role) {
      await saveRole(userData.tipo || userData.role);
    }
  } catch (error) {
    console.error('[storage] Erro ao salvar dados do usuário:', error);
    throw error;
  }
};

/**
 * Busca dados do usuário
 * IMPORTANTE: Tenta chaves antigas para compatibilidade
 */
export const getUserData = async (): Promise<any | null> => {
  try {
    // Tenta chave nova primeiro
    let userData = await AsyncStorage.getItem(STORAGE_KEYS.USER);
    if (userData) return JSON.parse(userData);

    // Tenta chaves antigas para migração
    for (const legacyKey of ['@esculapi:user_data', '@auth:usuario']) {
      userData = await AsyncStorage.getItem(legacyKey);
      if (userData) {
        const parsed = JSON.parse(userData);
        // Migra para chave nova
        await saveUserData(parsed);
        await AsyncStorage.removeItem(legacyKey);
        return parsed;
      }
    }

    return null;
  } catch (error) {
    console.error('[storage] Erro ao buscar dados do usuário:', error);
    return null;
  }
};

/**
 * Remove dados do usuário
 */
export const removeUserData = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.USER);
  } catch (error) {
    console.error('[storage] Erro ao remover dados do usuário:', error);
    throw error;
  }
};

/**
 * Salva role do usuário
 */
export const saveRole = async (role: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.ROLE, role);
  } catch (error) {
    console.error('[storage] Erro ao salvar role:', error);
    throw error;
  }
};

/**
 * Busca role do usuário
 */
export const getRole = async (): Promise<string | null> => {
  try {
    // Tenta chave nova primeiro
    let role = await AsyncStorage.getItem(STORAGE_KEYS.ROLE);
    if (role) return role;

    // Tenta chave antiga
    role = await AsyncStorage.getItem('@auth:role');
    if (role) {
      await saveRole(role);
      await AsyncStorage.removeItem('@auth:role');
      return role;
    }

    // Tenta buscar do userData
    const userData = await getUserData();
    return userData?.tipo || userData?.role || null;
  } catch (error) {
    console.error('[storage] Erro ao buscar role:', error);
    return null;
  }
};

/**
 * Remove role do usuário
 */
export const removeRole = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.ROLE);
  } catch (error) {
    console.error('[storage] Erro ao remover role:', error);
    throw error;
  }
};

/**
 * Limpa todos os dados de autenticação (logout completo)
 * IMPORTANTE: Limpa TODAS as chaves (novas + legadas)
 */
export const clearAuthData = async (): Promise<void> => {
  try {
    console.log('[storage] Limpando TODOS os dados de autenticação...');

    // Remove chaves atuais
    await Promise.all([
      removeToken(),
      removeRefreshToken(),
      removeUserData(),
      removeRole(),
    ]);

    // Remove chaves legadas para garantir limpeza completa
    await Promise.all(
      LEGACY_KEYS.map(key => AsyncStorage.removeItem(key))
    );

    console.log('[storage] ✅ Todos os dados de autenticação limpos');
  } catch (error) {
    console.error('[storage] ❌ Erro ao limpar dados de autenticação:', error);
    throw error;
  }
};

/**
 * Verifica se usuário está autenticado
 */
export const isAuthenticated = async (): Promise<boolean> => {
  try {
    const token = await getToken();
    return !!token;
  } catch (error) {
    console.error('Erro ao verificar autenticação:', error);
    return false;
  }
};
