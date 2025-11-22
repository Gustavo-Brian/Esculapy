/**
 * SignupHeader Component
 * Cabeçalho da tela de cadastro com logo e título
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { temaMedico } from '@/src/estilos/temaMedico';

export const SignupHeader: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Ionicons name="medical" size={48} color={temaMedico.cores.primaria} />
      </View>
      <Text style={styles.titulo}>Esculapi</Text>
      <Text style={styles.subtitulo}>Seu marketplace de confiança</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: temaMedico.espacamentos.xl,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: temaMedico.cores.backgroundCard,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: temaMedico.espacamentos.lg,
    ...temaMedico.sombras.media,
  },
  titulo: {
    fontSize: temaMedico.fontes.tamanhos.titulo,
    fontWeight: temaMedico.fontes.pesos.bold,
    color: temaMedico.cores.primaria,
    marginBottom: temaMedico.espacamentos.sm,
  },
  subtitulo: {
    fontSize: temaMedico.fontes.tamanhos.md,
    color: temaMedico.cores.textoSubtitulo,
  },
});
