/**
 * Register Pharmacy Screen - Arquitetura OOP
 */

import React, { useEffect } from 'react';
import { View, ScrollView, Text, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { Stack, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { temaMedico } from '@/src/estilos/temaMedico';
import { useAuth } from '@/src/hooks/useAuth';
import { useDadosRegistroFarmacia } from './hooks/useDadosRegistroFarmacia';
import { FormField } from './components/FormField';

export default function RegisterFarmaciaScreen() {
  const { estaAutenticado } = useAuth();
  const { dados, mostrarSenha, mostrarConfirmarSenha, erros, carregando, manipuladores } = useDadosRegistroFarmacia();

  // Redireciona se já estiver autenticado
  useEffect(() => {
    if (estaAutenticado) {
      console.log('[RegisterFarmacia] Usuário já autenticado, redirecionando para home');
      router.replace('/home');
    }
  }, [estaAutenticado]);

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={manipuladores.aoVoltar}>
            <Ionicons name="arrow-back" size={24} color={temaMedico.cores.textoTitulo} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Cadastrar Farmácia</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <Text style={styles.sectionTitle}>Dados de Acesso</Text>

          <FormField
            label="E-mail"
            value={dados.email}
            onChangeText={(text) => manipuladores.aoAlterarCampo('email', text)}
            placeholder="seu@email.com"
            icon="mail-outline"
            keyboardType="email-address"
            autoCapitalize="none"
            error={erros.email}
          />

          <FormField
            label="Senha"
            value={dados.senha}
            onChangeText={(text) => manipuladores.aoAlterarCampo('senha', text)}
            placeholder="Mínimo 6 caracteres"
            icon="lock-closed-outline"
            secureTextEntry={!mostrarSenha}
            showPasswordToggle
            onTogglePassword={manipuladores.aoAlternarSenha}
            autoCapitalize="none"
            error={erros.senha}
          />

          <FormField
            label="Confirmar Senha"
            value={dados.confirmarSenha}
            onChangeText={(text) => manipuladores.aoAlterarCampo('confirmarSenha', text)}
            placeholder="Digite a senha novamente"
            icon="lock-closed-outline"
            secureTextEntry={!mostrarConfirmarSenha}
            showPasswordToggle
            onTogglePassword={manipuladores.aoAlternarConfirmarSenha}
            autoCapitalize="none"
            error={erros.confirmarSenha}
          />

          <View style={styles.divider} />
          <Text style={styles.sectionTitle}>Dados da Farmácia</Text>

          <FormField
            label="CNPJ"
            value={dados.cnpj}
            onChangeText={(text) => manipuladores.aoAlterarCampo('cnpj', text)}
            placeholder="00.000.000/0000-00"
            icon="document-text-outline"
            keyboardType="numeric"
            maxLength={18}
            error={erros.cnpj}
          />

          <FormField
            label="Razão Social"
            value={dados.razaoSocial}
            onChangeText={(text) => manipuladores.aoAlterarCampo('razaoSocial', text)}
            placeholder="Nome oficial da empresa"
            icon="business-outline"
            error={erros.razaoSocial}
          />

          <FormField
            label="Nome Fantasia"
            value={dados.nomeFantasia}
            onChangeText={(text) => manipuladores.aoAlterarCampo('nomeFantasia', text)}
            placeholder="Nome comercial"
            icon="storefront-outline"
            error={erros.nomeFantasia}
          />

          <FormField
            label="CRF-J (Inscrição Jurídica)"
            value={dados.crfJ}
            onChangeText={(text) => manipuladores.aoAlterarCampo('crfJ', text)}
            placeholder="Número do CRF-J"
            icon="shield-checkmark-outline"
            error={erros.crfJ}
          />

          <View style={styles.divider} />
          <Text style={styles.sectionTitle}>Dados de Contato</Text>

          <FormField
            label="E-mail de Contato"
            value={dados.emailContato}
            onChangeText={(text) => manipuladores.aoAlterarCampo('emailContato', text)}
            placeholder="contato@farmacia.com"
            icon="at-outline"
            keyboardType="email-address"
            autoCapitalize="none"
            error={erros.emailContato}
          />

          <FormField
            label="Telefone/Celular"
            value={dados.numeroCelularContato}
            onChangeText={(text) => manipuladores.aoAlterarCampo('numeroCelularContato', text)}
            placeholder="(00) 00000-0000"
            icon="call-outline"
            keyboardType="phone-pad"
            maxLength={15}
            error={erros.numeroCelularContato}
          />

          <TouchableOpacity
            style={[styles.submitButton, carregando && styles.submitButtonDisabled]}
            onPress={manipuladores.aoSubmeter}
            disabled={carregando}
          >
            <Text style={styles.submitButtonText}>
              {carregando ? 'Cadastrando...' : 'Cadastrar Farmácia'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.loginLink} onPress={manipuladores.aoIrParaLogin}>
            <Text style={styles.loginLinkText}>Já tem uma conta? Faça login</Text>
          </TouchableOpacity>

          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: temaMedico.cores.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: temaMedico.cores.backgroundCard,
    borderBottomWidth: 1,
    borderBottomColor: temaMedico.cores.borda,
  },
  headerTitle: { fontSize: 20, fontWeight: '700', color: temaMedico.cores.textoTitulo },
  content: { flex: 1, paddingHorizontal: 20, paddingTop: 20 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: temaMedico.cores.textoTitulo,
    marginBottom: 16,
  },
  divider: { height: 24 },
  submitButton: {
    backgroundColor: temaMedico.cores.primaria,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 24,
  },
  submitButtonDisabled: { opacity: 0.6 },
  submitButtonText: { fontSize: 16, fontWeight: '600', color: '#FFF' },
  loginLink: { marginTop: 16, alignItems: 'center' },
  loginLinkText: { fontSize: 15, fontWeight: '600', color: temaMedico.cores.primaria },
});
