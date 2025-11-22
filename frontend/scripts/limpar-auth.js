/**
 * Script para limpar dados de autenticação
 * Execute no console do navegador para forçar novo login
 */

import('@react-native-async-storage/async-storage').then(async (module) => {
  const AsyncStorage = module.default;

  console.log('🧹 Limpando dados de autenticação...');

  // Remove tokens
  await AsyncStorage.removeItem('@esculapi:access_token');
  await AsyncStorage.removeItem('@esculapi:refresh_token');
  await AsyncStorage.removeItem('@esculapi:user_data');

  console.log('✅ Dados removidos! Faça login novamente.');

  // Recarrega a página
  setTimeout(() => {
    window.location.href = '/login';
  }, 1000);
});
