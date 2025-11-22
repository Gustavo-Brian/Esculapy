import { StyleSheet } from 'react-native';
import { cores, espacamentos, bordas, tipografia } from '@/src/estilos/variaveis';
import {
  containerPagina,
  containerConteudo,
  cardBase,
  tituloMedio
} from '@/src/estilos/mixins';

export const profileStyles = StyleSheet.create({
  pagina: {
    ...containerPagina(),
  },
  cabecalho: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: espacamentos.grande,
    paddingTop: espacamentos.grande,
    paddingBottom: espacamentos.marginEntreElementos,
    backgroundColor: cores.fundoClaro,
  },
  cabecalho__botaoVoltar: {
    padding: espacamentos.pequeno,
  },
  cabecalho__titulo: {
    fontSize: tipografia.tamanhos.grande,
    fontWeight: tipografia.pesos.bold,
    color: cores.textoEscuro,
  },
  cabecalho__espacador: {
    width: 40,
  },
  conteudo: {
    ...containerConteudo(),
  },
  secao__perfil: {
    ...cardBase(),
    padding: espacamentos.grande,
    alignItems: 'center',
    marginBottom: espacamentos.grande,
  },
  perfil__imagem: {
    width: 100,
    height: 100,
    borderRadius: bordas.raios.circular,
    backgroundColor: cores.fundoCinza,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: espacamentos.marginEntreElementos,
    borderWidth: bordas.larguras.media,
    borderColor: cores.primaria,
  },
  perfil__nome: {
    ...tituloMedio(),
    marginBottom: 5,
  },
  perfil__telefone: {
    fontSize: tipografia.tamanhos.medio,
    color: cores.textoMedio,
  },
  secao__configuracoes: {
    ...cardBase(),
    padding: espacamentos.grande,
    marginBottom: espacamentos.grande,
  },
  configuracao__item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: espacamentos.medio,
    backgroundColor: cores.fundoBranco,
  },
  configuracao__esquerda: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    backgroundColor: cores.fundoBranco,
  },
  configuracao__icone: {
    marginRight: espacamentos.medio,
  },
  configuracao__texto: {
    fontSize: tipografia.tamanhos.medio,
    color: cores.textoEscuro,
  },
  secao__servicos: {
    ...cardBase(),
    padding: espacamentos.grande,
    marginBottom: espacamentos.grande,
  },
  secao__titulo: {
    fontSize: tipografia.tamanhos.grande,
    fontWeight: tipografia.pesos.bold,
    color: cores.textoEscuro,
    marginBottom: espacamentos.marginEntreElementos,
  },
  servico__item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: espacamentos.marginEntreElementos,
    backgroundColor: cores.fundoBranco,
  },
  servico__esquerda: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    backgroundColor: cores.fundoBranco,
  },
  servico__icone: {
    marginRight: espacamentos.medio,
  },
  servico__texto: {
    fontSize: tipografia.tamanhos.medio,
    color: cores.textoEscuro,
  },
  botao__sair: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF5F5',
    borderRadius: bordas.raios.medio,
    paddingVertical: espacamentos.marginEntreElementos,
    marginBottom: espacamentos.extraGrande,
    borderWidth: bordas.larguras.fina,
    borderColor: '#FFCCCB',
  },
  botao__sairIcone: {
    marginRight: espacamentos.pequeno,
  },
  botao__sairTexto: {
    fontSize: tipografia.tamanhos.medio,
    fontWeight: tipografia.pesos.bold,
    color: cores.erro,
  },
});
