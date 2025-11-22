/**
 * Utilitários para calcular estatísticas de vendas a partir dos pedidos
 */

import type { Pedido } from '@/src/servicos/types/api.types';
import type { EstatisticasVendas, DadoVendaDiaria } from '../tipos/vendas.types';

/**
 * Calcula estatísticas de vendas dos últimos 7 dias baseado nos pedidos
 */
export const calcularEstatisticasVendas = (pedidos: Pedido[]): EstatisticasVendas => {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  // Inicializa array com últimos 7 dias
  const vendas7Dias: DadoVendaDiaria[] = [];
  for (let i = 6; i >= 0; i--) {
    const data = new Date(hoje);
    data.setDate(data.getDate() - i);
    const diaSemana = data.toLocaleDateString('pt-BR', { weekday: 'short' });

    vendas7Dias.push({
      dia: diaSemana.charAt(0).toUpperCase() + diaSemana.slice(1, 3),
      valor: 0,
      quantidade: 0,
    });
  }

  // Filtra pedidos dos últimos 7 dias (apenas status válidos para vendas)
  const statusVendas = ['CONFIRMADO', 'EM_PREPARACAO', 'PRONTO_PARA_ENTREGA', 'EM_TRANSPORTE', 'ENTREGUE'];
  const pedidosUltimos7Dias = pedidos.filter((pedido) => {
    if (!statusVendas.includes(pedido.status)) return false;

    const dataPedido = new Date(pedido.createdAt);
    const diffDias = Math.floor((hoje.getTime() - dataPedido.getTime()) / (1000 * 60 * 60 * 24));
    return diffDias >= 0 && diffDias < 7;
  });

  // Agrupa vendas por dia
  pedidosUltimos7Dias.forEach((pedido) => {
    const dataPedido = new Date(pedido.createdAt);
    const diffDias = Math.floor((hoje.getTime() - dataPedido.getTime()) / (1000 * 60 * 60 * 24));
    const index = 6 - diffDias; // Índice no array (0 = 6 dias atrás, 6 = hoje)

    if (index >= 0 && index < 7) {
      vendas7Dias[index].valor += pedido.total || 0;
      vendas7Dias[index].quantidade += 1;
    }
  });

  // Calcula totais da semana atual
  const totalSemana = vendas7Dias.reduce((sum, dia) => sum + dia.valor, 0);
  const totalPedidos = vendas7Dias.reduce((sum, dia) => sum + dia.quantidade, 0);
  const maiorVenda = Math.max(...vendas7Dias.map((d) => d.valor));

  // Calcula variação em relação à semana anterior
  const variacao = calcularVariacaoSemanal(pedidos, statusVendas);

  return {
    vendas7Dias,
    totalSemana,
    variacao,
    maiorVenda,
    totalPedidos,
  };
};

/**
 * Calcula a variação percentual de vendas em relação à semana anterior
 */
const calcularVariacaoSemanal = (
  pedidos: Pedido[],
  statusVendas: string[]
): number => {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  // Calcula total da semana atual (últimos 7 dias)
  const totalSemanaAtual = pedidos
    .filter((p) => {
      if (!statusVendas.includes(p.status)) return false;
      const dataPedido = new Date(p.createdAt);
      const diffDias = Math.floor((hoje.getTime() - dataPedido.getTime()) / (1000 * 60 * 60 * 24));
      return diffDias >= 0 && diffDias < 7;
    })
    .reduce((sum, p) => sum + (p.total || 0), 0);

  // Calcula total da semana anterior (7 a 14 dias atrás)
  const totalSemanaAnterior = pedidos
    .filter((p) => {
      if (!statusVendas.includes(p.status)) return false;
      const dataPedido = new Date(p.createdAt);
      const diffDias = Math.floor((hoje.getTime() - dataPedido.getTime()) / (1000 * 60 * 60 * 24));
      return diffDias >= 7 && diffDias < 14;
    })
    .reduce((sum, p) => sum + (p.total || 0), 0);

  // Calcula variação percentual
  if (totalSemanaAnterior === 0) {
    return totalSemanaAtual > 0 ? 100 : 0; // Se não tinha vendas antes e agora tem, é 100% de crescimento
  }

  const variacao = ((totalSemanaAtual - totalSemanaAnterior) / totalSemanaAnterior) * 100;
  return Number(variacao.toFixed(1));
};

