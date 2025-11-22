/**
 * Estilos: Signup (Cadastro)
 * Refatorado para usar 100% temaMedico
 * Padrão BEM aplicado
 */

import { StyleSheet } from 'react-native';
import { temaMedico } from '@/src/estilos/temaMedico';

export const signupStyles = StyleSheet.create({
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
    marginBottom: temaMedico.espacamentos.xxl,
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

  // ==================== BOTÃO CADASTRAR ====================
  botao: {
    height: 50,
    borderRadius: temaMedico.bordas.grande,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: temaMedico.espacamentos.lg,
    backgroundColor: temaMedico.cores.primaria,
    marginBottom: temaMedico.espacamentos.lg,
  },
  botao__texto: {
    fontSize: temaMedico.fontes.tamanhos.lg,
    fontWeight: temaMedico.fontes.pesos.bold,
    color: temaMedico.cores.textoBranco,
  },

  // ==================== LINK LOGIN ====================
  link__login: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: temaMedico.cores.background,
  },
  link__texto: {
    fontSize: temaMedico.fontes.tamanhos.md,
    fontWeight: temaMedico.fontes.pesos.regular,
    color: temaMedico.cores.textoSubtitulo,
  },
  link__textoDestaque: {
    fontSize: temaMedico.fontes.tamanhos.md,
    color: temaMedico.cores.primaria,
    textDecorationLine: 'underline',
    fontWeight: temaMedico.fontes.pesos.bold,
  },
});
