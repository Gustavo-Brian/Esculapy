/**
 * Componente de Gráfico de Vendas
 * Exibe gráfico de barras com vendas dos últimos 7 dias
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { temaMedico } from '@/src/estilos/temaMedico';
import type { EstatisticasVendas } from '../tipos/vendas.types';

interface GraficoVendasProps {
  vendas: EstatisticasVendas | null;
}

export const GraficoVendas: React.FC<GraficoVendasProps> = ({ vendas }) => {
  if (!vendas) {
    return null;
  }

  const { vendas7Dias, totalSemana, variacao, totalPedidos } = vendas;
  const valorMaximo = Math.max(...vendas7Dias.map((d) => d.valor));

  const formatarMoeda = (valor: number): string => {
    return `R$ ${valor.toFixed(2).replace('.', ',')}`;
  };

  const formatarVariacao = (valor: number): string => {
    const sinal = valor >= 0 ? '+' : '';
    return `${sinal}${valor.toFixed(1)}%`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.titulo}>Vendas dos Últimos 7 Dias</Text>
          <Text style={styles.totalPedidos}>{totalPedidos} pedidos</Text>
        </View>
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValor}>{formatarMoeda(totalSemana)}</Text>
          <View style={[styles.variacaoBadge, variacao >= 0 ? styles.variacaoPositiva : styles.variacaoNegativa]}>
            <Ionicons
              name={variacao >= 0 ? 'trending-up' : 'trending-down'}
              size={14}
              color="#FFF"
            />
            <Text style={styles.variacaoTexto}>{formatarVariacao(variacao)}</Text>
          </View>
        </View>
      </View>

      <View style={styles.graficoContainer}>
        {vendas7Dias.map((dia, index) => {
          const alturaBarra = (dia.valor / valorMaximo) * 100;

          return (
            <View key={index} style={styles.barraContainer}>
              <View style={styles.barraWrapper}>
                <View style={[styles.barra, { height: `${alturaBarra}%` }]}>
                  <Text style={styles.barraValor}>{formatarMoeda(dia.valor)}</Text>
                </View>
              </View>
              <Text style={styles.diaLabel}>{dia.dia}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: temaMedico.cores.backgroundCard,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  titulo: {
    fontSize: 18,
    fontWeight: '700',
    color: temaMedico.cores.textoTitulo,
    marginBottom: 4,
  },
  totalPedidos: {
    fontSize: 13,
    color: temaMedico.cores.textoSubtitulo,
  },
  totalContainer: {
    alignItems: 'flex-end',
  },
  totalLabel: {
    fontSize: 12,
    color: temaMedico.cores.textoSubtitulo,
    marginBottom: 2,
  },
  totalValor: {
    fontSize: 20,
    fontWeight: '700',
    color: temaMedico.cores.textoTitulo,
    marginBottom: 6,
  },
  variacaoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  variacaoPositiva: {
    backgroundColor: temaMedico.cores.sucesso,
  },
  variacaoNegativa: {
    backgroundColor: temaMedico.cores.erro,
  },
  variacaoTexto: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFF',
  },
  graficoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 180,
    gap: 8,
  },
  barraContainer: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
  },
  barraWrapper: {
    flex: 1,
    width: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  barra: {
    width: '100%',
    backgroundColor: temaMedico.cores.primaria,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    minHeight: 20,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 6,
  },
  barraValor: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFF',
    transform: [{ rotate: '-90deg' }],
    width: 60,
    textAlign: 'center',
  },
  diaLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: temaMedico.cores.textoSubtitulo,
  },
});