/**
 * Calcula resumo de vendas por período
 */
export const calcularResumoVendas = (pedidos: Pedido[]) => {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  const statusVendas = ['CONFIRMADO', 'EM_PREPARACAO', 'PRONTO_PARA_ENTREGA', 'EM_TRANSPORTE', 'ENTREGUE'];

  // Vendas de hoje
  const vendasHoje = pedidos
    .filter((p) => {
      if (!statusVendas.includes(p.status)) return false;
      const dataPedido = new Date(p.createdAt);
      dataPedido.setHours(0, 0, 0, 0);
      return dataPedido.getTime() === hoje.getTime();
    })
    .reduce((sum, p) => sum + (p.total || 0), 0);

  // Vendas da semana (últimos 7 dias)
  const vendasSemana = pedidos
    .filter((p) => {
      if (!statusVendas.includes(p.status)) return false;
      const dataPedido = new Date(p.createdAt);
      const diffDias = Math.floor((hoje.getTime() - dataPedido.getTime()) / (1000 * 60 * 60 * 24));
      return diffDias >= 0 && diffDias < 7;
    })
    .reduce((sum, p) => sum + (p.total || 0), 0);

  // Vendas do mês (últimos 30 dias)
  const vendasMes = pedidos
    .filter((p) => {
      if (!statusVendas.includes(p.status)) return false;
      const dataPedido = new Date(p.createdAt);
      const diffDias = Math.floor((hoje.getTime() - dataPedido.getTime()) / (1000 * 60 * 60 * 24));
      return diffDias >= 0 && diffDias < 30;
    })
    .reduce((sum, p) => sum + (p.total || 0), 0);

  // Total de pedidos no mês
  const totalPedidosMes = pedidos.filter((p) => {
    if (!statusVendas.includes(p.status)) return false;
    const dataPedido = new Date(p.createdAt);
    const diffDias = Math.floor((hoje.getTime() - dataPedido.getTime()) / (1000 * 60 * 60 * 24));
    return diffDias >= 0 && diffDias < 30;
  }).length;

  return {
    hoje: vendasHoje,
    semana: vendasSemana,
    mes: vendasMes,
    totalPedidos: totalPedidosMes,
  };
};

/**
 * Gera alertas de pedidos que precisam de atenção
 */
export const gerarAlertasPedidos = (pedidos: Pedido[]) => {
  const alertas: Array<{
    tipo: 'aguardando_pagamento' | 'aguardando_receita' | 'em_preparacao' | 'pronto_para_entrega' | 'em_transporte';
    quantidade: number;
    mensagem: string;
  }> = [];

  // Pedidos aguardando receita
  const aguardandoReceita = pedidos.filter((p) => p.status === 'AGUARDANDO_RECEITA');
  if (aguardandoReceita.length > 0) {
    alertas.push({
      tipo: 'aguardando_receita',
      quantidade: aguardandoReceita.length,
      mensagem: `${aguardandoReceita.length} ${
        aguardandoReceita.length === 1 ? 'pedido aguardando' : 'pedidos aguardando'
      } receita médica`,
    });
  }

  // Pedidos em preparação
  const emPreparacao = pedidos.filter((p) => p.status === 'EM_PREPARACAO');
  if (emPreparacao.length > 0) {
    alertas.push({
      tipo: 'em_preparacao',
      quantidade: emPreparacao.length,
      mensagem: `${emPreparacao.length} ${
        emPreparacao.length === 1 ? 'pedido em' : 'pedidos em'
      } preparação`,
    });
  }

  return alertas;
};
