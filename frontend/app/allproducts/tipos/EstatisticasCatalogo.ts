/**
 * Classe EstatisticasCatalogo
 * Representa estatísticas do catálogo de produtos
 */

export class EstatisticasCatalogo {
  private _totalProdutos: number;
  private _totalLojas: number;

  constructor(dados: {
    totalProdutos: number;
    totalLojas: number;
  }) {
    this._totalProdutos = dados.totalProdutos;
    this._totalLojas = dados.totalLojas;
  }

  // Getters
  get totalProdutos(): number { return this._totalProdutos; }
  get totalLojas(): number { return this._totalLojas; }

  /**
   * Verifica se tem produtos
   */
  public temProdutos(): boolean {
    return this._totalProdutos > 0;
  }

  /**
   * Verifica se tem muitos produtos (> 10)
   */
  public temMuitosProdutos(): boolean {
    return this._totalProdutos > 10;
  }

  /**
   * Verifica se tem várias lojas (> 3)
   */
  public temVariasLojas(): boolean {
    return this._totalLojas > 3;
  }

  /**
   * Calcula média de produtos por loja
   */
  public calcularMediaProdutosPorLoja(): number {
    if (this._totalLojas === 0) return 0;
    return this._totalProdutos / this._totalLojas;
  }

  /**
   * Formata total de produtos
   */
  public formatarTotalProdutos(): string {
    if (this._totalProdutos === 0) return 'Nenhum produto';
    if (this._totalProdutos === 1) return '1 produto';
    return `${this._totalProdutos} produtos`;
  }

  /**
   * Formata total de lojas
   */
  public formatarTotalLojas(): string {
    if (this._totalLojas === 0) return 'Nenhuma loja';
    if (this._totalLojas === 1) return '1 loja';
    return `${this._totalLojas} lojas`;
  }

  /**
   * Formata média de produtos por loja
   */
  public formatarMediaProdutosPorLoja(): string {
    const media = this.calcularMediaProdutosPorLoja();
    return `${media.toFixed(1)} produtos/loja`;
  }

  /**
   * Obtém resumo das estatísticas
   */
  public obterResumo(): string {
    return `${this.formatarTotalProdutos()} em ${this.formatarTotalLojas()}`;
  }

  /**
   * Converte para JSON
   */
  public paraJSON() {
    return {
      totalProdutos: this._totalProdutos,
      totalLojas: this._totalLojas,
    };
  }

  /**
   * Cria instância a partir de dados
   */
  public static criar(dados: any): EstatisticasCatalogo {
    return new EstatisticasCatalogo({
      totalProdutos: dados.totalProdutos || dados.total_products || 0,
      totalLojas: dados.totalLojas || dados.total_stores || 0,
    });
  }

  /**
   * Cria instância vazia
   */
  public static vazio(): EstatisticasCatalogo {
    return new EstatisticasCatalogo({
      totalProdutos: 0,
      totalLojas: 0,
    });
  }
}
