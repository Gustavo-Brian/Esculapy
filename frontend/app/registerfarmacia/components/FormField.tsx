/**
 * FormField Component
 */

import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { temaMedico } from '@/src/estilos/temaMedico';

interface FormFieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  placeholder?: string;
  error?: string;
  icon?: string;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  secureTextEntry?: boolean;
  showPasswordToggle?: boolean;
  onTogglePassword?: () => void;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  maxLength?: number;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  value,
  onChangeText,
  onFocus,
  onBlur,
  placeholder,
  error,
  icon,
  keyboardType = 'default',
  secureTextEntry,
  showPasswordToggle,
  onTogglePassword,
  autoCapitalize = 'sentences',
  maxLength,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputContainer, error && styles.inputError]}>
        {icon && <Ionicons name={icon as any} size={20} color={temaMedico.cores.textoClaro} />}
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          onFocus={onFocus}
          onBlur={onBlur}
          placeholder={placeholder}
          placeholderTextColor={temaMedico.cores.textoClaro}
          keyboardType={keyboardType}
          secureTextEntry={secureTextEntry}
          autoCapitalize={autoCapitalize}
          autoCorrect={false}
          maxLength={maxLength}
        />
        {showPasswordToggle && (
          <TouchableOpacity onPress={onTogglePassword}>
            <Ionicons
              name={secureTextEntry ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color={temaMedico.cores.textoClaro}
            />
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: 16 },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: temaMedico.cores.textoTitulo,
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: temaMedico.cores.backgroundCard,
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 48,
    borderWidth: 1,
    borderColor: temaMedico.cores.borda,
  },
  inputError: { borderColor: temaMedico.cores.erro },
  input: {
    flex: 1,
    fontSize: 15,
    color: temaMedico.cores.textoTitulo,
    marginLeft: 8,
  },
  error: {
    fontSize: 12,
    color: temaMedico.cores.erro,
    marginTop: 4,
  },
});
