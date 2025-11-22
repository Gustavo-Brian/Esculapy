/**
 * LoginForm Component
 * Formulário de login com email e senha
 */

import React from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { temaMedico } from '@/src/estilos/temaMedico';
import type { LoginFormData, LoginValidationErrors } from '../types/login.types';

interface LoginFormProps {
  formData: LoginFormData;
  errors: LoginValidationErrors;
  showPassword: boolean;
  focusedField: string | null;
  onFieldChange: (field: keyof LoginFormData, value: string) => void;
  onTogglePassword: () => void;
  onFocusField: (field: string) => void;
  onBlurField: () => void;
  onForgotPassword: () => void;
  onSubmit: () => void;
  loading: boolean;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  formData,
  errors,
  showPassword,
  focusedField,
  onFieldChange,
  onTogglePassword,
  onFocusField,
  onBlurField,
  onForgotPassword,
  onSubmit,
  loading,
}) => {
  return (
    <View style={styles.container}>
      {/* Campo Email */}
      <View style={styles.field}>
        <View
          style={[
            styles.inputContainer,
            focusedField === 'email' && styles.inputContainerFocused,
            errors.email && styles.inputContainerError,
          ]}
        >
          <Ionicons
            name="mail-outline"
            size={20}
            color={temaMedico.cores.textoClaro}
            style={styles.icon}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor={temaMedico.cores.textoClaro}
            value={formData.email}
            onChangeText={(text) => onFieldChange('email', text)}
            onFocus={() => onFocusField('email')}
            onBlur={onBlurField}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>
        {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
      </View>

      {/* Campo Senha */}
      <View style={styles.field}>
        <View
          style={[
            styles.inputContainer,
            focusedField === 'senha' && styles.inputContainerFocused,
            errors.senha && styles.inputContainerError,
          ]}
        >
          <Ionicons
            name="lock-closed-outline"
            size={20}
            color={temaMedico.cores.textoClaro}
            style={styles.icon}
          />
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="Senha"
            placeholderTextColor={temaMedico.cores.textoClaro}
            value={formData.senha}
            onChangeText={(text) => onFieldChange('senha', text)}
            onFocus={() => onFocusField('senha')}
            onBlur={onBlurField}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
          />
          <TouchableOpacity onPress={onTogglePassword} style={styles.toggleButton}>
            <Ionicons
              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color={temaMedico.cores.textoClaro}
            />
          </TouchableOpacity>
        </View>
        {errors.senha && <Text style={styles.errorText}>{errors.senha}</Text>}
      </View>

      {/* Link Esqueci minha senha */}
      <TouchableOpacity onPress={onForgotPassword}>
        <Text style={styles.forgotPassword}>Esqueceu sua senha?</Text>
      </TouchableOpacity>

      {/* Botão de Login */}
      <TouchableOpacity
        style={[styles.submitButton, loading && styles.submitButtonDisabled]}
        onPress={onSubmit}
        activeOpacity={0.8}
        disabled={loading}
      >
        <Text style={styles.submitButtonText}>
          {loading ? 'Entrando...' : 'Entrar'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: temaMedico.espacamentos.lg,
  },
  field: {
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
  icon: {
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
  forgotPassword: {
    fontSize: temaMedico.fontes.tamanhos.sm,
    fontWeight: temaMedico.fontes.pesos.semibold,
    color: temaMedico.cores.primaria,
    textAlign: 'right',
    marginBottom: temaMedico.espacamentos.lg,
  },
  submitButton: {
    backgroundColor: temaMedico.cores.primaria,
    paddingVertical: temaMedico.espacamentos.lg,
    borderRadius: temaMedico.bordas.media,
    alignItems: 'center',
    ...temaMedico.sombras.pequena,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    fontSize: temaMedico.fontes.tamanhos.lg,
    fontWeight: temaMedico.fontes.pesos.bold,
    color: temaMedico.cores.textoBranco,
  },
});
