/**
 * Mock Data: Produtos
 * Dados de exemplo para desenvolvimento e testes
 */

import { Produto } from '../tipos/Produto';

/**
 * Lista de produtos mock para desenvolvimento
 * Usado quando a API não está disponível
 */
export const PRODUTOS_MOCK_DATA = [
  {
    id: 1,
    nome: 'Dipirona 500mg',
    preco: 15.90,
    precoPromocional: 12.90,
    descricao: 'Analgésico e antitérmico',
    categoria: 'Analgésicos',
    estoque: 50,
    farmaciaId: 1,
    icone: 'medical',
  },
  {
    id: 2,
    nome: 'Paracetamol 750mg',
    preco: 18.50,
    precoPromocional: null,
    descricao: 'Analgésico de ação rápida',
    categoria: 'Analgésicos',
    estoque: 30,
    farmaciaId: 2,
    icone: 'medkit',
  },
  {
    id: 3,
    nome: 'Vitamina C 1g',
    preco: 25.00,
    precoPromocional: 19.90,
    descricao: 'Suplemento vitamínico',
    categoria: 'Vitaminas',
    estoque: 45,
    farmaciaId: 1,
    icone: 'nutrition',
  },
  {
    id: 4,
    nome: 'Ibuprofeno 600mg',
    preco: 22.00,
    precoPromocional: 18.50,
    descricao: 'Anti-inflamatório',
    categoria: 'Anti-inflamatórios',
    estoque: 25,
    farmaciaId: 3,
    icone: 'medical',
  },
  {
    id: 5,
    nome: 'Omeprazol 20mg',
    preco: 28.90,
    precoPromocional: null,
    descricao: 'Protetor gástrico',
    categoria: 'Digestivos',
    estoque: 40,
    farmaciaId: 2,
    icone: 'fitness',
  },
  {
    id: 6,
    nome: 'Amoxicilina 500mg',
    preco: 32.50,
    precoPromocional: 28.90,
    descricao: 'Antibiótico de amplo espectro',
    categoria: 'Antibióticos',
    estoque: 20,
    farmaciaId: 1,
    icone: 'medical',
  },
  {
    id: 7,
    nome: 'Loratadina 10mg',
    preco: 12.90,
    precoPromocional: null,
    descricao: 'Antialérgico',
    categoria: 'Antialérgicos',
    estoque: 60,
    farmaciaId: 3,
    icone: 'medkit',
  },
  {
    id: 8,
    nome: 'Protetor Solar FPS 50',
    preco: 45.00,
    precoPromocional: 39.90,
    descricao: 'Proteção UVA e UVB',
    categoria: 'Dermocosméticos',
    estoque: 35,
    farmaciaId: 2,
    icone: 'sunny',
  },
];

/**
 * Retorna lista de produtos mock como instâncias da classe Produto
 */
export function obterProdutosMock(): Produto[] {
  return PRODUTOS_MOCK_DATA.map(p => Produto.deAPI(p));
}
