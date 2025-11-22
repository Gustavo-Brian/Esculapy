/**
 * Favorites Screen - Nova Arquitetura
 */

import React, { useState, useCallback } from 'react';
import { View, FlatList, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Stack, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { temaMedico } from '@/src/estilos/temaMedico';
import { ProtectedRoute } from '@/src/componentes/ProtectedRoute';

interface FavoriteProduct {
  id: number;
  nome: string;
  preco: number;
  farmacia: string;
}

export default function FavoritesScreen() {
  const [favorites] = useState<FavoriteProduct[]>([
    { id: 1, nome: 'Paracetamol 500mg', preco: 12.9, farmacia: 'Farmácia Central' },
    { id: 2, nome: 'Vitamina C 1000mg', preco: 24.9, farmacia: 'Drogaria Popular' },
  ]);

  const handleBack = useCallback(() => router.back(), []);
  const handleProductPress = useCallback((id: number) => router.push(`/product/${id}`), []);

  const renderItem = ({ item }: { item: FavoriteProduct }) => (
    <TouchableOpacity style={styles.card} onPress={() => handleProductPress(item.id)}>
      <View style={styles.icon}>
        <Ionicons name="heart" size={24} color={temaMedico.cores.erro} />
      </View>
      <View style={styles.info}>
        <Text style={styles.name}>{item.nome}</Text>
        <Text style={styles.pharmacy}>{item.farmacia}</Text>
      </View>
      <Text style={styles.price}>R$ {item.preco.toFixed(2)}</Text>
    </TouchableOpacity>
  );

  return (
    <ProtectedRoute>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack}>
            <Ionicons name="arrow-back" size={24} color={temaMedico.cores.textoTitulo} />
          </TouchableOpacity>
          <Text style={styles.title}>Favoritos</Text>
          <View style={{ width: 24 }} />
        </View>
        <FlatList
          data={favorites}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
        />
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
  list: { padding: 16 },
  card: {
    flexDirection: 'row',
    backgroundColor: temaMedico.cores.backgroundCard,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
  icon: { marginRight: 12 },
  info: { flex: 1 },
  name: { fontSize: 16, fontWeight: '600', color: temaMedico.cores.textoTitulo },
  pharmacy: { fontSize: 13, color: temaMedico.cores.textoSubtitulo, marginTop: 4 },
  price: { fontSize: 18, fontWeight: '700', color: temaMedico.cores.primaria },
});
