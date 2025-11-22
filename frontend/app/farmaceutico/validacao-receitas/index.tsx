/**
 * Tela: Validação de Receitas - Farmacêutico
 * Permite farmacêutico aprovar ou rejeitar receitas médicas
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Modal,
  TextInput,
  RefreshControl,
} from 'react-native';
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { temaMedico } from '@/src/estilos/temaMedico';
import { ProtectedRoute } from '@/src/componentes/ProtectedRoute';
import {
  getPedidosPendentesValidacao,
  aprovarReceitaPedido,
  rejeitarReceitaPedido,
} from '@/src/servicos/farmaceutico/receitaService';
import type { Pedido } from '@/src/servicos/types/api.types';

export default function ValidacaoReceitasScreen() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalRejeitar, setModalRejeitar] = useState(false);
  const [pedidoSelecionado, setPedidoSelecionado] = useState<number | null>(null);
  const [motivo, setMotivo] = useState('');
  const [processando, setProcessando] = useState(false);

  /**
   * Carregar pedidos pendentes
   */
  const carregarPedidos = useCallback(async () => {
    try {
      setLoading(true);
      const dados = await getPedidosPendentesValidacao();
      setPedidos(dados);
    } catch (error: any) {
      console.error(error);
      Alert.alert('Erro', 'Não foi possível carregar os pedidos pendentes');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    carregarPedidos();
  }, [carregarPedidos]);

  /**
   * Refresh
   */
  const handleRefresh = () => {
    setRefreshing(true);
    carregarPedidos();
  };

  /**
   * Aprovar receita
   */
  const aprovar = async (pedidoId: number) => {
    Alert.alert(
      'Confirmar Aprovação',
      'Tem certeza que deseja aprovar esta receita?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Aprovar',
          onPress: async () => {
            try {
              setProcessando(true);
              await aprovarReceitaPedido(pedidoId);
              Alert.alert('Sucesso', 'Receita aprovada! O pedido pode prosseguir.');
              await carregarPedidos();
            } catch (error: any) {
              Alert.alert('Erro', error.message || 'Não foi possível aprovar a receita');
            } finally {
              setProcessando(false);
            }
          },
        },
      ]
    );
  };

  /**
   * Abrir modal de rejeição
   */
  const abrirModalRejeitar = (pedidoId: number) => {
    setPedidoSelecionado(pedidoId);
    setMotivo('');
    setModalRejeitar(true);
  };

  /**
   * Rejeitar receita
   */
  const rejeitar = async () => {
    if (!motivo.trim()) {
      Alert.alert('Atenção', 'Informe o motivo da rejeição');
      return;
    }

    if (!pedidoSelecionado) return;

    try {
      setProcessando(true);
      await rejeitarReceitaPedido(pedidoSelecionado, motivo);
      setModalRejeitar(false);
      Alert.alert('Receita Rejeitada', 'O cliente será notificado para enviar nova receita.');
      await carregarPedidos();
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Não foi possível rejeitar a receita');
    } finally {
      setProcessando(false);
    }
  };

  /**
   * Renderizar card de pedido
   */
  const renderPedido = ({ item }: { item: Pedido }) => (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.pedidoNumero}>Pedido #{item.numero || item.id}</Text>
          <Text style={styles.clienteNome}>{item.clienteNome || 'Cliente'}</Text>
        </View>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Pendente</Text>
        </View>
      </View>

      {/* Receita */}
      {item.receitaUrl && (
        <TouchableOpacity activeOpacity={0.9}>
          <Image
            source={{ uri: item.receitaUrl }}
            style={styles.receitaImage}
            resizeMode="contain"
          />
          <Text style={styles.verMaior}>👁️ Toque para ampliar</Text>
        </TouchableOpacity>
      )}

      {/* Itens do Pedido */}
      <View style={styles.itens}>
        <Text style={styles.itensTitle}>Medicamentos:</Text>
        {item.itens.map((produto, index) => (
          <Text key={index} style={styles.item}>
            • {produto.quantidade}x {produto.produtoNome}
          </Text>
        ))}
      </View>

      {/* Ações */}
      <View style={styles.acoes}>
        <TouchableOpacity
          style={styles.botaoRejeitar}
          onPress={() => abrirModalRejeitar(item.id)}
          disabled={processando}
        >
          <Ionicons name="close-circle" size={20} color="#fff" />
          <Text style={styles.botaoTexto}>Rejeitar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.botaoAprovar}
          onPress={() => aprovar(item.id)}
          disabled={processando}
        >
          <Ionicons name="checkmark-circle" size={20} color="#fff" />
          <Text style={styles.botaoTexto}>Aprovar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ProtectedRoute requiredRole="ROLE_FARMACEUTICO">
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'Validação de Receitas',
          headerStyle: {
            backgroundColor: temaMedico.cores.backgroundCard,
          },
          headerTintColor: temaMedico.cores.textoTitulo,
        }}
      />

      <View style={styles.container}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={temaMedico.cores.primaria} />
            <Text style={styles.loadingText}>Carregando receitas...</Text>
          </View>
        ) : (
          <FlatList
            data={pedidos}
            renderItem={renderPedido}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.list}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                colors={[temaMedico.cores.primaria]}
              />
            }
            ListEmptyComponent={() => (
              <View style={styles.emptyContainer}>
                <Ionicons name="checkmark-done" size={64} color={temaMedico.cores.sucesso} />
                <Text style={styles.emptyTitle}>Tudo em Dia!</Text>
                <Text style={styles.emptyText}>
                  Nenhuma receita pendente de validação no momento
                </Text>
              </View>
            )}
          />
        )}
      </View>

      {/* Modal de Rejeição */}
      <Modal
        visible={modalRejeitar}
        transparent
        animationType="slide"
        onRequestClose={() => setModalRejeitar(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Motivo da Rejeição</Text>

            <TextInput
              style={styles.input}
              placeholder="Ex: Receita ilegível, data vencida, etc."
              value={motivo}
              onChangeText={setMotivo}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalButtonCancel}
                onPress={() => setModalRejeitar(false)}
                disabled={processando}
              >
                <Text style={styles.modalButtonCancelText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButtonConfirm, processando && styles.buttonDisabled]}
                onPress={rejeitar}
                disabled={processando}
              >
                {processando ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.modalButtonConfirmText}>Confirmar Rejeição</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ProtectedRoute>
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
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: temaMedico.cores.textoSubtitulo,
  },
  list: {
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    ...temaMedico.sombras.pequena,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  pedidoNumero: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  clienteNome: {
    fontSize: 14,
    color: '#666',
  },
  badge: {
    backgroundColor: '#FFA500',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  receitaImage: {
    width: '100%',
    height: 300,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginBottom: 8,
  },
  verMaior: {
    textAlign: 'center',
    fontSize: 12,
    color: temaMedico.cores.primaria,
    marginBottom: 16,
  },
  itens: {
    marginBottom: 16,
  },
  itensTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  item: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  acoes: {
    flexDirection: 'row',
    gap: 12,
  },
  botaoRejeitar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: temaMedico.cores.erro,
    padding: 14,
    borderRadius: 8,
    gap: 8,
  },
  botaoAprovar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: temaMedico.cores.sucesso,
    padding: 14,
    borderRadius: 8,
    gap: 8,
  },
  botaoTexto: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: temaMedico.cores.textoTitulo,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: temaMedico.cores.textoSubtitulo,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 16,
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#333',
    minHeight: 100,
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButtonCancel: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
  },
  modalButtonCancelText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  modalButtonConfirm: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    backgroundColor: temaMedico.cores.erro,
    alignItems: 'center',
  },
  modalButtonConfirmText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
});
