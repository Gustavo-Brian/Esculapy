/**
 * AccountHeader Component
 * Cabeçalho da tela de configurações
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { temaMedico } from '@/src/estilos/temaMedico';

interface AccountHeaderProps {
  onBackPress: () => void;
}

export const AccountHeader: React.FC<AccountHeaderProps> = ({ onBackPress }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={onBackPress}>
        <Ionicons name="arrow-back" size={24} color={temaMedico.cores.primaria} />
      </TouchableOpacity>
      <Text style={styles.title}>Configurações</Text>
      <View style={styles.spacer} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingTop: 60,
    backgroundColor: temaMedico.cores.backgroundCard,
    borderBottomWidth: 1,
    borderBottomColor: temaMedico.cores.borda,
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: temaMedico.cores.textoPrimario,
  },
  spacer: {
    width: 40,
  },
});
