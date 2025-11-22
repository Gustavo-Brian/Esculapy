/**
 * Tela de Cadastro - Arquitetura OOP + Português
 * Tela de cadastro organizada com classes de domínio e serviços
 */

import React, { useEffect } from 'react';
import {
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { Stack, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { temaMedico } from '@/src/estilos/temaMedico';
import { Toast } from '@/src/componentes/Toast';
import { useToast } from '@/src/hooks/useToast';
import { useAuth } from '@/src/hooks/useAuth';

// Hook OOP
import { useDadosCadastro } from './hooks/useDadosCadastro';

// Componentes em Português
import { CabecalhoCadastro } from './componentes/CabecalhoCadastro';
import { CampoFormulario } from './componentes/CampoFormulario';
import { BotaoEnviar } from './componentes/BotaoEnviar';
import { RodapeCadastro } from './componentes/RodapeCadastro';

export default function TelaCadastro() {
  // Hook de autenticação
  const { estaAutenticado } = useAuth();

  // Hook de toast
  const { toastState, hideToast } = useToast();

  // Hook com toda a lógica OOP
  const {
    dadosFormulario,
    erros,
    carregando,
    campoFocado,
    mostrarSenha,
    mostrarConfirmarSenha,
    manipuladores,
  } = useDadosCadastro();

  // Redireciona se já estiver autenticado
  useEffect(() => {
    if (estaAutenticado) {
      console.log('[Signup] Usuário já autenticado, redirecionando para home');
      router.replace('/home');
    }
  }, [estaAutenticado]);

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <Toast
        visible={toastState.visible}
        message={toastState.message}
        type={toastState.type}
        onHide={hideToast}
      />
      <KeyboardAvoidingView
        testID="signup-screen"
        style={estilos.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Botão Voltar */}
        <View style={estilos.headerContainer}>
          <TouchableOpacity
            style={estilos.botaoVoltar}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={24} color={temaMedico.cores.textoTitulo} />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={estilos.scrollView}
          contentContainerStyle={estilos.scrollConteudo}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Cabeçalho */}
          <CabecalhoCadastro />

          {/* Conteúdo */}
          <View style={estilos.conteudo}>
            <Text style={estilos.titulo}>Criar uma Conta</Text>

            {/* Formulário */}
            <View style={estilos.formulario}>
              {/* Nome */}
              <CampoFormulario
                icone="person-outline"
                placeholder="Nome completo"
                value={dadosFormulario.nome}
                onChangeText={(texto) => manipuladores.aoMudarCampo('nome', texto)}
                onFocus={() => manipuladores.aoFocarCampo('nome')}
                onBlur={manipuladores.aoDesfocarCampo}
                erro={erros.nome}
                estaFocado={campoFocado === 'nome'}
                autoCapitalize="words"
              />

              {/* Email */}
              <CampoFormulario
                icone="mail-outline"
                placeholder="Email"
                value={dadosFormulario.email}
                onChangeText={(texto) => manipuladores.aoMudarCampo('email', texto)}
                onFocus={() => manipuladores.aoFocarCampo('email')}
                onBlur={manipuladores.aoDesfocarCampo}
                erro={erros.email}
                estaFocado={campoFocado === 'email'}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />

              {/* CPF */}
              <CampoFormulario
                icone="card-outline"
                placeholder="CPF"
                value={dadosFormulario.cpf}
                onChangeText={(texto) => manipuladores.aoMudarCampo('cpf', texto)}
                onFocus={() => manipuladores.aoFocarCampo('cpf')}
                onBlur={manipuladores.aoDesfocarCampo}
                erro={erros.cpf}
                estaFocado={campoFocado === 'cpf'}
                keyboardType="numeric"
                maxLength={14}
              />

              {/* Telefone */}
              <CampoFormulario
                icone="call-outline"
                placeholder="Telefone (opcional)"
                value={dadosFormulario.telefone}
                onChangeText={(texto) => manipuladores.aoMudarCampo('telefone', texto)}
                onFocus={() => manipuladores.aoFocarCampo('telefone')}
                onBlur={manipuladores.aoDesfocarCampo}
                erro={erros.telefone}
                estaFocado={campoFocado === 'telefone'}
                keyboardType="phone-pad"
                maxLength={15}
              />

              {/* Data de Nascimento */}
              <CampoFormulario
                icone="calendar-outline"
                placeholder="Data de Nascimento (DD/MM/AAAA)"
                value={dadosFormulario.dataNascimento}
                onChangeText={(texto) => manipuladores.aoMudarCampo('dataNascimento', texto)}
                onFocus={() => manipuladores.aoFocarCampo('dataNascimento')}
                onBlur={manipuladores.aoDesfocarCampo}
                erro={erros.dataNascimento}
                estaFocado={campoFocado === 'dataNascimento'}
                keyboardType="numeric"
                maxLength={10}
              />

              {/* Senha */}
              <CampoFormulario
                icone="lock-closed-outline"
                placeholder="Senha"
                value={dadosFormulario.senha}
                onChangeText={(texto) => manipuladores.aoMudarCampo('senha', texto)}
                onFocus={() => manipuladores.aoFocarCampo('senha')}
                onBlur={manipuladores.aoDesfocarCampo}
                erro={erros.senha}
                estaFocado={campoFocado === 'senha'}
                secureTextEntry={!mostrarSenha}
                mostrarAlternarSenha
                aoAlternarSenha={manipuladores.aoAlternarVisibilidadeSenha}
                autoCapitalize="none"
              />

              {/* Confirmar Senha */}
              <CampoFormulario
                icone="lock-closed-outline"
                placeholder="Confirmar senha"
                value={dadosFormulario.confirmarSenha}
                onChangeText={(texto) => manipuladores.aoMudarCampo('confirmarSenha', texto)}
                onFocus={() => manipuladores.aoFocarCampo('confirmarSenha')}
                onBlur={manipuladores.aoDesfocarCampo}
                erro={erros.confirmarSenha}
                estaFocado={campoFocado === 'confirmarSenha'}
                secureTextEntry={!mostrarConfirmarSenha}
                mostrarAlternarSenha
                aoAlternarSenha={manipuladores.aoAlternarVisibilidadeConfirmarSenha}
                autoCapitalize="none"
              />

              {/* Botão Submit */}
              <BotaoEnviar aoClicar={manipuladores.aoEnviar} carregando={carregando} />
            </View>

            {/* Rodapé */}
            <RodapeCadastro aoClicarLogin={manipuladores.aoClicarLogin} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    backgroundColor: temaMedico.cores.background,
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingHorizontal: temaMedico.espacamentos.md,
    paddingBottom: temaMedico.espacamentos.sm,
  },
  botaoVoltar: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
    backgroundColor: temaMedico.cores.background,
  },
  scrollConteudo: {
    flexGrow: 1,
  },
  conteudo: {
    flex: 1,
    backgroundColor: temaMedico.cores.backgroundCard,
    borderTopLeftRadius: temaMedico.bordas.grande,
    borderTopRightRadius: temaMedico.bordas.grande,
    padding: temaMedico.espacamentos.xl,
  },
  titulo: {
    fontSize: temaMedico.fontes.tamanhos.xxl,
    fontWeight: temaMedico.fontes.pesos.bold,
    color: temaMedico.cores.textoTitulo,
    marginBottom: temaMedico.espacamentos.xl,
  },
  formulario: {
    marginBottom: temaMedico.espacamentos.lg,
  },
});
