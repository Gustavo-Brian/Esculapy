/**
 * Estilos da Lista de Farmácias Novo - Esculapi
 * Metodologia BEM adaptada para React Native
 * Lista completa de farmácias com filtros
 */

import { StyleSheet } from 'react-native';
import { cores, espacamentos, bordas, tipografia, sombras } from '@/src/estilos/variaveis';
import {
  containerPagina,
  flexCentro,
  flexLinha,
  cardComSombra,
} from '@/src/estilos/mixins';

export const sellersNovoStyles = StyleSheet.create({
  // PÁGINA
  pagina: {
    ...containerPagina(),
    backgroundColor: '#F8FAFC',
  },

  // HEADER
  cabecalho: {
    ...flexLinha('space-between', 'center'),
    backgroundColor: '#F8FAFC',
    paddingHorizontal: espacamentos.padrao,
    paddingVertical: espacamentos.padrao,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },

  cabecalho__botao: {
    padding: espacamentos.pequeno,
  },

  cabecalho__titulo: {
    fontSize: tipografia.tamanhos.grande + 3,
    fontWeight: tipografia.pesos.bold,
    color: cores.textoEscuro,
  },

  // BUSCA E FILTROS
  busca: {
    backgroundColor: '#F8FAFC',
    paddingHorizontal: espacamentos.padrao,
    paddingTop: espacamentos.padrao,
    paddingBottom: espacamentos.marginPequeno,
  },

  busca__container: {
    ...flexLinha('flex-start', 'center'),
    backgroundColor: cores.fundoBranco,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: bordas.raios.medio,
    paddingHorizontal: espacamentos.marginPequeno,
    paddingVertical: espacamentos.marginPequeno,
    marginBottom: espacamentos.padrao,
  },

  busca__icone: {
    marginRight: espacamentos.marginPequeno,
  },

  busca__input: {
    flex: 1,
    fontSize: tipografia.tamanhos.medio,
    color: cores.textoEscuro,
  },

  // FILTROS
  filtros: {
    paddingBottom: espacamentos.pequeno,
  },

  filtros__lista: {
    paddingHorizontal: espacamentos.padrao,
    gap: espacamentos.marginPequeno,
  },

  filtro: {
    ...flexLinha('center', 'center'),
    gap: 4,
    paddingHorizontal: espacamentos.padrao,
    paddingVertical: espacamentos.pequeno,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#4F46E5',
    backgroundColor: cores.fundoBranco,
  },

  filtro_ativo: {
    backgroundColor: '#4F46E5',
  },

  filtro__texto: {
    fontSize: tipografia.tamanhos.pequeno,
    fontWeight: tipografia.pesos.medio,
    color: '#4F46E5',
  },

  filtro__textoAtivo: {
    color: cores.textoBranco,
  },

  // LISTA DE FARMÁCIAS
  lista: {
    flex: 1,
    paddingHorizontal: espacamentos.padrao,
    paddingTop: espacamentos.padrao,
    paddingBottom: espacamentos.grande,
  },

  lista__conteudo: {
    gap: espacamentos.padrao,
  },

  // CARD DA FARMÁCIA
  farmaciaCard: {
    backgroundColor: cores.fundoBranco,
    borderRadius: bordas.raios.medio,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#4F46E5',
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
    height: 96,
    ...flexCentro(),
    position: 'relative',
  },

  farmaciaCard__badgeFechada: {
    position: 'absolute',
    top: espacamentos.marginPequeno,
    right: espacamentos.marginPequeno,
    backgroundColor: '#DC2626',
    paddingHorizontal: espacamentos.marginPequeno,
    paddingVertical: 4,
    borderRadius: 999,
  },

  farmaciaCard__badgeFechadaTexto: {
    color: cores.textoBranco,
    fontSize: 10,
    fontWeight: tipografia.pesos.bold,
  },

  farmaciaCard__conteudo: {
    padding: espacamentos.padrao,
  },

  farmaciaCard__logoContainer: {
    marginTop: -48,
    marginBottom: espacamentos.marginPequeno,
  },

  farmaciaCard__logo: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FAFBFC',
    borderWidth: 4,
    borderColor: cores.fundoBranco,
    ...flexCentro(),
    ...sombras.leve,
    position: 'relative',
  },

  farmaciaCard__verificada: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: cores.fundoBranco,
    ...flexCentro(),
  },

  farmaciaCard__nome: {
    fontSize: tipografia.tamanhos.grande,
    fontWeight: tipografia.pesos.bold,
    color: cores.textoEscuro,
    marginBottom: 4,
  },

  farmaciaCard__avaliacao: {
    ...flexLinha('flex-start', 'center'),
    marginBottom: espacamentos.marginPequeno,
  },

  farmaciaCard__avaliacaoNota: {
    fontSize: tipografia.tamanhos.pequeno,
    fontWeight: tipografia.pesos.semibold,
    color: cores.textoEscuro,
    marginLeft: 4,
  },

  farmaciaCard__avaliacaoTotal: {
    fontSize: tipografia.tamanhos.pequeno,
    color: cores.textoMedio,
    marginLeft: 4,
  },

  farmaciaCard__info: {
    ...flexLinha('flex-start', 'center'),
    marginBottom: espacamentos.marginPequeno,
    gap: espacamentos.padrao,
  },

  farmaciaCard__infoItem: {
    ...flexLinha('flex-start', 'center'),
    gap: 4,
  },

  farmaciaCard__infoTexto: {
    fontSize: tipografia.tamanhos.pequeno,
    color: cores.textoMedio,
  },

  farmaciaCard__produtos: {
    ...flexLinha('flex-start', 'center'),
    gap: 4,
    marginBottom: espacamentos.marginPequeno,
  },

  farmaciaCard__produtosTexto: {
    fontSize: tipografia.tamanhos.pequeno,
    color: cores.textoMedio,
  },

  farmaciaCard__tags: {
    ...flexLinha('flex-start', 'center'),
    flexWrap: 'wrap',
    gap: espacamentos.marginPequeno,
  },

  farmaciaCard__tag: {
    paddingHorizontal: espacamentos.pequeno,
    paddingVertical: 4,
    borderRadius: 999,
  },

  farmaciaCard__tagTexto: {
    fontSize: 11,
    fontWeight: tipografia.pesos.medio,
  },

  // TAGS ESPECÍFICAS
  tag_entrega: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
  },

  tag_entregaTexto: {
    color: '#2563EB',
  },

  tag_preco: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
  },

  tag_precoTexto: {
    color: '#059669',
  },

  tag_horario: {
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
  },

  tag_horarioTexto: {
    color: '#D97706',
  },

  // ESTADO VAZIO
  vazio: {
    flex: 1,
    ...flexCentro(),
    paddingVertical: espacamentos.massivo * 2,
  },

  vazio__icone: {
    marginBottom: espacamentos.grande,
    opacity: 0.3,
  },

  vazio__titulo: {
    fontSize: tipografia.tamanhos.titulo,
    fontWeight: tipografia.pesos.bold,
    color: cores.textoEscuro,
    marginBottom: espacamentos.pequeno,
    textAlign: 'center',
  },

  vazio__texto: {
    fontSize: tipografia.tamanhos.medio,
    color: cores.textoMedio,
    textAlign: 'center',
  },
});
