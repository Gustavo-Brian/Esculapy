/**
 * Compare Screen - Nova Arquitetura
 * Comparação de preços entre farmácias
 */

import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import { temaMedico } from '@/src/estilos/temaMedico';

// Hook
import { useCompare } from './hooks/useCompare';

// Componentes
import { CompareHeader } from './components/CompareHeader';
import { StatsCard } from './components/StatsCard';
import { OfferCard } from './components/OfferCard';

export default function CompareScreen() {
  const { produto, stats, handlers } = useCompare();

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        <CompareHeader
          productName={produto.nome}
          productDescription={produto.descricao}
          onBackPress={handlers.onBackPress}
        />

        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <StatsCard stats={stats} />

          {produto.ofertas.map((oferta) => (
            <OfferCard
              key={oferta.id}
              offer={oferta}
              onSelect={handlers.onSelectOffer}
              onPharmacyPress={handlers.onPharmacyPress}
            />
          ))}
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: temaMedico.cores.background,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
});
