/**
 * Estilos: Delivery (Entrega)
 * Refatorado para usar 100% temaMedico
 * Padrão BEM mantido
 */

import { StyleSheet } from 'react-native';
import { temaMedico } from '@/src/estilos/temaMedico';

export const deliveryStyles = StyleSheet.create({
  // ==================== PÁGINA ====================
  pagina: {
    flex: 1,
    backgroundColor: temaMedico.cores.background,
  },

  // ==================== CABEÇALHO ====================
  cabecalho: {
    paddingHorizontal: temaMedico.espacamentos.lg,
    paddingTop: temaMedico.espacamentos.lg,
    paddingBottom: temaMedico.espacamentos.sm,
    backgroundColor: temaMedico.cores.background,
  },
  cabecalho__botaoVoltar: {
    padding: temaMedico.espacamentos.sm,
    alignSelf: 'flex-start',
  },

  // ==================== LOGO ====================
  logo: {
    alignItems: 'center',
    paddingVertical: temaMedico.espacamentos.xxl,
    backgroundColor: temaMedico.cores.background,
  },
  logo__fundo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: temaMedico.cores.backgroundCard,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: temaMedico.espacamentos.lg,
    borderWidth: 2,
    borderColor: temaMedico.cores.primaria,
    ...temaMedico.sombras.media,
  },
  logo__titulo: {
    fontSize: temaMedico.fontes.tamanhos.titulo,
    fontWeight: temaMedico.fontes.pesos.bold,
    color: temaMedico.cores.textoTitulo,
    marginBottom: temaMedico.espacamentos.sm,
  },
  logo__subtitulo: {
    fontSize: temaMedico.fontes.tamanhos.md,
    fontWeight: temaMedico.fontes.pesos.regular,
    color: temaMedico.cores.textoSubtitulo,
    textAlign: 'center',
  },

  // ==================== FORMULÁRIO ====================
  formulario: {
    flex: 1,
    paddingHorizontal: temaMedico.espacamentos.lg,
    backgroundColor: temaMedico.cores.background,
  },
  formulario__campo: {
    height: 50,
    backgroundColor: temaMedico.cores.backgroundCard,
    borderRadius: temaMedico.bordas.media,
    paddingHorizontal: temaMedico.espacamentos.md,
    fontSize: temaMedico.fontes.tamanhos.md,
    color: temaMedico.cores.textoTitulo,
    borderWidth: 1,
    borderColor: temaMedico.cores.borda,
    marginBottom: temaMedico.espacamentos.md,
  },

  // ==================== BOTÃO PRINCIPAL ====================
  botao: {
    height: 50,
    borderRadius: temaMedico.bordas.media,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: temaMedico.espacamentos.lg,
    backgroundColor: temaMedico.cores.primaria,
    marginBottom: temaMedico.espacamentos.md,
  },
  botao__texto: {
    fontSize: temaMedico.fontes.tamanhos.lg,
    fontWeight: temaMedico.fontes.pesos.bold,
    color: temaMedico.cores.textoBranco,
  },

  // ==================== BOTÃO ESQUECEU SENHA ====================
  botao__esqueceuSenha: {
    alignItems: 'center',
    marginBottom: temaMedico.espacamentos.lg,
  },
  botao__esqueceuSenhaTexto: {
    fontSize: temaMedico.fontes.tamanhos.md,
    color: temaMedico.cores.primaria,
    textDecorationLine: 'underline',
  },

  // ==================== DIVISOR ====================
  divisor: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: temaMedico.espacamentos.lg,
    backgroundColor: temaMedico.cores.background,
  },
  divisor__linha: {
    flex: 1,
    height: 1,
    backgroundColor: temaMedico.cores.borda,
  },
  divisor__texto: {
    marginHorizontal: temaMedico.espacamentos.md,
    fontSize: temaMedico.fontes.tamanhos.md,
    color: temaMedico.cores.textoSubtitulo,
  },

  // ==================== BOTÃO CADASTRAR ====================
  botao__cadastrar: {
    height: 50,
    borderRadius: temaMedico.bordas.media,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: temaMedico.espacamentos.lg,
    backgroundColor: temaMedico.cores.backgroundCard,
    borderWidth: 2,
    borderColor: temaMedico.cores.primaria,
    marginBottom: temaMedico.espacamentos.xxl,
  },
  botao__cadastrarTexto: {
    fontSize: temaMedico.fontes.tamanhos.md,
    fontWeight: temaMedico.fontes.pesos.bold,
    color: temaMedico.cores.primaria,
  },

  // ==================== SEÇÃO INFO ====================
  secao__info: {
    backgroundColor: temaMedico.cores.backgroundCard,
    borderRadius: temaMedico.bordas.grande,
    padding: temaMedico.espacamentos.lg,
    marginBottom: temaMedico.espacamentos.lg,
    borderWidth: 1,
    borderColor: temaMedico.cores.borda,
  },
  info__item: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: temaMedico.espacamentos.md,
    backgroundColor: temaMedico.cores.backgroundCard,
  },
  info__texto: {
    fontSize: temaMedico.fontes.tamanhos.sm,
    fontWeight: temaMedico.fontes.pesos.regular,
    color: temaMedico.cores.textoSubtitulo,
    marginLeft: temaMedico.espacamentos.sm,
  },
});
