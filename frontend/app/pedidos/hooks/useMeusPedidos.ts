/**
 * Hook: useMeusPedidos
 * Gerencia a lista de pedidos do cliente autenticado
 * Padrão: OOP + Português
 */

import { useState, useCallback, useEffect } from 'react';
import { Alert } from 'react-native';
import { router } from 'expo-router';
import { getMeusPedidos } from '@/src/servicos/pedidos/pedidoService';
import type { Pedido } from '@/src/servicos/types/api.types';

export function useMeusPedidos() {
  const [carregando, definirCarregando] = useState(true);
  const [atualizando, definirAtualizando] = useState(false);
  const [pedidos, definirPedidos] = useState<Pedido[]>([]);

  /**
   * Carrega lista de pedidos
   */
  const carregarPedidos = async () => {
    try {
      console.log('[useMeusPedidos] Carregando pedidos...');
      definirCarregando(true);

      const resposta = await getMeusPedidos();
      definirPedidos(resposta.pedidos);

      console.log('[useMeusPedidos] Pedidos carregados:', {
        total: resposta.total,
        pedidos: resposta.pedidos.length,
      });
    } catch (erro: any) {
      console.error('[useMeusPedidos] Erro ao carregar pedidos:', erro);
      Alert.alert(
        'Erro',
        erro.message || 'Não foi possível carregar seus pedidos. Tente novamente.'
      );
    } finally {
      definirCarregando(false);
      definirAtualizando(false);
    }
  };

  /**
   * Carrega pedidos ao montar componente
   */
  useEffect(() => {
    carregarPedidos();
  }, []);

  /**
   * Manipuladores
   */
  const manipuladores = {
    /**
     * Voltar para tela anterior
     */
    aoVoltar: useCallback(() => {
      router.back();
    }, []),

    /**
     * Atualizar lista (pull to refresh)
     */
    aoAtualizar: useCallback(() => {
      definirAtualizando(true);
      carregarPedidos();
    }, []),

    /**
     * Ver detalhes de um pedido
     */
    aoVerDetalhes: useCallback((pedidoId: number) => {
      console.log('[useMeusPedidos] Navegando para detalhes do pedido:', pedidoId);
      router.push(`/pedidos/${pedidoId}`);
    }, []),

    /**
     * Enviar receita para um pedido
     */
    aoEnviarReceita: useCallback((pedidoId: number) => {
      console.log('[useMeusPedidos] Navegando para envio de receita:', pedidoId);
      router.push(`/pedidos/${pedidoId}/receita`);
    }, []),

    /**
     * Ir para home para começar a comprar
     */
    aoIniciarCompras: useCallback(() => {
      router.push('/');
    }, []),
  };

  return {
    // Estados
    carregando,
    atualizando,
    pedidos,

    // Manipuladores
    manipuladores,
  };
}
