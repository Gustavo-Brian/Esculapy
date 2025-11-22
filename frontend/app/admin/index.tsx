/**
 * Admin Dashboard Overview - Esculapi
 * Tela principal com estatísticas gerais do sistema
 */

import React from 'react';
import { View, ScrollView, Text, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { temaMedico } from '@/src/estilos/temaMedico';

export default function AdminDashboardScreen() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Painel Administrativo</Text>
          <Text style={styles.headerSubtitle}>Visão geral do sistema Esculapi</Text>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Cards de Estatísticas */}
          <View style={styles.statsGrid}>
            {/* Farmácias */}
            <View style={[styles.statCard, { backgroundColor: '#E3F2FD' }]}>
              <View style={styles.statIconContainer}>
                <Ionicons name="business" size={32} color="#1976D2" />
              </View>
              <Text style={styles.statValue}>--</Text>
              <Text style={styles.statLabel}>Farmácias Ativas</Text>
            </View>

            {/* Pendentes */}
            <View style={[styles.statCard, { backgroundColor: '#FFF3E0' }]}>
              <View style={styles.statIconContainer}>
                <Ionicons name="time" size={32} color="#F57C00" />
              </View>
              <Text style={styles.statValue}>--</Text>
              <Text style={styles.statLabel}>Pendentes Aprovação</Text>
            </View>

            {/* Usuários */}
            <View style={[styles.statCard, { backgroundColor: '#F3E5F5' }]}>
              <View style={styles.statIconContainer}>
                <Ionicons name="people" size={32} color="#7B1FA2" />
              </View>
              <Text style={styles.statValue}>--</Text>
              <Text style={styles.statLabel}>Usuários Ativos</Text>
            </View>

            {/* Produtos */}
            <View style={[styles.statCard, { backgroundColor: '#E8F5E9' }]}>
              <View style={styles.statIconContainer}>
                <Ionicons name="medkit" size={32} color="#388E3C" />
              </View>
              <Text style={styles.statValue}>--</Text>
              <Text style={styles.statLabel}>Produtos no Catálogo</Text>
            </View>
          </View>

          {/* Placeholder para futuras features */}
          <View style={styles.infoCard}>
            <Ionicons name="information-circle" size={24} color={temaMedico.cores.primaria} />
            <Text style={styles.infoText}>
              Dashboard em desenvolvimento. Use as abas abaixo para gerenciar farmácias, usuários e produtos.
            </Text>
          </View>
        </ScrollView>
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
    paddingBottom: 30,
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
  content: {
    flex: 1,
    padding: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    minWidth: '47%',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statIconContainer: {
    marginBottom: 8,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: temaMedico.cores.textoPrincipal,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: temaMedico.cores.textoClaro,
    textAlign: 'center',
  },
  infoCard: {
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: temaMedico.cores.textoPrincipal,
    lineHeight: 20,
  },
});
