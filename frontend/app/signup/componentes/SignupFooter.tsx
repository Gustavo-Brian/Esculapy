/**
 * SignupFooter Component
 * Footer com link para login e termos
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { temaMedico } from '@/src/estilos/temaMedico';

interface SignupFooterProps {
  onSignInPress: () => void;
}

export const SignupFooter: React.FC<SignupFooterProps> = ({ onSignInPress }) => {
  return (
    <View style={styles.container}>
      {/* Link para Login */}
      <TouchableOpacity style={styles.loginLink} onPress={onSignInPress}>
        <Text style={styles.loginText}>
          Já tem uma conta? <Text style={styles.loginLink}>Entrar</Text>
        </Text>
      </TouchableOpacity>

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
  loginLink: {
    alignItems: 'center',
    marginBottom: temaMedico.espacamentos.lg,
  },
  loginText: {
    fontSize: temaMedico.fontes.tamanhos.md,
    color: temaMedico.cores.textoSubtitulo,
  },
  loginLinkText: {
    fontWeight: temaMedico.fontes.pesos.semibold,
    color: temaMedico.cores.primaria,
  },
  terms: {
    paddingTop: temaMedico.espacamentos.lg,
    paddingBottom: temaMedico.espacamentos.xxl,
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
