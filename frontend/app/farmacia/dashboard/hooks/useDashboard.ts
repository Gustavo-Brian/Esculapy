/**
 * Hook useDashboard
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { router } from 'expo-router';
import { Alert } from 'react-native';
import { useAuth } from '@/src/hooks/useAuth';
import { calcularEstatisticasEstoque, buscarEstoqueProprio, atualizarEstoque, adicionarProdutoEstoque, removerItemEstoque } from '@/src/servicos/estoque/estoqueService';
import { adicionarFarmaceutico, listarFarmaceuticos } from '@/src/servicos/farmaceutico/farmaceuticoService';
import { updateFarmaceutico, desativarFarmaceutico, reativarFarmaceutico, excluirFarmaceutico } from '@/src/servicos/farmacia/farmaciaAdminService';
import { getPedidosFarmacia, updateStatusPedido } from '@/src/servicos/farmacia/pedidoManagementService';
import { apiGet } from '@/src/servicos/api/config';
import { USER_ENDPOINTS } from '@/src/servicos/api/endpoints';
import type { EstoqueResponse, Farmaceutico, MeResponse, Pedido } from '@/src/servicos/types/api.types';
import type { DashboardTab, DashboardUIState, DashboardData, DashboardHandlers } from '../types/dashboard.types';
import type { Alerta } from '../tipos/alerta.types';
import type { AcaoRapida } from '../tipos/acoes.types';
import { temaMedico } from '@/src/estilos/temaMedico';
import { calcularEstatisticasVendas, gerarAlertasPedidos } from '../utils/estatisticasCalculator';

export const useDashboard = () => {
  const { user, logout } = useAuth();

  const [uiState, setUiState] = useState<DashboardUIState>({
    tabAtiva: 'dashboard',
    filtroEstoque: 'todos',
    filtroVisibilidade: 'todos',
    ordenacaoEstoque: 'nome',
    editModalVisible: false,
    farmaceuticoModalVisible: false,
    editarFarmaceuticoModalVisible: false,
    desativarFarmaceuticoModalVisible: false,
    adicionarProdutoModalVisible: false,
    removerProdutoModalVisible: false,
    mostrarOpcaoZerarEstoque: false,
    produtoEditando: null,
    produtoRemovendo: null,
    farmaceuticoEditando: null,
    farmaceuticoDesativando: null,
  });

  const [data, setData] = useState<DashboardData>({
    estoqueStats: null,
    produtosEstoque: [],
    loadingStats: true,
    alertas: [],
    vendasStats: null,
    acoesRapidas: [],
  });

  const [farmaceuticos, setFarmaceuticos] = useState<Farmaceutico[]>([]);
  const [loadingFarmaceuticos, setLoadingFarmaceuticos] = useState(false);
  const [nomeFarmacia, setNomeFarmacia] = useState<string>('');

  // Estados para Pedidos
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loadingPedidos, setLoadingPedidos] = useState(false);
  const [atualizandoStatus, setAtualizandoStatus] = useState(false);
  const [filtroPedidos, setFiltroPedidos] = useState<'TODOS' | 'AGUARDANDO_PAGAMENTO' | 'AGUARDANDO_RECEITA' | 'CONFIRMADO' | 'EM_PREPARACAO' | 'PRONTO_PARA_ENTREGA' | 'EM_TRANSPORTE' | 'ENTREGUE'>('TODOS');
  const [refreshingFarmaceuticos, setRefreshingFarmaceuticos] = useState(false);
  const [refreshingPedidos, setRefreshingPedidos] = useState(false);

  const [snackbar, setSnackbar] = useState({
    visible: false,
    message: '',
    type: 'info' as 'success' | 'error' | 'info',
  });

  const showSnackbar = useCallback((message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setSnackbar({ visible: true, message, type });
  }, []);

  // Gera alertas baseados no estoque e pedidos
  const gerarAlertas = useCallback((produtos: EstoqueResponse[], pedidosAtivos: Pedido[]): Alerta[] => {
    const alertas: Alerta[] = [];

    // Alertas de pedidos
    const alertasPedidos = gerarAlertasPedidos(pedidosAtivos);
    alertasPedidos.forEach((alerta, index) => {
      alertas.push({
        id: `pedido-${alerta.tipo}-${index}`,
        tipo: alerta.tipo,
        nivel: alerta.tipo === 'aguardando_receita' ? 'warning' : 'info',
        titulo: alerta.tipo === 'aguardando_receita' ? 'Receitas Pendentes' : 'Pedidos em Separação',
        mensagem: alerta.mensagem,
        data: new Date(),
      });
    });

    // Alertas de produtos esgotados
    produtos.filter(p => p.quantidade === 0 && p.ativo !== false).forEach(produto => {
      const nomeProduto = produto.produtoNome || 'Produto sem nome';
      alertas.push({
        id: `esgotado-${produto.estoqueId}`,
        tipo: 'esgotado',
        nivel: 'error',
        titulo: 'Produto Esgotado',
        mensagem: `${nomeProduto} está sem estoque`,
        data: new Date(),
        produtoId: produto.produtoId,
        produtoNome: produto.produtoNome,
        quantidade: 0,
      });
    });

    // Alertas de estoque baixo (< 10 unidades)
    produtos.filter(p => p.quantidade > 0 && p.quantidade < 10 && p.ativo !== false).forEach(produto => {
      const nomeProduto = produto.produtoNome || 'Produto sem nome';
      alertas.push({
        id: `baixo-${produto.estoqueId}`,
        tipo: 'estoque_baixo',
        nivel: 'warning',
        titulo: 'Estoque Baixo',
        mensagem: `${nomeProduto} tem apenas ${produto.quantidade} unidades`,
        data: new Date(),
        produtoId: produto.produtoId,
        produtoNome: produto.produtoNome,
        quantidade: produto.quantidade,
      });
    });

    // Limita a 6 alertas mais críticos (prioriza pedidos e esgotados)
    return alertas.slice(0, 6);
  }, []);

  // Cria ações rápidas
  const criarAcoesRapidas = useCallback((todosPedidos: Pedido[]): AcaoRapida[] => {
    // Conta pedidos aguardando receita
    const pedidosAguardandoReceita = todosPedidos.filter(p => p.status === 'AGUARDANDO_RECEITA').length;
    // Conta pedidos em separação
    const pedidosEmSeparacao = todosPedidos.filter(p => p.status === 'EM_SEPARACAO').length;

    return [
      {
        id: 'ver_pedidos',
        titulo: 'Ver Pedidos',
        icone: 'receipt',
        cor: temaMedico.cores.primaria,
        onPress: () => {
          setUiState(prev => ({ ...prev, tabAtiva: 'pedidos' }));
        },
        badge: pedidosEmSeparacao > 0 ? pedidosEmSeparacao : undefined,
      },
      {
        id: 'adicionar_estoque',
        titulo: 'Adicionar Produto',
        icone: 'add-circle',
        cor: '#10B981',
        onPress: () => {
          setUiState(prev => ({ ...prev, adicionarProdutoModalVisible: true }));
        },
      },
      {
        id: 'gerenciar_estoque',
        titulo: 'Gerenciar Estoque',
        icone: 'cube',
        cor: '#F59E0B',
        onPress: () => {
          setUiState(prev => ({ ...prev, tabAtiva: 'estoque' }));
        },
        badge: data.estoqueStats?.produtosBaixoEstoque,
      },
      {
        id: 'validar_receitas',
        titulo: 'Validar Receitas',
        icone: 'document-text',
        cor: '#8B5CF6',
        onPress: () => {
          setUiState(prev => ({ ...prev, tabAtiva: 'pedidos', filtroPedidos: 'AGUARDANDO_RECEITA' }));
          setFiltroPedidos('AGUARDANDO_RECEITA');
        },
        badge: pedidosAguardandoReceita > 0 ? pedidosAguardandoReceita : undefined,
      },
      {
        id: 'farmaceuticos',
        titulo: 'Farmacêuticos',
        icone: 'people',
        cor: '#06B6D4',
        onPress: () => {
          setUiState(prev => ({ ...prev, tabAtiva: 'farmaceuticos' }));
        },
      },
      {
        id: 'configuracoes',
        titulo: 'Configurações',
        icone: 'settings',
        cor: '#6B7280',
        onPress: () => {
          showSnackbar('Função em desenvolvimento', 'info');
        },
      },
    ];
  }, [data.estoqueStats?.produtosBaixoEstoque, showSnackbar]);

  const recarregarEstoque = useCallback(async () => {
    try {
      const [stats, produtos, todosPedidos] = await Promise.all([
        calcularEstatisticasEstoque(),
        buscarEstoqueProprio(''),
        getPedidosFarmacia(),
      ]);

      const alertas = gerarAlertas(produtos, todosPedidos);
      const vendasStats = calcularEstatisticasVendas(todosPedidos);
      const acoesRapidas = criarAcoesRapidas(todosPedidos);

      setData((prev) => ({
        ...prev,
        estoqueStats: stats,
        produtosEstoque: produtos,
        alertas,
        vendasStats,
        acoesRapidas,
      }));
    } catch (error) {
      console.error('Erro ao recarregar estoque:', error);
    }
  }, [gerarAlertas, criarAcoesRapidas]);

  useEffect(() => {
    const carregarDados = async () => {
      try {
        console.log('[Dashboard] Carregando dados reais da API...');
        setData((prev) => ({ ...prev, loadingStats: true }));

        // Busca dados da farmácia do usuário autenticado
        const meData = await apiGet<MeResponse>(USER_ENDPOINTS.ME);

        // Extrai nome da farmácia (nomeFantasia ou razaoSocial como fallback)
        const farmaciaName = meData.farmaciaAdmin?.nomeFantasia ||
                            meData.farmaciaAdmin?.razaoSocial ||
                            'Farmácia';
        setNomeFarmacia(farmaciaName);
        console.log('[Dashboard] Nome da farmácia:', farmaciaName);

        const [stats, produtos, todosPedidos] = await Promise.all([
          calcularEstatisticasEstoque(),
          buscarEstoqueProprio(''),
          getPedidosFarmacia(),
        ]);

        console.log('[Dashboard] Stats carregadas:', stats);
        console.log('[Dashboard] Produtos carregados:', produtos.length);
        console.log('[Dashboard] Pedidos carregados:', todosPedidos.length);

        const alertas = gerarAlertas(produtos, todosPedidos);
        const vendasStats = calcularEstatisticasVendas(todosPedidos);
        const acoesRapidas = criarAcoesRapidas(todosPedidos);

        console.log('[Dashboard] Estatísticas de vendas calculadas:', vendasStats);

        setData({
          estoqueStats: stats,
          produtosEstoque: produtos,
          loadingStats: false,
          alertas,
          vendasStats,
          acoesRapidas,
        });
      } catch (error) {
        console.error('[Dashboard] Erro ao carregar dados:', error);
        setData((prev) => ({ ...prev, loadingStats: false }));
      }
    };
    carregarDados();
  }, [gerarAlertas, criarAcoesRapidas]);

  const produtosFiltrados = useMemo(() => {
    let filtered = [...data.produtosEstoque];

    // Filtro por quantidade (baixo/esgotado)
    if (uiState.filtroEstoque === 'baixo') {
      filtered = filtered.filter((p) => p.quantidade > 0 && p.quantidade < 10);
    } else if (uiState.filtroEstoque === 'esgotado') {
      filtered = filtered.filter((p) => p.quantidade === 0);
    }

    // Filtro por visibilidade (ativo/inativo)
    if (uiState.filtroVisibilidade === 'ativos') {
      filtered = filtered.filter((p) => p.ativo !== false); // Considera undefined como ativo
    } else if (uiState.filtroVisibilidade === 'inativos') {
      filtered = filtered.filter((p) => p.ativo === false);
    }

    // Ordenação
    filtered.sort((a, b) => {
      if (uiState.ordenacaoEstoque === 'nome') {
        const nomeA = a.produtoNome || '';
        const nomeB = b.produtoNome || '';
        return nomeA.localeCompare(nomeB);
      }
      if (uiState.ordenacaoEstoque === 'quantidade') return (a.quantidade || 0) - (b.quantidade || 0);
      if (uiState.ordenacaoEstoque === 'preco') return (a.preco || 0) - (b.preco || 0);
      return 0;
    });

    return filtered;
  }, [data.produtosEstoque, uiState.filtroEstoque, uiState.filtroVisibilidade, uiState.ordenacaoEstoque]);

  // Pedidos filtrados
  const pedidosFiltrados = useMemo(() => {
    if (filtroPedidos === 'TODOS') {
      return pedidos;
    }
    return pedidos.filter(p => p.status === filtroPedidos);
  }, [pedidos, filtroPedidos]);

  const handleChangeTab = useCallback((tab: DashboardTab) => {
    setUiState((prev) => ({ ...prev, tabAtiva: tab }));
  }, []);

  const handleChangeFiltroEstoque = useCallback((filtro: 'todos' | 'baixo' | 'esgotado') => {
    setUiState((prev) => ({ ...prev, filtroEstoque: filtro }));
  }, []);

  const handleChangeFiltroVisibilidade = useCallback((filtro: 'todos' | 'ativos' | 'inativos') => {
    setUiState((prev) => ({ ...prev, filtroVisibilidade: filtro }));
  }, []);

  const handleChangeOrdenacao = useCallback((ordenacao: 'nome' | 'quantidade' | 'preco') => {
    setUiState((prev) => ({ ...prev, ordenacaoEstoque: ordenacao }));
  }, []);

  const handleEditarProduto = useCallback((produto: EstoqueResponse) => {
    setUiState((prev) => ({ ...prev, produtoEditando: produto, editModalVisible: true }));
  }, []);

  const handleSalvarEdicao = useCallback(async (estoqueId: number, preco: number, quantidade: number) => {
    try {
      // Busca o produto sendo editado para obter o produtoId
      const produtoEditando = data.produtosEstoque.find(p => p.estoqueId === estoqueId);
      if (!produtoEditando) {
        throw new Error('Produto não encontrado');
      }

      await atualizarEstoque(estoqueId, {
        produtoId: produtoEditando.produtoId,
        preco,
        quantidade
      });
      showSnackbar('Estoque atualizado com sucesso!', 'success');
      await recarregarEstoque();
    } catch (error: any) {
      throw new Error(error?.message || 'Erro ao atualizar estoque');
    }
  }, [data.produtosEstoque, recarregarEstoque, showSnackbar]);

  const carregarFarmaceuticos = useCallback(async () => {
    try {
      setLoadingFarmaceuticos(true);
      const lista = await listarFarmaceuticos();
      setFarmaceuticos(lista);
    } catch (error: any) {
      console.error('[Dashboard] Erro ao carregar farmacêuticos:', error);
      showSnackbar('Erro ao carregar lista de farmacêuticos', 'error');
    } finally {
      setLoadingFarmaceuticos(false);
    }
  }, [showSnackbar]);

  const handleAdicionarFarmaceutico = useCallback(async (request: any) => {
    try {
      await adicionarFarmaceutico(request);
      showSnackbar(`Farmacêutico ${request.nome} cadastrado com sucesso!`, 'success');
      await carregarFarmaceuticos();
    } catch (error: any) {
      throw new Error(error?.message || 'Erro ao cadastrar farmacêutico');
    }
  }, [showSnackbar, carregarFarmaceuticos]);

  const handleEditarFarmaceutico = useCallback((farmaceutico: Farmaceutico) => {
    setUiState(prev => ({
      ...prev,
      farmaceuticoEditando: farmaceutico,
      editarFarmaceuticoModalVisible: true,
    }));
  }, []);

  const handleSalvarEdicaoFarmaceutico = useCallback(async (
    farmaceuticoId: number,
    nome: string,
    numeroCelular: string
  ) => {
    try {
      await updateFarmaceutico(farmaceuticoId, { nome, numeroCelular });
      showSnackbar('Farmacêutico atualizado com sucesso!', 'success');
      await carregarFarmaceuticos();
      setUiState(prev => ({
        ...prev,
        editarFarmaceuticoModalVisible: false,
        farmaceuticoEditando: null,
      }));
    } catch (error: any) {
      console.error('[Dashboard] Erro ao atualizar farmacêutico:', error);
      showSnackbar(error?.message || 'Erro ao atualizar farmacêutico', 'error');
    }
  }, [showSnackbar, carregarFarmaceuticos]);

  const handleDesativarFarmaceutico = useCallback((farmaceutico: Farmaceutico) => {
    setUiState(prev => ({
      ...prev,
      farmaceuticoDesativando: farmaceutico,
      desativarFarmaceuticoModalVisible: true,
    }));
  }, []);

  const handleConfirmarDesativacaoFarmaceutico = useCallback(async () => {
    if (!uiState.farmaceuticoDesativando) return;

    try {
      await desativarFarmaceutico(uiState.farmaceuticoDesativando.id);
      showSnackbar('Farmacêutico desativado com sucesso!', 'success');
      await carregarFarmaceuticos();
      setUiState(prev => ({
        ...prev,
        desativarFarmaceuticoModalVisible: false,
        farmaceuticoDesativando: null,
      }));
    } catch (error: any) {
      console.error('[Dashboard] Erro ao desativar farmacêutico:', error);
      showSnackbar(error?.message || 'Erro ao desativar farmacêutico', 'error');
    }
  }, [uiState.farmaceuticoDesativando, showSnackbar, carregarFarmaceuticos]);

  const handleReativarFarmaceutico = useCallback(async (farmaceutico: Farmaceutico) => {
    try {
      await reativarFarmaceutico(farmaceutico.id);
      showSnackbar('Farmacêutico reativado com sucesso!', 'success');
      await carregarFarmaceuticos();
    } catch (error: any) {
      console.error('[Dashboard] Erro ao reativar farmacêutico:', error);
      showSnackbar(error?.message || 'Erro ao reativar farmacêutico', 'error');
    }
  }, [showSnackbar, carregarFarmaceuticos]);

  const handleExcluirFarmaceutico = useCallback((farmaceutico: Farmaceutico) => {
    Alert.alert(
      'Excluir Farmacêutico',
      `Tem certeza que deseja excluir ${farmaceutico.nome}? Esta ação não pode ser desfeita.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await excluirFarmaceutico(farmaceutico.id);
              showSnackbar('Farmacêutico excluído com sucesso!', 'success');
              await carregarFarmaceuticos();
            } catch (error: any) {
              console.error('[Dashboard] Erro ao excluir farmacêutico:', error);
              showSnackbar(error?.message || 'Erro ao excluir farmacêutico', 'error');
            }
          },
        },
      ]
    );
  }, [showSnackbar, carregarFarmaceuticos]);

  // === FUNÇÕES DE PEDIDOS ===
  const carregarPedidos = useCallback(async () => {
    try {
      console.log('[Dashboard] Carregando pedidos da farmácia...');
      setLoadingPedidos(true);
      const listaPedidos = await getPedidosFarmacia();
      setPedidos(listaPedidos);
      console.log('[Dashboard] Pedidos carregados:', listaPedidos.length);
    } catch (error: any) {
      console.error('[Dashboard] Erro ao carregar pedidos:', error);
      showSnackbar('Erro ao carregar pedidos', 'error');
    } finally {
      setLoadingPedidos(false);
    }
  }, [showSnackbar]);

  // === REFRESH HANDLERS ===
  const handleRefreshFarmaceuticos = useCallback(async () => {
    setRefreshingFarmaceuticos(true);
    try {
      await carregarFarmaceuticos();
    } finally {
      setRefreshingFarmaceuticos(false);
    }
  }, [carregarFarmaceuticos]);

  const handleRefreshPedidos = useCallback(async () => {
    setRefreshingPedidos(true);
    try {
      await carregarPedidos();
    } finally {
      setRefreshingPedidos(false);
    }
  }, [carregarPedidos]);

  const handleAtualizarStatusPedido = useCallback(async (
    pedidoId: number,
    novoStatus: 'EM_SEPARACAO' | 'ENVIADO' | 'ENTREGUE'
  ) => {
    try {
      setAtualizandoStatus(true);
      console.log('[Dashboard] Atualizando status do pedido:', { pedidoId, novoStatus });

      await updateStatusPedido(pedidoId, novoStatus);
      showSnackbar('Status atualizado com sucesso!', 'success');

      // Recarrega lista de pedidos
      await carregarPedidos();
    } catch (error: any) {
      console.error('[Dashboard] Erro ao atualizar status:', error);
      showSnackbar(error?.message || 'Erro ao atualizar status do pedido', 'error');
    } finally {
      setAtualizandoStatus(false);
    }
  }, [showSnackbar, carregarPedidos]);

  const handleVerDetalhesPedido = useCallback((pedidoId: number) => {
    Alert.alert(
      'Detalhes do Pedido',
      `Ver detalhes do pedido #${pedidoId}\n\nEsta funcionalidade será implementada em breve.`,
      [{ text: 'OK' }]
    );
  }, []);

  const handleAdicionarProduto = useCallback(async (produtoId: number, preco: number, quantidade: number) => {
    try {
      await adicionarProdutoEstoque({ produtoId, preco, quantidade });
      showSnackbar('Produto adicionado ao estoque com sucesso!', 'success');
      await recarregarEstoque();
      setUiState((prev) => ({ ...prev, adicionarProdutoModalVisible: false }));
    } catch (error: any) {
      throw new Error(error?.message || 'Erro ao adicionar produto ao estoque');
    }
  }, [recarregarEstoque, showSnackbar]);

  const handleRemoverProduto = useCallback((produto: EstoqueResponse) => {
    setUiState((prev) => ({ ...prev, produtoRemovendo: produto, removerProdutoModalVisible: true }));
  }, []);

  const handleConfirmarRemocao = useCallback(async () => {
    if (!uiState.produtoRemovendo) return;

    try {
      console.log('[Dashboard] Removendo produto:', uiState.produtoRemovendo.estoqueId);
      await removerItemEstoque(uiState.produtoRemovendo.estoqueId);
      console.log('[Dashboard] Produto removido com sucesso');
      showSnackbar('Produto removido do estoque com sucesso!', 'success');
      await recarregarEstoque();
      setUiState((prev) => ({
        ...prev,
        removerProdutoModalVisible: false,
        mostrarOpcaoZerarEstoque: false,
        produtoRemovendo: null
      }));
    } catch (error: any) {
      console.error('[Dashboard] Erro ao remover produto:', error);
      const mensagem = error?.message || 'Erro ao remover produto do estoque';

      // Detecta erro de foreign key constraint (produto usado em pedidos)
      const isForeignKeyError = mensagem.includes('foi utilizado em pedidos') ||
                                mensagem.includes('foreign key constraint') ||
                                mensagem.includes('itens_pedido');

      if (isForeignKeyError) {
        // Mostra opção de zerar estoque ao invés de fechar o modal
        setUiState((prev) => ({ ...prev, mostrarOpcaoZerarEstoque: true }));
      } else {
        // Outros erros: mostra snackbar e fecha modal
        showSnackbar(mensagem, 'error');
        await recarregarEstoque();
        setUiState((prev) => ({
          ...prev,
          removerProdutoModalVisible: false,
          mostrarOpcaoZerarEstoque: false,
          produtoRemovendo: null
        }));
      }
    }
  }, [uiState.produtoRemovendo, recarregarEstoque, showSnackbar]);

  const handleZerarEstoque = useCallback(async () => {
    if (!uiState.produtoRemovendo) return;

    try {
      console.log('[Dashboard] Zerando estoque do produto:', uiState.produtoRemovendo.estoqueId);

      // Atualiza quantidade para 0 e desativa o produto
      await atualizarEstoque(uiState.produtoRemovendo.estoqueId, {
        produtoId: uiState.produtoRemovendo.produtoId,
        preco: uiState.produtoRemovendo.preco,
        quantidade: 0,
        ativo: false // Desativa o produto quando zerar estoque
      });

      console.log('[Dashboard] Estoque zerado e produto desativado com sucesso');
      showSnackbar('Estoque zerado e produto desativado! Não estará mais disponível para venda.', 'success');
      await recarregarEstoque();
      setUiState((prev) => ({
        ...prev,
        removerProdutoModalVisible: false,
        mostrarOpcaoZerarEstoque: false,
        produtoRemovendo: null
      }));
    } catch (error: any) {
      console.error('[Dashboard] Erro ao zerar estoque:', error);
      showSnackbar(error?.message || 'Erro ao zerar estoque', 'error');
    }
  }, [uiState.produtoRemovendo, recarregarEstoque, showSnackbar]);

  const handleToggleAtivo = useCallback(async (produto: EstoqueResponse) => {
    try {
      const novoStatusAtivo = produto.ativo === false ? true : false;
      console.log('[Dashboard] Alternando status ativo do produto:', {
        estoqueId: produto.estoqueId,
        ativoAtual: produto.ativo,
        novoStatus: novoStatusAtivo
      });

      await atualizarEstoque(produto.estoqueId, {
        produtoId: produto.produtoId,
        preco: produto.preco,
        quantidade: produto.quantidade,
        ativo: novoStatusAtivo
      });

      const mensagem = novoStatusAtivo
        ? 'Produto ativado com sucesso!'
        : 'Produto desativado. Não estará mais disponível para venda.';

      showSnackbar(mensagem, 'success');
      await recarregarEstoque();
    } catch (error: any) {
      console.error('[Dashboard] Erro ao alternar status do produto:', error);
      showSnackbar(error?.message || 'Erro ao atualizar status do produto', 'error');
    }
  }, [atualizarEstoque, recarregarEstoque, showSnackbar]);

  // Carrega farmacêuticos quando a aba é alterada para 'farmaceuticos'
  useEffect(() => {
    if (uiState.tabAtiva === 'farmaceuticos') {
      carregarFarmaceuticos();
    }
  }, [uiState.tabAtiva, carregarFarmaceuticos]);

  // Carrega pedidos quando a aba é alterada para 'pedidos'
  useEffect(() => {
    if (uiState.tabAtiva === 'pedidos') {
      carregarPedidos();

      // Atualiza pedidos a cada 30 segundos
      const interval = setInterval(() => {
        carregarPedidos();
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [uiState.tabAtiva, carregarPedidos]);

  const handlers: DashboardHandlers = {
    onChangeTab: handleChangeTab,
    onChangeFiltroEstoque: handleChangeFiltroEstoque,
    onChangeFiltroVisibilidade: handleChangeFiltroVisibilidade,
    onChangeOrdenacao: handleChangeOrdenacao,
    onEditarProduto: handleEditarProduto,
    onSalvarEdicao: handleSalvarEdicao,
    onAdicionarProduto: handleAdicionarProduto,
    onRemoverProduto: handleRemoverProduto,
    onConfirmarRemocao: handleConfirmarRemocao,
    onZerarEstoque: handleZerarEstoque,
    onToggleAtivo: handleToggleAtivo,
    // Farmacêuticos
    onAdicionarFarmaceutico: handleAdicionarFarmaceutico,
    onEditarFarmaceutico: handleEditarFarmaceutico,
    onSalvarEdicaoFarmaceutico: handleSalvarEdicaoFarmaceutico,
    onDesativarFarmaceutico: handleDesativarFarmaceutico,
    onConfirmarDesativacaoFarmaceutico: handleConfirmarDesativacaoFarmaceutico,
    onReativarFarmaceutico: handleReativarFarmaceutico,
    onExcluirFarmaceutico: handleExcluirFarmaceutico,
    // Pedidos
    onAtualizarStatusPedido: handleAtualizarStatusPedido,
    onVerDetalhesPedido: handleVerDetalhesPedido,
    onRecarregarPedidos: carregarPedidos,
    // Refresh
    onRefreshFarmaceuticos: handleRefreshFarmaceuticos,
    onRefreshPedidos: handleRefreshPedidos,
    // Filtros
    onChangeFiltroPedidos: setFiltroPedidos,
    // Modais
    onCloseEditModal: () => setUiState((prev) => ({ ...prev, editModalVisible: false, produtoEditando: null })),
    onCloseFarmaceuticoModal: () => setUiState((prev) => ({ ...prev, farmaceuticoModalVisible: false })),
    onOpenFarmaceuticoModal: () => setUiState((prev) => ({ ...prev, farmaceuticoModalVisible: true })),
    onCloseEditarFarmaceuticoModal: () => setUiState((prev) => ({ ...prev, editarFarmaceuticoModalVisible: false, farmaceuticoEditando: null })),
    onCloseDesativarFarmaceuticoModal: () => setUiState((prev) => ({ ...prev, desativarFarmaceuticoModalVisible: false, farmaceuticoDesativando: null })),
    onOpenAdicionarProdutoModal: () => setUiState((prev) => ({ ...prev, adicionarProdutoModalVisible: true })),
    onCloseAdicionarProdutoModal: () => setUiState((prev) => ({ ...prev, adicionarProdutoModalVisible: false })),
    onCloseRemoverProdutoModal: () => setUiState((prev) => ({ ...prev, removerProdutoModalVisible: false, mostrarOpcaoZerarEstoque: false, produtoRemovendo: null })),
    onLogout: () => {
      logout();
      router.replace('/login');
    },
  };

  return {
    user,
    uiState,
    data,
    produtosFiltrados,
    farmaceuticos,
    loadingFarmaceuticos,
    nomeFarmacia,
    // Pedidos
    pedidos: pedidosFiltrados,
    loadingPedidos,
    atualizandoStatus,
    filtroPedidos,
    refreshingFarmaceuticos,
    refreshingPedidos,
    snackbar,
    showSnackbar,
    handlers,
  };
};
