/**
 * Tema Centralizado - Esculapi
 * Sistema de Design completo
 * Inspirado em arquitetura SCSS com variáveis e mixins
 */

import variaveis from './variaveis';
import mixins from './mixins';

/**
 * Objeto de tema completo
 * Combina todas as variáveis e mixins em um único ponto de acesso
 */
export const tema = {
  // Variáveis de Design
  ...variaveis,

  // Mixins/Funções Reutilizáveis
  mixins,

  // Alias para facilitar acesso
  v: variaveis,
  m: mixins,
};

/**
 * Hook para usar o tema (para uso futuro com Context API)
 */
export const usarTema = () => tema;

/**
 * Export de variáveis individuais para conveniência
 */
export const { cores, tipografia, espacamentos, bordas, sombras, dimensoes, animacoes, breakpoints } = variaveis;

/**
 * Export dos mixins para uso direto
 */
export {
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
} from './mixins';

export default tema;
