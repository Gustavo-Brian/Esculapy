/**
 * Estilos do Dashboard de Farmácia - Esculapi
 * Metodologia BEM adaptada para React Native
 * Interface administrativa completa
 */

import { StyleSheet } from 'react-native';
import { cores, espacamentos, bordas, tipografia, sombras } from '@/src/estilos/variaveis';
import {
  containerPagina,
  flexCentro,
  flexLinha,
} from '@/src/estilos/mixins';

export const farmaciadashboardStyles = StyleSheet.create({
  // PÁGINA
  pagina: {
    ...containerPagina(),
    backgroundColor: '#F8FAFC',
  },

  // SCROLL
  scroll: {
    flex: 1,
  },

  scrollConteudo: {
    padding: espacamentos.padrao,
    paddingBottom: espacamentos.massivo * 2,
  },

  // CABEÇALHO
  cabecalho: {
    backgroundColor: cores.fundoBranco,
    paddingTop: espacamentos.grande * 2,
    paddingHorizontal: espacamentos.padrao,
    paddingBottom: espacamentos.padrao,
    ...sombras.leve,
  },

  cabecalho__conteudo: {
    ...flexLinha('space-between', 'center'),
  },

  cabecalho__perfil: {
    ...flexLinha('flex-start', 'center'),
    gap: espacamentos.marginPequeno,
  },

  cabecalho__avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E0E7FF',
    ...flexCentro(),
  },

  cabecalho__info: {
    gap: 4,
  },

  cabecalho__saudacao: {
    fontSize: tipografia.tamanhos.minusculo,
    color: cores.textoMedio,
  },

  cabecalho__nome: {
    fontSize: tipografia.tamanhos.grande,
    fontWeight: tipografia.pesos.bold,
    color: cores.textoEscuro,
  },

  cabecalho__notificacao: {
    position: 'relative',
  },

  cabecalho__notificacaoBotao: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FAFBFC',
    ...flexCentro(),
  },

  cabecalho__notificacaoBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#EF4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    paddingHorizontal: 6,
    ...flexCentro(),
  },

  cabecalho__notificacaoBadgeTexto: {
    fontSize: 10,
    fontWeight: tipografia.pesos.bold,
    color: cores.textoBranco,
  },

  // RESUMO
  resumo: {
    backgroundColor: '#4F46E5',
    borderRadius: bordas.raios.grande,
    padding: espacamentos.grande,
    marginTop: espacamentos.padrao,
    ...sombras.padrao,
  },

  resumo__cabecalho: {
    ...flexLinha('space-between', 'center'),
    marginBottom: espacamentos.padrao,
  },

  resumo__titulo: {
    fontSize: tipografia.tamanhos.medio,
    fontWeight: tipografia.pesos.semibold,
    color: cores.textoBranco,
  },

  resumo__data: {
    fontSize: tipografia.tamanhos.pequeno,
    color: 'rgba(255, 255, 255, 0.8)',
  },

  resumo__botao: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: bordas.raios.medio,
    paddingVertical: espacamentos.pequeno,
    paddingHorizontal: espacamentos.padrao,
    marginTop: espacamentos.marginPequeno,
  },

  resumo__botaoTexto: {
    fontSize: tipografia.tamanhos.pequeno,
    fontWeight: tipografia.pesos.medio,
    color: cores.textoBranco,
  },

  // ESTATÍSTICAS
  stats: {
    marginTop: espacamentos.padrao,
    gap: espacamentos.marginPequeno,
  },

  stats__linha: {
    ...flexLinha('space-between', 'stretch'),
    gap: espacamentos.marginPequeno,
  },

  stat: {
    flex: 1,
    backgroundColor: cores.fundoBranco,
    borderRadius: bordas.raios.grande,
    padding: espacamentos.padrao,
    ...sombras.leve,
  },

  stat__icone: {
    width: 40,
    height: 40,
    borderRadius: 20,
    ...flexCentro(),
    marginBottom: espacamentos.marginPequeno,
  },

  stat__icone_vendas: {
    backgroundColor: 'rgba(34, 197, 94, 0.15)',
  },

  stat__icone_pedidos: {
    backgroundColor: 'rgba(251, 146, 60, 0.15)',
  },

  stat__icone_estoque: {
    backgroundColor: 'rgba(107, 114, 128, 0.15)',
  },

  stat__icone_avaliacoes: {
    backgroundColor: 'rgba(234, 179, 8, 0.15)',
  },

  stat__valor: {
    fontSize: tipografia.tamanhos.tituloMedio,
    fontWeight: tipografia.pesos.bold,
    color: cores.textoEscuro,
    marginBottom: 4,
  },

  stat__label: {
    fontSize: tipografia.tamanhos.minusculo,
    color: cores.textoMedio,
  },

  // GRÁFICO
  grafico: {
    backgroundColor: cores.fundoBranco,
    borderRadius: bordas.raios.grande,
    padding: espacamentos.padrao,
    marginTop: espacamentos.padrao,
    ...sombras.leve,
  },

  grafico__cabecalho: {
    ...flexLinha('space-between', 'center'),
    marginBottom: espacamentos.padrao,
  },

  grafico__titulo: {
    fontSize: tipografia.tamanhos.medio,
    fontWeight: tipografia.pesos.semibold,
    color: cores.textoEscuro,
  },

  grafico__info: {
    alignItems: 'flex-end',
  },

  grafico__total: {
    fontSize: tipografia.tamanhos.tituloMedio,
    fontWeight: tipografia.pesos.bold,
    color: '#4F46E5',
  },

  grafico__variacao: {
    fontSize: tipografia.tamanhos.minusculo,
    color: '#22C55E',
    fontWeight: tipografia.pesos.medio,
  },

  grafico__barras: {
    ...flexLinha('space-between', 'flex-end'),
    height: 150,
    marginTop: espacamentos.padrao,
    paddingBottom: espacamentos.pequeno,
  },

  grafico__barra: {
    flex: 1,
    marginHorizontal: 2,
    borderRadius: bordas.raios.pequeno,
    ...flexCentro('center', 'flex-end'),
    paddingBottom: espacamentos.pequeno,
  },

  grafico__barraPreenchimento: {
    width: '100%',
    backgroundColor: '#4F46E5',
    borderRadius: bordas.raios.pequeno,
  },

  grafico__barraLabel: {
    fontSize: 9,
    color: cores.textoMedio,
    marginTop: 4,
    textAlign: 'center',
  },

  // SEÇÃO
  secao: {
    marginTop: espacamentos.grande,
  },

  secao__cabecalho: {
    ...flexLinha('space-between', 'center'),
    marginBottom: espacamentos.marginPequeno,
  },

  secao__titulo: {
    fontSize: tipografia.tamanhos.medio,
    fontWeight: tipografia.pesos.semibold,
    color: cores.textoEscuro,
  },

  secao__verTudo: {
    fontSize: tipografia.tamanhos.pequeno,
    color: '#4F46E5',
    fontWeight: tipografia.pesos.medio,
  },

  // PEDIDOS
  pedido: {
    backgroundColor: cores.fundoBranco,
    borderRadius: bordas.raios.grande,
    padding: espacamentos.padrao,
    marginBottom: espacamentos.marginPequeno,
    ...sombras.leve,
  },

  pedido__cabecalho: {
    ...flexLinha('space-between', 'center'),
    marginBottom: espacamentos.marginPequeno,
  },

  pedido__numero: {
    fontSize: tipografia.tamanhos.pequeno,
    fontWeight: tipografia.pesos.semibold,
    color: cores.textoEscuro,
  },

  pedido__status: {
    paddingHorizontal: espacamentos.marginPequeno,
    paddingVertical: 4,
    borderRadius: 12,
  },

  pedido__status_pendente: {
    backgroundColor: 'rgba(251, 146, 60, 0.15)',
  },

  pedido__status_confirmado: {
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
  },

  pedido__status_enviado: {
    backgroundColor: 'rgba(34, 197, 94, 0.15)',
  },

  pedido__statusTexto: {
    fontSize: tipografia.tamanhos.minusculo,
    fontWeight: tipografia.pesos.medio,
  },

  pedido__statusTexto_pendente: {
    color: '#FB923C',
  },

  pedido__statusTexto_confirmado: {
    color: '#3B82F6',
  },

  pedido__statusTexto_enviado: {
    color: '#22C55E',
  },

  pedido__info: {
    ...flexLinha('flex-start', 'center'),
    gap: espacamentos.grande,
    marginBottom: espacamentos.pequeno,
  },

  pedido__infoItem: {
    ...flexLinha('flex-start', 'center'),
    gap: 6,
  },

  pedido__infoTexto: {
    fontSize: tipografia.tamanhos.pequeno,
    color: cores.textoMedio,
  },

  pedido__produtos: {
    fontSize: tipografia.tamanhos.minusculo,
    color: cores.textoMedio,
    marginBottom: 8,
  },

  pedido__rodape: {
    ...flexLinha('space-between', 'center'),
    paddingTop: espacamentos.marginPequeno,
    borderTopWidth: 1,
    borderTopColor: '#F5F5F5',
  },

  pedido__valor: {
    fontSize: tipografia.tamanhos.medio,
    fontWeight: tipografia.pesos.bold,
    color: '#4F46E5',
  },

  pedido__botao: {
    backgroundColor: '#4F46E5',
    borderRadius: bordas.raios.medio,
    paddingVertical: 8,
    paddingHorizontal: espacamentos.padrao,
  },

  pedido__botaoTexto: {
    fontSize: tipografia.tamanhos.minusculo,
    fontWeight: tipografia.pesos.medio,
    color: cores.textoBranco,
  },

  // PRODUTOS
  produtos: {
    marginTop: espacamentos.marginPequeno,
  },

  produto: {
    backgroundColor: cores.fundoBranco,
    borderRadius: bordas.raios.grande,
    padding: espacamentos.padrao,
    marginRight: espacamentos.marginPequeno,
    width: 160,
    ...sombras.leve,
  },

  produto__imagem: {
    width: '100%',
    height: 100,
    backgroundColor: '#FAFBFC',
    borderRadius: bordas.raios.medio,
    ...flexCentro(),
    marginBottom: espacamentos.marginPequeno,
  },

  produto__nome: {
    fontSize: tipografia.tamanhos.pequeno,
    fontWeight: tipografia.pesos.semibold,
    color: cores.textoEscuro,
    marginBottom: 4,
  },

  produto__info: {
    ...flexLinha('space-between', 'center'),
  },

  produto__vendas: {
    fontSize: tipografia.tamanhos.minusculo,
    color: cores.textoMedio,
  },

  produto__preco: {
    fontSize: tipografia.tamanhos.pequeno,
    fontWeight: tipografia.pesos.bold,
    color: '#4F46E5',
  },

  // AÇÕES RÁPIDAS
  acoes: {
    ...flexLinha('space-between', 'stretch'),
    gap: espacamentos.marginPequeno,
    flexWrap: 'wrap',
    marginTop: espacamentos.marginPequeno,
  },

  acao: {
    backgroundColor: cores.fundoBranco,
    borderRadius: bordas.raios.grande,
    padding: espacamentos.padrao,
    width: '48%',
    ...flexCentro(),
    gap: espacamentos.pequeno,
    ...sombras.leve,
  },

  acao__icone: {
    width: 48,
    height: 48,
    borderRadius: 24,
    ...flexCentro(),
  },

  acao__icone_adicionar: {
    backgroundColor: 'rgba(79, 70, 229, 0.15)',
  },

  acao__icone_estoque: {
    backgroundColor: 'rgba(251, 146, 60, 0.15)',
  },

  acao__icone_relatorios: {
    backgroundColor: 'rgba(34, 197, 94, 0.15)',
  },

  acao__icone_configuracoes: {
    backgroundColor: 'rgba(107, 114, 128, 0.15)',
  },

  acao__texto: {
    fontSize: tipografia.tamanhos.pequeno,
    fontWeight: tipografia.pesos.medio,
    color: cores.textoEscuro,
    textAlign: 'center',
  },

  // NAVEGAÇÃO INFERIOR
  navegacao: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: cores.fundoBranco,
    ...flexLinha('space-around', 'center'),
    paddingVertical: espacamentos.marginPequeno,
    borderTopWidth: 1,
    borderTopColor: '#F5F5F5',
    ...sombras.padrao,
  },

  navegacao__item: {
    ...flexCentro(),
    gap: 4,
    paddingVertical: espacamentos.pequeno,
    minWidth: 60,
  },

  navegacao__item_ativo: {
    // Modificador para item ativo
  },

  navegacao__icone: {
    // Ícone será renderizado via Ionicons
  },

  navegacao__label: {
    fontSize: 10,
    color: cores.textoMedio,
  },

  navegacao__label_ativo: {
    color: '#4F46E5',
    fontWeight: tipografia.pesos.semibold,
  },
});
