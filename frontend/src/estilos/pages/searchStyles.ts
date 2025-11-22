/**
 * Estilos da Busca - Esculapi
 * Metodologia BEM adaptada para React Native
 */

import { StyleSheet } from 'react-native';
import { temaMedico } from '../temaMedico';

export const searchStyles = StyleSheet.create({
  // PÁGINA
  pagina: {
    flex: 1,
    backgroundColor: temaMedico.cores.background,
  },

  // SCROLL
  scroll: {
    flex: 1,
  },

  scrollConteudo: {
    paddingBottom: temaMedico.espacamentos.xxl * 2,
  },

  // CATEGORIAS
  categorias: {
    padding: temaMedico.espacamentos.lg,
  },

  categorias__titulo: {
    fontSize: temaMedico.fontes.tamanhos.lg,
    fontWeight: temaMedico.fontes.pesos.bold,
    color: temaMedico.cores.textoTitulo,
    marginBottom: temaMedico.espacamentos.md,
  },

  categorias__grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: temaMedico.espacamentos.sm,
  },

  categoriaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: temaMedico.espacamentos.md,
    paddingVertical: temaMedico.espacamentos.sm,
    borderRadius: temaMedico.bordas.grande,
    backgroundColor: temaMedico.cores.backgroundCard,
    borderWidth: 2,
    borderColor: temaMedico.cores.borda,
    marginBottom: temaMedico.espacamentos.sm,
  },

  categoriaChip_ativa: {
    backgroundColor: temaMedico.cores.backgroundDestaque,
  },

  categoriaChip__icone: {
    marginRight: temaMedico.espacamentos.xs,
  },

  categoriaChip__texto: {
    fontSize: temaMedico.fontes.tamanhos.sm,
    fontWeight: temaMedico.fontes.pesos.medium,
    color: temaMedico.cores.textoTitulo,
  },

  categoriaChip__texto_ativo: {
    fontWeight: temaMedico.fontes.pesos.bold,
  },

  // ABAS
  abas: {
    flexDirection: 'row',
    backgroundColor: temaMedico.cores.backgroundCard,
    borderBottomWidth: 1,
    borderBottomColor: temaMedico.cores.borda,
    marginTop: temaMedico.espacamentos.md,
  },

  aba: {
    flex: 1,
    paddingVertical: temaMedico.espacamentos.md,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
    alignItems: 'center',
  },

  aba_ativa: {
    borderBottomColor: temaMedico.cores.primaria,
  },

  aba__texto: {
    fontSize: temaMedico.fontes.tamanhos.md,
    fontWeight: temaMedico.fontes.pesos.semibold,
    color: temaMedico.cores.textoSecundario,
  },

  aba__texto_ativo: {
    color: temaMedico.cores.primaria,
  },

  // RESULTADOS
  resultados: {
    padding: temaMedico.espacamentos.lg,
  },

  resultados__grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  // PRODUTO CARD
  produtoCard: {
    width: '48%',
    backgroundColor: temaMedico.cores.backgroundCard,
    borderRadius: temaMedico.bordas.media,
    padding: temaMedico.espacamentos.md,
    marginBottom: temaMedico.espacamentos.md,
    position: 'relative',
    borderWidth: 2,
    borderColor: temaMedico.cores.primaria,
    shadowColor: '#000',
    shadowOffset: {
      width: 3,
      height: 6,
    },
    shadowOpacity: 1.0,
    shadowRadius: 1,
    elevation: 12,
  },

  produtoCard__desconto: {
    position: 'absolute',
    top: temaMedico.espacamentos.sm,
    right: temaMedico.espacamentos.sm,
    backgroundColor: temaMedico.cores.erro,
    borderRadius: temaMedico.bordas.pequena,
    paddingHorizontal: temaMedico.espacamentos.sm,
    paddingVertical: 4,
    zIndex: 1,
  },

  produtoCard__descontoTexto: {
    fontSize: temaMedico.fontes.tamanhos.xs,
    fontWeight: temaMedico.fontes.pesos.bold,
    color: temaMedico.cores.textoBranco,
  },

  produtoCard__imagem: {
    width: '100%',
    height: 100,
    backgroundColor: temaMedico.cores.backgroundDestaque,
    borderRadius: temaMedico.bordas.media,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: temaMedico.espacamentos.sm,
  },

  produtoCard__nome: {
    fontSize: temaMedico.fontes.tamanhos.sm,
    fontWeight: temaMedico.fontes.pesos.semibold,
    color: temaMedico.cores.textoTitulo,
    marginBottom: 4,
    minHeight: 32,
  },

  produtoCard__farmacia: {
    fontSize: temaMedico.fontes.tamanhos.xs,
    color: temaMedico.cores.textoSecundario,
    marginBottom: temaMedico.espacamentos.xs,
  },

  produtoCard__avaliacao: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: temaMedico.espacamentos.sm,
  },

  produtoCard__nota: {
    fontSize: temaMedico.fontes.tamanhos.xs,
    fontWeight: temaMedico.fontes.pesos.medium,
    color: temaMedico.cores.textoSecundario,
    marginLeft: 4,
  },

  produtoCard__precos: {
    marginBottom: temaMedico.espacamentos.sm,
  },

  produtoCard__precoAntigo: {
    fontSize: temaMedico.fontes.tamanhos.xs,
    color: temaMedico.cores.textoClaro,
    textDecorationLine: 'line-through',
    marginBottom: 2,
  },

  produtoCard__preco: {
    fontSize: temaMedico.fontes.tamanhos.md,
    fontWeight: temaMedico.fontes.pesos.bold,
    color: temaMedico.cores.primaria,
  },

  produtoCard__botao: {
    backgroundColor: temaMedico.cores.primaria,
    borderRadius: temaMedico.bordas.pequena,
    paddingVertical: temaMedico.espacamentos.sm,
    alignItems: 'center',
  },

  produtoCard__botaoTexto: {
    fontSize: temaMedico.fontes.tamanhos.sm,
    fontWeight: temaMedico.fontes.pesos.semibold,
    color: temaMedico.cores.textoBranco,
  },

  // FARMÁCIA CARD
  farmaciaCard: {
    backgroundColor: temaMedico.cores.backgroundCard,
    borderRadius: temaMedico.bordas.media,
    marginBottom: temaMedico.espacamentos.md,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: temaMedico.cores.primaria,
    shadowColor: '#000',
    shadowOffset: {
      width: 3,
      height: 6,
    },
    shadowOpacity: 1.0,
    shadowRadius: 1,
    elevation: 12,
  },

  farmaciaCard__capa: {
    height: 80,
    backgroundColor: temaMedico.cores.backgroundDestaque,
    alignItems: 'center',
    justifyContent: 'center',
  },

  farmaciaCard__conteudo: {
    padding: temaMedico.espacamentos.md,
  },

  farmaciaCard__cabecalho: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: temaMedico.espacamentos.sm,
    marginTop: -40,
  },

  farmaciaCard__logo: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: temaMedico.cores.backgroundCard,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: temaMedico.cores.backgroundCard,
    ...temaMedico.sombras.pequena,
  },

  farmaciaCard__badges: {
    flexDirection: 'row',
    gap: 4,
  },

  farmaciaCard__badge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: temaMedico.cores.sucesso,
    alignItems: 'center',
    justifyContent: 'center',
  },

  farmaciaCard__badgeTexto: {
    fontSize: 12,
    fontWeight: temaMedico.fontes.pesos.bold,
    color: temaMedico.cores.textoBranco,
  },

  farmaciaCard__nome: {
    fontSize: temaMedico.fontes.tamanhos.lg,
    fontWeight: temaMedico.fontes.pesos.bold,
    color: temaMedico.cores.textoTitulo,
    marginBottom: temaMedico.espacamentos.sm,
  },

  farmaciaCard__info: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },

  farmaciaCard__infoTexto: {
    fontSize: temaMedico.fontes.tamanhos.sm,
    color: temaMedico.cores.textoSecundario,
    marginLeft: 6,
  },

  // VAZIO
  vazio: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: temaMedico.espacamentos.xxl * 2,
    paddingHorizontal: temaMedico.espacamentos.lg,
  },

  vazio__icone: {
    marginBottom: temaMedico.espacamentos.md,
  },

  vazio__titulo: {
    fontSize: temaMedico.fontes.tamanhos.lg,
    fontWeight: temaMedico.fontes.pesos.semibold,
    color: temaMedico.cores.textoTitulo,
    marginBottom: temaMedico.espacamentos.sm,
    textAlign: 'center',
  },

  vazio__texto: {
    fontSize: temaMedico.fontes.tamanhos.md,
    color: temaMedico.cores.textoSecundario,
    textAlign: 'center',
  },

  // LOADING
  loading: {
    paddingVertical: temaMedico.espacamentos.xxl * 2,
    alignItems: 'center',
    justifyContent: 'center',
  },

  loading__texto: {
    marginTop: temaMedico.espacamentos.md,
    fontSize: temaMedico.fontes.tamanhos.md,
    color: temaMedico.cores.textoSecundario,
  },
});
