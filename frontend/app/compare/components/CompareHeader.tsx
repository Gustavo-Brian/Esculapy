/**
 * CompareHeader Component
 */

import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { temaMedico } from '@/src/estilos/temaMedico';

interface CompareHeaderProps {
  productName: string;
  productDescription: string;
  onBackPress: () => void;
}

export const CompareHeader: React.FC<CompareHeaderProps> = ({
  productName,
  productDescription,
  onBackPress,
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color={temaMedico.cores.textoTitulo} />
      </TouchableOpacity>
      <View style={styles.info}>
        <Text style={styles.title}>{productName}</Text>
        <Text style={styles.subtitle}>{productDescription}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: temaMedico.cores.backgroundCard,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: temaMedico.cores.borda,
  },
  backButton: {
    marginRight: 12,
    padding: 4,
  },
  info: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: temaMedico.cores.textoTitulo,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: temaMedico.cores.textoSubtitulo,
  },
});
