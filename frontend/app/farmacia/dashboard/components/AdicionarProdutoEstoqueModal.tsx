/**
 * Modal para Adicionar Produto ao Estoque
 * Permite buscar produtos do catálogo e adicionar ao estoque da farmácia
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { temaMedico } from '@/src/estilos/temaMedico';
import { apiGet } from '@/src/servicos/api/config';
import { buildUrlWithParams, PRODUTOS_ENDPOINTS } from '@/src/servicos/api/endpoints';
import type { ProdutoCatalogo, EstoqueResponse } from '@/src/servicos/types/api.types';

interface AdicionarProdutoEstoqueModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (produtoId: number, preco: number, quantidade: number) => Promise<void>;
  produtosNoEstoque: EstoqueResponse[]; // Lista de produtos já adicionados ao estoque
}

export const AdicionarProdutoEstoqueModal: React.FC<AdicionarProdutoEstoqueModalProps> = ({
  visible,
  onClose,
  onSubmit,
  produtosNoEstoque,
}) => {
  const [etapa, setEtapa] = useState<'busca' | 'formulario'>('busca');
  const [buscaTexto, setBuscaTexto] = useState('');
  const [produtosCatalogo, setProdutosCatalogo] = useState<ProdutoCatalogo[]>([]);
  const [produtoSelecionado, setProdutoSelecionado] = useState<ProdutoCatalogo | null>(null);
  const [preco, setPreco] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [enviando, setEnviando] = useState(false);

  // Busca produtos diretamente da tabela productos_catalogo
  const buscarProdutos = async (texto: string) => {
    setCarregando(true);
    try {
      let produtos: ProdutoCatalogo[] = [];

      if (!texto || texto.trim() === '') {
        // Se busca vazia, busca todos os produtos do catálogo (IDs 1-100)
        console.log('[AdicionarProduto] Buscando todos os produtos do catálogo...');

        const promises: Promise<ProdutoCatalogo | null>[] = [];

        // Busca produtos por ID (de 1 a 100)
        for (let id = 1; id <= 100; id++) {
          const promise = apiGet<ProdutoCatalogo>(PRODUTOS_ENDPOINTS.DETALHES(id))
            .then((produto) => produto)
            .catch(() => null); // Se não existir, retorna null

          promises.push(promise);
        }

        const results = await Promise.all(promises);
        const todosProdutos = results.filter((p): p is ProdutoCatalogo => p !== null);

        // Filtra produtos que NÃO estão no estoque
        const produtosJaAdicionadosIds = new Set(produtosNoEstoque.map(p => p.produtoId));
        produtos = todosProdutos.filter(p => !produtosJaAdicionadosIds.has(p.id));

        console.log('[AdicionarProduto] Produtos encontrados no catálogo:', todosProdutos.length);
        console.log('[AdicionarProduto] Produtos já no estoque:', produtosJaAdicionadosIds.size);
        console.log('[AdicionarProduto] Produtos disponíveis para adicionar:', produtos.length);
      } else {
        // Se tem texto de busca, busca produtos que contêm o texto
        console.log('[AdicionarProduto] Buscando produtos com nome:', texto);

        // Busca todos os produtos primeiro
        const promises: Promise<ProdutoCatalogo | null>[] = [];

        for (let id = 1; id <= 100; id++) {
          const promise = apiGet<ProdutoCatalogo>(PRODUTOS_ENDPOINTS.DETALHES(id))
            .then((produto) => produto)
            .catch(() => null);

          promises.push(promise);
        }

        const results = await Promise.all(promises);
        const todosProdutos = results.filter((p): p is ProdutoCatalogo => p !== null);

        // Filtra por nome (case insensitive)
        const textoBusca = texto.toLowerCase();
        const produtosFiltradosPorNome = todosProdutos.filter((produto) =>
          produto.nome.toLowerCase().includes(textoBusca) ||
          (produto.principioAtivo && produto.principioAtivo.toLowerCase().includes(textoBusca)) ||
          (produto.laboratorio && produto.laboratorio.toLowerCase().includes(textoBusca))
        );

        // Filtra produtos que NÃO estão no estoque
        const produtosJaAdicionadosIds = new Set(produtosNoEstoque.map(p => p.produtoId));
        produtos = produtosFiltradosPorNome.filter(p => !produtosJaAdicionadosIds.has(p.id));

        console.log('[AdicionarProduto] Produtos filtrados por nome:', produtosFiltradosPorNome.length);
        console.log('[AdicionarProduto] Produtos já no estoque:', produtosJaAdicionadosIds.size);
        console.log('[AdicionarProduto] Produtos disponíveis para adicionar:', produtos.length);
      }

      setProdutosCatalogo(produtos);
    } catch (error: any) {
      console.error('[AdicionarProduto] Erro ao buscar produtos:', error);
      Alert.alert('Erro', 'Não foi possível buscar produtos do catálogo');
      setProdutosCatalogo([]);
    } finally {
      setCarregando(false);
    }
  };

  // Carrega todos os produtos quando o modal abre
  useEffect(() => {
    if (visible && etapa === 'busca') {
      buscarProdutos(''); // Busca todos os produtos ao abrir
    }
  }, [visible]);

  // Debounce da busca quando usuário digita
  useEffect(() => {
    if (!visible) return; // Só busca se modal estiver visível

    const timeout = setTimeout(() => {
      buscarProdutos(buscaTexto);
    }, 500);

    return () => clearTimeout(timeout);
  }, [buscaTexto, visible]);

  const selecionarProduto = (produto: ProdutoCatalogo) => {
    setProdutoSelecionado(produto);
    setEtapa('formulario');
  };

  const voltarParaBusca = () => {
    setEtapa('busca');
    setProdutoSelecionado(null);
    setPreco('');
    setQuantidade('');
  };

  const handleSubmit = async () => {
    if (!produtoSelecionado) return;

    const precoNumerico = parseFloat(preco.replace(',', '.'));
    const quantidadeNumerica = parseInt(quantidade, 10);

    if (isNaN(precoNumerico) || precoNumerico <= 0) {
      Alert.alert('Erro', 'Informe um preço válido');
      return;
    }

    if (isNaN(quantidadeNumerica) || quantidadeNumerica < 0) {
      Alert.alert('Erro', 'Informe uma quantidade válida');
      return;
    }

    setEnviando(true);
    try {
      await onSubmit(produtoSelecionado.id, precoNumerico, quantidadeNumerica);
      handleClose();
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Erro ao adicionar produto ao estoque');
    } finally {
      setEnviando(false);
    }
  };

  const handleClose = () => {
    setEtapa('busca');
    setBuscaTexto('');
    setProdutosCatalogo([]);
    setProdutoSelecionado(null);
    setPreco('');
    setQuantidade('');
    onClose();
  };

  const renderBuscaEtapa = () => (
    <View style={styles.content}>
      <Text style={styles.label}>Buscar Produto no Catálogo</Text>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={temaMedico.cores.textoClaro} />
        <TextInput
          style={styles.searchInput}
          placeholder="Digite o nome do produto..."
          placeholderTextColor={temaMedico.cores.textoClaro}
          value={buscaTexto}
          onChangeText={setBuscaTexto}
          autoFocus
        />
        {buscaTexto.length > 0 && (
          <TouchableOpacity onPress={() => setBuscaTexto('')}>
            <Ionicons name="close-circle" size={20} color={temaMedico.cores.textoClaro} />
          </TouchableOpacity>
        )}
      </View>

      {carregando && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={temaMedico.cores.primaria} />
          <Text style={styles.loadingText}>Buscando produtos do catálogo...</Text>
        </View>
      )}

      <ScrollView style={styles.resultadosContainer} showsVerticalScrollIndicator={false}>
        {!carregando && produtosCatalogo.length === 0 && (
          <View style={styles.emptyContainer}>
            <Ionicons name="cube-outline" size={48} color={temaMedico.cores.textoClaro} />
            <Text style={styles.emptyText}>
              {buscaTexto.trim()
                ? 'Nenhum produto encontrado'
                : 'Nenhum produto no catálogo'}
            </Text>
            <Text style={styles.emptySubtext}>
              {buscaTexto.trim()
                ? 'Tente outro termo de busca'
                : 'O catálogo está vazio'}
            </Text>
          </View>
        )}

        {produtosCatalogo.map((produto) => (
          <TouchableOpacity
            key={produto.id}
            style={styles.produtoCard}
            onPress={() => selecionarProduto(produto)}
          >
            <View style={styles.produtoInfo}>
              <Text style={styles.produtoNome}>{produto.nome}</Text>
              {produto.principioAtivo && (
                <Text style={styles.produtoDetalhes}>
                  Princípio Ativo: {produto.principioAtivo}
                </Text>
              )}
              {produto.laboratorio && (
                <Text style={styles.produtoDetalhes}>Laboratório: {produto.laboratorio}</Text>
              )}
            </View>
            <Ionicons name="chevron-forward" size={20} color={temaMedico.cores.textoClaro} />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderFormularioEtapa = () => (
    <View style={styles.content}>
      <TouchableOpacity style={styles.backButton} onPress={voltarParaBusca}>
        <Ionicons name="arrow-back" size={24} color={temaMedico.cores.primaria} />
        <Text style={styles.backText}>Voltar para busca</Text>
      </TouchableOpacity>

      <View style={styles.produtoSelecionadoCard}>
        <Text style={styles.produtoSelecionadoNome}>{produtoSelecionado?.nome}</Text>
        {produtoSelecionado?.principioAtivo && (
          <Text style={styles.produtoSelecionadoDetalhes}>
            {produtoSelecionado.principioAtivo}
          </Text>
        )}
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Preço (R$) *</Text>
        <TextInput
          style={styles.input}
          placeholder="0,00"
          placeholderTextColor={temaMedico.cores.textoClaro}
          keyboardType="decimal-pad"
          value={preco}
          onChangeText={setPreco}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Quantidade em Estoque *</Text>
        <TextInput
          style={styles.input}
          placeholder="0"
          placeholderTextColor={temaMedico.cores.textoClaro}
          keyboardType="number-pad"
          value={quantidade}
          onChangeText={setQuantidade}
        />
      </View>

      <TouchableOpacity
        style={[styles.submitButton, enviando && styles.submitButtonDisabled]}
        onPress={handleSubmit}
        disabled={enviando}
      >
        {enviando ? (
          <ActivityIndicator size="small" color="#FFF" />
        ) : (
          <>
            <Ionicons name="checkmark-circle" size={24} color="#FFF" />
            <Text style={styles.submitButtonText}>Adicionar ao Estoque</Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );

  const getCorTarja = (tarja: string): string => {
    switch (tarja) {
      case 'VERMELHA':
        return '#EF4444';
      case 'AMARELA':
        return '#F59E0B';
      case 'PRETA':
        return '#1F2937';
      default:
        return '#6B7280';
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={handleClose}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Adicionar Produto ao Estoque</Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Ionicons name="close" size={28} color={temaMedico.cores.textoTitulo} />
            </TouchableOpacity>
          </View>

          {etapa === 'busca' ? renderBuscaEtapa() : renderFormularioEtapa()}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: temaMedico.cores.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: temaMedico.cores.backgroundInput,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: temaMedico.cores.textoTitulo,
    flex: 1,
  },
  closeButton: {
    padding: 4,
  },
  content: {
    padding: 20,
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: temaMedico.cores.textoTitulo,
    marginBottom: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: temaMedico.cores.backgroundInput,
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    height: 48,
    fontSize: 16,
    color: temaMedico.cores.textoTitulo,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    color: temaMedico.cores.textoSubtitulo,
  },
  resultadosContainer: {
    flex: 1,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    gap: 12,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: temaMedico.cores.textoTitulo,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: temaMedico.cores.textoSubtitulo,
    textAlign: 'center',
  },
  produtoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: temaMedico.cores.backgroundCard,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    gap: 12,
  },
  produtoInfo: {
    flex: 1,
    gap: 4,
  },
  produtoNome: {
    fontSize: 16,
    fontWeight: '600',
    color: temaMedico.cores.textoTitulo,
    marginBottom: 4,
  },
  produtoDetalhes: {
    fontSize: 13,
    color: temaMedico.cores.textoSubtitulo,
  },
  tarjaBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginTop: 6,
  },
  tarjaText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFF',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
  },
  backText: {
    fontSize: 16,
    fontWeight: '600',
    color: temaMedico.cores.primaria,
  },
  produtoSelecionadoCard: {
    backgroundColor: temaMedico.cores.backgroundCard,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  produtoSelecionadoNome: {
    fontSize: 18,
    fontWeight: '700',
    color: temaMedico.cores.textoTitulo,
    marginBottom: 4,
  },
  produtoSelecionadoDetalhes: {
    fontSize: 14,
    color: temaMedico.cores.textoSubtitulo,
  },
  formGroup: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: temaMedico.cores.backgroundInput,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 48,
    fontSize: 16,
    color: temaMedico.cores.textoTitulo,
  },
  submitButton: {
    backgroundColor: temaMedico.cores.primaria,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 8,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFF',
  },
});
