/**
 * Sellers Screen - Nova Arquitetura
 * Lista de farmácias com busca e filtros
 */

import React from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { Stack } from 'expo-router';
import { temaMedico } from '@/src/estilos/temaMedico';
import { ProtectedRoute } from '@/src/componentes/ProtectedRoute';

// Hook
import { useSellers } from './hooks/useSellers';

// Componentes
import { SellersHeader } from './components/SellersHeader';
import { FilterChips } from './components/FilterChips';
import { PharmacyCard } from './components/PharmacyCard';
import type { Pharmacy } from './types/sellers.types';

export default function SellersScreen() {
  // Hook com toda a lógica
  const { uiState, farmacias, filtros, handlers, carregando } = useSellers();

  /**
   * Renderiza cada farmácia
   */
  const renderPharmacy = ({ item }: { item: Pharmacy }) => (
    <PharmacyCard pharmacy={item} onPress={handlers.onPharmacyPress} />
  );

  return (
    <ProtectedRoute>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        {/* Header com busca */}
        <SellersHeader
          searchValue={uiState.busca}
          onSearch={handlers.onSearch}
          onBackPress={handlers.onBackPress}
          pharmacyCount={farmacias.length}
        />

        {carregando ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={temaMedico.cores.primaria} />
            <Text style={styles.loadingText}>Carregando farmácias...</Text>
          </View>
        ) : (
          /* Lista com filtros */
          <FlatList
            data={farmacias}
            renderItem={renderPharmacy}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.listContent}
            ListHeaderComponent={
              <FilterChips
                filters={filtros}
                activeFilter={uiState.filtroAtivo}
                onFilterChange={handlers.onFilterChange}
              />
            }
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </ProtectedRoute>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: temaMedico.cores.background,
  },
  listContent: {
    paddingBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: temaMedico.espacamentos.md,
    fontSize: temaMedico.fontes.tamanhos.md,
    color: temaMedico.cores.textoSubtitulo,
  },
});
