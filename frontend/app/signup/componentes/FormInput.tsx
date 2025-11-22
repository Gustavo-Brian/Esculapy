/**
 * FormInput Component
 * Input reutilizável para formulários
 */

import React from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet, TextInputProps } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { temaMedico } from '@/src/estilos/temaMedico';

interface FormInputProps extends TextInputProps {
  icone: keyof typeof Ionicons.glyphMap;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  error?: string;
  isFocused?: boolean;
  secureTextEntry?: boolean;
  showPasswordToggle?: boolean;
  onTogglePassword?: () => void;
}

export const FormInput: React.FC<FormInputProps> = ({
  icone,
  placeholder,
  value,
  onChangeText,
  onFocus,
  onBlur,
  error,
  isFocused = false,
  secureTextEntry = false,
  showPasswordToggle = false,
  onTogglePassword,
  ...textInputProps
}) => {
  return (
    <View style={styles.container}>
      <View
        style={[
          styles.inputContainer,
          isFocused && styles.inputContainerFocused,
          error && styles.inputContainerError,
        ]}
      >
        <Ionicons
          name={icone}
          size={20}
          color={temaMedico.cores.textoClaro}
          style={styles.icone}
        />
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={temaMedico.cores.textoClaro}
          value={value}
          onChangeText={onChangeText}
          onFocus={onFocus}
          onBlur={onBlur}
          secureTextEntry={secureTextEntry}
          {...textInputProps}
        />
        {showPasswordToggle && onTogglePassword && (
          <TouchableOpacity onPress={onTogglePassword} style={styles.toggleButton}>
            <Ionicons
              name={secureTextEntry ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color={temaMedico.cores.textoClaro}
            />
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: temaMedico.espacamentos.lg,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: temaMedico.cores.borda,
    borderRadius: temaMedico.bordas.media,
    paddingHorizontal: temaMedico.espacamentos.md,
    backgroundColor: temaMedico.cores.background,
  },
  inputContainerFocused: {
    borderColor: temaMedico.cores.primaria,
    backgroundColor: temaMedico.cores.backgroundCard,
  },
  inputContainerError: {
    borderColor: temaMedico.cores.erro,
  },
  icone: {
    marginRight: temaMedico.espacamentos.sm,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: temaMedico.fontes.tamanhos.md,
    color: temaMedico.cores.textoTitulo,
  },
  toggleButton: {
    padding: temaMedico.espacamentos.sm,
  },
  errorText: {
    fontSize: temaMedico.fontes.tamanhos.sm,
    color: temaMedico.cores.erro,
    marginTop: temaMedico.espacamentos.xs,
    marginLeft: temaMedico.espacamentos.xs,
  },
});
