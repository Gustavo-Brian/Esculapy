/**
 * Hook useDadosProduto
 * Conecta o ServicoProduto (OOP) com React
 */

import { useState, useEffect, useCallback } from 'react';
import { useLocalSearchParams, router } from 'expo-router';
import { ServicoProduto } from '../servicos/ServicoProduto';
import { useToast } from '@/src/hooks/useToast';

export const useDadosProduto = () => {
  // ID do produto da URL
  const { id } = useLocalSearchParams<{ id: string }>();

  // Instância única do serviço
  const [servico] = useState(() => new ServicoProduto());

  // Estados reativos
  const [atualizando, setAtualizando] = useState(false);
  const { showSuccess, showError } = useToast();

  /**
   * Carrega o produto ao montar
   */
  useEffect(() => {
    if (id) {
      servico.carregarProduto(Number(id)).catch((erro) => {
        showError('Erro ao carregar produto');
      });
      setAtualizando(!atualizando); // Força re-render
    }
  }, [id]);

  /**
   * Manipuladores
   */
  const manipuladores = {
    /**
     * Voltar
     */
    aoVoltar: useCallback(() => {
      router.back();
    }, []),

    /**
     * Incrementar quantidade
     */
    aoIncrementarQuantidade: useCallback(() => {
      servico.incrementarQuantidade();
      setAtualizando(!atualizando);
    }, [servico, atualizando]),

    /**
     * Decrementar quantidade
     */
    aoDecrementarQuantidade: useCallback(() => {
      servico.decrementarQuantidade();
      setAtualizando(!atualizando);
    }, [servico, atualizando]),

    /**
     * Alternar favorito
     */
    aoAlternarFavorito: useCallback(() => {
      servico.alternarFavorito();
      setAtualizando(!atualizando);

      const mensagem = servico.favorito
        ? 'Adicionado aos favoritos'
        : 'Removido dos favoritos';
      showSuccess(mensagem);
    }, [servico, atualizando, showSuccess]),

    /**
     * Compartilhar
     */
    aoCompartilhar: useCallback(() => {
      console.log('Compartilhar produto:', servico.produto?.nome);
      showSuccess('Link copiado!');
    }, [servico, showSuccess]),

    /**
     * Ver farmácia
     */
    aoClicarFarmacia: useCallback(() => {
      if (servico.produto) {
        router.push(`/seller/${servico.produto.farmaciaId}`);
      }
    }, [servico]),

    /**
     * Comparar produto
     */
    aoComparar: useCallback(() => {
      console.log('Comparar produto:', servico.produto?.nome);
      router.push('/compare');
    }, [servico]),

    /**
     * Adicionar ao carrinho
     */
    aoAdicionarCarrinho: useCallback(() => {
      if (!servico.podeAdicionarAoCarrinho()) {
        showError('Produto indisponível');
        return;
      }

      console.log('Adicionar ao carrinho:', {
        produto: servico.produto?.nome,
        quantidade: servico.quantidade,
        precoTotal: servico.formatarPrecoTotal(),
      });

      showSuccess(`${servico.quantidade}x ${servico.produto?.nome} adicionado ao carrinho`);

      // Opcional: Navegar para o carrinho
      // router.push('/cart');
    }, [servico, showSuccess, showError]),
  };

  return {
    // Dados
    produto: servico.produto,
    quantidade: servico.quantidade,
    favorito: servico.favorito,
    carregando: servico.carregando,
    erro: servico.erro,
    precoTotal: servico.formatarPrecoTotal(),

    // Manipuladores
    manipuladores,
  };
};
