/**
 * Classe ItemFavorito
 * Representa um produto favoritado pelo usuário
 */

export class ItemFavorito {
  private _id: number;
  private _produtoId: number;
  private _produtoNome: string;
  private _produtoDescricao?: string;
  private _preco: number;
  private _farmaciaId: number;
  private _farmaciaNome: string;
  private _categoria?: string;
  private _tarja?: 'BRANCA' | 'VERMELHA' | 'AMARELA' | 'PRETA';
  private _imagemUrl?: string;
  private _dataAdicionado: Date;

  constructor(dados: {
    id: number;
    produtoId: number;
    produtoNome: string;
    produtoDescricao?: string;
    preco: number;
    farmaciaId: number;
    farmaciaNome: string;
    categoria?: string;
    tarja?: 'BRANCA' | 'VERMELHA' | 'AMARELA' | 'PRETA';
    imagemUrl?: string;
    dataAdicionado?: Date;
  }) {
    this._id = dados.id;
    this._produtoId = dados.produtoId;
    this._produtoNome = dados.produtoNome;
    this._produtoDescricao = dados.produtoDescricao;
    this._preco = dados.preco;
    this._farmaciaId = dados.farmaciaId;
    this._farmaciaNome = dados.farmaciaNome;
    this._categoria = dados.categoria;
    this._tarja = dados.tarja;
    this._imagemUrl = dados.imagemUrl;
    this._dataAdicionado = dados.dataAdicionado || new Date();
  }

  // Getters
  get id(): number { return this._id; }
  get produtoId(): number { return this._produtoId; }
  get produtoNome(): string { return this._produtoNome; }
  get produtoDescricao(): string | undefined { return this._produtoDescricao; }
  get preco(): number { return this._preco; }
  get farmaciaId(): number { return this._farmaciaId; }
  get farmaciaNome(): string { return this._farmaciaNome; }
  get categoria(): string | undefined { return this._categoria; }
  get tarja(): string | undefined { return this._tarja; }
  get imagemUrl(): string | undefined { return this._imagemUrl; }
  get dataAdicionado(): Date { return this._dataAdicionado; }

  /**
   * Formata o preço em Real (R$)
   */
  public formatarPreco(): string {
    return `R$ ${this._preco.toFixed(2).replace('.', ',')}`;
  }

  /**
   * Verifica se o produto está em promoção (mock)
   */
  public estaEmPromocao(): boolean {
    // TODO: Implementar lógica real quando backend tiver promoções
    return false;
  }

  /**
   * Verifica se foi adicionado recentemente (últimos 7 dias)
   */
  public foiAdicionadoRecentemente(): boolean {
    const agora = new Date();
    const diasPassados = Math.floor(
      (agora.getTime() - this._dataAdicionado.getTime()) / (1000 * 60 * 60 * 24)
    );
    return diasPassados <= 7;
  }

  /**
   * Formata data de adição (ex: "Há 2 dias")
   */
  public formatarDataAdicionado(): string {
    const agora = new Date();
    const diferencaMs = agora.getTime() - this._dataAdicionado.getTime();
    const minutos = Math.floor(diferencaMs / (1000 * 60));
    const horas = Math.floor(diferencaMs / (1000 * 60 * 60));
    const dias = Math.floor(diferencaMs / (1000 * 60 * 60 * 24));

    if (minutos < 1) return 'Agora';
    if (minutos < 60) return `Há ${minutos} ${minutos === 1 ? 'minuto' : 'minutos'}`;
    if (horas < 24) return `Há ${horas} ${horas === 1 ? 'hora' : 'horas'}`;
    if (dias < 30) return `Há ${dias} ${dias === 1 ? 'dia' : 'dias'}`;

    return this._dataAdicionado.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }

  /**
   * Verifica se tem imagem
   */
  public temImagem(): boolean {
    return !!this._imagemUrl && this._imagemUrl.trim().length > 0;
  }

  /**
   * Verifica se requer prescrição médica (tarja vermelha ou preta)
   */
  public requerPrescricao(): boolean {
    return this._tarja === 'VERMELHA' || this._tarja === 'PRETA';
  }

  /**
   * Obtém cor da tarja
   */
  public obterCorTarja(): string {
    const cores: Record<string, string> = {
      BRANCA: '#FFFFFF',
      VERMELHA: '#E53935',
      AMARELA: '#FDD835',
      PRETA: '#212121',
    };
    return cores[this._tarja || 'BRANCA'] || '#FFFFFF';
  }

  /**
   * Converte para JSON
   */
  public paraJSON() {
    return {
      id: this._id,
      produtoId: this._produtoId,
      produtoNome: this._produtoNome,
      produtoDescricao: this._produtoDescricao,
      preco: this._preco,
      farmaciaId: this._farmaciaId,
      farmaciaNome: this._farmaciaNome,
      categoria: this._categoria,
      tarja: this._tarja,
      imagemUrl: this._imagemUrl,
      dataAdicionado: this._dataAdicionado.toISOString(),
    };
  }

  /**
   * Cria instância a partir de dados da API
   */
  public static deAPI(dados: any): ItemFavorito {
    return new ItemFavorito({
      id: dados.id,
      produtoId: dados.produtoId || dados.produto_id,
      produtoNome: dados.produtoNome || dados.produto_nome || dados.nome,
      produtoDescricao: dados.produtoDescricao || dados.descricao,
      preco: dados.preco,
      farmaciaId: dados.farmaciaId || dados.farmacia_id,
      farmaciaNome: dados.farmaciaNome || dados.farmacia_nome || dados.farmacia,
      categoria: dados.categoria,
      tarja: dados.tarja,
      imagemUrl: dados.imagemUrl || dados.imagem_url,
      dataAdicionado: dados.dataAdicionado ? new Date(dados.dataAdicionado) : new Date(),
    });
  }

  /**
   * Cria instância a partir de localStorage
   */
  public static deJSON(dados: any): ItemFavorito {
    return new ItemFavorito({
      ...dados,
      dataAdicionado: new Date(dados.dataAdicionado),
    });
  }
}
