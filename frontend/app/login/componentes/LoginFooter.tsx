/**
 * LoginFooter Component
 * Footer com link para cadastro e termos
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { temaMedico } from '@/src/estilos/temaMedico';

interface LoginFooterProps {
  onSignupPress: () => void;
}

export const LoginFooter: React.FC<LoginFooterProps> = ({ onSignupPress }) => {
  return (
    <View style={styles.container}>
      {/* Link para Cadastro */}
      <View style={styles.signupContainer}>
        <Text style={styles.signupText}>Não tem uma conta? </Text>
        <TouchableOpacity onPress={onSignupPress}>
          <Text style={styles.signupLink}>Cadastre-se</Text>
        </TouchableOpacity>
      </View>

      {/* Termos */}
      <View style={styles.terms}>
        <Text style={styles.termsText}>
          Ao continuar, você concorda com nossos{' '}
          <Text style={styles.termsLink}>Termos de Serviço</Text> e{' '}
          <Text style={styles.termsLink}>Política de Privacidade</Text>.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: temaMedico.espacamentos.xl,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: temaMedico.espacamentos.lg,
  },
  signupText: {
    fontSize: temaMedico.fontes.tamanhos.md,
    color: temaMedico.cores.textoSubtitulo,
  },
  signupLink: {
    fontSize: temaMedico.fontes.tamanhos.md,
    fontWeight: temaMedico.fontes.pesos.semibold,
    color: temaMedico.cores.primaria,
  },
  terms: {
    paddingTop: temaMedico.espacamentos.lg,
  },
  termsText: {
    fontSize: temaMedico.fontes.tamanhos.xs,
    color: temaMedico.cores.textoClaro,
    textAlign: 'center',
    lineHeight: 18,
  },
  termsLink: {
    color: temaMedico.cores.primaria,
    fontWeight: temaMedico.fontes.pesos.semibold,
  },
});
