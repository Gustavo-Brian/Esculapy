/**
 * SubmitButton Component
 * Botão de submit do formulário
 */

import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { temaMedico } from '@/src/estilos/temaMedico';

interface SubmitButtonProps {
  onPress: () => void;
  loading: boolean;
  text?: string;
  loadingText?: string;
}

export const SubmitButton: React.FC<SubmitButtonProps> = ({
  onPress,
  loading,
  text = 'Criar Conta',
  loadingText = 'Criando conta...',
}) => {
  return (
    <TouchableOpacity
      style={[styles.button, loading && styles.buttonDisabled]}
      onPress={onPress}
      disabled={loading}
      activeOpacity={0.8}
    >
      <Text style={styles.buttonText}>{loading ? loadingText : text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: temaMedico.cores.primaria,
    paddingVertical: temaMedico.espacamentos.lg,
    borderRadius: temaMedico.bordas.media,
    alignItems: 'center',
    marginTop: temaMedico.espacamentos.md,
    ...temaMedico.sombras.pequena,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    fontSize: temaMedico.fontes.tamanhos.lg,
    fontWeight: temaMedico.fontes.pesos.bold,
    color: temaMedico.cores.textoBranco,
  },
});
