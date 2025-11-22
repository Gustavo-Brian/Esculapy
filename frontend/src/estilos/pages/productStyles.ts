/**
 * Estilos: Produto (Product)
 * Arquivo criado com estilos extraídos de app/product/[id]/index.tsx
 * 100% temaMedico desde o início
 * Padrão BEM aplicado
 */

import { StyleSheet } from 'react-native';
import { temaMedico } from '@/src/estilos/temaMedico';

export const productStyles = StyleSheet.create({
  // ==================== CONTAINERS PRINCIPAIS ====================
  container: {
    flex: 1,
    backgroundColor: temaMedico.cores.background,
  },
  containerCarregando: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: temaMedico.cores.background,
  },
  containerErro: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: temaMedico.cores.background,
    padding: temaMedico.espacamentos.xl,
  },
  conteudo: {
    flex: 1,
  },

  // ==================== ESTADOS DE CARREGAMENTO E ERRO ====================
  textoCarregando: {
    marginTop: temaMedico.espacamentos.md,
    fontSize: temaMedico.fontes.tamanhos.md,
    color: temaMedico.cores.textoClaro,
  },
  textoErro: {
    fontSize: temaMedico.fontes.tamanhos.lg,
    color: temaMedico.cores.erro,
    textAlign: 'center',
    marginTop: temaMedico.espacamentos.md,
    marginBottom: temaMedico.espacamentos.xl,
  },
  botaoVoltar: {
    backgroundColor: temaMedico.cores.primaria,
    paddingVertical: temaMedico.espacamentos.md,
    paddingHorizontal: temaMedico.espacamentos.xl,
    borderRadius: temaMedico.bordas.media,
  },
  textoBotaoVoltar: {
    color: temaMedico.cores.textoBranco,
    fontSize: temaMedico.fontes.tamanhos.md,
    fontWeight: temaMedico.fontes.pesos.bold,
  },

  // ==================== IMAGEM DO PRODUTO ====================
  containerImagem: {
    width: '100%',
    height: 250,
    backgroundColor: temaMedico.cores.backgroundCard,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeDesconto: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: temaMedico.cores.erro,
    paddingHorizontal: temaMedico.espacamentos.md,
    paddingVertical: temaMedico.espacamentos.sm,
    borderRadius: temaMedico.bordas.grande,
  },
  textoDesconto: {
    color: temaMedico.cores.textoBranco,
    fontSize: temaMedico.fontes.tamanhos.sm,
    fontWeight: temaMedico.fontes.pesos.bold,
  },

  // ==================== SEÇÃO DE INFORMAÇÕES ====================
  secaoInfo: {
    padding: temaMedico.espacamentos.lg,
    backgroundColor: temaMedico.cores.backgroundCard,
  },
  nomeProduto: {
    fontSize: temaMedico.fontes.tamanhos.xxl,
    fontWeight: temaMedico.fontes.pesos.bold,
    color: temaMedico.cores.textoTitulo,
    marginBottom: temaMedico.espacamentos.md,
  },
  farmacia: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: temaMedico.espacamentos.sm,
  },
  textoFarmacia: {
    fontSize: temaMedico.fontes.tamanhos.md,
    color: temaMedico.cores.textoClaro,
  },
  categoria: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: temaMedico.espacamentos.lg,
  },
  textoCategoria: {
    fontSize: temaMedico.fontes.tamanhos.sm,
    color: temaMedico.cores.textoClaro,
  },

  // ==================== PREÇOS ====================
  containerPrecos: {
    marginBottom: temaMedico.espacamentos.md,
  },
  precoAntigo: {
    fontSize: temaMedico.fontes.tamanhos.md,
    color: temaMedico.cores.textoClaro,
    textDecorationLine: 'line-through',
    marginBottom: temaMedico.espacamentos.xs,
  },
  preco: {
    fontSize: 32,
    fontWeight: temaMedico.fontes.pesos.bold,
    color: temaMedico.cores.primaria,
  },

  // ==================== ESTOQUE ====================
  estoque: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  textoEstoque: {
    fontSize: temaMedico.fontes.tamanhos.sm,
    color: temaMedico.cores.sucesso,
  },
  textoEstoqueIndisponivel: {
    color: temaMedico.cores.erro,
  },

  // ==================== SEÇÃO DE DESCRIÇÃO ====================
  secaoDescricao: {
    padding: temaMedico.espacamentos.lg,
    backgroundColor: temaMedico.cores.backgroundCard,
    marginTop: temaMedico.espacamentos.md,
  },
  tituloSecao: {
    fontSize: temaMedico.fontes.tamanhos.lg,
    fontWeight: temaMedico.fontes.pesos.semibold,
    color: temaMedico.cores.textoTitulo,
    marginBottom: temaMedico.espacamentos.md,
  },
  descricao: {
    fontSize: temaMedico.fontes.tamanhos.md,
    color: temaMedico.cores.textoSubtitulo,
    lineHeight: 24,
  },

  // ==================== SEÇÃO DE QUANTIDADE ====================
  secaoQuantidade: {
    padding: temaMedico.espacamentos.lg,
    backgroundColor: temaMedico.cores.backgroundCard,
    marginTop: temaMedico.espacamentos.md,
  },
  controladorQuantidade: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
    marginBottom: temaMedico.espacamentos.lg,
  },
  botaoQuantidade: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: temaMedico.cores.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textoQuantidade: {
    fontSize: 28,
    fontWeight: temaMedico.fontes.pesos.bold,
    color: temaMedico.cores.textoTitulo,
    minWidth: 60,
    textAlign: 'center',
  },
  totalQuantidade: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: temaMedico.espacamentos.lg,
    borderTopWidth: 1,
    borderTopColor: temaMedico.cores.borda,
  },
  labelTotal: {
    fontSize: temaMedico.fontes.tamanhos.lg,
    color: temaMedico.cores.textoSubtitulo,
  },
  valorTotal: {
    fontSize: 24,
    fontWeight: temaMedico.fontes.pesos.bold,
    color: temaMedico.cores.primaria,
  },

  // ==================== RODAPÉ E AÇÕES ====================
  espacamentoFinal: {
    height: 100,
  },
  rodape: {
    backgroundColor: temaMedico.cores.backgroundCard,
    padding: temaMedico.espacamentos.lg,
    ...temaMedico.sombras.media,
  },
  botaoAdicionar: {
    flexDirection: 'row',
    backgroundColor: temaMedico.cores.primaria,
    paddingVertical: temaMedico.espacamentos.lg,
    borderRadius: temaMedico.bordas.media,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  botaoAdicionarDesabilitado: {
    backgroundColor: temaMedico.cores.textoClaro,
    opacity: 0.5,
  },
  textoBotaoAdicionar: {
    fontSize: temaMedico.fontes.tamanhos.lg,
    fontWeight: temaMedico.fontes.pesos.bold,
    color: temaMedico.cores.textoBranco,
  },
});
