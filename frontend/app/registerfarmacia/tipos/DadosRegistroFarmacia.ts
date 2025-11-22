/**
 * Classe DadosRegistroFarmacia
 * Representa os dados do formulário de registro de farmácia
 */

export class DadosRegistroFarmacia {
  private _email: string = '';
  private _senha: string = '';
  private _confirmarSenha: string = '';
  private _cnpj: string = '';
  private _razaoSocial: string = '';
  private _nomeFantasia: string = '';
  private _crfJ: string = '';
  private _emailContato: string = '';
  private _numeroCelularContato: string = '';

  // Getters
  get email(): string { return this._email; }
  get senha(): string { return this._senha; }
  get confirmarSenha(): string { return this._confirmarSenha; }
  get cnpj(): string { return this._cnpj; }
  get razaoSocial(): string { return this._razaoSocial; }
  get nomeFantasia(): string { return this._nomeFantasia; }
  get crfJ(): string { return this._crfJ; }
  get emailContato(): string { return this._emailContato; }
  get numeroCelularContato(): string { return this._numeroCelularContato; }

  // Setters
  public definirEmail(email: string): void { this._email = email; }
  public definirSenha(senha: string): void { this._senha = senha; }
  public definirConfirmarSenha(senha: string): void { this._confirmarSenha = senha; }
  public definirCNPJ(cnpj: string): void { this._cnpj = cnpj; }
  public definirRazaoSocial(razaoSocial: string): void { this._razaoSocial = razaoSocial; }
  public definirNomeFantasia(nomeFantasia: string): void { this._nomeFantasia = nomeFantasia; }
  public definirCRFJ(crfJ: string): void { this._crfJ = crfJ; }
  public definirEmailContato(email: string): void { this._emailContato = email; }
  public definirNumeroCelularContato(numero: string): void { this._numeroCelularContato = numero; }

  /**
   * Validações individuais de campos
   */
  public validarEmail(): string | null {
    if (!this._email) return 'Email é obrigatório';
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(this._email)) return 'Email inválido';
    return null;
  }

  public validarSenha(): string | null {
    if (!this._senha) return 'Senha é obrigatória';
    if (this._senha.length < 6) return 'Senha deve ter no mínimo 6 caracteres';
    return null;
  }

  public validarConfirmarSenha(): string | null {
    if (!this._confirmarSenha) return 'Confirmação de senha é obrigatória';
    if (this._senha !== this._confirmarSenha) return 'Senhas não conferem';
    return null;
  }

  public validarCNPJ(): string | null {
    if (!this._cnpj) return 'CNPJ é obrigatório';
    // Remove caracteres não numéricos
    const cnpjLimpo = this._cnpj.replace(/\D/g, '');
    if (cnpjLimpo.length !== 14) return 'CNPJ deve ter 14 dígitos';
    return null;
  }

  public validarRazaoSocial(): string | null {
    if (!this._razaoSocial) return 'Razão Social é obrigatória';
    if (this._razaoSocial.length < 3) return 'Razão Social muito curta';
    return null;
  }

  public validarNomeFantasia(): string | null {
    if (!this._nomeFantasia) return 'Nome Fantasia é obrigatório';
    if (this._nomeFantasia.length < 3) return 'Nome Fantasia muito curto';
    return null;
  }

  public validarCRFJ(): string | null {
    if (!this._crfJ) return 'CRF-J é obrigatório';
    return null;
  }

  public validarEmailContato(): string | null {
    if (!this._emailContato) return 'Email de contato é obrigatório';
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(this._emailContato)) return 'Email de contato inválido';
    return null;
  }

  public validarNumeroCelularContato(): string | null {
    if (!this._numeroCelularContato) return 'Celular de contato é obrigatório';
    const numeroLimpo = this._numeroCelularContato.replace(/\D/g, '');
    if (numeroLimpo.length < 10) return 'Celular inválido';
    return null;
  }

  /**
   * Valida todos os campos
   */
  public validarTodos(): Record<string, string> {
    const erros: Record<string, string> = {};

    const erroEmail = this.validarEmail();
    if (erroEmail) erros.email = erroEmail;

    const erroSenha = this.validarSenha();
    if (erroSenha) erros.senha = erroSenha;

    const erroConfirmarSenha = this.validarConfirmarSenha();
    if (erroConfirmarSenha) erros.confirmarSenha = erroConfirmarSenha;

    const erroCNPJ = this.validarCNPJ();
    if (erroCNPJ) erros.cnpj = erroCNPJ;

    const erroRazaoSocial = this.validarRazaoSocial();
    if (erroRazaoSocial) erros.razaoSocial = erroRazaoSocial;

    const erroNomeFantasia = this.validarNomeFantasia();
    if (erroNomeFantasia) erros.nomeFantasia = erroNomeFantasia;

    const erroCRFJ = this.validarCRFJ();
    if (erroCRFJ) erros.crfJ = erroCRFJ;

    const erroEmailContato = this.validarEmailContato();
    if (erroEmailContato) erros.emailContato = erroEmailContato;

    const erroNumeroCelular = this.validarNumeroCelularContato();
    if (erroNumeroCelular) erros.numeroCelularContato = erroNumeroCelular;

    return erros;
  }

  /**
   * Verifica se todos os campos são válidos
   */
  public eValido(): boolean {
    return Object.keys(this.validarTodos()).length === 0;
  }

  /**
   * Formata CNPJ para exibição
   */
  public formatarCNPJ(): string {
    const numeros = this._cnpj.replace(/\D/g, '');
    return numeros.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
  }

  /**
   * Formata celular para exibição
   */
  public formatarCelular(): string {
    const numeros = this._numeroCelularContato.replace(/\D/g, '');
    if (numeros.length === 11) {
      return numeros.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
    }
    return this._numeroCelularContato;
  }

  /**
   * Converte para JSON para envio à API
   */
  public paraJSON() {
    return {
      email: this._email,
      senha: this._senha,
      cnpj: this._cnpj.replace(/\D/g, ''),
      razaoSocial: this._razaoSocial,
      nomeFantasia: this._nomeFantasia,
      crfJ: this._crfJ,
      emailContato: this._emailContato,
      numeroCelularContato: this._numeroCelularContato.replace(/\D/g, ''),
    };
  }

  /**
   * Limpa todos os dados
   */
  public limpar(): void {
    this._email = '';
    this._senha = '';
    this._confirmarSenha = '';
    this._cnpj = '';
    this._razaoSocial = '';
    this._nomeFantasia = '';
    this._crfJ = '';
    this._emailContato = '';
    this._numeroCelularContato = '';
  }
}
