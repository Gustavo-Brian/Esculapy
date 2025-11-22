/**
 * Estilos do Produto Novo - Esculapi
 * Metodologia BEM adaptada para React Native
 * Design moderno e limpo
 */

import { StyleSheet } from 'react-native';
import { cores, espacamentos, bordas, tipografia, sombras } from '@/src/estilos/variaveis';
import {
  containerPagina,
  flexCentro,
  flexLinha,
} from '@/src/estilos/mixins';

export const productNovoStyles = StyleSheet.create({
  // PÁGINA
  pagina: {
    ...containerPagina(),
    backgroundColor: '#F8FAFC',
  },

  // HEADER FIXO
  cabecalho: {
    ...flexLinha('space-between', 'center'),
    backgroundColor: 'rgba(245, 246, 248, 0.8)',
    paddingHorizontal: espacamentos.padrao,
    paddingVertical: espacamentos.padrao,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },

  cabecalho__botaoVoltar: {
    padding: espacamentos.pequeno,
    borderRadius: 100,
  },

  cabecalho__acoes: {
    ...flexLinha('flex-end', 'center'),
    gap: espacamentos.pequeno,
  },

  cabecalho__botaoAcao: {
    padding: espacamentos.pequeno,
    borderRadius: 100,
  },

  // CONTEÚDO
  conteudo: {
    flex: 1,
    paddingTop: 80, // Espaço para header fixo
    paddingBottom: 100, // Espaço para footer fixo
    paddingHorizontal: espacamentos.padrao,
  },

  // IMAGEM DO PRODUTO
  produto__imagemContainer: {
    ...flexCentro(),
    marginVertical: espacamentos.padrao,
  },

  produto__imagem: {
    width: 192,
    height: 192,
    backgroundColor: '#F5F5F5',
    borderRadius: bordas.raios.extraGrande,
    ...flexCentro(),
  },

  // INFO PRINCIPAL
  info: {
    gap: espacamentos.padrao,
  },

  info__titulo: {
    fontSize: tipografia.tamanhos.titulo,
    fontWeight: tipografia.pesos.bold,
    color: '#111827',
    lineHeight: tipografia.alturaLinha.compacta,
  },

  info__subtitulo: {
    fontSize: tipografia.tamanhos.medio,
    color: '#6B7280',
  },

  info__vendedor: {
    ...flexLinha('flex-start', 'center'),
    backgroundColor: '#FAFBFC',
    padding: espacamentos.pequeno,
    borderRadius: bordas.raios.pequeno,
    alignSelf: 'flex-start',
    gap: espacamentos.pequeno,
  },

  info__vendedorTexto: {
    fontSize: tipografia.tamanhos.pequeno,
    fontWeight: tipografia.pesos.medio,
    color: '#607AFB',
  },

  // BOTÃO COMPARAR
  botaoComparar: {
    ...flexLinha('center', 'center'),
    gap: espacamentos.pequeno,
    paddingVertical: espacamentos.marginPequeno,
    paddingHorizontal: espacamentos.padrao,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: bordas.raios.pequeno,
  },

  botaoComparar__texto: {
    fontSize: tipografia.tamanhos.pequeno,
    color: '#374151',
  },

  // DESCRIÇÃO
  descricao: {
    marginTop: espacamentos.massivo,
  },

  descricao__titulo: {
    fontSize: tipografia.tamanhos.grande,
    fontWeight: tipografia.pesos.semibold,
    color: '#111827',
    marginBottom: espacamentos.pequeno,
  },

  descricao__texto: {
    fontSize: tipografia.tamanhos.pequeno,
    color: '#6B7280',
    lineHeight: 20,
  },

  // PREÇO E QUANTIDADE
  precoQuantidade: {
    ...flexLinha('space-between', 'center'),
    marginTop: espacamentos.massivo,
  },

  preco: {
    gap: 4,
  },

  preco__label: {
    fontSize: tipografia.tamanhos.pequeno,
    color: '#6B7280',
  },

  preco__valor: {
    fontSize: tipografia.tamanhos.titulo,
    fontWeight: tipografia.pesos.bold,
    color: '#607AFB',
  },

  // QUANTIDADE
  quantidade: {
    ...flexLinha('flex-end', 'center'),
    gap: espacamentos.padrao,
  },

  quantidade__label: {
    fontSize: tipografia.tamanhos.pequeno,
    color: '#6B7280',
  },

  quantidade__controles: {
    ...flexLinha('center', 'center'),
    backgroundColor: '#FAFBFC',
    padding: 4,
    borderRadius: 100,
    gap: espacamentos.marginPequeno,
  },

  quantidade__botao: {
    width: 32,
    height: 32,
    borderRadius: 16,
    ...flexCentro(),
    backgroundColor: '#F5F5F5',
  },

  quantidade__botaoDesabilitado: {
    opacity: 0.5,
  },

  quantidade__botaoTexto: {
    fontSize: 18,
    fontWeight: tipografia.pesos.bold,
    color: '#374151',
  },

  quantidade__valor: {
    fontSize: tipografia.tamanhos.grande,
    fontWeight: tipografia.pesos.semibold,
    color: '#111827',
    width: 24,
    textAlign: 'center',
  },

  // FOOTER FIXO
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#F8FAFC',
    padding: espacamentos.padrao,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },

  botao__adicionar: {
    backgroundColor: '#607AFB',
    paddingVertical: espacamentos.grande,
    borderRadius: 100,
    ...flexCentro(),
  },

  botao__adicionarTexto: {
    color: cores.textoBranco,
    fontSize: tipografia.tamanhos.grande,
    fontWeight: tipografia.pesos.bold,
  },
});
