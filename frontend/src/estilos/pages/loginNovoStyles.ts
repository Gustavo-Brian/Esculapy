/**
 * Estilos da Tela de Login Nova - Esculapi
 * Metodologia BEM adaptada para React Native
 * Inspirado no design Asclepius
 */

import { StyleSheet } from 'react-native';
import { cores, espacamentos, bordas, tipografia, sombras } from '@/src/estilos/variaveis';
import {
  containerPagina,
  flexCentro,
  flexColuna,
  botaoPrimario,
  botaoSecundario,
} from '@/src/estilos/mixins';

export const loginNovoStyles = StyleSheet.create({
  // PÁGINA
  pagina: {
    ...containerPagina(),
    backgroundColor: '#F8FAFC',
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
    ...sombras.forte,
    borderWidth: 4,
    borderColor: 'rgba(67, 97, 238, 0.2)',
    marginBottom: espacamentos.grande,
  },

  cabecalho__icone: {
    // Ícone do caduceu (símbolo médico)
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
  },

  conteudo__titulo: {
    fontSize: tipografia.tamanhos.titulo,
    fontWeight: tipografia.pesos.bold,
    color: cores.textoEscuro,
    textAlign: 'center',
    marginBottom: espacamentos.massivo,
  },

  // BOTÕES PRINCIPAIS
  botoes: {
    gap: espacamentos.padrao,
  },

  botao__primario: {
    backgroundColor: '#4361EE',
    paddingVertical: espacamentos.grande,
    paddingHorizontal: espacamentos.grande,
    borderRadius: 100,
    ...flexCentro(),
    ...sombras.padrao,
  },

  botao__primarioTexto: {
    color: cores.textoBranco,
    fontSize: tipografia.tamanhos.grande,
    fontWeight: tipografia.pesos.bold,
  },

  botao__secundario: {
    backgroundColor: 'rgba(67, 97, 238, 0.1)',
    paddingVertical: espacamentos.grande,
    paddingHorizontal: espacamentos.grande,
    borderRadius: 100,
    ...flexCentro(),
  },

  botao__secundarioTexto: {
    color: '#4361EE',
    fontSize: tipografia.tamanhos.grande,
    fontWeight: tipografia.pesos.bold,
  },

  // DIVISOR
  divisor: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: espacamentos.massivo,
  },

  divisor__linha: {
    flex: 1,
    height: 1,
    backgroundColor: cores.bordaPadrao,
  },

  divisor__texto: {
    paddingHorizontal: espacamentos.padrao,
    fontSize: tipografia.tamanhos.pequeno,
    color: cores.textoMedio,
  },

  // REDES SOCIAIS
  redesSociais: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: espacamentos.padrao,
    marginBottom: espacamentos.massivo,
  },

  redeSocial__botao: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: cores.fundoBranco,
    borderWidth: 1,
    borderColor: cores.bordaPadrao,
    ...flexCentro(),
    ...sombras.leve,
  },

  // GUEST LINK
  guestLink: {
    alignItems: 'center',
    marginBottom: espacamentos.grande,
  },

  guestLink__texto: {
    fontSize: tipografia.tamanhos.medio,
    color: cores.textoMedio,
    fontWeight: tipografia.pesos.semibold,
  },

  // FORMULÁRIO
  formulario: {
    gap: espacamentos.grande,
    marginBottom: espacamentos.massivo,
  },

  // CAMPOS
  campo: {
    marginBottom: espacamentos.pequeno,
  },

  campo__container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: bordas.raios.medio,
    paddingHorizontal: espacamentos.padrao,
    borderWidth: 2,
    borderColor: 'transparent',
  },

  campo__containerFocado: {
    borderColor: '#4361EE',
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
    paddingVertical: espacamentos.padrao,
    fontSize: tipografia.tamanhos.medio,
    color: cores.textoEscuro,
  },

  campo__botaoOlho: {
    padding: espacamentos.pequeno,
  },

  campo__erro: {
    fontSize: tipografia.tamanhos.pequeno,
    color: cores.erro,
    marginTop: espacamentos.minimo,
    marginLeft: espacamentos.pequeno,
  },

  // ESQUECEU SENHA
  esqueceuSenha: {
    fontSize: tipografia.tamanhos.medio,
    color: '#4361EE',
    fontWeight: tipografia.pesos.semibold,
    textAlign: 'right',
    marginBottom: espacamentos.padrao,
  },

  // BOTÃO DESABILITADO
  botao__primarioDesabilitado: {
    opacity: 0.5,
  },

  // LINK CADASTRO
  cadastro: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: espacamentos.massivo,
  },

  cadastro__texto: {
    fontSize: tipografia.tamanhos.medio,
    color: cores.textoMedio,
  },

  cadastro__link: {
    fontSize: tipografia.tamanhos.medio,
    color: '#4361EE',
    fontWeight: tipografia.pesos.bold,
  },

  // FOOTER
  footer: {
    backgroundColor: cores.fundoBranco,
    paddingBottom: espacamentos.massivo,
    paddingHorizontal: espacamentos.massivo,
  },

  footer__texto: {
    fontSize: tipografia.tamanhos.minusculo,
    color: cores.textoMedio,
    textAlign: 'center',
    lineHeight: tipografia.alturaLinha.confortavel,
  },

  footer__link: {
    color: '#4361EE',
    fontWeight: tipografia.pesos.medio,
    textDecorationLine: 'underline',
  },
});
