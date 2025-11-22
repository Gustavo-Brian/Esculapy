/**
 * TabBar Component
 */

import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { temaMedico } from '@/src/estilos/temaMedico';
import type { DashboardTab } from '../types/dashboard.types';

interface Tab {
  id: DashboardTab;
  label: string;
  icon: string;
}

const TABS: Tab[] = [
  { id: 'dashboard', label: 'Dashboard', icon: 'grid-outline' },
  { id: 'estoque', label: 'Estoque', icon: 'cube-outline' },
  { id: 'pedidos', label: 'Pedidos', icon: 'receipt-outline' },
  { id: 'farmaceuticos', label: 'Equipe', icon: 'people-outline' },
];

interface TabBarProps {
  activeTab: DashboardTab;
  onChangeTab: (tab: DashboardTab) => void;
}

export const TabBar: React.FC<TabBarProps> = ({ activeTab, onChangeTab }) => {
  return (
    <View style={styles.container}>
      {TABS.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <TouchableOpacity
            key={tab.id}
            style={[styles.tab, isActive && styles.tabActive]}
            onPress={() => onChangeTab(tab.id)}
          >
            <Ionicons
              name={tab.icon as any}
              size={20}
              color={isActive ? temaMedico.cores.primaria : temaMedico.cores.textoClaro}
            />
            <Text style={[styles.tabText, isActive && styles.tabTextActive]}>{tab.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: temaMedico.cores.backgroundCard,
    borderBottomWidth: 1,
    borderBottomColor: temaMedico.cores.borda,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 6,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: { borderBottomColor: temaMedico.cores.primaria },
  tabText: { fontSize: 13, fontWeight: '600', color: temaMedico.cores.textoClaro },
  tabTextActive: { color: temaMedico.cores.primaria },
});
