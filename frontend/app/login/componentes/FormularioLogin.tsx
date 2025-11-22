/**
 * Componente FormularioLogin
 * Formulário de login com email e senha (OOP + Português)
 */

import React from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { temaMedico } from '@/src/estilos/temaMedico';

interface DadosFormulario {
  email: string;
  senha: string;
}

interface ErrosValidacao {
  email?: string;
  senha?: string;
}

interface PropriedadesFormularioLogin {
  dadosFormulario: DadosFormulario;
  erros: ErrosValidacao;
  mostrarSenha: boolean;
  campoFocado: string | null;
  aoMudarCampo: (campo: keyof DadosFormulario, valor: string) => void;
  aoAlternarSenha: () => void;
  aoFocarCampo: (campo: string) => void;
  aoDesfocarCampo: () => void;
  aoClicarEsqueciSenha: () => void;
  aoEnviar: () => void;
  aoEntrarComoVisitante: () => void;
  carregando: boolean;
}

export const FormularioLogin: React.FC<PropriedadesFormularioLogin> = ({
  dadosFormulario,
  erros,
  mostrarSenha,
  campoFocado,
  aoMudarCampo,
  aoAlternarSenha,
  aoFocarCampo,
  aoDesfocarCampo,
  aoClicarEsqueciSenha,
  aoEnviar,
  aoEntrarComoVisitante,
  carregando,
}) => {
  return (
    <View style={estilos.container}>
      {/* Campo Email */}
      <View style={estilos.campo}>
        <View
          style={[
            estilos.containerInput,
            campoFocado === 'email' && estilos.containerInputFocado,
            erros.email && estilos.containerInputErro,
          ]}
        >
          <Ionicons
            name="mail-outline"
            size={20}
            color={temaMedico.cores.textoClaro}
            style={estilos.icone}
          />
          <TextInput
            testID="input-email"
            style={estilos.input}
            placeholder="Email"
            placeholderTextColor={temaMedico.cores.textoClaro}
            value={dadosFormulario.email}
            onChangeText={(texto) => aoMudarCampo('email', texto)}
            onFocus={() => aoFocarCampo('email')}
            onBlur={aoDesfocarCampo}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>
        {erros.email && <Text style={estilos.textoErro}>{erros.email}</Text>}
      </View>

      {/* Campo Senha */}
      <View style={estilos.campo}>
        <View
          style={[
            estilos.containerInput,
            campoFocado === 'senha' && estilos.containerInputFocado,
            erros.senha && estilos.containerInputErro,
          ]}
        >
          <Ionicons
            name="lock-closed-outline"
            size={20}
            color={temaMedico.cores.textoClaro}
            style={estilos.icone}
          />
          <TextInput
            testID="input-senha"
            style={[estilos.input, { flex: 1 }]}
            placeholder="Senha"
            placeholderTextColor={temaMedico.cores.textoClaro}
            value={dadosFormulario.senha}
            onChangeText={(texto) => aoMudarCampo('senha', texto)}
            onFocus={() => aoFocarCampo('senha')}
            onBlur={aoDesfocarCampo}
            secureTextEntry={!mostrarSenha}
            autoCapitalize="none"
          />
          <TouchableOpacity
            testID="toggle-senha"
            onPress={aoAlternarSenha}
            style={estilos.botaoAlternar}
          >
            <Ionicons
              name={mostrarSenha ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color={temaMedico.cores.textoClaro}
            />
          </TouchableOpacity>
        </View>
        {erros.senha && <Text style={estilos.textoErro}>{erros.senha}</Text>}
      </View>

      {/* Link Esqueci minha senha */}
      <TouchableOpacity onPress={aoClicarEsqueciSenha}>
        <Text style={estilos.esqueciSenha}>Esqueceu sua senha?</Text>
      </TouchableOpacity>

      {/* Botão de Login */}
      <TouchableOpacity
        testID="botao-entrar"
        style={[estilos.botaoEnviar, carregando && estilos.botaoEnviarDesabilitado]}
        onPress={aoEnviar}
        activeOpacity={0.8}
        disabled={carregando}
      >
        <Text style={estilos.textoBotaoEnviar}>
          {carregando ? 'Entrando...' : 'Entrar'}
        </Text>
      </TouchableOpacity>

      {/* Separador */}
      <View style={estilos.separador}>
        <View style={estilos.separadorLinha} />
        <Text style={estilos.separadorTexto}>OU</Text>
        <View style={estilos.separadorLinha} />
      </View>

      {/* Botão Entrar como Visitante */}
      <TouchableOpacity
        style={estilos.botaoVisitante}
        onPress={aoEntrarComoVisitante}
        activeOpacity={0.8}
      >
        <Ionicons
          name="globe-outline"
          size={20}
          color={temaMedico.cores.textoSecundario}
          style={estilos.iconeVisitante}
        />
        <Text style={estilos.textoBotaoVisitante}>Entrar como Visitante</Text>
      </TouchableOpacity>
    </View>
  );
};

const estilos = StyleSheet.create({
  container: {
    marginBottom: temaMedico.espacamentos.lg,
  },
  campo: {
    marginBottom: temaMedico.espacamentos.lg,
  },
  containerInput: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: temaMedico.cores.borda,
    borderRadius: temaMedico.bordas.media,
    paddingHorizontal: temaMedico.espacamentos.md,
    backgroundColor: temaMedico.cores.background,
  },
  containerInputFocado: {
    borderColor: temaMedico.cores.primaria,
    backgroundColor: temaMedico.cores.backgroundCard,
  },
  containerInputErro: {
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
  botaoAlternar: {
    padding: temaMedico.espacamentos.sm,
  },
  textoErro: {
    fontSize: temaMedico.fontes.tamanhos.sm,
    color: temaMedico.cores.erro,
    marginTop: temaMedico.espacamentos.xs,
    marginLeft: temaMedico.espacamentos.xs,
  },
  esqueciSenha: {
    fontSize: temaMedico.fontes.tamanhos.sm,
    fontWeight: temaMedico.fontes.pesos.semibold,
    color: temaMedico.cores.primaria,
    textAlign: 'right',
    marginBottom: temaMedico.espacamentos.lg,
  },
  botaoEnviar: {
    backgroundColor: temaMedico.cores.primaria,
    paddingVertical: temaMedico.espacamentos.lg,
    borderRadius: temaMedico.bordas.media,
    alignItems: 'center',
    ...temaMedico.sombras.pequena,
  },
  botaoEnviarDesabilitado: {
    opacity: 0.6,
  },
  textoBotaoEnviar: {
    fontSize: temaMedico.fontes.tamanhos.lg,
    fontWeight: temaMedico.fontes.pesos.bold,
    color: temaMedico.cores.textoBranco,
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
  botaoVisitante: {
    backgroundColor: 'transparent',
    paddingVertical: temaMedico.espacamentos.lg,
    borderRadius: temaMedico.bordas.media,
    borderWidth: 1,
    borderColor: temaMedico.cores.borda,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  iconeVisitante: {
    marginRight: temaMedico.espacamentos.sm,
  },
  textoBotaoVisitante: {
    fontSize: temaMedico.fontes.tamanhos.md,
    fontWeight: temaMedico.fontes.pesos.semibold,
    color: temaMedico.cores.textoSecundario,
  },
});
