/**
 * Classe Farmacia
 * Representa uma farmácia/vendedor com informações completas
 */

console.log('🔥🔥🔥 [Farmacia.ts] ARQUIVO CARREGADO - VERSÃO COM LOGS DE DEBUG! 🔥🔥🔥');

export class Farmacia {
  private _id: number;
  private _nome: string;
  private _descricao: string;
  private _nota: number;
  private _totalAvaliacoes: number;
  private _distancia: string;
  private _tempoEntrega: string;
  private _verificada: boolean;
  private _seguidores: number;
  private _totalProdutos: number;
  private _totalVendas: number;
  private _telefone: string;
  private _endereco: string;
  private _horarios: HorarioFuncionamento[];

  constructor(dados: {
    id: number;
    nome: string;
    descricao: string;
    nota: number;
    totalAvaliacoes: number;
    distancia: string;
    tempoEntrega: string;
    verificada: boolean;
    seguidores: number;
    totalProdutos: number;
    totalVendas: number;
    telefone: string;
    endereco: string;
    horarios: HorarioFuncionamento[];
  }) {
    console.log('[Farmacia.constructor] 🏥 Criando instância de Farmacia:', {
      'dados recebidos': dados,
      'dados.nome': dados.nome,
      'typeof dados.nome': typeof dados.nome,
    });

    this._id = dados.id;
    this._nome = dados.nome;

    console.log('[Farmacia.constructor] ✅ this._nome definido como:', this._nome);
    this._descricao = dados.descricao;
    this._nota = dados.nota;
    this._totalAvaliacoes = dados.totalAvaliacoes;
    this._distancia = dados.distancia;
    this._tempoEntrega = dados.tempoEntrega;
    this._verificada = dados.verificada;
    this._seguidores = dados.seguidores;
    this._totalProdutos = dados.totalProdutos;
    this._totalVendas = dados.totalVendas;
    this._telefone = dados.telefone;
    this._endereco = dados.endereco;
    this._horarios = dados.horarios;
  }

  // Getters
  get id(): number { return this._id; }
  get nome(): string { return this._nome; }
  get descricao(): string { return this._descricao; }
  get nota(): number { return this._nota; }
  get totalAvaliacoes(): number { return this._totalAvaliacoes; }
  get distancia(): string { return this._distancia; }
  get tempoEntrega(): string { return this._tempoEntrega; }
  get verificada(): boolean { return this._verificada; }
  get seguidores(): number { return this._seguidores; }
  get totalProdutos(): number { return this._totalProdutos; }
  get totalVendas(): number { return this._totalVendas; }
  get telefone(): string { return this._telefone; }
  get endereco(): string { return this._endereco; }
  get horarios(): HorarioFuncionamento[] { return this._horarios; }

  /**
   * Verifica se é verificada
   */
  public eVerificada(): boolean {
    return this._verificada;
  }

  /**
   * Verifica se tem boa nota (>= 4.5)
   */
  public temBoaAvaliacao(): boolean {
    return this._nota >= 4.5;
  }

  /**
   * Verifica se tem muitas avaliações (> 100)
   */
  public temMuitasAvaliacoes(): boolean {
    return this._totalAvaliacoes > 100;
  }

  /**
   * Verifica se é popular (> 1000 seguidores)
   */
  public ePopular(): boolean {
    return this._seguidores > 1000;
  }

  /**
   * Verifica se tem grande variedade (> 300 produtos)
   */
  public temGrandeVariedade(): boolean {
    return this._totalProdutos > 300;
  }

  /**
   * Verifica se tem muitas vendas (> 2000)
   */
  public temMuitasVendas(): boolean {
    return this._totalVendas > 2000;
  }

  /**
   * Incrementa seguidores
   */
  public incrementarSeguidores(): void {
    this._seguidores++;
  }

  /**
   * Decrementa seguidores
   */
  public decrementarSeguidores(): void {
    if (this._seguidores > 0) {
      this._seguidores--;
    }
  }

