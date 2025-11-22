/**
 * Classe EstatisticasEstoque
 * Representa as estatísticas do estoque da farmácia
 */

export class EstatisticasEstoque {
  private _totalProdutos: number;
  private _totalItens: number;
  private _valorTotal: number;
  private _produtosBaixoEstoque: number;
  private _produtosEsgotados: number;

  constructor(dados: {
    totalProdutos: number;
    totalItens: number;
    valorTotal: number;
    produtosBaixoEstoque: number;
    produtosEsgotados: number;
  }) {
    this._totalProdutos = dados.totalProdutos;
    this._totalItens = dados.totalItens;
    this._valorTotal = dados.valorTotal;
    this._produtosBaixoEstoque = dados.produtosBaixoEstoque;
    this._produtosEsgotados = dados.produtosEsgotados;
  }

  // Getters
  get totalProdutos(): number { return this._totalProdutos; }
  get totalItens(): number { return this._totalItens; }
  get valorTotal(): number { return this._valorTotal; }
  get produtosBaixoEstoque(): number { return this._produtosBaixoEstoque; }
  get produtosEsgotados(): number { return this._produtosEsgotados; }

  /**
   * Formata o valor total em Real
   */
  public formatarValorTotal(): string {
    return `R$ ${this._valorTotal.toFixed(2).replace('.', ',')}`;
  }

  /**
   * Calcula percentual de produtos esgotados
   */
  public percentualEsgotados(): number {
    if (this._totalProdutos === 0) return 0;
    return (this._produtosEsgotados / this._totalProdutos) * 100;
  }

  /**
   * Calcula percentual de produtos com estoque baixo
   */
  public percentualBaixoEstoque(): number {
    if (this._totalProdutos === 0) return 0;
    return (this._produtosBaixoEstoque / this._totalProdutos) * 100;
  }

  /**
   * Verifica se há produtos críticos (esgotados + baixo estoque)
   */
  public temProdutosCriticos(): boolean {
    return this._produtosEsgotados > 0 || this._produtosBaixoEstoque > 0;
  }

  /**
   * Obtém total de produtos críticos
   */
  public obterTotalCriticos(): number {
    return this._produtosEsgotados + this._produtosBaixoEstoque;
  }

  /**
   * Calcula valor médio por produto
   */
  public obterValorMedioPorProduto(): number {
    if (this._totalProdutos === 0) return 0;
    return this._valorTotal / this._totalProdutos;
  }

  /**
   * Converte para JSON
   */
  public paraJSON() {
    return {
      totalProdutos: this._totalProdutos,
      totalItens: this._totalItens,
      valorTotal: this._valorTotal,
      produtosBaixoEstoque: this._produtosBaixoEstoque,
      produtosEsgotados: this._produtosEsgotados,
    };
  }

  /**
   * Cria instância a partir de dados da API
   */
  public static deAPI(dados: any): EstatisticasEstoque {
    return new EstatisticasEstoque({
      totalProdutos: dados.totalProdutos || 0,
      totalItens: dados.totalItens || 0,
      valorTotal: dados.valorTotal || 0,
      produtosBaixoEstoque: dados.produtosBaixoEstoque || 0,
      produtosEsgotados: dados.produtosEsgotados || 0,
    });
  }
}
