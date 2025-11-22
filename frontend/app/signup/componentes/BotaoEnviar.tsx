/**
 * Componente BotaoEnviar
 * Botão de submit do formulário
 */

import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { temaMedico } from '@/src/estilos/temaMedico';

interface PropriedadesBotaoEnviar {
  aoClicar: () => void;
  carregando: boolean;
}

export const BotaoEnviar: React.FC<PropriedadesBotaoEnviar> = ({ aoClicar, carregando }) => {
  return (
    <TouchableOpacity
      style={[estilos.botao, carregando && estilos.botaoDesabilitado]}
      onPress={aoClicar}
      activeOpacity={0.8}
      disabled={carregando}
    >
      <Text style={estilos.textoBotao}>
        {carregando ? 'Cadastrando...' : 'Cadastrar'}
      </Text>
    </TouchableOpacity>
  );
};

const estilos = StyleSheet.create({
  botao: {
    backgroundColor: temaMedico.cores.primaria,
    paddingVertical: temaMedico.espacamentos.lg,
    borderRadius: temaMedico.bordas.media,
    alignItems: 'center',
    marginTop: temaMedico.espacamentos.md,
    ...temaMedico.sombras.pequena,
  },
  botaoDesabilitado: {
    opacity: 0.6,
  },
  textoBotao: {
    fontSize: temaMedico.fontes.tamanhos.lg,
    fontWeight: temaMedico.fontes.pesos.bold,
    color: temaMedico.cores.textoBranco,
  },
});
