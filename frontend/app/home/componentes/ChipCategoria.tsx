/**
 * Componente Chip de Categoria
 */

import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { temaMedico } from '@/src/estilos/temaMedico';

interface ChipCategoriaProps {
  label: string;
  ativo?: boolean;
  onPress?: () => void;
}

export const ChipCategoria: React.FC<ChipCategoriaProps> = ({
  label,
  ativo = false,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={[styles.chip, ativo && styles.chipAtivo]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[styles.texto, ativo && styles.textoAtivo]}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: temaMedico.cores.backgroundCard,
    borderWidth: 1,
    borderColor: `${temaMedico.cores.textoClaro}30`,
    marginRight: 8,
  },
  chipAtivo: {
    backgroundColor: temaMedico.cores.primaria,
    borderColor: temaMedico.cores.primaria,
  },
  texto: {
    fontSize: 14,
    fontWeight: '600',
    color: temaMedico.cores.textoSecundario,
  },
  textoAtivo: {
    color: '#FFF',
  },
});
