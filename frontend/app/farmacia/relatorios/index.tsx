/**
 * Tela: Relatórios - Esculapi
 * Relatórios completos da farmácia (ROLE_LOJISTA_ADMIN)
 * Arquitetura: OOP + Português
 */

import {
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Text, View } from '@/src/componentes/Themed';
import { ProtectedFarmaciaRoute } from '@/src/componentes/ProtectedFarmaciaRoute';
import { useRelatorios } from '../hooks/useRelatorios';
import { temaMedico } from '@/src/estilos/temaMedico';

const { width } = Dimensions.get('window');

export default function TelaRelatorios() {
  const {
    carregando,
    atualizando,
    periodoSelecionado,
    estatisticasEstoque,
    produtos,
    produtosMaisVendidos,
    financeiro,
    manipuladores,
  } = useRelatorios();

  const formatarMoeda = (valor: number) => {
    return `R$ ${valor.toFixed(2).replace('.', ',')}`;
  };

  const obterRotuloPeriodo = () => {
    switch (periodoSelecionado) {
      case '7d': return 'Últimos 7 dias';
      case '30d': return 'Últimos 30 dias';
      case '90d': return 'Últimos 90 dias';
      default: return 'Últimos 30 dias';
    }
  };

  return (
    <ProtectedFarmaciaRoute>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={estilos.pagina}>
        {/* Header */}
        <View style={estilos.cabecalho}>
          <TouchableOpacity style={estilos.cabecalho__botaoVoltar} onPress={() => manipuladores.aoVoltar()}>
            <Ionicons name="arrow-back" size={24} color={temaMedico.cores.primaria} />
          </TouchableOpacity>
          <Text style={estilos.cabecalho__titulo}>Relatórios</Text>
          <TouchableOpacity
            style={estilos.cabecalho__botaoExportar}
            onPress={() => alert('Funcionalidade de exportar será implementada')}
          >
            <Ionicons name="download-outline" size={24} color={temaMedico.cores.primaria} />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={estilos.conteudo}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl atualizando={atualizando} onRefresh={manipuladores.aoAtualizar} />
          }
        >
          {carregando ? (
            <View style={estilos.carregandoContainer}>
              <ActivityIndicator size="large" color={temaMedico.cores.primaria} />
              <Text style={estilos.carregandoTexto}>Carregando relatórios...</Text>
            </View>
          ) : (
            <>
              {/* Seletor de Período */}
              <View style={estilos.periodoSelector}>
                <TouchableOpacity
                  style={[
                    estilos.periodoButton,
                    periodoSelecionado === '7d' && styles.periodoButton_active,
                  ]}
                  onPress={() => manipuladores.aoAlterarPeriodo('7d')}
                >
                  <Text
                    style={[
                      estilos.periodoButtonTexto,
                      periodoSelecionado === '7d' && styles.periodoButtonTexto_active,
                    ]}
                  >
                    7 dias
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    estilos.periodoButton,
                    periodoSelecionado === '30d' && styles.periodoButton_active,
                  ]}
                  onPress={() => manipuladores.aoAlterarPeriodo('30d')}
                >
                  <Text
                    style={[
                      estilos.periodoButtonTexto,
                      periodoSelecionado === '30d' && styles.periodoButtonTexto_active,
                    ]}
                  >
                    30 dias
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    estilos.periodoButton,
                    periodoSelecionado === '90d' && styles.periodoButton_active,
                  ]}
                  onPress={() => manipuladores.aoAlterarPeriodo('90d')}
                >
                  <Text
                    style={[
                      estilos.periodoButtonTexto,
                      periodoSelecionado === '90d' && styles.periodoButtonTexto_active,
                    ]}
                  >
                    90 dias
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Resumo Financeiro */}
              <View style={estilos.secao}>
                <View style={estilos.secao__header}>
                  <Ionicons name="cash-outline" size={24} color={temaMedico.cores.primaria} />
                  <Text style={estilos.secao__titulo}>Resumo Financeiro</Text>
                </View>

                <View style={estilos.cards}>
                  <View style={estilos.card}>
                    <View style={estilos.card__icone_verde}>
                      <Ionicons name="trending-up" size={20} color="#059669" />
                    </View>
                    <Text style={estilos.card__label}>Receita Total</Text>
                    <Text style={estilos.card__valor}>
                      {formatarMoeda(financeiro?.receitaTotal || 0)}
                    </Text>
                    <Text style={estilos.card__periodo}>{obterRotuloPeriodo()}</Text>
                  </View>

                  <View style={estilos.card}>
                    <View style={estilos.card__icone_azul}>
                      <Ionicons name="cube-outline" size={20} color={temaMedico.cores.primaria} />
                    </View>
                    <Text style={estilos.card__label}>Custo Estoque</Text>
                    <Text style={estilos.card__valor}>
                      {formatarMoeda(financeiro?.custoEstoque || 0)}
                    </Text>
                    <Text style={estilos.card__periodo}>Valor atual</Text>
                  </View>

                  <View style={estilos.card}>
                    <View style={estilos.card__icone_roxo}>
                      <Ionicons name="stats-chart" size={20} color="#7C3AED" />
                    </View>
                    <Text style={estilos.card__label}>Margem de Lucro</Text>
                    <Text style={estilos.card__valor}>
                      {(financeiro?.margemLucro || 0).toFixed(1)}%
                    </Text>
                    <Text style={estilos.card__periodo}>Média do período</Text>
                  </View>

                  <View style={estilos.card}>
                    <View style={estilos.card__icone_laranja}>
                      <Ionicons name="cart-outline" size={20} color="#F59E0B" />
                    </View>
                    <Text style={estilos.card__label}>Ticket Médio</Text>
                    <Text style={estilos.card__valor}>
                      {formatarMoeda(financeiro?.ticketMedio || 0)}
                    </Text>
                    <Text style={estilos.card__periodo}>Por venda</Text>
                  </View>
                </View>
              </View>

              {/* Estoque */}
              <View style={estilos.secao}>
                <View style={estilos.secao__header}>
                  <Ionicons name="filing-outline" size={24} color={temaMedico.cores.primaria} />
                  <Text style={estilos.secao__titulo}>Situação do Estoque</Text>
                </View>

                <View style={estilos.estoqueCards}>
                  <View style={estilos.estoqueCard}>
                    <Text style={estilos.estoqueCard__valor}>
                      {estatisticasEstoque?.totalProdutos || 0}
                    </Text>
                    <Text style={estilos.estoqueCard__label}>Produtos Diferentes</Text>
                  </View>

                  <View style={estilos.estoqueCard}>
                    <Text style={estilos.estoqueCard__valor}>
                      {estatisticasEstoque?.totalItens || 0}
                    </Text>
                    <Text style={estilos.estoqueCard__label}>Total de Itens</Text>
                  </View>

                  <View style={[styles.estoqueCard, styles.estoqueCard_warning]}>
                    <Text style={[styles.estoqueCard__valor, styles.estoqueCard__valor_warning]}>
                      {estatisticasEstoque?.produtosBaixoEstoque || 0}
                    </Text>
                    <Text style={estilos.estoqueCard__label}>Estoque Baixo</Text>
                  </View>

                  <View style={[styles.estoqueCard, styles.estoqueCard_danger]}>
                    <Text style={[styles.estoqueCard__valor, styles.estoqueCard__valor_danger]}>
                      {estatisticasEstoque?.produtosEsgotados || 0}
                    </Text>
                    <Text style={estilos.estoqueCard__label}>Esgotados</Text>
                  </View>
                </View>
              </View>

              {/* Produtos Mais Vendidos */}
              <View style={estilos.secao}>
                <View style={estilos.secao__header}>
                  <Ionicons name="trophy-outline" size={24} color={temaMedico.cores.primaria} />
                  <Text style={estilos.secao__titulo}>Top 5 Produtos Mais Vendidos</Text>
                </View>

                <View style={estilos.rankingContainer}>
                  {produtosMaisVendidos.map((produto, index) => (
                    <View key={index} style={estilos.rankingItem}>
                      <View style={estilos.rankingItem__posicao}>
                        <Text style={estilos.rankingItem__posicaoTexto}>{index + 1}</Text>
                      </View>
                      <View style={estilos.rankingItem__info}>
                        <Text style={estilos.rankingItem__nome}>{produto.nome}</Text>
                        <Text style={estilos.rankingItem__detalhes}>
                          {produto.quantidade} unidades vendidas
                        </Text>
                      </View>
                      <View style={estilos.rankingItem__valor}>
                        <Text style={estilos.rankingItem__valorTexto}>
                          {formatarMoeda(produto.valor)}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              </View>

              {/* Gráfico de Vendas Simulado */}
              <View style={estilos.secao}>
                <View style={estilos.secao__header}>
                  <Ionicons name="bar-chart-outline" size={24} color={temaMedico.cores.primaria} />
                  <Text style={estilos.secao__titulo}>Evolução de Vendas</Text>
                </View>

                <View style={estilos.graficoContainer}>
                  <View style={estilos.grafico}>
                    {[65, 85, 45, 90, 70, 95, 80].map((altura, index) => (
                      <View key={index} style={estilos.grafico__coluna}>
                        <View
                          style={[
                            estilos.grafico__barra,
                            { height: `${altura}%` },
                          ]}
                        />
                        <Text style={estilos.grafico__label}>
                          {['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'][index]}
                        </Text>
                      </View>
                    ))}
                  </View>
                  <Text style={estilos.grafico__legenda}>
                    Vendas diárias nos últimos 7 dias
                  </Text>
                </View>
              </View>

              {/* Alertas e Ações */}
              <View style={estilos.secao}>
                <View style={estilos.secao__header}>
                  <Ionicons name="notifications-outline" size={24} color={temaMedico.cores.primaria} />
                  <Text style={estilos.secao__titulo}>Alertas e Recomendações</Text>
                </View>

                <View style={estilos.alertas}>
                  {(estatisticasEstoque?.produtosBaixoEstoque || 0) > 0 && (
                    <View style={estilos.alerta}>
                      <View style={estilos.alerta__icone_warning}>
                        <Ionicons name="warning" size={20} color="#F59E0B" />
                      </View>
                      <View style={estilos.alerta__conteudo}>
                        <Text style={estilos.alerta__titulo}>Estoque Baixo</Text>
                        <Text style={estilos.alerta__descricao}>
                          {estatisticasEstoque?.produtosBaixoEstoque} produtos precisam de reposição
                        </Text>
                      </View>
                      <TouchableOpacity onPress={() => router.push('/farmacia/estoque/gerenciar')}>
                        <Ionicons name="chevron-forward" size={20} color={temaMedico.cores.textoSecundario} />
                      </TouchableOpacity>
                    </View>
                  )}

                  {(estatisticasEstoque?.produtosEsgotados || 0) > 0 && (
                    <View style={estilos.alerta}>
                      <View style={estilos.alerta__icone_danger}>
                        <Ionicons name="alert-circle" size={20} color="#DC2626" />
                      </View>
                      <View style={estilos.alerta__conteudo}>
                        <Text style={estilos.alerta__titulo}>Produtos Esgotados</Text>
                        <Text style={estilos.alerta__descricao}>
                          {estatisticasEstoque?.produtosEsgotados} produtos sem estoque
                        </Text>
                      </View>
                      <TouchableOpacity onPress={() => router.push('/farmacia/estoque/gerenciar')}>
                        <Ionicons name="chevron-forward" size={20} color={temaMedico.cores.textoSecundario} />
                      </TouchableOpacity>
                    </View>
                  )}

                  <View style={estilos.alerta}>
                    <View style={estilos.alerta__icone_info}>
                      <Ionicons name="information-circle" size={20} color={temaMedico.cores.primaria} />
                    </View>
                    <View style={estilos.alerta__conteudo}>
                      <Text style={estilos.alerta__titulo}>Relatório Completo</Text>
                      <Text style={estilos.alerta__descricao}>
                        Exporte o relatório completo em PDF
                      </Text>
                    </View>
                    <TouchableOpacity onPress={() => alert('Funcionalidade em desenvolvimento')}>
                      <Ionicons name="chevron-forward" size={20} color={temaMedico.cores.textoSecundario} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              {/* Espaço no final */}
              <View style={{ height: 30 }} />
            </>
          )}
        </ScrollView>
      </View>
    </ProtectedFarmaciaRoute>
  );
}

