/**
 * Tela: Meus Pedidos - Esculapi
 * Lista de pedidos do cliente autenticado
 * Arquitetura: OOP + Português
 */

import React, { useState, useMemo } from 'react';
import {
  ScrollView,
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Modal,
} from 'react-native';
import { Stack, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { temaMedico } from '@/src/estilos/temaMedico';
import { ProtectedRoute } from '@/src/componentes/ProtectedRoute';
import { useMeusPedidos } from './hooks/useMeusPedidos';
import type { Pedido, PedidoStatus } from '@/src/servicos/types/api.types';

export default function TelaMeusPedidos() {
  const {
    carregando,
    atualizando,
    pedidos,
    manipuladores,
  } = useMeusPedidos();

  // Estados para filtro e modal
  const [filtroAtivo, setFiltroAtivo] = useState<PedidoStatus | 'TODOS'>('TODOS');
  const [modalVisivel, setModalVisivel] = useState(false);
  const [statusSelecionado, setStatusSelecionado] = useState<PedidoStatus | null>(null);

  // Filtra pedidos baseado no filtro ativo
  const pedidosFiltrados = useMemo(() => {
    if (filtroAtivo === 'TODOS') return pedidos;
    return pedidos.filter(p => p.status === filtroAtivo);
  }, [pedidos, filtroAtivo]);

  // Configuração dos status
  const STATUS_CONFIG = {
    AGUARDANDO_CONFIRMACAO: {
      label: 'Aguardando Confirmação',
      icon: 'hourglass' as const,
      cor: '#9E9E9E',
      fundo: '#F5F5F5',
      descricao: 'Seu pedido foi recebido e está aguardando confirmação da farmácia.',
      proximoPasso: 'A farmácia irá revisar seu pedido e confirmar a disponibilidade dos produtos.',
    },
    AGUARDANDO_PAGAMENTO: {
      label: 'Aguardando Pagamento',
      icon: 'card' as const,
      cor: '#EF4444',
      fundo: '#FEE2E2',
      descricao: 'Seu pedido está aguardando o pagamento ser processado.',
      proximoPasso: 'Complete o pagamento para que possamos processar seu pedido.',
    },
    AGUARDANDO_RECEITA: {
      label: 'Aguardando Receita',
      icon: 'document-text' as const,
      cor: '#F59E0B',
      fundo: '#FEF3C7',
      descricao: 'Este pedido contém medicamentos que requerem receita médica.',
      proximoPasso: 'Envie a foto da sua receita médica para darmos continuidade ao pedido.',
    },
    CONFIRMADO: {
      label: 'Confirmado',
      icon: 'checkmark-done' as const,
      cor: '#06B6D4',
      fundo: '#CFFAFE',
      descricao: 'Seu pedido foi confirmado pela farmácia.',
      proximoPasso: 'Aguarde enquanto a farmácia prepara seus produtos.',
    },
    EM_PREPARACAO: {
      label: 'Em Preparação',
      icon: 'cube' as const,
      cor: '#3B82F6',
      fundo: '#DBEAFE',
      descricao: 'A farmácia está separando os produtos do seu pedido.',
      proximoPasso: 'Seu pedido será embalado e preparado para entrega em breve.',
    },
    PRONTO_PARA_ENTREGA: {
      label: 'Pronto para Entrega',
      icon: 'cube-outline' as const,
      cor: '#8B5CF6',
      fundo: '#EDE9FE',
      descricao: 'Seu pedido está pronto e aguardando coleta pela transportadora.',
      proximoPasso: 'Em breve seu pedido será coletado e enviado para você.',
    },
    EM_TRANSPORTE: {
      label: 'Em Transporte',
      icon: 'car' as const,
      cor: '#A855F7',
      fundo: '#F3E8FF',
      descricao: 'Seu pedido está a caminho do endereço de entrega.',
      proximoPasso: 'Fique atento, seu pedido chegará em breve!',
    },
    ENTREGUE: {
      label: 'Entregue',
      icon: 'checkmark-circle' as const,
      cor: '#10B981',
      fundo: '#D1FAE5',
      descricao: 'Seu pedido foi entregue com sucesso.',
      proximoPasso: 'Obrigado por comprar conosco! Esperamos que goste dos produtos.',
    },
    CANCELADO: {
      label: 'Cancelado',
      icon: 'close-circle' as const,
      cor: '#EF4444',
      fundo: '#FEE2E2',
      descricao: 'Este pedido foi cancelado.',
      proximoPasso: 'Se tiver dúvidas sobre o cancelamento, entre em contato conosco.',
    },
    RECUSADO: {
      label: 'Recusado',
      icon: 'ban' as const,
      cor: '#DC2626',
      fundo: '#FEE2E2',
      descricao: 'Este pedido foi recusado pela farmácia.',
      proximoPasso: 'Entre em contato com a farmácia para mais informações.',
    },
  };

  /**
   * Abre modal com informações do status
   */
  const abrirModalStatus = (status: PedidoStatus) => {
    setStatusSelecionado(status);
    setModalVisivel(true);
  };

  /**
   * Renderizar status badge
   */
  const renderizarStatusBadge = (status: string, clicavel = false) => {
    const statusConfig = {
      AGUARDANDO_CONFIRMACAO: {
        label: 'Aguardando Confirmação',
        icon: 'hourglass' as const,
        cor: '#9E9E9E',
        fundo: '#F5F5F5',
      },
      AGUARDANDO_PAGAMENTO: {
        label: 'Aguardando Pagamento',
        icon: 'card' as const,
        cor: '#EF4444',
        fundo: '#FEE2E2',
      },
      AGUARDANDO_RECEITA: {
        label: 'Aguardando Receita',
        icon: 'document-text' as const,
        cor: '#F59E0B',
        fundo: '#FEF3C7',
      },
      CONFIRMADO: {
        label: 'Confirmado',
        icon: 'checkmark-done' as const,
        cor: '#06B6D4',
        fundo: '#CFFAFE',
      },
      EM_PREPARACAO: {
        label: 'Em Preparação',
        icon: 'cube' as const,
        cor: '#3B82F6',
        fundo: '#DBEAFE',
      },
      PRONTO_PARA_ENTREGA: {
        label: 'Pronto para Entrega',
        icon: 'cube-outline' as const,
        cor: '#8B5CF6',
        fundo: '#EDE9FE',
      },
      EM_TRANSPORTE: {
        label: 'Em Transporte',
        icon: 'car' as const,
        cor: '#A855F7',
        fundo: '#F3E8FF',
      },
      ENTREGUE: {
        label: 'Entregue',
        icon: 'checkmark-circle' as const,
        cor: '#10B981',
        fundo: '#D1FAE5',
      },
      CANCELADO: {
        label: 'Cancelado',
        icon: 'close-circle' as const,
        cor: '#EF4444',
        fundo: '#FEE2E2',
      },
      RECUSADO: {
        label: 'Recusado',
        icon: 'ban' as const,
        cor: '#DC2626',
        fundo: '#FEE2E2',
      },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.CONFIRMADO;

    const Badge = (
      <View style={[estilos.statusBadge, { backgroundColor: config.fundo }]}>
        <Ionicons name={config.icon} size={16} color={config.cor} />
        <Text style={[estilos.statusBadgeText, { color: config.cor }]}>
          {config.label}
        </Text>
        {clicavel && <Ionicons name="information-circle" size={14} color={config.cor} style={{ marginLeft: 4 }} />}
      </View>
    );

    if (clicavel) {
      return (
        <TouchableOpacity onPress={() => abrirModalStatus(status as PedidoStatus)}>
          {Badge}
        </TouchableOpacity>
      );
    }

    return Badge;
  };

  /**
   * Renderizar card de pedido
   */
  const renderizarPedido = (pedido: Pedido) => {
    console.log('[TelaMeusPedidos] 🔍 Renderizando pedido:', {
      id: pedido.id,
      numero: pedido.numero,
      total: pedido.total,
      status: pedido.status,
      pedidoCompleto: pedido,
    });

    const dataPedido = new Date(pedido.createdAt);
    const dataFormatada = dataPedido.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });

    return (
      <TouchableOpacity
        key={pedido.id}
        style={estilos.pedidoCard}
        onPress={() => manipuladores.aoVerDetalhes(pedido.id)}
      >
        {/* Header do Card */}
        <View style={estilos.pedidoCard__header}>
          <View style={estilos.pedidoCard__headerInfo}>
            <Text style={estilos.pedidoCard__numero}>Pedido #{pedido.numero}</Text>
            <Text style={estilos.pedidoCard__data}>{dataFormatada}</Text>
          </View>
          {renderizarStatusBadge(pedido.status, true)}
        </View>

        {/* Itens do Pedido */}
        <View style={estilos.pedidoCard__itens}>
          {pedido.itens.slice(0, 2).map((item) => (
            <View key={item.id} style={estilos.itemRow}>
              <Ionicons name="medical" size={16} color={temaMedico.cores.primaria} />
              <Text style={estilos.itemNome} numberOfLines={1}>
                {item.produtoNome}
              </Text>
              <Text style={estilos.itemQuantidade}>x{item.quantidade}</Text>
            </View>
          ))}
          {pedido.itens.length > 2 && (
            <Text style={estilos.maisItens}>
              +{pedido.itens.length - 2} {pedido.itens.length - 2 === 1 ? 'item' : 'itens'}
            </Text>
          )}
        </View>

        {/* Footer do Card */}
        <View style={estilos.pedidoCard__footer}>
          <View>
            <Text style={estilos.totalLabel}>Total</Text>
            <Text style={estilos.totalValor}>
              R$ {(pedido.total || pedido.valorTotal || 0).toFixed(2).replace('.', ',')}
            </Text>
          </View>
          <View style={estilos.verDetalhesButton}>
            <Text style={estilos.verDetalhesText}>Ver detalhes</Text>
            <Ionicons name="chevron-forward" size={16} color={temaMedico.cores.primaria} />
          </View>
        </View>

        {/* Indicador de Receita Pendente */}
        {pedido.status === 'AGUARDANDO_RECEITA' && (
          <TouchableOpacity
            style={estilos.receituaPendente}
            onPress={() => manipuladores.aoEnviarReceita(pedido.id)}
          >
            <Ionicons name="warning" size={16} color={temaMedico.cores.alerta} />
            <Text style={estilos.receituaPendenteText}>
              Enviar receita médica
            </Text>
            <Ionicons name="arrow-forward" size={16} color={temaMedico.cores.alerta} />
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <ProtectedRoute>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={estilos.container}>
        {/* Header */}
        <View style={estilos.cabecalho}>
          <TouchableOpacity
            style={estilos.cabecalho__botaoVoltar}
            onPress={manipuladores.aoVoltar}
          >
            <Ionicons name="arrow-back" size={24} color={temaMedico.cores.textoTitulo} />
          </TouchableOpacity>
          <Text style={estilos.cabecalho__titulo}>Meus Pedidos</Text>
          <View style={estilos.cabecalho__espacador} />
        </View>

        {/* Filtros */}
        {!carregando && pedidos.length > 0 && (
          <View style={estilos.filtrosContainer}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={estilos.filtrosScroll}
            >
              <TouchableOpacity
                style={[estilos.filtroChip, filtroAtivo === 'TODOS' && estilos.filtroChipAtivo]}
                onPress={() => setFiltroAtivo('TODOS')}
              >
                <Text style={[estilos.filtroTexto, filtroAtivo === 'TODOS' && estilos.filtroTextoAtivo]}>
                  Todos ({pedidos.length})
                </Text>
              </TouchableOpacity>

              {Object.entries(STATUS_CONFIG).map(([status, config]) => {
                const count = pedidos.filter(p => p.status === status).length;
                if (count === 0) return null;

                return (
                  <TouchableOpacity
                    key={status}
                    style={[
                      estilos.filtroChip,
                      { borderColor: config.cor },
                      filtroAtivo === status && { backgroundColor: config.fundo }
                    ]}
                    onPress={() => setFiltroAtivo(status as PedidoStatus)}
                  >
                    <Ionicons name={config.icon} size={16} color={config.cor} />
                    <Text style={[estilos.filtroTexto, { color: config.cor, marginLeft: 6 }]}>
                      {config.label} ({count})
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        )}

        {/* Conteúdo */}
        <ScrollView
          style={estilos.conteudo}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={atualizando}
              onRefresh={manipuladores.aoAtualizar}
              colors={[temaMedico.cores.primaria]}
            />
          }
        >
          {carregando ? (
            <View style={estilos.carregandoContainer}>
              <ActivityIndicator size="large" color={temaMedico.cores.primaria} />
              <Text style={estilos.carregandoTexto}>Carregando pedidos...</Text>
            </View>
          ) : pedidos.length === 0 ? (
            <View style={estilos.emptyContainer}>
              <Ionicons name="cart-outline" size={80} color={temaMedico.cores.textoClaro} />
              <Text style={estilos.emptyTitulo}>Nenhum pedido ainda</Text>
              <Text style={estilos.emptyDescricao}>
                Quando você fizer um pedido, ele aparecerá aqui.
              </Text>
              <TouchableOpacity
                style={estilos.botaoIniciarCompras}
                onPress={manipuladores.aoIniciarCompras}
              >
                <Text style={estilos.textoBotaoIniciarCompras}>Começar a Comprar</Text>
              </TouchableOpacity>
            </View>
          ) : pedidosFiltrados.length === 0 ? (
            <View style={estilos.emptyContainer}>
              <Ionicons name="filter-outline" size={80} color={temaMedico.cores.textoClaro} />
              <Text style={estilos.emptyTitulo}>Nenhum pedido encontrado</Text>
              <Text style={estilos.emptyDescricao}>
                Não há pedidos com o status selecionado.
              </Text>
            </View>
          ) : (
            <View style={estilos.listaPedidos}>
              {pedidosFiltrados.map((pedido) => renderizarPedido(pedido))}
            </View>
          )}

          {/* Espaço no final */}
          <View style={{ height: 30 }} />
        </ScrollView>

        {/* Modal de Informações do Status */}
        <Modal
          visible={modalVisivel}
          transparent
          animationType="fade"
          onRequestClose={() => setModalVisivel(false)}
        >
          <TouchableOpacity
            style={estilos.modalOverlay}
            activeOpacity={1}
            onPress={() => setModalVisivel(false)}
          >
            <View style={estilos.modalContainer}>
              <TouchableOpacity activeOpacity={1} onPress={(e) => e.stopPropagation()}>
                <View style={estilos.modalConteudo}>
                  {statusSelecionado && STATUS_CONFIG[statusSelecionado] && (
                    <>
                      {/* Header do Modal */}
                      <View style={[estilos.modalHeader, { backgroundColor: STATUS_CONFIG[statusSelecionado].fundo }]}>
                        <View style={estilos.modalIcone}>
                          <Ionicons
                            name={STATUS_CONFIG[statusSelecionado].icon}
                            size={32}
                            color={STATUS_CONFIG[statusSelecionado].cor}
                          />
                        </View>
                        <Text style={[estilos.modalTitulo, { color: STATUS_CONFIG[statusSelecionado].cor }]}>
                          {STATUS_CONFIG[statusSelecionado].label}
                        </Text>
                        <TouchableOpacity
                          style={estilos.modalBotaoFechar}
                          onPress={() => setModalVisivel(false)}
                        >
                          <Ionicons name="close" size={24} color={temaMedico.cores.textoSecundario} />
                        </TouchableOpacity>
                      </View>

                      {/* Corpo do Modal */}
                      <View style={estilos.modalCorpo}>
                        <Text style={estilos.modalDescricaoTitulo}>O que significa?</Text>
                        <Text style={estilos.modalDescricao}>
                          {STATUS_CONFIG[statusSelecionado].descricao}
                        </Text>

                        <Text style={estilos.modalProximoPassoTitulo}>Próximos passos</Text>
                        <View style={estilos.modalProximoPassoContainer}>
                          <Ionicons name="arrow-forward-circle" size={20} color={temaMedico.cores.primaria} />
                          <Text style={estilos.modalProximoPasso}>
                            {STATUS_CONFIG[statusSelecionado].proximoPasso}
                          </Text>
                        </View>
                      </View>

                      {/* Footer do Modal */}
                      <View style={estilos.modalFooter}>
                        <TouchableOpacity
                          style={estilos.modalBotaoEntendi}
                          onPress={() => setModalVisivel(false)}
                        >
                          <Text style={estilos.modalBotaoEntendTexto}>Entendi</Text>
                        </TouchableOpacity>
                      </View>
                    </>
                  )}
                </View>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>
      </View>
    </ProtectedRoute>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: temaMedico.cores.background,
  },
  cabecalho: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: temaMedico.espacamentos.lg,
    paddingTop: 60,
    paddingBottom: temaMedico.espacamentos.lg,
    backgroundColor: temaMedico.cores.backgroundCard,
    borderBottomWidth: 1,
    borderBottomColor: temaMedico.cores.borda,
  },
  cabecalho__botaoVoltar: {
    padding: 8,
  },
  cabecalho__titulo: {
    fontSize: temaMedico.fontes.tamanhos.xl,
    fontWeight: temaMedico.fontes.pesos.bold,
    color: temaMedico.cores.textoTitulo,
  },
  cabecalho__espacador: {
    width: 40,
  },
  conteudo: {
    flex: 1,
  },
  carregandoContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
  },
  carregandoTexto: {
    marginTop: temaMedico.espacamentos.md,
    fontSize: temaMedico.fontes.tamanhos.md,
    color: temaMedico.cores.textoSubtitulo,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
    paddingHorizontal: temaMedico.espacamentos.xxl,
  },
  emptyTitulo: {
    fontSize: temaMedico.fontes.tamanhos.xl,
    fontWeight: temaMedico.fontes.pesos.bold,
    color: temaMedico.cores.textoTitulo,
    marginTop: temaMedico.espacamentos.lg,
  },
  emptyDescricao: {
    fontSize: temaMedico.fontes.tamanhos.md,
    color: temaMedico.cores.textoSubtitulo,
    textAlign: 'center',
    marginTop: temaMedico.espacamentos.sm,
    marginBottom: temaMedico.espacamentos.xl,
  },
  botaoIniciarCompras: {
    backgroundColor: temaMedico.cores.primaria,
    paddingVertical: temaMedico.espacamentos.md,
    paddingHorizontal: temaMedico.espacamentos.xl,
    borderRadius: temaMedico.bordas.media,
  },
  textoBotaoIniciarCompras: {
    color: temaMedico.cores.textoBranco,
    fontSize: temaMedico.fontes.tamanhos.md,
    fontWeight: temaMedico.fontes.pesos.bold,
  },
  listaPedidos: {
    padding: temaMedico.espacamentos.md,
    gap: temaMedico.espacamentos.md,
  },
  pedidoCard: {
    backgroundColor: temaMedico.cores.backgroundCard,
    borderRadius: temaMedico.bordas.media,
    padding: temaMedico.espacamentos.lg,
    borderWidth: 1,
    borderColor: temaMedico.cores.borda,
    ...temaMedico.sombras.pequena,
  },
  pedidoCard__header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: temaMedico.espacamentos.md,
    paddingBottom: temaMedico.espacamentos.md,
    borderBottomWidth: 1,
    borderBottomColor: temaMedico.cores.borda,
  },
  pedidoCard__headerInfo: {
    flex: 1,
  },
  pedidoCard__numero: {
    fontSize: temaMedico.fontes.tamanhos.lg,
    fontWeight: temaMedico.fontes.pesos.semibold,
    color: temaMedico.cores.textoTitulo,
    marginBottom: 4,
  },
  pedidoCard__data: {
    fontSize: temaMedico.fontes.tamanhos.sm,
    color: temaMedico.cores.textoSubtitulo,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  statusBadgeText: {
    fontSize: temaMedico.fontes.tamanhos.sm,
    fontWeight: temaMedico.fontes.pesos.semibold,
  },
  pedidoCard__itens: {
    marginBottom: temaMedico.espacamentos.md,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 8,
  },
  itemNome: {
    flex: 1,
    fontSize: temaMedico.fontes.tamanhos.sm,
    color: temaMedico.cores.textoSubtitulo,
  },
  itemQuantidade: {
    fontSize: temaMedico.fontes.tamanhos.sm,
    color: temaMedico.cores.textoSubtitulo,
    fontWeight: temaMedico.fontes.pesos.semibold,
  },
  maisItens: {
    fontSize: temaMedico.fontes.tamanhos.sm,
    color: temaMedico.cores.primaria,
    marginTop: 4,
  },
  pedidoCard__footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: temaMedico.fontes.tamanhos.sm,
    color: temaMedico.cores.textoSubtitulo,
    marginBottom: 2,
  },
  totalValor: {
    fontSize: temaMedico.fontes.tamanhos.xl,
    fontWeight: temaMedico.fontes.pesos.bold,
    color: temaMedico.cores.primaria,
  },
  verDetalhesButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  verDetalhesText: {
    fontSize: temaMedico.fontes.tamanhos.sm,
    color: temaMedico.cores.primaria,
    fontWeight: temaMedico.fontes.pesos.semibold,
  },
  receituaPendente: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF3E0',
    padding: temaMedico.espacamentos.md,
    borderRadius: temaMedico.bordas.pequena,
    marginTop: temaMedico.espacamentos.md,
    gap: 8,
  },
  receituaPendenteText: {
    flex: 1,
    fontSize: temaMedico.fontes.tamanhos.sm,
    color: temaMedico.cores.alerta,
    fontWeight: temaMedico.fontes.pesos.semibold,
  },

  // Estilos dos Filtros
  filtrosContainer: {
    backgroundColor: temaMedico.cores.backgroundCard,
    borderBottomWidth: 1,
    borderBottomColor: temaMedico.cores.borda,
    paddingVertical: 12,
  },
  filtrosScroll: {
    paddingHorizontal: temaMedico.espacamentos.lg,
    gap: 10,
  },
  filtroChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: temaMedico.cores.borda,
    backgroundColor: temaMedico.cores.backgroundCard,
  },
  filtroChipAtivo: {
    backgroundColor: temaMedico.cores.primaria,
    borderColor: temaMedico.cores.primaria,
  },
  filtroTexto: {
    fontSize: temaMedico.fontes.tamanhos.sm,
    fontWeight: temaMedico.fontes.pesos.semibold,
    color: temaMedico.cores.textoSecundario,
  },
  filtroTextoAtivo: {
    color: '#FFFFFF',
  },

  // Estilos do Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    maxWidth: 500,
  },
  modalConteudo: {
    backgroundColor: temaMedico.cores.backgroundCard,
    borderRadius: 16,
    overflow: 'hidden',
    ...temaMedico.sombras.grande,
  },
  modalHeader: {
    padding: temaMedico.espacamentos.xl,
    alignItems: 'center',
    position: 'relative',
  },
  modalIcone: {
    marginBottom: 12,
  },
  modalTitulo: {
    fontSize: temaMedico.fontes.tamanhos.xxl,
    fontWeight: temaMedico.fontes.pesos.bold,
    textAlign: 'center',
  },
  modalBotaoFechar: {
    position: 'absolute',
    top: 16,
    right: 16,
    padding: 8,
  },
  modalCorpo: {
    padding: temaMedico.espacamentos.xl,
    paddingTop: temaMedico.espacamentos.md,
  },
  modalDescricaoTitulo: {
    fontSize: temaMedico.fontes.tamanhos.md,
    fontWeight: temaMedico.fontes.pesos.bold,
    color: temaMedico.cores.textoTitulo,
    marginBottom: 8,
  },
  modalDescricao: {
    fontSize: temaMedico.fontes.tamanhos.md,
    color: temaMedico.cores.textoSubtitulo,
    lineHeight: 22,
    marginBottom: 20,
  },
  modalProximoPassoTitulo: {
    fontSize: temaMedico.fontes.tamanhos.md,
    fontWeight: temaMedico.fontes.pesos.bold,
    color: temaMedico.cores.textoTitulo,
    marginBottom: 12,
  },
  modalProximoPassoContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    padding: 16,
    backgroundColor: temaMedico.cores.background,
    borderRadius: 12,
  },
  modalProximoPasso: {
    flex: 1,
    fontSize: temaMedico.fontes.tamanhos.md,
    color: temaMedico.cores.textoSubtitulo,
    lineHeight: 22,
  },
  modalFooter: {
    padding: temaMedico.espacamentos.lg,
    borderTopWidth: 1,
    borderTopColor: temaMedico.cores.borda,
  },
  modalBotaoEntendi: {
    backgroundColor: temaMedico.cores.primaria,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalBotaoEntendTexto: {
    fontSize: temaMedico.fontes.tamanhos.md,
    fontWeight: temaMedico.fontes.pesos.bold,
    color: '#FFFFFF',
  },
});
