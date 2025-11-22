/**
 * Help Screen - Nova Arquitetura
 */

import React, { useState, useCallback } from 'react';
import { View, ScrollView, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Stack, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { temaMedico } from '@/src/estilos/temaMedico';

interface HelpTopic {
  id: number;
  title: string;
  icon: string;
  description: string;
}

export default function HelpScreen() {
  const [topics] = useState<HelpTopic[]>([
    { id: 1, title: 'Como fazer um pedido', icon: 'cart-outline', description: 'Aprenda a fazer pedidos' },
    { id: 2, title: 'Formas de pagamento', icon: 'card-outline', description: 'Veja as opções disponíveis' },
    { id: 3, title: 'Rastreio de entrega', icon: 'location-outline', description: 'Acompanhe seu pedido' },
    { id: 4, title: 'Devolução e reembolso', icon: 'return-down-back-outline', description: 'Políticas de devolução' },
  ]);

  const handleBack = useCallback(() => router.back(), []);
  const handleTopicPress = useCallback((id: number) => console.log('Topic:', id), []);

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack}>
            <Ionicons name="arrow-back" size={24} color={temaMedico.cores.textoTitulo} />
          </TouchableOpacity>
          <Text style={styles.title}>Central de Ajuda</Text>
          <View style={{ width: 24 }} />
        </View>
        <ScrollView style={styles.content}>
          {topics.map((topic) => (
            <TouchableOpacity
              key={topic.id}
              style={styles.card}
              onPress={() => handleTopicPress(topic.id)}
            >
              <View style={styles.iconContainer}>
                <Ionicons name={topic.icon as any} size={24} color={temaMedico.cores.primaria} />
              </View>
              <View style={styles.info}>
                <Text style={styles.topicTitle}>{topic.title}</Text>
                <Text style={styles.description}>{topic.description}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={temaMedico.cores.textoClaro} />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </>
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
    flexDirection: 'row',
    backgroundColor: temaMedico.cores.backgroundCard,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: temaMedico.cores.backgroundDestaque,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  info: { flex: 1 },
  topicTitle: { fontSize: 16, fontWeight: '600', color: temaMedico.cores.textoTitulo },
  description: { fontSize: 13, color: temaMedico.cores.textoSubtitulo, marginTop: 4 },
});
