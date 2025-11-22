/**
 * Tela DetalheProduto - Nova Versão
 * Mostra todas as ofertas do produto em diferentes farmácias
 */

import React from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
  FlatList,
  StyleSheet,
} from 'react-native';
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { temaMedico } from '@/src/estilos/temaMedico';

// Hook
import { useProductOffers } from '../hooks/useProductOffers';

// Componentes
import { OfferCard } from '../componentes/OfferCard';
import { QuantidadeModal } from '@/src/componentes/QuantidadeModal';
import type { ProductOffer } from '../hooks/useProductOffers';

export default function TelaDetalheProduto() {
  const {
    produto,
    ofertas,
    carregando,
    erro,
    stats,
    buscaFarmacia,
    handleSearch,
    handleOfferPress,
    handleAddToCart,
    handleBackPress,
    // Modal de quantidade
    modalQuantidadeVisivel,
    ofertaSelecionada,
    handleConfirmarQuantidade,
    handleFecharModal,
  } = useProductOffers();

  /**
   * Loading
   */
  if (carregando) {
    return (
      <>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={temaMedico.cores.primaria} />
          <Text style={styles.loadingText}>Buscando ofertas...</Text>
        </View>
      </>
    );
  }

  /**
   * Erro
   */
  if (erro || !produto) {
    return (
      <>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={64} color={temaMedico.cores.erro} />
          <Text style={styles.errorText}>{erro || 'Produto não encontrado'}</Text>
          <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
            <Text style={styles.backButtonText}>Voltar</Text>
          </TouchableOpacity>
        </View>
      </>
    );
  }

  /**
   * Renderiza cada oferta
   */
  const renderOffer = ({ item, index }: { item: ProductOffer; index: number }) => (
    <OfferCard
      offer={item}
      onPress={handleOfferPress}
      onAddToCart={handleAddToCart}
      isBestPrice={index === 0 && item.ativo && item.quantidade > 0}
    />
  );

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backIconButton} onPress={handleBackPress}>
            <Ionicons name="arrow-back" size={24} color={temaMedico.cores.textoTitulo} />
          </TouchableOpacity>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {produto.nome}
          </Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Informações do Produto */}
        <View style={styles.productInfo}>
          <View style={styles.productIcon}>
            <Ionicons name="medical" size={48} color={temaMedico.cores.primaria} />
          </View>
          <View style={styles.productDetails}>
            <Text style={styles.productName} numberOfLines={2}>
              {produto.nome}
            </Text>
            {produto.laboratorio && (
              <View style={styles.metaRow}>
                <Ionicons name="flask" size={14} color={temaMedico.cores.textoSubtitulo} />
                <Text style={styles.metaText}>{produto.laboratorio}</Text>
              </View>
            )}
            {produto.principioAtivo && (
              <View style={styles.metaRow}>
                <Ionicons name="nutrition" size={14} color={temaMedico.cores.textoSubtitulo} />
                <Text style={styles.metaText}>{produto.principioAtivo}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Estatísticas */}
        {stats.totalOfertas > 0 && (
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Menor preço</Text>
              <Text style={[styles.statValue, styles.statValueBest]}>
                R$ {stats.menorPreco.toFixed(2).replace('.', ',')}
              </Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Preço médio</Text>
              <Text style={styles.statValue}>
                R$ {stats.precoMedio.toFixed(2).replace('.', ',')}
              </Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Ofertas</Text>
              <Text style={styles.statValue}>{stats.totalOfertas}</Text>
            </View>
          </View>
        )}

        {/* Barra de Busca */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color={temaMedico.cores.textoSubtitulo} />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar farmácia..."
              placeholderTextColor={temaMedico.cores.textoClaro}
              value={buscaFarmacia}
              onChangeText={handleSearch}
            />
            {buscaFarmacia.length > 0 && (
              <TouchableOpacity onPress={() => handleSearch('')}>
                <Ionicons name="close-circle" size={20} color={temaMedico.cores.textoSubtitulo} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Lista de Ofertas */}
        <View style={styles.offersSection}>
          <Text style={styles.sectionTitle}>
            Onde comprar ({ofertas.length} {ofertas.length === 1 ? 'farmácia' : 'farmácias'})
          </Text>

          {ofertas.length > 0 ? (
            <FlatList
              data={ofertas}
              renderItem={renderOffer}
              keyExtractor={(item) => `${item.estoqueId}-${item.farmaciaId}`}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.offersList}
            />
          ) : (
            <View style={styles.emptyContainer}>
              <Ionicons name="search-outline" size={64} color={temaMedico.cores.textoClaro} />
              <Text style={styles.emptyText}>
                {buscaFarmacia
                  ? 'Nenhuma farmácia encontrada'
                  : 'Nenhuma oferta disponível no momento'}
              </Text>
            </View>
          )}
        </View>

        {/* Modal de Seleção de Quantidade */}
        {ofertaSelecionada && (
          <QuantidadeModal
            visible={modalQuantidadeVisivel}
            onClose={handleFecharModal}
            onConfirm={handleConfirmarQuantidade}
            produtoNome={produto?.nome || ''}
            estoqueDisponivel={ofertaSelecionada.quantidade}
            preco={ofertaSelecionada.preco}
          />
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: temaMedico.cores.textoSubtitulo,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
    padding: 32,
  },
  errorText: {
    marginTop: 16,
    fontSize: 16,
    color: temaMedico.cores.erro,
    textAlign: 'center',
  },
  backButton: {
    marginTop: 24,
    backgroundColor: temaMedico.cores.primaria,
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: temaMedico.bordas.media,
  },
  backButtonText: {
    color: temaMedico.cores.textoBranco,
    fontSize: 16,
    fontWeight: temaMedico.fontes.pesos.semibold,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backIconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: temaMedico.cores.backgroundInput,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: temaMedico.fontes.pesos.bold,
    color: temaMedico.cores.textoTitulo,
    marginHorizontal: 12,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  productInfo: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  productIcon: {
    width: 80,
    height: 80,
    borderRadius: 16,
    backgroundColor: temaMedico.cores.primaria + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  productDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  productName: {
    fontSize: 18,
    fontWeight: temaMedico.fontes.pesos.bold,
    color: temaMedico.cores.textoTitulo,
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  metaText: {
    fontSize: 13,
    color: temaMedico.cores.textoSubtitulo,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: temaMedico.cores.textoClaro,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: temaMedico.fontes.pesos.bold,
    color: temaMedico.cores.textoTitulo,
  },
  statValueBest: {
    color: temaMedico.cores.sucesso,
  },
  statDivider: {
    width: 1,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 8,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
    borderRadius: temaMedico.bordas.media,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: temaMedico.cores.textoTitulo,
  },
  offersSection: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: temaMedico.fontes.pesos.bold,
    color: temaMedico.cores.textoTitulo,
    marginBottom: 16,
  },
  offersList: {
    paddingBottom: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: temaMedico.cores.textoSubtitulo,
    textAlign: 'center',
  },
});
