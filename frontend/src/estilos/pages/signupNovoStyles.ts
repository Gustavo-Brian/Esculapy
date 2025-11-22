/**
 * Estilos da Tela de Cadastro Nova - Esculapi
 * Metodologia BEM adaptada para React Native
 * Design moderno com formulário completo
 */

import { StyleSheet } from 'react-native';
import { cores, espacamentos, bordas, tipografia, sombras } from '@/src/estilos/variaveis';
import {
  containerPagina,
  flexCentro,
  inputBase,
} from '@/src/estilos/mixins';

export const signupNovoStyles = StyleSheet.create({
  // PÁGINA
  pagina: {
    ...containerPagina(),
    backgroundColor: cores.fundoClaro,
  },

  scrollContainer: {
    flexGrow: 1,
  },

  // HEADER
  cabecalho: {
    paddingTop: espacamentos.massivo * 2,
    paddingBottom: espacamentos.massivo,
    alignItems: 'center',
  },

  cabecalho__logoContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: cores.fundoBranco,
    ...flexCentro(),
    ...sombras.padrao,
    marginBottom: espacamentos.padrao,
  },

  cabecalho__titulo: {
    fontSize: tipografia.tamanhos.destaque,
    fontWeight: tipografia.pesos.bold,
    color: cores.textoEscuro,
    marginBottom: espacamentos.minimo,
  },

  cabecalho__subtitulo: {
    fontSize: tipografia.tamanhos.grande,
    color: cores.textoMedio,
  },

  // CONTEÚDO PRINCIPAL
  conteudo: {
    flex: 1,
    backgroundColor: cores.fundoBranco,
    borderTopLeftRadius: bordas.raios.extraGrande,
    borderTopRightRadius: bordas.raios.extraGrande,
    ...sombras.forte,
    paddingHorizontal: espacamentos.massivo,
    paddingTop: espacamentos.massivo,
    paddingBottom: espacamentos.massivo,
  },

  conteudo__titulo: {
    fontSize: tipografia.tamanhos.titulo,
    fontWeight: tipografia.pesos.bold,
    color: cores.textoEscuro,
    textAlign: 'center',
    marginBottom: espacamentos.massivo,
  },

  // FORMULÁRIO
  formulario: {
    gap: espacamentos.padrao,
  },

  // CAMPO DE INPUT
  campo: {
    position: 'relative',
  },

  campo__container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: cores.fundoCinza,
    borderRadius: bordas.raios.medio,
    borderWidth: 1,
    borderColor: 'transparent',
    paddingHorizontal: espacamentos.padrao,
    height: 52,
  },

  campo__containerFocado: {
    borderColor: '#4F46E5',
    backgroundColor: cores.fundoBranco,
  },

  campo__containerErro: {
    borderColor: cores.erro,
  },

  campo__icone: {
    marginRight: espacamentos.pequeno,
  },

  campo__input: {
    flex: 1,
    fontSize: tipografia.tamanhos.medio,
    color: cores.textoEscuro,
    paddingVertical: 0,
  },

  campo__iconeVisibilidade: {
    padding: espacamentos.minimo,
  },

  campo__erro: {
    fontSize: tipografia.tamanhos.pequeno,
    color: cores.erro,
    marginTop: espacamentos.minimo,
    marginLeft: espacamentos.padrao,
  },

  // BOTÃO SUBMIT
  botao__submit: {
    backgroundColor: '#4F46E5',
    paddingVertical: espacamentos.grande,
    borderRadius: 100,
    ...flexCentro(),
    ...sombras.padrao,
    marginTop: espacamentos.grande,
  },

  botao__submitTexto: {
    color: cores.textoBranco,
    fontSize: tipografia.tamanhos.grande,
    fontWeight: tipografia.pesos.bold,
  },

  botao__submitDesabilitado: {
    backgroundColor: cores.bordaPadrao,
    opacity: 0.6,
  },

  // LINK LOGIN
  linkLogin: {
    alignItems: 'center',
    marginTop: espacamentos.grande,
  },

  linkLogin__texto: {
    fontSize: tipografia.tamanhos.pequeno,
    color: cores.textoMedio,
  },

  linkLogin__link: {
    color: '#4F46E5',
    fontWeight: tipografia.pesos.semibold,
  },

  // FOOTER
  footer: {
    marginTop: espacamentos.massivo,
  },

  footer__texto: {
    fontSize: tipografia.tamanhos.minusculo,
    color: cores.textoMedio,
    textAlign: 'center',
    lineHeight: tipografia.alturaLinha.confortavel,
  },

  footer__link: {
    color: '#4F46E5',
    textDecorationLine: 'underline',
  },
});
