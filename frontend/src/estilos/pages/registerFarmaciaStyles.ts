/**
 * Estilos do Registro de Farmácia - Esculapi
 * Metodologia BEM adaptada para React Native
 * Formulário completo de cadastro
 */

import { StyleSheet } from 'react-native';
import { cores, espacamentos, bordas, tipografia, sombras } from '@/src/estilos/variaveis';
import {
  containerPagina,
  flexCentro,
  flexLinha,
} from '@/src/estilos/mixins';

export const registerFarmaciaStyles = StyleSheet.create({
  // PÁGINA
  pagina: {
    ...containerPagina(),
    backgroundColor: '#F8FAFC',
  },

  // SCROLL
  scroll: {
    flex: 1,
  },

  scrollConteudo: {
    padding: espacamentos.padrao,
    paddingBottom: espacamentos.massivo,
  },

  // HEADER
  cabecalho: {
    paddingTop: espacamentos.grande,
    paddingBottom: espacamentos.padrao,
    alignItems: 'center',
  },

  cabecalho__icone: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFFFFF',
    ...flexCentro(),
    ...sombras.padrao,
    marginBottom: espacamentos.padrao,
  },

  cabecalho__titulo: {
    fontSize: tipografia.tamanhos.tituloGrande,
    fontWeight: tipografia.pesos.bold,
    color: cores.textoEscuro,
    marginBottom: espacamentos.minimo,
  },

  cabecalho__subtitulo: {
    fontSize: tipografia.tamanhos.medio,
    color: cores.textoMedio,
    textAlign: 'center',
  },

  // FORMULÁRIO
  formulario: {
    gap: espacamentos.padrao,
    marginTop: espacamentos.grande,
  },

  // SEÇÕES
  secao: {
    gap: espacamentos.marginPequeno,
  },

  secao__titulo: {
    fontSize: tipografia.tamanhos.medio,
    fontWeight: tipografia.pesos.semibold,
    color: cores.textoEscuro,
    marginBottom: espacamentos.pequeno,
  },

  // CAMPO
  campo: {
    gap: espacamentos.minimo,
  },

  campo__label: {
    fontSize: tipografia.tamanhos.pequeno,
    fontWeight: tipografia.pesos.medio,
    color: '#374151',
  },

  campo__obrigatorio: {
    color: '#EF4444',
  },

  campo__container: {
    backgroundColor: cores.fundoBranco,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: bordas.raios.medio,
    paddingHorizontal: espacamentos.padrao,
    paddingVertical: espacamentos.marginPequeno,
  },

  campo__containerFocado: {
    borderColor: '#4F46E5',
    borderWidth: 2,
  },

  campo__containerErro: {
    borderColor: '#EF4444',
  },

  campo__input: {
    fontSize: tipografia.tamanhos.medio,
    color: cores.textoEscuro,
    padding: 0,
  },

  campo__erro: {
    fontSize: tipografia.tamanhos.minusculo,
    color: '#EF4444',
    marginTop: 4,
  },

  campo__dica: {
    fontSize: tipografia.tamanhos.minusculo,
    color: cores.textoMedio,
    marginTop: 4,
  },

  // SENHA
  campoSenha: {
    ...flexLinha('space-between', 'center'),
  },

  campoSenha__input: {
    flex: 1,
    fontSize: tipografia.tamanhos.medio,
    color: cores.textoEscuro,
    padding: 0,
  },

  campoSenha__botao: {
    padding: espacamentos.pequeno,
  },

  // BOTÃO PRINCIPAL
  botao: {
    backgroundColor: '#4F46E5',
    borderRadius: bordas.raios.medio,
    paddingVertical: espacamentos.padrao,
    ...flexCentro(),
    ...sombras.padrao,
    marginTop: espacamentos.grande,
  },

  botao__texto: {
    color: cores.textoBranco,
    fontSize: tipografia.tamanhos.grande,
    fontWeight: tipografia.pesos.bold,
  },

  botao_desabilitado: {
    backgroundColor: '#9CA3AF',
    opacity: 0.6,
  },

  // RODAPÉ
  rodape: {
    ...flexLinha('center', 'center'),
    marginTop: espacamentos.padrao,
    gap: espacamentos.minimo,
  },

  rodape__texto: {
    fontSize: tipografia.tamanhos.pequeno,
    color: cores.textoMedio,
  },

  rodape__link: {
    fontSize: tipografia.tamanhos.pequeno,
    color: '#4F46E5',
    fontWeight: tipografia.pesos.semibold,
  },

  // DIVISOR
  divisor: {
    ...flexLinha('center', 'center'),
    marginVertical: espacamentos.grande,
    gap: espacamentos.padrao,
  },

  divisor__linha: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },

  divisor__texto: {
    fontSize: tipografia.tamanhos.pequeno,
    color: cores.textoMedio,
  },
});
