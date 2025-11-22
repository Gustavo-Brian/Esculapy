/**
 * Hook: useRelatorios
 * Gerencia lógica de relatórios da farmácia (ROLE_LOJISTA_ADMIN)
 * Padrão: OOP + Português
 */

import { useState, useCallback, useEffect } from 'react';
import { Alert } from 'react-native';
import { router } from 'expo-router';
import { buscarEstoqueProprio, calcularEstatisticasEstoque } from '@/src/servicos/estoque/estoqueService';
import type { EstoqueResponse, EstoqueStats } from '@/src/servicos/types/api.types';

interface ProdutoMaisVendido {
  nome: string;
  quantidade: number;
  valor: number;
}

interface RelatorioFinanceiro {
  receitaTotal: number;
  custoEstoque: number;
  margemLucro: number;
  ticketMedio: number;
}

export function useRelatorios() {
  const [carregando, definirCarregando] = useState(true);
  const [atualizando, definirAtualizando] = useState(false);
  const [periodoSelecionado, definirPeriodoSelecionado] = useState<'7d' | '30d' | '90d'>('30d');
  const [estatisticasEstoque, definirEstatisticasEstoque] = useState<EstoqueStats | null>(null);
  const [produtos, definirProdutos] = useState<EstoqueResponse[]>([]);
  const [produtosMaisVendidos, definirProdutosMaisVendidos] = useState<ProdutoMaisVendido[]>([]);
  const [financeiro, definirFinanceiro] = useState<RelatorioFinanceiro | null>(null);

  /**
   * Carrega relatórios ao montar ou quando período muda
   */
  useEffect(() => {
    carregarRelatorios();
  }, [periodoSelecionado]);

  /**
   * Carrega dados dos relatórios
   */
  const carregarRelatorios = async () => {
    try {
      definirCarregando(true);

      // Carrega estatísticas do estoque
      const [stats, estoque] = await Promise.all([
        calcularEstatisticasEstoque(),
        buscarEstoqueProprio(''),
      ]);

      definirEstatisticasEstoque(stats);
      definirProdutos(estoque);

      // Simula produtos mais vendidos
      const maisVendidos = estoque
        .sort((a, b) => a.quantidade - b.quantidade)
        .slice(0, 5)
        .map(p => ({
          nome: p.produtoNome,
          quantidade: Math.floor(Math.random() * 100) + 50,
          valor: p.preco * (Math.floor(Math.random() * 100) + 50),
        }));
      definirProdutosMaisVendidos(maisVendidos);

      // Simula dados financeiros
      const receitaTotal = stats.valorTotal * 1.5;
      const custoEstoque = stats.valorTotal;
      const margemLucro = ((receitaTotal - custoEstoque) / receitaTotal) * 100;
      const ticketMedio = receitaTotal / Math.max(1, stats.produtosAtivos);

      definirFinanceiro({
        receitaTotal,
        custoEstoque,
        margemLucro,
        ticketMedio,
      });
    } catch (erro: any) {
      console.error('[useRelatorios] Erro ao carregar relatórios:', erro);
      Alert.alert('Erro', erro.message || 'Não foi possível carregar os relatórios.');
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
     * Atualiza relatórios
     */
    aoAtualizar: useCallback(() => {
      definirAtualizando(true);
      carregarRelatorios();
    }, []),

    /**
     * Altera período selecionado
     */
    aoAlterarPeriodo: useCallback((periodo: '7d' | '30d' | '90d') => {
      definirPeriodoSelecionado(periodo);
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
    periodoSelecionado,
    estatisticasEstoque,
    produtos,
    produtosMaisVendidos,
    financeiro,

    // Manipuladores
    manipuladores,
  };
}
