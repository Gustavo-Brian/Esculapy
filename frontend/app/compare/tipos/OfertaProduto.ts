/**
 * Classe OfertaProduto
 * Representa uma oferta de produto em uma farmácia
 */

export class OfertaProduto {
  private _id: number;
  private _farmaciaId: number;
  private _farmaciaNome: string;
  private _nota: number;
  private _distancia: string;
  private _preco: number;
  private _precoAntigo?: number;
  private _economia: number;
  private _entrega: string;
  private _tempoEntrega: string;
  private _estoque: number;
  private _verificada: boolean;
  private _melhorPreco: boolean;

  constructor(dados: {
    id: number;
    farmaciaId: number;
    farmaciaNome: string;
    nota: number;
    distancia: string;
    preco: number;
    precoAntigo?: number;
    economia: number;
    entrega: string;
    tempoEntrega: string;
    estoque: number;
    verificada: boolean;
    melhorPreco: boolean;
  }) {
    this._id = dados.id;
    this._farmaciaId = dados.farmaciaId;
    this._farmaciaNome = dados.farmaciaNome;
    this._nota = dados.nota;
    this._distancia = dados.distancia;
    this._preco = dados.preco;
    this._precoAntigo = dados.precoAntigo;
    this._economia = dados.economia;
    this._entrega = dados.entrega;
    this._tempoEntrega = dados.tempoEntrega;
    this._estoque = dados.estoque;
    this._verificada = dados.verificada;
    this._melhorPreco = dados.melhorPreco;
  }

  // Getters
  get id(): number { return this._id; }
  get farmaciaId(): number { return this._farmaciaId; }
  get farmaciaNome(): string { return this._farmaciaNome; }
  get nota(): number { return this._nota; }
  get distancia(): string { return this._distancia; }
  get preco(): number { return this._preco; }
  get precoAntigo(): number | undefined { return this._precoAntigo; }
  get economia(): number { return this._economia; }
  get entrega(): string { return this._entrega; }
  get tempoEntrega(): string { return this._tempoEntrega; }
  get estoque(): number { return this._estoque; }
  get verificada(): boolean { return this._verificada; }
  get melhorPreco(): boolean { return this._melhorPreco; }

  /**
   * Verifica se é o melhor preço
   */
  public eMelhorPreco(): boolean {
    return this._melhorPreco;
  }

  /**
   * Verifica se farmácia é verificada
   */
  public eVerificada(): boolean {
    return this._verificada;
  }

  /**
   * Verifica se tem economia
   */
  public temEconomia(): boolean {
    return this._economia > 0;
  }

  /**
   * Verifica se entrega é grátis
   */
  public entregaGratis(): boolean {
    return this._entrega.toLowerCase().includes('grátis') ||
           this._entrega.toLowerCase().includes('gratis');
  }

  /**
   * Verifica se tem estoque baixo (< 10)
   */
  public temEstoqueBaixo(): boolean {
    return this._estoque < 10;
  }

  /**
   * Verifica se está em estoque
   */
  public temEstoque(): boolean {
    return this._estoque > 0;
  }

  /**
   * Verifica se tem avaliação alta (>= 4.5)
   */
  public temAvaliacaoAlta(): boolean {
    return this._nota >= 4.5;
  }

  /**
   * Formata preço em Real
   */
  public formatarPreco(): string {
    return `R$ ${this._preco.toFixed(2).replace('.', ',')}`;
  }

  /**
   * Formata preço antigo
   */
  public formatarPrecoAntigo(): string | null {
    if (!this._precoAntigo) return null;
    return `R$ ${this._precoAntigo.toFixed(2).replace('.', ',')}`;
  }

  /**
   * Formata economia
   */
  public formatarEconomia(): string {
    if (this._economia === 0) return '';
    return `Economize R$ ${this._economia.toFixed(2).replace('.', ',')}`;
  }

  /**
   * Calcula percentual de economia
   */
  public calcularPercentualEconomia(): number {
    if (!this._precoAntigo || this._precoAntigo === 0) return 0;
    return ((this._economia / this._precoAntigo) * 100);
  }

