/**
 * Estilos da Ajuda - Esculapi
 * Metodologia BEM adaptada para React Native
 */

import { StyleSheet } from 'react-native';
import { temaMedico } from '../temaMedico';

export const helpStyles = StyleSheet.create({
  // PÁGINA
  pagina: {
    flex: 1,
    backgroundColor: temaMedico.cores.background,
  },

  // CABEÇALHO
  cabecalho: {
    backgroundColor: temaMedico.cores.primaria,
    paddingBottom: temaMedico.espacamentos.lg,
  },

  cabecalho__superior: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: temaMedico.espacamentos.lg,
    paddingTop: temaMedico.espacamentos.sm,
  },

  cabecalho__botao: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  cabecalho__titulo: {
    fontSize: temaMedico.fontes.tamanhos.xl,
    fontWeight: temaMedico.fontes.pesos.bold,
    color: temaMedico.cores.textoBranco,
  },

  cabecalho__espacador: {
    width: 40,
  },

  // CONTEÚDO
  conteudo: {
    flex: 1,
  },

  scroll: {
    paddingBottom: temaMedico.espacamentos.xxl,
  },

  // SEÇÃO DE BUSCA
  secaoBusca: {
    backgroundColor: temaMedico.cores.backgroundCard,
    padding: temaMedico.espacamentos.lg,
    marginBottom: temaMedico.espacamentos.sm,
  },

  busca: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: temaMedico.cores.backgroundInput,
    borderRadius: temaMedico.bordas.media,
    paddingHorizontal: temaMedico.espacamentos.md,
    height: 48,
    borderWidth: 1,
    borderColor: temaMedico.cores.borda,
  },

  busca__icone: {
    marginRight: temaMedico.espacamentos.sm,
  },

  busca__campo: {
    flex: 1,
    fontSize: temaMedico.fontes.tamanhos.md,
    color: temaMedico.cores.textoTitulo,
    paddingVertical: 0,
  },

  // SEÇÃO FAQ
  secaoFaq: {
    backgroundColor: temaMedico.cores.backgroundCard,
    padding: temaMedico.espacamentos.lg,
    marginBottom: temaMedico.espacamentos.sm,
  },

  secao__titulo: {
    fontSize: temaMedico.fontes.tamanhos.lg,
    fontWeight: temaMedico.fontes.pesos.bold,
    color: temaMedico.cores.textoTitulo,
    marginBottom: temaMedico.espacamentos.md,
  },

  // ITEM FAQ
  faqItem: {
    borderBottomWidth: 1,
    borderBottomColor: temaMedico.cores.borda,
  },

  faqItem__cabecalho: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: temaMedico.espacamentos.md,
  },

  faqItem__titulo: {
    fontSize: temaMedico.fontes.tamanhos.md,
    fontWeight: temaMedico.fontes.pesos.semibold,
    color: temaMedico.cores.textoTitulo,
    flex: 1,
    marginRight: temaMedico.espacamentos.sm,
  },

  faqItem__conteudo: {
    paddingBottom: temaMedico.espacamentos.md,
  },

  faqItem__texto: {
    fontSize: temaMedico.fontes.tamanhos.sm,
    color: temaMedico.cores.textoSecundario,
    lineHeight: 22,
  },

  // SEÇÃO CONTATO
  secaoContato: {
    backgroundColor: temaMedico.cores.backgroundCard,
    padding: temaMedico.espacamentos.lg,
    marginBottom: temaMedico.espacamentos.xxl,
  },

  // BOTÃO CONTATO
  contatoBotao: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: temaMedico.espacamentos.md,
    borderBottomWidth: 1,
    borderBottomColor: temaMedico.cores.borda,
  },

  contatoBotao__icone: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: temaMedico.cores.primaria + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },

  contatoBotao__texto: {
    fontSize: temaMedico.fontes.tamanhos.md,
    fontWeight: temaMedico.fontes.pesos.medium,
    color: temaMedico.cores.textoTitulo,
    flex: 1,
    marginLeft: temaMedico.espacamentos.md,
  },

  contatoBotao__seta: {
    marginLeft: temaMedico.espacamentos.sm,
  },
});
