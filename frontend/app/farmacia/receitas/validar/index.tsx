/**
 * Tela: Validar Receitas - Esculapi
 * Permite que farmacêuticos (ROLE_FARMACEUTICO) aprovem/rejeitem receitas
 * Arquitetura: OOP + Português
 */

import {
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  RefreshControl,
  Modal,
} from 'react-native';
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Text, View } from '@/src/componentes/Themed';
import { ProtectedFarmaciaRoute } from '@/src/componentes/ProtectedFarmaciaRoute';
import { useValidarReceitas } from '../../hooks/useValidarReceitas';
import type { PedidoPendente } from '@/src/servicos/types/api.types';
import { temaMedico } from '@/src/estilos/temaMedico';

export default function TelaValidarReceitas() {
  const {
    carregando,
    atualizando,
    pedidos,
    pedidoSelecionado,
    mostrarModalRejeitar,
    justificativa,
    processando,
    manipuladores,
  } = useValidarReceitas();

  const renderizarPedido = (pedido: PedidoPendente) => {
    const { receita } = pedido;

    return (
      <View key={pedido.id} style={estilos.pedidoCard}>
        <View style={estilos.pedidoCard__header}>
          <View style={estilos.pedidoCard__badge}>
            <Ionicons name="document-text" size={20} color={temaMedico.cores.alerta} />
          </View>
          <View style={estilos.pedidoCard__info}>
            <Text style={estilos.pedidoCard__numero}>Pedido #{pedido.numero}</Text>
            <Text style={estilos.pedidoCard__cliente}>{pedido.clienteNome}</Text>
          </View>
          <Text style={estilos.pedidoCard__valor}>R$ {pedido.total.toFixed(2)}</Text>
        </View>

        {/* Informações do Cliente */}
        <View style={estilos.pedidoCard__detalhes}>
          <View style={estilos.detalhe}>
            <Ionicons name="mail" size={16} color={temaMedico.cores.textoSubtitulo} />
            <Text style={estilos.detalhe__texto}>{pedido.clienteEmail}</Text>
          </View>
          <View style={estilos.detalhe}>
            <Ionicons name="calendar" size={16} color={temaMedico.cores.textoSubtitulo} />
            <Text style={estilos.detalhe__texto}>
              {new Date(pedido.createdAt).toLocaleDateString('pt-BR')}
            </Text>
          </View>
        </View>

        {/* Itens do Pedido */}
        <View style={estilos.pedidoCard__itens}>
          <Text style={estilos.pedidoCard__itensLabel}>Produtos:</Text>
          {pedido.itens.map((item) => (
            <View key={item.id} style={estilos.item}>
              <Text style={estilos.item__nome}>{item.produtoNome}</Text>
              <Text style={estilos.item__detalhes}>
                {item.quantidade}x - R$ {item.precoUnitario.toFixed(2)}
              </Text>
            </View>
          ))}
        </View>

        {/* Receita */}
        {receita && (
          <View style={estilos.receita}>
            <View style={estilos.receita__header}>
              <Ionicons name="medical" size={20} color={temaMedico.cores.primaria} />
              <Text style={estilos.receita__titulo}>Receita Médica</Text>
            </View>
            <TouchableOpacity
              style={estilos.receita__botaoVisualizar}
              onPress={() => manipuladores.aoVisualizarReceita(receita.caminhoArquivo)}
            >
              <Ionicons name="eye" size={16} color={temaMedico.cores.primaria} />
              <Text style={estilos.receita__botaoVisualizarTexto}>Visualizar Receita</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Ações */}
        <View style={estilos.pedidoCard__acoes}>
          <TouchableOpacity
            style={estilos.botao__rejeitar}
            onPress={() => manipuladores.aoIniciarRejeitar(pedido)}
            disabled={processando}
          >
            <Ionicons name="close-circle" size={18} color={temaMedico.cores.erro} />
            <Text style={estilos.botao__rejeitarTexto}>Rejeitar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={estilos.botao__aprovar}
            onPress={() => manipuladores.aoAprovar(pedido)}
            disabled={processando}
          >
            <Ionicons name="checkmark-circle" size={18} color={temaMedico.cores.textoBranco} />
            <Text style={estilos.botao__aprovarTexto}>Aprovar</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
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
          <Text style={estilos.cabecalho__titulo}>Validar Receitas</Text>
          <View style={estilos.cabecalho__espacador} />
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
              <Text style={estilos.carregandoTexto}>Carregando pedidos...</Text>
            </View>
          ) : pedidos.length === 0 ? (
            <View style={estilos.emptyContainer}>
              <Ionicons name="checkmark-done-circle" size={64} color={temaMedico.cores.sucesso} />
              <Text style={estilos.emptyTitulo}>Tudo em dia!</Text>
              <Text style={estilos.emptyDescricao}>
                Não há pedidos com receitas pendentes de validação no momento.
              </Text>
            </View>
          ) : (
            <>
              <View style={estilos.resumo}>
                <Ionicons name="alert-circle" size={24} color={temaMedico.cores.alerta} />
                <Text style={estilos.resumo__texto}>
                  {pedidos.length} {pedidos.length === 1 ? 'receita pendente' : 'receitas pendentes'} de validação
                </Text>
              </View>

              <View style={estilos.lista}>
                {pedidos.map((pedido) => renderPedido(pedido))}
              </View>
            </>
          )}

          {/* Espaço no final */}
          <View style={{ height: 30 }} />
        </ScrollView>

        {/* Modal de Rejeitar */}
        <Modal
          visible={mostrarModalRejeitar}
          transparent
          animationType="fade"
          onRequestClose={() => manipuladores.aoFecharModalRejeitar()}
        >
          <View style={estilos.modalOverlay}>
            <View style={estilos.modalContainer}>
              <View style={estilos.modal__header}>
                <Text style={estilos.modal__titulo}>Rejeitar Receita</Text>
                <TouchableOpacity
                  style={estilos.modal__botaoFechar}
                  onPress={() => manipuladores.aoFecharModalRejeitar()}
                >
                  <Ionicons name="close" size={24} color={temaMedico.cores.textoSubtitulo} />
                </TouchableOpacity>
              </View>

              <Text style={estilos.modal__descricao}>
                Por favor, informe o motivo da rejeição da receita médica:
              </Text>

              <TextInput
                style={estilos.modal__input}
                value={justificativa}
                onChangeText={manipuladores.aoAlterarJustificativa}
                placeholder="Ex: Receita ilegível, dados incompletos, etc."
                placeholderTextColor={temaMedico.cores.textoClaro}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />

              <View style={estilos.modal__botoes}>
                <TouchableOpacity
                  style={estilos.modal__botaoCancelar}
                  onPress={() => manipuladores.aoFecharModalRejeitar()}
                  disabled={processando}
                >
                  <Text style={estilos.modal__botaoCancelarTexto}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.modal__botaoConfirmar,
                    processando && styles.modal__botaoConfirmar_desabilitado,
                  ]}
                  onPress={manipuladores.aoConfirmarRejeitar}
                  disabled={processando}
                >
                  {processando ? (
                    <ActivityIndicator color="#FFF" size="small" />
                  ) : (
                    <Text style={estilos.modal__botaoConfirmarTexto}>Rejeitar Receita</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
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
  cabecalho__titulo: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: temaMedico.cores.textoTitulo,
  },
  cabecalho__espacador: {
    width: 40,
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
  containerVazio: {
    flex: 1,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    paddingTop: 100,
    paddingHorizontal: 32,
  },
  tituloVazio: {
    fontSize: 20,
    fontWeight: '600' as const,
    color: temaMedico.cores.textoTitulo,
    marginTop: 16,
  },
  descricaoVazia: {
    fontSize: 14,
    color: temaMedico.cores.textoSubtitulo,
    marginTop: 8,
    textAlign: 'center' as const,
  },
  resumo: {
    flexDirection: 'row' as const,
    backgroundColor: '#FFF3E0',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    alignItems: 'center' as const,
    borderWidth: 1,
    borderColor: temaMedico.cores.borda,
  },
  resumo__texto: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: temaMedico.cores.alerta,
    marginLeft: 12,
  },
  lista: {
    gap: 12,
  },
  pedidoCard: {
    backgroundColor: temaMedico.cores.backgroundCard,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: temaMedico.cores.borda,
  },
  pedidoCard__header: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    marginBottom: 12,
  },
  pedidoCard__badge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF3E0',
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    marginRight: 12,
  },
  pedidoCard__info: {
    flex: 1,
  },
  pedidoCard__numero: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: temaMedico.cores.textoTitulo,
  },
  pedidoCard__cliente: {
    fontSize: 13,
    color: temaMedico.cores.textoSubtitulo,
    marginTop: 2,
  },
  pedidoCard__valor: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: temaMedico.cores.primaria,
  },
  pedidoCard__detalhes: {
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: temaMedico.cores.borda,
  },
  detalhe: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    marginBottom: 6,
  },
  detalhe__texto: {
    fontSize: 13,
    color: temaMedico.cores.textoSubtitulo,
    marginLeft: 8,
  },
  pedidoCard__itens: {
    marginBottom: 12,
  },
  pedidoCard__itensLabel: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: temaMedico.cores.textoTitulo,
    marginBottom: 8,
  },
  item: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    paddingVertical: 4,
  },
  item__nome: {
    fontSize: 13,
    color: temaMedico.cores.textoTitulo,
    flex: 1,
  },
  item__detalhes: {
    fontSize: 13,
    color: temaMedico.cores.textoSubtitulo,
  },
  receita: {
    backgroundColor: temaMedico.cores.backgroundDestaque,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: temaMedico.cores.borda,
  },
  receita__header: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    marginBottom: 8,
  },
  receita__titulo: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: temaMedico.cores.textoTitulo,
    marginLeft: 8,
  },
  receita__botaoVisualizar: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    backgroundColor: temaMedico.cores.backgroundCard,
    padding: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: temaMedico.cores.borda,
  },
  receita__botaoVisualizarTexto: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: temaMedico.cores.primaria,
    marginLeft: 6,
  },
  pedidoCard__acoes: {
    flexDirection: 'row' as const,
    gap: 12,
  },
  botao__rejeitar: {
    flex: 1,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    backgroundColor: '#FEF2F2',
    padding: 14,
    borderRadius: 8,
  },
  botao__rejeitarTexto: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: temaMedico.cores.erro,
    marginLeft: 6,
  },
  botao__aprovar: {
    flex: 1,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    backgroundColor: temaMedico.cores.sucesso,
    padding: 14,
    borderRadius: 8,
  },
  botao__aprovarTexto: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: temaMedico.cores.textoBranco,
    marginLeft: 6,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    padding: 16,
  },
  modalContainer: {
    backgroundColor: temaMedico.cores.backgroundCard,
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  modal__header: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    marginBottom: 16,
  },
  modal__titulo: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: temaMedico.cores.textoTitulo,
  },
  modal__botaoFechar: {
    padding: 4,
  },
  modal__descricao: {
    fontSize: 14,
    color: temaMedico.cores.textoSubtitulo,
    marginBottom: 16,
  },
  modal__input: {
    backgroundColor: temaMedico.cores.backgroundCard,
    borderWidth: 1,
    borderColor: temaMedico.cores.borda,
    borderRadius: 8,
    padding: 14,
    fontSize: 14,
    color: temaMedico.cores.textoTitulo,
    minHeight: 100,
    marginBottom: 20,
  },
  modal__botoes: {
    flexDirection: 'row' as const,
    gap: 12,
  },
  modal__botaoCancelar: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center' as const,
  },
  modal__botaoCancelarTexto: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: temaMedico.cores.textoSubtitulo,
  },
  modal__botaoConfirmar: {
    flex: 1,
    backgroundColor: temaMedico.cores.erro,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center' as const,
  },
  modal__botaoConfirmar_desabilitado: {
    backgroundColor: temaMedico.cores.textoClaro,
  },
  modal__botaoConfirmarTexto: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: temaMedico.cores.textoBranco,
  },
};
