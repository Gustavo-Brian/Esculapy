/**
 * Hook OOP: useDadosRastreamento
 * Conecta o ServicoRastreamento ao React
 */

import { useState, useEffect, useMemo, useCallback } from 'react';
import { ServicoRastreamento } from '../servicos/ServicoRastreamento';
import { PedidoEntrega, StatusEntrega } from '../tipos/PedidoEntrega';

export function useDadosRastreamento() {
  const [servico] = useState(() => new ServicoRastreamento());
  const [pedidos, definirPedidos] = useState<PedidoEntrega[]>([]);
  const [carregando, definirCarregando] = useState(true);
  const [erro, definirErro] = useState<string | null>(null);
  const [filtroStatus, definirFiltroStatus] = useState<StatusEntrega | 'todos'>('todos');

  /**
   * Carrega pedidos na montagem
   */
  useEffect(() => {
    carregarPedidos();
  }, []);

  /**
   * Carrega pedidos do serviço
   */
  const carregarPedidos = useCallback(async () => {
    try {
      definirCarregando(true);
      definirErro(null);
      const pedidosCarregados = await servico.carregarPedidos();
      definirPedidos(pedidosCarregados);
    } catch (erro: any) {
      definirErro(erro.message);
      console.error('[useDadosRastreamento] Erro ao carregar:', erro);
    } finally {
      definirCarregando(false);
    }
  }, [servico]);

  /**
   * Pedidos filtrados por status
   */
  const pedidosFiltrados = useMemo(() => {
    if (filtroStatus === 'todos') {
      return servico.ordenarPorDataRecente();
    }
    return servico.filtrarPorStatus(filtroStatus);
  }, [pedidos, filtroStatus, servico]);

  /**
   * Pedidos em andamento
   */
  const pedidosEmAndamento = useMemo(() => {
    return servico.obterPedidosEmAndamento();
  }, [pedidos, servico]);

  /**
   * Pedidos entregues
   */
  const pedidosEntregues = useMemo(() => {
    return servico.obterPedidosEntregues();
  }, [pedidos, servico]);

  /**
   * Estatísticas
   */
  const estatisticas = useMemo(() => {
    return servico.obterEstatisticas();
  }, [pedidos, servico]);

  /**
   * Manipuladores
   */
  const manipuladores = useMemo(() => ({
    aoSelecionarFiltro: (status: StatusEntrega | 'todos') => {
      definirFiltroStatus(status);
    },
    aoVisualizarPedido: (pedidoId: number) => {
      const pedido = servico.obterPedidoPorId(pedidoId);
      if (pedido) {
        console.log('[useDadosRastreamento] Visualizando pedido:', pedido.numero);
        // TODO: Navegar para tela de detalhes do pedido
      }
    },
    aoRecarregar: carregarPedidos,
  }), [servico, carregarPedidos]);

  return {
    // Dados
    pedidos: pedidosFiltrados,
    pedidosEmAndamento,
    pedidosEntregues,
    estatisticas,

    // Estado
    carregando,
    erro,
    filtroStatus,

    // Verificações
    temPedidos: servico.temPedidos,
    temPedidosEmAndamento: pedidosEmAndamento.length > 0,
    temErro: erro !== null,

    // Manipuladores
    manipuladores,
  };
}
