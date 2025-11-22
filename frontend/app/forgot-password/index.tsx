/**
 * Tela: Esqueceu Senha - Arquitetura OOP + Português
 * Tela para recuperação de senha
 */

import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { temaMedico } from '@/src/estilos/temaMedico';

// Hook OOP
import { useDadosRecuperacao } from './hooks/useDadosRecuperacao';

export default function TelaEsqueceuSenha() {
  // Hook com toda a lógica OOP
  const { email, carregando, manipuladores } = useDadosRecuperacao();

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={estilos.container}>
        {/* Cabeçalho */}
        <View style={estilos.header}>
          <TouchableOpacity onPress={manipuladores.aoVoltar}>
            <Ionicons name="arrow-back" size={24} color={temaMedico.cores.textoTitulo} />
          </TouchableOpacity>
        </View>

        {/* Conteúdo */}
        <View style={estilos.content}>
          <View style={estilos.iconContainer}>
            <Ionicons name="lock-closed-outline" size={64} color={temaMedico.cores.primaria} />
          </View>

          <Text style={estilos.title}>Esqueceu sua senha?</Text>
          <Text style={estilos.subtitle}>
            Digite seu e-mail e enviaremos instruções para redefinir sua senha.
          </Text>

          {/* Campo de E-mail */}
          <View style={estilos.inputContainer}>
            <Ionicons name="mail-outline" size={20} color={temaMedico.cores.textoClaro} />
            <TextInput
              style={estilos.input}
              placeholder="Seu e-mail"
              value={email}
              onChangeText={manipuladores.aoMudarEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!carregando}
            />
          </View>

          {/* Botão Enviar */}
          <TouchableOpacity
            style={[estilos.button, carregando && estilos.buttonDisabled]}
            onPress={manipuladores.aoEnviar}
            disabled={carregando}
          >
            <Text style={estilos.buttonText}>
              {carregando ? 'Enviando...' : 'Enviar Instruções'}
            </Text>
          </TouchableOpacity>

          {/* Link Voltar */}
          <TouchableOpacity onPress={manipuladores.aoVoltar}>
            <Text style={estilos.backToLogin}>Voltar para o login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: temaMedico.cores.background,
  },
  header: {
    padding: temaMedico.espacamentos.md,
  },
  content: {
    flex: 1,
    padding: temaMedico.espacamentos.xl,
    justifyContent: 'center',
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: temaMedico.cores.backgroundDestaque,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: temaMedico.espacamentos.xxl,
  },
  title: {
    fontSize: temaMedico.fontes.tamanhos.xxl,
    fontWeight: temaMedico.fontes.pesos.bold,
    color: temaMedico.cores.textoTitulo,
    textAlign: 'center',
    marginBottom: temaMedico.espacamentos.md,
  },
  subtitle: {
    fontSize: temaMedico.fontes.tamanhos.md,
    color: temaMedico.cores.textoSubtitulo,
    textAlign: 'center',
    marginBottom: temaMedico.espacamentos.xxl,
    lineHeight: 22,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: temaMedico.cores.backgroundCard,
    borderRadius: temaMedico.bordas.media,
    paddingHorizontal: temaMedico.espacamentos.md,
    marginBottom: temaMedico.espacamentos.xl,
    height: 56,
  },
  input: {
    flex: 1,
    fontSize: temaMedico.fontes.tamanhos.md,
    color: temaMedico.cores.textoTitulo,
    marginLeft: temaMedico.espacamentos.sm,
  },
  button: {
    backgroundColor: temaMedico.cores.primaria,
    paddingVertical: temaMedico.espacamentos.md,
    borderRadius: temaMedico.bordas.media,
    alignItems: 'center',
    marginBottom: temaMedico.espacamentos.md,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    fontSize: temaMedico.fontes.tamanhos.md,
    fontWeight: temaMedico.fontes.pesos.semibold,
    color: temaMedico.cores.textoBranco,
  },
  backToLogin: {
    fontSize: temaMedico.fontes.tamanhos.md,
    fontWeight: temaMedico.fontes.pesos.semibold,
    color: temaMedico.cores.primaria,
    textAlign: 'center',
  },
});
