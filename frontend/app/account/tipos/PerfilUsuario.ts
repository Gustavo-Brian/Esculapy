/**
 * Classe PerfilUsuario
 * Representa o perfil do usuário autenticado
 */

export type TipoUsuario = 'CLIENTE' | 'LOJISTA_ADMIN' | 'FARMACEUTICO';

export interface DadosCliente {
  id: number;
  nome: string;
  cpf: string;
}

export interface DadosFarmaciaAdmin {
  id: number;
  nomeFantasia: string;
  cnpj: string;
  status: string;
}

export interface DadosFarmaceutico {
  id: number;
  nome: string;
  crfP: string;
  farmaciaId: number;
}

export class PerfilUsuario {
  private _id: number;
  private _email: string;
  private _roles: string[];
  private _cliente?: DadosCliente;
  private _farmaciaAdmin?: DadosFarmaciaAdmin;
  private _farmaceutico?: DadosFarmaceutico;

  // Dados locais (não do backend)
  private _nome: string;
  private _telefone?: string;
  private _fotoPerfil?: string;

  constructor(dados: {
    id: number;
    email: string;
    roles: string[];
    cliente?: DadosCliente;
    farmaciaAdmin?: DadosFarmaciaAdmin;
    farmaceutico?: DadosFarmaceutico;
    nome: string;
    telefone?: string;
    fotoPerfil?: string;
  }) {
    this._id = dados.id;
    this._email = dados.email;
    this._roles = dados.roles;
    this._cliente = dados.cliente;
    this._farmaciaAdmin = dados.farmaciaAdmin;
    this._farmaceutico = dados.farmaceutico;
    this._nome = dados.nome;
    this._telefone = dados.telefone;
    this._fotoPerfil = dados.fotoPerfil;
  }

  // Getters
  get id(): number { return this._id; }
  get email(): string { return this._email; }
  get roles(): string[] { return this._roles; }
  get cliente(): DadosCliente | undefined { return this._cliente; }
  get farmaciaAdmin(): DadosFarmaciaAdmin | undefined { return this._farmaciaAdmin; }
  get farmaceutico(): DadosFarmaceutico | undefined { return this._farmaceutico; }
  get nome(): string { return this._nome; }
  get telefone(): string | undefined { return this._telefone; }
  get fotoPerfil(): string | undefined { return this._fotoPerfil; }

  /**
   * Obtém o tipo de usuário baseado nas roles
   */
  public obterTipo(): TipoUsuario {
    if (this._roles.includes('ROLE_LOJISTA_ADMIN')) return 'LOJISTA_ADMIN';
    if (this._roles.includes('ROLE_FARMACEUTICO')) return 'FARMACEUTICO';
    return 'CLIENTE';
  }

  /**
   * Verifica se é cliente
   */
  public eCliente(): boolean {
    return this.obterTipo() === 'CLIENTE';
  }

  /**
   * Verifica se é administrador de farmácia
   */
  public eAdminFarmacia(): boolean {
    return this.obterTipo() === 'LOJISTA_ADMIN';
  }

  /**
   * Verifica se é farmacêutico
   */
  public eFarmaceutico(): boolean {
    return this.obterTipo() === 'FARMACEUTICO';
  }

  /**
   * Obtém nome de exibição (prioriza nome do perfil específico)
   */
  public obterNomeExibicao(): string {
    if (this._cliente) return this._cliente.nome;
    if (this._farmaceutico) return this._farmaceutico.nome;
    if (this._farmaciaAdmin) return this._farmaciaAdmin.nomeFantasia;
    return this._nome;
  }

  /**
   * Obtém iniciais do nome (para avatar)
   */
  public obterIniciais(): string {
    const nome = this.obterNomeExibicao();
    const partes = nome.split(' ');

    if (partes.length >= 2) {
      return `${partes[0][0]}${partes[1][0]}`.toUpperCase();
    }

    return nome.substring(0, 2).toUpperCase();
  }

  /**
   * Verifica se tem telefone cadastrado
   */
  public temTelefone(): boolean {
    return !!this._telefone && this._telefone.trim().length > 0;
  }

  /**
   * Formata telefone (XX) XXXXX-XXXX
   */
  public formatarTelefone(): string {
    if (!this._telefone) return 'Não informado';

    const numeros = this._telefone.replace(/\D/g, '');

    if (numeros.length === 11) {
      return `(${numeros.substring(0, 2)}) ${numeros.substring(2, 7)}-${numeros.substring(7)}`;
    }

    if (numeros.length === 10) {
      return `(${numeros.substring(0, 2)}) ${numeros.substring(2, 6)}-${numeros.substring(6)}`;
    }

    return this._telefone;
  }

  /**
   * Obtém subtítulo para exibição (email ou role)
   */
  public obterSubtitulo(): string {
    const tipo = this.obterTipo();

    if (tipo === 'LOJISTA_ADMIN') {
      return this._farmaciaAdmin?.cnpj || this._email;
    }

    if (tipo === 'FARMACEUTICO') {
      return this._farmaceutico?.crfP || this._email;
    }

    if (tipo === 'CLIENTE') {
      return this._cliente?.cpf || this._email;
    }

    return this._email;
  }

  /**
   * Verifica se tem foto de perfil
   */
  public temFotoPerfil(): boolean {
    return !!this._fotoPerfil && this._fotoPerfil.trim().length > 0;
  }

  /**
   * Atualiza dados do perfil
   */
  public atualizarPerfil(dados: {
    nome?: string;
    telefone?: string;
    fotoPerfil?: string;
  }): void {
    if (dados.nome !== undefined) this._nome = dados.nome;
    if (dados.telefone !== undefined) this._telefone = dados.telefone;
    if (dados.fotoPerfil !== undefined) this._fotoPerfil = dados.fotoPerfil;
  }

  /**
   * Converte para JSON
   */
  public paraJSON() {
    return {
      id: this._id,
      email: this._email,
      roles: this._roles,
      cliente: this._cliente,
      farmaciaAdmin: this._farmaciaAdmin,
      farmaceutico: this._farmaceutico,
      nome: this._nome,
      telefone: this._telefone,
      fotoPerfil: this._fotoPerfil,
    };
  }

  /**
   * Cria instância a partir de dados da API (/api/user/me)
   */
  public static deAPI(dados: any): PerfilUsuario {
    // Extrai nome do perfil específico
    let nome = 'Usuário';
    if (dados.cliente?.nome) nome = dados.cliente.nome;
    else if (dados.farmaceutico?.nome) nome = dados.farmaceutico.nome;
    else if (dados.farmaciaAdmin?.nomeFantasia) nome = dados.farmaciaAdmin.nomeFantasia;

    return new PerfilUsuario({
      id: dados.id,
      email: dados.email,
      roles: dados.roles || [],
      cliente: dados.cliente,
      farmaciaAdmin: dados.farmaciaAdmin,
      farmaceutico: dados.farmaceutico,
      nome,
      telefone: undefined, // Backend não retorna telefone
      fotoPerfil: undefined, // Backend não retorna foto
    });
  }

  /**
   * Carrega dados locais (localStorage) e mescla com dados da API
   */
  public static deDadosLocais(dadosAPI: any, dadosLocais: any): PerfilUsuario {
    const perfil = PerfilUsuario.deAPI(dadosAPI);

    // Sobrescreve com dados locais se existirem
    if (dadosLocais?.nome) perfil._nome = dadosLocais.nome;
    if (dadosLocais?.telefone) perfil._telefone = dadosLocais.telefone;
    if (dadosLocais?.fotoPerfil) perfil._fotoPerfil = dadosLocais.fotoPerfil;

    return perfil;
  }
}
