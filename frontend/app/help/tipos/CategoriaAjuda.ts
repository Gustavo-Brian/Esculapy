/**
 * Classe CategoriaAjuda
 * Representa uma categoria de tópicos de ajuda
 */

import { CategoriaTopico } from './TopicoAjuda';

export class CategoriaAjuda {
  private _id: CategoriaTopico;
  private _nome: string;
  private _descricao: string;
  private _icone: string;
  private _cor: string;
  private _totalTopicos: number;

  constructor(dados: {
    id: CategoriaTopico;
    nome: string;
    descricao: string;
    icone: string;
    cor: string;
    totalTopicos: number;
  }) {
    this._id = dados.id;
    this._nome = dados.nome;
    this._descricao = dados.descricao;
    this._icone = dados.icone;
    this._cor = dados.cor;
    this._totalTopicos = dados.totalTopicos || 0;
  }

  // Getters
  get id(): CategoriaTopico { return this._id; }
  get nome(): string { return this._nome; }
  get descricao(): string { return this._descricao; }
  get icone(): string { return this._icone; }
  get cor(): string { return this._cor; }
  get totalTopicos(): number { return this._totalTopicos; }

  /**
   * Verifica se tem tópicos
   */
  public temTopicos(): boolean {
    return this._totalTopicos > 0;
  }

  /**
   * Verifica se tem muitos tópicos (> 5)
   */
  public temMuitosTopicos(): boolean {
    return this._totalTopicos > 5;
  }

  /**
   * Atualiza total de tópicos
   */
  public atualizarTotalTopicos(total: number): void {
    this._totalTopicos = total;
  }

  /**
   * Obtém estilo do badge
   */
  public obterEstiloBadge() {
    return {
      backgroundColor: `${this._cor}20`, // 20 = 12% de opacidade
      borderColor: this._cor,
    };
  }

  /**
   * Obtém estilo do texto
   */
  public obterEstiloTexto() {
    return {
      color: this._cor,
    };
  }

  /**
   * Formata total de tópicos
   */
  public formatarTotalTopicos(): string {
    if (this._totalTopicos === 0) return 'Nenhum tópico';
    if (this._totalTopicos === 1) return '1 tópico';
    return `${this._totalTopicos} tópicos`;
  }

  /**
   * Converte para JSON
   */
  public paraJSON() {
    return {
      id: this._id,
      nome: this._nome,
      descricao: this._descricao,
      icone: this._icone,
      cor: this._cor,
      totalTopicos: this._totalTopicos,
    };
  }

  /**
   * Categorias padrão do sistema
   */
  public static obterCategoriasPadrao(): CategoriaAjuda[] {
    return [
      new CategoriaAjuda({
        id: 'pedidos',
        nome: 'Pedidos',
        descricao: 'Como fazer e acompanhar pedidos',
        icone: 'cart-outline',
        cor: '#3B82F6',
        totalTopicos: 0,
      }),
      new CategoriaAjuda({
        id: 'pagamento',
        nome: 'Pagamento',
        descricao: 'Formas de pagamento e segurança',
        icone: 'card-outline',
        cor: '#10B981',
        totalTopicos: 0,
      }),
      new CategoriaAjuda({
        id: 'entrega',
        nome: 'Entrega',
        descricao: 'Rastreamento e prazos de entrega',
        icone: 'location-outline',
        cor: '#F59E0B',
        totalTopicos: 0,
      }),
      new CategoriaAjuda({
        id: 'devolucao',
        nome: 'Devolução',
        descricao: 'Políticas de devolução e reembolso',
        icone: 'return-down-back-outline',
        cor: '#EF4444',
        totalTopicos: 0,
      }),
      new CategoriaAjuda({
        id: 'conta',
        nome: 'Conta',
        descricao: 'Gerenciar sua conta e perfil',
        icone: 'person-outline',
        cor: '#8B5CF6',
        totalTopicos: 0,
      }),
      new CategoriaAjuda({
        id: 'geral',
        nome: 'Geral',
        descricao: 'Outras dúvidas frequentes',
        icone: 'help-circle-outline',
        cor: '#6B7280',
        totalTopicos: 0,
      }),
    ];
  }

  /**
   * Cria instância a partir de dados
   */
  public static criar(dados: any): CategoriaAjuda {
    return new CategoriaAjuda({
      id: dados.id,
      nome: dados.nome,
      descricao: dados.descricao,
      icone: dados.icone,
      cor: dados.cor,
      totalTopicos: dados.totalTopicos || 0,
    });
  }
}
