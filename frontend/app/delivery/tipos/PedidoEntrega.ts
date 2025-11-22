/**
 * Classe PedidoEntrega
 * Representa um pedido com rastreamento de entrega
 */

export type StatusEntrega = 'preparando' | 'em_transito' | 'entregue' | 'cancelado';

export class PedidoEntrega {
  private _id: number;
  private _numero: string;
  private _status: StatusEntrega;
  private _totalItens: number;
  private _valorTotal: number;
  private _estimativaEntrega: string;
  private _enderecoEntrega: string;
  private _dataPedido: Date;
  private _dataEntrega?: Date;

  constructor(dados: {
    id: number;
    numero: string;
    status: StatusEntrega;
    totalItens: number;
    valorTotal: number;
    estimativaEntrega: string;
    enderecoEntrega: string;
    dataPedido: Date;
    dataEntrega?: Date;
  }) {
    this._id = dados.id;
    this._numero = dados.numero;
    this._status = dados.status;
    this._totalItens = dados.totalItens;
    this._valorTotal = dados.valorTotal;
    this._estimativaEntrega = dados.estimativaEntrega;
    this._enderecoEntrega = dados.enderecoEntrega;
    this._dataPedido = dados.dataPedido;
    this._dataEntrega = dados.dataEntrega;
  }

  // Getters
  get id(): number { return this._id; }
  get numero(): string { return this._numero; }
  get status(): StatusEntrega { return this._status; }
  get totalItens(): number { return this._totalItens; }
  get valorTotal(): number { return this._valorTotal; }
  get estimativaEntrega(): string { return this._estimativaEntrega; }
  get enderecoEntrega(): string { return this._enderecoEntrega; }
  get dataPedido(): Date { return this._dataPedido; }
  get dataEntrega(): Date | undefined { return this._dataEntrega; }

  // Status
  public estaPreparando(): boolean { return this._status === 'preparando'; }
  public estaEmTransito(): boolean { return this._status === 'em_transito'; }
  public foiEntregue(): boolean { return this._status === 'entregue'; }
  public foiCancelado(): boolean { return this._status === 'cancelado'; }

  public obterTextoStatus(): string {
    const textos: Record<StatusEntrega, string> = {
      preparando: 'Preparando',
      em_transito: 'Em trânsito',
      entregue: 'Entregue',
      cancelado: 'Cancelado',
    };
    return textos[this._status];
  }

  public obterCorStatus(): string {
    const cores: Record<StatusEntrega, string> = {
      preparando: '#F59E0B',
      em_transito: '#3B82F6',
      entregue: '#10B981',
      cancelado: '#EF4444',
    };
    return cores[this._status];
  }

  public obterIconeStatus(): string {
    const icones: Record<StatusEntrega, string> = {
      preparando: 'time-outline',
      em_transito: 'bicycle-outline',
      entregue: 'checkmark-circle-outline',
      cancelado: 'close-circle-outline',
    };
    return icones[this._status];
  }

  // Formatação
  public formatarValorTotal(): string {
    return `R$ ${this._valorTotal.toFixed(2).replace('.', ',')}`;
  }

  public formatarDataPedido(): string {
    return this._dataPedido.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }

  public paraJSON() {
    return {
      id: this._id,
      numero: this._numero,
      status: this._status,
      totalItens: this._totalItens,
      valorTotal: this._valorTotal,
      estimativaEntrega: this._estimativaEntrega,
      enderecoEntrega: this._enderecoEntrega,
      dataPedido: this._dataPedido.toISOString(),
      dataEntrega: this._dataEntrega?.toISOString(),
    };
  }

  public static criar(dados: any): PedidoEntrega {
    return new PedidoEntrega({
      id: dados.id,
      numero: dados.numero,
      status: dados.status,
      totalItens: dados.items || dados.totalItens,
      valorTotal: dados.total || dados.valorTotal,
      estimativaEntrega: dados.estimativa || dados.estimativaEntrega || 'A calcular',
      enderecoEntrega: dados.endereco || dados.enderecoEntrega || '',
      dataPedido: dados.dataPedido ? new Date(dados.dataPedido) : new Date(),
      dataEntrega: dados.dataEntrega ? new Date(dados.dataEntrega) : undefined,
    });
  }

  public static deAPI(dados: any): PedidoEntrega {
    return new PedidoEntrega({
      id: dados.id,
      numero: dados.numero || `#${dados.id}`,
      status: dados.status,
      totalItens: dados.totalItens || dados.total_items,
      valorTotal: dados.valorTotal || dados.total_value,
      estimativaEntrega: dados.estimativaEntrega || dados.estimated_delivery,
      enderecoEntrega: dados.enderecoEntrega || dados.delivery_address,
      dataPedido: new Date(dados.dataPedido || dados.created_at),
      dataEntrega: dados.dataEntrega ? new Date(dados.dataEntrega) : undefined,
    });
  }
}
