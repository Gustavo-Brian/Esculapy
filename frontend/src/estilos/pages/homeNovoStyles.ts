/**
 * Estilos: Home Nova
 * Refatorado para usar 100% temaMedico
 * Padrão BEM mantido
 * Design moderno com busca, categorias, produtos e farmácias
 */

import { StyleSheet } from 'react-native';
import { temaMedico } from '@/src/estilos/temaMedico';

export const homeNovoStyles = StyleSheet.create({
  // ==================== PÁGINA ====================
  pagina: {
    flex: 1,
    backgroundColor: temaMedico.cores.background,
  },

  // ==================== ESTADOS: LOADING ====================
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  containerCarregando: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
  },
  textoCarregando: {
    marginTop: temaMedico.espacamentos.md,
    fontSize: temaMedico.fontes.tamanhos.md,
    color: temaMedico.cores.textoSubtitulo,
  },

  // ==================== ESTADOS: ERRO ====================
  containerErro: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: temaMedico.cores.background,
    padding: temaMedico.espacamentos.lg,
  },
  textoErro: {
    marginTop: temaMedico.espacamentos.md,
    fontSize: temaMedico.fontes.tamanhos.md,
    color: temaMedico.cores.erro,
    textAlign: 'center',
  },
  botaoRetentar: {
    marginTop: temaMedico.espacamentos.lg,
    backgroundColor: temaMedico.cores.primaria,
    paddingHorizontal: temaMedico.espacamentos.xl,
    paddingVertical: temaMedico.espacamentos.md,
    borderRadius: temaMedico.bordas.media,
  },
  textoBotaoRetentar: {
    color: temaMedico.cores.textoBranco,
    fontSize: temaMedico.fontes.tamanhos.md,
    fontWeight: temaMedico.fontes.pesos.semibold,
  },

  // ==================== SCROLL ====================
  scrollView: {
    flex: 1,
  },
  scrollConteudo: {
    paddingBottom: temaMedico.espacamentos.xl,
  },

  // ==================== CABEÇALHO ====================
  cabecalho: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },

  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  titulo: {
    fontSize: 24,
    fontWeight: '700',
    color: temaMedico.cores.textoPrimario,
  },

  subtitulo: {
    fontSize: 14,
    color: temaMedico.cores.textoSecundario,
    marginTop: 4,
  },

  cabecalhoConteudo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: temaMedico.espacamentos.sm,
  },

  botoesNavegacao: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: temaMedico.espacamentos.md,
  },

  botaoNavegacao: {
    padding: temaMedico.espacamentos.sm,
    borderRadius: temaMedico.bordas.media,
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  botaoDesabilitado: {
    opacity: 0.4,
  },

  textoBotaoNavegacao: {
    fontSize: temaMedico.fontes.tamanhos.xs,
    fontWeight: temaMedico.fontes.pesos.semibold,
    color: temaMedico.cores.primaria,
  },

  boasVindas: {
    fontSize: temaMedico.fontes.tamanhos.lg,
    fontWeight: temaMedico.fontes.pesos.bold,
    color: temaMedico.cores.textoTitulo,
    marginTop: temaMedico.espacamentos.sm,
  },

  badgeCarrinho: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: temaMedico.cores.erro,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },

  badgeTexto: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'center',
  },

  // ==================== BUSCA ====================
  containerBusca: {
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 12,
  },

  barraBusca: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: temaMedico.cores.primaria,
    shadowColor: '#000',
    shadowOffset: { width: 3, height: 6 },
    shadowOpacity: 1.0,
    shadowRadius: 1,
    elevation: 12,
  },

  iconeBuscaContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: temaMedico.cores.backgroundDestaque,
    justifyContent: 'center',
    alignItems: 'center',
  },

  inputBusca: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: temaMedico.cores.textoPrimario,
    paddingVertical: 0,
    marginLeft: 12,
  },

  botaoLimpar: {
    padding: 4,
  },

  containerResultados: {
    gap: 12,
  },

  resultadoBusca: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: temaMedico.cores.primaria,
    shadowColor: '#000',
    shadowOffset: { width: 3, height: 6 },
    shadowOpacity: 1.0,
    shadowRadius: 1,
    elevation: 12,
  },

  textoResultadoBusca: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: temaMedico.cores.textoPrimario,
  },

  tipoResultado: {
    fontSize: 12,
    fontWeight: '600',
    color: temaMedico.cores.primaria,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  cabecalho__acoes: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: temaMedico.espacamentos.sm,
  },

  cabecalho__botaoIcone: {
    width: 40,
    height: 40,
    borderRadius: 20,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // ==================== BUSCA ====================
  busca: {
    paddingHorizontal: temaMedico.espacamentos.md,
    paddingVertical: temaMedico.espacamentos.sm,
  },

  busca__container: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: temaMedico.cores.backgroundCard,
    borderRadius: 100,
    height: 48,
    paddingLeft: temaMedico.espacamentos.md,
  },

  busca__icone: {
    marginRight: temaMedico.espacamentos.sm,
  },

  busca__input: {
    flex: 1,
    fontSize: temaMedico.fontes.tamanhos.md,
    color: temaMedico.cores.textoTitulo,
    paddingRight: temaMedico.espacamentos.md,
  },

  // ==================== BANNER DESTAQUE ====================
  banner: {
    marginHorizontal: temaMedico.espacamentos.md,
    backgroundColor: temaMedico.cores.backgroundCard,
    borderRadius: temaMedico.bordas.grande,
    padding: temaMedico.espacamentos.md,
    ...temaMedico.sombras.pequena,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: temaMedico.espacamentos.md,
  },

  banner__conteudo: {
    flex: 2,
    gap: temaMedico.espacamentos.md,
  },

  banner__titulo: {
    fontSize: temaMedico.fontes.tamanhos.md,
    fontWeight: temaMedico.fontes.pesos.bold,
    color: temaMedico.cores.textoTitulo,
  },

  banner__descricao: {
    fontSize: temaMedico.fontes.tamanhos.sm,
    color: temaMedico.cores.textoSubtitulo,
    lineHeight: 20,
  },

  banner__botao: {
    backgroundColor: temaMedico.cores.primaria,
    paddingVertical: temaMedico.espacamentos.sm,
    paddingHorizontal: temaMedico.espacamentos.md,
    borderRadius: 100,
    alignSelf: 'flex-start',
  },

  banner__botaoTexto: {
    color: temaMedico.cores.textoBranco,
    fontSize: temaMedico.fontes.tamanhos.sm,
    fontWeight: temaMedico.fontes.pesos.medium,
  },

  banner__imagem: {
    flex: 1,
    aspectRatio: 1,
    backgroundColor: temaMedico.cores.backgroundDestaque,
    borderRadius: temaMedico.bordas.media,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // ==================== CATEGORIAS ====================
  categorias: {
    paddingVertical: temaMedico.espacamentos.sm,
  },

  categorias__lista: {
    paddingHorizontal: temaMedico.espacamentos.md,
    gap: temaMedico.espacamentos.sm,
  },

  categoria: {
    height: 40,
    paddingHorizontal: temaMedico.espacamentos.md,
    borderRadius: 100,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: temaMedico.cores.backgroundCard,
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

  categoria_ativa: {
    backgroundColor: temaMedico.cores.primaria,
    borderColor: temaMedico.cores.textoBranco,
  },

  categoria__texto: {
    fontSize: temaMedico.fontes.tamanhos.sm,
    fontWeight: temaMedico.fontes.pesos.medium,
    color: temaMedico.cores.textoTitulo,
  },

  categoria__textoAtivo: {
    color: temaMedico.cores.textoBranco,
  },

  // ==================== SEÇÕES ====================
  secao: {
    marginTop: 28,
  },

  cabecalhoSecao: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },

  tituloSecao: {
    fontSize: 20,
    fontWeight: '700',
    color: temaMedico.cores.textoPrimario,
  },

  botaoVerTodos: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: temaMedico.cores.backgroundDestaque,
  },

  textoVerTodos: {
    fontSize: 14,
    fontWeight: '600',
    color: temaMedico.cores.primaria,
  },

  // ==================== FILTROS ====================
  containerFiltros: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },

  filtros: {
    flexDirection: 'row',
    gap: 8,
  },

  botaoFiltro: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: temaMedico.cores.primaria,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 3, height: 6 },
    shadowOpacity: 1.0,
    shadowRadius: 1,
    elevation: 12,
  },

  botaoFiltroAtivo: {
    backgroundColor: temaMedico.cores.primaria,
    borderColor: temaMedico.cores.primaria,
  },

  textoFiltro: {
    fontSize: 14,
    fontWeight: '600',
    color: temaMedico.cores.primaria,
  },

  textoFiltroAtivo: {
    color: '#FFFFFF',
  },

  // ==================== SEÇÃO (manter compatibilidade) ====================
  secao_old: {
    marginTop: temaMedico.espacamentos.lg,
  },

  secao__cabecalho: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: temaMedico.espacamentos.md,
    marginBottom: temaMedico.espacamentos.sm,
  },

  secao__titulo: {
    fontSize: temaMedico.fontes.tamanhos.lg,
    fontWeight: temaMedico.fontes.pesos.bold,
    color: temaMedico.cores.textoTitulo,
  },

  secao__botaoVerTodos: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },

  secao__botaoVerTodosTexto: {
    fontSize: temaMedico.fontes.tamanhos.sm,
    fontWeight: temaMedico.fontes.pesos.medium,
    color: temaMedico.cores.primaria,
  },

  // ==================== OFERTAS RELÂMPAGO (Horizontal Scroll) ====================
  listaOfertas: {
    paddingHorizontal: 20,
    gap: 12,
  },

  ofertas__lista: {
    paddingHorizontal: temaMedico.espacamentos.md,
    gap: temaMedico.espacamentos.md,
  },

  cardOferta: {
    width: 240,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: temaMedico.cores.primaria,
    shadowColor: '#000',
    shadowOffset: { width: 3, height: 6 },
    shadowOpacity: 1.0,
    shadowRadius: 1,
    elevation: 12,
  },

  imagemProduto: {
    width: '100%',
    height: 140,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },

  badgeDesconto: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: temaMedico.cores.erro,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },

  textoDesconto: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  nomeProduto: {
    fontSize: 15,
    fontWeight: '600',
    color: temaMedico.cores.textoPrimario,
    marginBottom: 4,
    minHeight: 40,
  },

  infoFarmacia: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
  },

  nomeFarmacia: {
    fontSize: 13,
    color: temaMedico.cores.textoSecundario,
  },

  containerPrecos: {
    marginBottom: 12,
  },

  precoAntigo: {
    fontSize: 13,
    color: temaMedico.cores.textoSecundario,
    textDecorationLine: 'line-through',
    marginBottom: 2,
  },

  precoAtual: {
    fontSize: 20,
    fontWeight: '700',
    color: temaMedico.cores.primaria,
  },

  botaoVerOferta: {
    backgroundColor: temaMedico.cores.primaria,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },

  textoBotaoOferta: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  ofertaCard: {
    width: 256,
    backgroundColor: temaMedico.cores.backgroundDestaque,
    borderRadius: temaMedico.bordas.media,
    padding: temaMedico.espacamentos.md,
    position: 'relative',
    minHeight: 200,
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

  ofertaCard__info: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: temaMedico.espacamentos.sm,
  },

  ofertaCard__icone: {
    width: 48,
    height: 48,
    backgroundColor: temaMedico.cores.backgroundCard,
    borderRadius: temaMedico.bordas.pequena,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },

  ofertaCard__detalhes: {
    flex: 1,
  },

  ofertaCard__nome: {
    fontSize: temaMedico.fontes.tamanhos.sm,
    fontWeight: temaMedico.fontes.pesos.bold,
    color: temaMedico.cores.textoTitulo,
  },

  ofertaCard__preco: {
    fontSize: 12,
    color: temaMedico.cores.primaria,
  },

  ofertaCard__botao: {
    height: 32,
    backgroundColor: temaMedico.cores.primaria,
    borderRadius: 100,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: temaMedico.espacamentos.sm,
  },

  ofertaCard__botaoTexto: {
    color: temaMedico.cores.textoBranco,
    fontSize: temaMedico.fontes.tamanhos.sm,
    fontWeight: temaMedico.fontes.pesos.medium,
  },

  // ==================== GRID DE PRODUTOS ====================
  listaProdutos: {
    paddingHorizontal: 20,
    gap: 12,
  },

  cardProduto: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: temaMedico.cores.primaria,
    shadowColor: '#000',
    shadowOffset: { width: 3, height: 6 },
    shadowOpacity: 1.0,
    shadowRadius: 1,
    elevation: 12,
  },

  imagemProdutoPequena: {
    width: 90,
    height: 90,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },

  infoProduto: {
    flex: 1,
    justifyContent: 'space-between',
  },

  cabecalhoProduto: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },

  nomeProdutoLista: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: temaMedico.cores.textoPrimario,
    marginBottom: 4,
  },

  infoFarmaciaLista: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 6,
  },

  rodapeProduto: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  containerPrecosLista: {
    flex: 1,
  },

  precoAtualLista: {
    fontSize: 18,
    fontWeight: '700',
    color: temaMedico.cores.primaria,
  },

  produtos__grid: {
    paddingHorizontal: temaMedico.espacamentos.md,
    gap: temaMedico.espacamentos.md,
  },

  gradeProdutos: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: temaMedico.espacamentos.md,
  },

  produtoCard: {
    backgroundColor: temaMedico.cores.backgroundCard,
    borderRadius: temaMedico.bordas.media,
    padding: temaMedico.espacamentos.md,
    position: 'relative',
    width: '48%',
    minHeight: 200,
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

  itemGrade: {
    backgroundColor: temaMedico.cores.backgroundCard,
    borderRadius: temaMedico.bordas.media,
    padding: temaMedico.espacamentos.md,
    position: 'relative',
    width: '48%',
    minHeight: 200,
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

  produtoCard__imagem: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: temaMedico.cores.backgroundInput,
    borderRadius: temaMedico.bordas.pequena,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },

  produtoCard__info: {
    flex: 1,
    gap: 4,
  },

  produtoCard__nome: {
    fontSize: temaMedico.fontes.tamanhos.sm,
    fontWeight: temaMedico.fontes.pesos.bold,
    color: temaMedico.cores.textoTitulo,
  },

  produtoCard__descricao: {
    fontSize: 12,
    color: temaMedico.cores.textoSubtitulo,
  },

  produtoCard__footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  produtoCard__preco: {
    fontSize: temaMedico.fontes.tamanhos.md,
    fontWeight: temaMedico.fontes.pesos.bold,
    color: temaMedico.cores.textoTitulo,
  },

  produtoCard__botaoAdicionar: {
    width: 32,
    height: 32,
    backgroundColor: temaMedico.cores.primaria,
    borderRadius: 16,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // ==================== FARMÁCIAS (Grid 2 colunas) ====================
  listaFarmacias: {
    paddingHorizontal: 20,
    gap: 16,
  },

  cardFarmacia: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: temaMedico.cores.primaria,
    shadowColor: '#000',
    shadowOffset: { width: 3, height: 6 },
    shadowOpacity: 1.0,
    shadowRadius: 1,
    elevation: 12,
  },

  capaFarmacia: {
    height: 100,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },

  conteudoFarmacia: {
    padding: 16,
  },

  cabecalhoFarmacia: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: -40,
    marginBottom: 12,
  },

  logoFarmacia: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#FFFFFF',
    borderWidth: 4,
    borderColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },

  badgeVerificado: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: temaMedico.cores.sucesso,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },

  nomeFarmaciaCard: {
    fontSize: 18,
    fontWeight: '700',
    color: temaMedico.cores.textoPrimario,
    marginBottom: 6,
  },

  infoFarmaciaCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },

  textoInfoFarmacia: {
    fontSize: 14,
    color: temaMedico.cores.textoSecundario,
  },

  containerTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 8,
  },

  tag: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },

  tagAberto: {
    backgroundColor: temaMedico.cores.sucesso + '15',
  },

  tagFechado: {
    backgroundColor: temaMedico.cores.erro + '15',
  },

  tagEntrega: {
    backgroundColor: temaMedico.cores.primaria + '15',
  },

  textoTag: {
    fontSize: 12,
    fontWeight: '600',
  },

  textoTagAberto: {
    color: temaMedico.cores.sucesso,
  },

  textoTagFechado: {
    color: temaMedico.cores.erro,
  },

  textoTagEntrega: {
    color: temaMedico.cores.primaria,
  },

  farmacias__grid: {
    paddingHorizontal: temaMedico.espacamentos.md,
    gap: temaMedico.espacamentos.md,
  },

  farmaciaCard: {
    backgroundColor: temaMedico.cores.backgroundCard,
    borderRadius: temaMedico.bordas.media,
    padding: temaMedico.espacamentos.md,
    position: 'relative',
    width: '48%',
    minHeight: 200,
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

  farmaciaCard__imagem: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: temaMedico.cores.backgroundInput,
    borderRadius: temaMedico.bordas.pequena,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },

  farmaciaCard__info: {
    flex: 1,
    gap: 4,
  },

  nomeFarmacia: {
    fontSize: temaMedico.fontes.tamanhos.md,
    fontWeight: temaMedico.fontes.pesos.bold,
    color: temaMedico.cores.textoTitulo,
    marginBottom: temaMedico.espacamentos.sm,
  },

  farmaciaCard__nome: {
    fontSize: temaMedico.fontes.tamanhos.sm,
    fontWeight: temaMedico.fontes.pesos.bold,
    color: temaMedico.cores.textoTitulo,
  },

  infoFarmacia: {
    fontSize: temaMedico.fontes.tamanhos.sm,
    color: temaMedico.cores.textoSubtitulo,
    marginBottom: 4,
  },

  avaliacaoFarmacia: {
    fontSize: temaMedico.fontes.tamanhos.sm,
    color: temaMedico.cores.textoSubtitulo,
  },

  farmaciaCard__status: {
    fontSize: 12,
    color: temaMedico.cores.textoSubtitulo,
  },

  // ==================== ESPAÇAMENTO FINAL ====================
  espacamentoFinal: {
    height: temaMedico.espacamentos.xxl,
  },

  // ==================== NOVOS COMPONENTES ====================
  listaHorizontal: {
    paddingHorizontal: temaMedico.espacamentos.md,
  },
  listaCategorias: {
    paddingHorizontal: temaMedico.espacamentos.md,
  },
  farmaciaFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: temaMedico.espacamentos.md,
    marginTop: 4,
  },
  avaliacaoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  abertoTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  pontinho: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: temaMedico.cores.sucesso,
  },
  abertoText: {
    fontSize: 12,
    fontWeight: '600',
    color: temaMedico.cores.sucesso,
  },

  // ==================== ESTADO VAZIO ====================
  containerVazio: {
    paddingHorizontal: 20,
    paddingVertical: 60,
    alignItems: 'center',
  },

  textoVazio: {
    fontSize: 16,
    fontWeight: '600',
    color: temaMedico.cores.textoSecundario,
    textAlign: 'center',
    marginTop: 16,
  },

  subtextoVazio: {
    fontSize: 14,
    color: temaMedico.cores.textoSecundario,
    textAlign: 'center',
    marginTop: 8,
  },

  // ==================== BADGES ====================
  badgeOferta: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: temaMedico.cores.backgroundDestaque,
    borderRadius: 8,
  },

  textoBadgeOferta: {
    fontSize: 12,
    fontWeight: '600',
    color: temaMedico.cores.primaria,
  },

  badgePromocao: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: temaMedico.cores.sucesso + '15',
    borderRadius: 8,
  },

  textoBadgePromocao: {
    fontSize: 12,
    fontWeight: '600',
    color: temaMedico.cores.sucesso,
  },

  // ==================== AVALIAÇÃO ====================
  containerAvaliacao: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },

  textoAvaliacao: {
    fontSize: 13,
    fontWeight: '600',
    color: temaMedico.cores.textoPrimario,
    marginLeft: 2,
  },

  textoNumeroAvaliacoes: {
    fontSize: 12,
    color: temaMedico.cores.textoSecundario,
    marginLeft: 2,
  },

  // ==================== CAROUSEL DE PESQUISAS RÁPIDAS ====================
  tituloCarrossel: {
    fontSize: temaMedico.fontes.tamanhos.md,
    fontWeight: temaMedico.fontes.pesos.semibold,
    color: temaMedico.cores.textoTitulo,
    marginBottom: temaMedico.espacamentos.sm,
  },

  carrosselContainer: {
    marginBottom: temaMedico.espacamentos.md,
  },

  carrosselContent: {
    paddingRight: 16,
    gap: 12,
  },

  cardCarrossel: {
    width: 120,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
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

  iconeCardCarrossel: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: temaMedico.cores.primaria + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: temaMedico.espacamentos.sm,
  },

  tituloCardCarrossel: {
    fontSize: temaMedico.fontes.tamanhos.sm,
    fontWeight: temaMedico.fontes.pesos.semibold,
    color: temaMedico.cores.textoTitulo,
    textAlign: 'center',
    marginBottom: 4,
  },

  subtituloCardCarrossel: {
    fontSize: temaMedico.fontes.tamanhos.xs,
    color: temaMedico.cores.textoSecundario,
    textAlign: 'center',
  },

  // ==================== FILTROS ====================
  filtrosContainer: {
    marginTop: temaMedico.espacamentos.sm,
  },

  chipFiltro: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: temaMedico.cores.primaria,
    backgroundColor: '#FFFFFF',
    marginRight: temaMedico.espacamentos.sm,
    shadowColor: '#000',
    shadowOffset: {
      width: 3,
      height: 6,
    },
    shadowOpacity: 1.0,
    shadowRadius: 1,
    elevation: 12,
  },

  chipFiltroAtivo: {
    backgroundColor: temaMedico.cores.primaria,
  },

  textoResultado: {
    fontSize: temaMedico.fontes.tamanhos.sm,
    color: temaMedico.cores.textoSecundario,
    marginLeft: 6,
  },

  // ==================== SEÇÕES ====================
  secaoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: temaMedico.espacamentos.md,
    paddingHorizontal: 16,
    justifyContent: 'space-between',
  },

  secaoHeaderConteudo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },

  contadorProdutos: {
    fontSize: temaMedico.fontes.tamanhos.sm,
    color: temaMedico.cores.textoSecundario,
    marginLeft: 4,
  },

  // ==================== OFERTAS ====================
  cartaoOferta: {
    width: 240,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginRight: 12,
    marginLeft: 4,
    marginVertical: 4,
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

  nomeProdutoOferta: {
    fontSize: temaMedico.fontes.tamanhos.md,
    fontWeight: temaMedico.fontes.pesos.semibold,
    color: temaMedico.cores.textoTitulo,
    marginBottom: 8,
    minHeight: 40,
  },

  farmaciaOferta: {
    fontSize: temaMedico.fontes.tamanhos.sm,
    color: temaMedico.cores.textoSecundario,
    marginBottom: temaMedico.espacamentos.sm,
  },

  precoOfertaContainer: {
    gap: 4,
  },

  precoOferta: {
    fontSize: 20,
    fontWeight: temaMedico.fontes.pesos.bold,
    color: temaMedico.cores.primaria,
  },

  economiaOferta: {
    fontSize: temaMedico.fontes.tamanhos.xs,
    color: temaMedico.cores.sucesso,
    fontWeight: temaMedico.fontes.pesos.medium,
  },

  // ==================== PRODUTOS ====================
  gridProdutos: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    gap: 12,
  },

  cartaoProduto: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
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

  precoContainer: {
    marginTop: 8,
    gap: 4,
  },

  preco: {
    fontSize: temaMedico.fontes.tamanhos.lg,
    fontWeight: temaMedico.fontes.pesos.bold,
    color: temaMedico.cores.primaria,
  },

  ofertas: {
    fontSize: temaMedico.fontes.tamanhos.xs,
    color: temaMedico.cores.textoSecundario,
    marginTop: 4,
  },

  // ==================== FARMÁCIAS ====================
  cartaoFarmacia: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    marginHorizontal: 16,
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

  farmaciaIcone: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: temaMedico.cores.primaria + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: temaMedico.espacamentos.md,
  },

  farmaciaInfo: {
    flex: 1,
  },

  enderecoFarmacia: {
    fontSize: temaMedico.fontes.tamanhos.sm,
    color: temaMedico.cores.textoSecundario,
    marginTop: 4,
  },

  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },

  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: temaMedico.cores.sucesso,
    marginRight: 6,
  },

  statusTexto: {
    fontSize: temaMedico.fontes.tamanhos.xs,
    color: temaMedico.cores.sucesso,
    fontWeight: temaMedico.fontes.pesos.medium,
  },

  // ==================== CARDS STATUS PEDIDO ====================
  cardStatusPedido: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    width: 160,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },

  iconeStatusPedido: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },

  numeroStatusPedido: {
    fontSize: 32,
    fontWeight: temaMedico.fontes.pesos.bold,
    color: temaMedico.cores.textoTitulo,
    marginBottom: 4,
  },

  tituloStatusPedido: {
    fontSize: temaMedico.fontes.tamanhos.sm,
    fontWeight: temaMedico.fontes.pesos.semibold,
    color: temaMedico.cores.textoTitulo,
    marginBottom: 4,
  },

  subtituloStatusPedido: {
    fontSize: temaMedico.fontes.tamanhos.xs,
    color: temaMedico.cores.textoSecundario,
  },
});
