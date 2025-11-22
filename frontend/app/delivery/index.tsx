/**
 * Delivery Screen - Nova Arquitetura
 */

import React, { useState, useCallback } from 'react';
import { View, ScrollView, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Stack, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { temaMedico } from '@/src/estilos/temaMedico';
import { ProtectedRoute } from '@/src/componentes/ProtectedRoute';

interface DeliveryOrder {
  id: number;
  numero: string;
  status: 'preparing' | 'inTransit' | 'delivered';
  items: number;
  total: number;
  estimativa: string;
}

export default function DeliveryScreen() {
  const [orders] = useState<DeliveryOrder[]>([
    { id: 1, numero: '#12345', status: 'inTransit', items: 3, total: 89.7, estimativa: '30-40 min' },
    { id: 2, numero: '#12344', status: 'delivered', items: 2, total: 45.8, estimativa: 'Entregue' },
  ]);

  const handleBack = useCallback(() => router.back(), []);
  const handleOrderPress = useCallback((id: number) => console.log('Order:', id), []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'preparing': return temaMedico.cores.alerta;
      case 'inTransit': return temaMedico.cores.primaria;
      case 'delivered': return temaMedico.cores.sucesso;
      default: return temaMedico.cores.textoClaro;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'preparing': return 'Preparando';
      case 'inTransit': return 'Em trânsito';
      case 'delivered': return 'Entregue';
      default: return status;
    }
  };

  return (
    <ProtectedRoute>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack}>
            <Ionicons name="arrow-back" size={24} color={temaMedico.cores.textoTitulo} />
          </TouchableOpacity>
          <Text style={styles.title}>Minhas Entregas</Text>
          <View style={{ width: 24 }} />
        </View>
        <ScrollView style={styles.content}>
          {orders.map((order) => (
            <TouchableOpacity
              key={order.id}
              style={styles.card}
              onPress={() => handleOrderPress(order.id)}
            >
              <View style={styles.cardHeader}>
                <Text style={styles.orderNumber}>Pedido {order.numero}</Text>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) + '20' }]}>
                  <Text style={[styles.statusText, { color: getStatusColor(order.status) }]}>
                    {getStatusText(order.status)}
                  </Text>
                </View>
              </View>
              <View style={styles.cardBody}>
                <View style={styles.infoRow}>
                  <Ionicons name="cube-outline" size={16} color={temaMedico.cores.textoClaro} />
                  <Text style={styles.infoText}>{order.items} itens</Text>
                </View>
                <View style={styles.infoRow}>
                  <Ionicons name="time-outline" size={16} color={temaMedico.cores.textoClaro} />
                  <Text style={styles.infoText}>{order.estimativa}</Text>
                </View>
              </View>
              <View style={styles.cardFooter}>
                <Text style={styles.total}>Total: R$ {order.total.toFixed(2)}</Text>
                <Ionicons name="chevron-forward" size={20} color={temaMedico.cores.textoClaro} />
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </ProtectedRoute>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: temaMedico.cores.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: temaMedico.cores.backgroundCard,
    borderBottomWidth: 1,
    borderBottomColor: temaMedico.cores.borda,
  },
  title: { fontSize: 20, fontWeight: '700', color: temaMedico.cores.textoTitulo },
  content: { flex: 1, padding: 16 },
  card: {
    backgroundColor: temaMedico.cores.backgroundCard,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  orderNumber: { fontSize: 16, fontWeight: '600', color: temaMedico.cores.textoTitulo },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 },
  statusText: { fontSize: 12, fontWeight: '600' },
  cardBody: { marginBottom: 12, gap: 8 },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  infoText: { fontSize: 14, color: temaMedico.cores.textoSubtitulo },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTopWidth: 1, borderTopColor: temaMedico.cores.borda },
  total: { fontSize: 16, fontWeight: '700', color: temaMedico.cores.primaria },
});
