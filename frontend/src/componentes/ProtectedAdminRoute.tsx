/**
 * Componente de Proteção de Rotas Admin
 * Redireciona para login se o usuário não for ROLE_ADMIN
 * IMPORTANTE: Verifica autenticação E role do usuário
 */

import { useEffect, useState } from 'react';
import { router, usePathname } from 'expo-router';
import { ActivityIndicator, View, Text } from 'react-native';
import { temaMedico } from '@/src/estilos/temaMedico';
import { getToken, getUserData } from '@/src/servicos/auth/storage';
import type { User, UserRole } from '@/src/servicos/types/api.types';

interface ProtectedAdminRouteProps {
  children: React.ReactNode;
}

export const ProtectedAdminRoute: React.FC<ProtectedAdminRouteProps> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    try {
      console.log('[ProtectedAdminRoute] Verificando acesso admin...');

      // Verifica se tem token
      const token = await getToken();
      if (!token) {
        console.log('[ProtectedAdminRoute] ❌ Usuário não autenticado');
        router.replace('/login');
        return;
      }

      // Busca dados do usuário do storage
      const userData = await getUserData() as User | null;

      if (!userData) {
        console.log('[ProtectedAdminRoute] ❌ Dados do usuário não encontrados');
        router.replace('/login');
        return;
      }

      // Verifica se o usuário tem role ROLE_ADMIN
      const hasAdminRole = userData.role === 'ROLE_ADMIN';

      console.log('[ProtectedAdminRoute] Verificação de role:', {
        email: userData.email,
        role: userData.role,
        hasAdminRole,
      });

      if (!hasAdminRole) {
        console.log('[ProtectedAdminRoute] ❌ Usuário não tem permissão de admin');
        // Redireciona para home se não for admin
        router.replace('/');
        return;
      }

      console.log('[ProtectedAdminRoute] ✅ Acesso admin concedido');
      setIsAdmin(true);
    } catch (error) {
      console.error('[ProtectedAdminRoute] Erro ao verificar acesso:', error);
      router.replace('/login');
    } finally {
      setLoading(false);
    }
  };

  // Mostra loading enquanto verifica permissões
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
          Verificando permissões...
        </Text>
      </View>
    );
  }

  // Se não for admin, não renderiza nada (vai redirecionar)
  if (!isAdmin) {
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
          Redirecionando...
        </Text>
      </View>
    );
  }

  // Se for admin, renderiza o conteúdo
  return <>{children}</>;
};
