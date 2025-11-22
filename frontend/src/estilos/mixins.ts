/**
 * Mixins - Funções Reutilizáveis de Estilo
 * Inspirado em @mixin do SCSS
 * Facilita a criação de estilos consistentes
 */

import { TextStyle, ViewStyle } from 'react-native';
import { cores, tipografia, espacamentos, bordas, sombras, dimensoes } from './variaveis';

// ==================== MIXINS DE LAYOUT ====================

/**
 * Cria um container flexível centralizado
 */
export const flexCentro = (): ViewStyle => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});

/**
 * Cria um layout de linha (horizontal)
 */
export const flexLinha = (
  justificar: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' = 'flex-start',
  alinhar: 'flex-start' | 'center' | 'flex-end' | 'stretch' = 'center'
): ViewStyle => ({
  flexDirection: 'row',
  justifyContent: justificar,
  alignItems: alinhar,
});

/**
 * Cria um layout de coluna (vertical)
 */
export const flexColuna = (
  justificar: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' = 'flex-start',
  alinhar: 'flex-start' | 'center' | 'flex-end' | 'stretch' = 'stretch'
): ViewStyle => ({
  flexDirection: 'column',
  justifyContent: justificar,
  alignItems: alinhar,
});

// ==================== MIXINS DE BOTÕES ====================

/**
 * Estilo base para botões
 */
export const botaoBase = (): ViewStyle => ({
  height: dimensoes.alturas.botao,
  borderRadius: bordas.raios.grande,
  justifyContent: 'center',
  alignItems: 'center',
  paddingHorizontal: espacamentos.grande,
});

/**
 * Botão primário
 */
export const botaoPrimario = (): ViewStyle => ({
  ...botaoBase(),
  backgroundColor: cores.primaria,
});

/**
 * Botão secundário
 */
export const botaoSecundario = (): ViewStyle => ({
  ...botaoBase(),
  backgroundColor: cores.fundoBranco,
  borderWidth: bordas.larguras.media,
  borderColor: cores.primaria,
});

/**
 * Botão de destaque/perigo
 */
export const botaoDestaque = (): ViewStyle => ({
  ...botaoBase(),
  backgroundColor: cores.destaque,
});

/**
 * Botão desabilitado
 */
export const botaoDesabilitado = (): ViewStyle => ({
  ...botaoBase(),
  backgroundColor: cores.bordaClara,
  opacity: 0.6,
});

/**
 * Texto de botão
 */
export const textoBotao = (cor: string = cores.textoBranco): TextStyle => ({
  fontSize: tipografia.tamanhos.medio,
  fontWeight: tipografia.pesos.bold,
  color: cor,
});

// ==================== MIXINS DE CARDS ====================

/**
 * Card básico
 */
export const cardBase = (): ViewStyle => ({
  backgroundColor: cores.fundoBranco,
  borderRadius: bordas.raios.medio,
  padding: espacamentos.paddingCard,
  borderWidth: bordas.larguras.fina,
  borderColor: cores.bordaPadrao,
});

/**
 * Card com sombra
 */
export const cardComSombra = (): ViewStyle => ({
  ...cardBase(),
  ...sombras.padrao,
});

/**
 * Card elevado
 */
export const cardElevado = (): ViewStyle => ({
  ...cardBase(),
  ...sombras.forte,
});

// ==================== MIXINS DE INPUTS ====================

/**
 * Campo de input base
 */
export const inputBase = (): TextStyle & ViewStyle => ({
  height: dimensoes.alturas.input,
  backgroundColor: cores.fundoBranco,
  borderRadius: bordas.raios.grande,
  paddingHorizontal: espacamentos.padrao,
  fontSize: tipografia.tamanhos.medio,
  borderWidth: bordas.larguras.fina,
  borderColor: cores.bordaPadrao,
  color: cores.textoEscuro,
});

/**
 * Input com erro
 */
export const inputErro = (): ViewStyle => ({
  ...inputBase(),
  borderColor: cores.erro,
  borderWidth: bordas.larguras.media,
});

/**
 * Input focado
 */
export const inputFocado = (): ViewStyle => ({
  ...inputBase(),
  borderColor: cores.primaria,
  borderWidth: bordas.larguras.media,
});

// ==================== MIXINS DE TEXTO ====================

/**
 * Título grande
 */
export const tituloGrande = (cor: string = cores.textoEscuro): TextStyle => ({
  fontSize: tipografia.tamanhos.tituloGrande,
  fontWeight: tipografia.pesos.bold,
  color: cor,
  lineHeight: tipografia.alturaLinha.ampla,
});

/**
 * Título médio
 */
export const tituloMedio = (cor: string = cores.textoEscuro): TextStyle => ({
  fontSize: tipografia.tamanhos.titulo,
  fontWeight: tipografia.pesos.bold,
  color: cor,
  lineHeight: tipografia.alturaLinha.confortavel,
});

/**
 * Subtítulo
 */
export const subtitulo = (cor: string = cores.textoMedio): TextStyle => ({
  fontSize: tipografia.tamanhos.grande,
  fontWeight: tipografia.pesos.semibold,
  color: cor,
  lineHeight: tipografia.alturaLinha.normal,
});

