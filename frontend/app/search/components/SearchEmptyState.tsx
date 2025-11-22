/**
 * SearchEmptyState Component
 * Estado vazio para quando não há resultados ou busca
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { temaMedico } from '@/src/estilos/temaMedico';

interface SearchEmptyStateProps {
  hasSearchTerm: boolean;
}

export const SearchEmptyState: React.FC<SearchEmptyStateProps> = ({ hasSearchTerm }) => {
  if (!hasSearchTerm) {
    return (
      <View style={styles.container}>
        <Ionicons name="search" size={64} color={temaMedico.cores.textoClaro} />
        <Text style={styles.title}>Buscar Produtos e Farmácias</Text>
        <Text style={styles.message}>
          Digite o nome de um produto ou farmácia para começar a buscar.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Ionicons name="sad-outline" size={64} color={temaMedico.cores.textoClaro} />
      <Text style={styles.title}>Nenhum resultado encontrado</Text>
      <Text style={styles.message}>
        Não encontramos nada para sua busca. Tente usar outros termos.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 60,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: temaMedico.cores.textoTitulo,
    marginTop: 20,
    marginBottom: 12,
    textAlign: 'center',
  },
  message: {
    fontSize: 15,
    color: temaMedico.cores.textoSubtitulo,
    textAlign: 'center',
    lineHeight: 22,
  },
});
