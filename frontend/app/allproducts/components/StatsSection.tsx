/**
 * StatsSection Component
 * Seção de estatísticas (produtos e farmácias)
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { temaMedico } from '@/src/estilos/temaMedico';
import type { ProductsStats } from '../types/allproducts.types';

interface StatsSectionProps {
  stats: ProductsStats;
}

export const StatsSection: React.FC<StatsSectionProps> = ({ stats }) => {
  return (
    <View style={styles.container}>
      {/* Produtos */}
      <View style={styles.card}>
        <View style={[styles.icon, { backgroundColor: temaMedico.cores.cardRoxo + '20' }]}>
          <Ionicons name="cube" size={20} color={temaMedico.cores.cardRoxo} />
        </View>
        <View style={styles.info}>
          <Text style={styles.value}>{stats.totalProducts}</Text>
          <Text style={styles.label}>Produtos</Text>
        </View>
      </View>

      {/* Farmácias */}
      <View style={styles.card}>
        <View style={[styles.icon, { backgroundColor: temaMedico.cores.cardVerde + '20' }]}>
          <Ionicons name="storefront" size={20} color={temaMedico.cores.cardVerde} />
        </View>
        <View style={styles.info}>
          <Text style={styles.value}>{stats.totalStores}</Text>
          <Text style={styles.label}>Farmácias</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: temaMedico.espacamentos.lg,
    gap: temaMedico.espacamentos.md,
  },
  card: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: temaMedico.cores.backgroundCard,
    borderRadius: temaMedico.bordas.media,
    padding: temaMedico.espacamentos.md,
    alignItems: 'center',
    ...temaMedico.sombras.pequena,
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: temaMedico.espacamentos.sm,
  },
  info: {
    flex: 1,
  },
  value: {
    fontSize: temaMedico.fontes.tamanhos.xl,
    fontWeight: temaMedico.fontes.pesos.bold,
    color: temaMedico.cores.textoTitulo,
  },
  label: {
    fontSize: temaMedico.fontes.tamanhos.xs,
    color: temaMedico.cores.textoSubtitulo,
    marginTop: 2,
  },
});
