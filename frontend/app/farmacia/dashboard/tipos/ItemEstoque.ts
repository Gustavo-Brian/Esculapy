/**
 * Classe ItemEstoque
 * Representa um item do estoque da farmácia
 */

export class ItemEstoque {
  private _estoqueId: number;
  private _produtoId: number;
  private _produtoNome: string;
  private _produtoDescricao?: string;
  private _quantidade: number;
  private _preco: number;
  private _farmaciaId: number;
  private _tarja?: 'BRANCA' | 'VERMELHA' | 'AMARELA' | 'PRETA';
  private _categoria?: string;

  constructor(dados: {
    estoqueId: number;
    produtoId: number;
    produtoNome: string;
    produtoDescricao?: string;
    quantidade: number;
    preco: number;
    farmaciaId: number;
    tarja?: 'BRANCA' | 'VERMELHA' | 'AMARELA' | 'PRETA';
    categoria?: string;
  }) {
    this._estoqueId = dados.estoqueId;
    this._produtoId = dados.produtoId;
    this._produtoNome = dados.produtoNome;
    this._produtoDescricao = dados.produtoDescricao;
    this._quantidade = dados.quantidade;
    this._preco = dados.preco;
    this._farmaciaId = dados.farmaciaId;
    this._tarja = dados.tarja;
    this._categoria = dados.categoria;
  }

  // Getters
  get estoqueId(): number { return this._estoqueId; }
  get produtoId(): number { return this._produtoId; }
  get produtoNome(): string { return this._produtoNome; }
  get produtoDescricao(): string | undefined { return this._produtoDescricao; }
  get quantidade(): number { return this._quantidade; }
  get preco(): number { return this._preco; }
  get farmaciaId(): number { return this._farmaciaId; }
  get tarja(): string | undefined { return this._tarja; }
  get categoria(): string | undefined { return this._categoria; }

  /**
   * Verifica se o produto está esgotado
   */
  public estaEsgotado(): boolean {
    return this._quantidade === 0;
  }

  /**
   * Verifica se o produto está com estoque baixo
   */
  public estaComEstoqueBaixo(): boolean {
    return this._quantidade > 0 && this._quantidade < 10;
  }

  /**
   * Obtém o status do estoque (NORMAL, BAIXO, ESGOTADO)
   */
  public obterStatusEstoque(): 'NORMAL' | 'BAIXO' | 'ESGOTADO' {
    if (this._quantidade === 0) return 'ESGOTADO';
    if (this._quantidade < 10) return 'BAIXO';
    return 'NORMAL';
  }

  /**
   * Calcula o valor total em estoque (preço * quantidade)
   */
  public calcularValorTotal(): number {
    return this._preco * this._quantidade;
  }

  /**
   * Formata o preço em Real
   */
  public formatarPreco(): string {
    return `R$ ${this._preco.toFixed(2).replace('.', ',')}`;
  }

  /**
   * Formata o valor total em Real
   */
  public formatarValorTotal(): string {
    return `R$ ${this.calcularValorTotal().toFixed(2).replace('.', ',')}`;
  }

  /**
   * Atualiza quantidade do item
   */
  public atualizarQuantidade(novaQuantidade: number): void {
    if (novaQuantidade < 0) {
      throw new Error('Quantidade não pode ser negativa');
    }
    this._quantidade = novaQuantidade;
  }

  /**
   * Atualiza preço do item
   */
  public atualizarPreco(novoPreco: number): void {
    if (novoPreco <= 0) {
      throw new Error('Preço deve ser maior que zero');
    }
    this._preco = novoPreco;
  }

  /**
   * Converte para JSON
   */
  public paraJSON() {
    return {
      estoqueId: this._estoqueId,
      produtoId: this._produtoId,
      produtoNome: this._produtoNome,
      produtoDescricao: this._produtoDescricao,
      quantidade: this._quantidade,
      preco: this._preco,
      farmaciaId: this._farmaciaId,
      tarja: this._tarja,
      categoria: this._categoria,
    };
  }

  /**
   * Cria instância a partir de dados da API
   */
  public static deAPI(dados: any): ItemEstoque {
    return new ItemEstoque({
      estoqueId: dados.estoqueId,
      produtoId: dados.produtoId,
      produtoNome: dados.produtoNome,
      produtoDescricao: dados.produtoDescricao,
      quantidade: dados.quantidade,
      preco: dados.preco,
      farmaciaId: dados.farmaciaId,
      tarja: dados.tarja,
      categoria: dados.categoria,
    });
  }
}
