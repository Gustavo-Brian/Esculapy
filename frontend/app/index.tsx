/**
 * Index - Rota inicial do app
 * Redireciona automaticamente para a tela home
 */

import { useEffect } from 'react';
import { router } from 'expo-router';

export default function Index() {
  useEffect(() => {
    // Redireciona para home assim que o componente monta
    router.replace('/home');
  }, []);

  return null;
}
