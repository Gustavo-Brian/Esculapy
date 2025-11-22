/**
 * Modelo de Farmácia
 * Entidade de domínio
 */

export class Farmacia {
  private _id: number;
  private _nome: string;
  private _endereco: string;
  private _distancia: number;
  private _tempoEntrega: string;
  private _avaliacao: number;
  private _aberta: boolean;
  private _horarioAbertura: string;
  private _horarioFechamento: string;

  constructor(
    id: number,
    nome: string,
    endereco: string,
    distancia: number,
    tempoEntrega: string,
    avaliacao: number,
    aberta: boolean,
    horarioAbertura: string,
    horarioFechamento: string
  ) {
    this._id = id;
    this._nome = nome;
    this._endereco = endereco;
    this._distancia = distancia;
    this._tempoEntrega = tempoEntrega;
    this._avaliacao = avaliacao;
    this._aberta = aberta;
    this._horarioAbertura = horarioAbertura;
    this._horarioFechamento = horarioFechamento;
  }

  // Getters
  get id(): number { return this._id; }
  get nome(): string { return this._nome; }
  get endereco(): string { return this._endereco; }
  get distancia(): number { return this._distancia; }
  get tempoEntrega(): string { return this._tempoEntrega; }
  get avaliacao(): number { return this._avaliacao; }
  get aberta(): boolean { return this._aberta; }
  get horarioAbertura(): string { return this._horarioAbertura; }
  get horarioFechamento(): string { return this._horarioFechamento; }

  /**
   * Verifica se a farmácia tem boa avaliação (>= 4.0)
   */
  public temBoaAvaliacao(): boolean {
    return this._avaliacao >= 4.0;
  }

  /**
   * Formata a avaliação para exibição
   */
  public formatarAvaliacao(): string {
    return `${this._avaliacao.toFixed(1)}`;
  }

  /**
   * Formata a distância para exibição
   */
  public formatarDistancia(): string {
    if (this._distancia === 0) {
      return 'Distância não disponível';
    }
    return `${this._distancia.toFixed(1)} km`;
  }

  /**
   * Cria instância a partir de dados da API
   */
  public static deAPI(dados: any): Farmacia {
    return new Farmacia(
      dados.id,
      dados.nome || dados.nomeFantasia || 'Farmácia',
      dados.endereco || 'Endereço não disponível',
      dados.distancia || 0,
      dados.tempoEntrega || '30-45 min',
      dados.avaliacao || 4.5,
      dados.aberta !== false,
      dados.horarioAbertura || '08:00',
      dados.horarioFechamento || '22:00'
    );
  }
}
