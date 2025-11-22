/**
 * Hook useCart - Global
 * Hook simplificado para gerenciar carrinho globalmente
 */

import { useState, useCallback, useEffect } from 'react';
import { ServicoCarrinho } from '@/app/cart/servicos/ServicoCarrinho';
import { ItemCarrinho } from '@/app/cart/tipos/ItemCarrinho';
import type { EstoqueResponse } from '../servicos/types/api.types';

// Instância singleton do serviço
let servicoCarrinhoGlobal: ServicoCarrinho | null = null;

const getServicoCarrinho = () => {
  if (!servicoCarrinhoGlobal) {
    servicoCarrinhoGlobal = new ServicoCarrinho();
  }
  return servicoCarrinhoGlobal;
};

export const useCart = () => {
  const [servico] = useState(() => getServicoCarrinho());
  const [quantidadeItens, setQuantidadeItens] = useState(0);
  const [carregado, setCarregado] = useState(false);

  /**
   * Carrega quantidade de itens do carrinho
   */
  const carregarQuantidade = useCallback(async () => {
    if (!carregado) {
      await servico.carregarCarrinho();
      setCarregado(true);
    }
    setQuantidadeItens(servico.quantidadeTotal);
  }, [servico, carregado]);

  useEffect(() => {
    carregarQuantidade();
  }, [carregarQuantidade]);

  /**
   * Adiciona um produto ao carrinho a partir de EstoqueResponse
   * @param estoque Dados do estoque
   * @param quantidade Quantidade a adicionar (opcional, padrão: 1)
   */
  const adicionarAoCarrinho = useCallback(async (estoque: EstoqueResponse, quantidade: number = 1): Promise<boolean> => {
    try {
      const item = ItemCarrinho.criarDeEstoque(estoque);
      // Define a quantidade desejada usando o método público
      item.definirQuantidade(quantidade);
      await servico.adicionarItem(item);
      setQuantidadeItens(servico.quantidadeTotal);
      return true;
    } catch (error) {
      console.error('[useCart] Erro ao adicionar ao carrinho:', error);
      return false;
    }
  }, [servico]);

  /**
   * Remove um item do carrinho
   */
  const removerDoCarrinho = useCallback(async (itemId: number): Promise<void> => {
    await servico.removerItem(itemId);
    setQuantidadeItens(servico.quantidadeTotal);
  }, [servico]);

  /**
   * Limpa o carrinho
   */
  const limparCarrinho = useCallback(async (): Promise<void> => {
    await servico.limpar();
    setQuantidadeItens(0);
  }, [servico]);

  /**
   * Verifica se um produto está no carrinho (por estoqueId)
   */
  const estaNoCarrinho = useCallback((estoqueId: number): boolean => {
    return servico.itens.some(item => item.estoqueId === estoqueId);
  }, [servico]);

  /**
   * Obtém a quantidade de um produto no carrinho (por estoqueId)
   */
  const obterQuantidade = useCallback((estoqueId: number): number => {
    const item = servico.itens.find(i => i.estoqueId === estoqueId);
    return item ? item.quantidade : 0;
  }, [servico]);

  return {
    quantidadeItens,
    adicionarAoCarrinho,
    removerDoCarrinho,
    limparCarrinho,
    estaNoCarrinho,
    obterQuantidade,
    servico, // Expor serviço para casos avançados
  };
};
