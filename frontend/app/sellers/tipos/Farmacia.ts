/**
 * Classe Farmacia
 * Representa uma farmácia/drogaria no marketplace
 */

export class Farmacia {
  private _id: number;
  private _nome: string;
  private _avaliacao: number;
  private _totalAvaliacoes: number;
  private _distancia: string;
  private _tempoEntrega: string;
  private _produtos: number;
  private _verificada: boolean;
  private _fechada: boolean;
  private _icone: string;
  private _corCapa: string;
  private _tags: string[];

  constructor(dados: {
    id: number;
    nome: string;
    avaliacao: number;
    totalAvaliacoes: number;
    distancia: string;
    tempoEntrega: string;
    produtos: number;
    verificada: boolean;
    fechada?: boolean;
    icone: string;
    corCapa: string;
    tags: string[];
  }) {
    this._id = dados.id;
    this._nome = dados.nome;
    this._avaliacao = dados.avaliacao;
    this._totalAvaliacoes = dados.totalAvaliacoes;
    this._distancia = dados.distancia;
    this._tempoEntrega = dados.tempoEntrega;
    this._produtos = dados.produtos;
    this._verificada = dados.verificada;
    this._fechada = dados.fechada || false;
    this._icone = dados.icone;
    this._corCapa = dados.corCapa;
    this._tags = dados.tags || [];
  }

  // Getters
  get id(): number { return this._id; }
  get nome(): string { return this._nome; }
  get avaliacao(): number { return this._avaliacao; }
  get totalAvaliacoes(): number { return this._totalAvaliacoes; }
  get distancia(): string { return this._distancia; }
  get tempoEntrega(): string { return this._tempoEntrega; }
  get produtos(): number { return this._produtos; }
  get verificada(): boolean { return this._verificada; }
  get fechada(): boolean { return this._fechada; }
  get icone(): string { return this._icone; }
  get corCapa(): string { return this._corCapa; }
  get tags(): string[] { return this._tags; }

  /**
   * Verifica se farmácia está aberta
   */
  public estaAberta(): boolean {
    return !this._fechada;
  }

  /**
   * Verifica se farmácia está fechada
   */
  public estaFechada(): boolean {
    return this._fechada;
  }

  /**
   * Verifica se farmácia é verificada
   */
  public eVerificada(): boolean {
    return this._verificada;
  }

  /**
   * Verifica se tem avaliação alta (>= 4.5)
   */
  public temAvaliacaoAlta(): boolean {
    return this._avaliacao >= 4.5;
  }

  /**
   * Verifica se tem muitas avaliações (>= 100)
   */
  public temMuitasAvaliacoes(): boolean {
    return this._totalAvaliacoes >= 100;
  }

  /**
   * Formata avaliação com estrelas
   */
  public formatarAvaliacao(): string {
    return `${this._avaliacao.toFixed(1)} ⭐`;
  }

  /**
   * Formata total de avaliações
   */
  public formatarTotalAvaliacoes(): string {
    if (this._totalAvaliacoes >= 1000) {
      return `${(this._totalAvaliacoes / 1000).toFixed(1)}k avaliações`;
    }
    return `${this._totalAvaliacoes} ${this._totalAvaliacoes === 1 ? 'avaliação' : 'avaliações'}`;
  }

  /**
   * Obtém status da farmácia (Aberta/Fechada)
   */
  public obterStatus(): 'ABERTA' | 'FECHADA' {
    return this._fechada ? 'FECHADA' : 'ABERTA';
  }

  /**
   * Obtém cor do status
   */
  public obterCorStatus(): string {
    return this._fechada ? '#EF4444' : '#10B981'; // Vermelho/Verde
  }

  /**
   * Verifica se tem tag específica
   */
  public temTag(tag: string): boolean {
    return this._tags.some((t) => t.toLowerCase() === tag.toLowerCase());
  }

  /**
   * Verifica se tem entrega rápida
   */
  public temEntregaRapida(): boolean {
    return this.temTag('Entrega rápida');
  }

  /**
   * Verifica se tem melhores preços
   */
  public temMelhoresPrecos(): boolean {
    return this.temTag('Melhores preços');
  }

  /**
   * Obtém distância em km (numérico)
   */
  public obterDistanciaKm(): number {
    const match = this._distancia.match(/(\d+\.?\d*)/);
    return match ? parseFloat(match[1]) : 999;
  }

  /**
   * Verifica se está próxima (< 3km)
   */
  public estaProxima(): boolean {
    return this.obterDistanciaKm() < 3;
  }

  /**
   * Formata quantidade de produtos
   */
  public formatarQuantidadeProdutos(): string {
    if (this._produtos >= 1000) {
      return `${(this._produtos / 1000).toFixed(1)}k+ produtos`;
    }
    return `${this._produtos} produtos`;
  }

  /**
   * Obtém descrição resumida
   */
  public obterDescricaoResumida(): string {
    const partes: string[] = [];

    if (this._verificada) {
      partes.push('✓ Verificada');
    }

    partes.push(this.formatarAvaliacao());
    partes.push(this._distancia);

    if (!this._fechada) {
      partes.push(this._tempoEntrega);
    }

    return partes.join(' • ');
  }

  /**
   * Converte para JSON
   */
  public paraJSON() {
    return {
      id: this._id,
      nome: this._nome,
      avaliacao: this._avaliacao,
      totalAvaliacoes: this._totalAvaliacoes,
      distancia: this._distancia,
      tempoEntrega: this._tempoEntrega,
      produtos: this._produtos,
      verificada: this._verificada,
      fechada: this._fechada,
      icone: this._icone,
      corCapa: this._corCapa,
      tags: this._tags,
    };
  }

  /**
   * Cria instância a partir de dados mockados/API
   */
  public static criar(dados: any): Farmacia {
    return new Farmacia({
      id: dados.id,
      nome: dados.nome,
      avaliacao: dados.avaliacao || 0,
      totalAvaliacoes: dados.totalAvaliacoes || 0,
      distancia: dados.distancia || '0 km',
      tempoEntrega: dados.tempoEntrega || 'Não disponível',
      produtos: dados.produtos || 0,
      verificada: dados.verificada !== undefined ? dados.verificada : false,
      fechada: dados.fechada || false,
      icone: dados.icone || 'medical',
      corCapa: dados.corCapa || 'rgba(59, 130, 246, 0.2)',
      tags: dados.tags || [],
    });
  }

  /**
   * Cria instância a partir de dados da API
   */
  public static deAPI(dados: any): Farmacia {
    return new Farmacia({
      id: dados.id,
      nome: dados.nome,
      avaliacao: dados.avaliacao || dados.rating || 0,
      totalAvaliacoes: dados.totalAvaliacoes || dados.total_reviews || 0,
      distancia: dados.distancia || dados.distance || '0 km',
      tempoEntrega: dados.tempoEntrega || dados.delivery_time || 'Não disponível',
      produtos: dados.produtos || dados.total_products || 0,
      verificada: dados.verificada !== undefined ? dados.verificada : dados.verified !== undefined ? dados.verified : false,
      fechada: dados.fechada !== undefined ? dados.fechada : dados.closed !== undefined ? dados.closed : false,
      icone: dados.icone || dados.icon || 'medical',
      corCapa: dados.corCapa || dados.cover_color || 'rgba(59, 130, 246, 0.2)',
      tags: dados.tags || [],
    });
  }
}
