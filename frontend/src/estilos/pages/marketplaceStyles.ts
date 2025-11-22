/**
 * Estilos do Marketplace - Esculapi
 * Telas específicas do marketplace de farmácias
 */

import { StyleSheet } from 'react-native';
import { cores, espacamentos, bordas, tipografia, dimensoes, sombras } from '@/src/estilos/variaveis';
import {
  containerPagina,
  cardComSombra,
  tituloMedio,
  subtitulo,
  textoCorpo,
  textoPequeno,
  botaoPrimario,
  flexLinha,
} from '@/src/estilos/mixins';

export const marketplaceStyles = StyleSheet.create({
  // Container principal
  pagina: {
    ...containerPagina(),
  },

  // ==================== CABEÇALHO ====================
  cabecalho: {
    backgroundColor: cores.primaria,
    paddingHorizontal: espacamentos.grande,
    paddingTop: espacamentos.massivo,
    paddingBottom: espacamentos.grande,
  },

  cabecalho__superior: {
    ...flexLinha('space-between', 'center'),
    marginBottom: espacamentos.medio,
  },

  cabecalho__logo: {
    ...flexLinha('flex-start', 'center'),
  },

  cabecalho__textoLogo: {
    fontSize: tipografia.tamanhos.tituloGrande,
    fontWeight: tipografia.pesos.bold,
    color: cores.textoBranco,
  },

  cabecalho__acoes: {
    ...flexLinha('flex-end', 'center'),
    gap: espacamentos.medio,
  },

  cabecalho__botaoIcone: {
    width: 40,
    height: 40,
    borderRadius: bordas.raios.circular,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  cabecalho__badge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: cores.destaque,
    borderRadius: bordas.raios.circular,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },

  cabecalho__badgeTexto: {
    fontSize: tipografia.tamanhos.minusculo,
    fontWeight: tipografia.pesos.bold,
    color: cores.textoBranco,
  },

  // Busca
  busca: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: cores.fundoBranco,
    borderRadius: bordas.raios.grande,
    paddingHorizontal: espacamentos.padrao,
    height: 45,
  },

  busca__icone: {
    marginRight: espacamentos.pequeno,
  },

  busca__campo: {
    flex: 1,
    fontSize: tipografia.tamanhos.medio,
    color: cores.textoEscuro,
  },

  busca__filtro: {
    marginLeft: espacamentos.pequeno,
  },

  // ==================== CONTEÚDO ====================
  conteudo: {
    flex: 1,
  },

  // Seções
  secao: {
    marginBottom: espacamentos.grande,
  },

  secao__cabecalho: {
    ...flexLinha('space-between', 'center'),
    paddingHorizontal: espacamentos.grande,
    marginBottom: espacamentos.padrao,
  },

  secao__titulo: {
    ...tituloMedio(),
  },

  secao__verMais: {
    color: cores.primaria,
    fontSize: tipografia.tamanhos.normal,
    fontWeight: tipografia.pesos.semibold,
  },

  // ==================== BANNERS ====================
  bannersCarousel: {
    paddingLeft: espacamentos.grande,
    marginBottom: espacamentos.grande,
  },

  banner: {
    width: 320,
    height: 160,
    borderRadius: bordas.raios.medio,
    marginRight: espacamentos.padrao,
    overflow: 'hidden',
    backgroundColor: cores.primaria,
    justifyContent: 'flex-end',
    padding: espacamentos.grande,
  },

  banner__titulo: {
    fontSize: tipografia.tamanhos.titulo,
    fontWeight: tipografia.pesos.bold,
    color: cores.textoBranco,
    marginBottom: espacamentos.minimo,
  },

  banner__subtitulo: {
    fontSize: tipografia.tamanhos.normal,
    color: cores.textoBranco,
  },

  // ==================== CATEGORIAS ====================
  categorias: {
    paddingLeft: espacamentos.grande,
  },

  categoria: {
    width: 80,
    alignItems: 'center',
    marginRight: espacamentos.padrao,
  },

  categoria__icone: {
    width: 60,
    height: 60,
    borderRadius: bordas.raios.medio,
    backgroundColor: cores.fundoBranco,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: espacamentos.pequeno,
    ...sombras.leve,
  },

  categoria__texto: {
    fontSize: tipografia.tamanhos.pequeno,
    color: cores.textoEscuro,
    textAlign: 'center',
  },

  // ==================== FARMÁCIAS ====================
  farmacias: {
    paddingLeft: espacamentos.grande,
  },

  farmaciaCard: {
    width: 280,
    marginRight: espacamentos.padrao,
    padding: 0,
    borderWidth: 2,
    borderColor: '#4F46E5',
    borderRadius: bordas.raios.medio,
    backgroundColor: cores.fundoBranco,
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
    width: '100%',
    height: 100,
    backgroundColor: cores.fundoCinza,
    justifyContent: 'center',
    alignItems: 'center',
  },

  farmaciaCard__conteudo: {
    padding: espacamentos.padrao,
  },

  farmaciaCard__cabecalho: {
    ...flexLinha('space-between', 'flex-start'),
    marginBottom: espacamentos.pequeno,
  },

  farmaciaCard__logo: {
    width: 50,
    height: 50,
    borderRadius: bordas.raios.pequeno,
    backgroundColor: cores.fundoBranco,
    marginTop: -25,
    ...sombras.padrao,
  },

  farmaciaCard__badges: {
    flexDirection: 'row',
    gap: espacamentos.minimo,
  },

  farmaciaCard__badge: {
    paddingHorizontal: espacamentos.pequeno,
    paddingVertical: 2,
    borderRadius: bordas.raios.pequeno,
    backgroundColor: cores.sucesso,
  },

  farmaciaCard__badgeTexto: {
    fontSize: tipografia.tamanhos.minusculo,
    color: cores.textoBranco,
    fontWeight: tipografia.pesos.bold,
  },

  farmaciaCard__nome: {
    fontSize: tipografia.tamanhos.grande,
    fontWeight: tipografia.pesos.bold,
    color: cores.textoEscuro,
    marginBottom: espacamentos.minimo,
  },

  farmaciaCard__info: {
    ...flexLinha('flex-start', 'center'),
    marginBottom: espacamentos.minimo,
  },

  farmaciaCard__infoTexto: {
    fontSize: tipografia.tamanhos.pequeno,
    color: cores.textoMedio,
    marginLeft: espacamentos.minimo,
  },

  farmaciaCard__tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: espacamentos.minimo,
    marginTop: espacamentos.pequeno,
  },

  farmaciaCard__tag: {
    paddingHorizontal: espacamentos.pequeno,
    paddingVertical: 2,
    borderRadius: bordas.raios.pequeno,
    backgroundColor: cores.fundoCinza,
  },

  farmaciaCard__tagTexto: {
    fontSize: tipografia.tamanhos.minusculo,
    color: cores.textoMedio,
  },

  // ==================== PRODUTOS ====================
  produtos: {
    paddingHorizontal: espacamentos.grande,
  },

  produtoCard: {
    width: 160,
    marginRight: espacamentos.padrao,
    padding: espacamentos.medio,
    borderWidth: 2,
    borderColor: '#4F46E5',
    borderRadius: bordas.raios.medio,
    backgroundColor: cores.fundoBranco,
    shadowColor: '#000',
    shadowOffset: {
      width: 3,
      height: 6,
    },
    shadowOpacity: 1.0,
    shadowRadius: 1,
    elevation: 12,
  },

  produtoCard__favorito: {
    position: 'absolute',
    top: espacamentos.pequeno,
    right: espacamentos.pequeno,
    zIndex: 1,
  },

  produtoCard__desconto: {
    position: 'absolute',
    top: espacamentos.pequeno,
    left: espacamentos.pequeno,
    backgroundColor: cores.destaque,
    paddingHorizontal: espacamentos.pequeno,
    paddingVertical: 2,
    borderRadius: bordas.raios.pequeno,
  },

  produtoCard__descontoTexto: {
    fontSize: tipografia.tamanhos.minusculo,
    color: cores.textoBranco,
    fontWeight: tipografia.pesos.bold,
  },

  produtoCard__imagem: {
    width: '100%',
    height: 120,
    backgroundColor: cores.fundoCinza,
    borderRadius: bordas.raios.pequeno,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: espacamentos.pequeno,
  },

  produtoCard__nome: {
    fontSize: tipografia.tamanhos.normal,
    fontWeight: tipografia.pesos.semibold,
    color: cores.textoEscuro,
    marginBottom: espacamentos.minimo,
    height: 40,
  },

  produtoCard__farmacia: {
    fontSize: tipografia.tamanhos.minusculo,
    color: cores.textoMedio,
    marginBottom: espacamentos.minimo,
  },

  produtoCard__avaliacao: {
    ...flexLinha('flex-start', 'center'),
    marginBottom: espacamentos.pequeno,
  },

  produtoCard__estrelas: {
    ...flexLinha('flex-start', 'center'),
  },

  produtoCard__nota: {
    fontSize: tipografia.tamanhos.pequeno,
    color: cores.textoMedio,
    marginLeft: espacamentos.minimo,
  },

  produtoCard__precos: {
    marginBottom: espacamentos.pequeno,
  },

  produtoCard__precoAntigo: {
    fontSize: tipografia.tamanhos.pequeno,
    color: cores.textoClaro,
    textDecorationLine: 'line-through',
  },

  produtoCard__preco: {
    fontSize: tipografia.tamanhos.grande,
    fontWeight: tipografia.pesos.bold,
    color: cores.primaria,
  },

  produtoCard__botao: {
    height: 35,
    borderRadius: bordas.raios.medio,
    backgroundColor: cores.primaria,
    justifyContent: 'center',
    alignItems: 'center',
  },

  produtoCard__botaoTexto: {
    fontSize: tipografia.tamanhos.pequeno,
    color: cores.textoBranco,
    fontWeight: tipografia.pesos.bold,
  },

  // ==================== OFERTAS ====================
  oferta: {
    ...cardComSombra(),
    marginHorizontal: espacamentos.grande,
    padding: espacamentos.padrao,
    marginBottom: espacamentos.padrao,
  },

  oferta__cabecalho: {
    ...flexLinha('space-between', 'center'),
    marginBottom: espacamentos.pequeno,
  },

  oferta__titulo: {
    fontSize: tipografia.tamanhos.grande,
    fontWeight: tipografia.pesos.bold,
    color: cores.textoEscuro,
  },

  oferta__timer: {
    ...flexLinha('flex-end', 'center'),
  },

  oferta__tempo: {
    fontSize: tipografia.tamanhos.pequeno,
    color: cores.destaque,
    fontWeight: tipografia.pesos.bold,
    marginLeft: espacamentos.minimo,
  },

  oferta__conteudo: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  oferta__imagem: {
    width: 80,
    height: 80,
    backgroundColor: cores.fundoCinza,
    borderRadius: bordas.raios.pequeno,
    justifyContent: 'center',
    alignItems: 'center',
  },

  oferta__info: {
    flex: 1,
    marginLeft: espacamentos.padrao,
  },

  oferta__nome: {
    fontSize: tipografia.tamanhos.medio,
    fontWeight: tipografia.pesos.semibold,
    color: cores.textoEscuro,
    marginBottom: espacamentos.minimo,
  },

  oferta__desconto: {
    fontSize: tipografia.tamanhos.pequeno,
    color: cores.destaque,
    marginBottom: espacamentos.pequeno,
  },

  oferta__preco: {
    fontSize: tipografia.tamanhos.grande,
    fontWeight: tipografia.pesos.bold,
    color: cores.primaria,
  },

  oferta__botao: {
    paddingHorizontal: espacamentos.medio,
    paddingVertical: espacamentos.pequeno,
    backgroundColor: cores.primaria,
    borderRadius: bordas.raios.pequeno,
  },

  oferta__botaoTexto: {
    fontSize: tipografia.tamanhos.pequeno,
    color: cores.textoBranco,
    fontWeight: tipografia.pesos.bold,
  },

  // ==================== FILTROS ====================
  filtros: {
    paddingHorizontal: espacamentos.grande,
    paddingVertical: espacamentos.padrao,
    borderBottomWidth: 1,
    borderBottomColor: cores.bordaClara,
  },

  filtros__lista: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  filtro: {
    paddingHorizontal: espacamentos.padrao,
    paddingVertical: espacamentos.pequeno,
    borderRadius: bordas.raios.extraGrande,
    borderWidth: bordas.larguras.fina,
    borderColor: cores.bordaPadrao,
    marginRight: espacamentos.pequeno,
  },

  filtro_ativo: {
    backgroundColor: cores.primaria,
    borderColor: cores.primaria,
  },

  filtro__texto: {
    fontSize: tipografia.tamanhos.normal,
    color: cores.textoEscuro,
  },

  filtro__textoAtivo: {
    color: cores.textoBranco,
  },
});
