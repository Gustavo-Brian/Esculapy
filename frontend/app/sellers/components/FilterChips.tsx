/**
 * FilterChips Component
 * Chips de filtros horizontais
 */

import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { temaMedico } from '@/src/estilos/temaMedico';
import type { FilterOption } from '../types/sellers.types';

interface FilterChipsProps {
  filters: FilterOption[];
  activeFilter: string;
  onFilterChange: (filterId: string) => void;
}

export const FilterChips: React.FC<FilterChipsProps> = ({
  filters,
  activeFilter,
  onFilterChange,
}) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {filters.map((filtro) => {
        const isActive = activeFilter === filtro.id;
        return (
          <TouchableOpacity
            key={filtro.id}
            style={[styles.chip, isActive && styles.chipActive]}
            onPress={() => onFilterChange(filtro.id)}
          >
            <Ionicons
              name={filtro.icone as any}
              size={16}
              color={isActive ? temaMedico.cores.primaria : temaMedico.cores.textoSubtitulo}
              style={styles.icon}
            />
            <Text style={[styles.text, isActive && styles.textActive]}>{filtro.nome}</Text>
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
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: temaMedico.cores.backgroundInput,
    marginRight: 8,
  },
  chipActive: {
    backgroundColor: temaMedico.cores.backgroundDestaque,
  },
  icon: {
    marginRight: 6,
  },
  text: {
    fontSize: 14,
    fontWeight: '500',
    color: temaMedico.cores.textoSubtitulo,
  },
  textActive: {
    color: temaMedico.cores.primaria,
    fontWeight: '600',
  },
});
