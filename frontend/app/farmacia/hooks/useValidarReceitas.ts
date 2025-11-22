/**
 * Hook: useValidarReceitas
 * Gerencia lógica de validação de receitas (ROLE_FARMACEUTICO)
 * Padrão: OOP + Português
 */

import { useState, useCallback, useEffect } from 'react';
import { Alert, Linking } from 'react-native';
import { router } from 'expo-router';
import {
  listPedidosPendentes,
  aprovarReceita,
  rejeitarReceita,
} from '@/src/servicos/farmacia/farmaceuticoService';
import type { PedidoPendente } from '@/src/servicos/types/api.types';

export function useValidarReceitas() {
  const [carregando, definirCarregando] = useState(true);
  const [atualizando, definirAtualizando] = useState(false);
  const [pedidos, definirPedidos] = useState<PedidoPendente[]>([]);
  const [pedidoSelecionado, definirPedidoSelecionado] = useState<PedidoPendente | null>(null);
  const [mostrarModalRejeitar, definirMostrarModalRejeitar] = useState(false);
  const [justificativa, definirJustificativa] = useState('');
  const [processando, definirProcessando] = useState(false);

  /**
   * Carrega pedidos ao montar
   */
  useEffect(() => {
    carregarPedidos();
  }, []);

  /**
   * Carrega lista de pedidos pendentes
   */
  const carregarPedidos = async () => {
    try {
      definirCarregando(true);
      const resposta = await listPedidosPendentes();
      definirPedidos(resposta.pedidos);
    } catch (erro: any) {
      console.error('[useValidarReceitas] Erro ao carregar pedidos:', erro);
      Alert.alert('Erro', erro.message || 'Não foi possível carregar os pedidos.');
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
      carregarPedidos();
    }, []),

    /**
     * Visualiza receita
     */
    aoVisualizarReceita: useCallback((caminhoArquivo: string) => {
      if (caminhoArquivo.startsWith('http')) {
        Linking.openURL(caminhoArquivo);
      } else {
        Alert.alert('Visualizar Receita', `Caminho: ${caminhoArquivo}`);
      }
    }, []),

    /**
     * Aprova receita
     */
    aoAprovar: useCallback((pedido: PedidoPendente) => {
      Alert.alert(
        'Aprovar Receita',
        `Tem certeza que deseja aprovar a receita do pedido #${pedido.numero}?`,
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Aprovar',
            onPress: async () => {
              try {
                definirProcessando(true);
                await aprovarReceita(pedido.id);
                Alert.alert('Sucesso', 'Receita aprovada com sucesso!');
                carregarPedidos();
              } catch (erro: any) {
                console.error('[useValidarReceitas] Erro ao aprovar:', erro);
                Alert.alert('Erro', erro.message || 'Não foi possível aprovar a receita.');
              } finally {
                definirProcessando(false);
              }
            },
          },
        ]
      );
    }, []),

    /**
     * Abre modal para rejeitar receita
     */
    aoIniciarRejeitar: useCallback((pedido: PedidoPendente) => {
      definirPedidoSelecionado(pedido);
      definirJustificativa('');
      definirMostrarModalRejeitar(true);
    }, []),

    /**
     * Fecha modal de rejeição
     */
    aoFecharModalRejeitar: useCallback(() => {
      definirMostrarModalRejeitar(false);
      definirPedidoSelecionado(null);
      definirJustificativa('');
    }, []),

    /**
     * Altera justificativa
     */
    aoAlterarJustificativa: useCallback((texto: string) => {
      definirJustificativa(texto);
    }, []),

    /**
     * Confirma rejeição com justificativa
     */
    aoConfirmarRejeitar: useCallback(async () => {
      if (!justificativa.trim()) {
        Alert.alert('Atenção', 'Por favor, informe a justificativa para a rejeição.');
        return;
      }

      if (!pedidoSelecionado) return;

      try {
        definirProcessando(true);
        await rejeitarReceita(pedidoSelecionado.id, { justificativa: justificativa.trim() });
        Alert.alert('Sucesso', 'Receita rejeitada com sucesso!');
        definirMostrarModalRejeitar(false);
        definirPedidoSelecionado(null);
        definirJustificativa('');
        carregarPedidos();
      } catch (erro: any) {
        console.error('[useValidarReceitas] Erro ao rejeitar:', erro);
        Alert.alert('Erro', erro.message || 'Não foi possível rejeitar a receita.');
      } finally {
        definirProcessando(false);
      }
    }, [justificativa, pedidoSelecionado]),

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
    pedidos,
    pedidoSelecionado,
    mostrarModalRejeitar,
    justificativa,
    processando,

    // Manipuladores
    manipuladores,
  };
}
