/**
 * Componente de Cartões de Estatísticas Aprimorados
 * Cards com visual melhorado e animações
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { temaMedico } from '@/src/estilos/temaMedico';
import type { EstoqueStats } from '@/src/servicos/types/api.types';

interface CartoesEstatisticasProps {
  stats: EstoqueStats | null;
}

export const CartoesEstatisticas: React.FC<CartoesEstatisticasProps> = ({ stats }) => {
  if (!stats) {
    return null;
  }

  const formatarMoeda = (valor: number): string => {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const cards = [
    {
      id: 'total',
      titulo: 'Total de Produtos',
      valor: stats.totalProdutos.toString(),
      icone: 'cube' as const,
      cor: temaMedico.cores.primaria,
      corFundo: `${temaMedico.cores.primaria}15`,
      subtitulo: `${stats.totalItens} itens em estoque`,
    },
    {
      id: 'valor',
      titulo: 'Valor do Estoque',
      valor: formatarMoeda(stats.valorTotal),
      icone: 'cash' as const,
      cor: '#10B981',
      corFundo: '#10B98115',
      subtitulo: 'Valor total inventariado',
    },
    {
      id: 'baixo',
      titulo: 'Estoque Baixo',
      valor: stats.produtosBaixoEstoque.toString(),
      icone: 'alert-circle' as const,
      cor: temaMedico.cores.alerta,
      corFundo: `${temaMedico.cores.alerta}15`,
      subtitulo: 'Produtos com < 10 unid.',
      badge: stats.produtosBaixoEstoque > 0,
    },
    {
      id: 'esgotado',
      titulo: 'Esgotados',
      valor: stats.produtosEsgotados.toString(),
      icone: 'close-circle' as const,
      cor: temaMedico.cores.erro,
      corFundo: `${temaMedico.cores.erro}15`,
      subtitulo: 'Produtos sem estoque',
      badge: stats.produtosEsgotados > 0,
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {cards.map((card) => (
          <View key={card.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={[styles.iconeContainer, { backgroundColor: card.corFundo }]}>
                <Ionicons name={card.icone} size={28} color={card.cor} />
              </View>
              {card.badge && (
                <View style={[styles.badge, { backgroundColor: card.cor }]}>
                  <Text style={styles.badgeText}>!</Text>
                </View>
              )}
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitulo}>{card.titulo}</Text>
              <Text style={[styles.cardValor, { color: card.cor }]}>{card.valor}</Text>
              <Text style={styles.cardSubtitulo}>{card.subtitulo}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  card: {
    width: '48%', // 2 colunas
    backgroundColor: temaMedico.cores.backgroundCard,
    borderRadius: 16,
    padding: 16,
    minHeight: 140,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  iconeContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFF',
  },
  cardContent: {
    gap: 4,
  },
  cardTitulo: {
    fontSize: 13,
    fontWeight: '600',
    color: temaMedico.cores.textoSubtitulo,
  },
  cardValor: {
    fontSize: 24,
    fontWeight: '700',
    marginVertical: 4,
  },
  cardSubtitulo: {
    fontSize: 11,
    color: temaMedico.cores.textoClaro,
  },
});