/**
 * Texto corpo
 */
export const textoCorpo = (cor: string = cores.textoEscuro): TextStyle => ({
  fontSize: tipografia.tamanhos.medio,
  fontWeight: tipografia.pesos.normal,
  color: cor,
  lineHeight: tipografia.alturaLinha.normal,
});

/**
 * Texto pequeno
 */
export const textoPequeno = (cor: string = cores.textoMedio): TextStyle => ({
  fontSize: tipografia.tamanhos.normal,
  fontWeight: tipografia.pesos.normal,
  color: cor,
  lineHeight: tipografia.alturaLinha.compacta,
});

/**
 * Texto minúsculo/caption
 */
export const textoMinusculo = (cor: string = cores.textoClaro): TextStyle => ({
  fontSize: tipografia.tamanhos.pequeno,
  fontWeight: tipografia.pesos.normal,
  color: cor,
  lineHeight: tipografia.alturaLinha.compacta,
});

// ==================== MIXINS DE ESPAÇAMENTO ====================

/**
 * Padding padrão
 */
export const paddingPadrao = (): ViewStyle => ({
  padding: espacamentos.padrao,
});

/**
 * Padding horizontal
 */
export const paddingHorizontal = (valor: number = espacamentos.grande): ViewStyle => ({
  paddingHorizontal: valor,
});

/**
 * Padding vertical
 */
export const paddingVertical = (valor: number = espacamentos.grande): ViewStyle => ({
  paddingVertical: valor,
});

/**
 * Margin bottom
 */
export const marginBottom = (valor: number = espacamentos.marginEntreElementos): ViewStyle => ({
  marginBottom: valor,
});

// ==================== MIXINS DE CONTAINERS ====================

/**
 * Container de página
 */
export const containerPagina = (): ViewStyle => ({
  flex: 1,
  backgroundColor: cores.fundoClaro,
});

/**
 * Container de conteúdo
 */
export const containerConteudo = (): ViewStyle => ({
  flex: 1,
  paddingHorizontal: espacamentos.paddingContainer,
});

/**
 * Container centralizado
 */
export const containerCentralizado = (): ViewStyle => ({
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: cores.fundoClaro,
  padding: espacamentos.grande,
});

// ==================== MIXINS DE HEADER ====================

/**
 * Header/Cabeçalho padrão
 */
export const cabecalhoPadrao = (): ViewStyle => ({
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingHorizontal: espacamentos.grande,
  paddingTop: espacamentos.grande,
  paddingBottom: espacamentos.padrao,
  backgroundColor: cores.fundoClaro,
});

/**
 * Título do header
 */
export const tituloCabecalho = (): TextStyle => ({
  fontSize: tipografia.tamanhos.grande,
  fontWeight: tipografia.pesos.bold,
  color: cores.textoEscuro,
});

// ==================== MIXINS DE IMAGENS ====================

/**
 * Container de imagem circular
 */
export const imagemCircular = (tamanho: number = 100): ViewStyle => ({
  width: tamanho,
  height: tamanho,
  borderRadius: tamanho / 2,
  backgroundColor: cores.fundoCinza,
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
});

/**
 * Container de imagem quadrada com borda arredondada
 */
export const imagemArredondada = (tamanho: number = 100, raio: number = bordas.raios.medio): ViewStyle => ({
  width: tamanho,
  height: tamanho,
  borderRadius: raio,
  backgroundColor: cores.fundoCinza,
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
});

// ==================== MIXINS DE BADGES ====================

/**
 * Badge padrão
 */
export const badgePadrao = (corFundo: string = cores.primaria): ViewStyle => ({
  paddingHorizontal: espacamentos.pequeno,
  paddingVertical: espacamentos.minimo,
  borderRadius: bordas.raios.pequeno,
  backgroundColor: corFundo,
  alignSelf: 'flex-start',
});

/**
 * Texto de badge
 */
export const textoBadge = (cor: string = cores.textoBranco): TextStyle => ({
  fontSize: tipografia.tamanhos.minusculo,
  fontWeight: tipografia.pesos.bold,
  color: cor,
});

// ==================== EXPORT DEFAULT ====================
export default {
  // Layout
  flexCentro,
  flexLinha,
  flexColuna,

  // Botões
  botaoBase,
  botaoPrimario,
  botaoSecundario,
  botaoDestaque,
  botaoDesabilitado,
  textoBotao,

  // Cards
  cardBase,
  cardComSombra,
  cardElevado,

  // Inputs
  inputBase,
  inputErro,
  inputFocado,

  // Texto
  tituloGrande,
  tituloMedio,
  subtitulo,
  textoCorpo,
  textoPequeno,
  textoMinusculo,

  // Espaçamento
  paddingPadrao,
  paddingHorizontal,
  paddingVertical,
  marginBottom,

  // Containers
  containerPagina,
  containerConteudo,
  containerCentralizado,

  // Header
  cabecalhoPadrao,
  tituloCabecalho,

  // Imagens
  imagemCircular,
  imagemArredondada,

  // Badges
  badgePadrao,
  textoBadge,
};
