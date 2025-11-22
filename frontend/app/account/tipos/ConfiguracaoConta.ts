/**
 * Classe ConfiguracaoConta
 * Representa configurações da conta do usuário
 */

export interface ConfiguracaoNotificacao {
  pedidos: boolean;
  promocoes: boolean;
  newsletter: boolean;
}

export class ConfiguracaoConta {
  private _notificacoes: ConfiguracaoNotificacao;
  private _modoEscuro: boolean;
  private _idioma: string;

  constructor(dados: {
    notificacoes?: ConfiguracaoNotificacao;
    modoEscuro?: boolean;
    idioma?: string;
  }) {
    this._notificacoes = dados.notificacoes || {
      pedidos: true,
      promocoes: true,
      newsletter: false,
    };
    this._modoEscuro = dados.modoEscuro || false;
    this._idioma = dados.idioma || 'pt-BR';
  }

  // Getters
  get notificacoes(): ConfiguracaoNotificacao { return this._notificacoes; }
  get modoEscuro(): boolean { return this._modoEscuro; }
  get idioma(): string { return this._idioma; }

  /**
   * Verifica se tem alguma notificação ativa
   */
  public temNotificacoesAtivas(): boolean {
    return this._notificacoes.pedidos ||
           this._notificacoes.promocoes ||
           this._notificacoes.newsletter;
  }

  /**
   * Conta total de notificações ativas
   */
  public contarNotificacoesAtivas(): number {
    let count = 0;
    if (this._notificacoes.pedidos) count++;
    if (this._notificacoes.promocoes) count++;
    if (this._notificacoes.newsletter) count++;
    return count;
  }

  /**
   * Ativa todas as notificações
   */
  public ativarTodasNotificacoes(): void {
    this._notificacoes = {
      pedidos: true,
      promocoes: true,
      newsletter: true,
    };
  }

  /**
   * Desativa todas as notificações
   */
  public desativarTodasNotificacoes(): void {
    this._notificacoes = {
      pedidos: false,
      promocoes: false,
      newsletter: false,
    };
  }

  /**
   * Atualiza configuração de notificação específica
   */
  public atualizarNotificacao(tipo: keyof ConfiguracaoNotificacao, valor: boolean): void {
    this._notificacoes[tipo] = valor;
  }

  /**
   * Alterna modo escuro
   */
  public alternarModoEscuro(): void {
    this._modoEscuro = !this._modoEscuro;
  }

  /**
   * Define modo escuro
   */
  public definirModoEscuro(valor: boolean): void {
    this._modoEscuro = valor;
  }

  /**
   * Define idioma
   */
  public definirIdioma(idioma: string): void {
    this._idioma = idioma;
  }

  /**
   * Converte para JSON
   */
  public paraJSON() {
    return {
      notificacoes: this._notificacoes,
      modoEscuro: this._modoEscuro,
      idioma: this._idioma,
    };
  }

  /**
   * Cria instância padrão
   */
  public static padrao(): ConfiguracaoConta {
    return new ConfiguracaoConta({
      notificacoes: {
        pedidos: true,
        promocoes: true,
        newsletter: false,
      },
      modoEscuro: false,
      idioma: 'pt-BR',
    });
  }

  /**
   * Cria instância a partir de JSON (localStorage)
   */
  public static deJSON(dados: any): ConfiguracaoConta {
    return new ConfiguracaoConta({
      notificacoes: dados.notificacoes,
      modoEscuro: dados.modoEscuro,
      idioma: dados.idioma,
    });
  }
}
