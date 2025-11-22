/**
 * Admin - Gerenciamento de Produtos (Catálogo Master)
 * Tela para criar, editar e gerenciar produtos do catálogo
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { temaMedico } from '@/src/estilos/temaMedico';
import { Snackbar } from '@/src/componentes/Snackbar';
import { useProdutos } from './hooks/useProdutos';
import { ProdutoFormModal } from './components/ProdutoFormModal';
import type { Produto } from '@/src/servicos/types/admin.types';

// Componente de Card de Produto
const ProdutoCard: React.FC<{
  produto: Produto;
  onEditar: (produto: Produto) => void;
  onDesativar: (id: number) => void;
  onReativar: (id: number) => void;
  onDeletar: (id: number) => void;
}> = ({ produto, onEditar, onDesativar, onReativar, onDeletar }) => {
  const getTipoLabel = (tipo: string) => {
    const labels: Record<string, string> = {
      MEDICAMENTO: 'Medicamento',
      PERFUMARIA: 'Perfumaria',
      SUPLEMENTO: 'Suplemento',
      EQUIPAMENTO: 'Equipamento',
      CONVENIENCIA: 'Conveniência',
    };
    return labels[tipo] || tipo;
  };

  const getReceitaLabel = (receita: string) => {
    const labels: Record<string, string> = {
      NAO_EXIGIDO: 'Sem Receita',
      BRANCA_SIMPLES: 'Receita Branca',
      BRANCA_CONTROLE_ESPECIAL: 'Controle Especial',
      AZUL_B: 'Receita Azul (B)',
      AMARELA_A: 'Receita Amarela (A)',
    };
    return labels[receita] || receita;
  };

  const handleDeletar = () => {
    Alert.alert(
      'Deletar Produto',
      `Deseja deletar permanentemente "${produto.nome}"? Esta ação não pode ser desfeita.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Deletar', style: 'destructive', onPress: () => onDeletar(produto.id) },
      ]
    );
  };

  return (
    <View style={styles.produtoCard}>
      {/* Header */}
      <View style={styles.cardHeader}>
        <View style={styles.cardTitleContainer}>
          <Text style={styles.cardTitle}>{produto.nome}</Text>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: produto.ativo ? '#4CAF50' : '#F44336' },
            ]}
          >
            <Text style={styles.statusText}>{produto.ativo ? 'Ativo' : 'Inativo'}</Text>
          </View>
        </View>
        <Text style={styles.cardSubtitle}>{produto.laboratorio}</Text>
      </View>

      {/* Informações */}
      <View style={styles.cardInfo}>
        <View style={styles.infoRow}>
          <Ionicons name="medical" size={16} color={temaMedico.cores.textoClaro} />
          <Text style={styles.infoText}>{produto.principioAtivo}</Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="barcode" size={16} color={temaMedico.cores.textoClaro} />
          <Text style={styles.infoText}>EAN: {produto.ean}</Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="document-text" size={16} color={temaMedico.cores.textoClaro} />
          <Text style={styles.infoText}>MS: {produto.codigoRegistroMS}</Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="pricetag" size={16} color={temaMedico.cores.textoClaro} />
          <Text style={styles.infoText}>{getTipoLabel(produto.tipoProduto)}</Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="document" size={16} color={temaMedico.cores.textoClaro} />
          <Text style={styles.infoText}>{getReceitaLabel(produto.tipoReceita)}</Text>
        </View>
      </View>

      {/* Ações */}
      <View style={styles.cardActions}>
        <TouchableOpacity style={styles.editButton} onPress={() => onEditar(produto)}>
          <Ionicons name="create" size={18} color={temaMedico.cores.primaria} />
        </TouchableOpacity>
        {produto.ativo ? (
          <TouchableOpacity style={styles.disableButton} onPress={() => onDesativar(produto.id)}>
            <Ionicons name="close-circle" size={18} color="#F44336" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.enableButton} onPress={() => onReativar(produto.id)}>
            <Ionicons name="checkmark-circle" size={18} color="#4CAF50" />
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.deleteButton} onPress={handleDeletar}>
          <Ionicons name="trash" size={18} color="#F44336" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default function ProdutosAdminScreen() {
  const {
    produtos,
    loading,
    refreshing,
    filtroAtivo,
    filtroTipo,
    modalFormVisible,
    produtoEditando,
    processando,
    stats,
    snackbar,
    setFiltroAtivo,
    setFiltroTipo,
    onRefresh,
    handleCriarProduto,
    handleAtualizarProduto,
    handleDesativarProduto,
    handleReativarProduto,
    handleDeletarProduto,
    abrirModalCriar,
    abrirModalEditar,
    fecharModalForm,
    hideSnackbar,
  } = useProdutos();

  const handleSalvarProduto = async (produtoData: any) => {
    if (produtoEditando) {
      await handleAtualizarProduto(produtoEditando.id, produtoData);
    } else {
      await handleCriarProduto(produtoData);
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <Snackbar
        visible={snackbar.visible}
        message={snackbar.message}
        type={snackbar.type}
        onDismiss={hideSnackbar}
      />
      <ProdutoFormModal
        visible={modalFormVisible}
        produto={produtoEditando}
        processando={processando}
        onClose={fecharModalForm}
        onSalvar={handleSalvarProduto}
      />
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Catálogo de Produtos</Text>
          <Text style={styles.headerSubtitle}>Gerenciar produtos do sistema</Text>
        </View>

        {/* Estatísticas */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.total}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.ativos}</Text>
            <Text style={styles.statLabel}>Ativos</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.inativos}</Text>
            <Text style={styles.statLabel}>Inativos</Text>
          </View>
        </View>

        {/* Botão Criar Produto */}
        <View style={styles.createButtonContainer}>
          <TouchableOpacity style={styles.createButton} onPress={abrirModalCriar}>
            <Ionicons name="add-circle" size={24} color="#FFF" />
            <Text style={styles.createButtonText}>Novo Produto</Text>
          </TouchableOpacity>
        </View>

        {/* Filtros */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filtersContainer}
          contentContainerStyle={styles.filtersContent}
        >
          <TouchableOpacity
            style={[styles.filterChip, filtroAtivo === 'TODOS' && styles.filterChipActive]}
            onPress={() => setFiltroAtivo('TODOS')}
          >
            <Text
              style={[
                styles.filterText,
                filtroAtivo === 'TODOS' && styles.filterTextActive,
              ]}
            >
              Todos
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterChip, filtroAtivo === true && styles.filterChipActive]}
            onPress={() => setFiltroAtivo(true)}
          >
            <Text
              style={[styles.filterText, filtroAtivo === true && styles.filterTextActive]}
            >
              Ativos
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterChip, filtroAtivo === false && styles.filterChipActive]}
            onPress={() => setFiltroAtivo(false)}
          >
            <Text
              style={[styles.filterText, filtroAtivo === false && styles.filterTextActive]}
            >
              Inativos
            </Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Lista de Produtos */}
        {loading && !refreshing ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={temaMedico.cores.primaria} />
            <Text style={styles.loadingText}>Carregando produtos...</Text>
          </View>
        ) : (
          <FlatList
            data={produtos}
            keyExtractor={item => item.id.toString()}
            renderItem={({ item }) => (
              <ProdutoCard
                produto={item}
                onEditar={abrirModalEditar}
                onDesativar={handleDesativarProduto}
                onReativar={handleReativarProduto}
                onDeletar={handleDeletarProduto}
              />
            )}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Ionicons name="medkit-outline" size={64} color={temaMedico.cores.textoClaro} />
                <Text style={styles.emptyText}>Nenhum produto cadastrado</Text>
                <Text style={styles.emptySubtext}>
                  Toque em "Novo Produto" para adicionar produtos ao catálogo
                </Text>
              </View>
            }
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[temaMedico.cores.primaria]}
              />
            }
          />
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
  header: {
    backgroundColor: temaMedico.cores.primaria,
    padding: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: temaMedico.cores.borda,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: temaMedico.cores.primaria,
  },
  statLabel: {
    fontSize: 12,
    color: temaMedico.cores.textoClaro,
    marginTop: 4,
  },
  createButtonContainer: {
    padding: 16,
    paddingBottom: 8,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: temaMedico.cores.primaria,
    paddingVertical: 14,
    borderRadius: 8,
    gap: 8,
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
  },
  filtersContainer: {
    borderBottomWidth: 1,
    borderBottomColor: temaMedico.cores.borda,
  },
  filtersContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: temaMedico.cores.background,
    borderWidth: 1,
    borderColor: temaMedico.cores.borda,
  },
  filterChipActive: {
    backgroundColor: temaMedico.cores.primaria,
    borderColor: temaMedico.cores.primaria,
  },
  filterText: {
    fontSize: 14,
    color: temaMedico.cores.textoPrincipal,
    fontWeight: '500',
  },
  filterTextActive: {
    color: '#FFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: temaMedico.cores.textoClaro,
  },
  listContent: {
    padding: 16,
  },
  produtoCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    marginBottom: 12,
  },
  cardTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: temaMedico.cores.textoPrincipal,
    flex: 1,
  },
  cardSubtitle: {
    fontSize: 14,
    color: temaMedico.cores.textoSubtitulo,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFF',
  },
  cardInfo: {
    gap: 8,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoText: {
    fontSize: 13,
    color: temaMedico.cores.textoSubtitulo,
    flex: 1,
  },
  cardActions: {
    flexDirection: 'row',
    gap: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: temaMedico.cores.borda,
  },
  editButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: temaMedico.cores.background,
  },
  disableButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#FFEBEE',
  },
  enableButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#E8F5E9',
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#FFEBEE',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 64,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: temaMedico.cores.textoPrincipal,
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: temaMedico.cores.textoClaro,
    marginTop: 8,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
});
