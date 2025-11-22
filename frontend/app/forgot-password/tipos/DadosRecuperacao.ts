/**
 * Classe de Domínio: Dados de Recuperação de Senha
 * Representa os dados para recuperação de senha
 */
export class DadosRecuperacao {
  constructor(
    public email: string,
    public dataEnvio?: Date
  ) {}

  /**
   * Valida se o email é válido
   */
  emailValido(): boolean {
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regexEmail.test(this.email.trim());
  }

  /**
   * Formata o email (lowercase e trim)
   */
  formatarEmail(): string {
    return this.email.trim().toLowerCase();
  }

  /**
   * Verifica se pode reenviar (mínimo 1 minuto)
   */
  podeReenviar(): boolean {
    if (!this.dataEnvio) return true;

    const umMinuto = 60 * 1000;
    const agora = new Date().getTime();
    const diferenca = agora - this.dataEnvio.getTime();

    return diferenca >= umMinuto;
  }

  /**
   * Obtém mensagem de erro de validação
   */
  obterErroValidacao(): string | null {
    if (!this.email.trim()) {
      return 'Digite seu e-mail';
    }

    if (!this.emailValido()) {
      return 'Digite um e-mail válido';
    }

    return null;
  }
}
