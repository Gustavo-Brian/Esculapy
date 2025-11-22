/**
 * Estilos: Account (Perfil do Usuário)
 * Refatorado para usar 100% temaMedico
 * Padrão BEM mantido
 */

import { StyleSheet } from 'react-native';
import { temaMedico } from '@/src/estilos/temaMedico';

export const accountStyles = StyleSheet.create({
  // ==================== PÁGINA ====================
  pagina: {
    flex: 1,
    backgroundColor: temaMedico.cores.background,
  },

  // ==================== CABEÇALHO ====================
  cabecalho: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: temaMedico.espacamentos.lg,
    paddingTop: temaMedico.espacamentos.lg,
    paddingBottom: temaMedico.espacamentos.md,
    backgroundColor: temaMedico.cores.backgroundCard,
  },
  cabecalho__botaoVoltar: {
    padding: temaMedico.espacamentos.sm,
  },
  cabecalho__titulo: {
    fontSize: temaMedico.fontes.tamanhos.lg,
    fontWeight: temaMedico.fontes.pesos.bold,
    color: temaMedico.cores.textoTitulo,
  },
  cabecalho__espacador: {
    width: 40,
  },

  // ==================== CONTEÚDO ====================
  conteudo: {
    flex: 1,
    paddingHorizontal: temaMedico.espacamentos.lg,
  },

  // ==================== SEÇÃO FOTO ====================
  secao__foto: {
    backgroundColor: temaMedico.cores.backgroundCard,
    borderRadius: temaMedico.bordas.media,
    padding: temaMedico.espacamentos.lg,
    borderWidth: 1,
    borderColor: temaMedico.cores.borda,
    marginBottom: temaMedico.espacamentos.lg,
  },
  secao__titulo: {
    fontSize: temaMedico.fontes.tamanhos.lg,
    fontWeight: temaMedico.fontes.pesos.bold,
    color: temaMedico.cores.textoTitulo,
    marginBottom: temaMedico.espacamentos.md,
  },
  foto: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: temaMedico.cores.backgroundCard,
  },
  foto__imagem: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: temaMedico.cores.backgroundInput,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: temaMedico.espacamentos.lg,
    borderWidth: 2,
    borderColor: temaMedico.cores.primaria,
  },
  foto__botaoAlterar: {
    paddingHorizontal: temaMedico.espacamentos.lg,
    paddingVertical: temaMedico.espacamentos.sm,
    backgroundColor: temaMedico.cores.backgroundInput,
    borderRadius: temaMedico.bordas.pequena,
    borderWidth: 1,
    borderColor: temaMedico.cores.borda,
  },
  foto__botaoTexto: {
    fontSize: temaMedico.fontes.tamanhos.md,
    color: temaMedico.cores.primaria,
    fontWeight: temaMedico.fontes.pesos.semibold,
  },

  // ==================== SEÇÃO DADOS PESSOAIS ====================
  secao__dadosPessoais: {
    backgroundColor: temaMedico.cores.backgroundCard,
    borderRadius: temaMedico.bordas.media,
    padding: temaMedico.espacamentos.lg,
    borderWidth: 1,
    borderColor: temaMedico.cores.borda,
    marginBottom: temaMedico.espacamentos.lg,
  },
  campo__grupo: {
    marginBottom: temaMedico.espacamentos.lg,
    backgroundColor: temaMedico.cores.backgroundCard,
  },
  campo__rotulo: {
    fontSize: temaMedico.fontes.tamanhos.md,
    fontWeight: temaMedico.fontes.pesos.semibold,
    color: temaMedico.cores.textoTitulo,
    marginBottom: temaMedico.espacamentos.sm,
  },
  campo: {
    height: 45,
    backgroundColor: temaMedico.cores.backgroundInput,
    borderRadius: temaMedico.bordas.pequena,
    paddingHorizontal: temaMedico.espacamentos.md,
    fontSize: temaMedico.fontes.tamanhos.md,
    color: temaMedico.cores.textoTitulo,
    borderWidth: 1,
    borderColor: temaMedico.cores.borda,
  },
  botao__senha: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: temaMedico.espacamentos.md,
    backgroundColor: temaMedico.cores.backgroundCard,
    borderTopWidth: 1,
    borderTopColor: temaMedico.cores.borda,
  },
  botao__senhaTexto: {
    fontSize: temaMedico.fontes.tamanhos.md,
    color: temaMedico.cores.textoTitulo,
    flex: 1,
    marginLeft: temaMedico.espacamentos.md,
  },

  // ==================== SEÇÃO ENDEREÇOS ====================
  secao__enderecos: {
    backgroundColor: temaMedico.cores.backgroundCard,
    borderRadius: temaMedico.bordas.media,
    padding: temaMedico.espacamentos.lg,
    borderWidth: 1,
    borderColor: temaMedico.cores.borda,
    marginBottom: temaMedico.espacamentos.lg,
  },
  enderecos__cabecalho: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: temaMedico.espacamentos.md,
    backgroundColor: temaMedico.cores.backgroundCard,
  },
  botao__adicionar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: temaMedico.espacamentos.md,
    paddingVertical: 6,
    backgroundColor: temaMedico.cores.backgroundInput,
    borderRadius: temaMedico.bordas.pequena,
    borderWidth: 1,
    borderColor: temaMedico.cores.primaria,
  },
  botao__adicionarTexto: {
    fontSize: temaMedico.fontes.tamanhos.md,
    color: temaMedico.cores.primaria,
    fontWeight: temaMedico.fontes.pesos.semibold,
    marginLeft: temaMedico.espacamentos.xs,
  },
  endereco__item: {
    flexDirection: 'row',
    paddingVertical: temaMedico.espacamentos.md,
    borderBottomWidth: 1,
    borderBottomColor: temaMedico.cores.borda,
    backgroundColor: temaMedico.cores.backgroundCard,
  },
  endereco__info: {
    flex: 1,
    backgroundColor: temaMedico.cores.backgroundCard,
  },
  endereco__tituloLinha: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: temaMedico.espacamentos.sm,
    backgroundColor: temaMedico.cores.backgroundCard,
  },
  endereco__titulo: {
    fontSize: temaMedico.fontes.tamanhos.md,
    fontWeight: temaMedico.fontes.pesos.bold,
    color: temaMedico.cores.textoTitulo,
    marginRight: temaMedico.espacamentos.sm,
  },
  endereco__badge: {
    paddingHorizontal: temaMedico.espacamentos.sm,
    paddingVertical: 2,
    borderRadius: temaMedico.bordas.pequena,
    backgroundColor: temaMedico.cores.primaria,
    alignSelf: 'flex-start',
  },
  endereco__badgeTexto: {
    fontSize: temaMedico.fontes.tamanhos.xs,
    fontWeight: temaMedico.fontes.pesos.bold,
    color: temaMedico.cores.textoBranco,
  },
  endereco__texto: {
    fontSize: temaMedico.fontes.tamanhos.md,
    color: temaMedico.cores.textoSubtitulo,
    lineHeight: 20,
  },
  endereco__acoes: {
    justifyContent: 'center',
  },
  botao__editar: {
    padding: temaMedico.espacamentos.sm,
  },

  // ==================== BOTÃO SALVAR ====================
  botao__salvar: {
    backgroundColor: temaMedico.cores.primaria,
    borderRadius: temaMedico.bordas.media,
    paddingVertical: temaMedico.espacamentos.md,
    alignItems: 'center',
    marginBottom: temaMedico.espacamentos.xxl,
  },
  botao__salvarTexto: {
    color: temaMedico.cores.textoBranco,
    fontSize: temaMedico.fontes.tamanhos.md,
    fontWeight: temaMedico.fontes.pesos.bold,
  },

  // ==================== ESTILOS INLINE (extraídos de app/account/index.tsx) ====================
  container: {
    flex: 1,
    backgroundColor: temaMedico.cores.background,
  },
  content: {
    flex: 1,
  },
  bottomSpacer: {
    height: 40,
  },
});