  /**
   * Formata percentual de economia
   */
  public formatarPercentualEconomia(): string {
    const percentual = this.calcularPercentualEconomia();
    if (percentual === 0) return '';
    return `-${percentual.toFixed(0)}%`;
  }

  /**
   * Formata avaliação
   */
  public formatarAvaliacao(): string {
    return `${this._nota.toFixed(1)} ⭐`;
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
   * Obtém badge de destaque
   */
  public obterBadge(): string | null {
    if (this._melhorPreco) return 'Melhor Preço';
    if (this.entregaGratis()) return 'Entrega Grátis';
    if (this.temAvaliacaoAlta()) return 'Bem Avaliada';
    return null;
  }

  /**
   * Obtém cor do badge
   */
  public obterCorBadge(): string {
    if (this._melhorPreco) return '#10B981'; // Verde
    if (this.entregaGratis()) return '#3B82F6'; // Azul
    if (this.temAvaliacaoAlta()) return '#F59E0B'; // Laranja
    return '#6B7280'; // Cinza
  }

  /**
   * Calcula pontuação da oferta (para ordenação)
   */
  public calcularPontuacao(): number {
    let pontos = 0;

    // Melhor preço tem maior peso
    if (this._melhorPreco) pontos += 100;

    // Entrega grátis
    if (this.entregaGratis()) pontos += 50;

    // Avaliação alta
    if (this.temAvaliacaoAlta()) pontos += 30;

    // Proximidade
    const distanciaKm = this.obterDistanciaKm();
    if (distanciaKm < 2) pontos += 20;
    else if (distanciaKm < 3) pontos += 10;

    // Economia
    if (this.temEconomia()) pontos += Math.min(this._economia * 2, 30);

    return pontos;
  }

  /**
   * Converte para JSON
   */
  public paraJSON() {
    return {
      id: this._id,
      farmaciaId: this._farmaciaId,
      farmaciaNome: this._farmaciaNome,
      nota: this._nota,
      distancia: this._distancia,
      preco: this._preco,
      precoAntigo: this._precoAntigo,
      economia: this._economia,
      entrega: this._entrega,
      tempoEntrega: this._tempoEntrega,
      estoque: this._estoque,
      verificada: this._verificada,
      melhorPreco: this._melhorPreco,
    };
  }

  /**
   * Cria instância a partir de dados mockados
   */
  public static criar(dados: any): OfertaProduto {
    return new OfertaProduto({
      id: dados.id,
      farmaciaId: dados.farmaciaId || dados.id,
      farmaciaNome: dados.farmacia || dados.farmaciaNome,
      nota: dados.nota || 0,
      distancia: dados.distancia || '0 km',
      preco: dados.preco,
      precoAntigo: dados.precoAntigo,
      economia: dados.economia || 0,
      entrega: dados.entrega || 'A calcular',
      tempoEntrega: dados.tempoEntrega || 'A calcular',
      estoque: dados.estoque || 0,
      verificada: dados.verificada !== undefined ? dados.verificada : false,
      melhorPreco: dados.melhorPreco !== undefined ? dados.melhorPreco : false,
    });
  }

  /**
   * Cria instância a partir de dados da API
   */
  public static deAPI(dados: any): OfertaProduto {
    return new OfertaProduto({
      id: dados.id,
      farmaciaId: dados.farmaciaId || dados.farmacia_id,
      farmaciaNome: dados.farmaciaNome || dados.farmacia_nome || dados.farmacia,
      nota: dados.nota || dados.rating || 0,
      distancia: dados.distancia || dados.distance || '0 km',
      preco: dados.preco || dados.price,
      precoAntigo: dados.precoAntigo || dados.old_price,
      economia: dados.economia || dados.savings || 0,
      entrega: dados.entrega || dados.delivery_fee || 'A calcular',
      tempoEntrega: dados.tempoEntrega || dados.delivery_time || 'A calcular',
      estoque: dados.estoque || dados.stock || 0,
      verificada: dados.verificada !== undefined ? dados.verificada : dados.verified !== undefined ? dados.verified : false,
      melhorPreco: dados.melhorPreco !== undefined ? dados.melhorPreco : dados.best_price !== undefined ? dados.best_price : false,
    });
  }
}
