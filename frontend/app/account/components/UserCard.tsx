/**
 * UserCard Component
 * Card com informações do usuário
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { temaMedico } from '@/src/estilos/temaMedico';

interface User {
  name?: string;
  email?: string;
  role?: string;
  phone?: string;
}

interface UserCardProps {
  user: User | null;
}

export const UserCard: React.FC<UserCardProps> = ({ user }) => {
  const getRoleLabel = (role?: string) => {
    if (!role) return null;
    switch (role) {
      case 'ROLE_LOJISTA_ADMIN':
        return 'Administrador';
      case 'ROLE_FARMACEUTICO':
        return 'Farmacêutico';
      case 'ROLE_CLIENTE':
        return 'Cliente';
      default:
        return role;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.avatar}>
        <Ionicons name="person" size={40} color={temaMedico.cores.primaria} />
      </View>
      <View style={styles.info}>
        <Text style={styles.name}>{user?.name || 'Usuário'}</Text>
        <Text style={styles.email}>{user?.email || 'email@exemplo.com'}</Text>
        {user?.role && (
          <View style={styles.roleBadge}>
            <Text style={styles.roleText}>{getRoleLabel(user.role)}</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: temaMedico.cores.backgroundCard,
    padding: 20,
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 12,
    gap: 16,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: temaMedico.cores.backgroundDestaque,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
    gap: 4,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: temaMedico.cores.textoPrimario,
  },
  email: {
    fontSize: 14,
    color: temaMedico.cores.textoSecundario,
  },
  roleBadge: {
    alignSelf: 'flex-start',
    backgroundColor: temaMedico.cores.primaria + '20',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 4,
  },
  roleText: {
    fontSize: 12,
    fontWeight: '600',
    color: temaMedico.cores.primaria,
  },
});
