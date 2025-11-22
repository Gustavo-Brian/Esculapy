/**
 * Tela de Detalhes da Farmácia - Esculapi
 * Informações completas da farmácia, produtos e avaliações
 * Metodologia BEM para nomenclatura
 */

import { ScrollView, TouchableOpacity, FlatList, View, Text, ActivityIndicator, TextInput } from 'react-native';
import { useLocalSearchParams, router, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { sellerStyles as styles } from '@/src/estilos/pages/sellerStyles';
import { temaMedico } from '@/src/estilos/temaMedico';
import { useDadosFarmacia } from './hooks/useDadosFarmacia';
import { QuantidadeModal } from '@/src/componentes/QuantidadeModal';

export default function SellerDetailScreen() {
  const { id } = useLocalSearchParams();
  const farmaciaId = parseInt(id as string, 10);

  const {
    farmacia,
    produtos,
    avaliacoes,
    seguindo,
    abaAtiva,
    carregando,
    erro,
    termoPesquisa,
    filtroAvaliacao,
    modalQuantidadeVisivel,
    produtoSelecionado,
    manipuladores,
  } = useDadosFarmacia(farmaciaId);

  // Loading state
  if (carregando) {
    return (
      <View style={styles.containerCarregando}>
        <ActivityIndicator size="large" color={temaMedico.cores.primaria} />
        <Text style={styles.textoCarregando}>Carregando farmácia...</Text>
      </View>
    );
  }

  // Error state
  if (erro || !farmacia) {
    return (
      <View style={styles.containerErro}>
        <Ionicons name="alert-circle" size={64} color={temaMedico.cores.erro} />
        <Text style={styles.textoErro}>
          {erro || 'Farmácia não encontrada'}
        </Text>
        <TouchableOpacity style={styles.botaoVoltar} onPress={() => router.back()}>
          <Text style={styles.textoBotaoVoltar}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const renderProduto = ({ item }: any) => (
    <TouchableOpacity
      style={[styles.produtoCard, { marginBottom: 15 }]}
      onPress={() => manipuladores.aoVisualizarProduto(item.id)}
      activeOpacity={0.7}
    >
      {item.temDesconto() && (
        <View style={styles.produtoCard__desconto}>
          <Text style={styles.produtoCard__descontoTexto}>-{item.desconto}%</Text>
        </View>
      )}

      {item.requerReceita() && (
        <View style={[styles.produtoCard__receita, { backgroundColor: item.obterCorTipoReceita() }]}>
          <Ionicons name="document-text" size={10} color={temaMedico.cores.textoBranco} />
        </View>
      )}

      <View style={styles.produtoCard__conteudo}>
        <View style={styles.produtoCard__imagem}>
          <Ionicons name="medical" size={40} color={temaMedico.cores.cardRoxo} />
        </View>

        <View style={styles.produtoCard__info}>
          <Text style={styles.produtoCard__nome} numberOfLines={3}>
            {item.nome}
          </Text>

          {item.laboratorio && (
            <View style={styles.produtoCard__metaContainer}>
              <Ionicons name="flask" size={10} color={temaMedico.cores.textoSubtitulo} />
              <Text style={styles.produtoCard__meta} numberOfLines={1}>
                {item.laboratorio}
              </Text>
            </View>
          )}

          {item.principioAtivo && (
            <View style={styles.produtoCard__metaContainer}>
              <Ionicons name="nutrition" size={10} color={temaMedico.cores.textoSubtitulo} />
              <Text style={styles.produtoCard__meta} numberOfLines={1}>
                {item.principioAtivo}
              </Text>
            </View>
          )}

          <View style={styles.produtoCard__estoqueContainer}>
            <Ionicons
              name={item.estaEmEstoque() ? "checkmark-circle" : "close-circle"}
              size={12}
              color={item.estaEmEstoque() ? temaMedico.cores.sucesso : temaMedico.cores.erro}
            />
            <Text
              style={[
                styles.produtoCard__estoque,
                !item.estaEmEstoque() && { color: temaMedico.cores.erro },
                item.estaComEstoqueBaixo() && { color: temaMedico.cores.alerta }
              ]}
            >
              {item.formatarEstoque()}
            </Text>
          </View>

          <View style={styles.produtoCard__footer}>
            <View style={styles.produtoCard__precosCompleto}>
              {item.precoAntigo && (
                <Text style={styles.produtoCard__precoAntigo}>
                  R$ {item.precoAntigo.toFixed(2).replace('.', ',')}
                </Text>
              )}
              <Text style={styles.produtoCard__preco}>R$ {item.formatarPreco()}</Text>
              {item.temDesconto() && (
                <Text style={styles.produtoCard__numeroOfertas}>
                  {item.desconto > 0 ? `${Math.round(item.desconto)}% OFF` : '1 oferta'}
                </Text>
              )}
              {!item.temDesconto() && (
                <Text style={styles.produtoCard__numeroOfertas}>1 oferta</Text>
              )}
            </View>

            <TouchableOpacity
              style={[
                styles.produtoCard__botao,
                !item.estaEmEstoque() && styles.produtoCard__botaoDesabilitado
              ]}
              activeOpacity={0.7}
              disabled={!item.estaEmEstoque()}
              onPress={(e) => {
                e.stopPropagation();
                manipuladores.aoAdicionarProduto(item.id);
              }}
            >
              <Text style={[
                styles.produtoCard__botaoTexto,
                !item.estaEmEstoque() && styles.produtoCard__botaoTextoDesabilitado
              ]}>
                {item.estaEmEstoque() ? 'Adicionar' : 'Esgotado'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderAvaliacao = ({ item }: any) => (
    <View style={styles.avaliacaoCard}>
      <View style={styles.avaliacaoCard__cabecalho}>
        <View style={styles.avaliacaoCard__usuario}>
          <View style={styles.avaliacaoCard__avatar}>
            <Ionicons name="person" size={20} color={temaMedico.cores.textoClaro} />
          </View>
          <View style={styles.avaliacaoCard__usuarioInfo}>
            <Text style={styles.avaliacaoCard__usuarioNome}>{item.usuario}</Text>
            <Text style={styles.avaliacaoCard__usuarioData}>{item.obterDataFormatada()}</Text>
          </View>
        </View>
        <View style={styles.avaliacaoCard__estrelas}>
          {[1, 2, 3, 4, 5].map((star) => (
            <Ionicons
              key={star}
              name={star <= item.nota ? 'star' : 'star-outline'}
              size={14}
              color={temaMedico.cores.cardAmarelo}
            />
          ))}
        </View>
      </View>
      {item.eCompraVerificada() && (
        <View style={styles.avaliacaoCard__verificada}>
          <Ionicons name="checkmark-circle" size={14} color={temaMedico.cores.sucesso} />
          <Text style={styles.avaliacaoCard__verificadaTexto}>Compra verificada</Text>
        </View>
      )}
      <Text style={styles.avaliacaoCard__comentario}>{item.comentario}</Text>
    </View>
  );

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.pagina}>
        {/* Header fixo com SafeAreaView */}
        <SafeAreaView edges={['top']} style={styles.cabecalho}>
          <View style={styles.cabecalho__superior}>
            <TouchableOpacity
              style={styles.cabecalho__botaoIcone}
              onPress={manipuladores.aoVoltar}
              activeOpacity={0.7}
            >
              <Ionicons name="arrow-back" size={22} color={temaMedico.cores.textoBranco} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cabecalho__botaoIcone}
              onPress={manipuladores.aoCompartilhar}
              activeOpacity={0.7}
            >
              <Ionicons name="share-outline" size={22} color={temaMedico.cores.textoBranco} />
            </TouchableOpacity>
          </View>
        </SafeAreaView>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Capa */}
          <View style={styles.capa}>
            <Ionicons name="storefront" size={60} color={temaMedico.cores.textoBranco} />
          </View>

          {/* Info principal */}
          <View style={styles.infoPrincipal}>
            <View style={styles.info__cabecalho}>
              <View style={styles.info__esquerda}>
                <View style={styles.info__titulo}>
                  <Text style={styles.info__nome}>{farmacia.nome}</Text>
                  {farmacia.verificada && (
                    <View style={styles.info__badgeVerificada}>
                      <Ionicons name="checkmark" size={12} color={temaMedico.cores.textoBranco} />
                    </View>
                  )}
                </View>
                <Text style={styles.info__descricao}>{farmacia.descricao}</Text>

                <View style={styles.info__avaliacao}>
                  <Ionicons name="star" size={16} color={temaMedico.cores.cardAmarelo} />
                  <Text style={styles.info__avaliacaoTexto}>{farmacia.nota.toFixed(1)}</Text>
                  <Text style={styles.info__avaliacaoCount}>({avaliacoes.length} avaliações)</Text>
                </View>

                <View style={styles.info__localizacao}>
                  <Ionicons name="location" size={14} color={temaMedico.cores.textoSubtitulo} />
                  <Text style={styles.info__localizacaoTexto}>
                    {farmacia.distancia} • {farmacia.tempoEntrega}
                  </Text>
                </View>
              </View>
            </View>

            {/* Stats */}
            <View style={styles.stats}>
              <View style={styles.stats__item}>
                <Text style={styles.stats__valor}>{produtos.length}</Text>
                <Text style={styles.stats__label}>Produtos</Text>
              </View>
              <View style={styles.stats__item}>
                <Text style={styles.stats__valor}>{farmacia.seguidores}</Text>
                <Text style={styles.stats__label}>Seguidores</Text>
              </View>
              <View style={styles.stats__item}>
                <Text style={styles.stats__valor}>{avaliacoes.length}</Text>
                <Text style={styles.stats__label}>Avaliações</Text>
              </View>
            </View>

            {/* Botões de ação */}
            <View style={styles.acoes}>
              <TouchableOpacity
                style={[
                  styles.acoes__botaoSeguir,
                  seguindo ? styles.acoes__botaoSeguirInativo : styles.acoes__botaoSeguirAtivo,
                ]}
                onPress={manipuladores.aoSeguir}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.acoes__botaoSeguirTexto,
                    seguindo
                      ? styles.acoes__botaoSeguirTextoInativo
                      : styles.acoes__botaoSeguirTextoAtivo,
                  ]}
                >
                  {seguindo ? 'Seguindo' : 'Seguir'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.acoes__botaoIcone}
                onPress={manipuladores.aoLigar}
                activeOpacity={0.7}
              >
                <Ionicons name="call-outline" size={22} color={temaMedico.cores.primaria} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.acoes__botaoIcone}
                onPress={manipuladores.aoAbrirChat}
                activeOpacity={0.7}
              >
                <Ionicons name="chatbubble-outline" size={22} color={temaMedico.cores.primaria} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Informações adicionais */}
          <View style={styles.informacoes}>
            <Text style={styles.informacoes__titulo}>Informações</Text>

            <View style={styles.informacoes__item}>
              <View style={styles.informacoes__itemCabecalho}>
                <Ionicons name="location" size={18} color={temaMedico.cores.textoSubtitulo} />
                <Text style={styles.informacoes__itemTitulo}>Endereço</Text>
              </View>
              <Text style={styles.informacoes__itemTexto}>{farmacia.endereco}</Text>
            </View>

            <View style={styles.informacoes__item}>
              <View style={styles.informacoes__itemCabecalho}>
                <Ionicons name="time" size={18} color={temaMedico.cores.textoSubtitulo} />
                <Text style={styles.informacoes__itemTitulo}>Horário de Funcionamento</Text>
              </View>
              <View style={styles.horarios}>
                {farmacia.horarios.map((h, index) => (
                  <View key={index} style={styles.horarios__linha}>
                    <Text style={styles.horarios__dia}>{h.dia}</Text>
                    <Text style={styles.horarios__horario}>{h.horario}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.informacoes__item}>
              <View style={styles.informacoes__itemCabecalho}>
                <Ionicons name="call" size={18} color={temaMedico.cores.textoSubtitulo} />
                <Text style={styles.informacoes__itemTitulo}>Telefone</Text>
              </View>
              <Text style={styles.informacoes__itemTextoDestaque}>{farmacia.telefone}</Text>
            </View>
          </View>

          {/* Filtros */}
          <View style={styles.filtros}>
            {/* Pesquisa (apenas na aba produtos) */}
            {abaAtiva === 'produtos' && (
              <View style={styles.filtros__pesquisa}>
                <Ionicons name="search" size={20} color={temaMedico.cores.textoClaro} />
                <TextInput
                  style={styles.filtros__pesquisaInput}
                  placeholder="Pesquisar produtos..."
                  placeholderTextColor={temaMedico.cores.textoClaro}
                  value={termoPesquisa}
                  onChangeText={manipuladores.aoPesquisar}
                />
                {termoPesquisa.length > 0 && (
                  <TouchableOpacity onPress={() => manipuladores.aoPesquisar('')}>
                    <Ionicons name="close-circle" size={20} color={temaMedico.cores.textoClaro} />
                  </TouchableOpacity>
                )}
              </View>
            )}

            {/* Filtro de avaliação (apenas na aba avaliações) */}
            {abaAtiva === 'avaliacoes' && (
              <View style={styles.filtros__avaliacaoContainer}>
                <Text style={styles.filtros__avaliacaoLabel}>Filtrar:</Text>
                <View style={styles.filtros__avaliacaoOpcoes}>
                  {[5, 4, 3, 2, 1].map((nota) => (
                    <TouchableOpacity
                      key={nota}
                      style={[
                        styles.filtros__avaliacaoBotao,
                        filtroAvaliacao === nota && styles.filtros__avaliacaoBotaoAtivo,
                      ]}
                      onPress={() =>
                        manipuladores.aoFiltrarAvaliacao(filtroAvaliacao === nota ? null : nota)
                      }
                      activeOpacity={0.7}
                    >
                      <Ionicons
                        name="star"
                        size={12}
                        color={
                          filtroAvaliacao === nota
                            ? temaMedico.cores.primaria
                            : temaMedico.cores.cardAmarelo
                        }
                      />
                      <Text
                        style={[
                          styles.filtros__avaliacaoTexto,
                          filtroAvaliacao === nota && styles.filtros__avaliacaoTextoAtivo,
                        ]}
                      >
                        {nota}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
                {(termoPesquisa || filtroAvaliacao) && (
                  <TouchableOpacity
                    style={styles.filtros__limpar}
                    onPress={manipuladores.aoLimparFiltros}
                  >
                    <Text style={styles.filtros__limparTexto}>Limpar</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>

          {/* Abas */}
          <View style={styles.abas}>
            <TouchableOpacity
              style={[styles.abas__botao, abaAtiva === 'produtos' && styles.abas__botaoAtivo]}
              onPress={() => manipuladores.aoSelecionarAba('produtos')}
              activeOpacity={0.7}
            >
              <Text style={[styles.abas__texto, abaAtiva === 'produtos' && styles.abas__textoAtivo]}>
                Produtos ({produtos.length})
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.abas__botao, abaAtiva === 'avaliacoes' && styles.abas__botaoAtivo]}
              onPress={() => manipuladores.aoSelecionarAba('avaliacoes')}
              activeOpacity={0.7}
            >
              <Text
                style={[styles.abas__texto, abaAtiva === 'avaliacoes' && styles.abas__textoAtivo]}
              >
                Avaliações ({avaliacoes.length})
              </Text>
            </TouchableOpacity>
          </View>

          {/* Conteúdo das abas */}
          <View style={styles.conteudo}>
            {abaAtiva === 'produtos' ? (
              produtos.length > 0 ? (
                <FlatList
                  key="produtos-list"
                  data={produtos}
                  renderItem={renderProduto}
                  keyExtractor={(item, index) => `produto-${item.id || index}`}
                  numColumns={2}
                  columnWrapperStyle={{ gap: 15 }}
                  scrollEnabled={false}
                />
              ) : (
                <View style={styles.containerVazio}>
                  <Ionicons
                    name={termoPesquisa ? "search-outline" : "cube-outline"}
                    size={64}
                    color={temaMedico.cores.textoSecundario}
                  />
                  <Text style={styles.textoVazio}>
                    {termoPesquisa ? 'Nenhum produto encontrado' : 'Nenhum produto cadastrado'}
                  </Text>
                  <Text style={styles.subtextoVazio}>
                    {termoPesquisa
                      ? 'Tente pesquisar com outras palavras'
                      : 'Esta farmácia ainda não possui produtos em estoque'
                    }
                  </Text>
                </View>
              )
            ) : avaliacoes.length > 0 ? (
              <FlatList
                key="avaliacoes-list"
                data={avaliacoes}
                renderItem={renderAvaliacao}
                keyExtractor={(item, index) => `avaliacao-${item.id || index}`}
                scrollEnabled={false}
              />
            ) : (
              <View style={styles.containerVazio}>
                <Ionicons
                  name={filtroAvaliacao ? "filter-outline" : "chatbubbles-outline"}
                  size={64}
                  color={temaMedico.cores.textoSecundario}
                />
                <Text style={styles.textoVazio}>
                  {filtroAvaliacao
                    ? `Nenhuma avaliação com ${filtroAvaliacao} estrelas`
                    : 'Nenhuma avaliação'
                  }
                </Text>
                <Text style={styles.subtextoVazio}>
                  {filtroAvaliacao
                    ? 'Tente selecionar outro filtro'
                    : 'Esta farmácia ainda não possui avaliações'
                  }
                </Text>
              </View>
            )}
          </View>
        </ScrollView>

        {/* Modal de Seleção de Quantidade */}
        {produtoSelecionado && (
          <QuantidadeModal
            visible={modalQuantidadeVisivel}
            onClose={manipuladores.aoFecharModal}
            onConfirm={manipuladores.aoConfirmarQuantidade}
            produtoNome={produtoSelecionado.nome}
            estoqueDisponivel={produtoSelecionado.estoque}
            preco={produtoSelecionado.preco}
          />
        )}
      </View>
    </>
  );
}
