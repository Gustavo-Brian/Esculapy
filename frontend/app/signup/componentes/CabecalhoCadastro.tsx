/**
 * Componente CabecalhoCadastro
 * Cabeçalho da tela de cadastro
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { temaMedico } from '@/src/estilos/temaMedico';

export const CabecalhoCadastro: React.FC = () => {
  return (
    <View style={estilos.container}>
      <View style={estilos.containerLogo}>
        <Ionicons name="medical" size={48} color={temaMedico.cores.primaria} />
      </View>
      <Text style={estilos.titulo}>Esculapi</Text>
      <Text style={estilos.subtitulo}>Criar nova conta</Text>
    </View>
  );
};

const estilos = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: temaMedico.espacamentos.xl,
  },
  containerLogo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: temaMedico.cores.backgroundCard,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: temaMedico.espacamentos.md,
    ...temaMedico.sombras.media,
  },
  titulo: {
    fontSize: temaMedico.fontes.tamanhos.titulo,
    fontWeight: temaMedico.fontes.pesos.bold,
    color: temaMedico.cores.primaria,
    marginBottom: temaMedico.espacamentos.xs,
  },
  subtitulo: {
    fontSize: temaMedico.fontes.tamanhos.md,
    color: temaMedico.cores.textoSubtitulo,
  },
});
