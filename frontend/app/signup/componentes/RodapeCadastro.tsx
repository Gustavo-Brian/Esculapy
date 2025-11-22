/**
 * Componente RodapeCadastro
 * Rodapé com link para login
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { temaMedico } from '@/src/estilos/temaMedico';

interface PropriedadesRodapeCadastro {
  aoClicarLogin: () => void;
}

export const RodapeCadastro: React.FC<PropriedadesRodapeCadastro> = ({ aoClicarLogin }) => {
  return (
    <View style={estilos.container}>
      <View style={estilos.containerLogin}>
        <Text style={estilos.textoLogin}>Já tem uma conta? </Text>
        <TouchableOpacity onPress={aoClicarLogin}>
          <Text style={estilos.linkLogin}>Faça login</Text>
        </TouchableOpacity>
      </View>

      <View style={estilos.termos}>
        <Text style={estilos.textoTermos}>
          Ao criar uma conta, você concorda com nossos{' '}
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
  containerLogin: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: temaMedico.espacamentos.lg,
  },
  textoLogin: {
    fontSize: temaMedico.fontes.tamanhos.md,
    color: temaMedico.cores.textoSubtitulo,
  },
  linkLogin: {
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
