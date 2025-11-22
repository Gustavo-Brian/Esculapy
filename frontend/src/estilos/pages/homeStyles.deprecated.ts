import { StyleSheet } from 'react-native';
import { cores, espacamentos, bordas, tipografia } from '@/src/estilos/variaveis';
import {
  containerPagina,
  containerConteudo,
  tituloMedio,
  cardBase
} from '@/src/estilos/mixins';

export const homeStyles = StyleSheet.create({
  pagina: {
    ...containerPagina(),
  },
  cabecalho: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: espacamentos.grande,
    paddingTop: espacamentos.grande,
    paddingBottom: espacamentos.marginPequeno,
    backgroundColor: cores.fundoClaro,
  },
  cabecalho__botaoIcone: {
    marginLeft: espacamentos.pequeno,
    padding: espacamentos.minimo,
  },
  conteudo: {
    ...containerConteudo(),
  },
  busca: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: cores.fundoBranco,
    borderRadius: bordas.raios.medio,
    paddingHorizontal: espacamentos.padrao,
    marginBottom: espacamentos.grande,
    borderWidth: bordas.larguras.fina,
    borderColor: cores.bordaPadrao,
  },
  busca__icone: {
    marginRight: espacamentos.marginPequeno,
  },
  busca__campo: {
    flex: 1,
    height: 45,
    fontSize: tipografia.tamanhos.medio,
    color: cores.textoEscuro,
  },
  banner: {
    backgroundColor: cores.primaria,
    borderRadius: bordas.raios.grande,
    padding: espacamentos.padrao,
    marginBottom: 25,
  },
  banner__titulo: {
    fontSize: tipografia.tamanhos.grande,
    fontWeight: tipografia.pesos.bold,
    color: cores.textoBranco,
    marginBottom: 5,
  },
  banner__texto: {
    fontSize: tipografia.tamanhos.normal,
    color: cores.textoBranco,
    marginBottom: espacamentos.marginEntreElementos,
  },
  banner__botao: {
    backgroundColor: cores.fundoBranco,
    borderRadius: bordas.raios.grande,
    paddingVertical: espacamentos.pequeno,
    paddingHorizontal: espacamentos.grande,
    alignSelf: 'flex-end',
  },
  banner__botaoTexto: {
    color: cores.primaria,
    fontSize: tipografia.tamanhos.normal,
    fontWeight: tipografia.pesos.bold,
  },
  secao__titulo: {
    ...tituloMedio(),
    marginBottom: espacamentos.marginEntreElementos,
  },
  categorias: {
    marginBottom: 25,
  },
  categoria: {
    backgroundColor: cores.fundoBranco,
    paddingHorizontal: espacamentos.grande,
    paddingVertical: espacamentos.medio,
    marginRight: espacamentos.marginPequeno,
    borderRadius: bordas.raios.extraGrande,
    borderWidth: bordas.larguras.fina,
    borderColor: cores.bordaPadrao,
  },
  categoria__texto: {
    fontSize: tipografia.tamanhos.normal,
    color: cores.textoMedio,
    fontWeight: tipografia.pesos.medio,
  },
  produtos__grade: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    backgroundColor: cores.fundoClaro,
  },
  produto: {
    width: '48%',
    marginBottom: espacamentos.marginEntreElementos,
  },
  produto__conteudo: {
    ...cardBase(),
  },
  produto__imagem: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: espacamentos.marginPequeno,
    padding: espacamentos.marginPequeno,
    backgroundColor: cores.fundoCinza,
    borderRadius: bordas.raios.pequeno,
  },
  produto__titulo: {
    fontSize: tipografia.tamanhos.medio,
    fontWeight: tipografia.pesos.bold,
    color: cores.textoEscuro,
    marginBottom: 5,
  },
  produto__subtitulo: {
    fontSize: tipografia.tamanhos.pequeno,
    color: cores.textoMedio,
    marginBottom: espacamentos.marginPequeno,
  },
  produto__rodape: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: cores.fundoBranco,
  },
  produto__preco: {
    fontSize: tipografia.tamanhos.medio,
    fontWeight: tipografia.pesos.bold,
    color: cores.primaria,
  },
  botao__adicionar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: cores.primaria,
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
  },
  botao__adicionarTexto: {
    color: cores.textoBranco,
    fontSize: tipografia.tamanhos.grande,
    fontWeight: tipografia.pesos.bold,
    textAlign: 'center',
    lineHeight: tipografia.alturaLinha.compacta,
    marginTop: -2,
  },
});
