/**
 * Componente CampoFormulario
 * Campo de entrada do formulário com validação
 */

import React from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet, TextInputProps } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { temaMedico } from '@/src/estilos/temaMedico';

interface PropriedadesCampoFormulario extends TextInputProps {
  icone: keyof typeof Ionicons.glyphMap;
  placeholder: string;
  erro?: string;
  estaFocado?: boolean;
  mostrarAlternarSenha?: boolean;
  aoAlternarSenha?: () => void;
}

export const CampoFormulario: React.FC<PropriedadesCampoFormulario> = ({
  icone,
  placeholder,
  erro,
  estaFocado,
  mostrarAlternarSenha,
  aoAlternarSenha,
  secureTextEntry,
  ...restoDasPropriedades
}) => {
  return (
    <View style={estilos.campo}>
      <View
        style={[
          estilos.containerInput,
          estaFocado && estilos.containerInputFocado,
          erro && estilos.containerInputErro,
        ]}
      >
        <Ionicons
          name={icone}
          size={20}
          color={temaMedico.cores.textoClaro}
          style={estilos.icone}
        />
        <TextInput
          style={estilos.input}
          placeholder={placeholder}
          placeholderTextColor={temaMedico.cores.textoClaro}
          secureTextEntry={secureTextEntry}
          {...restoDasPropriedades}
        />
        {mostrarAlternarSenha && aoAlternarSenha && (
          <TouchableOpacity onPress={aoAlternarSenha} style={estilos.botaoAlternar}>
            <Ionicons
              name={secureTextEntry ? 'eye-outline' : 'eye-off-outline'}
              size={20}
              color={temaMedico.cores.textoClaro}
            />
          </TouchableOpacity>
        )}
      </View>
      {erro && <Text style={estilos.textoErro}>{erro}</Text>}
    </View>
  );
};

const estilos = StyleSheet.create({
  campo: {
    marginBottom: temaMedico.espacamentos.md,
  },
  containerInput: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: temaMedico.cores.borda,
    borderRadius: temaMedico.bordas.media,
    paddingHorizontal: temaMedico.espacamentos.md,
    backgroundColor: temaMedico.cores.background,
    height: 50,
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
});
