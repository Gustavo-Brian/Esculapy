/**
 * EmptyProducts Component
 * Estado vazio quando não há produtos
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { temaMedico } from '@/src/estilos/temaMedico';

export const EmptyProducts: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={[styles.icon, { backgroundColor: temaMedico.cores.backgroundDestaque }]}>
        <Ionicons name="basket-outline" size={48} color={temaMedico.cores.primaria} />
      </View>
      <Text style={styles.title}>Nenhum Produto Encontrado</Text>
      <Text style={styles.text}>Não há produtos disponíveis no momento</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
    paddingHorizontal: 32,
  },
  icon: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: temaMedico.espacamentos.lg,
  },
  title: {
    fontSize: temaMedico.fontes.tamanhos.xl,
    fontWeight: temaMedico.fontes.pesos.semibold,
    color: temaMedico.cores.textoTitulo,
    marginBottom: temaMedico.espacamentos.sm,
  },
  text: {
    fontSize: temaMedico.fontes.tamanhos.md,
    color: temaMedico.cores.textoSubtitulo,
    textAlign: 'center',
  },
});
