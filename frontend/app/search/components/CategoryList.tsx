/**
 * CategoryList Component
 * Lista horizontal de categorias de filtro rápido
 */

import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { temaMedico } from '@/src/estilos/temaMedico';
import type { SearchCategory } from '../types/search.types';

interface CategoryListProps {
  categories: SearchCategory[];
  activeCategory: string | null;
  onSelectCategory: (id: string) => void;
}

export const CategoryList: React.FC<CategoryListProps> = ({
  categories,
  activeCategory,
  onSelectCategory,
}) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {categories.map((categoria) => {
        const isActive = activeCategory === categoria.id;
        return (
          <TouchableOpacity
            key={categoria.id}
            style={[
              styles.categoryChip,
              isActive && { backgroundColor: categoria.cor + '20' },
            ]}
            onPress={() => onSelectCategory(categoria.id)}
          >
            <Ionicons
              name={categoria.icone as any}
              size={18}
              color={isActive ? categoria.cor : temaMedico.cores.textoSubtitulo}
              style={styles.icon}
            />
            <Text
              style={[
                styles.categoryText,
                isActive && { color: categoria.cor, fontWeight: '600' },
              ]}
            >
              {categoria.nome}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: temaMedico.cores.backgroundInput,
    marginRight: 8,
  },
  icon: {
    marginRight: 6,
  },
  categoryText: {
    fontSize: 14,
    color: temaMedico.cores.textoSubtitulo,
  },
});
