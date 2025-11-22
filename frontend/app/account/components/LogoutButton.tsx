/**
 * LogoutButton Component
 * Botão para sair da conta
 */

import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { temaMedico } from '@/src/estilos/temaMedico';

interface LogoutButtonProps {
  onPress: () => void;
}

export const LogoutButton: React.FC<LogoutButtonProps> = ({ onPress }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Ionicons name="log-out-outline" size={22} color={temaMedico.cores.erro} />
      <Text style={styles.text}>Sair da Conta</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: temaMedico.cores.backgroundCard,
    marginHorizontal: 20,
    marginTop: 24,
    padding: 16,
    borderRadius: 12,
    gap: 12,
    borderWidth: 1,
    borderColor: temaMedico.cores.erro + '40',
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
    color: temaMedico.cores.erro,
  },
});
