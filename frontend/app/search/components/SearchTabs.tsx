/**
 * SearchTabs Component
 * Abas para alternar entre produtos e farmácias
 */

import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { temaMedico } from '@/src/estilos/temaMedico';
import type { SearchTab } from '../types/search.types';

interface SearchTabsProps {
  activeTab: SearchTab;
  onChangeTab: (tab: SearchTab) => void;
  productCount: number;
  pharmacyCount: number;
}

export const SearchTabs: React.FC<SearchTabsProps> = ({
  activeTab,
  onChangeTab,
  productCount,
  pharmacyCount,
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.tab, activeTab === 'produtos' && styles.tabActive]}
        onPress={() => onChangeTab('produtos')}
      >
        <Text style={[styles.tabText, activeTab === 'produtos' && styles.tabTextActive]}>
          Produtos ({productCount})
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.tab, activeTab === 'farmacias' && styles.tabActive]}
        onPress={() => onChangeTab('farmacias')}
      >
        <Text style={[styles.tabText, activeTab === 'farmacias' && styles.tabTextActive]}>
          Farmácias ({pharmacyCount})
        </Text>
      </TouchableOpacity>
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
    paddingVertical: 14,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: temaMedico.cores.primaria,
  },
  tabText: {
    fontSize: 15,
    fontWeight: '600',
    color: temaMedico.cores.textoSubtitulo,
  },
  tabTextActive: {
    color: temaMedico.cores.primaria,
  },
});
