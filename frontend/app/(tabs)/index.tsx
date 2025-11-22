/**
 * Tela Home - Esculapi
 * Exibe produtos e farmácias disponíveis
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  ScrollView,
  RefreshControl,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
  Keyboard,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { temaMedico } from '@/src/estilos/temaMedico';
import { homeNovoStyles as styles } from '@/src/estilos/pages/homeNovoStyles';
import {
  buscarProdutosComOfertas,
  listarFarmaciasPublicas,
  buscarMelhoresOfertas,
} from '@/src/servicos/publico/publicoService';
import { useCart } from '@/src/hooks/useCart';
import type { CatalogoResponse, EstoqueResponse } from '@/src/servicos/types/api.types';

export default function TelaHome() {
  const [carregando, setCarregando] = useState(true);
  const { quantidadeItens } = useCart();
  const [produtos, setProdutos] = useState<Array<CatalogoResponse & { ofertas: EstoqueResponse[] }>>([]);
  const [farmacias, setFarmacias] = useState<any[]>([]);
  const [melhoresOfertas, setMelhoresOfertas] = useState<any[]>([]);
  const [termoBusca, setTermoBusca] = useState('');
  const [buscaAtiva, setBuscaAtiva] = useState(false);
  const [filtroAtivo, setFiltroAtivo] = useState<'todos' | 'medicamentos' | 'correlatos'>('todos');

  const carregarDados = async () => {
    try {
      setCarregando(true);
      console.log('[Home] Iniciando carregamento...');

      const [produtosData, farmaciasData, ofertasData] = await Promise.all([
        buscarProdutosComOfertas(),
        listarFarmaciasPublicas(),
        buscarMelhoresOfertas(),
      ]);

      console.log('[Home] Dados recebidos:', {
        produtos: produtosData.length,
        farmacias: farmaciasData.length,
        ofertas: ofertasData.length,
      });

      setProdutos(produtosData);
      setFarmacias(farmaciasData);
      setMelhoresOfertas(ofertasData);
    } catch (error) {
      console.error('[Home] Erro ao carregar:', error);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarDados();
  }, []);

  // Filtra produtos baseado no termo de busca e filtro de categoria
  const produtosFiltrados = useMemo(() => {
    let resultados = produtos;

    // Aplica busca por texto
    if (termoBusca.trim()) {
      const termo = termoBusca.toLowerCase().trim();
      resultados = resultados.filter((produto) => {
        const nomeProduto = produto.nome.toLowerCase();
        const descricao = (produto.descricao || '').toLowerCase();
        const laboratorio = (produto.laboratorio || '').toLowerCase();
        const principioAtivo = (produto.principioAtivo || '').toLowerCase();

        return (
          nomeProduto.includes(termo) ||
          descricao.includes(termo) ||
          laboratorio.includes(termo) ||
          principioAtivo.includes(termo)
        );
      });
    }

    // Aplica filtro de categoria (só quando está buscando)
    if (buscaAtiva && filtroAtivo !== 'todos') {
      resultados = resultados.filter((produto) => {
        if (filtroAtivo === 'medicamentos') {
          return produto.tipoProduto === 'MEDICAMENTO';
        } else if (filtroAtivo === 'correlatos') {
          return produto.tipoProduto === 'CORRELATO';
        }
        return true;
      });
    }

    return resultados;
  }, [produtos, termoBusca, buscaAtiva, filtroAtivo]);

  // Filtra farmácias baseado no termo de busca
  const farmaciasFiltradas = useMemo(() => {
    if (!termoBusca.trim()) {
      return farmacias;
    }

    const termo = termoBusca.toLowerCase().trim();
    return farmacias.filter((farmacia) => {
      const nome = (farmacia.nomeFantasia || '').toLowerCase();
      const razaoSocial = (farmacia.razaoSocial || '').toLowerCase();
      const endereco = farmacia.endereco
        ? `${farmacia.endereco.logradouro || ''} ${farmacia.endereco.bairro || ''} ${farmacia.endereco.cidade || ''}`.toLowerCase()
        : '';

      return nome.includes(termo) || razaoSocial.includes(termo) || endereco.includes(termo);
    });
  }, [farmacias, termoBusca]);

  // Filtra ofertas baseado no termo de busca
  const ofertasFiltradas = useMemo(() => {
    if (!termoBusca.trim()) {
      return melhoresOfertas;
    }

    const termo = termoBusca.toLowerCase().trim();
    return melhoresOfertas.filter((oferta) => {
      const nomeProduto = oferta.produto.nome.toLowerCase();
      const nomeFarmacia = (oferta.farmacia || '').toLowerCase();

      return nomeProduto.includes(termo) || nomeFarmacia.includes(termo);
    });
  }, [melhoresOfertas, termoBusca]);

  const handleBuscar = (texto: string) => {
    setTermoBusca(texto);
    setBuscaAtiva(texto.length > 0);
  };

  const handleLimparBusca = () => {
    setTermoBusca('');
    setBuscaAtiva(false);
    setFiltroAtivo('todos');
    Keyboard.dismiss();
  };

  const handleSugestao = (sugestao: string) => {
    setTermoBusca(sugestao);
    setBuscaAtiva(true);
  };

  if (carregando) {
    return (
      <View style={styles.containerCarregando}>
        <ActivityIndicator size="large" color={temaMedico.cores.primaria} />
        <Text style={styles.textoCarregando}>Carregando produtos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={carregando}
            onRefresh={carregarDados}
            colors={[temaMedico.cores.primaria]}
            tintColor={temaMedico.cores.primaria}
          />
        }
      >
        {/* Cabeçalho */}
        <View style={styles.cabecalho}>
          <View style={styles.cabecalhoConteudo}>
            <View style={styles.logoContainer}>
              <Ionicons name="medical" size={28} color={temaMedico.cores.primaria} />
              <Text style={styles.titulo}>Esculapi</Text>
            </View>
            <View style={styles.botoesNavegacao}>
              <TouchableOpacity
                style={styles.botaoNavegacao}
                onPress={() => router.push('/cart')}
              >
                <Ionicons name="cart-outline" size={24} color={temaMedico.cores.primaria} />
                {quantidadeItens > 0 && (
                  <View style={styles.badgeCarrinho}>
                    <Text style={styles.badgeTexto}>{quantidadeItens}</Text>
                  </View>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.botaoNavegacao}
                onPress={() => router.push('/account')}
              >
                <Ionicons name="person-outline" size={24} color={temaMedico.cores.primaria} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.botaoNavegacao}
                onPress={() => {
                  Alert.alert(
                    'Sair',
                    'Deseja realmente sair?',
                    [
                      { text: 'Cancelar', style: 'cancel' },
                      { text: 'Sair', onPress: () => router.push('/login') }
                    ]
                  );
                }}
              >
                <Ionicons name="log-out-outline" size={24} color={temaMedico.cores.primaria} />
              </TouchableOpacity>
            </View>
          </View>
          <Text style={styles.subtitulo}>Sua saúde em primeiro lugar</Text>
        </View>

        {/* Barra de Busca Melhorada */}
        <View style={styles.containerBusca}>
          <View style={styles.barraBusca}>
            <View style={styles.iconeBuscaContainer}>
              <Ionicons name="search" size={22} color={temaMedico.cores.primaria} />
            </View>
            <TextInput
              style={styles.inputBusca}
              placeholder="Buscar medicamentos..."
              placeholderTextColor={temaMedico.cores.textoSecundario}
              value={termoBusca}
              onChangeText={handleBuscar}
              returnKeyType="search"
              autoCapitalize="none"
              autoCorrect={false}
            />
            {termoBusca.length > 0 && (
              <TouchableOpacity onPress={handleLimparBusca} style={styles.botaoLimpar}>
                <Ionicons name="close-circle" size={20} color={temaMedico.cores.textoSecundario} />
              </TouchableOpacity>
            )}
          </View>

          {/* Carrossel de Pesquisas Rápidas - só mostra quando não está buscando */}
          {!buscaAtiva && (
            <View>
              <Text style={styles.tituloCarrossel}>Pesquisas rápidas</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.carrosselContainer}
                contentContainerStyle={styles.carrosselContent}
              >
                <TouchableOpacity
                  style={styles.cardCarrossel}
                  onPress={() => handleSugestao('dipirona')}
                >
                  <View style={styles.iconeCardCarrossel}>
                    <Ionicons name="flask" size={24} color={temaMedico.cores.primaria} />
                  </View>
                  <Text style={styles.tituloCardCarrossel}>Dipirona</Text>
                  <Text style={styles.subtituloCardCarrossel}>Analgésico</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.cardCarrossel}
                  onPress={() => handleSugestao('vitamina')}
                >
                  <View style={styles.iconeCardCarrossel}>
                    <Ionicons name="nutrition" size={24} color={temaMedico.cores.primaria} />
                  </View>
                  <Text style={styles.tituloCardCarrossel}>Vitaminas</Text>
                  <Text style={styles.subtituloCardCarrossel}>Suplementos</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.cardCarrossel}
                  onPress={() => handleSugestao('antibiotico')}
                >
                  <View style={styles.iconeCardCarrossel}>
                    <Ionicons name="medical" size={24} color={temaMedico.cores.primaria} />
                  </View>
                  <Text style={styles.tituloCardCarrossel}>Antibióticos</Text>
                  <Text style={styles.subtituloCardCarrossel}>Receita obrigatória</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.cardCarrossel}
                  onPress={() => handleSugestao('analgesico')}
                >
                  <View style={styles.iconeCardCarrossel}>
                    <Ionicons name="bandage" size={24} color={temaMedico.cores.primaria} />
                  </View>
                  <Text style={styles.tituloCardCarrossel}>Analgésicos</Text>
                  <Text style={styles.subtituloCardCarrossel}>Alívio da dor</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.cardCarrossel}
                  onPress={() => handleSugestao('antialergico')}
                >
                  <View style={styles.iconeCardCarrossel}>
                    <Ionicons name="flower" size={24} color={temaMedico.cores.primaria} />
                  </View>
                  <Text style={styles.tituloCardCarrossel}>Antialérgicos</Text>
                  <Text style={styles.subtituloCardCarrossel}>Alergias</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.cardCarrossel}
                  onPress={() => handleSugestao('antitermico')}
                >
                  <View style={styles.iconeCardCarrossel}>
                    <Ionicons name="thermometer" size={24} color={temaMedico.cores.primaria} />
                  </View>
                  <Text style={styles.tituloCardCarrossel}>Antitérmicos</Text>
                  <Text style={styles.subtituloCardCarrossel}>Reduz febre</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          )}

          {/* Indicador de resultados e filtros */}
          {buscaAtiva && (
            <View style={styles.containerResultados}>
              <View style={styles.resultadoBusca}>
                <Ionicons name="funnel-outline" size={16} color={temaMedico.cores.primaria} />
                <Text style={styles.textoResultado}>
                  {produtosFiltrados.length} {produtosFiltrados.length === 1 ? 'produto encontrado' : 'produtos encontrados'}
                </Text>
              </View>

              {/* Filtros rápidos */}
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.filtrosContainer}
              >
                <TouchableOpacity
                  style={[
                    styles.chipFiltro,
                    filtroAtivo === 'todos' && styles.chipFiltroAtivo,
                  ]}
                  onPress={() => setFiltroAtivo('todos')}
                >
                  <Ionicons
                    name="apps"
                    size={16}
                    color={filtroAtivo === 'todos' ? '#FFFFFF' : temaMedico.cores.primaria}
                  />
                  <Text
                    style={[
                      styles.textoFiltro,
                      filtroAtivo === 'todos' && styles.textoFiltroAtivo,
                    ]}
                  >
                    Todos
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.chipFiltro,
                    filtroAtivo === 'medicamentos' && styles.chipFiltroAtivo,
                  ]}
                  onPress={() => setFiltroAtivo('medicamentos')}
                >
                  <Ionicons
                    name="medical"
                    size={16}
                    color={filtroAtivo === 'medicamentos' ? '#FFFFFF' : temaMedico.cores.primaria}
                  />
                  <Text
                    style={[
                      styles.textoFiltro,
                      filtroAtivo === 'medicamentos' && styles.textoFiltroAtivo,
                    ]}
                  >
                    Medicamentos
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.chipFiltro,
                    filtroAtivo === 'correlatos' && styles.chipFiltroAtivo,
                  ]}
                  onPress={() => setFiltroAtivo('correlatos')}
                >
                  <Ionicons
                    name="fitness"
                    size={16}
                    color={filtroAtivo === 'correlatos' ? '#FFFFFF' : temaMedico.cores.primaria}
                  />
                  <Text
                    style={[
                      styles.textoFiltro,
                      filtroAtivo === 'correlatos' && styles.textoFiltroAtivo,
                    ]}
                  >
                    Correlatos
                  </Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          )}
        </View>

        {/* Melhores Ofertas */}
        {ofertasFiltradas.length > 0 && (
          <View style={styles.secao}>
            <View style={styles.secaoHeader}>
              <View style={styles.secaoHeaderConteudo}>
                <Ionicons name="pricetag" size={22} color={temaMedico.cores.primaria} />
                <Text style={styles.tituloSecao}>
                  {buscaAtiva ? 'Ofertas Encontradas' : 'Melhores Ofertas'}
                </Text>
                {buscaAtiva && (
                  <Text style={styles.contadorProdutos}>({ofertasFiltradas.length})</Text>
                )}
              </View>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {ofertasFiltradas.slice(0, 5).map((oferta, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.cartaoOferta}
                  onPress={() => router.push(`/product/${oferta.produto.id}`)}
                >
                  <Text style={styles.nomeProdutoOferta} numberOfLines={2}>
                    {oferta.produto.nome}
                  </Text>
                  <Text style={styles.farmaciaOferta} numberOfLines={1}>
                    {oferta.farmacia}
                  </Text>
                  <View style={styles.precoOfertaContainer}>
                    <Text style={styles.precoOferta}>
                      R$ {oferta.melhorOferta.preco.toFixed(2).replace('.', ',')}
                    </Text>
                    {oferta.economiza > 0 && (
                      <Text style={styles.economiaOferta}>
                        Economize R$ {oferta.economiza.toFixed(2).replace('.', ',')}
                      </Text>
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Seção de Produtos */}
        <View style={styles.secao}>
          <View style={styles.secaoHeader}>
            <View style={styles.secaoHeaderConteudo}>
              <Ionicons name="cube" size={22} color={temaMedico.cores.primaria} />
              <Text style={styles.tituloSecao}>
                {buscaAtiva ? 'Resultados da Busca' : 'Todos os Produtos'}
              </Text>
              <Text style={styles.contadorProdutos}>({produtosFiltrados.length})</Text>
            </View>
            {!buscaAtiva && (
              <TouchableOpacity
                style={styles.botaoVerTodos}
                onPress={() => router.push('/allproducts')}
              >
                <Text style={styles.textoVerTodos}>Ver Todos</Text>
                <Ionicons name="arrow-forward" size={16} color={temaMedico.cores.primaria} />
              </TouchableOpacity>
            )}
          </View>

          {produtosFiltrados.length > 0 ? (
            <View style={styles.gridProdutos}>
              {produtosFiltrados.map((produto) => {
                const menorPreco = Math.min(...produto.ofertas.map(o => o.preco));
                const maiorPreco = Math.max(...produto.ofertas.map(o => o.preco));
                const temPromocao = produto.ofertas.length > 1 && menorPreco < maiorPreco;

                return (
                  <TouchableOpacity
                    key={produto.id}
                    style={styles.cartaoProduto}
                    onPress={() => router.push(`/product/${produto.id}`)}
                  >
                    <View style={styles.imagemProduto}>
                      <Ionicons name="medical" size={40} color={temaMedico.cores.primaria} />
                    </View>
                    <View style={styles.infoProduto}>
                      <Text style={styles.nomeProduto} numberOfLines={2}>
                        {produto.nome}
                      </Text>
                      <View style={styles.precoContainer}>
                        {temPromocao && (
                          <Text style={styles.precoAntigo}>
                            R$ {maiorPreco.toFixed(2).replace('.', ',')}
                          </Text>
                        )}
                        <Text style={styles.preco}>
                          R$ {menorPreco.toFixed(2).replace('.', ',')}
                        </Text>
                      </View>
                      <Text style={styles.ofertas}>
                        {produto.ofertas.length} {produto.ofertas.length === 1 ? 'oferta' : 'ofertas'}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          ) : (
            <View style={styles.containerVazio}>
              <Ionicons name="cube-outline" size={48} color={temaMedico.cores.textoSecundario} />
              <Text style={styles.textoVazio}>Sem ofertas no momento</Text>
              <Text style={styles.subtextoVazio}>
                Aguarde enquanto as farmácias cadastram produtos
              </Text>
            </View>
          )}
        </View>

        {/* Farmácias */}
        {farmaciasFiltradas.length > 0 && (
          <View style={styles.secao}>
            <View style={styles.secaoHeader}>
              <View style={styles.secaoHeaderConteudo}>
                <Ionicons name="storefront" size={22} color={temaMedico.cores.primaria} />
                <Text style={styles.tituloSecao}>
                  {buscaAtiva ? 'Farmácias Encontradas' : 'Farmácias Parceiras'}
                </Text>
                {buscaAtiva && (
                  <Text style={styles.contadorProdutos}>({farmaciasFiltradas.length})</Text>
                )}
              </View>
              {!buscaAtiva && (
                <TouchableOpacity
                  style={styles.botaoVerTodos}
                  onPress={() => router.push('/sellers')}
                >
                  <Text style={styles.textoVerTodos}>Ver Todas</Text>
                  <Ionicons name="arrow-forward" size={16} color={temaMedico.cores.primaria} />
                </TouchableOpacity>
              )}
            </View>
            {farmaciasFiltradas.map((farmacia) => (
              <TouchableOpacity
                key={farmacia.id}
                style={styles.cartaoFarmacia}
                onPress={() => router.push(`/seller/${farmacia.id}` as any)}
              >
                <View style={styles.farmaciaIcone}>
                  <Ionicons name="storefront" size={24} color={temaMedico.cores.primaria} />
                </View>
                <View style={styles.farmaciaInfo}>
                  <Text style={styles.nomeFarmacia}>{farmacia.nomeFantasia}</Text>
                  {farmacia.endereco && (
                    <Text style={styles.enderecoFarmacia} numberOfLines={1}>
                      {farmacia.endereco.logradouro}, {farmacia.endereco.numero}
                    </Text>
                  )}
                  <View style={styles.statusContainer}>
                    <View style={styles.statusDot} />
                    <Text style={styles.statusTexto}>Ativo</Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={20} color={temaMedico.cores.textoSecundario} />
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={styles.espacamentoFinal} />
      </ScrollView>
    </View>
  );
}