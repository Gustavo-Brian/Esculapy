/**
 * Classe DetalheProduto
 * Representa os detalhes completos de um produto
 */

export class DetalheProduto {
  private _id: number;
  private _nome: string;
  private _preco: number;
  private _precoPromocional: number | null;
  private _descricao: string;
  private _categoria: string;
  private _estoque: number;
  private _farmaciaId: number;
  private _farmaciaNome: string;
  private _imagem: string | null;
  private _icone: string;

  constructor(dados: {
    id: number;
    nome: string;
    preco: number;
    precoPromocional?: number | null;
    descricao: string;
    categoria: string;
    estoque: number;
    farmaciaId: number;
    farmaciaNome: string;
    imagem?: string | null;
    icone: string;
  }) {
    this._id = dados.id;
    this._nome = dados.nome;
    this._preco = dados.preco;
    this._precoPromocional = dados.precoPromocional || null;
    this._descricao = dados.descricao;
    this._categoria = dados.categoria;
    this._estoque = dados.estoque;
    this._farmaciaId = dados.farmaciaId;
    this._farmaciaNome = dados.farmaciaNome;
    this._imagem = dados.imagem || null;
    this._icone = dados.icone;
  }

  // Getters
  get id(): number { return this._id; }
  get nome(): string { return this._nome; }
  get preco(): number { return this._preco; }
  get precoPromocional(): number | null { return this._precoPromocional; }
  get descricao(): string { return this._descricao; }
  get categoria(): string { return this._categoria; }
  get estoque(): number { return this._estoque; }
  get farmaciaId(): number { return this._farmaciaId; }
  get farmaciaNome(): string { return this._farmaciaNome; }
  get imagem(): string | null { return this._imagem; }
  get icone(): string { return this._icone; }

  /**
   * Verifica se o produto está em promoção
   */
  public estaEmPromocao(): boolean {
    return this._precoPromocional !== null && this._precoPromocional < this._preco;
  }

  /**
   * Calcula o percentual de desconto
   */
  public calcularDesconto(): number {
    if (!this.estaEmPromocao()) return 0;
    return Math.round(((this._preco - this._precoPromocional!) / this._preco) * 100);
  }

  /**
   * Obtém o preço final (promocional ou normal)
   */
  public obterPrecoFinal(): number {
    return this.estaEmPromocao() ? this._precoPromocional! : this._preco;
  }

  /**
   * Formata o preço para exibição
   */
  public formatarPreco(): string {
    return this.obterPrecoFinal().toFixed(2).replace('.', ',');
  }

  /**
   * Formata o preço normal (riscado)
   */
  public formatarPrecoNormal(): string {
    return this._preco.toFixed(2).replace('.', ',');
  }

  /**
   * Verifica se o produto está disponível
   */
  public estaDisponivel(): boolean {
    return this._estoque > 0;
  }

  /**
   * Verifica se pode adicionar determinada quantidade
   */
  public podeAdicionarQuantidade(quantidade: number): boolean {
    return quantidade <= this._estoque;
  }

  /**
   * Calcula o preço total para uma quantidade
   */
  public calcularPrecoTotal(quantidade: number): number {
    return this.obterPrecoFinal() * quantidade;
  }

  /**
   * Formata o preço total
   */
  public formatarPrecoTotal(quantidade: number): string {
    return this.calcularPrecoTotal(quantidade).toFixed(2).replace('.', ',');
  }

  /**
   * Cria instância a partir de dados da API
   */
  public static deAPI(dados: any): DetalheProduto {
    return new DetalheProduto({
      id: dados.id,
      nome: dados.nome,
      preco: dados.preco,
      precoPromocional: dados.precoPromocional || null,
      descricao: dados.descricao || 'Sem descrição disponível',
      categoria: dados.categoria || 'Geral',
      estoque: dados.estoque || 0,
      farmaciaId: dados.farmaciaId || dados.farmacia_id,
      farmaciaNome: dados.farmaciaNome || dados.farmacia_nome || 'Farmácia',
      imagem: dados.imagem || null,
      icone: dados.icone || 'medical',
    });
  }
}
