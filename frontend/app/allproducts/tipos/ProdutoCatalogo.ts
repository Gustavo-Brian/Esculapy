/**
 * Classe ProdutoCatalogo
 * Representa um produto no catálogo geral (todos os produtos)
 */

export class ProdutoCatalogo {
  private _id: number;
  private _nome: string;
  private _vendedor: string;
  private _avaliacao: number;
  private _preco: number;
  private _icone: string;
  private _cor: string;

  constructor(dados: {
    id: number;
    nome: string;
    vendedor: string;
    avaliacao: number;
    preco: number;
    icone: string;
    cor: string;
  }) {
    this._id = dados.id;
    this._nome = dados.nome;
    this._vendedor = dados.vendedor;
    this._avaliacao = dados.avaliacao;
    this._preco = dados.preco;
    this._icone = dados.icone;
    this._cor = dados.cor;
  }

  // Getters
  get id(): number { return this._id; }
  get nome(): string { return this._nome; }
  get vendedor(): string { return this._vendedor; }
  get avaliacao(): number { return this._avaliacao; }
  get preco(): number { return this._preco; }
  get icone(): string { return this._icone; }
  get cor(): string { return this._cor; }

  /**
   * Verifica se tem boa avaliação (>= 4.5)
   */
  public temBoaAvaliacao(): boolean {
    return this._avaliacao >= 4.5;
  }

  /**
   * Verifica se tem ótima avaliação (>= 4.8)
   */
  public temOtimaAvaliacao(): boolean {
    return this._avaliacao >= 4.8;
  }

  /**
   * Verifica se é barato (< R$ 20)
   */
  public eBarato(): boolean {
    return this._preco < 20;
  }

  /**
   * Verifica se é caro (> R$ 50)
   */
  public eCaro(): boolean {
    return this._preco > 50;
  }

  /**
   * Verifica se pertence a vendedor
   */
  public pertenceAVendedor(nomeVendedor: string): boolean {
    return this._vendedor.toLowerCase() === nomeVendedor.toLowerCase();
  }

  /**
   * Verifica se nome contém termo de busca
   */
  public correspondeABusca(termo: string): boolean {
    if (!termo || termo.trim() === '') return true;

    const termoLower = termo.toLowerCase();
    const nomeLower = this._nome.toLowerCase();
    const vendedorLower = this._vendedor.toLowerCase();

    return nomeLower.includes(termoLower) || vendedorLower.includes(termoLower);
  }

  /**
   * Formata preço
   */
  public formatarPreco(): string {
    return `R$ ${this._preco.toFixed(2).replace('.', ',')}`;
  }

  /**
   * Formata avaliação
   */
  public formatarAvaliacao(): string {
    return this._avaliacao.toFixed(1);
  }

  /**
   * Formata avaliação com estrela
   */
  public formatarAvaliacaoComEstrela(): string {
    return `${this.formatarAvaliacao()} ⭐`;
  }

  /**
   * Obtém cor baseada na avaliação
   */
  public obterCorAvaliacao(): string {
    if (this._avaliacao >= 4.8) return '#10B981'; // Verde
    if (this._avaliacao >= 4.5) return '#3B82F6'; // Azul
    if (this._avaliacao >= 4.0) return '#F59E0B'; // Laranja
    return '#6B7280'; // Cinza
  }

  /**
   * Obtém badge do produto
   */
  public obterBadge(): string | null {
    if (this.temOtimaAvaliacao()) return 'Destaque';
    if (this.eBarato()) return 'Econômico';
    if (this.temBoaAvaliacao()) return 'Bem Avaliado';
    return null;
  }

  /**
   * Obtém cor do badge
   */
  public obterCorBadge(): string {
    if (this.temOtimaAvaliacao()) return '#10B981';
    if (this.eBarato()) return '#3B82F6';
    if (this.temBoaAvaliacao()) return '#F59E0B';
    return '#6B7280';
  }

  /**
   * Converte para JSON
   */
  public paraJSON() {
    return {
      id: this._id,
      nome: this._nome,
      vendedor: this._vendedor,
      avaliacao: this._avaliacao,
      preco: this._preco,
      icone: this._icone,
      cor: this._cor,
    };
  }

  /**
   * Cria instância a partir de dados
   */
  public static criar(dados: any): ProdutoCatalogo {
    return new ProdutoCatalogo({
      id: dados.id,
      nome: dados.nome || dados.name || '',
      vendedor: dados.vendedor || dados.seller || dados.store || '',
      avaliacao: dados.avaliacao || dados.rating || 0,
      preco: dados.preco || dados.price || 0,
      icone: dados.icone || dados.icon || 'medical',
      cor: dados.cor || dados.color || '#6B7280',
    });
  }

  /**
   * Cria instância a partir de dados da API
   */
  public static deAPI(dados: any): ProdutoCatalogo {
    return new ProdutoCatalogo({
      id: dados.id,
      nome: dados.nome || dados.name,
      vendedor: dados.vendedor || dados.seller_name || dados.store_name,
      avaliacao: dados.avaliacao || dados.rating,
      preco: dados.preco || dados.price,
      icone: dados.icone || dados.icon || 'medical',
      cor: dados.cor || dados.color || '#6B7280',
    });
  }
}
