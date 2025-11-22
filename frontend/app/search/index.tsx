/**
 * Search Screen - Nova Arquitetura
 * Tela de busca unificada de produtos e farmácias
 */

import React from 'react';
import { View, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import { temaMedico } from '@/src/estilos/temaMedico';

// Hook
import { useSearch } from './hooks/useSearch';

// Componentes
import { SearchInput } from './components/SearchInput';
import { SearchTabs } from './components/SearchTabs';
import { CategoryList } from './components/CategoryList';
import { ProductResultCard } from './components/ProductResultCard';
import { PharmacyResultCard } from './components/PharmacyResultCard';
import { SearchEmptyState } from './components/SearchEmptyState';

export default function SearchScreen() {
  // Hook com toda a lógica
  const { uiState, resultados, categorias, handlers } = useSearch();

  const hasResults =
    resultados.produtos.length > 0 || resultados.farmacias.length > 0;
  const hasSearchTerm = uiState.termoBusca.trim().length > 0;

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        {/* Input de Busca */}
        <SearchInput
          value={uiState.termoBusca}
          onChange={handlers.onChangeSearchTerm}
          onClear={handlers.onClearSearch}
          onBackPress={handlers.onBackPress}
        />

        {/* Categorias */}
        <CategoryList
          categories={categorias}
          activeCategory={uiState.categoriaAtiva}
          onSelectCategory={handlers.onSelectCategory}
        />

        {/* Abas */}
        {hasResults && (
          <SearchTabs
            activeTab={uiState.abaAtiva}
            onChangeTab={handlers.onChangeTab}
            productCount={resultados.produtos.length}
            pharmacyCount={resultados.farmacias.length}
          />
        )}

        {/* Loading */}
        {uiState.loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={temaMedico.cores.primaria} />
          </View>
        )}

        {/* Conteúdo */}
        {!uiState.loading && (
          <ScrollView
            style={styles.content}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Estado Vazio */}
            {!hasResults && <SearchEmptyState hasSearchTerm={hasSearchTerm} />}

            {/* Resultados de Produtos */}
            {hasResults &&
              uiState.abaAtiva === 'produtos' &&
              resultados.produtos.map((produto) => (
                <ProductResultCard
                  key={produto.id}
                  product={produto}
                  onPress={handlers.onProductPress}
                />
              ))}

            {/* Resultados de Farmácias */}
            {hasResults &&
              uiState.abaAtiva === 'farmacias' &&
              resultados.farmacias.map((farmacia) => (
                <PharmacyResultCard
                  key={farmacia.id}
                  pharmacy={farmacia}
                  onPress={handlers.onPharmacyPress}
                />
              ))}
          </ScrollView>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: temaMedico.cores.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingVertical: 8,
  },
});
