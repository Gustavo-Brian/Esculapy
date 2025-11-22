/**
 * Componente CartaoPedido
 * Card para exibir pedido na lista do dashboard
 */

import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { temaMedico } from '@/src/estilos/temaMedico';
import type { Pedido } from '@/src/servicos/types/api.types';

interface CartaoPedidoProps {
  pedido: Pedido;
  aoClicarDetalhes: () => void;
  aoAtualizarStatus: (status: string) => void;
}

export const CartaoPedido = ({ pedido, aoClicarDetalhes, aoAtualizarStatus }: CartaoPedidoProps) => {
  /**
   * Retorna a cor do status
   */
  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'AGUARDANDO_CONFIRMACAO':
        return '#9E9E9E';
      case 'AGUARDANDO_PAGAMENTO':
        return '#EF4444';
      case 'AGUARDANDO_RECEITA':
        return '#F59E0B';
      case 'CONFIRMADO':
        return '#06B6D4';
      case 'EM_PREPARACAO':
        return '#3B82F6';
      case 'PRONTO_PARA_ENTREGA':
        return '#8B5CF6';
      case 'EM_TRANSPORTE':
        return '#A855F7';
      case 'ENTREGUE':
        return '#10B981';
      case 'CANCELADO':
        return '#EF4444';
      case 'RECUSADO':
        return '#DC2626';
      default:
        return '#666';
    }
  };

  /**
   * Retorna o próximo status no fluxo
   */
  const getProximoStatus = (statusAtual: string): string | null => {
    const fluxo: Record<string, string> = {
      'AGUARDANDO_RECEITA': 'CONFIRMADO',
      'CONFIRMADO': 'EM_PREPARACAO',
      'EM_PREPARACAO': 'PRONTO_PARA_ENTREGA',
      'PRONTO_PARA_ENTREGA': 'EM_TRANSPORTE',
      'EM_TRANSPORTE': 'ENTREGUE',
    };
    return fluxo[statusAtual] || null;
  };

  /**
   * Formata o status para exibição
   */
  const formatarStatus = (status: string): string => {
    return status.replace('_', ' ');
  };

  /**
   * Formata a data para exibição
   */
  const formatarData = (dataISO: string): string => {
    const data = new Date(dataISO);
    return data.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const proximoStatus = getProximoStatus(pedido.status);

  return (
    <TouchableOpacity style={styles.cartao} onPress={aoClicarDetalhes} activeOpacity={0.7}>
      {/* Cabeçalho */}
      <View style={styles.cabecalho}>
        <View style={styles.infoContainer}>
          <Text style={styles.numeroPedido}>Pedido #{pedido.id}</Text>
          <Text style={styles.dataCliente}>
            {pedido.clienteNome || 'Cliente'}
          </Text>
          <Text style={styles.data}>
            {formatarData(pedido.createdAt)}
          </Text>
        </View>
        <View style={[styles.badge, { backgroundColor: getStatusColor(pedido.status) }]}>
          <Text style={styles.badgeText}>{formatarStatus(pedido.status)}</Text>
        </View>
      </View>

      {/* Itens */}
      <View style={styles.itens}>
        {pedido.itens && pedido.itens.slice(0, 2).map((item, index) => (
          <Text key={index} style={styles.itemText}>
            • {item.quantidade}x {item.produtoNome}
          </Text>
        ))}
        {pedido.itens && pedido.itens.length > 2 && (
          <Text style={styles.maisItens}>
            +{pedido.itens.length - 2} {pedido.itens.length - 2 === 1 ? 'item' : 'itens'}
          </Text>
        )}
      </View>

      {/* Rodapé */}
      <View style={styles.rodape}>
        <View style={styles.valorContainer}>
          <Text style={styles.valorLabel}>Total</Text>
          <Text style={styles.valorTotal}>
            R$ {(pedido.total || pedido.valorTotal || 0).toFixed(2)}
          </Text>
        </View>

        {proximoStatus && (
          <TouchableOpacity
            style={styles.botaoAvancar}
            onPress={(e) => {
              e.stopPropagation();
              aoAtualizarStatus(proximoStatus);
            }}
          >
            <Text style={styles.botaoAvancarText}>
              {proximoStatus === 'EM_SEPARACAO' && 'Separar'}
              {proximoStatus === 'ENVIADO' && 'Enviar'}
              {proximoStatus === 'ENTREGUE' && 'Entregar'}
            </Text>
            <Ionicons name="arrow-forward" size={16} color="#fff" />
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cartao: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderLeftWidth: 4,
    borderLeftColor: temaMedico.cores.primaria,
  },
  cabecalho: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  infoContainer: {
    flex: 1,
  },
  numeroPedido: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  dataCliente: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  data: {
    fontSize: 12,
    color: '#999',
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginLeft: 8,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  itens: {
    marginBottom: 12,
    paddingLeft: 8,
  },
  itemText: {
    fontSize: 14,
    color: '#444',
    marginBottom: 4,
  },
  maisItens: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  rodape: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 12,
  },
  valorContainer: {
    flex: 1,
  },
  valorLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  valorTotal: {
    fontSize: 20,
    fontWeight: '700',
    color: temaMedico.cores.primaria,
  },
  botaoAvancar: {
    backgroundColor: temaMedico.cores.primaria,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  botaoAvancarText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
