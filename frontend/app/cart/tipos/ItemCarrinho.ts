/**
 * Classe ItemCarrinho
 * Representa um item no carrinho de compras
 */

export class ItemCarrinho {
  private _id: number;
  private _estoqueId: number; // ID do estoque na farmácia (necessário para criar pedido)
  private _produtoId: number;
  private _nome: string;
  private _preco: number;
  private _quantidade: number;
  private _farmacia: string;
  private _farmaciaId: number; // ID da farmácia (necessário para criar pedido)
  private _imagem: string | null;

  constructor(dados: {
    id: number;
    estoqueId: number;
    produtoId: number;
    nome: string;
    preco: number;
    quantidade: number;
    farmacia: string;
    farmaciaId: number;
    imagem?: string | null;
  }) {
    this._id = dados.id;
    this._estoqueId = dados.estoqueId;
    this._produtoId = dados.produtoId;
    this._nome = dados.nome;
    this._preco = dados.preco;
    this._quantidade = dados.quantidade;
    this._farmacia = dados.farmacia;
    this._farmaciaId = dados.farmaciaId;
    this._imagem = dados.imagem || null;
  }

  // Getters
  get id(): number { return this._id; }
  get estoqueId(): number { return this._estoqueId; }
  get produtoId(): number { return this._produtoId; }
  get nome(): string { return this._nome; }
  get preco(): number { return this._preco; }
  get quantidade(): number { return this._quantidade; }
  get farmacia(): string { return this._farmacia; }
  get farmaciaId(): number { return this._farmaciaId; }
  get imagem(): string | null { return this._imagem; }

  /**
   * Calcula o subtotal do item
   */
  public calcularSubtotal(): number {
    return this._preco * this._quantidade;
  }

  /**
   * Formata o preço unitário
   */
  public formatarPreco(): string {
    return this._preco.toFixed(2).replace('.', ',');
  }

  /**
   * Formata o subtotal
   */
  public formatarSubtotal(): string {
    return this.calcularSubtotal().toFixed(2).replace('.', ',');
  }

  /**
   * Incrementa a quantidade
   */
  public incrementar(): void {
    this._quantidade++;
  }

  /**
   * Decrementa a quantidade
   */
  public decrementar(): void {
    if (this._quantidade > 1) {
      this._quantidade--;
    }
  }

  /**
   * Define a quantidade
   */
  public definirQuantidade(quantidade: number): void {
    if (quantidade >= 1) {
      this._quantidade = quantidade;
    }
  }

  /**
   * Serializa para JSON (para salvar no AsyncStorage)
   */
  public toJSON(): any {
    return {
      id: this._id,
      estoqueId: this._estoqueId,
      produtoId: this._produtoId,
      nome: this._nome,
      preco: this._preco,
      quantidade: this._quantidade,
      farmacia: this._farmacia,
      farmaciaId: this._farmaciaId,
      imagem: this._imagem,
    };
  }

  /**
   * Cria instância a partir de dados
   */
  public static criar(dados: any): ItemCarrinho {
    console.log('[ItemCarrinho.criar] Criando item:', {
      nome: dados.nome,
      farmacia: dados.farmacia,
      farmaciaId: dados.farmaciaId,
    });

    return new ItemCarrinho({
      id: dados.id,
      estoqueId: dados.estoqueId || dados.estoque_id,
      produtoId: dados.produtoId || dados.produto_id,
      nome: dados.nome,
      preco: dados.preco,
      quantidade: dados.quantidade || 1,
      farmacia: dados.farmacia || 'Farmácia não especificada',
      farmaciaId: dados.farmaciaId || dados.farmacia_id,
      imagem: dados.imagem || null,
    });
  }

  /**
   * Cria instância a partir de EstoqueResponse da API
   */
  public static criarDeEstoque(estoque: {
    estoqueId: number;
    produtoId: number;
    produtoNome: string;
    preco: number;
    farmaciaId: number;
    farmaciaRazaoSocial: string;
  }): ItemCarrinho {
    console.log('[ItemCarrinho.criarDeEstoque] Criando de estoque:', {
      produtoNome: estoque.produtoNome,
      farmaciaRazaoSocial: estoque.farmaciaRazaoSocial,
      farmaciaId: estoque.farmaciaId,
      estoqueId: estoque.estoqueId,
    });

    return new ItemCarrinho({
      id: estoque.estoqueId, // Usa estoqueId como ID do item
      estoqueId: estoque.estoqueId,
      produtoId: estoque.produtoId,
      nome: estoque.produtoNome,
      preco: estoque.preco,
      quantidade: 1,
      farmacia: estoque.farmaciaRazaoSocial,
      farmaciaId: estoque.farmaciaId,
      imagem: null,
    });
  }
}
