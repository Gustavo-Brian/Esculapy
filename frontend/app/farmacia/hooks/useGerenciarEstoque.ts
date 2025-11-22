/**
 * Hook: useGerenciarEstoque
 * Gerencia lógica de gerenciamento de estoque (ROLE_LOJISTA_ADMIN)
 * Padrão: OOP + Português
 */

import { useState, useCallback, useEffect } from 'react';
import { Alert } from 'react-native';
import { router } from 'expo-router';
import { useToast } from '@/src/hooks/useToast';
import {
  listEstoque,
  updateEstoque,
  deleteEstoque,
} from '@/src/servicos/farmacia/farmaciaAdminService';
import type { EstoqueItem } from '@/src/servicos/types/api.types';

export function useGerenciarEstoque() {
  const { toastState, showSuccess, showError, showWarning, hideToast } = useToast();
  const [carregando, definirCarregando] = useState(true);
  const [atualizando, definirAtualizando] = useState(false);
  const [estoque, definirEstoque] = useState<EstoqueItem[]>([]);
  const [editandoId, definirEditandoId] = useState<number | null>(null);
  const [editandoPreco, definirEditandoPreco] = useState('');
  const [editandoQuantidade, definirEditandoQuantidade] = useState('');

  /**
   * Carrega estoque ao montar
   */
  useEffect(() => {
    carregarEstoque();
  }, []);

  /**
   * Carrega lista de estoque
   */
  const carregarEstoque = async () => {
    try {
      definirCarregando(true);
      const resposta = await listEstoque();
      definirEstoque(resposta.items);
    } catch (erro: any) {
      console.error('[useGerenciarEstoque] Erro ao carregar estoque:', erro);
      showError(erro.message || 'Não foi possível carregar o estoque.');
    } finally {
      definirCarregando(false);
      definirAtualizando(false);
    }
  };

  /**
   * Manipuladores agrupados
   */
  const manipuladores = {
    /**
     * Atualiza lista (pull to refresh)
     */
    aoAtualizar: useCallback(() => {
      definirAtualizando(true);
      carregarEstoque();
    }, []),

    /**
     * Alterna status ativo/inativo do produto
     */
    aoAlternarAtivo: useCallback((item: EstoqueItem) => {
      const novoStatus = !item.ativo;
      const acao = novoStatus ? 'ativar' : 'desativar';

      Alert.alert(
        `${novoStatus ? 'Ativar' : 'Desativar'} Produto`,
        `Tem certeza que deseja ${acao} "${item.produtoNome}"?${novoStatus ? '' : '\n\nO produto não ficará visível para os clientes.'}`,
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: novoStatus ? 'Ativar' : 'Desativar',
            onPress: async () => {
              try {
                await updateEstoque(item.id, { ativo: novoStatus });
                showSuccess(`Produto ${novoStatus ? 'ativado' : 'desativado'} com sucesso!`);
                carregarEstoque();
              } catch (erro: any) {
                console.error('[useGerenciarEstoque] Erro ao alterar status:', erro);
                showError(erro.message || 'Não foi possível alterar o status do produto.');
              }
            },
          },
        ]
      );
    }, [showSuccess, showError]),

    /**
     * Inicia edição de item
     */
    aoIniciarEdicao: useCallback((item: EstoqueItem) => {
      definirEditandoId(item.id);
      definirEditandoPreco(item.preco.toString());
      definirEditandoQuantidade(item.quantidade.toString());
    }, []),

    /**
     * Cancela edição
     */
    aoCancelarEdicao: useCallback(() => {
      definirEditandoId(null);
      definirEditandoPreco('');
      definirEditandoQuantidade('');
    }, []),

    /**
     * Altera preço em edição
     */
    aoAlterarPreco: useCallback((valor: string) => {
      definirEditandoPreco(valor);
    }, []),

    /**
     * Altera quantidade em edição
     */
    aoAlterarQuantidade: useCallback((valor: string) => {
      definirEditandoQuantidade(valor);
    }, []),

    /**
     * Salva edição de item
     */
    aoSalvarEdicao: useCallback(async (id: number) => {
      if (!editandoPreco || !editandoQuantidade) {
        showError('Preencha todos os campos');
        return;
      }

      const preco = Number(editandoPreco);
      const quantidade = Number(editandoQuantidade);

      if (isNaN(preco) || preco <= 0) {
        showError('Preço inválido');
        return;
      }

      if (isNaN(quantidade) || quantidade < 0) {
        showError('Quantidade inválida');
        return;
      }

      try {
        await updateEstoque(id, { preco, quantidade });
        showSuccess('Item atualizado com sucesso!');
        definirEditandoId(null);
        definirEditandoPreco('');
        definirEditandoQuantidade('');
        carregarEstoque();
      } catch (erro: any) {
        console.error('[useGerenciarEstoque] Erro ao atualizar:', erro);
        showError(erro.message || 'Não foi possível atualizar o item.');
      }
    }, [editandoPreco, editandoQuantidade, showSuccess, showError]),

    /**
     * Deleta item do estoque
     */
    aoDeletar: useCallback((id: number, nome: string) => {
      Alert.alert(
        'Confirmar Exclusão',
        `Tem certeza que deseja remover "${nome}" do estoque?`,
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Remover',
            style: 'destructive',
            onPress: async () => {
              try {
                await deleteEstoque(id);
                showSuccess('Item removido do estoque!');
                carregarEstoque();
              } catch (erro: any) {
                console.error('[useGerenciarEstoque] Erro ao deletar:', erro);
                showError(erro.message || 'Não foi possível remover o item.');
              }
            },
          },
        ]
      );
    }, [showSuccess, showError]),

    /**
     * Navega para adicionar produto
     */
    aoAdicionarProduto: useCallback(() => {
      router.push('/farmacia/estoque/adicionar');
    }, []),

    /**
     * Volta para tela anterior
     */
    aoVoltar: useCallback(() => {
      router.back();
    }, []),
  };

  return {
    // Estados
    carregando,
    atualizando,
    estoque,
    editandoId,
    editandoPreco,
    editandoQuantidade,

    // Toast
    toastState,
    hideToast,

    // Manipuladores
    manipuladores,
  };
}
