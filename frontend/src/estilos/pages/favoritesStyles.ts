/**
 * Estilos dos Favoritos - Esculapi
 * Metodologia BEM adaptada para React Native
 */

import { StyleSheet } from 'react-native';
import { temaMedico } from '../temaMedico';

export const favoritesStyles = StyleSheet.create({
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

  // ABAS
  abas: {
    flexDirection: 'row',
    backgroundColor: temaMedico.cores.backgroundCard,
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
    color: temaMedico.cores.textoSubtitulo,
  },

  abas__textoAtivo: {
    color: temaMedico.cores.primaria,
  },

  // CONTEÚDO
  conteudo: {
    flex: 1,
    backgroundColor: temaMedico.cores.background,
  },

  lista: {
    padding: temaMedico.espacamentos.lg,
  },

  lista__colunas: {
    justifyContent: 'space-between',
  },

  // CARD DE PRODUTO
  produtoCard: {
    backgroundColor: temaMedico.cores.backgroundCard,
    borderRadius: temaMedico.bordas.media,
    padding: temaMedico.espacamentos.md,
    position: 'relative',
    width: '48%',
    marginBottom: 15,
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

  produtoCard__favorito: {
    position: 'absolute',
    top: temaMedico.espacamentos.sm,
    right: temaMedico.espacamentos.sm,
    zIndex: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: temaMedico.cores.backgroundCard,
    justifyContent: 'center',
    alignItems: 'center',
    ...temaMedico.sombras.pequena,
  },

  produtoCard__desconto: {
    position: 'absolute',
    top: temaMedico.espacamentos.sm,
    left: temaMedico.espacamentos.sm,
    backgroundColor: temaMedico.cores.erro,
    paddingHorizontal: temaMedico.espacamentos.sm,
    paddingVertical: 4,
    borderRadius: temaMedico.bordas.pequena,
    zIndex: 10,
  },

  produtoCard__descontoTexto: {
    fontSize: temaMedico.fontes.tamanhos.xs,
    fontWeight: temaMedico.fontes.pesos.bold,
    color: temaMedico.cores.textoBranco,
  },

  produtoCard__indisponivel: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: temaMedico.bordas.media,
    zIndex: 2,
  },

  produtoCard__indisponivelTexto: {
    fontSize: temaMedico.fontes.tamanhos.sm,
    fontWeight: temaMedico.fontes.pesos.bold,
    color: temaMedico.cores.erro,
  },

  produtoCard__imagem: {
    width: '100%',
    height: 100,
    backgroundColor: temaMedico.cores.cardRoxo + '20',
    borderRadius: temaMedico.bordas.media,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: temaMedico.espacamentos.sm,
  },

  produtoCard__nome: {
    fontSize: temaMedico.fontes.tamanhos.sm,
    fontWeight: temaMedico.fontes.pesos.semibold,
    color: temaMedico.cores.textoTitulo,
    marginBottom: 4,
    height: 36,
  },

  produtoCard__farmacia: {
    fontSize: temaMedico.fontes.tamanhos.xs,
    color: temaMedico.cores.textoSubtitulo,
    marginBottom: temaMedico.espacamentos.xs,
  },

  produtoCard__avaliacao: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: temaMedico.espacamentos.xs,
  },

  produtoCard__nota: {
    fontSize: temaMedico.fontes.tamanhos.xs,
    fontWeight: temaMedico.fontes.pesos.semibold,
    color: temaMedico.cores.textoSubtitulo,
    marginLeft: 4,
  },

  produtoCard__precos: {
    marginBottom: temaMedico.espacamentos.sm,
  },

  produtoCard__precoAntigo: {
    fontSize: temaMedico.fontes.tamanhos.xs,
    color: temaMedico.cores.textoClaro,
    textDecorationLine: 'line-through',
  },

  produtoCard__preco: {
    fontSize: temaMedico.fontes.tamanhos.lg,
    fontWeight: temaMedico.fontes.pesos.bold,
    color: temaMedico.cores.primaria,
  },

  produtoCard__botao: {
    backgroundColor: temaMedico.cores.primaria,
    paddingVertical: temaMedico.espacamentos.sm,
    borderRadius: temaMedico.bordas.pequena,
    alignItems: 'center',
  },

  produtoCard__botaoTexto: {
    fontSize: temaMedico.fontes.tamanhos.sm,
    fontWeight: temaMedico.fontes.pesos.semibold,
    color: temaMedico.cores.textoBranco,
  },

  // CARD DE FARMÁCIA
  farmaciaCard: {
    backgroundColor: temaMedico.cores.backgroundCard,
    borderRadius: temaMedico.bordas.media,
    overflow: 'hidden',
    width: '100%',
    marginBottom: 15,
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
    backgroundColor: temaMedico.cores.cardRoxo + '20',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },

  farmaciaCard__favorito: {
    position: 'absolute',
    top: 10,
    right: 10,
  },

  farmaciaCard__favoritoIcone: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  farmaciaCard__conteudo: {
    padding: temaMedico.espacamentos.md,
  },

  farmaciaCard__cabecalho: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: -30,
    marginBottom: temaMedico.espacamentos.sm,
  },

  farmaciaCard__logo: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: temaMedico.cores.backgroundCard,
    justifyContent: 'center',
    alignItems: 'center',
    ...temaMedico.sombras.media,
  },

  farmaciaCard__badges: {
    flexDirection: 'row',
  },

  farmaciaCard__badge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: temaMedico.cores.sucesso,
    justifyContent: 'center',
    alignItems: 'center',
  },

  farmaciaCard__badgeTexto: {
    fontSize: temaMedico.fontes.tamanhos.xs,
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
    marginBottom: temaMedico.espacamentos.xs,
  },

  farmaciaCard__infoTexto: {
    fontSize: temaMedico.fontes.tamanhos.sm,
    color: temaMedico.cores.textoSubtitulo,
    marginLeft: 6,
  },

  // ESTADO VAZIO
  vazio: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },

  vazio__titulo: {
    fontSize: temaMedico.fontes.tamanhos.xl,
    fontWeight: temaMedico.fontes.pesos.bold,
    color: temaMedico.cores.textoSubtitulo,
    marginTop: temaMedico.espacamentos.lg,
  },

  vazio__texto: {
    fontSize: temaMedico.fontes.tamanhos.sm,
    color: temaMedico.cores.textoSubtitulo,
    marginTop: temaMedico.espacamentos.sm,
    textAlign: 'center',
  },

  vazio__botao: {
    marginTop: temaMedico.espacamentos.lg,
    paddingHorizontal: temaMedico.espacamentos.xl,
    paddingVertical: temaMedico.espacamentos.md,
    backgroundColor: temaMedico.cores.primaria,
    borderRadius: temaMedico.bordas.media,
    ...temaMedico.sombras.pequena,
  },

  vazio__botaoTexto: {
    color: temaMedico.cores.textoBranco,
    fontSize: temaMedico.fontes.tamanhos.md,
    fontWeight: temaMedico.fontes.pesos.semibold,
  },
});
