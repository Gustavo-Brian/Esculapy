/**
 * Hook OOP: useDadosFarmacia
 * Conecta o ServicoFarmacia ao React
 */

console.log('🔥🔥🔥 [useDadosFarmacia.ts] ARQUIVO CARREGADO - VERSÃO NOVA COM LOGS! 🔥🔥🔥');

import { useState, useEffect, useMemo, useCallback } from 'react';
import { router } from 'expo-router';
import { Alert } from 'react-native';
import { ServicoFarmacia, AbaFarmacia } from '../servicos/ServicoFarmacia';
import { Farmacia } from '../tipos/Farmacia';
import { ProdutoFarmacia } from '../tipos/ProdutoFarmacia';
import { AvaliacaoFarmacia } from '../tipos/AvaliacaoFarmacia';
import { useCart } from '@/src/hooks/useCart';
import type { EstoqueResponse } from '@/src/servicos/types/api.types';

export function useDadosFarmacia(farmaciaId: number) {
  console.log('🟢 [useDadosFarmacia] HOOK INICIALIZADO - farmaciaId:', farmaciaId);

  const [servico] = useState(() => {
    console.log('🟢 [useDadosFarmacia] Criando nova instância de ServicoFarmacia');
    return new ServicoFarmacia();
  });
  const { adicionarAoCarrinho } = useCart();

  const [farmacia, definirFarmacia] = useState<Farmacia | null>(null);
  const [produtos, definirProdutos] = useState<ProdutoFarmacia[]>([]);
  const [avaliacoes, definirAvaliacoes] = useState<AvaliacaoFarmacia[]>([]);
  const [seguindo, definirSeguindo] = useState(false);
  const [abaAtiva, definirAbaAtiva] = useState<AbaFarmacia>('produtos');
  const [carregando, definirCarregando] = useState(true);
  const [erro, definirErro] = useState<string | null>(null);

  // Estados de filtros
  const [termoPesquisa, definirTermoPesquisa] = useState('');
  const [filtroAvaliacao, definirFiltroAvaliacao] = useState<number | null>(null);

  // Estados do modal de quantidade
  const [modalQuantidadeVisivel, setModalQuantidadeVisivel] = useState(false);
  const [produtoSelecionado, setProdutoSelecionado] = useState<ProdutoFarmacia | null>(null);

  /**
   * Monitora ciclo de vida do componente
   */
  useEffect(() => {
    console.log('🟢 [useDadosFarmacia] useEffect MONTADO');
    return () => {
      console.log('🔴 [useDadosFarmacia] useEffect DESMONTADO');
    };
  }, []);

  /**
   * Carrega dados na montagem
   */
  useEffect(() => {
    console.log('🟢 [useDadosFarmacia] useEffect carregarDados EXECUTADO - farmaciaId:', farmaciaId);
    carregarDados();
  }, [farmaciaId]);

  /**
   * Carrega todos os dados
   */
  const carregarDados = useCallback(async () => {
    try {
      definirCarregando(true);
      definirErro(null);

      console.log('[useDadosFarmacia] Iniciando carregamento para farmaciaId:', farmaciaId);

      await servico.carregarTodosDados(farmaciaId);

      console.log('[useDadosFarmacia] Dados carregados do serviço:', {
        temFarmacia: !!servico.farmacia,
        farmaciaNome: servico.farmacia?.nome,
        totalProdutos: servico.produtos.length,
        totalAvaliacoes: servico.avaliacoes.length,
      });

      definirFarmacia(servico.farmacia);
      definirProdutos(servico.produtos);
      definirAvaliacoes(servico.avaliacoes);

      console.log('[useDadosFarmacia] Estados atualizados');
    } catch (erro: any) {
      definirErro(erro.message);
      console.error('[useDadosFarmacia] Erro ao carregar:', erro);
    } finally {
      definirCarregando(false);
    }
  }, [farmaciaId, servico]);

  /**
   * Produtos filtrados (pesquisa)
   */
  const produtosFiltrados = useMemo(() => {
    if (!termoPesquisa.trim()) return produtos;

    const termo = termoPesquisa.toLowerCase();
    return produtos.filter((produto) =>
      produto.nome.toLowerCase().includes(termo)
    );
  }, [produtos, termoPesquisa]);

  /**
   * Avaliações filtradas (por estrelas)
   */
  const avaliacoesFiltradas = useMemo(() => {
    if (!filtroAvaliacao) return avaliacoes;

    return avaliacoes.filter((avaliacao) =>
      avaliacao.nota === filtroAvaliacao
    );
  }, [avaliacoes, filtroAvaliacao]);

  /**
   * Produtos com desconto
   */
  const produtosComDesconto = useMemo(() => {
    return servico.obterProdutosComDesconto();
  }, [produtos, servico]);

  /**
   * Avaliações positivas
   */
  const avaliacoesPositivas = useMemo(() => {
    return servico.obterAvaliacoesPositivas();
  }, [avaliacoes, servico]);

  /**
   * Estatísticas
   */
  const estatisticas = useMemo(() => {
    return servico.obterEstatisticas();
  }, [produtos, avaliacoes, servico]);

  /**
   * Conteúdo da aba ativa
   */
  const conteudoAbaAtiva = useMemo(() => {
    return abaAtiva === 'produtos' ? produtos : avaliacoes;
  }, [abaAtiva, produtos, avaliacoes]);

  /**
   * Manipuladores
   */
  const manipuladores = useMemo(() => ({
    /**
     * Volta para tela anterior
     */
    aoVoltar: () => {
      router.back();
    },

    /**
     * Compartilha farmácia
     */
    aoCompartilhar: () => {
      if (farmacia) {
        Alert.alert('Compartilhar', `Compartilhar ${farmacia.nome}`);
        console.log('[useDadosFarmacia] Compartilhar farmácia:', farmacia.id);
      }
    },

    /**
     * Alterna seguir farmácia
     */
    aoSeguir: () => {
      const novoEstado = servico.alternarSeguir();
      definirSeguindo(novoEstado);
      definirFarmacia(servico.farmacia);

      if (farmacia) {
        Alert.alert(
          novoEstado ? 'Seguindo' : 'Deixou de seguir',
          novoEstado
            ? `Agora você segue ${farmacia.nome}`
            : `Você não segue mais ${farmacia.nome}`
        );
      }
    },

    /**
     * Liga para farmácia
     */
    aoLigar: () => {
      if (farmacia) {
        Alert.alert('Ligar', `Ligar para ${farmacia.telefone}?`);
        console.log('[useDadosFarmacia] Ligar para:', farmacia.telefone);
      }
    },

    /**
     * Abre chat com farmácia
     */
    aoAbrirChat: () => {
      if (farmacia) {
        Alert.alert('Chat', `Iniciar conversa com ${farmacia.nome}`);
        console.log('[useDadosFarmacia] Chat com farmácia:', farmacia.id);
      }
    },

    /**
     * Seleciona aba
     */
    aoSelecionarAba: (aba: AbaFarmacia) => {
      servico.alterarAba(aba);
      definirAbaAtiva(aba);
    },

    /**
     * Visualiza produto
     */
    aoVisualizarProduto: (produtoId: number) => {
      router.push(`/product/${produtoId}`);
    },

    /**
     * Abre modal para adicionar produto ao carrinho
     */
    aoAdicionarProduto: (produtoId: number) => {
      const produto = produtos.find((p) => p.id === produtoId);
      if (produto && produto.estaEmEstoque()) {
        setProdutoSelecionado(produto);
        setModalQuantidadeVisivel(true);
      }
    },

    /**
     * Confirma adição do produto com quantidade selecionada
     */
    aoConfirmarQuantidade: async (quantidade: number) => {
      console.log('[useDadosFarmacia] aoConfirmarQuantidade iniciado:', {
        temProdutoSelecionado: !!produtoSelecionado,
        temFarmacia: !!farmacia,
        farmaciaCompleta: farmacia,
      });

      console.log('[useDadosFarmacia] 🔍 COMPARAÇÃO DE ESTADOS:', {
        'farmacia (estado React)': farmacia,
        'servico.farmacia (serviço)': servico.farmacia,
        'farmacia?.nome': farmacia?.nome,
        'servico.farmacia?.nome': servico.farmacia?.nome,
      });

      if (!produtoSelecionado) {
        console.error('[useDadosFarmacia] Produto não selecionado!');
        return;
      }

      if (!farmacia) {
        console.error('[useDadosFarmacia] Farmácia não carregada!');
        Alert.alert(
          'Erro',
          'Dados da farmácia não carregados. Por favor, recarregue a página.'
        );
        return;
      }

      try {
        // Validar que temos o estoqueId real da API
        if (!produtoSelecionado.estoqueId) {
          console.error('[useDadosFarmacia] Produto não tem estoqueId!', produtoSelecionado);
          Alert.alert(
            'Erro',
            'Produto inválido. Por favor, recarregue a página.'
          );
          return;
        }

        console.log('[useDadosFarmacia] Dados da farmácia:', {
          farmaciaId,
          farmaciaNome: farmacia.nome,
          produtoId: produtoSelecionado.id,
          produtoNome: produtoSelecionado.nome,
          estoqueId: produtoSelecionado.estoqueId,
        });

        // Converte ProdutoFarmacia para EstoqueResponse
        const estoqueData: EstoqueResponse = {
          estoqueId: produtoSelecionado.estoqueId, // Usa estoqueId REAL da API
          produtoId: produtoSelecionado.id,
          produtoNome: produtoSelecionado.nome,
          produtoDescricao: produtoSelecionado.descricao || null,
          preco: produtoSelecionado.preco,
          quantidade: quantidade,
          ativo: true,
          farmaciaId: farmaciaId,
          farmaciaRazaoSocial: farmacia.nome,
          farmaciaEndereco: null,
          farmaciaDistancia: null,
        };

        const sucesso = await adicionarAoCarrinho(estoqueData, quantidade);

        if (sucesso) {
          const total = produtoSelecionado.preco * quantidade;
          Alert.alert(
            'Produto Adicionado! 🛒',
            `${quantidade}x "${produtoSelecionado.nome}" adicionado ao carrinho.\n\nFarmácia: ${farmacia.nome}\nTotal: R$ ${total.toFixed(2).replace('.', ',')}`,
            [
              {
                text: 'Continuar Comprando',
                style: 'cancel',
              },
              {
                text: 'Ver Carrinho',
                onPress: () => router.push('/cart'),
              },
            ]
          );
        } else {
          Alert.alert(
            'Erro',
            'Não foi possível adicionar o produto ao carrinho. Tente novamente.'
          );
        }
      } catch (error: any) {
        console.error('[useDadosFarmacia] Erro ao adicionar ao carrinho:', error);
        Alert.alert(
          'Erro',
          error.message || 'Não foi possível adicionar o produto ao carrinho.'
        );
      }
    },

    /**
     * Fecha modal de quantidade
     */
    aoFecharModal: () => {
      setModalQuantidadeVisivel(false);
      setProdutoSelecionado(null);
    },

    /**
     * Recarrega dados
     */
    aoRecarregar: carregarDados,

    /**
     * Altera termo de pesquisa
     */
    aoPesquisar: (termo: string) => {
      definirTermoPesquisa(termo);
    },

    /**
     * Altera filtro de avaliação
     */
    aoFiltrarAvaliacao: (nota: number | null) => {
      definirFiltroAvaliacao(nota);
    },

    /**
     * Limpa filtros
     */
    aoLimparFiltros: () => {
      definirTermoPesquisa('');
      definirFiltroAvaliacao(null);
    },
  }), [servico, farmacia, produtos, produtoSelecionado, carregarDados, adicionarAoCarrinho, farmaciaId]);

  return {
    // Dados
    farmacia,
    produtos: produtosFiltrados,
    avaliacoes: avaliacoesFiltradas,
    produtosComDesconto,
    avaliacoesPositivas,
    conteudoAbaAtiva,
    estatisticas,

    // Estado
    seguindo,
    abaAtiva,
    carregando,
    erro,

    // Filtros
    termoPesquisa,
    filtroAvaliacao,

    // Modal de quantidade
    modalQuantidadeVisivel,
    produtoSelecionado,

    // Verificações
    temFarmacia: servico.temFarmacia,
    temProdutos: servico.temProdutos,
    temAvaliacoes: servico.temAvaliacoes,
    temErro: erro !== null,

    // Manipuladores
    manipuladores,
  };
}
