/**
 * Classe FiltroFarmacia
 * Representa um filtro para ordenar/filtrar farmácias
 */

export type TipoFiltro = 'proximidade' | 'avaliacao' | 'entrega' | 'preco';

export class FiltroFarmacia {
  private _id: TipoFiltro;
  private _nome: string;
  private _icone: string;

  constructor(dados: {
    id: TipoFiltro;
    nome: string;
    icone: string;
  }) {
    this._id = dados.id;
    this._nome = dados.nome;
    this._icone = dados.icone;
  }

  // Getters
  get id(): TipoFiltro { return this._id; }
  get nome(): string { return this._nome; }
  get icone(): string { return this._icone; }

  /**
   * Verifica se é filtro ativo
   */
  public eAtivo(filtroAtivo: string): boolean {
    return this._id === filtroAtivo;
  }

  /**
   * Obtém descrição do filtro
   */
  public obterDescricao(): string {
    const descricoes: Record<TipoFiltro, string> = {
      proximidade: 'Farmácias mais próximas de você',
      avaliacao: 'Farmácias com melhores avaliações',
      entrega: 'Farmácias com entrega mais rápida',
      preco: 'Farmácias com os melhores preços',
    };

    return descricoes[this._id] || '';
  }

  /**
   * Obtém cor do ícone
   */
  public obterCorIcone(eAtivo: boolean): string {
    return eAtivo ? '#2563EB' : '#6B7280';
  }

  /**
   * Obtém estilo do chip
   */
  public obterEstiloChip(eAtivo: boolean) {
    return {
      backgroundColor: eAtivo ? '#EFF6FF' : '#F3F4F6',
      borderColor: eAtivo ? '#2563EB' : '#E5E7EB',
    };
  }

  /**
   * Obtém estilo do texto
   */
  public obterEstiloTexto(eAtivo: boolean) {
    return {
      color: eAtivo ? '#2563EB' : '#6B7280',
      fontWeight: eAtivo ? '600' : '400',
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
    };
  }

  /**
   * Cria instância a partir de dados
   */
  public static criar(dados: any): FiltroFarmacia {
    return new FiltroFarmacia({
      id: dados.id,
      nome: dados.nome,
      icone: dados.icone,
    });
  }

  /**
   * Filtros padrão do sistema
   */
  public static obterFiltrosPadrao(): FiltroFarmacia[] {
    return [
      new FiltroFarmacia({
        id: 'proximidade',
        nome: 'Mais próximas',
        icone: 'location',
      }),
      new FiltroFarmacia({
        id: 'avaliacao',
        nome: 'Melhor avaliadas',
        icone: 'star',
      }),
      new FiltroFarmacia({
        id: 'entrega',
        nome: 'Entrega mais rápida',
        icone: 'time',
      }),
      new FiltroFarmacia({
        id: 'preco',
        nome: 'Melhores preços',
        icone: 'pricetag',
      }),
    ];
  }
}
