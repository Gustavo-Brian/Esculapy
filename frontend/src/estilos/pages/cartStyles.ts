/**
 * Estilos: Cart (Carrinho de Compras)
 * Refatorado para usar 100% temaMedico
 * Padrão BEM mantido
 */

import { StyleSheet } from 'react-native';
import { temaMedico } from '@/src/estilos/temaMedico';

export const cartStyles = StyleSheet.create({
  // ==================== PÁGINA ====================
  pagina: {
    flex: 1,
    backgroundColor: temaMedico.cores.background,
  },

  // ==================== CABEÇALHO ====================
  cabecalho: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: temaMedico.espacamentos.lg,
    paddingTop: temaMedico.espacamentos.lg,
    paddingBottom: temaMedico.espacamentos.md,
    backgroundColor: temaMedico.cores.backgroundCard,
  },
  cabecalho__botaoVoltar: {
    padding: temaMedico.espacamentos.sm,
  },
  cabecalho__titulo: {
    fontSize: temaMedico.fontes.tamanhos.lg,
    fontWeight: temaMedico.fontes.pesos.bold,
    color: temaMedico.cores.textoTitulo,
  },
  cabecalho__botaoFavorito: {
    padding: temaMedico.espacamentos.sm,
  },

  // ==================== CONTEÚDO ====================
  conteudo: {
    flex: 1,
    paddingHorizontal: temaMedico.espacamentos.lg,
  },

  // ==================== ITEM DO CARRINHO ====================
  item: {
    flexDirection: 'row',
    backgroundColor: temaMedico.cores.backgroundCard,
    borderRadius: temaMedico.bordas.media,
    padding: temaMedico.espacamentos.md,
    marginBottom: temaMedico.espacamentos.md,
    borderWidth: 1,
    borderColor: temaMedico.cores.borda,
  },
  item__imagem: {
    width: 60,
    height: 60,
    backgroundColor: temaMedico.cores.backgroundInput,
    borderRadius: temaMedico.bordas.pequena,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: temaMedico.espacamentos.md,
  },
  item__info: {
    flex: 1,
    justifyContent: 'center',
  },
  item__titulo: {
    fontSize: temaMedico.fontes.tamanhos.md,
    fontWeight: temaMedico.fontes.pesos.bold,
    color: temaMedico.cores.textoTitulo,
    marginBottom: 3,
  },
  item__subtitulo: {
    fontSize: temaMedico.fontes.tamanhos.sm,
    color: temaMedico.cores.textoSubtitulo,
    marginBottom: 5,
  },
  item__preco: {
    fontSize: temaMedico.fontes.tamanhos.md,
    fontWeight: temaMedico.fontes.pesos.bold,
    color: temaMedico.cores.primaria,
  },
  item__controles: {
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  // ==================== SELETOR DE QUANTIDADE ====================
  seletor__quantidade: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: temaMedico.cores.backgroundInput,
    borderRadius: temaMedico.bordas.pequena,
    marginBottom: temaMedico.espacamentos.sm,
  },
  seletor__botao: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  seletor__botaoTexto: {
    fontSize: temaMedico.fontes.tamanhos.md,
    fontWeight: temaMedico.fontes.pesos.bold,
    color: temaMedico.cores.primaria,
  },
  seletor__texto: {
    fontSize: temaMedico.fontes.tamanhos.md,
    fontWeight: temaMedico.fontes.pesos.bold,
    color: temaMedico.cores.textoTitulo,
    marginHorizontal: temaMedico.espacamentos.md,
  },
  botao__deletar: {
    padding: 5,
  },

  // ==================== CUPOM ====================
  cupom: {
    backgroundColor: temaMedico.cores.backgroundCard,
    borderRadius: temaMedico.bordas.media,
    padding: temaMedico.espacamentos.md,
    marginTop: temaMedico.espacamentos.lg,
    marginBottom: temaMedico.espacamentos.md,
    borderWidth: 1,
    borderColor: temaMedico.cores.borda,
  },
  cupom__rotulo: {
    fontSize: temaMedico.fontes.tamanhos.md,
    fontWeight: temaMedico.fontes.pesos.bold,
    color: temaMedico.cores.textoTitulo,
    marginBottom: temaMedico.espacamentos.sm,
  },
  cupom__container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cupom__campo: {
    flex: 1,
    height: 40,
    backgroundColor: temaMedico.cores.backgroundInput,
    borderRadius: temaMedico.bordas.pequena,
    paddingHorizontal: temaMedico.espacamentos.md,
    marginRight: temaMedico.espacamentos.sm,
    fontSize: temaMedico.fontes.tamanhos.md,
    color: temaMedico.cores.textoTitulo,
    borderWidth: 1,
    borderColor: temaMedico.cores.borda,
  },
  cupom__botao: {
    backgroundColor: temaMedico.cores.primaria,
    paddingHorizontal: temaMedico.espacamentos.md,
    paddingVertical: temaMedico.espacamentos.sm,
    borderRadius: temaMedico.bordas.pequena,
  },
  cupom__botaoTexto: {
    color: temaMedico.cores.textoBranco,
    fontSize: temaMedico.fontes.tamanhos.md,
    fontWeight: temaMedico.fontes.pesos.bold,
  },

  // ==================== RESUMO ====================
  resumo: {
    backgroundColor: temaMedico.cores.backgroundCard,
    borderRadius: temaMedico.bordas.media,
    padding: temaMedico.espacamentos.lg,
    marginTop: temaMedico.espacamentos.sm,
    marginBottom: temaMedico.espacamentos.lg,
    borderWidth: 1,
    borderColor: temaMedico.cores.borda,
  },
  resumo__titulo: {
    fontSize: temaMedico.fontes.tamanhos.lg,
    fontWeight: temaMedico.fontes.pesos.bold,
    color: temaMedico.cores.textoTitulo,
    marginBottom: temaMedico.espacamentos.md,
  },
  resumo__linha: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: temaMedico.espacamentos.sm,
  },
  resumo__rotulo: {
    fontSize: temaMedico.fontes.tamanhos.md,
    color: temaMedico.cores.textoSubtitulo,
  },
  resumo__valor: {
    fontSize: temaMedico.fontes.tamanhos.md,
    color: temaMedico.cores.textoTitulo,
    fontWeight: temaMedico.fontes.pesos.medium,
  },
  resumo__valorDesconto: {
    fontSize: temaMedico.fontes.tamanhos.md,
    color: temaMedico.cores.erro,
    fontWeight: temaMedico.fontes.pesos.medium,
  },
  resumo__divisor: {
    height: 1,
    backgroundColor: temaMedico.cores.borda,
    marginVertical: temaMedico.espacamentos.md,
  },
  resumo__rotuloTotal: {
    fontSize: temaMedico.fontes.tamanhos.md,
    fontWeight: temaMedico.fontes.pesos.bold,
    color: temaMedico.cores.textoTitulo,
  },
  resumo__valorTotal: {
    fontSize: temaMedico.fontes.tamanhos.lg,
    fontWeight: temaMedico.fontes.pesos.bold,
    color: temaMedico.cores.primaria,
  },

  // ==================== BOTÃO FINALIZAR ====================
  botao__finalizar: {
    backgroundColor: temaMedico.cores.primaria,
    borderRadius: temaMedico.bordas.media,
    paddingVertical: temaMedico.espacamentos.md,
    alignItems: 'center',
    marginTop: temaMedico.espacamentos.lg,
  },
  botao__finalizarTexto: {
    color: temaMedico.cores.textoBranco,
    fontSize: temaMedico.fontes.tamanhos.md,
    fontWeight: temaMedico.fontes.pesos.bold,
  },
});
