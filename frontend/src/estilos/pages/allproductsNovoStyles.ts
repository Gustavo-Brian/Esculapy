/**
 * Estilos: All Products Novo (Catálogo de Produtos)
 * Refatorado para usar 100% temaMedico
 * Padrão BEM mantido
 * Grid de produtos com filtros
 */

import { StyleSheet } from 'react-native';
import { temaMedico } from '@/src/estilos/temaMedico';

export const allproductsNovoStyles = StyleSheet.create({
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
    backgroundColor: 'rgba(249, 250, 251, 0.9)',
    paddingHorizontal: temaMedico.espacamentos.md,
    paddingVertical: temaMedico.espacamentos.md,
    borderBottomWidth: 1,
    borderBottomColor: temaMedico.cores.borda,
  },
  cabecalho__botao: {
    padding: temaMedico.espacamentos.sm,
  },
  cabecalho__titulo: {
    fontSize: temaMedico.fontes.tamanhos.xl,
    fontWeight: temaMedico.fontes.pesos.bold,
    color: temaMedico.cores.textoTitulo,
  },
  cabecalho__espacador: {
    width: 40,
  },

  // ==================== FILTROS ====================
  filtros: {
    paddingHorizontal: temaMedico.espacamentos.md,
    paddingVertical: temaMedico.espacamentos.md,
    backgroundColor: temaMedico.cores.background,
  },
  filtros__botao: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: temaMedico.cores.backgroundCard,
    borderWidth: 1,
    borderColor: temaMedico.cores.borda,
    borderRadius: temaMedico.bordas.media,
    paddingHorizontal: temaMedico.espacamentos.md,
    paddingVertical: temaMedico.espacamentos.sm,
  },
  filtros__botaoTexto: {
    fontSize: temaMedico.fontes.tamanhos.md,
    fontWeight: temaMedico.fontes.pesos.medium,
    color: temaMedico.cores.textoTitulo,
  },

  // ==================== GRID DE PRODUTOS ====================
  produtos: {
    paddingHorizontal: temaMedico.espacamentos.md,
    paddingBottom: temaMedico.espacamentos.lg,
  },
  produtos__grid: {
    gap: temaMedico.espacamentos.md,
  },

  // ==================== CARD DO PRODUTO ====================
  produtoCard: {
    flex: 1,
    maxWidth: '48%',
    backgroundColor: temaMedico.cores.backgroundCard,
    borderRadius: temaMedico.bordas.media,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: temaMedico.cores.primaria,
    shadowColor: '#000',
    shadowOffset: {
      width: 3,
      height: 6,
    },
    shadowOpacity: 1.0,
    shadowRadius: 1,
    elevation: 12,
  },
  produtoCard__imagem: {
    width: '100%',
    height: 120,
    backgroundColor: temaMedico.cores.backgroundInput,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  produtoCard__conteudo: {
    padding: temaMedico.espacamentos.sm,
    flex: 1,
  },
  produtoCard__nome: {
    fontSize: temaMedico.fontes.tamanhos.sm,
    fontWeight: temaMedico.fontes.pesos.semibold,
    color: temaMedico.cores.textoTitulo,
    marginBottom: 4,
    lineHeight: 16,
  },
  produtoCard__vendedor: {
    fontSize: 11,
    color: temaMedico.cores.textoSubtitulo,
    marginBottom: temaMedico.espacamentos.sm,
  },
  produtoCard__avaliacao: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: 4,
    marginBottom: temaMedico.espacamentos.sm,
  },
  produtoCard__avaliacaoTexto: {
    fontSize: 11,
    fontWeight: temaMedico.fontes.pesos.medium,
    color: temaMedico.cores.textoTitulo,
  },
  produtoCard__preco: {
    fontSize: temaMedico.fontes.tamanhos.lg,
    fontWeight: temaMedico.fontes.pesos.bold,
    color: temaMedico.cores.textoTitulo,
    marginTop: 'auto',
    marginBottom: temaMedico.espacamentos.sm,
  },
  produtoCard__botao: {
    backgroundColor: temaMedico.cores.primaria,
    paddingVertical: temaMedico.espacamentos.sm,
    borderRadius: temaMedico.bordas.pequena,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  produtoCard__botaoTexto: {
    color: temaMedico.cores.textoBranco,
    fontSize: temaMedico.fontes.tamanhos.sm,
    fontWeight: temaMedico.fontes.pesos.semibold,
  },

  // ==================== ESTADO VAZIO ====================
  vazio: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 128,
  },
  vazio__icone: {
    marginBottom: temaMedico.espacamentos.lg,
    opacity: 0.3,
  },
  vazio__titulo: {
    fontSize: temaMedico.fontes.tamanhos.titulo,
    fontWeight: temaMedico.fontes.pesos.bold,
    color: temaMedico.cores.textoTitulo,
    marginBottom: temaMedico.espacamentos.sm,
    textAlign: 'center',
  },
  vazio__texto: {
    fontSize: temaMedico.fontes.tamanhos.md,
    color: temaMedico.cores.textoSubtitulo,
    textAlign: 'center',
  },
});
