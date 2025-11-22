/**
 * Classe TopicoAjuda
 * Representa um tópico da central de ajuda (FAQ)
 */

export type CategoriaTopico = 'pedidos' | 'pagamento' | 'entrega' | 'devolucao' | 'conta' | 'geral';

export class TopicoAjuda {
  private _id: number;
  private _titulo: string;
  private _descricao: string;
  private _categoria: CategoriaTopico;
  private _icone: string;
  private _conteudo: string;
  private _tags: string[];
  private _visualizacoes: number;
  private _util: number; // Quantas pessoas acharam útil
  private _ordem: number; // Para ordenação customizada

  constructor(dados: {
    id: number;
    titulo: string;
    descricao: string;
    categoria: CategoriaTopico;
    icone: string;
    conteudo: string;
    tags: string[];
    visualizacoes: number;
    util: number;
    ordem: number;
  }) {
    this._id = dados.id;
    this._titulo = dados.titulo;
    this._descricao = dados.descricao;
    this._categoria = dados.categoria;
    this._icone = dados.icone;
    this._conteudo = dados.conteudo;
    this._tags = dados.tags || [];
    this._visualizacoes = dados.visualizacoes || 0;
    this._util = dados.util || 0;
    this._ordem = dados.ordem || 0;
  }

  // Getters
  get id(): number { return this._id; }
  get titulo(): string { return this._titulo; }
  get descricao(): string { return this._descricao; }
  get categoria(): CategoriaTopico { return this._categoria; }
  get icone(): string { return this._icone; }
  get conteudo(): string { return this._conteudo; }
  get tags(): string[] { return this._tags; }
  get visualizacoes(): number { return this._visualizacoes; }
  get util(): number { return this._util; }
  get ordem(): number { return this._ordem; }

  /**
   * Verifica se tópico é popular (> 100 visualizações)
   */
  public ePopular(): boolean {
    return this._visualizacoes > 100;
  }

  /**
   * Verifica se tópico é muito útil (> 50 avaliações positivas)
   */
  public eMuitoUtil(): boolean {
    return this._util > 50;
  }

  /**
   * Verifica se tem conteúdo longo (> 500 caracteres)
   */
  public temConteudoLongo(): boolean {
    return this._conteudo.length > 500;
  }

  /**
   * Verifica se corresponde a uma busca
   */
  public correspondeABusca(termoBusca: string): boolean {
    if (!termoBusca || termoBusca.trim() === '') return true;

    const termoLower = termoBusca.toLowerCase();

    // Busca no título
    if (this._titulo.toLowerCase().includes(termoLower)) return true;

    // Busca na descrição
    if (this._descricao.toLowerCase().includes(termoLower)) return true;

    // Busca no conteúdo
    if (this._conteudo.toLowerCase().includes(termoLower)) return true;

    // Busca nas tags
    if (this._tags.some(tag => tag.toLowerCase().includes(termoLower))) return true;

    return false;
  }

  /**
   * Verifica se pertence a uma categoria
   */
  public pertenceACategoria(categoria: CategoriaTopico): boolean {
    return this._categoria === categoria;
  }

  /**
   * Obtém cor da categoria
   */
  public obterCorCategoria(): string {
    const cores: Record<CategoriaTopico, string> = {
      pedidos: '#3B82F6',    // Azul
      pagamento: '#10B981',  // Verde
      entrega: '#F59E0B',    // Laranja
      devolucao: '#EF4444',  // Vermelho
      conta: '#8B5CF6',      // Roxo
      geral: '#6B7280',      // Cinza
    };
    return cores[this._categoria];
  }

  /**
   * Obtém nome da categoria
   */
  public obterNomeCategoria(): string {
    const nomes: Record<CategoriaTopico, string> = {
      pedidos: 'Pedidos',
      pagamento: 'Pagamento',
      entrega: 'Entrega',
      devolucao: 'Devolução',
      conta: 'Conta',
      geral: 'Geral',
    };
    return nomes[this._categoria];
  }

  /**
   * Incrementa visualizações
   */
  public incrementarVisualizacoes(): void {
    this._visualizacoes++;
  }

  /**
   * Incrementa avaliações úteis
   */
  public incrementarUtil(): void {
    this._util++;
  }

  /**
   * Obtém resumo do conteúdo (primeiros 200 caracteres)
   */
  public obterResumoConteudo(): string {
    if (this._conteudo.length <= 200) return this._conteudo;
    return `${this._conteudo.substring(0, 197)}...`;
  }

  /**
   * Obtém badge de destaque
   */
  public obterBadge(): string | null {
    if (this.eMuitoUtil()) return 'Mais Útil';
    if (this.ePopular()) return 'Popular';
    return null;
  }

  /**
   * Calcula pontuação de relevância (para ordenação)
   */
  public calcularRelevancia(): number {
    let pontos = 0;

    // Visualizações (peso menor)
    pontos += this._visualizacoes * 0.1;

    // Útil (peso maior)
    pontos += this._util * 2;

    // Ordem customizada (peso alto)
    pontos += (100 - this._ordem) * 5;

    return pontos;
  }

  /**
   * Formata visualizações
   */
  public formatarVisualizacoes(): string {
    if (this._visualizacoes >= 1000) {
      return `${(this._visualizacoes / 1000).toFixed(1)}k visualizações`;
    }
    return `${this._visualizacoes} ${this._visualizacoes === 1 ? 'visualização' : 'visualizações'}`;
  }

  /**
   * Converte para JSON
   */
  public paraJSON() {
    return {
      id: this._id,
      titulo: this._titulo,
      descricao: this._descricao,
      categoria: this._categoria,
      icone: this._icone,
      conteudo: this._conteudo,
      tags: this._tags,
      visualizacoes: this._visualizacoes,
      util: this._util,
      ordem: this._ordem,
    };
  }

  /**
   * Cria instância a partir de dados
   */
  public static criar(dados: any): TopicoAjuda {
    return new TopicoAjuda({
      id: dados.id,
      titulo: dados.titulo || dados.title,
      descricao: dados.descricao || dados.description,
      categoria: dados.categoria || dados.category || 'geral',
      icone: dados.icone || dados.icon || 'help-circle-outline',
      conteudo: dados.conteudo || dados.content || '',
      tags: dados.tags || [],
      visualizacoes: dados.visualizacoes || dados.views || 0,
      util: dados.util || dados.helpful || 0,
      ordem: dados.ordem || dados.order || 0,
    });
  }

  /**
   * Cria instância a partir de dados da API
   */
  public static deAPI(dados: any): TopicoAjuda {
    return new TopicoAjuda({
      id: dados.id,
      titulo: dados.titulo || dados.title,
      descricao: dados.descricao || dados.description,
      categoria: dados.categoria || dados.category,
      icone: dados.icone || dados.icon,
      conteudo: dados.conteudo || dados.content,
      tags: dados.tags || [],
      visualizacoes: dados.visualizacoes || dados.views || 0,
      util: dados.util || dados.helpful || 0,
      ordem: dados.ordem || dados.order || 0,
    });
  }
}