// Estilos
const estilos = {
  pagina: {
    flex: 1,
    backgroundColor: temaMedico.cores.background,
  },
  cabecalho: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: temaMedico.cores.backgroundCard,
    borderBottomWidth: 1,
    borderBottomColor: temaMedico.cores.borda,
  },
  cabecalho__botaoVoltar: {
    padding: 8,
  },
  cabecalho__botaoExportar: {
    padding: 8,
  },
  cabecalho__titulo: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: temaMedico.cores.textoTitulo,
  },
  conteudo: {
    flex: 1,
    padding: 16,
  },
  carregandoContainer: {
    flex: 1,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    paddingTop: 100,
  },
  carregandoTexto: {
    marginTop: 16,
    fontSize: 14,
    color: temaMedico.cores.textoSubtitulo,
  },
  // Seletor de Período
  periodoSelector: {
    flexDirection: 'row' as const,
    backgroundColor: temaMedico.cores.backgroundCard,
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: temaMedico.cores.borda,
  },
  periodoButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center' as const,
  },
  periodoButton_active: {
    backgroundColor: temaMedico.cores.primaria,
  },
  periodoButtonTexto: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: temaMedico.cores.textoSubtitulo,
  },
  periodoButtonTexto_active: {
    color: temaMedico.cores.textoBranco,
  },
  // Seções
  secao: {
    marginBottom: 24,
  },
  secao__header: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 8,
    marginBottom: 16,
  },
  secao__titulo: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: temaMedico.cores.textoTitulo,
  },
  // Cards Financeiros
  cards: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    gap: 12,
  },
  card: {
    flex: 1,
    minWidth: (width - 48) / 2,
    backgroundColor: temaMedico.cores.backgroundCard,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: temaMedico.cores.borda,
  },
  card__icone_verde: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#D1FAE5',
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    marginBottom: 12,
  },
  card__icone_azul: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: temaMedico.cores.backgroundDestaque,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    marginBottom: 12,
  },
  card__icone_roxo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EDE9FE',
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    marginBottom: 12,
  },
  card__icone_laranja: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FEF3C7',
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    marginBottom: 12,
  },
  card__label: {
    fontSize: 12,
    color: temaMedico.cores.textoSubtitulo,
    marginBottom: 8,
  },
  card__valor: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: temaMedico.cores.textoTitulo,
    marginBottom: 4,
  },
  card__periodo: {
    fontSize: 11,
    color: temaMedico.cores.textoClaro,
  },
  // Cards de Estoque
  estoqueCards: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    gap: 12,
  },
  estoqueCard: {
    flex: 1,
    minWidth: (width - 48) / 2,
    backgroundColor: temaMedico.cores.backgroundCard,
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: temaMedico.cores.primaria,
    alignItems: 'center' as const,
  },
  estoqueCard_warning: {
    borderColor: '#F59E0B',
    backgroundColor: '#FFFBEB',
  },
  estoqueCard_danger: {
    borderColor: '#DC2626',
    backgroundColor: '#FEF2F2',
  },
  estoqueCard__valor: {
    fontSize: 32,
    fontWeight: '700' as const,
    color: temaMedico.cores.primaria,
    marginBottom: 4,
  },
  estoqueCard__valor_warning: {
    color: '#F59E0B',
  },
  estoqueCard__valor_danger: {
    color: '#DC2626',
  },
  estoqueCard__label: {
    fontSize: 12,
    color: temaMedico.cores.textoSubtitulo,
    textAlign: 'center' as const,
  },
  // Ranking
  rankingContainer: {
    backgroundColor: temaMedico.cores.backgroundCard,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: temaMedico.cores.borda,
    overflow: 'hidden' as const,
  },
  rankingItem: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: temaMedico.cores.borda,
  },
  rankingItem__posicao: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: temaMedico.cores.primaria,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    marginRight: 12,
  },
  rankingItem__posicaoTexto: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: temaMedico.cores.textoBranco,
  },
  rankingItem__info: {
    flex: 1,
  },
  rankingItem__nome: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: temaMedico.cores.textoTitulo,
    marginBottom: 2,
  },
  rankingItem__detalhes: {
    fontSize: 12,
    color: temaMedico.cores.textoSubtitulo,
  },
  rankingItem__valor: {
    marginLeft: 12,
  },
  rankingItem__valorTexto: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: temaMedico.cores.primaria,
  },
  // Gráfico
  graficoContainer: {
    backgroundColor: temaMedico.cores.backgroundCard,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: temaMedico.cores.borda,
  },
  grafico: {
    flexDirection: 'row' as const,
    alignItems: 'flex-end' as const,
    justifyContent: 'space-between' as const,
    height: 200,
    marginBottom: 12,
  },
  grafico__coluna: {
    flex: 1,
    alignItems: 'center' as const,
    justifyContent: 'flex-end' as const,
  },
  grafico__barra: {
    width: '70%',
    backgroundColor: temaMedico.cores.primaria,
    borderRadius: 4,
    marginBottom: 8,
  },
  grafico__label: {
    fontSize: 10,
    color: temaMedico.cores.textoSubtitulo,
  },
  grafico__legenda: {
    fontSize: 12,
    color: temaMedico.cores.textoClaro,
    textAlign: 'center' as const,
  },
  // Alertas
  alertas: {
    gap: 12,
  },
  alerta: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    backgroundColor: temaMedico.cores.backgroundCard,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: temaMedico.cores.borda,
  },
  alerta__icone_warning: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FEF3C7',
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    marginRight: 12,
  },
  alerta__icone_danger: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FEE2E2',
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    marginRight: 12,
  },
  alerta__icone_info: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: temaMedico.cores.backgroundDestaque,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    marginRight: 12,
  },
  alerta__conteudo: {
    flex: 1,
  },
  alerta__titulo: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: temaMedico.cores.textoTitulo,
    marginBottom: 2,
  },
  alerta__descricao: {
    fontSize: 12,
    color: temaMedico.cores.textoSubtitulo,
  },
};
