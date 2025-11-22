/**
 * Tela: Gerenciar Estoque - Esculapi
 * Permite que o dono da farmácia (ROLE_LOJISTA_ADMIN) gerencie o estoque
 * Arquitetura: OOP + Português
 */

import {
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Text, View } from '@/src/componentes/Themed';
import { ProtectedFarmaciaRoute } from '@/src/componentes/ProtectedFarmaciaRoute';
import { Toast } from '@/src/componentes/Toast';
import { useGerenciarEstoque } from '../../hooks/useGerenciarEstoque';
import type { EstoqueItem } from '@/src/servicos/types/api.types';
import { temaMedico } from '@/src/estilos/temaMedico';

export default function TelaGerenciarEstoque() {
  const {
    carregando,
    atualizando,
    estoque,
    editandoId,
    editandoPreco,
    editandoQuantidade,
    toastState,
    hideToast,
    manipuladores,
  } = useGerenciarEstoque();

  const renderizarItemEstoque = (item: EstoqueItem) => {
    const estaEditando = editandoId === item.id;

    return (
      <View key={item.id} style={estilos.estoqueItem}>
        <View style={estilos.estoqueItem__header}>
          <View style={estilos.estoqueItem__icone}>
            <Ionicons name="medical" size={24} color={temaMedico.cores.primaria} />
          </View>
          <View style={estilos.estoqueItem__info}>
            <View style={estilos.estoqueItem__nomeContainer}>
              <Text style={estilos.estoqueItem__nome}>{item.produtoNome}</Text>
              <View style={[
                estilos.estoqueItem__statusBadge,
                item.ativo ? estilos.estoqueItem__statusBadge_ativo : estilos.estoqueItem__statusBadge_inativo
              ]}>
                <Text style={[
                  estilos.estoqueItem__statusBadgeTexto,
                  item.ativo ? estilos.estoqueItem__statusBadgeTexto_ativo : estilos.estoqueItem__statusBadgeTexto_inativo
                ]}>
                  {item.ativo ? 'Ativo' : 'Inativo'}
                </Text>
              </View>
            </View>
            {item.produtoDescricao && (
              <Text style={estilos.estoqueItem__descricao} numberOfLines={1}>
                {item.produtoDescricao}
              </Text>
            )}
          </View>
        </View>

        {estaEditando ? (
          <View style={estilos.estoqueItem__edicao}>
            <View style={estilos.edicao__campos}>
              <View style={estilos.edicao__campo}>
                <Text style={estilos.edicao__label}>Preço (R$)</Text>
                <TextInput
                  style={estilos.edicao__input}
                  value={editandoPreco}
                  onChangeText={manipuladores.aoAlterarPreco}
                  keyboardType="decimal-pad"
                  placeholder="0.00"
                  placeholderTextColor={temaMedico.cores.textoClaro}
                />
              </View>
              <View style={estilos.edicao__campo}>
                <Text style={estilos.edicao__label}>Quantidade</Text>
                <TextInput
                  style={estilos.edicao__input}
                  value={editandoQuantidade}
                  onChangeText={manipuladores.aoAlterarQuantidade}
                  keyboardType="numeric"
                  placeholder="0"
                  placeholderTextColor={temaMedico.cores.textoClaro}
                />
              </View>
            </View>
            <View style={estilos.edicao__botoes}>
              <TouchableOpacity
                style={estilos.edicao__botaoCancelar}
                onPress={manipuladores.aoCancelarEdicao}
              >
                <Text style={estilos.edicao__botaoCancelarTexto}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={estilos.edicao__botaoSalvar}
                onPress={() => manipuladores.aoSalvarEdicao(item.id)}
              >
                <Text style={estilos.edicao__botaoSalvarTexto}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <>
            <View style={estilos.estoqueItem__detalhes}>
              <View style={estilos.estoqueItem__detalhe}>
                <Text style={estilos.estoqueItem__detalheLabel}>Preço</Text>
                <Text style={estilos.estoqueItem__detalheValor}>
                  R$ {item.preco.toFixed(2)}
                </Text>
              </View>
              <View style={estilos.estoqueItem__detalhe}>
                <Text style={estilos.estoqueItem__detalheLabel}>Estoque</Text>
                <Text
                  style={[
                    estilos.estoqueItem__detalheValor,
                    item.quantidade <= 10 && estilos.estoqueItem__detalheValor_baixo,
                  ]}
                >
                  {item.quantidade} un.
                </Text>
              </View>
            </View>

            <View style={estilos.estoqueItem__acoes}>
              <TouchableOpacity
                style={[
                  estilos.estoqueItem__botaoToggle,
                  item.ativo ? estilos.estoqueItem__botaoToggle_desativar : estilos.estoqueItem__botaoToggle_ativar
                ]}
                onPress={() => manipuladores.aoAlternarAtivo(item)}
              >
                <Ionicons
                  name={item.ativo ? "pause-circle-outline" : "play-circle-outline"}
                  size={18}
                  color={item.ativo ? "#F59E0B" : temaMedico.cores.sucesso}
                />
                <Text style={[
                  estilos.estoqueItem__botaoToggleTexto,
                  item.ativo ? estilos.estoqueItem__botaoToggleTexto_desativar : estilos.estoqueItem__botaoToggleTexto_ativar
                ]}>
                  {item.ativo ? 'Desativar' : 'Ativar'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={estilos.estoqueItem__botaoEditar}
                onPress={() => manipuladores.aoIniciarEdicao(item)}
              >
                <Ionicons name="create-outline" size={18} color={temaMedico.cores.primaria} />
                <Text style={estilos.estoqueItem__botaoEditarTexto}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={estilos.estoqueItem__botaoDeletar}
                onPress={() => manipuladores.aoDeletar(item.id, item.produtoNome)}
              >
                <Ionicons name="trash-outline" size={18} color={temaMedico.cores.erro} />
                <Text style={estilos.estoqueItem__botaoDeletarTexto}>Remover</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    );
  };

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
          <Text style={estilos.cabecalho__titulo}>Gerenciar Estoque</Text>
          <TouchableOpacity
            style={estilos.cabecalho__botaoAdicionar}
            onPress={manipuladores.aoAdicionarProduto}
          >
            <Ionicons name="add" size={24} color={temaMedico.cores.primaria} />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={estilos.conteudo}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={atualizando} onRefresh={manipuladores.aoAtualizar} />
          }
        >
          {carregando ? (
            <View style={estilos.containerCarregando}>
              <ActivityIndicator size="large" color={temaMedico.cores.primaria} />
              <Text style={estilos.textoCarregando}>Carregando estoque...</Text>
            </View>
          ) : estoque.length === 0 ? (
            <View style={estilos.containerVazio}>
              <Ionicons name="cube-outline" size={64} color={temaMedico.cores.textoClaro} />
              <Text style={estilos.tituloVazio}>Estoque vazio</Text>
              <Text style={estilos.descricaoVazia}>
                Você ainda não possui produtos no estoque.
              </Text>
              <TouchableOpacity
                style={estilos.botaoVazio}
                onPress={manipuladores.aoAdicionarProduto}
              >
                <Ionicons name="add-circle" size={20} color="#FFF" style={{ marginRight: 8 }} />
                <Text style={estilos.textoBotaoVazio}>Adicionar Produto</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <View style={estilos.resumo}>
                <View style={estilos.resumo__item}>
                  <Text style={estilos.resumo__valor}>{estoque.length}</Text>
                  <Text style={estilos.resumo__label}>Produtos</Text>
                </View>
                <View style={estilos.resumo__item}>
                  <Text style={estilos.resumo__valor}>
                    {estoque.reduce((sum, item) => sum + item.quantidade, 0)}
                  </Text>
                  <Text style={estilos.resumo__label}>Total em Estoque</Text>
                </View>
              </View>

              <View style={estilos.lista}>
                {estoque.map((item) => renderizarItemEstoque(item))}
              </View>
            </>
          )}

          {/* Espaço no final */}
          <View style={{ height: 30 }} />
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
  cabecalho__botaoAdicionar: {
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
  containerCarregando: {
    flex: 1,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    paddingTop: 100,
  },
  textoCarregando: {
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
  botaoVazio: {
    flexDirection: 'row' as const,
    backgroundColor: temaMedico.cores.primaria,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 24,
    alignItems: 'center' as const,
  },
  textoBotaoVazio: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: temaMedico.cores.textoBranco,
  },
  resumo: {
    flexDirection: 'row' as const,
    backgroundColor: temaMedico.cores.backgroundCard,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    gap: 16,
    borderWidth: 1,
    borderColor: temaMedico.cores.borda,
  },
  resumo__item: {
    flex: 1,
    alignItems: 'center' as const,
  },
  resumo__valor: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: temaMedico.cores.primaria,
  },
  resumo__label: {
    fontSize: 12,
    color: temaMedico.cores.textoSubtitulo,
    marginTop: 4,
  },
  lista: {
    gap: 12,
  },
  estoqueItem: {
    backgroundColor: temaMedico.cores.backgroundCard,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: temaMedico.cores.borda,
  },
  estoqueItem__header: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    marginBottom: 12,
  },
  estoqueItem__icone: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: temaMedico.cores.backgroundDestaque,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    marginRight: 12,
    borderWidth: 1,
    borderColor: temaMedico.cores.borda,
  },
  estoqueItem__info: {
    flex: 1,
  },
  estoqueItem__nomeContainer: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 8,
  },
  estoqueItem__nome: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: temaMedico.cores.textoTitulo,
  },
  estoqueItem__statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  estoqueItem__statusBadge_ativo: {
    backgroundColor: '#D1FAE5',
  },
  estoqueItem__statusBadge_inativo: {
    backgroundColor: '#FEE2E2',
  },
  estoqueItem__statusBadgeTexto: {
    fontSize: 11,
    fontWeight: '600' as const,
    textTransform: 'uppercase' as const,
  },
  estoqueItem__statusBadgeTexto_ativo: {
    color: '#059669',
  },
  estoqueItem__statusBadgeTexto_inativo: {
    color: '#DC2626',
  },
  estoqueItem__descricao: {
    fontSize: 13,
    color: temaMedico.cores.textoSubtitulo,
    marginTop: 2,
  },
  estoqueItem__detalhes: {
    flexDirection: 'row' as const,
    marginBottom: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: temaMedico.cores.borda,
    gap: 24,
  },
  estoqueItem__detalhe: {},
  estoqueItem__detalheLabel: {
    fontSize: 12,
    color: temaMedico.cores.textoSubtitulo,
    marginBottom: 4,
  },
  estoqueItem__detalheValor: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: temaMedico.cores.textoTitulo,
  },
  estoqueItem__detalheValor_baixo: {
    color: temaMedico.cores.erro,
  },
  estoqueItem__acoes: {
    flexDirection: 'row' as const,
    gap: 12,
  },
  estoqueItem__botaoEditar: {
    flex: 1,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    backgroundColor: temaMedico.cores.backgroundDestaque,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: temaMedico.cores.borda,
  },
  estoqueItem__botaoEditarTexto: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: temaMedico.cores.primaria,
    marginLeft: 6,
  },
  estoqueItem__botaoDeletar: {
    flex: 1,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    backgroundColor: '#FEF2F2',
    padding: 12,
    borderRadius: 8,
  },
  estoqueItem__botaoDeletarTexto: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: temaMedico.cores.erro,
    marginLeft: 6,
  },
  estoqueItem__botaoToggle: {
    flex: 1,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    padding: 12,
    borderRadius: 8,
  },
  estoqueItem__botaoToggle_ativar: {
    backgroundColor: '#D1FAE5',
  },
  estoqueItem__botaoToggle_desativar: {
    backgroundColor: '#FEF3C7',
  },
  estoqueItem__botaoToggleTexto: {
    fontSize: 14,
    fontWeight: '600' as const,
    marginLeft: 6,
  },
  estoqueItem__botaoToggleTexto_ativar: {
    color: '#059669',
  },
  estoqueItem__botaoToggleTexto_desativar: {
    color: '#F59E0B',
  },
  estoqueItem__edicao: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: temaMedico.cores.borda,
  },
  edicao__campos: {
    flexDirection: 'row' as const,
    gap: 12,
    marginBottom: 12,
  },
  edicao__campo: {
    flex: 1,
  },
  edicao__label: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: temaMedico.cores.textoSubtitulo,
    marginBottom: 6,
  },
  edicao__input: {
    backgroundColor: temaMedico.cores.backgroundCard,
    borderWidth: 1,
    borderColor: temaMedico.cores.borda,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: temaMedico.cores.textoTitulo,
  },
  edicao__botoes: {
    flexDirection: 'row' as const,
    gap: 12,
  },
  edicao__botaoCancelar: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center' as const,
  },
  edicao__botaoCancelarTexto: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: temaMedico.cores.textoSubtitulo,
  },
  edicao__botaoSalvar: {
    flex: 1,
    backgroundColor: temaMedico.cores.primaria,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center' as const,
  },
  edicao__botaoSalvarTexto: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: temaMedico.cores.textoBranco,
  },
};
