import { StyleSheet } from 'react-native';
import { cores, espacamentos, bordas, tipografia } from '@/src/estilos/variaveis';
import {
  containerPagina,
  tituloGrande,
  subtitulo,
  botaoPrimario
} from '@/src/estilos/mixins';

export const productStyles = StyleSheet.create({
  pagina: {
    ...containerPagina(),
  },
  cabecalho: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: espacamentos.grande,
    paddingTop: espacamentos.grande,
    paddingBottom: espacamentos.marginPequeno,
    backgroundColor: cores.fundoClaro,
  },
  cabecalho__botaoVoltar: {
    padding: espacamentos.pequeno,
  },
  cabecalho__botaoAcao: {
    padding: espacamentos.pequeno,
  },
  conteudo: {
    flex: 1,
    paddingHorizontal: espacamentos.grande,
    alignItems: 'center',
  },
  produto__imagem: {
    width: 150,
    height: 150,
    backgroundColor: cores.fundoCinza,
    borderRadius: bordas.raios.extraGrande,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: espacamentos.extraGrande,
    marginTop: espacamentos.grande,
  },
  produto__titulo: {
    ...tituloGrande(),
    textAlign: 'center',
    marginBottom: 5,
  },
  produto__subtitulo: {
    ...subtitulo(cores.textoMedio),
    textAlign: 'center',
    marginBottom: espacamentos.extraGrande,
  },
  descricao__titulo: {
    fontSize: tipografia.tamanhos.grande,
    fontWeight: tipografia.pesos.bold,
    color: cores.textoEscuro,
    alignSelf: 'flex-start',
    marginBottom: espacamentos.marginPequeno,
  },
  descricao__texto: {
    fontSize: tipografia.tamanhos.normal,
    color: cores.textoMedio,
    lineHeight: tipografia.alturaLinha.normal,
    textAlign: 'left',
    marginBottom: espacamentos.extraGrande,
  },
  preco: {
    alignItems: 'center',
    marginBottom: espacamentos.extraGrande,
  },
  preco__unidade: {
    fontSize: tipografia.tamanhos.normal,
    color: cores.textoMedio,
    marginBottom: 5,
  },
  preco__valor: {
    fontSize: tipografia.tamanhos.destaque,
    fontWeight: tipografia.pesos.bold,
    color: cores.primaria,
  },
  quantidade: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: espacamentos.massivo,
  },
  quantidade__rotulo: {
    fontSize: tipografia.tamanhos.medio,
    color: cores.textoEscuro,
    marginRight: espacamentos.marginEntreElementos,
  },
  quantidade__seletor: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: cores.fundoBranco,
    borderRadius: bordas.raios.medio,
    borderWidth: bordas.larguras.fina,
    borderColor: cores.bordaPadrao,
  },
  quantidade__botao: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantidade__botaoTexto: {
    fontSize: tipografia.tamanhos.titulo,
    fontWeight: tipografia.pesos.bold,
    color: cores.primaria,
  },
  quantidade__texto: {
    fontSize: tipografia.tamanhos.grande,
    fontWeight: tipografia.pesos.bold,
    color: cores.textoEscuro,
    marginHorizontal: espacamentos.grande,
  },
  botao__adicionarCarrinho: {
    ...botaoPrimario(),
    width: '100%',
  },
  botao__adicionarCarrinhoTexto: {
    color: cores.textoBranco,
    fontSize: tipografia.tamanhos.grande,
    fontWeight: tipografia.pesos.bold,
  },
});
