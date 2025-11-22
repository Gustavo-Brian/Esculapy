/**
 * Pharmacy Dashboard Screen - Nova Arquitetura
 */

import React from 'react';
import { View, ScrollView, Text, TouchableOpacity, FlatList, ActivityIndicator, RefreshControl, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { temaMedico } from '@/src/estilos/temaMedico';
import { ProtectedFarmaciaRoute } from '@/src/componentes/ProtectedFarmaciaRoute';
import { EditarEstoqueModal } from '@/src/componentes/EditarEstoqueModal';
import { AdicionarFarmaceuticoModal } from '@/src/componentes/AdicionarFarmaceuticoModal';
import { Snackbar } from '@/src/componentes/Snackbar';
import { useDashboard } from './hooks/useDashboard';
import { DashboardHeader } from './components/DashboardHeader';
import { TabBar } from './components/TabBar';
import { SecaoAlertas } from './components/SecaoAlertas';
import { GraficoVendas } from './components/GraficoVendas';
import { AcoesRapidas } from './components/AcoesRapidas';
import { CartoesEstatisticas } from './components/CartoesEstatisticas';
import { AdicionarProdutoEstoqueModal } from './components/AdicionarProdutoEstoqueModal';
import { ConfirmarRemocaoModal } from './components/ConfirmarRemocaoModal';
import { CartaoPedido } from './components/CartaoPedido';
import { EditarFarmaceuticoModal } from './components/EditarFarmaceuticoModal';
import { ConfirmarDesativacaoFarmaceuticoModal } from './components/ConfirmarDesativacaoFarmaceuticoModal';

export default function FarmaciaDashboardScreen() {
  const {
    user,
    uiState,
    data,
    produtosFiltrados,
    farmaceuticos,
    loadingFarmaceuticos,
    pedidos,
    loadingPedidos,
    filtroPedidos,
    refreshingFarmaceuticos,
    refreshingPedidos,
    nomeFarmacia,
    snackbar,
    handlers
  } = useDashboard();

  const renderDashboardTab = () => (
    <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
      {/* Cartões de Estatísticas */}
      <CartoesEstatisticas stats={data.estoqueStats} />

      {/* Alertas */}
      <SecaoAlertas alertas={data.alertas} />

      {/* Gráfico de Vendas */}
      <GraficoVendas vendas={data.vendasStats} />

      {/* Ações Rápidas */}
      <AcoesRapidas acoes={data.acoesRapidas} />
    </ScrollView>
  );

  const renderEstoqueTab = () => (
    <View style={styles.content}>
      {/* Botão Adicionar Produto */}
      <TouchableOpacity
        style={styles.addProductButton}
        onPress={handlers.onOpenAdicionarProdutoModal}
      >
        <Ionicons name="add-circle" size={24} color="#FFF" />
        <Text style={styles.addProductButtonText}>Adicionar Produto</Text>
      </TouchableOpacity>

      {/* Filtros de Quantidade */}
      <View style={styles.filtersSection}>
        <Text style={styles.filtersSectionLabel}>Estoque:</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filtersScroll}
          contentContainerStyle={styles.filtersContent}
        >
          {(['todos', 'baixo', 'esgotado'] as const).map((filtro) => (
            <TouchableOpacity
              key={filtro}
              style={[styles.filterChip, uiState.filtroEstoque === filtro && styles.filterChipActive]}
              onPress={() => handlers.onChangeFiltroEstoque(filtro)}
            >
              <Text style={[styles.filterText, uiState.filtroEstoque === filtro && styles.filterTextActive]}>
                {filtro === 'todos' ? 'Todos' : filtro === 'baixo' ? 'Baixo' : 'Esgotado'}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Filtros de Visibilidade */}
      <View style={styles.filtersSection}>
        <Text style={styles.filtersSectionLabel}>Visibilidade:</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filtersScroll}
          contentContainerStyle={styles.filtersContent}
        >
          {(['todos', 'ativos', 'inativos'] as const).map((filtro) => (
            <TouchableOpacity
              key={filtro}
              style={[
                styles.filterChip,
                uiState.filtroVisibilidade === filtro && styles.filterChipActive
              ]}
              onPress={() => handlers.onChangeFiltroVisibilidade(filtro)}
            >
              <Ionicons
                name={filtro === 'todos' ? 'eye' : filtro === 'ativos' ? 'eye-outline' : 'eye-off-outline'}
                size={14}
                color={uiState.filtroVisibilidade === filtro ? '#FFF' : temaMedico.cores.textoSecundario}
                style={{marginRight: 4}}
              />
              <Text style={[styles.filterText, uiState.filtroVisibilidade === filtro && styles.filterTextActive]}>
                {filtro === 'todos' ? 'Todos' : filtro === 'ativos' ? 'Ativos' : 'Inativos'}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Total de Produtos */}
      <View style={styles.countContainer}>
        <Text style={styles.countText}>
          {produtosFiltrados.length} {produtosFiltrados.length === 1 ? 'produto' : 'produtos'}
        </Text>
      </View>

      {/* Lista de Produtos */}
      <FlatList
        data={produtosFiltrados}
        keyExtractor={(item) => item.estoqueId.toString()}
        ListEmptyComponent={() => (
          <View style={styles.emptyListContainer}>
            <Ionicons name="cube-outline" size={64} color={temaMedico.cores.textoClaro} />
            <Text style={styles.emptyListText}>Nenhum produto no estoque</Text>
            <Text style={styles.emptyListSubtext}>
              Toque no botão acima para adicionar produtos
            </Text>
          </View>
        )}
        renderItem={({ item }) => (
          <View style={[styles.produtoCard, item.ativo === false && styles.produtoCardInativo]}>
            <TouchableOpacity
              style={styles.produtoCardMain}
              onPress={() => handlers.onEditarProduto(item)}
            >
              <View style={styles.produtoInfo}>
                <Text style={[styles.produtoNome, item.ativo === false && styles.produtoNomeInativo]}>
                  {item.produtoNome || 'Produto sem nome'}
                </Text>
                <View style={styles.produtoDetails}>
                  <View style={[
                    styles.statusBadge,
                    item.ativo === false ? styles.statusInativo :
                    item.quantidade === 0 ? styles.statusEsgotado :
                    item.quantidade < 10 ? styles.statusBaixo : styles.statusNormal
                  ]}>
                    <Text style={styles.statusText}>
                      {item.ativo === false ? 'Inativo' :
                       item.quantidade === 0 ? 'Esgotado' :
                       item.quantidade < 10 ? 'Baixo' : 'Normal'}
                    </Text>
                  </View>
                  <Text style={[styles.produtoQtd, item.ativo === false && styles.produtoQtdInativo]}>
                    Qtd: {item.quantidade}
                  </Text>
                </View>
              </View>
              <View style={styles.produtoActions}>
                <Text style={[styles.produtoPreco, item.ativo === false && styles.produtoPrecoInativo]}>
                  R$ {item.preco.toFixed(2)}
                </Text>
                <Ionicons name="chevron-forward" size={20} color={temaMedico.cores.textoClaro} />
              </View>
            </TouchableOpacity>

            {/* Botão Ativar/Desativar */}
            <TouchableOpacity
              style={[styles.toggleButton, item.ativo === false && styles.toggleButtonInactive]}
              onPress={() => handlers.onToggleAtivo(item)}
            >
              <Ionicons
                name={item.ativo === false ? 'eye-off' : 'eye'}
                size={22}
                color={item.ativo === false ? '#999' : temaMedico.cores.sucesso}
              />
            </TouchableOpacity>

            {/* Botão Remover */}
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handlers.onRemoverProduto(item)}
            >
              <Ionicons name="trash-outline" size={20} color={temaMedico.cores.erro} />
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );

  const renderPedidosTab = () => (
    <View style={styles.content}>
      {/* Filtros de Pedidos */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filtersScroll}
        contentContainerStyle={styles.filtersContent}
      >
        {(['TODOS', 'AGUARDANDO_PAGAMENTO', 'AGUARDANDO_RECEITA', 'CONFIRMADO', 'EM_PREPARACAO', 'PRONTO_PARA_ENTREGA', 'EM_TRANSPORTE', 'ENTREGUE'] as const).map((filtro) => (
          <TouchableOpacity
            key={filtro}
            style={[styles.filterChip, filtroPedidos === filtro && styles.filterChipActive]}
            onPress={() => handlers.onChangeFiltroPedidos(filtro)}
          >
            <Text style={[styles.filterText, filtroPedidos === filtro && styles.filterTextActive]}>
              {filtro === 'TODOS' ? 'Todos' :
               filtro === 'AGUARDANDO_PAGAMENTO' ? 'Aguardando Pagamento' :
               filtro === 'AGUARDANDO_RECEITA' ? 'Aguardando Receita' :
               filtro === 'CONFIRMADO' ? 'Confirmado' :
               filtro === 'EM_PREPARACAO' ? 'Em Preparação' :
               filtro === 'PRONTO_PARA_ENTREGA' ? 'Pronto p/ Entrega' :
               filtro === 'EM_TRANSPORTE' ? 'Em Transporte' :
               'Entregue'}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Total de Pedidos */}
      <View style={styles.countContainer}>
        <Text style={styles.countText}>
          {pedidos.length} {pedidos.length === 1 ? 'pedido' : 'pedidos'}
        </Text>
      </View>

      {loadingPedidos && !refreshingPedidos ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={temaMedico.cores.primaria} />
          <Text style={styles.loadingText}>Carregando pedidos...</Text>
        </View>
      ) : pedidos.length === 0 ? (
        <View style={styles.emptyListContainer}>
          <Ionicons name="receipt-outline" size={64} color={temaMedico.cores.textoClaro} />
          <Text style={styles.emptyListText}>Nenhum pedido {filtroPedidos !== 'TODOS' ? 'neste status' : 'no momento'}</Text>
          <Text style={styles.emptyListSubtext}>
            {filtroPedidos !== 'TODOS' ? 'Selecione outro filtro para ver mais pedidos' : 'Os pedidos dos clientes aparecerão aqui'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={pedidos}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <CartaoPedido
              pedido={item}
              aoClicarDetalhes={() => handlers.onVerDetalhesPedido(item.id)}
              aoAtualizarStatus={(novoStatus) => handlers.onAtualizarStatusPedido(item.id, novoStatus as 'EM_SEPARACAO' | 'ENVIADO' | 'ENTREGUE')}
            />
          )}
          contentContainerStyle={styles.farmaceuticosList}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshingPedidos}
              onRefresh={handlers.onRefreshPedidos}
              colors={[temaMedico.cores.primaria]}
              tintColor={temaMedico.cores.primaria}
            />
          }
        />
      )}
    </View>
  );

  const renderFarmaceuticosTab = () => (
    <View style={styles.content}>
      <TouchableOpacity style={styles.addButton} onPress={handlers.onOpenFarmaceuticoModal}>
        <Ionicons name="add-circle-outline" size={24} color="#FFF" />
        <Text style={styles.addButtonText}>Adicionar Farmacêutico</Text>
      </TouchableOpacity>

      {/* Total de Farmacêuticos */}
      <View style={styles.countContainer}>
        <Text style={styles.countText}>
          {farmaceuticos.length} {farmaceuticos.length === 1 ? 'farmacêutico' : 'farmacêuticos'} na equipe
        </Text>
      </View>

      {loadingFarmaceuticos && !refreshingFarmaceuticos ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={temaMedico.cores.primaria} />
          <Text style={styles.loadingText}>Carregando equipe...</Text>
        </View>
      ) : (
        <FlatList
          data={farmaceuticos}
          keyExtractor={(item) => item.id.toString()}
          ListEmptyComponent={() => (
            <View style={styles.emptyListContainer}>
              <Ionicons name="people-outline" size={64} color={temaMedico.cores.textoClaro} />
              <Text style={styles.emptyListText}>Nenhum farmacêutico cadastrado</Text>
              <Text style={styles.emptyListSubtext}>
                Toque no botão acima para adicionar farmacêuticos à sua equipe
              </Text>
            </View>
          )}
          renderItem={({ item }) => (
            <View style={styles.farmaceuticoCard}>
              <View style={styles.farmaceuticoIconContainer}>
                <Ionicons name="person-circle" size={48} color={item.ativo ? temaMedico.cores.primaria : temaMedico.cores.textoClaro} />
              </View>
              <View style={styles.farmaceuticoInfo}>
                <View style={styles.farmaceuticoHeader}>
                  <Text style={[styles.farmaceuticoNome, !item.ativo && styles.farmaceuticoNomeInativo]}>
                    {item.nome}
                  </Text>
                  <View style={[styles.statusBadge, item.ativo ? styles.statusFarmaceuticoAtivo : styles.statusFarmaceuticoInativo]}>
                    <Text style={styles.statusBadgeText}>
                      {item.ativo ? 'Ativo' : 'Inativo'}
                    </Text>
                  </View>
                </View>
                <View style={styles.farmaceuticoDetails}>
                  <View style={styles.farmaceuticoDetailRow}>
                    <Ionicons name="mail" size={14} color={temaMedico.cores.textoSecundario} />
                    <Text style={styles.farmaceuticoDetailText}>{item.email}</Text>
                  </View>
                  <View style={styles.farmaceuticoDetailRow}>
                    <Ionicons name="medical" size={14} color={temaMedico.cores.textoSecundario} />
                    <Text style={styles.farmaceuticoDetailText}>CRF: {item.crfP}</Text>
                  </View>
                  {item.numeroCelular && (
                    <View style={styles.farmaceuticoDetailRow}>
                      <Ionicons name="call" size={14} color={temaMedico.cores.textoSecundario} />
                      <Text style={styles.farmaceuticoDetailText}>{item.numeroCelular}</Text>
                    </View>
                  )}
                  {item.cpf && (
                    <View style={styles.farmaceuticoDetailRow}>
                      <Ionicons name="card" size={14} color={temaMedico.cores.textoSecundario} />
                      <Text style={styles.farmaceuticoDetailText}>CPF: {item.cpf}</Text>
                    </View>
                  )}
                </View>
                <View style={styles.farmaceuticoActions}>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.editButton]}
                    onPress={() => handlers.onEditarFarmaceutico(item)}
                  >
                    <Ionicons name="create-outline" size={18} color={temaMedico.cores.primaria} />
                    <Text style={styles.editButtonText}>Editar</Text>
                  </TouchableOpacity>
                  {item.ativo ? (
                    <TouchableOpacity
                      style={[styles.actionButton, styles.desativarButton]}
                      onPress={() => handlers.onDesativarFarmaceutico(item)}
                    >
                      <Ionicons name="remove-circle-outline" size={18} color={temaMedico.cores.erro} />
                      <Text style={styles.desativarButtonText}>Desativar</Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      style={[styles.actionButton, styles.reativarButton]}
                      onPress={() => handlers.onReativarFarmaceutico(item)}
                    >
                      <Ionicons name="checkmark-circle-outline" size={18} color={temaMedico.cores.sucesso} />
                      <Text style={styles.reativarButtonText}>Reativar</Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity
                    style={[styles.actionButton, styles.excluirButton]}
                    onPress={() => handlers.onExcluirFarmaceutico(item)}
                  >
                    <Ionicons name="trash-outline" size={18} color="#FF6B6B" />
                    <Text style={styles.excluirButtonText}>Excluir</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
          contentContainerStyle={styles.farmaceuticosList}
          refreshControl={
            <RefreshControl
              refreshing={refreshingFarmaceuticos}
              onRefresh={handlers.onRefreshFarmaceuticos}
              colors={[temaMedico.cores.primaria]}
              tintColor={temaMedico.cores.primaria}
            />
          }
        />
      )}
    </View>
  );

  return (
    <ProtectedFarmaciaRoute>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        <DashboardHeader userName={user?.name || user?.email || 'Farmácia'} onLogout={handlers.onLogout} />

        {/* Título com Nome da Farmácia */}
        {nomeFarmacia && (
          <View style={styles.farmaciaNameContainer}>
            <Ionicons name="storefront" size={20} color={temaMedico.cores.primaria} />
            <Text style={styles.farmaciaNameText}>{nomeFarmacia}</Text>
          </View>
        )}

        <TabBar activeTab={uiState.tabAtiva} onChangeTab={handlers.onChangeTab} />

        {data.loadingStats ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={temaMedico.cores.primaria} />
          </View>
        ) : (
          <>
            {uiState.tabAtiva === 'dashboard' && renderDashboardTab()}
            {uiState.tabAtiva === 'estoque' && renderEstoqueTab()}
            {uiState.tabAtiva === 'pedidos' && renderPedidosTab()}
            {uiState.tabAtiva === 'farmaceuticos' && renderFarmaceuticosTab()}
          </>
        )}

        <EditarEstoqueModal
          visible={uiState.editModalVisible}
          produto={uiState.produtoEditando}
          onClose={handlers.onCloseEditModal}
          onSubmit={handlers.onSalvarEdicao}
        />

        <AdicionarFarmaceuticoModal
          visible={uiState.farmaceuticoModalVisible}
          onClose={handlers.onCloseFarmaceuticoModal}
          onSubmit={handlers.onAdicionarFarmaceutico}
        />

        <AdicionarProdutoEstoqueModal
          visible={uiState.adicionarProdutoModalVisible}
          onClose={handlers.onCloseAdicionarProdutoModal}
          onSubmit={handlers.onAdicionarProduto}
          produtosNoEstoque={data.produtosEstoque}
        />

        <ConfirmarRemocaoModal
          visible={uiState.removerProdutoModalVisible}
          produto={uiState.produtoRemovendo}
          onConfirm={handlers.onConfirmarRemocao}
          onCancel={handlers.onCloseRemoverProdutoModal}
          onZerarEstoque={handlers.onZerarEstoque}
          mostrarOpcaoZerar={uiState.mostrarOpcaoZerarEstoque}
        />

        <EditarFarmaceuticoModal
          visible={uiState.editarFarmaceuticoModalVisible}
          farmaceutico={uiState.farmaceuticoEditando}
          onSave={handlers.onSalvarEdicaoFarmaceutico}
          onCancel={handlers.onCloseEditarFarmaceuticoModal}
        />

        <ConfirmarDesativacaoFarmaceuticoModal
          visible={uiState.desativarFarmaceuticoModalVisible}
          farmaceutico={uiState.farmaceuticoDesativando}
          onConfirm={handlers.onConfirmarDesativacaoFarmaceutico}
          onCancel={handlers.onCloseDesativarFarmaceuticoModal}
        />

        <Snackbar
          visible={snackbar.visible}
          message={snackbar.message}
          type={snackbar.type}
          onDismiss={() => {}}
        />
      </View>
    </ProtectedFarmaciaRoute>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: temaMedico.cores.background,
  },
  farmaciaNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: temaMedico.cores.backgroundCard,
    borderBottomWidth: 1,
    borderBottomColor: temaMedico.cores.borda,
    gap: 8,
  },
  farmaciaNameText: {
    fontSize: 18,
    fontWeight: '700',
    color: temaMedico.cores.textoPrimario,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  addProductButton: {
    flexDirection: 'row',
    backgroundColor: temaMedico.cores.primaria,
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    gap: 8,
  },
  addProductButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFF',
  },
  filtersRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  filtersSection: {
    marginBottom: 12,
  },
  filtersSectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: temaMedico.cores.textoSecundario,
    marginBottom: 8,
    marginLeft: 4,
  },
  filtersScroll: {
    flex: 1,
  },
  filtersContent: {
    gap: 8,
    paddingRight: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: temaMedico.cores.backgroundInput,
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterChipActive: {
    backgroundColor: temaMedico.cores.primaria,
  },
  filterText: {
    fontSize: 13,
    fontWeight: '600',
    color: temaMedico.cores.textoSubtitulo,
  },
  filterTextActive: {
    color: '#FFF',
  },
  sortContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: temaMedico.cores.backgroundInput,
    justifyContent: 'center',
    alignItems: 'center',
  },
  countContainer: {
    marginBottom: 12,
  },
  countText: {
    fontSize: 14,
    fontWeight: '600',
    color: temaMedico.cores.textoSubtitulo,
  },
  produtoCard: {
    flexDirection: 'row',
    backgroundColor: temaMedico.cores.backgroundCard,
    borderRadius: 12,
    marginBottom: 8,
    overflow: 'hidden',
  },
  produtoCardInativo: {
    opacity: 0.6,
  },
  produtoCardMain: {
    flex: 1,
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
  },
  produtoInfo: {
    flex: 1,
    gap: 8,
  },
  produtoNome: {
    fontSize: 16,
    fontWeight: '600',
    color: temaMedico.cores.textoTitulo,
  },
  produtoNomeInativo: {
    color: temaMedico.cores.textoClaro,
    textDecorationLine: 'line-through',
  },
  produtoDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusNormal: {
    backgroundColor: `${temaMedico.cores.sucesso}15`,
  },
  statusBaixo: {
    backgroundColor: `${temaMedico.cores.alerta}15`,
  },
  statusEsgotado: {
    backgroundColor: `${temaMedico.cores.erro}15`,
  },
  statusInativo: {
    backgroundColor: '#95959515',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
    color: temaMedico.cores.textoTitulo,
  },
  produtoQtd: {
    fontSize: 13,
    color: temaMedico.cores.textoSubtitulo,
    fontWeight: '600',
  },
  produtoQtdInativo: {
    color: temaMedico.cores.textoClaro,
  },
  produtoActions: {
    alignItems: 'flex-end',
    gap: 4,
  },
  produtoPreco: {
    fontSize: 18,
    fontWeight: '700',
    color: temaMedico.cores.primaria,
  },
  produtoPrecoInativo: {
    color: temaMedico.cores.textoClaro,
  },
  toggleButton: {
    width: 50,
    backgroundColor: `${temaMedico.cores.sucesso}20`,
    justifyContent: 'center',
    alignItems: 'center',
    borderLeftWidth: 1,
    borderLeftColor: `${temaMedico.cores.sucesso}30`,
  },
  toggleButtonInactive: {
    backgroundColor: `${temaMedico.cores.textoClaro}20`,
    borderLeftColor: `${temaMedico.cores.textoClaro}30`,
  },
  deleteButton: {
    width: 60,
    backgroundColor: `${temaMedico.cores.erro}10`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyListContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    gap: 12,
  },
  emptyListText: {
    fontSize: 18,
    fontWeight: '700',
    color: temaMedico.cores.textoTitulo,
  },
  emptyListSubtext: {
    fontSize: 14,
    color: temaMedico.cores.textoSubtitulo,
    textAlign: 'center',
  },
  addButton: {
    flexDirection: 'row',
    backgroundColor: temaMedico.cores.primaria,
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    gap: 8,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: temaMedico.cores.textoSubtitulo,
    marginTop: 16,
  },
  loadingText: {
    fontSize: 14,
    color: temaMedico.cores.textoSecundario,
    marginTop: 12,
  },
  farmaceuticosList: {
    paddingBottom: 16,
  },
  farmaceuticoCard: {
    flexDirection: 'row',
    backgroundColor: temaMedico.cores.backgroundCard,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    gap: 12,
  },
  farmaceuticoIconContainer: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  farmaceuticoInfo: {
    flex: 1,
    gap: 8,
  },
  farmaceuticoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  farmaceuticoNome: {
    fontSize: 16,
    fontWeight: '700',
    color: temaMedico.cores.textoTitulo,
  },
  farmaceuticoNomeInativo: {
    color: temaMedico.cores.textoClaro,
    textDecorationLine: 'line-through',
  },
  farmaceuticoDetails: {
    gap: 6,
  },
  farmaceuticoDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  farmaceuticoDetailText: {
    fontSize: 13,
    color: temaMedico.cores.textoSecundario,
  },
  farmaceuticoActions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  editButton: {
    borderColor: temaMedico.cores.primaria,
    backgroundColor: `${temaMedico.cores.primaria}10`,
  },
  editButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: temaMedico.cores.primaria,
  },
  desativarButton: {
    borderColor: temaMedico.cores.erro,
    backgroundColor: `${temaMedico.cores.erro}10`,
  },
  desativarButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: temaMedico.cores.erro,
  },
  reativarButton: {
    borderColor: temaMedico.cores.sucesso,
    backgroundColor: `${temaMedico.cores.sucesso}10`,
  },
  reativarButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: temaMedico.cores.sucesso,
  },
  excluirButton: {
    borderColor: '#FF6B6B',
    backgroundColor: '#FF6B6B15',
  },
  excluirButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FF6B6B',
  },
  statusFarmaceuticoAtivo: {
    backgroundColor: `${temaMedico.cores.sucesso}15`,
  },
  statusFarmaceuticoInativo: {
    backgroundColor: `${temaMedico.cores.textoClaro}15`,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: temaMedico.cores.textoTitulo,
  },
});
