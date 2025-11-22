/**
 * StatsCard Component
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { temaMedico } from '@/src/estilos/temaMedico';
import type { CompareStats } from '../types/compare.types';

interface StatsCardProps {
  stats: CompareStats;
}

export const StatsCard: React.FC<StatsCardProps> = ({ stats }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Resumo de Preços</Text>
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Menor Preço</Text>
          <Text style={styles.statValue}>R$ {stats.menorPreco.toFixed(2)}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Maior Preço</Text>
          <Text style={styles.statValue}>R$ {stats.maiorPreco.toFixed(2)}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Preço Médio</Text>
          <Text style={styles.statValue}>R$ {stats.precoMedio.toFixed(2)}</Text>
        </View>
      </View>
      {stats.economiaMaxima > 0 && (
        <View style={styles.savings}>
          <Text style={styles.savingsText}>
            Economize até R$ {stats.economiaMaxima.toFixed(2)}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: temaMedico.cores.backgroundCard,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 12,
    ...temaMedico.sombras.pequena,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: temaMedico.cores.textoTitulo,
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: temaMedico.cores.textoSubtitulo,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
    color: temaMedico.cores.primaria,
  },
  savings: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: temaMedico.cores.borda,
    alignItems: 'center',
  },
  savingsText: {
    fontSize: 14,
    fontWeight: '600',
    color: temaMedico.cores.sucesso,
  },
});
