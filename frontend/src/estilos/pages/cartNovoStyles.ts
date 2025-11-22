/**
 * Estilos: Cart Novo (Carrinho de Compras Redesenhado)
 * Refatorado para usar 100% temaMedico
 * Padrão BEM mantido
 * Design moderno com resumo de pagamento
 */

import { StyleSheet } from 'react-native';
import { temaMedico } from '@/src/estilos/temaMedico';

export const cartNovoStyles = StyleSheet.create({
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
    backgroundColor: temaMedico.cores.background,
    paddingHorizontal: temaMedico.espacamentos.md,
    paddingVertical: temaMedico.espacamentos.md,
    borderBottomWidth: 1,
    borderBottomColor: temaMedico.cores.borda,
  },
  cabecalho__botao: {
    padding: temaMedico.espacamentos.sm,
  },
  cabecalho__titulo: {
    fontSize: temaMedico.fontes.tamanhos.xl,
    fontWeight: temaMedico.fontes.pesos.bold,
    color: temaMedico.cores.textoTitulo,
  },

  // ==================== CONTEÚDO ====================
  conteudo: {
    flex: 1,
    padding: temaMedico.espacamentos.md,
  },

  // ==================== LISTA DE ITENS ====================
  listaItens: {
    gap: temaMedico.espacamentos.md,
    marginBottom: temaMedico.espacamentos.lg,
  },

  // ==================== ITEM DO CARRINHO ====================
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    backgroundColor: temaMedico.cores.backgroundCard,
    borderRadius: temaMedico.bordas.grande,
    padding: temaMedico.espacamentos.md,
    ...temaMedico.sombras.pequena,
  },
  item__imagem: {
    width: 64,
    height: 64,
    backgroundColor: temaMedico.cores.backgroundDestaque,
    borderRadius: temaMedico.bordas.media,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: temaMedico.espacamentos.md,
  },
  item__info: {
    flex: 1,
  },
  item__nome: {
    fontSize: temaMedico.fontes.tamanhos.md,
    fontWeight: temaMedico.fontes.pesos.bold,
    color: temaMedico.cores.textoTitulo,
    marginBottom: 4,
  },
  item__preco: {
    fontSize: temaMedico.fontes.tamanhos.sm,
    color: temaMedico.cores.textoSubtitulo,
    marginBottom: temaMedico.espacamentos.sm,
  },
  item__controles: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: temaMedico.espacamentos.sm,
  },
  item__botaoQuantidade: {
    width: 28,
    height: 28,
    borderRadius: 14,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  item__botaoMenos: {
    backgroundColor: temaMedico.cores.backgroundInput,
  },
  item__botaoMais: {
    backgroundColor: temaMedico.cores.primaria,
  },
  item__quantidade: {
    fontSize: temaMedico.fontes.tamanhos.md,
    fontWeight: temaMedico.fontes.pesos.bold,
    color: temaMedico.cores.textoTitulo,
    width: 16,
    textAlign: 'center',
  },
  item__botaoRemover: {
    padding: temaMedico.espacamentos.sm,
    marginLeft: temaMedico.espacamentos.md,
    alignSelf: 'flex-start',
  },

  // ==================== CUPOM ====================
  cupom: {
    backgroundColor: temaMedico.cores.backgroundCard,
    borderRadius: temaMedico.bordas.grande,
    padding: temaMedico.espacamentos.md,
    ...temaMedico.sombras.pequena,
    marginBottom: temaMedico.espacamentos.lg,
  },
  cupom__label: {
    fontSize: temaMedico.fontes.tamanhos.md,
    fontWeight: temaMedico.fontes.pesos.semibold,
    color: temaMedico.cores.textoTitulo,
    marginBottom: temaMedico.espacamentos.sm,
  },
  cupom__container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: temaMedico.espacamentos.sm,
  },
  cupom__input: {
    flex: 1,
    backgroundColor: temaMedico.cores.backgroundInput,
    borderWidth: 1,
    borderColor: temaMedico.cores.borda,
    borderRadius: temaMedico.bordas.pequena,
    paddingHorizontal: temaMedico.espacamentos.sm,
    paddingVertical: temaMedico.espacamentos.sm,
    fontSize: temaMedico.fontes.tamanhos.sm,
    color: temaMedico.cores.textoTitulo,
  },
  cupom__botao: {
    backgroundColor: temaMedico.cores.primaria,
    paddingHorizontal: temaMedico.espacamentos.lg,
    paddingVertical: 10,
    borderRadius: temaMedico.bordas.pequena,
  },
  cupom__botaoTexto: {
    color: temaMedico.cores.textoBranco,
    fontSize: temaMedico.fontes.tamanhos.sm,
    fontWeight: temaMedico.fontes.pesos.bold,
  },

  // ==================== RESUMO ====================
  resumo: {
    backgroundColor: temaMedico.cores.backgroundCard,
    borderRadius: temaMedico.bordas.grande,
    padding: temaMedico.espacamentos.md,
    ...temaMedico.sombras.pequena,
    marginBottom: temaMedico.espacamentos.lg,
  },
  resumo__titulo: {
    fontSize: temaMedico.fontes.tamanhos.lg,
    fontWeight: temaMedico.fontes.pesos.bold,
    color: temaMedico.cores.textoTitulo,
    marginBottom: temaMedico.espacamentos.sm,
  },
  resumo__linhas: {
    gap: temaMedico.espacamentos.sm,
    marginBottom: temaMedico.espacamentos.sm,
  },
  resumo__linha: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  resumo__linhaLabel: {
    fontSize: temaMedico.fontes.tamanhos.sm,
    color: temaMedico.cores.textoSubtitulo,
  },
  resumo__linhaValor: {
    fontSize: temaMedico.fontes.tamanhos.sm,
    color: temaMedico.cores.textoSubtitulo,
  },
  resumo__linhaDesconto: {
    color: temaMedico.cores.sucesso,
  },
  resumo__divisor: {
    height: 1,
    backgroundColor: temaMedico.cores.borda,
    marginVertical: temaMedico.espacamentos.sm,
  },
  resumo__total: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  resumo__totalLabel: {
    fontSize: temaMedico.fontes.tamanhos.lg,
    fontWeight: temaMedico.fontes.pesos.bold,
    color: temaMedico.cores.textoTitulo,
  },
  resumo__totalValor: {
    fontSize: temaMedico.fontes.tamanhos.lg,
    fontWeight: temaMedico.fontes.pesos.bold,
    color: temaMedico.cores.textoTitulo,
  },

  // ==================== BOTÃO FINALIZAR ====================
  botaoContainer: {
    paddingTop: temaMedico.espacamentos.sm,
    paddingBottom: temaMedico.espacamentos.md,
  },
  botao__finalizar: {
    backgroundColor: temaMedico.cores.primaria,
    paddingVertical: temaMedico.espacamentos.lg,
    borderRadius: 100,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    ...temaMedico.sombras.media,
  },
  botao__finalizarTexto: {
    color: temaMedico.cores.textoBranco,
    fontSize: temaMedico.fontes.tamanhos.lg,
    fontWeight: temaMedico.fontes.pesos.bold,
  },

  // ==================== ESTADO VAZIO ====================
  vazio: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 128,
  },
  vazio__icone: {
    marginBottom: temaMedico.espacamentos.lg,
    opacity: 0.3,
  },
  vazio__titulo: {
    fontSize: temaMedico.fontes.tamanhos.titulo,
    fontWeight: temaMedico.fontes.pesos.bold,
    color: temaMedico.cores.textoTitulo,
    marginBottom: temaMedico.espacamentos.sm,
    textAlign: 'center',
  },
  vazio__texto: {
    fontSize: temaMedico.fontes.tamanhos.md,
    color: temaMedico.cores.textoSubtitulo,
    textAlign: 'center',
    marginBottom: 64,
  },
  vazio__botao: {
    backgroundColor: temaMedico.cores.primaria,
    paddingHorizontal: 64,
    paddingVertical: temaMedico.espacamentos.md,
    borderRadius: 100,
  },
  vazio__botaoTexto: {
    color: temaMedico.cores.textoBranco,
    fontSize: temaMedico.fontes.tamanhos.md,
    fontWeight: temaMedico.fontes.pesos.semibold,
  },
});
