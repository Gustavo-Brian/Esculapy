/**
 * Componente ProtectedFarmaciaRoute
 * Protege rotas que só devem ser acessadas por ROLE_LOJISTA_ADMIN
 */

import { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/src/hooks/useAuth';
import { useRole } from '@/src/hooks/useRole';
import { temaMedico } from '@/src/estilos/temaMedico';

interface ProtectedFarmaciaRouteProps {
  children: React.ReactNode;
}

export function ProtectedFarmaciaRoute({ children }: ProtectedFarmaciaRouteProps) {
  const { user, loading, authenticated } = useAuth();
  const { canManageFarmacia } = useRole();

  useEffect(() => {
    // Só executa verificações quando o loading terminou
    if (!loading) {
      if (!authenticated || !user) {
        // Não logado - redireciona para login
        console.log('🔒 Usuário não autenticado, redirecionando para login...');
        router.replace('/(tabs)/login');
        return;
      }

      if (!canManageFarmacia()) {
        // Logado mas não tem permissão - redireciona para index
        console.log('🚫 Usuário sem permissão para gerenciar farmácia, redirecionando para index...');
        console.log('Role atual:', user.role);
        router.replace('/');
        return;
      }

      // Tem permissão
      console.log('✅ Acesso autorizado ao dashboard da farmácia');
      console.log('Usuário:', user.name, '| Role:', user.role);
    }
  }, [loading, authenticated, user, canManageFarmacia]);

  // Mostra loading enquanto verifica autenticação
  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={temaMedico.cores.primaria} />
      </View>
    );
  }

  // Se não estiver autenticado ou sem permissão, não renderiza (vai redirecionar)
  if (!authenticated || !user || !canManageFarmacia()) {
    return null;
  }

  // Tem permissão, renderiza o conteúdo
  return <>{children}</>;
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: temaMedico.cores.background,
  },
});
