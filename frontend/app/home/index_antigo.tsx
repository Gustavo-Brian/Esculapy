/**
 * Tela Home - Arquitetura OOP + Português
 * Composição final da tela usando classes de domínio e serviços
 */

import {
  View,
  ScrollView,
  FlatList,
  RefreshControl,
  Text,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { temaMedico } from '@/src/estilos/temaMedico';
import { homeNovoStyles as styles } from '@/src/estilos/pages/homeNovoStyles';
import { CartaoProduto } from './componentes/CartaoProduto';

// Hook OOP
import { useDadosHome } from './hooks/useDadosHome';

export default function TelaHome() {
  // Hook com toda a lógica OOP
  const {
    produtos,
    farmacias,
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
        <Text style={styles.textoCarregando}>Carregando...</Text>
      </View>
    );
  }

  /**
   * Estado de erro
   */
  if (erro && produtos.length === 0) {
    return (
      <View style={styles.containerErro}>
        <Text style={styles.textoErro}>{erro}</Text>
        <TouchableOpacity
          style={styles.botaoRetentar}
          onPress={recarregar}
        >
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
          <Text style={styles.titulo}>Esculapi</Text>
          <Text style={styles.subtitulo}>Sua farmácia online</Text>
        </View>

        {/* Produtos */}
        <View style={styles.secao}>
          <Text style={styles.tituloSecao}>Produtos em Destaque</Text>

          {produtos.length > 0 ? (
            <FlatList
              data={produtos}
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
              windowSize={10}
              maxToRenderPerBatch={6}
              initialNumToRender={10}
              removeClippedSubviews={true}
            />
          ) : (
            <Text style={styles.textoVazio}>Nenhum produto disponível</Text>
          )}
        </View>

        {/* Farmácias */}
        {farmacias.length > 0 && (
          <View style={styles.secao}>
            <Text style={styles.tituloSecao}>Farmácias Próximas 📍</Text>
            {farmacias.map((farmacia) => (
              <TouchableOpacity
                key={farmacia.id}
                style={styles.cartaoFarmacia}
                onPress={() => manipuladores.aoClicarFarmacia(farmacia.id)}
              >
                <Text style={styles.nomeFarmacia}>{farmacia.nome}</Text>
                <Text style={styles.infoFarmacia}>
                  {farmacia.distancia} • {farmacia.tempoEntrega}
                </Text>
                <Text style={styles.avaliacaoFarmacia}>
                  ⭐ {farmacia.formatarAvaliacao()}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={styles.espacamentoFinal} />
      </ScrollView>
    </View>
  );
}
