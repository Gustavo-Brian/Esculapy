/**
 * AllProducts Screen - Nova Arquitetura
 * Tela de todos os produtos
 */

import React from 'react';
import { View, FlatList, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import { temaMedico } from '@/src/estilos/temaMedico';

// Hook
import { useAllProducts } from './hooks/useAllProducts';

// Componentes
import { ProductsHeader } from './components/ProductsHeader';
import { StatsSection } from './components/StatsSection';
import { ProductCard } from './components/ProductCard';
import { EmptyProducts } from './components/EmptyProducts';
import { AddToCartModal } from '@/src/components/AddToCartModal';

export default function AllProductsScreen() {
  // Hook com toda a lógica
  const {
    products,
    stats,
    handlers,
    loading,
    searchTerm,
    onSearch,
    onClearSearch,
    modalVisible,
    produtoSelecionado,
    onConfirmAddToCart,
    onCloseModal,
  } = useAllProducts();

  /**
   * Renderiza cada produto
   */
  const renderProduct = ({ item }: { item: any }) => (
    <ProductCard
      product={item}
      onPress={handlers.onProductPress}
      onAddToCart={handlers.onAddToCart}
    />
  );

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        {/* Header com Busca */}
        <ProductsHeader
          onBackPress={handlers.onBackPress}
          searchTerm={searchTerm}
          onSearch={onSearch}
          onClearSearch={onClearSearch}
        />

        {/* Estatísticas */}
        <StatsSection stats={stats} />

        {/* Loading Indicator */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={temaMedico.cores.primaria} />
            <Text style={styles.loadingText}>Carregando produtos...</Text>
          </View>
        ) : (
          /* Grid de Produtos */
          <FlatList
            data={products}
            renderItem={renderProduct}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            columnWrapperStyle={styles.grid}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={<EmptyProducts />}
          />
        )}

        {/* Modal de Adicionar ao Carrinho */}
        <AddToCartModal
          visible={modalVisible}
          onClose={onCloseModal}
          onConfirm={onConfirmAddToCart}
          produto={produtoSelecionado ? {
            nome: produtoSelecionado.nome,
            preco: produtoSelecionado.preco,
            farmacia: produtoSelecionado.vendedor,
            estoque: produtoSelecionado.ofertaSelecionada?.quantidade || 0,
            tipoProduto: produtoSelecionado.catalogoData?.tipoProduto,
            tipoReceita: produtoSelecionado.catalogoData?.tipoReceita,
            principioAtivo: produtoSelecionado.catalogoData?.principioAtivo || undefined,
            laboratorio: produtoSelecionado.catalogoData?.laboratorio || undefined,
          } : null}
        />
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
    gap: temaMedico.espacamentos.md,
  },
  loadingText: {
    fontSize: temaMedico.fontes.tamanhos.md,
    color: temaMedico.cores.textoSecundario,
  },
  content: {
    padding: temaMedico.espacamentos.lg,
    paddingTop: temaMedico.espacamentos.sm,
  },
  grid: {
    gap: temaMedico.espacamentos.md,
  },
});
