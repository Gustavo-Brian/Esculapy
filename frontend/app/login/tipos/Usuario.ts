/**
 * Classe Usuario
 * Entidade de domínio do usuário autenticado
 */

export class Usuario {
  private _id: number;
  private _nome: string;
  private _email: string;
  private _tipo: 'CLIENTE' | 'LOJISTA_ADMIN' | 'FARMACEUTICO';
  private _token?: string;

  constructor(dados: {
    id: number;
    nome: string;
    email: string;
    tipo: 'CLIENTE' | 'LOJISTA_ADMIN' | 'FARMACEUTICO';
    token?: string;
  }) {
    this._id = dados.id;
    this._nome = dados.nome;
    this._email = dados.email;
    this._tipo = dados.tipo;
    this._token = dados.token;
  }

  // Getters
  get id(): number { return this._id; }
  get nome(): string { return this._nome; }
  get email(): string { return this._email; }
  get tipo(): string { return this._tipo; }
  get token(): string | undefined { return this._token; }

  /**
   * Verifica se é cliente
   */
  public eCliente(): boolean {
    return this._tipo === 'CLIENTE';
  }

  /**
   * Verifica se é administrador de farmácia
   */
  public eAdminFarmacia(): boolean {
    return this._tipo === 'LOJISTA_ADMIN';
  }

  /**
   * Verifica se é farmacêutico
   */
  public eFarmaceutico(): boolean {
    return this._tipo === 'FARMACEUTICO';
  }

  /**
   * Obtém iniciais do nome
   */
  public obterIniciais(): string {
    const partes = this._nome.split(' ');
    if (partes.length >= 2) {
      return `${partes[0][0]}${partes[1][0]}`.toUpperCase();
    }
    return this._nome.substring(0, 2).toUpperCase();
  }

  /**
   * Define token de autenticação
   */
  public definirToken(token: string): void {
    this._token = token;
  }

  /**
   * Converte para JSON
   */
  public paraJSON() {
    return {
      id: this._id,
      nome: this._nome,
      email: this._email,
      tipo: this._tipo,
      token: this._token,
    };
  }

  /**
   * Cria instância a partir de dados da API
   */
  public static deAPI(dados: any): Usuario {
    // Mapeia 'role' para 'tipo' se necessário
    let tipo: 'CLIENTE' | 'LOJISTA_ADMIN' | 'FARMACEUTICO' = 'CLIENTE';

    if (dados.tipo) {
      tipo = dados.tipo;
    } else if (dados.role) {
      // Converte role do backend para tipo
      const roleMap: Record<string, 'CLIENTE' | 'LOJISTA_ADMIN' | 'FARMACEUTICO'> = {
        'cliente': 'CLIENTE',
        'CLIENTE': 'CLIENTE',
        'ROLE_CLIENTE': 'CLIENTE',
        'lojista_admin': 'LOJISTA_ADMIN',
        'LOJISTA_ADMIN': 'LOJISTA_ADMIN',
        'ROLE_LOJISTA_ADMIN': 'LOJISTA_ADMIN',
        'farmaceutico': 'FARMACEUTICO',
        'FARMACEUTICO': 'FARMACEUTICO',
        'ROLE_FARMACEUTICO': 'FARMACEUTICO',
      };
      tipo = roleMap[dados.role] || 'CLIENTE';
    }

    return new Usuario({
      id: dados.id,
      nome: dados.nome || 'Usuário',
      email: dados.email,
      tipo,
      token: dados.token,
    });
  }
}
