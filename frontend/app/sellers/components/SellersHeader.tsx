/**
 * SellersHeader Component
 * Cabeçalho com busca
 */

import React from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { temaMedico } from '@/src/estilos/temaMedico';

interface SellersHeaderProps {
  searchValue: string;
  onSearch: (text: string) => void;
  onBackPress: () => void;
  pharmacyCount: number;
}

export const SellersHeader: React.FC<SellersHeaderProps> = ({
  searchValue,
  onSearch,
  onBackPress,
  pharmacyCount,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={temaMedico.cores.textoTitulo} />
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Farmácias</Text>
          <Text style={styles.subtitle}>{pharmacyCount} farmácias encontradas</Text>
        </View>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={temaMedico.cores.textoClaro} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar farmácia..."
          placeholderTextColor={temaMedico.cores.textoClaro}
          value={searchValue}
          onChangeText={onSearch}
        />
        {searchValue.length > 0 && (
          <TouchableOpacity onPress={() => onSearch('')}>
            <Ionicons name="close-circle" size={20} color={temaMedico.cores.textoClaro} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: temaMedico.cores.backgroundCard,
    paddingTop: 16,
    paddingBottom: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: temaMedico.cores.borda,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  backButton: {
    marginRight: 12,
    padding: 4,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: temaMedico.cores.textoTitulo,
  },
  subtitle: {
    fontSize: 14,
    color: temaMedico.cores.textoSubtitulo,
    marginTop: 2,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: temaMedico.cores.backgroundInput,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: temaMedico.cores.textoTitulo,
    marginLeft: 8,
    paddingVertical: 0,
  },
});
