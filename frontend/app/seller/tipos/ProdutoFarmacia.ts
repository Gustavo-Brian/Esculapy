/**
 * Classe ProdutoFarmacia
 * Representa um produto na listagem da farmácia
 */

export class ProdutoFarmacia {
  private _id: number;
  private _estoqueId?: number; // ID do estoque_lojista (necessário para criar pedido)
  private _nome: string;
  private _preco: number;
  private _precoAntigo?: number;
  private _nota: number;
  private _desconto: number;
  private _farmacia?: string;
  private _descricao?: string;
  private _estoque: number;
  private _laboratorio?: string;
  private _principioAtivo?: string;
  private _tipoReceita?: string;

  constructor(dados: {
    id: number;
    estoqueId?: number;
    nome: string;
    preco: number;
    precoAntigo?: number;
    nota: number;
    desconto: number;
    farmacia?: string;
    descricao?: string;
    estoque?: number;
    laboratorio?: string;
    principioAtivo?: string;
    tipoReceita?: string;
  }) {
    this._id = dados.id;
    this._estoqueId = dados.estoqueId;
    this._nome = dados.nome;
    this._preco = dados.preco;
    this._precoAntigo = dados.precoAntigo;
    this._nota = dados.nota;
    this._desconto = dados.desconto;
    this._farmacia = dados.farmacia;
    this._descricao = dados.descricao;
    this._estoque = dados.estoque || 0;
    this._laboratorio = dados.laboratorio;
    this._principioAtivo = dados.principioAtivo;
    this._tipoReceita = dados.tipoReceita;
  }

  // Getters
  get id(): number { return this._id; }
  get estoqueId(): number | undefined { return this._estoqueId; }
  get nome(): string { return this._nome; }
  get preco(): number { return this._preco; }
  get precoAntigo(): number | undefined { return this._precoAntigo; }
  get nota(): number { return this._nota; }
  get desconto(): number { return this._desconto; }
  get farmacia(): string | undefined { return this._farmacia; }
  get descricao(): string | undefined { return this._descricao; }
  get estoque(): number { return this._estoque; }
  get laboratorio(): string | undefined { return this._laboratorio; }
  get principioAtivo(): string | undefined { return this._principioAtivo; }
  get tipoReceita(): string | undefined { return this._tipoReceita; }

  /**
   * Verifica se tem desconto
   */
  public temDesconto(): boolean {
    return this._desconto > 0;
  }

  /**
   * Verifica se tem grande desconto (> 30%)
   */
  public temGrandeDesconto(): boolean {
    return this._desconto > 30;
  }

  /**
   * Verifica se tem boa nota (>= 4.5)
   */
  public temBoaNota(): boolean {
    return this._nota >= 4.5;
  }

  /**
   * Verifica se é barato (< R$ 20)
   */
  public eBarato(): boolean {
    return this._preco < 20;
  }

  /**
   * Verifica se está em estoque
   */
  public estaEmEstoque(): boolean {
    return this._estoque > 0;
  }

  /**
   * Verifica se está em estoque baixo (< 10 unidades)
   */
  public estaComEstoqueBaixo(): boolean {
    return this._estoque > 0 && this._estoque < 10;
  }

  /**
   * Verifica se requer receita
   */
  public requerReceita(): boolean {
    return this._tipoReceita !== undefined &&
           this._tipoReceita !== 'NAO_EXIGIDO' &&
           this._tipoReceita !== null;
  }

  /**
   * Obtém label de tipo de receita formatado
   */
  public obterLabelTipoReceita(): string | null {
    if (!this._tipoReceita || this._tipoReceita === 'NAO_EXIGIDO') return null;

    const labels: Record<string, string> = {
      'RECEITA_BRANCA': 'Receita Simples',
      'RECEITA_AZUL': 'Receita Azul',
      'RECEITA_AMARELA': 'Receita Amarela'
    };

    return labels[this._tipoReceita] || this._tipoReceita;
  }

  /**
   * Obtém cor para tipo de receita
   */
  public obterCorTipoReceita(): string {
    if (!this._tipoReceita) return '#9CA3AF'; // Cinza

    const cores: Record<string, string> = {
      'NAO_EXIGIDO': '#10B981', // Verde
      'RECEITA_BRANCA': '#3B82F6', // Azul
      'RECEITA_AZUL': '#60A5FA', // Azul claro
      'RECEITA_AMARELA': '#FBBF24' // Amarelo
    };

    return cores[this._tipoReceita] || '#9CA3AF';
  }

