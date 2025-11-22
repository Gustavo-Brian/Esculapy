/**
 * Classe Alerta
 * Representa um alerta do dashboard (estoque baixo, esgotado, etc.)
 */

export type TipoAlerta = 'esgotado' | 'baixo_estoque' | 'info' | 'sucesso';
export type PrioridadeAlerta = 'alta' | 'media' | 'baixa';

export class Alerta {
  private _id: string;
  private _tipo: TipoAlerta;
  private _titulo: string;
  private _mensagem: string;
  private _prioridade: PrioridadeAlerta;
  private _produtoId?: number;
  private _estoqueId?: number;
  private _dataHora: Date;

  constructor(dados: {
    id: string;
    tipo: TipoAlerta;
    titulo: string;
    mensagem: string;
    prioridade: PrioridadeAlerta;
    produtoId?: number;
    estoqueId?: number;
    dataHora?: Date;
  }) {
    this._id = dados.id;
    this._tipo = dados.tipo;
    this._titulo = dados.titulo;
    this._mensagem = dados.mensagem;
    this._prioridade = dados.prioridade;
    this._produtoId = dados.produtoId;
    this._estoqueId = dados.estoqueId;
    this._dataHora = dados.dataHora || new Date();
  }

  // Getters
  get id(): string { return this._id; }
  get tipo(): TipoAlerta { return this._tipo; }
  get titulo(): string { return this._titulo; }
  get mensagem(): string { return this._mensagem; }
  get prioridade(): PrioridadeAlerta { return this._prioridade; }
  get produtoId(): number | undefined { return this._produtoId; }
  get estoqueId(): number | undefined { return this._estoqueId; }
  get dataHora(): Date { return this._dataHora; }

  /**
   * Obtém cor do alerta baseado no tipo
   */
  public obterCor(): string {
    const cores: Record<TipoAlerta, string> = {
      esgotado: '#E53935',      // Vermelho
      baixo_estoque: '#FB8C00', // Laranja
      info: '#1E88E5',          // Azul
      sucesso: '#43A047',       // Verde
    };
    return cores[this._tipo];
  }

  /**
   * Obtém ícone do alerta baseado no tipo
   */
  public obterIcone(): string {
    const icones: Record<TipoAlerta, string> = {
      esgotado: 'alert-circle',
      baixo_estoque: 'warning',
      info: 'information-circle',
      sucesso: 'checkmark-circle',
    };
    return icones[this._tipo];
  }

  /**
   * Verifica se o alerta é crítico (prioridade alta)
   */
  public eCritico(): boolean {
    return this._prioridade === 'alta';
  }

  /**
   * Verifica se o alerta está vinculado a um produto
   */
  public temProdutoVinculado(): boolean {
    return this._produtoId !== undefined && this._estoqueId !== undefined;
  }

  /**
   * Formata data/hora do alerta
   */
  public formatarDataHora(): string {
    const hoje = new Date();
    const diferenca = hoje.getTime() - this._dataHora.getTime();
    const minutos = Math.floor(diferenca / (1000 * 60));
    const horas = Math.floor(diferenca / (1000 * 60 * 60));

    if (minutos < 1) return 'Agora';
    if (minutos < 60) return `Há ${minutos}min`;
    if (horas < 24) return `Há ${horas}h`;

    return this._dataHora.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  /**
   * Converte para JSON
   */
  public paraJSON() {
    return {
      id: this._id,
      tipo: this._tipo,
      titulo: this._titulo,
      mensagem: this._mensagem,
      prioridade: this._prioridade,
      produtoId: this._produtoId,
      estoqueId: this._estoqueId,
      dataHora: this._dataHora.toISOString(),
    };
  }

  /**
   * Cria alerta de produto esgotado
   */
  public static criarAlertaEsgotado(produtoNome: string, produtoId: number, estoqueId: number): Alerta {
    return new Alerta({
      id: `esgotado-${estoqueId}`,
      tipo: 'esgotado',
      titulo: 'Produto Esgotado',
      mensagem: `${produtoNome} está sem estoque!`,
      prioridade: 'alta',
      produtoId,
      estoqueId,
    });
  }

  /**
   * Cria alerta de estoque baixo
   */
  public static criarAlertaBaixoEstoque(
    produtoNome: string,
    quantidade: number,
    produtoId: number,
    estoqueId: number
  ): Alerta {
    return new Alerta({
      id: `baixo-${estoqueId}`,
      tipo: 'baixo_estoque',
      titulo: 'Estoque Baixo',
      mensagem: `${produtoNome} está com apenas ${quantidade} ${quantidade === 1 ? 'unidade' : 'unidades'}!`,
      prioridade: 'media',
      produtoId,
      estoqueId,
    });
  }

  /**
   * Cria alerta informativo
   */
  public static criarAlertaInfo(titulo: string, mensagem: string): Alerta {
    return new Alerta({
      id: `info-${Date.now()}`,
      tipo: 'info',
      titulo,
      mensagem,
      prioridade: 'baixa',
    });
  }
}
