/**
 * Pharmacy Dashboard Types
 */

import type { EstoqueStats, EstoqueResponse, Farmaceutico } from '@/src/servicos/types/api.types';
import type { Alerta } from '../tipos/alerta.types';
import type { EstatisticasVendas } from '../tipos/vendas.types';
import type { AcaoRapida } from '../tipos/acoes.types';

export type DashboardTab = 'dashboard' | 'estoque' | 'pedidos' | 'farmaceuticos';

export interface Stat {
  id: string;
  label: string;
  valor: string;
  icone: string;
  corIcone: string;
}

export interface DashboardUIState {
  tabAtiva: DashboardTab;
  filtroEstoque: 'todos' | 'baixo' | 'esgotado';
  filtroVisibilidade: 'todos' | 'ativos' | 'inativos';
  ordenacaoEstoque: 'nome' | 'quantidade' | 'preco';
  editModalVisible: boolean;
  farmaceuticoModalVisible: boolean;
  editarFarmaceuticoModalVisible: boolean;
  desativarFarmaceuticoModalVisible: boolean;
  adicionarProdutoModalVisible: boolean;
  removerProdutoModalVisible: boolean;
  mostrarOpcaoZerarEstoque: boolean;
  produtoEditando: EstoqueResponse | null;
  produtoRemovendo: EstoqueResponse | null;
  farmaceuticoEditando: Farmaceutico | null;
  farmaceuticoDesativando: Farmaceutico | null;
}

export interface DashboardData {
  estoqueStats: EstoqueStats | null;
  produtosEstoque: EstoqueResponse[];
  loadingStats: boolean;
  alertas: Alerta[];
  vendasStats: EstatisticasVendas | null;
  acoesRapidas: AcaoRapida[];
}

export interface DashboardHandlers {
  onChangeTab: (tab: DashboardTab) => void;
  onChangeFiltroEstoque: (filtro: 'todos' | 'baixo' | 'esgotado') => void;
  onChangeFiltroVisibilidade: (filtro: 'todos' | 'ativos' | 'inativos') => void;
  onChangeOrdenacao: (ordenacao: 'nome' | 'quantidade' | 'preco') => void;
  onEditarProduto: (produto: EstoqueResponse) => void;
  onSalvarEdicao: (estoqueId: number, preco: number, quantidade: number) => Promise<void>;
  onAdicionarProduto: (produtoId: number, preco: number, quantidade: number) => Promise<void>;
  onRemoverProduto: (produto: EstoqueResponse) => void;
  onConfirmarRemocao: () => Promise<void>;
  onZerarEstoque: () => Promise<void>;
  onToggleAtivo: (produto: EstoqueResponse) => Promise<void>;
  // Farmacêuticos
  onAdicionarFarmaceutico: (request: any) => Promise<void>;
  onEditarFarmaceutico: (farmaceutico: Farmaceutico) => void;
  onSalvarEdicaoFarmaceutico: (farmaceuticoId: number, nome: string, numeroCelular: string) => Promise<void>;
  onDesativarFarmaceutico: (farmaceutico: Farmaceutico) => void;
  onConfirmarDesativacaoFarmaceutico: () => Promise<void>;
  onReativarFarmaceutico: (farmaceutico: Farmaceutico) => Promise<void>;
  onExcluirFarmaceutico: (farmaceutico: Farmaceutico) => void;
  // Pedidos
  onAtualizarStatusPedido: (pedidoId: number, novoStatus: 'CONFIRMADO' | 'EM_PREPARACAO' | 'PRONTO_PARA_ENTREGA' | 'EM_TRANSPORTE' | 'ENTREGUE') => Promise<void>;
  onVerDetalhesPedido: (pedidoId: number) => void;
  onRecarregarPedidos: () => Promise<void>;
  onChangeFiltroPedidos: (filtro: 'TODOS' | 'AGUARDANDO_PAGAMENTO' | 'AGUARDANDO_RECEITA' | 'CONFIRMADO' | 'EM_PREPARACAO' | 'PRONTO_PARA_ENTREGA' | 'EM_TRANSPORTE' | 'ENTREGUE') => void;
  // Refresh
  onRefreshFarmaceuticos: () => Promise<void>;
  onRefreshPedidos: () => Promise<void>;
  // Modais
  onCloseEditModal: () => void;
  onCloseFarmaceuticoModal: () => void;
  onOpenFarmaceuticoModal: () => void;
  onCloseEditarFarmaceuticoModal: () => void;
  onCloseDesativarFarmaceuticoModal: () => void;
  onOpenAdicionarProdutoModal: () => void;
  onCloseAdicionarProdutoModal: () => void;
  onCloseRemoverProdutoModal: () => void;
  onLogout: () => void;
}
