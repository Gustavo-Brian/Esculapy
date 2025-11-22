/**
 * Tela de Login - Arquitetura OOP + Português
 * Tela de login organizada com classes de domínio e serviços
 */

import React, { useEffect } from 'react';
import {
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  View,
  Text,
} from 'react-native';
import { Stack, router } from 'expo-router';
import { loginStyles as styles } from '@/src/estilos/pages/loginStyles';
import { Toast } from '@/src/componentes/Toast';
import { useToast } from '@/src/hooks/useToast';
import { useAuth } from '@/src/hooks/useAuth';

// Hook OOP
import { useDadosLogin } from './hooks/useDadosLogin';

// Componentes em Português
import { CabecalhoLogin } from './componentes/CabecalhoLogin';
import { FormularioLogin } from './componentes/FormularioLogin';
import { RodapeLogin } from './componentes/RodapeLogin';

export default function TelaLogin() {
  // Hook de autenticação
  const { estaAutenticado } = useAuth();

  // Hook de toast
  const { toastState, hideToast } = useToast();

  // Hook com toda a lógica OOP
  const {
    dadosFormulario,
    erros,
    carregando,
    mostrarSenha,
    manipuladores,
  } = useDadosLogin();

  // Redireciona se já estiver autenticado
  useEffect(() => {
    if (estaAutenticado) {
      console.log('[Login] Usuário já autenticado, redirecionando para home');
      router.replace('/home');
    }
  }, [estaAutenticado]);

  // Estado de campo focado (para UI)
  const [campoFocado, setCampoFocado] = React.useState<string | null>(null);

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
        testID="login-screen"
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Cabeçalho */}
          <CabecalhoLogin />

          {/* Conteúdo */}
          <View style={styles.conteudo}>
            <Text style={styles.titulo}>Entrar</Text>

            {/* Formulário */}
            <FormularioLogin
              dadosFormulario={dadosFormulario}
              erros={erros}
              mostrarSenha={mostrarSenha}
              campoFocado={campoFocado}
              aoMudarCampo={manipuladores.aoMudarCampo}
              aoAlternarSenha={manipuladores.aoAlternarVisibilidadeSenha}
              aoFocarCampo={setCampoFocado}
              aoDesfocarCampo={() => setCampoFocado(null)}
              aoClicarEsqueciSenha={manipuladores.aoClicarEsqueciSenha}
              aoEnviar={manipuladores.aoEnviar}
              aoEntrarComoVisitante={manipuladores.aoEntrarComoVisitante}
              carregando={carregando}
            />

            {/* Rodapé */}
            <RodapeLogin aoClicarCadastro={manipuladores.aoClicarCadastro} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}
