/**
 * Componente Barra de Busca
 */

import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { temaMedico } from '@/src/estilos/temaMedico';

interface BarraBuscaProps {
  placeholder?: string;
  onPress?: () => void;
}

export const BarraBusca: React.FC<BarraBuscaProps> = ({
  placeholder = 'Buscar medicamentos...',
  onPress,
}) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <Ionicons name="search" size={20} color={temaMedico.cores.textoSecundario} />
      <View style={styles.inputWrapper} pointerEvents="none">
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={temaMedico.cores.textoSecundario}
          editable={false}
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: temaMedico.cores.backgroundCard,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    borderWidth: 1,
    borderColor: `${temaMedico.cores.textoClaro}30`,
  },
  inputWrapper: {
    flex: 1,
  },
  input: {
    fontSize: 16,
    color: temaMedico.cores.textoTitulo,
    padding: 0,
    margin: 0,
  },
});
