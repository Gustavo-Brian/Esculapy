/**
 * Tela de Seleção de Tipo de Conta - Arquitetura OOP + Português
 * Permite escolher entre cadastro/login como Cliente ou Farmácia
 */

import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Stack, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { temaMedico } from '@/src/estilos/temaMedico';
import { useAuth } from '@/src/hooks/useAuth';

export default function TelaSelecaoTipoConta() {
  const { estaAutenticado } = useAuth();

  // Redireciona se já estiver autenticado
  useEffect(() => {
    if (estaAutenticado) {
      console.log('[AuthSelect] Usuário já autenticado, redirecionando para home');
      router.replace('/home');
    }
  }, [estaAutenticado]);
  const navegarParaLoginCliente = () => {
    router.push('/login');
  };

  const navegarParaCadastroCliente = () => {
    router.push('/signup');
  };

  const navegarParaCadastroFarmacia = () => {
    router.push('/registerfarmacia');
  };

  const navegarParaLoginFarmacia = () => {
    // Login de farmácia também usa a mesma tela de login
    router.push('/login');
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView style={estilos.container} contentContainerStyle={estilos.conteudo}>
        {/* Cabeçalho */}
        <View style={estilos.cabecalho}>
          <View style={estilos.logoContainer}>
            <Ionicons name="medical" size={60} color={temaMedico.cores.primaria} />
          </View>
          <Text style={estilos.titulo}>Bem-vindo ao Esculapi</Text>
          <Text style={estilos.subtitulo}>Como você deseja continuar?</Text>
        </View>

        {/* Opções de Tipo de Conta */}
        <View style={estilos.opcoesContainer}>
          {/* Opção Cliente */}
          <View style={estilos.opcaoCard}>
            <View style={estilos.opcaoIcone}>
              <Ionicons name="person" size={40} color={temaMedico.cores.primaria} />
            </View>
            <Text style={estilos.opcaoTitulo}>Sou Cliente</Text>
            <Text style={estilos.opcaoDescricao}>
              Compre medicamentos e produtos de saúde com os melhores preços
            </Text>

            {/* Botões Cliente */}
            <TouchableOpacity
              style={estilos.botaoPrimario}
              onPress={navegarParaCadastroCliente}
              activeOpacity={0.8}
            >
              <Text style={estilos.botaoPrimarioTexto}>Criar Conta</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={estilos.botaoSecundario}
              onPress={navegarParaLoginCliente}
              activeOpacity={0.8}
            >
              <Text style={estilos.botaoSecundarioTexto}>Já tenho conta</Text>
            </TouchableOpacity>
          </View>

          {/* Separador */}
          <View style={estilos.separador}>
            <View style={estilos.separadorLinha} />
            <Text style={estilos.separadorTexto}>OU</Text>
            <View style={estilos.separadorLinha} />
          </View>

          {/* Opção Farmácia */}
          <View style={estilos.opcaoCard}>
            <View style={estilos.opcaoIcone}>
              <Ionicons name="storefront" size={40} color={temaMedico.cores.secundaria} />
            </View>
            <Text style={estilos.opcaoTitulo}>Sou Farmácia</Text>
            <Text style={estilos.opcaoDescricao}>
              Venda seus produtos e alcance mais clientes
            </Text>

            {/* Botões Farmácia */}
            <TouchableOpacity
              style={[estilos.botaoPrimario, estilos.botaoFarmacia]}
              onPress={navegarParaCadastroFarmacia}
              activeOpacity={0.8}
            >
              <Text style={estilos.botaoPrimarioTexto}>Cadastrar Farmácia</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={estilos.botaoSecundario}
              onPress={navegarParaLoginFarmacia}
              activeOpacity={0.8}
            >
              <Text style={estilos.botaoSecundarioTexto}>Já tenho conta</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: temaMedico.cores.background,
  },
  conteudo: {
    flexGrow: 1,
    paddingHorizontal: temaMedico.espacamentos.xl,
    paddingVertical: temaMedico.espacamentos.xxl,
  },
  cabecalho: {
    alignItems: 'center',
    marginBottom: temaMedico.espacamentos.xxl,
    marginTop: temaMedico.espacamentos.xl,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: temaMedico.cores.backgroundCard,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: temaMedico.espacamentos.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  titulo: {
    fontSize: temaMedico.fontes.tamanhos.xxxl,
    fontWeight: temaMedico.fontes.pesos.bold,
    color: temaMedico.cores.textoTitulo,
    marginBottom: temaMedico.espacamentos.sm,
  },
  subtitulo: {
    fontSize: temaMedico.fontes.tamanhos.md,
    color: temaMedico.cores.textoSecundario,
    textAlign: 'center',
  },
  opcoesContainer: {
    flex: 1,
  },
  opcaoCard: {
    backgroundColor: temaMedico.cores.backgroundCard,
    borderRadius: temaMedico.bordas.grande,
    padding: temaMedico.espacamentos.xl,
    marginBottom: temaMedico.espacamentos.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  opcaoIcone: {
    alignSelf: 'center',
    marginBottom: temaMedico.espacamentos.md,
  },
  opcaoTitulo: {
    fontSize: temaMedico.fontes.tamanhos.xl,
    fontWeight: temaMedico.fontes.pesos.bold,
    color: temaMedico.cores.textoTitulo,
    textAlign: 'center',
    marginBottom: temaMedico.espacamentos.sm,
  },
  opcaoDescricao: {
    fontSize: temaMedico.fontes.tamanhos.sm,
    color: temaMedico.cores.textoSecundario,
    textAlign: 'center',
    marginBottom: temaMedico.espacamentos.lg,
    lineHeight: 20,
  },
  botaoPrimario: {
    backgroundColor: temaMedico.cores.primaria,
    paddingVertical: temaMedico.espacamentos.md,
    borderRadius: temaMedico.bordas.medio,
    marginBottom: temaMedico.espacamentos.sm,
    shadowColor: temaMedico.cores.primaria,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  botaoFarmacia: {
    backgroundColor: temaMedico.cores.secundaria,
    shadowColor: temaMedico.cores.secundaria,
  },
  botaoPrimarioTexto: {
    fontSize: temaMedico.fontes.tamanhos.md,
    fontWeight: temaMedico.fontes.pesos.semibold,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  botaoSecundario: {
    backgroundColor: 'transparent',
    paddingVertical: temaMedico.espacamentos.md,
    borderRadius: temaMedico.bordas.medio,
    borderWidth: 1,
    borderColor: temaMedico.cores.borda,
  },
  botaoSecundarioTexto: {
    fontSize: temaMedico.fontes.tamanhos.md,
    fontWeight: temaMedico.fontes.pesos.medium,
    color: temaMedico.cores.textoSecundario,
    textAlign: 'center',
  },
  separador: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: temaMedico.espacamentos.lg,
  },
  separadorLinha: {
    flex: 1,
    height: 1,
    backgroundColor: temaMedico.cores.borda,
  },
  separadorTexto: {
    marginHorizontal: temaMedico.espacamentos.md,
    fontSize: temaMedico.fontes.tamanhos.sm,
    fontWeight: temaMedico.fontes.pesos.medium,
    color: temaMedico.cores.textoSecundario,
  },
});