  /**
   * Formata nota com estrelas
   */
  public formatarNota(): string {
    return `${this._nota.toFixed(1)} ⭐`;
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
   * Formata total de seguidores
   */
  public formatarSeguidores(): string {
    if (this._seguidores >= 1000) {
      return `${(this._seguidores / 1000).toFixed(1)}k`;
    }
    return this._seguidores.toString();
  }

  /**
   * Formata localização
   */
  public formatarLocalizacao(): string {
    return `${this._distancia} • ${this._tempoEntrega}`;
  }

  /**
   * Obtém texto de informação rápida
   */
  public obterInfoRapida(): string {
    const partes: string[] = [];

    if (this.eVerificada()) partes.push('Verificada');
    if (this.temBoaAvaliacao()) partes.push(`${this._nota.toFixed(1)}★`);
    if (this.temGrandeVariedade()) partes.push(`${this._totalProdutos}+ produtos`);

    return partes.join(' • ');
  }

  /**
   * Obtém badges da farmácia
   */
  public obterBadges(): string[] {
    const badges: string[] = [];

    if (this.eVerificada()) badges.push('Verificada');
    if (this.temBoaAvaliacao()) badges.push('Bem Avaliada');
    if (this.ePopular()) badges.push('Popular');
    if (this.temGrandeVariedade()) badges.push('Grande Variedade');

    return badges;
  }

  /**
   * Converte para JSON
   */
  public paraJSON() {
    return {
      id: this._id,
      nome: this._nome,
      descricao: this._descricao,
      nota: this._nota,
      totalAvaliacoes: this._totalAvaliacoes,
      distancia: this._distancia,
      tempoEntrega: this._tempoEntrega,
      verificada: this._verificada,
      seguidores: this._seguidores,
      totalProdutos: this._totalProdutos,
      totalVendas: this._totalVendas,
      telefone: this._telefone,
      endereco: this._endereco,
      horarios: this._horarios,
    };
  }

  /**
   * Cria instância a partir de dados
   */
  public static criar(dados: any): Farmacia {
    console.log('[Farmacia.criar] 📦 Método estático criar chamado:', {
      'dados': dados,
      'dados.nome': dados.nome,
      'dados.name': dados.name,
      'resultado nome': dados.nome || dados.name,
    });

    return new Farmacia({
      id: dados.id,
      nome: dados.nome || dados.name,
      descricao: dados.descricao || dados.description || '',
      nota: dados.nota || dados.rating || 0,
      totalAvaliacoes: dados.avaliacoes || dados.totalAvaliacoes || dados.reviews || 0,
      distancia: dados.distancia || dados.distance || '',
      tempoEntrega: dados.tempoEntrega || dados.deliveryTime || '',
      verificada: dados.verificada ?? dados.verified ?? false,
      seguidores: dados.seguidores || dados.followers || 0,
      totalProdutos: dados.produtos || dados.totalProdutos || dados.products || 0,
      totalVendas: dados.vendas || dados.totalVendas || dados.sales || 0,
      telefone: dados.telefone || dados.phone || '',
      endereco: dados.endereco || dados.address || '',
      horarios: dados.horarios || [],
    });
  }

  /**
   * Cria instância a partir de dados da API
   */
  public static deAPI(dados: any): Farmacia {
    return new Farmacia({
      id: dados.id,
      nome: dados.nome || dados.name,
      descricao: dados.descricao || dados.description,
      nota: dados.nota || dados.rating,
      totalAvaliacoes: dados.totalAvaliacoes || dados.total_reviews,
      distancia: dados.distancia || dados.distance,
      tempoEntrega: dados.tempoEntrega || dados.delivery_time,
      verificada: dados.verificada ?? dados.verified,
      seguidores: dados.seguidores || dados.followers,
      totalProdutos: dados.totalProdutos || dados.total_products,
      totalVendas: dados.totalVendas || dados.total_sales,
      telefone: dados.telefone || dados.phone,
      endereco: dados.endereco || dados.address,
      horarios: dados.horarios || dados.business_hours || [],
    });
  }
}

/**
 * Interface para horário de funcionamento
 */
export interface HorarioFuncionamento {
  dia: string;
  horario: string;
}
