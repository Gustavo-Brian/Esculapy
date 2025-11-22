/**
 * Estilos de Detalhes da Farmácia - Esculapi
 * Metodologia BEM adaptada para React Native
 */

import { StyleSheet } from 'react-native';
import { temaMedico } from '../temaMedico';

export const sellerStyles = StyleSheet.create({
  // PÁGINA
  pagina: {
    flex: 1,
    backgroundColor: temaMedico.cores.background,
  },

  // CABEÇALHO FIXO
  cabecalho: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },

  cabecalho__superior: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: temaMedico.espacamentos.lg,
    paddingTop: temaMedico.espacamentos.xl,
    paddingBottom: temaMedico.espacamentos.md,
  },

  cabecalho__botaoIcone: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // CAPA
  capa: {
    height: 160,
    backgroundColor: temaMedico.cores.primaria,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // INFO PRINCIPAL
  infoPrincipal: {
    padding: temaMedico.espacamentos.lg,
    backgroundColor: temaMedico.cores.backgroundCard,
  },

  info__cabecalho: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: temaMedico.espacamentos.md,
  },

  info__esquerda: {
    flex: 1,
  },

  info__titulo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: temaMedico.espacamentos.xs,
  },

  info__nome: {
    fontSize: temaMedico.fontes.tamanhos.xl,
    fontWeight: temaMedico.fontes.pesos.bold,
    color: temaMedico.cores.textoTitulo,
  },

  info__badgeVerificada: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: temaMedico.cores.sucesso,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: temaMedico.espacamentos.sm,
  },

  info__descricao: {
    fontSize: temaMedico.fontes.tamanhos.sm,
    color: temaMedico.cores.textoSubtitulo,
    marginBottom: temaMedico.espacamentos.sm,
    lineHeight: 20,
  },

  info__avaliacao: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: temaMedico.espacamentos.xs,
  },

  info__avaliacaoTexto: {
    fontSize: temaMedico.fontes.tamanhos.sm,
    color: temaMedico.cores.textoTitulo,
    marginLeft: 5,
    fontWeight: temaMedico.fontes.pesos.semibold,
  },

  info__avaliacaoCount: {
    fontSize: temaMedico.fontes.tamanhos.sm,
    color: temaMedico.cores.textoClaro,
    marginLeft: 5,
  },

  info__localizacao: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  info__localizacaoTexto: {
    fontSize: temaMedico.fontes.tamanhos.sm,
    color: temaMedico.cores.textoSubtitulo,
    marginLeft: 5,
  },

  // STATS
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: temaMedico.espacamentos.md,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: temaMedico.cores.borda,
    marginBottom: temaMedico.espacamentos.md,
  },

  stats__item: {
    alignItems: 'center',
  },

  stats__valor: {
    fontSize: temaMedico.fontes.tamanhos.xl,
    fontWeight: temaMedico.fontes.pesos.bold,
    color: temaMedico.cores.textoTitulo,
  },

  stats__label: {
    fontSize: temaMedico.fontes.tamanhos.xs,
    color: temaMedico.cores.textoClaro,
    marginTop: 2,
  },

  // BOTÕES DE AÇÃO
  acoes: {
    flexDirection: 'row',
    gap: temaMedico.espacamentos.sm,
  },

  acoes__botaoSeguir: {
    flex: 1,
    height: 45,
    borderRadius: temaMedico.bordas.media,
    justifyContent: 'center',
    alignItems: 'center',
  },

  acoes__botaoSeguirAtivo: {
    backgroundColor: temaMedico.cores.primaria,
  },

  acoes__botaoSeguirInativo: {
    backgroundColor: temaMedico.cores.backgroundInput,
  },

  acoes__botaoSeguirTexto: {
    fontSize: temaMedico.fontes.tamanhos.md,
    fontWeight: temaMedico.fontes.pesos.semibold,
  },

  acoes__botaoSeguirTextoAtivo: {
    color: temaMedico.cores.textoBranco,
  },

  acoes__botaoSeguirTextoInativo: {
    color: temaMedico.cores.textoTitulo,
  },

  acoes__botaoIcone: {
    height: 45,
    width: 45,
    borderRadius: temaMedico.bordas.media,
    borderWidth: 1,
    borderColor: temaMedico.cores.borda,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: temaMedico.cores.backgroundCard,
  },

  // INFORMAÇÕES DETALHADAS
  informacoes: {
    padding: temaMedico.espacamentos.lg,
    backgroundColor: temaMedico.cores.backgroundCard,
    marginTop: temaMedico.espacamentos.sm,
  },

  informacoes__titulo: {
    fontSize: temaMedico.fontes.tamanhos.lg,
    fontWeight: temaMedico.fontes.pesos.bold,
    color: temaMedico.cores.textoTitulo,
    marginBottom: temaMedico.espacamentos.md,
  },

  informacoes__item: {
    marginBottom: temaMedico.espacamentos.md,
  },

  informacoes__itemCabecalho: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: temaMedico.espacamentos.xs,
  },

  informacoes__itemTitulo: {
    fontSize: temaMedico.fontes.tamanhos.md,
    color: temaMedico.cores.textoTitulo,
    marginLeft: temaMedico.espacamentos.sm,
    fontWeight: temaMedico.fontes.pesos.semibold,
  },

  informacoes__itemTexto: {
    fontSize: temaMedico.fontes.tamanhos.sm,
    color: temaMedico.cores.textoSubtitulo,
    marginLeft: 28,
    lineHeight: 20,
  },

  informacoes__itemTextoDestaque: {
    fontSize: temaMedico.fontes.tamanhos.sm,
    color: temaMedico.cores.primaria,
    marginLeft: 28,
  },

  // HORÁRIOS
  horarios: {
    marginLeft: 28,
  },

  horarios__linha: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },

  horarios__dia: {
    fontSize: temaMedico.fontes.tamanhos.sm,
    color: temaMedico.cores.textoSubtitulo,
  },

  horarios__horario: {
    fontSize: temaMedico.fontes.tamanhos.sm,
    color: temaMedico.cores.textoSubtitulo,
  },

  // FILTROS
  filtros: {
    backgroundColor: temaMedico.cores.backgroundCard,
    padding: temaMedico.espacamentos.md,
    marginTop: temaMedico.espacamentos.sm,
    gap: temaMedico.espacamentos.md,
  },

  filtros__pesquisa: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: temaMedico.cores.backgroundInput,
    borderRadius: temaMedico.bordas.media,
    paddingHorizontal: temaMedico.espacamentos.md,
    height: 45,
  },

  filtros__pesquisaInput: {
    flex: 1,
    fontSize: temaMedico.fontes.tamanhos.md,
    color: temaMedico.cores.textoTitulo,
    marginLeft: temaMedico.espacamentos.sm,
  },

  filtros__avaliacaoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: temaMedico.espacamentos.sm,
  },

  filtros__avaliacaoLabel: {
    fontSize: temaMedico.fontes.tamanhos.sm,
    color: temaMedico.cores.textoSubtitulo,
    fontWeight: temaMedico.fontes.pesos.semibold,
  },

  filtros__avaliacaoOpcoes: {
    flexDirection: 'row',
    gap: temaMedico.espacamentos.sm,
    flex: 1,
  },

  filtros__avaliacaoBotao: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: temaMedico.espacamentos.sm,
    borderRadius: temaMedico.bordas.pequena,
    borderWidth: 1,
    borderColor: temaMedico.cores.borda,
    backgroundColor: temaMedico.cores.backgroundCard,
    gap: 4,
  },

  filtros__avaliacaoBotaoAtivo: {
    borderColor: temaMedico.cores.primaria,
    backgroundColor: temaMedico.cores.primaria + '10',
  },

  filtros__avaliacaoTexto: {
    fontSize: temaMedico.fontes.tamanhos.xs,
    color: temaMedico.cores.textoSubtitulo,
  },

  filtros__avaliacaoTextoAtivo: {
    color: temaMedico.cores.primaria,
    fontWeight: temaMedico.fontes.pesos.semibold,
  },

  filtros__limpar: {
    paddingVertical: 6,
    paddingHorizontal: temaMedico.espacamentos.md,
    borderRadius: temaMedico.bordas.pequena,
  },

  filtros__limparTexto: {
    fontSize: temaMedico.fontes.tamanhos.sm,
    color: temaMedico.cores.primaria,
    fontWeight: temaMedico.fontes.pesos.semibold,
  },

  // ABAS
  abas: {
    flexDirection: 'row',
    backgroundColor: temaMedico.cores.backgroundCard,
    marginTop: temaMedico.espacamentos.sm,
    borderBottomWidth: 1,
    borderBottomColor: temaMedico.cores.borda,
  },

  abas__botao: {
    flex: 1,
    paddingVertical: temaMedico.espacamentos.md,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },

  abas__botaoAtivo: {
    borderBottomColor: temaMedico.cores.primaria,
  },

  abas__texto: {
    textAlign: 'center',
    fontSize: temaMedico.fontes.tamanhos.md,
    fontWeight: temaMedico.fontes.pesos.semibold,
    color: temaMedico.cores.textoClaro,
  },

  abas__textoAtivo: {
    color: temaMedico.cores.primaria,
  },

  // CONTEÚDO
  conteudo: {
    padding: temaMedico.espacamentos.lg,
    backgroundColor: temaMedico.cores.background,
  },

  // CARD DE PRODUTO
  produtoCard: {
    backgroundColor: temaMedico.cores.backgroundCard,
    borderRadius: temaMedico.bordas.media,
    padding: 10,
    position: 'relative',
    width: '48%',
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
    top: 8,
    right: 8,
    backgroundColor: temaMedico.cores.erro,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: temaMedico.bordas.pequena,
    zIndex: 10,
  },

  produtoCard__descontoTexto: {
    fontSize: 10,
    fontWeight: temaMedico.fontes.pesos.bold,
    color: temaMedico.cores.textoBranco,
  },

  produtoCard__receita: {
    position: 'absolute',
    top: 8,
    left: 8,
    paddingHorizontal: 5,
    paddingVertical: 3,
    borderRadius: temaMedico.bordas.pequena,
    zIndex: 10,
  },

  produtoCard__conteudo: {
    gap: 8,
  },

  produtoCard__imagem: {
    width: '100%',
    height: 80,
    backgroundColor: temaMedico.cores.cardRoxo + '20',
    borderRadius: temaMedico.bordas.media,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },

  produtoCard__info: {
    gap: 4,
  },

  produtoCard__nome: {
    fontSize: 13,
    fontWeight: temaMedico.fontes.pesos.bold,
    color: temaMedico.cores.textoTitulo,
    lineHeight: 16,
    height: 32,
  },

  produtoCard__farmaciaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },

  produtoCard__farmacia: {
    fontSize: 10,
    color: temaMedico.cores.textoSubtitulo,
    flex: 1,
  },

  produtoCard__metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  produtoCard__meta: {
    fontSize: 10,
    color: temaMedico.cores.textoSubtitulo,
    flex: 1,
    fontWeight: temaMedico.fontes.pesos.medium,
  },

  produtoCard__estoqueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 2,
  },

  produtoCard__estoque: {
    fontSize: 9,
    color: temaMedico.cores.textoSubtitulo,
    fontWeight: temaMedico.fontes.pesos.medium,
  },

  produtoCard__avaliacaoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },

  produtoCard__estrelas: {
    flexDirection: 'row',
    gap: 2,
  },

  produtoCard__avaliacao: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  produtoCard__nota: {
    fontSize: 10,
    fontWeight: temaMedico.fontes.pesos.semibold,
    color: temaMedico.cores.textoSubtitulo,
    marginLeft: 2,
  },

  produtoCard__footer: {
    marginTop: 6,
    gap: 6,
  },

  produtoCard__precos: {
    marginBottom: 4,
  },

  produtoCard__precosCompleto: {
    marginBottom: 6,
  },

  produtoCard__precoAntigo: {
    fontSize: 10,
    color: temaMedico.cores.textoClaro,
    textDecorationLine: 'line-through',
  },

  produtoCard__preco: {
    fontSize: 16,
    fontWeight: temaMedico.fontes.pesos.bold,
    color: temaMedico.cores.primaria,
  },

  produtoCard__numeroOfertas: {
    fontSize: 9,
    color: temaMedico.cores.textoSubtitulo,
    marginTop: 2,
  },

  produtoCard__botao: {
    backgroundColor: temaMedico.cores.primaria,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: temaMedico.bordas.pequena,
    alignItems: 'center',
    justifyContent: 'center',
  },

  produtoCard__botaoTexto: {
    fontSize: 11,
    fontWeight: temaMedico.fontes.pesos.semibold,
    color: temaMedico.cores.textoBranco,
  },

  produtoCard__botaoDesabilitado: {
    backgroundColor: temaMedico.cores.textoClaro,
    opacity: 0.5,
  },

  produtoCard__botaoTextoDesabilitado: {
    color: temaMedico.cores.textoSubtitulo,
  },

  // CARD DE AVALIAÇÃO
  avaliacaoCard: {
    marginBottom: temaMedico.espacamentos.lg,
    padding: temaMedico.espacamentos.md,
    backgroundColor: temaMedico.cores.backgroundCard,
    borderRadius: temaMedico.bordas.media,
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

  avaliacaoCard__cabecalho: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: temaMedico.espacamentos.sm,
  },

  avaliacaoCard__usuario: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  avaliacaoCard__avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: temaMedico.cores.backgroundInput,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: temaMedico.espacamentos.sm,
  },

  avaliacaoCard__usuarioInfo: {
    flex: 1,
  },

  avaliacaoCard__usuarioNome: {
    fontSize: temaMedico.fontes.tamanhos.sm,
    fontWeight: temaMedico.fontes.pesos.semibold,
    color: temaMedico.cores.textoTitulo,
  },

  avaliacaoCard__usuarioData: {
    fontSize: temaMedico.fontes.tamanhos.xs,
    color: temaMedico.cores.textoClaro,
  },

  avaliacaoCard__estrelas: {
    flexDirection: 'row',
  },

  avaliacaoCard__verificada: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: temaMedico.espacamentos.sm,
  },

  avaliacaoCard__verificadaTexto: {
    fontSize: temaMedico.fontes.tamanhos.xs,
    color: temaMedico.cores.sucesso,
    marginLeft: 4,
  },

  avaliacaoCard__comentario: {
    fontSize: temaMedico.fontes.tamanhos.sm,
    color: temaMedico.cores.textoSubtitulo,
    lineHeight: 20,
  },

  // ESTADOS DE CARREGAMENTO E ERRO
  containerCarregando: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: temaMedico.cores.background,
  },

  textoCarregando: {
    marginTop: temaMedico.espacamentos.md,
    fontSize: temaMedico.fontes.tamanhos.md,
    color: temaMedico.cores.textoSubtitulo,
  },

  containerErro: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: temaMedico.cores.background,
    padding: temaMedico.espacamentos.xl,
  },

  textoErro: {
    marginTop: temaMedico.espacamentos.lg,
    fontSize: temaMedico.fontes.tamanhos.md,
    color: temaMedico.cores.erro,
    textAlign: 'center',
  },

  botaoVoltar: {
    marginTop: temaMedico.espacamentos.xl,
    backgroundColor: temaMedico.cores.primaria,
    paddingHorizontal: temaMedico.espacamentos.xl,
    paddingVertical: temaMedico.espacamentos.md,
    borderRadius: temaMedico.espacamentos.md,
  },

  textoBotaoVoltar: {
    color: temaMedico.cores.textoBranco,
    fontSize: temaMedico.fontes.tamanhos.md,
    fontWeight: '600',
  },

  // ESTADO VAZIO
  containerVazio: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: temaMedico.espacamentos.xxl * 2,
    paddingHorizontal: temaMedico.espacamentos.xl,
  },

  textoVazio: {
    fontSize: temaMedico.fontes.tamanhos.lg,
    fontWeight: '600',
    color: temaMedico.cores.textoSecundario,
    marginTop: temaMedico.espacamentos.lg,
    textAlign: 'center',
  },

  subtextoVazio: {
    fontSize: temaMedico.fontes.tamanhos.sm,
    color: temaMedico.cores.textoSecundario,
    marginTop: temaMedico.espacamentos.sm,
    textAlign: 'center',
  },
});
