/**
 * Admin - Gerenciamento de Farmácias
 * Tela para aprovar, ativar e suspender farmácias
 */

import React from 'react';
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
  Alert,
} from 'react-native';
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { temaMedico } from '@/src/estilos/temaMedico';
import { Snackbar } from '@/src/componentes/Snackbar';
import { useFarmacias } from './hooks/useFarmacias';
import type { Farmacia, LojistaStatus } from '@/src/servicos/types/admin.types';

// Componente de Card de Farmácia
const FarmaciaCard: React.FC<{
  farmacia: Farmacia;
  onAtivar: (id: number) => void;
  onSuspender: (id: number) => void;
}> = ({ farmacia, onAtivar, onSuspender }) => {
  const getStatusColor = (status: LojistaStatus) => {
    switch (status) {
      case 'ATIVO':
        return '#4CAF50';
      case 'PENDENTE_APROVACAO':
        return '#FF9800';
      case 'SUSPENSO':
        return '#F44336';
      default:
        return temaMedico.cores.textoClaro;
    }
  };

  const getStatusLabel = (status: LojistaStatus) => {
    switch (status) {
      case 'ATIVO':
        return 'Ativo';
      case 'PENDENTE_APROVACAO':
        return 'Pendente';
      case 'SUSPENSO':
        return 'Suspenso';
      default:
        return status;
    }
  };

  const handleAprovar = () => {
    Alert.alert(
      'Aprovar Farmácia',
      `Deseja aprovar a farmácia "${farmacia.nomeFantasia}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Aprovar', onPress: () => onAtivar(farmacia.id) },
      ]
    );
  };

  const handleSuspender = () => {
    Alert.alert(
      'Suspender Farmácia',
      `Deseja suspender a farmácia "${farmacia.nomeFantasia}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Suspender', style: 'destructive', onPress: () => onSuspender(farmacia.id) },
      ]
    );
  };

  return (
    <View style={styles.farmaciaCard}>
      {/* Header do Card */}
      <View style={styles.cardHeader}>
        <View style={styles.cardTitleContainer}>
          <Text style={styles.cardTitle}>{farmacia.nomeFantasia}</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(farmacia.status) }]}>
            <Text style={styles.statusText}>{getStatusLabel(farmacia.status)}</Text>
          </View>
        </View>
      </View>

      {/* Informações */}
      <View style={styles.cardInfo}>
        <View style={styles.infoRow}>
          <Ionicons name="business" size={16} color={temaMedico.cores.textoClaro} />
          <Text style={styles.infoText}>{farmacia.razaoSocial}</Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="document-text" size={16} color={temaMedico.cores.textoClaro} />
          <Text style={styles.infoText}>CNPJ: {farmacia.cnpj}</Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="medical" size={16} color={temaMedico.cores.textoClaro} />
          <Text style={styles.infoText}>CRF-J: {farmacia.crfJ}</Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="mail" size={16} color={temaMedico.cores.textoClaro} />
          <Text style={styles.infoText}>{farmacia.emailContato}</Text>
        </View>
        {farmacia.enderecoComercial && (
          <View style={styles.infoRow}>
            <Ionicons name="location" size={16} color={temaMedico.cores.textoClaro} />
            <Text style={styles.infoText}>
              {farmacia.enderecoComercial.cidade} - {farmacia.enderecoComercial.estado}
            </Text>
          </View>
        )}
      </View>

      {/* Ações */}
      <View style={styles.cardActions}>
        {farmacia.status === 'PENDENTE_APROVACAO' && (
          <TouchableOpacity style={styles.aprovarButton} onPress={handleAprovar}>
            <Ionicons name="checkmark-circle" size={20} color="#FFF" />
            <Text style={styles.buttonText}>Aprovar</Text>
          </TouchableOpacity>
        )}
        {farmacia.status === 'ATIVO' && (
          <TouchableOpacity style={styles.suspenderButton} onPress={handleSuspender}>
            <Ionicons name="ban" size={20} color="#FFF" />
            <Text style={styles.buttonText}>Suspender</Text>
          </TouchableOpacity>
        )}
        {farmacia.status === 'SUSPENSO' && (
          <TouchableOpacity style={styles.reativarButton} onPress={() => onAtivar(farmacia.id)}>
            <Ionicons name="checkmark-circle" size={20} color="#FFF" />
            <Text style={styles.buttonText}>Reativar</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default function FarmaciasAdminScreen() {
  const {
    farmacias,
    loading,
    refreshing,
    filtroStatus,
    stats,
    snackbar,
    onRefresh,
    handleAtivarFarmacia,
    handleDesativarFarmacia,
    handleChangeFiltro,
    hideSnackbar,
  } = useFarmacias();

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <Snackbar
        visible={snackbar.visible}
        message={snackbar.message}
        type={snackbar.type}
        onDismiss={hideSnackbar}
      />
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Gerenciar Farmácias</Text>
          <Text style={styles.headerSubtitle}>Aprovar e gerenciar cadastros</Text>
        </View>

        {/* Estatísticas */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.pendentes}</Text>
            <Text style={styles.statLabel}>Pendentes</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.ativas}</Text>
            <Text style={styles.statLabel}>Ativas</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.suspensas}</Text>
            <Text style={styles.statLabel}>Suspensas</Text>
          </View>
        </View>

        {/* Filtros */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filtersContainer}
          contentContainerStyle={styles.filtersContent}
        >
          {(['TODOS', 'PENDENTE_APROVACAO', 'ATIVO', 'SUSPENSO'] as const).map((status) => (
            <TouchableOpacity
              key={status}
              style={[styles.filterChip, filtroStatus === status && styles.filterChipActive]}
              onPress={() => handleChangeFiltro(status)}
            >
              <Text
                style={[styles.filterText, filtroStatus === status && styles.filterTextActive]}
              >
                {status === 'TODOS' ? 'Todos' : status === 'PENDENTE_APROVACAO' ? 'Pendentes' : status === 'ATIVO' ? 'Ativos' : 'Suspensos'}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Lista de Farmácias */}
        {loading && !refreshing ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={temaMedico.cores.primaria} />
            <Text style={styles.loadingText}>Carregando farmácias...</Text>
          </View>
        ) : (
          <FlatList
            data={farmacias}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <FarmaciaCard
                farmacia={item}
                onAtivar={handleAtivarFarmacia}
                onSuspender={handleDesativarFarmacia}
              />
            )}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Ionicons name="business-outline" size={64} color={temaMedico.cores.textoClaro} />
                <Text style={styles.emptyText}>Nenhuma farmácia encontrada</Text>
                <Text style={styles.emptySubtext}>
                  {filtroStatus === 'TODOS'
                    ? 'Ainda não há farmácias cadastradas'
                    : `Nenhuma farmácia com status "${filtroStatus}"`}
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
  filtersContainer: {
    backgroundColor: '#FFF',
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
  farmaciaCard: {
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
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: temaMedico.cores.textoPrincipal,
    flex: 1,
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
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoText: {
    fontSize: 14,
    color: temaMedico.cores.textoSubtitulo,
    flex: 1,
  },
  cardActions: {
    flexDirection: 'row',
    gap: 8,
  },
  aprovarButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  suspenderButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F44336',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  reativarButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2196F3',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFF',
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
  },
});
