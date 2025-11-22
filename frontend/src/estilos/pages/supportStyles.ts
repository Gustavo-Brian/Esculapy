/**
 * Estilos da Central de Atendimento - Esculapi
 * Metodologia BEM adaptada para React Native
 */

import { StyleSheet } from 'react-native';
import { temaMedico } from '../temaMedico';

export const supportStyles = StyleSheet.create({
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
    fontSize: temaMedico.fontes.tamanhos.lg,
    fontWeight: temaMedico.fontes.pesos.bold,
    color: temaMedico.cores.textoBranco,
  },

  cabecalho__espacador: {
    width: 40,
  },

  // CONTEÚDO
  conteudo: {
    flex: 1,
    backgroundColor: temaMedico.cores.background,
  },

  scroll: {
    padding: temaMedico.espacamentos.lg,
  },

  // SEÇÃO DE CONTATO
  secaoContato: {
    backgroundColor: temaMedico.cores.backgroundCard,
    borderRadius: temaMedico.bordas.media,
    padding: temaMedico.espacamentos.lg,
    marginBottom: temaMedico.espacamentos.lg,
    ...temaMedico.sombras.pequena,
  },

  secao__titulo: {
    fontSize: temaMedico.fontes.tamanhos.lg,
    fontWeight: temaMedico.fontes.pesos.bold,
    color: temaMedico.cores.textoTitulo,
    marginBottom: temaMedico.espacamentos.md,
  },

  // ITEM DE CONTATO
  contatoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: temaMedico.espacamentos.md,
    borderBottomWidth: 1,
    borderBottomColor: temaMedico.cores.borda,
  },

  contatoItem__ultimo: {
    borderBottomWidth: 0,
  },

  contatoItem__esquerda: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  contatoItem__icone: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: temaMedico.cores.backgroundInput,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: temaMedico.espacamentos.md,
  },

  contatoItem__info: {
    flex: 1,
  },

  contatoItem__titulo: {
    fontSize: temaMedico.fontes.tamanhos.md,
    fontWeight: temaMedico.fontes.pesos.semibold,
    color: temaMedico.cores.textoTitulo,
    marginBottom: 2,
  },

  contatoItem__detalhes: {
    fontSize: temaMedico.fontes.tamanhos.sm,
    color: temaMedico.cores.textoSubtitulo,
  },

  // SEÇÃO DE ENDEREÇO
  secaoEndereco: {
    backgroundColor: temaMedico.cores.backgroundCard,
    borderRadius: temaMedico.bordas.media,
    padding: temaMedico.espacamentos.lg,
    marginBottom: temaMedico.espacamentos.lg,
    ...temaMedico.sombras.pequena,
  },

  endereco__info: {
    marginBottom: temaMedico.espacamentos.lg,
  },

  endereco__linha: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  endereco__icone: {
    marginRight: temaMedico.espacamentos.md,
    marginTop: 2,
  },

  endereco__texto: {
    flex: 1,
  },

  endereco__textoLinha: {
    fontSize: temaMedico.fontes.tamanhos.sm,
    color: temaMedico.cores.textoSubtitulo,
    lineHeight: 22,
  },

  // MAPA
  mapa: {
    borderRadius: temaMedico.bordas.media,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: temaMedico.cores.borda,
  },

  mapa__placeholder: {
    height: 160,
    backgroundColor: temaMedico.cores.backgroundInput,
    alignItems: 'center',
    justifyContent: 'center',
  },

  mapa__texto: {
    fontSize: temaMedico.fontes.tamanhos.md,
    fontWeight: temaMedico.fontes.pesos.semibold,
    color: temaMedico.cores.primaria,
    marginTop: temaMedico.espacamentos.sm,
  },

  mapa__subtexto: {
    fontSize: temaMedico.fontes.tamanhos.sm,
    color: temaMedico.cores.textoSubtitulo,
    marginTop: 4,
  },

  // SEÇÃO DE HORÁRIOS
  secaoHorarios: {
    backgroundColor: temaMedico.cores.backgroundCard,
    borderRadius: temaMedico.bordas.media,
    padding: temaMedico.espacamentos.lg,
    marginBottom: temaMedico.espacamentos.lg,
    ...temaMedico.sombras.pequena,
  },

  horarios__info: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  horarios__icone: {
    marginRight: temaMedico.espacamentos.md,
    marginTop: 2,
  },

  horarios__texto: {
    fontSize: temaMedico.fontes.tamanhos.sm,
    color: temaMedico.cores.textoSubtitulo,
    lineHeight: 22,
    flex: 1,
  },

  // SEÇÃO DE EMERGÊNCIA
  secaoEmergencia: {
    backgroundColor: '#FEF2F2',
    borderRadius: temaMedico.bordas.media,
    padding: temaMedico.espacamentos.lg,
    marginBottom: temaMedico.espacamentos.xl,
    borderWidth: 1,
    borderColor: '#FECACA',
  },

  emergencia__cabecalho: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: temaMedico.espacamentos.sm,
  },

  emergencia__titulo: {
    fontSize: temaMedico.fontes.tamanhos.md,
    fontWeight: temaMedico.fontes.pesos.bold,
    color: temaMedico.cores.erro,
    marginLeft: temaMedico.espacamentos.sm,
  },

  emergencia__texto: {
    fontSize: temaMedico.fontes.tamanhos.sm,
    color: '#991B1B',
    lineHeight: 22,
  },
});
