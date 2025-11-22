/**
 * Componente RodapeLogin
 * Rodapé com link para cadastro e termos
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { temaMedico } from '@/src/estilos/temaMedico';

interface PropriedadesRodapeLogin {
  aoClicarCadastro: () => void;
}

export const RodapeLogin: React.FC<PropriedadesRodapeLogin> = ({ aoClicarCadastro }) => {
  return (
    <View style={estilos.container}>
      {/* Link para Cadastro */}
      <View style={estilos.containerCadastro}>
        <Text style={estilos.textoCadastro}>Não tem uma conta? </Text>
        <TouchableOpacity testID="link-cadastro" onPress={aoClicarCadastro}>
          <Text style={estilos.linkCadastro}>Escolha seu tipo de conta</Text>
        </TouchableOpacity>
      </View>

      {/* Termos */}
      <View style={estilos.termos}>
        <Text style={estilos.textoTermos}>
          Ao continuar, você concorda com nossos{' '}
          <Text style={estilos.linkTermos}>Termos de Serviço</Text> e{' '}
          <Text style={estilos.linkTermos}>Política de Privacidade</Text>.
        </Text>
      </View>
    </View>
  );
};

const estilos = StyleSheet.create({
  container: {
    marginTop: temaMedico.espacamentos.xl,
  },
  containerCadastro: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: temaMedico.espacamentos.lg,
  },
  textoCadastro: {
    fontSize: temaMedico.fontes.tamanhos.md,
    color: temaMedico.cores.textoSubtitulo,
  },
  linkCadastro: {
    fontSize: temaMedico.fontes.tamanhos.md,
    fontWeight: temaMedico.fontes.pesos.semibold,
    color: temaMedico.cores.primaria,
  },
  termos: {
    paddingTop: temaMedico.espacamentos.lg,
  },
  textoTermos: {
    fontSize: temaMedico.fontes.tamanhos.xs,
    color: temaMedico.cores.textoClaro,
    textAlign: 'center',
    lineHeight: 18,
  },
  linkTermos: {
    color: temaMedico.cores.primaria,
    fontWeight: temaMedico.fontes.pesos.semibold,
  },
});
