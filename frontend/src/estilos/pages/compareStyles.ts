/**
 * Estilos da Comparação de Preços - Esculapi
 * Metodologia BEM adaptada para React Native
 */

import { StyleSheet } from 'react-native';
import { temaMedico } from '../temaMedico';

export const compareStyles = StyleSheet.create({
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
    paddingTop: 50,
    paddingBottom: temaMedico.espacamentos.sm,
  },

  cabecalho__botao: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  cabecalho__titulo: {
    fontSize: temaMedico.fontes.tamanhos.xl,
    fontWeight: temaMedico.fontes.pesos.bold,
    color: temaMedico.cores.textoBranco,
  },

  // SCROLL
  scroll: {
    flex: 1,
  },

  scrollConteudo: {
    paddingBottom: temaMedico.espacamentos.xxl,
  },

  // INFO DO PRODUTO
  produtoInfo: {
    backgroundColor: temaMedico.cores.backgroundCard,
    padding: temaMedico.espacamentos.lg,
    marginBottom: temaMedico.espacamentos.sm,
    flexDirection: 'row',
    alignItems: 'center',
  },

  produtoInfo__imagem: {
    width: 80,
    height: 80,
    backgroundColor: temaMedico.cores.backgroundInput,
    borderRadius: temaMedico.bordas.media,
    justifyContent: 'center',
    alignItems: 'center',
  },

  produtoInfo__detalhes: {
    flex: 1,
    marginLeft: temaMedico.espacamentos.md,
  },

  produtoInfo__nome: {
    fontSize: temaMedico.fontes.tamanhos.lg,
    fontWeight: temaMedico.fontes.pesos.bold,
    color: temaMedico.cores.textoTitulo,
    marginBottom: 4,
  },

  produtoInfo__descricao: {
    fontSize: temaMedico.fontes.tamanhos.sm,
    color: temaMedico.cores.textoSecundario,
  },

  // ESTATÍSTICAS
  stats: {
    backgroundColor: temaMedico.cores.backgroundCard,
    padding: temaMedico.espacamentos.lg,
    marginBottom: temaMedico.espacamentos.sm,
  },

  stats__titulo: {
    fontSize: temaMedico.fontes.tamanhos.md,
    fontWeight: temaMedico.fontes.pesos.bold,
    color: temaMedico.cores.textoTitulo,
    marginBottom: temaMedico.espacamentos.md,
  },

  stats__grid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  statItem: {
    alignItems: 'center',
    flex: 1,
  },

  statItem__label: {
    fontSize: temaMedico.fontes.tamanhos.xs,
    color: temaMedico.cores.textoClaro,
    marginBottom: 4,
  },

  statItem__valor: {
    fontSize: temaMedico.fontes.tamanhos.lg,
    fontWeight: temaMedico.fontes.pesos.bold,
  },

  statItem__valor_menor: {
    color: temaMedico.cores.sucesso,
  },

  statItem__valor_medio: {
    color: temaMedico.cores.primaria,
  },

  statItem__valor_maior: {
    color: temaMedico.cores.erro,
  },

  stats__destaque: {
    marginTop: temaMedico.espacamentos.md,
    padding: temaMedico.espacamentos.md,
    backgroundColor: '#E8F5E9',
    borderRadius: temaMedico.bordas.media,
    flexDirection: 'row',
    alignItems: 'center',
  },

  stats__destaqueTexto: {
    fontSize: temaMedico.fontes.tamanhos.sm,
    color: temaMedico.cores.sucesso,
    marginLeft: temaMedico.espacamentos.sm,
    flex: 1,
  },

  stats__destaqueTexto_bold: {
    fontWeight: temaMedico.fontes.pesos.bold,
  },

  // LISTA DE OFERTAS
  ofertas: {
    padding: temaMedico.espacamentos.lg,
  },

  ofertas__titulo: {
    fontSize: temaMedico.fontes.tamanhos.md,
    fontWeight: temaMedico.fontes.pesos.bold,
    color: temaMedico.cores.textoTitulo,
    marginBottom: temaMedico.espacamentos.md,
  },

  // CARD DE OFERTA
  ofertaCard: {
    backgroundColor: temaMedico.cores.backgroundCard,
    borderRadius: temaMedico.bordas.media,
    padding: temaMedico.espacamentos.md,
    marginBottom: temaMedico.espacamentos.md,
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

  ofertaCard_melhorPreco: {
    borderWidth: 2,
    borderColor: temaMedico.cores.sucesso,
  },

  ofertaCard__badge: {
    position: 'absolute',
    top: -10,
    left: 15,
    backgroundColor: temaMedico.cores.sucesso,
    paddingHorizontal: temaMedico.espacamentos.md,
    paddingVertical: 4,
    borderRadius: temaMedico.bordas.media,
    ...temaMedico.sombras.pequena,
  },

  ofertaCard__badgeTexto: {
    color: temaMedico.cores.textoBranco,
    fontSize: temaMedico.fontes.tamanhos.xs,
    fontWeight: temaMedico.fontes.pesos.bold,
  },

  // FARMÁCIA
  farmacia: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: temaMedico.espacamentos.md,
  },

  farmacia__icone: {
    width: 50,
    height: 50,
    borderRadius: temaMedico.bordas.media,
    backgroundColor: temaMedico.cores.backgroundInput,
    justifyContent: 'center',
    alignItems: 'center',
  },

  farmacia__info: {
    flex: 1,
    marginLeft: temaMedico.espacamentos.md,
  },

  farmacia__nome: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3,
  },

  farmacia__nomeTexto: {
    fontSize: temaMedico.fontes.tamanhos.md,
    fontWeight: temaMedico.fontes.pesos.bold,
    color: temaMedico.cores.textoTitulo,
  },

  farmacia__verificado: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: temaMedico.cores.sucesso,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 6,
  },

  farmacia__detalhes: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  farmacia__nota: {
    fontSize: temaMedico.fontes.tamanhos.sm,
    color: temaMedico.cores.textoSecundario,
    marginLeft: 4,
  },

  farmacia__separador: {
    fontSize: temaMedico.fontes.tamanhos.sm,
    color: temaMedico.cores.textoClaro,
    marginHorizontal: 6,
  },

  farmacia__distancia: {
    fontSize: temaMedico.fontes.tamanhos.sm,
    color: temaMedico.cores.textoSecundario,
    marginLeft: 4,
  },

  farmacia__seta: {
    marginLeft: temaMedico.espacamentos.sm,
  },

  // PREÇO
  preco: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingTop: temaMedico.espacamentos.md,
    borderTopWidth: 1,
    borderTopColor: temaMedico.cores.borda,
  },

  preco__info: {
    flex: 1,
  },

  preco__valores: {
    marginBottom: temaMedico.espacamentos.sm,
  },

  preco__antigo: {
    fontSize: temaMedico.fontes.tamanhos.sm,
    color: temaMedico.cores.textoClaro,
    textDecorationLine: 'line-through',
  },

  preco__row: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },

  preco__atual: {
    fontSize: 24,
    fontWeight: temaMedico.fontes.pesos.bold,
    color: temaMedico.cores.primaria,
  },

  preco__economia: {
    backgroundColor: '#FFE5E5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: temaMedico.bordas.pequena,
    marginLeft: temaMedico.espacamentos.sm,
  },

  preco__economiaTexto: {
    fontSize: temaMedico.fontes.tamanhos.xs,
    color: temaMedico.cores.erro,
    fontWeight: temaMedico.fontes.pesos.bold,
  },

  // DETALHES DE ENTREGA
  entregaInfo: {
    marginBottom: 4,
  },

  entregaInfo__row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },

  entregaInfo__texto: {
    fontSize: temaMedico.fontes.tamanhos.sm,
    color: temaMedico.cores.textoSecundario,
    marginLeft: 6,
  },

  entregaInfo__texto_sucesso: {
    color: temaMedico.cores.sucesso,
  },

  entregaInfo__texto_alerta: {
    color: temaMedico.cores.alerta,
  },

  // BOTÃO ADICIONAR
  botaoAdicionar: {
    paddingHorizontal: temaMedico.espacamentos.lg,
    paddingVertical: temaMedico.espacamentos.sm,
    backgroundColor: temaMedico.cores.primaria,
    borderRadius: temaMedico.bordas.media,
    marginLeft: temaMedico.espacamentos.md,
    ...temaMedico.sombras.pequena,
  },

  botaoAdicionar__texto: {
    color: temaMedico.cores.textoBranco,
    fontSize: temaMedico.fontes.tamanhos.sm,
    fontWeight: temaMedico.fontes.pesos.semibold,
  },
});
