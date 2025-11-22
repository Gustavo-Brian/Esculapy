/**
 * Componente de Proteção de Rotas
 * Redireciona para login se o usuário não estiver autenticado
 * IMPORTANTE: Redireciona imediatamente quando detecta falta de autenticação
 */

import { useEffect } from 'react';
import { router, usePathname } from 'expo-router';
import { useAuth } from '@/src/hooks/useAuth';
import { ActivityIndicator, View, Text } from 'react-native';
import { temaMedico } from '@/src/estilos/temaMedico';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { authenticated, loading } = useAuth();
  const pathname = usePathname();

  useEffect(() => {
    // Se terminou de carregar e o usuário NÃO está autenticado, redireciona imediatamente
    if (!loading && !authenticated) {
      console.log('🔒 [ProtectedRoute] Usuário não autenticado, redirecionando para /login...');
      console.log('🔒 [ProtectedRoute] Rota atual:', pathname);

      // Redireciona para login (usa replace para não adicionar ao histórico)
      router.replace('/login');
    }
  }, [authenticated, loading, pathname]);

  // Mostra loading enquanto verifica autenticação
  if (loading) {
    return (
      <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: temaMedico.cores.background
      }}>
        <ActivityIndicator size="large" color={temaMedico.cores.primaria} />
        <Text style={{
          marginTop: 16,
          fontSize: 14,
          color: temaMedico.cores.textoClaro
        }}>
          Verificando autenticação...
        </Text>
      </View>
    );
  }

  // Se não estiver autenticado, não renderiza nada (vai redirecionar)
  if (!authenticated) {
    return (
      <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: temaMedico.cores.background
      }}>
        <ActivityIndicator size="large" color={temaMedico.cores.primaria} />
        <Text style={{
          marginTop: 16,
          fontSize: 14,
          color: temaMedico.cores.textoClaro
        }}>
          Redirecionando para login...
        </Text>
      </View>
    );
  }

  // Se estiver autenticado, renderiza o conteúdo
  return <>{children}</>;
};
