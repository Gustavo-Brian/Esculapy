/**
 * Modelo de Produto
 *
 * Classe de domínio que encapsula dados e comportamentos de um produto farmacêutico.
 * Segue o padrão Domain Model com lógica de negócio integrada.
 *
 * @example
 * ```typescript
 * const produto = new Produto({
 *   id: 1,
 *   nome: 'Dipirona 500mg',
 *   descricao: 'Analgésico e antitérmico',
 *   preco: 15.90,
 *   precoPromocional: 12.90,
 *   categoria: 'Analgésicos',
 *   emEstoque: true,
 *   farmaciaId: 1,
 *   farmaciaNome: 'Farmácia Central'
 * });
 *
 * if (produto.estaEmPromocao()) {
 *   console.log(`Desconto de ${produto.calcularDesconto()}%`);
 * }
 * ```
 */
export class Produto {
  private _id: number;
  private _nome: string;
  private _descricao: string;
  private _preco: number;
  private _precoPromocional: number | null;
  private _categoria: string;
  private _imagem: string | null;
  private _emEstoque: boolean;
  private _farmaciaId: number;
  private _farmaciaNome: string;

  constructor(dados: {
    id: number;
    nome: string;
    descricao: string;
    preco: number;
    precoPromocional?: number | null;
    categoria: string;
    imagem?: string | null;
    emEstoque: boolean;
    farmaciaId: number;
    farmaciaNome: string;
  }) {
    this._id = dados.id;
    this._nome = dados.nome;
    this._descricao = dados.descricao;
    this._preco = dados.preco;
    this._precoPromocional = dados.precoPromocional || null;
    this._categoria = dados.categoria;
    this._imagem = dados.imagem || null;
    this._emEstoque = dados.emEstoque;
    this._farmaciaId = dados.farmaciaId;
    this._farmaciaNome = dados.farmaciaNome;
  }

  // Getters
  get id(): number { return this._id; }
  get nome(): string { return this._nome; }
  get descricao(): string { return this._descricao; }
  get preco(): number { return this._preco; }
  get precoPromocional(): number | null { return this._precoPromocional; }
  get categoria(): string { return this._categoria; }
  get imagem(): string | null { return this._imagem; }
  get emEstoque(): boolean { return this._emEstoque; }
  get farmaciaId(): number { return this._farmaciaId; }
  get farmaciaNome(): string { return this._farmaciaNome; }

  /**
   * Verifica se o produto está em promoção
   *
   * Um produto está em promoção quando:
   * - Possui preço promocional definido (não null)
   * - O preço promocional é menor que o preço normal
   *
   * @returns `true` se está em promoção, `false` caso contrário
   *
   * @example
   * ```typescript
   * if (produto.estaEmPromocao()) {
   *   console.log('Produto em oferta!');
   * }
   * ```
   */
  public estaEmPromocao(): boolean {
    return this._precoPromocional !== null && this._precoPromocional < this._preco;
  }

  /**
   * Obtém o preço final do produto
   *
   * Retorna o preço promocional se estiver em promoção,
   * caso contrário retorna o preço normal.
   *
   * @returns Preço final a ser cobrado
   *
   * @example
   * ```typescript
   * const precoFinal = produto.obterPrecoFinal();
   * console.log(`R$ ${precoFinal.toFixed(2)}`);
   * ```
   */
  public obterPrecoFinal(): number {
    return this.estaEmPromocao() ? this._precoPromocional! : this._preco;
  }

  /**
   * Calcula o percentual de desconto
   *
   * Retorna 0 se o produto não estiver em promoção.
   * O valor é arredondado para o inteiro mais próximo.
   *
   * @returns Percentual de desconto (0-100)
   *
   * @example
   * ```typescript
   * const desconto = produto.calcularDesconto();
   * if (desconto > 0) {
   *   console.log(`Economize ${desconto}%`);
   * }
   * ```
   */
  public calcularDesconto(): number {
    if (!this.estaEmPromocao()) return 0;
    return Math.round(((this._preco - this._precoPromocional!) / this._preco) * 100);
  }

  /**
   * Formata o preço final para exibição no padrão brasileiro
   *
   * Retorna o preço com 2 casas decimais e vírgula como separador.
   * Não inclui o símbolo R$.
   *
   * @returns Preço formatado (ex: "12,90")
   *
   * @example
   * ```typescript
   * const preco = produto.formatarPreco();
   * console.log(`R$ ${preco}`); // "R$ 12,90"
   * ```
   */
  public formatarPreco(): string {
    return this.obterPrecoFinal().toFixed(2).replace('.', ',');
  }

  /**
   * Serializa o produto para objeto JSON
   *
   * Útil para enviar dados para a API ou armazenar em cache.
   *
   * @returns Objeto plain com todos os campos do produto
   *
   * @example
   * ```typescript
   * const json = produto.paraJSON();
   * await api.post('/produtos', json);
   * ```
   */
  public paraJSON() {
    return {
      id: this._id,
      nome: this._nome,
      descricao: this._descricao,
      preco: this._preco,
      precoPromocional: this._precoPromocional,
      categoria: this._categoria,
      imagem: this._imagem,
      emEstoque: this._emEstoque,
      farmaciaId: this._farmaciaId,
      farmaciaNome: this._farmaciaNome,
    };
  }

  /**
   * Factory Method: Cria instância de Produto a partir de dados da API
   *
   * Converte um objeto plain JavaScript (vindo da API) em uma
   * instância da classe Produto com todos os métodos de negócio.
   *
   * @param dados - Objeto com dados do produto vindos da API
   * @returns Nova instância de Produto
   *
   * @example
   * ```typescript
   * const dadosAPI = await api.get('/produtos/1');
   * const produto = Produto.deAPI(dadosAPI);
   *
   * // Agora pode usar métodos da classe
   * if (produto.estaEmPromocao()) {
   *   console.log('Em promoção!');
   * }
   * ```
   */
  public static deAPI(dados: any): Produto {
    return new Produto({
      id: dados.id,
      nome: dados.nome,
      descricao: dados.descricao,
      preco: dados.preco,
      precoPromocional: dados.precoPromocional,
      categoria: dados.categoria,
      imagem: dados.imagem,
      emEstoque: dados.emEstoque,
      farmaciaId: dados.farmaciaId,
      farmaciaNome: dados.farmaciaNome,
    });
  }
}
