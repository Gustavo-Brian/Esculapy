/**
 * Tela: Adicionar Produto ao Estoque - Esculapi
 * Permite que o dono da farmácia (ROLE_LOJISTA_ADMIN) adicione produtos ao estoque
 * Arquitetura: OOP + Português
 */

import { ScrollView, TouchableOpacity, TextInput, ActivityIndicator, FlatList, Modal } from 'react-native';
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Text, View } from '@/src/componentes/Themed';
import { ProtectedFarmaciaRoute } from '@/src/componentes/ProtectedFarmaciaRoute';
import { Toast } from '@/src/componentes/Toast';
import { useAdicionarEstoque } from '../../hooks/useAdicionarEstoque';
import { temaMedico } from '@/src/estilos/temaMedico';

export default function TelaAdicionarEstoque() {
  const {
    carregando,
    carregandoProdutos,
    produtoSelecionado,
    modalVisivel,
    buscaProduto,
    dadosFormulario,
    erros,
    produtosFiltrados,
    toastState,
    hideToast,
    manipuladores,
  } = useAdicionarEstoque();

  return (
    <ProtectedFarmaciaRoute>
      <Stack.Screen options={{ headerShown: false }} />
      <Toast
        visible={toastState.visible}
        message={toastState.message}
        type={toastState.type}
        onHide={hideToast}
      />
      <View style={estilos.pagina}>
        {/* Cabeçalho */}
        <View style={estilos.cabecalho}>
          <TouchableOpacity style={estilos.cabecalho__botaoVoltar} onPress={manipuladores.aoVoltar}>
            <Ionicons name="arrow-back" size={24} color={temaMedico.cores.primaria} />
          </TouchableOpacity>
          <Text style={estilos.cabecalho__titulo}>Adicionar ao Estoque</Text>
          <View style={estilos.cabecalho__espacador} />
        </View>

        <ScrollView style={estilos.conteudo} showsVerticalScrollIndicator={false}>
          {/* Informações */}
          <View style={estilos.caixaInfo}>
            <Ionicons name="information-circle" size={24} color={temaMedico.cores.primaria} />
            <Text style={estilos.caixaInfo__texto}>
              Selecione um produto do catálogo e defina o preço de venda e quantidade disponível.
            </Text>
          </View>

          {/* Formulário */}
          <View style={estilos.formulario}>
            {/* Seleção de Produto */}
            <View style={estilos.campo__grupo}>
              <Text style={estilos.campo__rotulo}>
                Produto <Text style={estilos.campo__obrigatorio}>*</Text>
              </Text>
              <TouchableOpacity
                style={[estilos.campo, estilos.campoSelecao, erros.produtoId && estilos.campo_erro]}
                onPress={manipuladores.aoAbrirModal}
                disabled={carregando}
              >
                {produtoSelecionado ? (
                  <View style={estilos.produtoSelecionadoContainer}>
                    <View>
                      <Text style={estilos.produtoSelecionadoNome}>{produtoSelecionado.nome}</Text>
                      <Text style={estilos.produtoSelecionadoId}>ID: {produtoSelecionado.id}</Text>
                    </View>
                    <Ionicons name="chevron-down" size={20} color={temaMedico.cores.textoSecundario} />
                  </View>
                ) : (
                  <View style={estilos.produtoSelecionadoContainer}>
                    <Text style={estilos.textoPlaceholder}>Selecione um produto</Text>
                    <Ionicons name="chevron-down" size={20} color={temaMedico.cores.textoClaro} />
                  </View>
                )}
              </TouchableOpacity>
              {erros.produtoId && <Text style={estilos.campo__erro}>{erros.produtoId}</Text>}
              <Text style={estilos.campo__ajuda}>
                Toque para selecionar um produto do catálogo
              </Text>
            </View>

            {/* Preço */}
            <View style={estilos.campo__grupo}>
              <Text style={estilos.campo__rotulo}>
                Preço (R$) <Text style={estilos.campo__obrigatorio}>*</Text>
              </Text>
              <TextInput
                style={[estilos.campo, erros.preco && estilos.campo_erro]}
                value={dadosFormulario.preco}
                onChangeText={(text) => manipuladores.aoAlterarCampo('preco', text)}
                placeholder="Ex: 29.90"
                placeholderTextColor={temaMedico.cores.textoClaro}
                keyboardType="decimal-pad"
                editable={!carregando}
              />
              {erros.preco && <Text style={estilos.campo__erro}>{erros.preco}</Text>}
              <Text style={estilos.campo__ajuda}>Preço de venda do produto na sua farmácia</Text>
            </View>

            {/* Quantidade */}
            <View style={estilos.campo__grupo}>
              <Text style={estilos.campo__rotulo}>
                Quantidade <Text style={estilos.campo__obrigatorio}>*</Text>
              </Text>
              <TextInput
                style={[estilos.campo, erros.quantidade && estilos.campo_erro]}
                value={dadosFormulario.quantidade}
                onChangeText={(text) => manipuladores.aoAlterarCampo('quantidade', text)}
                placeholder="Ex: 50"
                placeholderTextColor={temaMedico.cores.textoClaro}
                keyboardType="numeric"
                editable={!carregando}
              />
              {erros.quantidade && <Text style={estilos.campo__erro}>{erros.quantidade}</Text>}
              <Text style={estilos.campo__ajuda}>
                Quantidade disponível em estoque
              </Text>
            </View>
          </View>

          {/* Botão de Adicionar */}
          <TouchableOpacity
            style={[estilos.botao__adicionar, carregando && estilos.botao__adicionar_desabilitado]}
            onPress={manipuladores.aoSubmeter}
            disabled={carregando}
          >
            {carregando ? (
              <ActivityIndicator color="#FFF" size="small" />
            ) : (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Ionicons name="add-circle" size={20} color="#FFF" />
                <Text style={estilos.botao__adicionarTexto}>Adicionar ao Estoque</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Espaço no final */}
          <View style={{ height: 30 }} />
        </ScrollView>

        {/* Modal de Seleção de Produto */}
        <Modal
          visible={modalVisivel}
          animationType="slide"
          transparent={false}
          onRequestClose={manipuladores.aoFecharModal}
        >
          <View style={estilos.modalContainer}>
            {/* Header do Modal */}
            <View style={estilos.modalHeader}>
              <Text style={estilos.modalTitulo}>Selecionar Produto</Text>
              <TouchableOpacity onPress={manipuladores.aoFecharModal}>
                <Ionicons name="close" size={28} color={temaMedico.cores.textoPrimario} />
              </TouchableOpacity>
            </View>

            {/* Busca */}
            <View style={estilos.modalBusca}>
              <Ionicons name="search" size={20} color={temaMedico.cores.textoSecundario} />
              <TextInput
                style={estilos.modalBuscaInput}
                value={buscaProduto}
                onChangeText={manipuladores.aoAlterarBusca}
                placeholder="Buscar por nome ou ID"
                placeholderTextColor={temaMedico.cores.textoClaro}
              />
            </View>

            {/* Lista de Produtos */}
            {carregandoProdutos ? (
              <View style={estilos.modalLoading}>
                <ActivityIndicator size="large" color={temaMedico.cores.primaria} />
                <Text style={estilos.modalLoadingTexto}>Carregando produtos...</Text>
              </View>
            ) : (
              <FlatList
                data={produtosFiltrados}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={estilos.modalProdutoItem}
                    onPress={() => manipuladores.aoSelecionarProduto(item)}
                  >
                    <View style={estilos.modalProdutoIcone}>
                      <Ionicons name="medical" size={24} color={temaMedico.cores.primaria} />
                    </View>
                    <View style={estilos.modalProdutoInfo}>
                      <Text style={estilos.modalProdutoNome}>{item.nome}</Text>
                      <Text style={estilos.modalProdutoId}>ID: {item.id} | EAN: {item.ean}</Text>
                      {item.laboratorio && (
                        <Text style={estilos.modalProdutoDescricao} numberOfLines={1}>
                          Lab: {item.laboratorio}
                        </Text>
                      )}
                      {item.principioAtivo && (
                        <Text style={estilos.modalProdutoDescricao} numberOfLines={1}>
                          Princípio Ativo: {item.principioAtivo}
                        </Text>
                      )}
                    </View>
                    <Ionicons name="chevron-forward" size={20} color={temaMedico.cores.textoSecundario} />
                  </TouchableOpacity>
                )}
                ListEmptyComponent={
                  <View style={estilos.modalVazio}>
                    <Ionicons name="search-outline" size={48} color={temaMedico.cores.textoClaro} />
                    <Text style={estilos.modalVazioTexto}>
                      {buscaProduto ? 'Nenhum produto encontrado' : 'Catálogo vazio'}
                    </Text>
                  </View>
                }
              />
            )}
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
  caixaInfo: {
    flexDirection: 'row' as const,
    backgroundColor: temaMedico.cores.backgroundDestaque,
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: temaMedico.cores.borda,
  },
  caixaInfo__texto: {
    flex: 1,
    fontSize: 14,
    color: temaMedico.cores.primaria,
    marginLeft: 12,
    lineHeight: 20,
  },
  formulario: {
    backgroundColor: temaMedico.cores.backgroundCard,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: temaMedico.cores.borda,
  },
  campo__grupo: {
    marginBottom: 20,
  },
  campo__rotulo: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: temaMedico.cores.textoTitulo,
    marginBottom: 8,
  },
  campo__obrigatorio: {
    color: temaMedico.cores.erro,
  },
  campo: {
    backgroundColor: temaMedico.cores.backgroundCard,
    borderWidth: 1,
    borderColor: temaMedico.cores.borda,
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
    color: temaMedico.cores.textoTitulo,
  },
  campo_erro: {
    borderColor: temaMedico.cores.erro,
    backgroundColor: '#FEF2F2',
  },
  campo__erro: {
    fontSize: 12,
    color: temaMedico.cores.erro,
    marginTop: 4,
  },
  campo__ajuda: {
    fontSize: 12,
    color: temaMedico.cores.textoSubtitulo,
    marginTop: 4,
  },
  botao__adicionar: {
    flexDirection: 'row' as const,
    backgroundColor: temaMedico.cores.primaria,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  botao__adicionar_desabilitado: {
    backgroundColor: temaMedico.cores.textoClaro,
  },
  botao__adicionarTexto: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: temaMedico.cores.textoBranco,
  },
  // Estilos para seleção de produto
  campoSelecao: {
    justifyContent: 'center' as const,
  },
  produtoSelecionadoContainer: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
  },
  produtoSelecionadoNome: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: temaMedico.cores.textoTitulo,
  },
  produtoSelecionadoId: {
    fontSize: 12,
    color: temaMedico.cores.textoSecundario,
    marginTop: 2,
  },
  textoPlaceholder: {
    fontSize: 16,
    color: temaMedico.cores.textoClaro,
  },
  // Modal
  modalContainer: {
    flex: 1,
    backgroundColor: temaMedico.cores.background,
  },
  modalHeader: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: temaMedico.cores.backgroundCard,
    borderBottomWidth: 1,
    borderBottomColor: temaMedico.cores.borda,
  },
  modalTitulo: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: temaMedico.cores.textoTitulo,
  },
  modalBusca: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    backgroundColor: temaMedico.cores.backgroundCard,
    margin: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: temaMedico.cores.borda,
  },
  modalBuscaInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: temaMedico.cores.textoTitulo,
  },
  modalLoading: {
    flex: 1,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  modalLoadingTexto: {
    marginTop: 12,
    fontSize: 14,
    color: temaMedico.cores.textoSecundario,
  },
  modalProdutoItem: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    backgroundColor: temaMedico.cores.backgroundCard,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: temaMedico.cores.borda,
  },
  modalProdutoIcone: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: temaMedico.cores.backgroundDestaque,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    marginRight: 12,
  },
  modalProdutoInfo: {
    flex: 1,
  },
  modalProdutoNome: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: temaMedico.cores.textoTitulo,
    marginBottom: 2,
  },
  modalProdutoId: {
    fontSize: 12,
    color: temaMedico.cores.textoSecundario,
  },
  modalProdutoDescricao: {
    fontSize: 13,
    color: temaMedico.cores.textoSecundario,
    marginTop: 4,
  },
  modalVazio: {
    padding: 40,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  modalVazioTexto: {
    marginTop: 12,
    fontSize: 16,
    color: temaMedico.cores.textoSecundario,
    textAlign: 'center' as const,
  },
};
