import { StyleSheet } from 'react-native';
import { cores, espacamentos, sombras } from '@/src/estilos/variaveis';
import {
  containerPagina,
  containerCentralizado,
  botaoPrimario,
  botaoSecundario,
  textoBotao,
  inputBase,
  cardBase,
  tituloGrande,
  subtitulo,
  textoCorpo,
  textoPequeno
} from '@/src/estilos/mixins';

export const globalStyles = StyleSheet.create({
  // Cores
  cor__primaria: {
    color: cores.primaria,
  },
  cor__primariaEscura: {
    color: cores.primariaEscura,
  },
  cor__primariaClara: {
    color: cores.primariaClara,
  },
  cor__destaque: {
    color: cores.destaque,
  },
  texto__primario: {
    color: cores.textoEscuro,
  },
  texto__secundario: {
    color: cores.textoMedio,
  },
  texto__claro: {
    color: cores.textoClaro,
  },

  // Backgrounds
  fundo__branco: {
    backgroundColor: cores.fundoBranco,
  },
  fundo__claro: {
    backgroundColor: cores.fundoClaro,
  },
  fundo__primario: {
    backgroundColor: cores.primaria,
  },

  // Containers
  pagina: {
    ...containerPagina(),
  },

  pagina__centralizada: {
    ...containerCentralizado(),
  },

  conteudo__rolavel: {
    flexGrow: 1,
  },

  // Padding e Margin
  espacamento__padding20: {
    padding: espacamentos.grande,
  },
  espacamento__padding15: {
    padding: espacamentos.padrao,
  },
  espacamento__paddingH20: {
    paddingHorizontal: espacamentos.grande,
  },
  espacamento__paddingV20: {
    paddingVertical: espacamentos.grande,
  },
  espacamento__margin20: {
    margin: espacamentos.grande,
  },
  espacamento__marginB20: {
    marginBottom: espacamentos.grande,
  },
  espacamento__marginB15: {
    marginBottom: espacamentos.marginEntreElementos,
  },
  espacamento__marginB10: {
    marginBottom: espacamentos.marginPequeno,
  },

  // Botões
  botao: {
    ...botaoPrimario(),
  },

  botao__texto: {
    ...textoBotao(cores.textoBranco),
  },

  botao_secundario: {
    ...botaoSecundario(),
  },

  botao__textoSecundario: {
    ...textoBotao(cores.primaria),
  },

  // Inputs
  campo: {
    ...inputBase(),
  },

  // Textos
  texto__titulo: {
    ...tituloGrande(),
  },

  texto__subtitulo: {
    ...subtitulo(),
  },

  texto: {
    ...textoCorpo(),
  },

  texto_pequeno: {
    ...textoPequeno(),
  },

  // Cards
  cartao: {
    ...cardBase(),
  },

  // Flexbox helpers
  layout__linha: {
    flexDirection: 'row',
  },

  layout__linhaEntre: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  layout__linhaCentro: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  layout__centro: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Sombras
  sombra: {
    ...sombras.padrao,
  },
});
