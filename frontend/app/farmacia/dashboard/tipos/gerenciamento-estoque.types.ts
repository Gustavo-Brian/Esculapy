/**
 * Tipos para Gerenciamento de Estoque
 */

export interface ProdutoCatalogoSimplificado {
  id: number;
  nome: string;
  principioAtivo?: string;
  laboratorio?: string;
  descricao?: string;
  tarja?: 'BRANCA' | 'VERMELHA' | 'AMARELA' | 'PRETA';
}

export interface FormularioAdicionarProduto {
  produtoId: number;
  produtoNome: string;
  preco: number;
  quantidade: number;
}

export interface AcaoEstoque {
  tipo: 'adicionar' | 'editar' | 'remover';
  produtoId?: number;
  estoqueId?: number;
}

export interface FiltrosBusca {
  texto: string;
  ordenacao: 'nome' | 'quantidade' | 'preco';
  filtro: 'todos' | 'baixo' | 'esgotado';
}
