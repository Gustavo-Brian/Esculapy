/**
 * Serviço de Rastreamento de Entregas
 * Gerencia pedidos e rastreamento de entregas
 */

import { PedidoEntrega, StatusEntrega } from '../tipos/PedidoEntrega';

// Dados mockados de pedidos
const PEDIDOS_MOCKADOS = [
  {
    id: 1,
    numero: '#12345',
    status: 'em_transito' as StatusEntrega,
    totalItens: 3,
    valorTotal: 89.90,
    estimativaEntrega: '25-30 min',
    enderecoEntrega: 'Rua das Flores, 123 - Centro, São Paulo - SP',
    dataPedido: new Date('2025-01-08T10:30:00'),
  },
  {
    id: 2,
    numero: '#12344',
    status: 'preparando' as StatusEntrega,
    totalItens: 2,
    valorTotal: 45.50,
    estimativaEntrega: '30-35 min',
    enderecoEntrega: 'Av. Paulista, 1000 - Bela Vista, São Paulo - SP',
    dataPedido: new Date('2025-01-08T11:15:00'),
  },
  {
    id: 3,
    numero: '#12343',
    status: 'entregue' as StatusEntrega,
    totalItens: 5,
    valorTotal: 156.80,
    estimativaEntrega: 'Entregue',
    enderecoEntrega: 'Rua Augusta, 456 - Consolação, São Paulo - SP',
    dataPedido: new Date('2025-01-07T14:20:00'),
    dataEntrega: new Date('2025-01-07T15:10:00'),
  },
];

export class ServicoRastreamento {
  private _pedidos: PedidoEntrega[];
  private _carregando: boolean = false;
  private _erro: string | null = null;

  constructor() {
    this._pedidos = [];
  }

  /**
   * Carrega pedidos do usuário
   */
  public async carregarPedidos(): Promise<PedidoEntrega[]> {
    try {
      this._carregando = true;
      this._erro = null;

      console.log('[ServicoRastreamento] Carregando pedidos...');

      // TODO: Quando backend implementar:
      // const dados = await apiGet('/api/pedidos/usuario');
      // this._pedidos = dados.map(p => PedidoEntrega.deAPI(p));

      // Por enquanto, usa dados mockados
      this._pedidos = PEDIDOS_MOCKADOS.map((p) => PedidoEntrega.criar(p));

      console.log('[ServicoRastreamento] Pedidos carregados:', this._pedidos.length);

      return this._pedidos;
    } catch (erro: any) {
      this._erro = erro.message || 'Erro ao carregar pedidos';
      console.error('[ServicoRastreamento] Erro:', this._erro);
      throw new Error(this._erro);
    } finally {
      this._carregando = false;
    }
  }

  /**
   * Filtra pedidos por status
   */
  public filtrarPorStatus(status: StatusEntrega): PedidoEntrega[] {
    return this._pedidos.filter((pedido) => pedido.status === status);
  }

  /**
   * Obtém pedidos em andamento (preparando ou em trânsito)
   */
  public obterPedidosEmAndamento(): PedidoEntrega[] {
    return this._pedidos.filter((p) => p.estaPreparando() || p.estaEmTransito());
  }

  /**
   * Obtém pedidos entregues
   */
  public obterPedidosEntregues(): PedidoEntrega[] {
    return this._pedidos.filter((p) => p.foiEntregue());
  }

  /**
   * Obtém pedidos cancelados
   */
  public obterPedidosCancelados(): PedidoEntrega[] {
    return this._pedidos.filter((p) => p.foiCancelado());
  }

  /**
   * Obtém pedido por ID
   */
  public obterPedidoPorId(id: number): PedidoEntrega | undefined {
    return this._pedidos.find((p) => p.id === id);
  }

  /**
   * Obtém pedido por número
   */
  public obterPedidoPorNumero(numero: string): PedidoEntrega | undefined {
    return this._pedidos.find((p) => p.numero === numero);
  }

  /**
   * Ordena pedidos por data (mais recente primeiro)
   */
  public ordenarPorDataRecente(): PedidoEntrega[] {
    return [...this._pedidos].sort((a, b) => b.dataPedido.getTime() - a.dataPedido.getTime());
  }

  /**
   * Ordena pedidos por data (mais antigo primeiro)
   */
  public ordenarPorDataAntiga(): PedidoEntrega[] {
    return [...this._pedidos].sort((a, b) => a.dataPedido.getTime() - b.dataPedido.getTime());
  }

  /**
   * Ordena pedidos por valor (maior primeiro)
   */
  public ordenarPorValorDecrescente(): PedidoEntrega[] {
    return [...this._pedidos].sort((a, b) => b.valorTotal - a.valorTotal);
  }

  /**
   * Calcula valor total de todos os pedidos
   */
  public calcularValorTotal(): number {
    return this._pedidos.reduce((total, pedido) => total + pedido.valorTotal, 0);
  }

  /**
   * Calcula total de itens em todos os pedidos
   */
  public calcularTotalItens(): number {
    return this._pedidos.reduce((total, pedido) => total + pedido.totalItens, 0);
  }

  /**
   * Obtém estatísticas
   */
  public obterEstatisticas() {
    return {
      totalPedidos: this._pedidos.length,
      emAndamento: this.obterPedidosEmAndamento().length,
      entregues: this.obterPedidosEntregues().length,
      cancelados: this.obterPedidosCancelados().length,
      valorTotal: this.calcularValorTotal(),
      totalItens: this.calcularTotalItens(),
    };
  }

  // Getters
  get pedidos(): PedidoEntrega[] { return this._pedidos; }
  get carregando(): boolean { return this._carregando; }
  get erro(): string | null { return this._erro; }
  get totalPedidos(): number { return this._pedidos.length; }
  get temPedidos(): boolean { return this._pedidos.length > 0; }
}
