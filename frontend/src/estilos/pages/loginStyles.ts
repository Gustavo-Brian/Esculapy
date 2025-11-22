/**
 * Estilos: Login
 * Refatorado para usar 100% temaMedico
 * Padrão BEM aplicado
 */

import { StyleSheet } from 'react-native';
import { temaMedico } from '@/src/estilos/temaMedico';

export const loginStyles = StyleSheet.create({
  // ==================== PÁGINA ====================
  pagina: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: temaMedico.cores.background,
    padding: temaMedico.espacamentos.lg,
  },

  // ==================== LOGO ====================
  logo: {
    width: 400,
    height: 200,
    marginBottom: temaMedico.espacamentos.xs,
  },

  // ==================== FORMULÁRIO ====================
  formulario: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: temaMedico.cores.background,
  },
  formulario__campo: {
    height: 50,
    backgroundColor: temaMedico.cores.backgroundCard,
    borderRadius: temaMedico.bordas.grande,
    paddingHorizontal: temaMedico.espacamentos.md,
    fontSize: temaMedico.fontes.tamanhos.md,
    borderWidth: 1,
    borderColor: temaMedico.cores.borda,
    color: temaMedico.cores.textoTitulo,
    marginBottom: temaMedico.espacamentos.md,
  },

  // ==================== LINK ESQUECEU SENHA ====================
  link__esqueceuSenha: {
    alignSelf: 'flex-end',
    marginBottom: temaMedico.espacamentos.xxl,
    paddingRight: temaMedico.espacamentos.sm,
  },
  link__texto: {
    fontSize: temaMedico.fontes.tamanhos.md,
    fontWeight: temaMedico.fontes.pesos.regular,
    color: temaMedico.cores.textoSubtitulo,
    textDecorationLine: 'underline',
  },

  // ==================== BOTÃO CRIAR CONTA ====================
  botao__criar: {
    height: 50,
    borderRadius: temaMedico.bordas.grande,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: temaMedico.espacamentos.lg,
    backgroundColor: temaMedico.cores.backgroundCard,
    borderWidth: 2,
    borderColor: temaMedico.cores.primaria,
    marginBottom: temaMedico.espacamentos.md,
  },
  botao__textoCriar: {
    fontSize: temaMedico.fontes.tamanhos.lg,
    fontWeight: temaMedico.fontes.pesos.bold,
    color: temaMedico.cores.primaria,
  },

  // ==================== BOTÃO LOGIN ====================
  botao: {
    height: 50,
    borderRadius: temaMedico.bordas.grande,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: temaMedico.espacamentos.lg,
    backgroundColor: temaMedico.cores.primaria,
  },
  botao__texto: {
    fontSize: temaMedico.fontes.tamanhos.lg,
    fontWeight: temaMedico.fontes.pesos.bold,
    color: temaMedico.cores.textoBranco,
  },

  // ==================== ESTILOS INLINE (extraídos de app/login/index.tsx) ====================
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    backgroundColor: temaMedico.cores.background,
  },
  conteudo: {
    flex: 1,
    backgroundColor: temaMedico.cores.backgroundCard,
    borderTopLeftRadius: temaMedico.bordas.grande,
    borderTopRightRadius: temaMedico.bordas.grande,
    padding: temaMedico.espacamentos.xl,
  },
  titulo: {
    fontSize: temaMedico.fontes.tamanhos.xxl,
    fontWeight: temaMedico.fontes.pesos.bold,
    color: temaMedico.cores.textoTitulo,
    marginBottom: temaMedico.espacamentos.xl,
  },
});
