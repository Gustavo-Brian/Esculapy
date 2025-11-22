/**
 * Tela Home Melhorada - Esculapi
 * Com dados reais da API pública
 */

import React from 'react';
import {
  View,
  ScrollView,
  FlatList,
  RefreshControl,
  Text,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { temaMedico } from '@/src/estilos/temaMedico';
import { homeNovoStyles as styles } from '@/src/estilos/pages/homeNovoStyles';
import { CartaoProduto } from './componentes/CartaoProduto';
import { BarraBusca } from './componentes/BarraBusca';
import { ChipCategoria } from './componentes/ChipCategoria';
import { CartaoOferta } from './componentes/CartaoOferta';

// Hook OOP
import { useDadosHome } from './hooks/useDadosHome';

export default function TelaHomeNova() {
  const {
    produtos,
    produtosFiltrados,
    farmacias,
    melhoresOfertas,
    categorias,
    categoriaAtiva,
    carregando,
    erro,
    recarregar,
    manipuladores,
  } = useDadosHome();

  /**
   * Loading inicial
   */
  if (carregando && produtos.length === 0) {
    return (
      <View style={styles.containerCarregando}>
        <ActivityIndicator size="large" color={temaMedico.cores.primaria} />
        <Text style={styles.textoCarregando}>Carregando produtos...</Text>
      </View>
    );
  }

  /**
   * Estado de erro
   */
  if (erro && produtos.length === 0) {
    return (
      <View style={styles.containerErro}>
        <Ionicons name="alert-circle" size={64} color={temaMedico.cores.erro} />
        <Text style={styles.textoErro}>{erro}</Text>
        <TouchableOpacity style={styles.botaoRetentar} onPress={recarregar}>
          <Text style={styles.textoBotaoRetentar}>Tentar Novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollConteudo}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={carregando && produtos.length > 0}
            onRefresh={recarregar}
            colors={[temaMedico.cores.primaria]}
            tintColor={temaMedico.cores.primaria}
          />
        }
      >
        {/* Cabeçalho */}
        <View style={styles.cabecalho}>
          <View style={styles.logoContainer}>
            <Ionicons name="medical" size={28} color={temaMedico.cores.primaria} />
            <Text style={styles.titulo}>Esculapi</Text>
          </View>
          <Text style={styles.subtitulo}>Sua saúde em primeiro lugar</Text>
        </View>

        {/* Barra de Busca */}
        <View style={styles.secao}>
          <BarraBusca
            placeholder="Buscar medicamentos..."
            onPress={manipuladores.aoClicarBusca}
          />
        </View>

        {/* Melhores Ofertas */}
        {melhoresOfertas && melhoresOfertas.length > 0 && (
          <View style={styles.secao}>
            <View style={styles.secaoHeader}>
              <Ionicons name="pricetag" size={22} color={temaMedico.cores.primaria} />
              <Text style={styles.tituloSecao}>Melhores Ofertas</Text>
            </View>
            <FlatList
              data={melhoresOfertas}
              renderItem={({ item }) => (
                <CartaoOferta
                  produtoNome={item.produto.nome}
                  farmacia={item.farmacia}
                  preco={item.melhorOferta.preco}
                  economia={item.economiza}
                  onPress={() => manipuladores.aoClicarProduto({ id: item.produto.id } as any)}
                />
              )}
              keyExtractor={(item, index) => `oferta-${index}`}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.listaHorizontal}
            />
          </View>
        )}

        {/* Categorias */}
        {categorias && categorias.length > 1 && (
          <View style={styles.secao}>
            <FlatList
              data={categorias}
              renderItem={({ item }) => (
                <ChipCategoria
                  label={item}
                  ativo={
                    categoriaAtiva === (item === 'Todos' ? 'todos' : item.toLowerCase())
                  }
                  onPress={() =>
                    manipuladores.aoSelecionarCategoria(
                      item === 'Todos' ? 'todos' : item.toLowerCase()
                    )
                  }
                />
              )}
              keyExtractor={(item) => item}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.listaCategorias}
            />
          </View>
        )}

        {/* Produtos */}
        <View style={styles.secao}>
          <View style={styles.secaoHeader}>
            <Ionicons name="cube" size={22} color={temaMedico.cores.primaria} />
            <Text style={styles.tituloSecao}>
              {categoriaAtiva === 'todos'
                ? 'Todos os Produtos'
                : `Categoria: ${categoriaAtiva.charAt(0).toUpperCase() + categoriaAtiva.slice(1)}`}
            </Text>
          </View>

          {produtosFiltrados.length > 0 ? (
            <FlatList
              data={produtosFiltrados}
              renderItem={({ item }) => (
                <CartaoProduto
                  produto={item}
                  aoClicar={manipuladores.aoClicarProduto}
                  aoAdicionarCarrinho={manipuladores.aoAdicionarCarrinho}
                />
              )}
              keyExtractor={(item) => item.id.toString()}
              numColumns={2}
              columnWrapperStyle={styles.gradeProdutos}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <View style={styles.containerVazio}>
              <Ionicons
                name="search-outline"
                size={48}
                color={temaMedico.cores.textoSecundario}
              />
              <Text style={styles.textoVazio}>
                Nenhum produto encontrado nesta categoria
              </Text>
            </View>
          )}
        </View>

        {/* Farmácias */}
        {farmacias.length > 0 && (
          <View style={styles.secao}>
            <View style={styles.secaoHeader}>
              <Ionicons name="storefront" size={22} color={temaMedico.cores.primaria} />
              <Text style={styles.tituloSecao}>Farmácias Parceiras</Text>
            </View>
            {farmacias.slice(0, 5).map((farmacia) => (
              <TouchableOpacity
                key={farmacia.id}
                style={styles.cartaoFarmacia}
                onPress={() => manipuladores.aoClicarFarmacia(farmacia.id)}
              >
                <View style={styles.farmaciaIcone}>
                  <Ionicons name="storefront" size={24} color={temaMedico.cores.primaria} />
                </View>
                <View style={styles.farmaciaInfo}>
                  <Text style={styles.nomeFarmacia}>{farmacia.nome}</Text>
                  <Text style={styles.infoFarmacia} numberOfLines={1}>
                    {farmacia.endereco}
                  </Text>
                  <View style={styles.farmaciaFooter}>
                    <View style={styles.avaliacaoContainer}>
                      <Ionicons name="star" size={14} color="#FFB800" />
                      <Text style={styles.avaliacaoFarmacia}>
                        {farmacia.formatarAvaliacao()}
                      </Text>
                    </View>
                    {farmacia.aberta && (
                      <View style={styles.abertoTag}>
                        <View style={styles.pontinho} />
                        <Text style={styles.abertoText}>Aberto</Text>
                      </View>
                    )}
                  </View>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={temaMedico.cores.textoSecundario}
                />
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={styles.espacamentoFinal} />
      </ScrollView>
    </View>
  );
}
