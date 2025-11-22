/**
 * Classe CategoriaBusca
 * Representa uma categoria de busca rápida
 */

export class CategoriaBusca {
  private _id: string;
  private _nome: string;
  private _icone: string;
  private _cor: string;

  constructor(dados: {
    id: string;
    nome: string;
    icone: string;
    cor: string;
  }) {
    this._id = dados.id;
    this._nome = dados.nome;
    this._icone = dados.icone;
    this._cor = dados.cor;
  }

  // Getters
  get id(): string { return this._id; }
  get nome(): string { return this._nome; }
  get icone(): string { return this._icone; }
  get cor(): string { return this._cor; }

  /**
   * Verifica se o termo de busca corresponde a esta categoria
   */
  public correspondeAoTermo(termo: string): boolean {
    return this._nome.toLowerCase().includes(termo.toLowerCase());
  }

  /**
   * Obtém estilo para o badge da categoria
   */
  public obterEstiloBadge() {
    return {
      backgroundColor: `${this._cor}20`, // 20 = 12% de opacidade
      borderColor: this._cor,
    };
  }

  /**
   * Obtém estilo para o texto da categoria
   */
  public obterEstiloTexto() {
    return {
      color: this._cor,
    };
  }

  /**
   * Converte para JSON
   */
  public paraJSON() {
    return {
      id: this._id,
      nome: this._nome,
      icone: this._icone,
      cor: this._cor,
    };
  }

  /**
   * Cria instância a partir de dados
   */
  public static criar(dados: any): CategoriaBusca {
    return new CategoriaBusca({
      id: dados.id,
      nome: dados.nome,
      icone: dados.icone,
      cor: dados.cor,
    });
  }

  /**
   * Categorias padrão do sistema
   */
  public static obterCategoriasPadrao(): CategoriaBusca[] {
    return [
      new CategoriaBusca({
        id: 'analgesicos',
        nome: 'Analgésicos',
        icone: 'medkit',
        cor: '#EF4444',
      }),
      new CategoriaBusca({
        id: 'vitaminas',
        nome: 'Vitaminas',
        icone: 'fitness',
        cor: '#10B981',
      }),
      new CategoriaBusca({
        id: 'antibioticos',
        nome: 'Antibióticos',
        icone: 'shield-checkmark',
        cor: '#3B82F6',
      }),
      new CategoriaBusca({
        id: 'dermocosmeticos',
        nome: 'Dermocosmét.',
        icone: 'water',
        cor: '#8B5CF6',
      }),
      new CategoriaBusca({
        id: 'higiene',
        nome: 'Higiene',
        icone: 'sparkles',
        cor: '#06B6D4',
      }),
      new CategoriaBusca({
        id: 'infantil',
        nome: 'Infantil',
        icone: 'happy',
        cor: '#F59E0B',
      }),
    ];
  }
}
