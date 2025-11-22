/**
 * ProductsHeader Component
 * Cabeçalho da tela de todos os produtos
 */

import React from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { temaMedico } from '@/src/estilos/temaMedico';

interface ProductsHeaderProps {
  onBackPress: () => void;
  searchTerm: string;
  onSearch: (text: string) => void;
  onClearSearch: () => void;
}

export const ProductsHeader: React.FC<ProductsHeaderProps> = ({
  onBackPress,
  searchTerm,
  onSearch,
  onClearSearch,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <TouchableOpacity style={styles.button} onPress={onBackPress}>
          <Ionicons name="arrow-back" size={24} color={temaMedico.cores.textoTitulo} />
        </TouchableOpacity>
        <Text style={styles.title}>Todos os Produtos</Text>
        <View style={styles.spacer} />
      </View>

      {/* Barra de Busca */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color={temaMedico.cores.primaria} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar produtos..."
            placeholderTextColor={temaMedico.cores.textoSecundario}
            value={searchTerm}
            onChangeText={onSearch}
            returnKeyType="search"
            autoCapitalize="none"
            autoCorrect={false}
          />
          {searchTerm.length > 0 && (
            <TouchableOpacity onPress={onClearSearch} style={styles.clearButton}>
              <Ionicons name="close-circle" size={20} color={temaMedico.cores.textoSecundario} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 60,
    paddingBottom: temaMedico.espacamentos.md,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: temaMedico.cores.borda,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: temaMedico.espacamentos.lg,
    marginBottom: temaMedico.espacamentos.md,
  },
  button: {
    padding: temaMedico.espacamentos.sm,
  },
  title: {
    fontSize: temaMedico.fontes.tamanhos.lg,
    fontWeight: temaMedico.fontes.pesos.semibold,
    color: temaMedico.cores.textoTitulo,
  },
  spacer: {
    width: 40,
  },
  searchContainer: {
    paddingHorizontal: temaMedico.espacamentos.lg,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
    borderRadius: temaMedico.bordas.grande,
    paddingHorizontal: temaMedico.espacamentos.md,
    height: 48,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: temaMedico.fontes.tamanhos.md,
    color: temaMedico.cores.textoTitulo,
  },
  clearButton: {
    padding: 4,
  },
});
