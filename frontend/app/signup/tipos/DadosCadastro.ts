/**
 * Classe DadosCadastro
 * Representa os dados de cadastro de um novo usuário
 */

export class DadosCadastro {
  private _nome: string;
  private _email: string;
  private _cpf: string;
  private _telefone: string | null;
  private _dataNascimento: string | null;
  private _senha: string;

  constructor(dados: {
    nome: string;
    email: string;
    cpf: string;
    telefone?: string | null;
    dataNascimento?: string | null;
    senha: string;
  }) {
    this._nome = dados.nome;
    this._email = dados.email;
    this._cpf = dados.cpf;
    this._telefone = dados.telefone || null;
    this._dataNascimento = dados.dataNascimento || null;
    this._senha = dados.senha;
  }

  // Getters
  get nome(): string { return this._nome; }
  get email(): string { return this._email; }
  get cpf(): string { return this._cpf; }
  get telefone(): string | null { return this._telefone; }
  get dataNascimento(): string | null { return this._dataNascimento; }
  get senha(): string { return this._senha; }

  /**
   * Valida o nome
   */
  public validarNome(): boolean {
    return this._nome.trim().length >= 3;
  }

  /**
   * Valida o email
   */
  public validarEmail(): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(this._email);
  }

  /**
   * Valida o CPF (formato 000.000.000-00)
   */
  public validarCPF(): boolean {
    // Remove caracteres não numéricos
    const cpfNumeros = this._cpf.replace(/\D/g, '');

    // Verifica se tem 11 dígitos
    if (cpfNumeros.length !== 11) {
      return false;
    }

    // Verifica se todos os dígitos são iguais (CPF inválido)
    if (/^(\d)\1+$/.test(cpfNumeros)) {
      return false;
    }

    // Validação dos dígitos verificadores
    let soma = 0;
    let resto;

    // Valida primeiro dígito verificador
    for (let i = 1; i <= 9; i++) {
      soma += parseInt(cpfNumeros.substring(i - 1, i)) * (11 - i);
    }
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpfNumeros.substring(9, 10))) return false;

    // Valida segundo dígito verificador
    soma = 0;
    for (let i = 1; i <= 10; i++) {
      soma += parseInt(cpfNumeros.substring(i - 1, i)) * (12 - i);
    }
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpfNumeros.substring(10, 11))) return false;

    return true;
  }

  /**
   * Valida a senha
   */
  public validarSenha(): boolean {
    return this._senha.length >= 6;
  }

  /**
   * Valida telefone (opcional)
   */
  public validarTelefone(): boolean {
    if (!this._telefone) return true; // Opcional
    const telefoneNumeros = this._telefone.replace(/\D/g, '');
    return telefoneNumeros.length >= 10;
  }

  /**
   * Valida data de nascimento (opcional, formato DD/MM/AAAA)
   */
  public validarDataNascimento(): boolean {
    if (!this._dataNascimento) return true; // Opcional

    const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    const match = this._dataNascimento.match(regex);

    if (!match) return false;

    const dia = parseInt(match[1], 10);
    const mes = parseInt(match[2], 10);
    const ano = parseInt(match[3], 10);

    // Validações básicas
    if (mes < 1 || mes > 12) return false;
    if (dia < 1 || dia > 31) return false;

    const anoAtual = new Date().getFullYear();
    if (ano < 1900 || ano > anoAtual) return false;

    return true;
  }

  /**
   * Valida todos os campos
   */
  public validar(): { valido: boolean; erros: string[] } {
    const erros: string[] = [];

    if (!this.validarNome()) {
      erros.push('Nome deve ter no mínimo 3 caracteres');
    }

    if (!this.validarEmail()) {
      erros.push('Email inválido');
    }

    if (!this.validarCPF()) {
      erros.push('CPF inválido');
    }

    if (!this.validarSenha()) {
      erros.push('Senha deve ter no mínimo 6 caracteres');
    }

    if (!this.validarTelefone()) {
      erros.push('Telefone inválido');
    }

    if (!this.validarDataNascimento()) {
      erros.push('Data de nascimento inválida');
    }

    return {
      valido: erros.length === 0,
      erros,
    };
  }

  /**
   * Converte para objeto da API
   */
  public paraAPI(): Record<string, any> {
    return {
      nome: this._nome.trim(),
      email: this._email.trim().toLowerCase(),
      cpf: this._cpf.replace(/\D/g, ''), // Remove formatação
      telefone: this._telefone?.replace(/\D/g, '') || null,
      data_nascimento: this._dataNascimento || null,
      senha: this._senha,
    };
  }

  /**
   * Formata CPF (000.000.000-00)
   */
  public static formatarCPF(cpf: string): string {
    const numeros = cpf.replace(/\D/g, '');
    return numeros.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }

  /**
   * Formata telefone ((00) 00000-0000)
   */
  public static formatarTelefone(telefone: string): string {
    const numeros = telefone.replace(/\D/g, '');
    if (numeros.length === 11) {
      return numeros.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    } else if (numeros.length === 10) {
      return numeros.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }
    return telefone;
  }

  /**
   * Formata data (DD/MM/AAAA)
   */
  public static formatarData(data: string): string {
    const numeros = data.replace(/\D/g, '');
    if (numeros.length >= 8) {
      return numeros.replace(/(\d{2})(\d{2})(\d{4})/, '$1/$2/$3');
    } else if (numeros.length >= 4) {
      return numeros.replace(/(\d{2})(\d{2})/, '$1/$2/');
    } else if (numeros.length >= 2) {
      return numeros.replace(/(\d{2})/, '$1/');
    }
    return numeros;
  }
}