  /**
   * Formata estoque para exibição
   */
  public formatarEstoque(): string {
    if (this._estoque === 0) return 'Esgotado';
    if (this._estoque < 10) return `Apenas ${this._estoque} unidades`;
    return `${this._estoque} unidades`;
  }

  /**
   * Obtém descrição resumida (primeiros 60 caracteres)
   */
  public obterDescricaoResumida(): string | null {
    if (!this._descricao) return null;
    if (this._descricao.length <= 60) return this._descricao;
    return `${this._descricao.substring(0, 57)}...`;
  }

  /**
   * Calcula economia em reais
   */
  public calcularEconomia(): number {
    if (!this._precoAntigo) return 0;
    return this._precoAntigo - this._preco;
  }

  /**
   * Formata preço
   */
  public formatarPreco(): string {
    return this._preco.toFixed(2).replace('.', ',');
  }

  /**
   * Formata preço antigo
   */
  public formatarPrecoAntigo(): string | null {
    if (!this._precoAntigo) return null;
    return `R$ ${this._precoAntigo.toFixed(2).replace('.', ',')}`;
  }

  /**
   * Formata desconto
   */
  public formatarDesconto(): string {
    return `-${this._desconto}%`;
  }

  /**
   * Formata nota
   */
  public formatarNota(): string {
    return this._nota.toFixed(1);
  }

  /**
   * Formata economia
   */
  public formatarEconomia(): string | null {
    const economia = this.calcularEconomia();
    if (economia === 0) return null;
    return `Economize R$ ${economia.toFixed(2).replace('.', ',')}`;
  }

  /**
   * Obtém cor do desconto
   */
  public obterCorDesconto(): string {
    if (this._desconto >= 50) return '#EF4444'; // Vermelho intenso
    if (this._desconto >= 30) return '#F59E0B'; // Laranja
    return '#10B981'; // Verde
  }

  /**
   * Obtém badge do produto
   */
  public obterBadge(): string | null {
    if (this.temGrandeDesconto()) return `${this._desconto}% OFF`;
    if (this.temBoaNota()) return `${this._nota.toFixed(1)} ⭐`;
    return null;
  }

  /**
   * Converte para JSON
   */
  public paraJSON() {
    return {
      id: this._id,
      estoqueId: this._estoqueId,
      nome: this._nome,
      preco: this._preco,
      precoAntigo: this._precoAntigo,
      nota: this._nota,
      desconto: this._desconto,
      farmacia: this._farmacia,
      descricao: this._descricao,
      estoque: this._estoque,
      laboratorio: this._laboratorio,
      principioAtivo: this._principioAtivo,
      tipoReceita: this._tipoReceita,
    };
  }

  /**
   * Cria instância a partir de dados
   */
  public static criar(dados: any): ProdutoFarmacia {
    return new ProdutoFarmacia({
      id: dados.id,
      estoqueId: dados.estoqueId,
      nome: dados.nome || dados.name || '',
      preco: dados.preco || dados.price || 0,
      precoAntigo: dados.precoAntigo || dados.oldPrice,
      nota: dados.nota || dados.rating || 0,
      desconto: dados.desconto || dados.discount || 0,
      farmacia: dados.farmacia,
      descricao: dados.descricao || dados.description,
      estoque: dados.estoque || dados.quantidade || 0,
      laboratorio: dados.laboratorio || dados.lab,
      principioAtivo: dados.principioAtivo || dados.activeIngredient,
      tipoReceita: dados.tipoReceita || dados.prescriptionType,
    });
  }

  /**
   * Cria instância a partir de dados da API
   */
  public static deAPI(dados: any): ProdutoFarmacia {
    return new ProdutoFarmacia({
      id: dados.id,
      nome: dados.nome || dados.name,
      preco: dados.preco || dados.price,
      precoAntigo: dados.precoAntigo || dados.old_price,
      nota: dados.nota || dados.rating,
      desconto: dados.desconto || dados.discount,
      farmacia: dados.farmacia,
      descricao: dados.descricao || dados.description,
      estoque: dados.estoque || dados.quantidade,
      laboratorio: dados.laboratorio,
      principioAtivo: dados.principioAtivo,
      tipoReceita: dados.tipoReceita,
    });
  }
}
