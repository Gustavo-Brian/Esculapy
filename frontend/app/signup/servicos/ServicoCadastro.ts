/**
 * Serviço de Cadastro
 * Gerencia o processo de cadastro de novos usuários
 */

import { registerCliente } from '@/src/servicos/auth/authService';
import { DadosCadastro } from '../tipos/DadosCadastro';
import { Usuario } from '@/app/login/tipos/Usuario';

export class ServicoCadastro {
  /**
   * Cadastra um novo usuário
   */
  public async cadastrar(dados: DadosCadastro): Promise<Usuario> {
    try {
      // Valida os dados antes de enviar
      const validacao = dados.validar();
      if (!validacao.valido) {
        throw new Error(validacao.erros.join(', '));
      }

      // Converte para formato da API
      const dadosAPI = dados.paraAPI();

      // Chama API de cadastro
      const resposta = await registerCliente(dadosAPI);

      // Converte resposta para classe Usuario
      // A API retorna: { token, userId, email, role }
      return Usuario.deAPI({
        id: resposta.userId,
        email: resposta.email,
        nome: dados.nome,
        role: resposta.role || 'cliente',
      });
    } catch (erro: any) {
      console.error('[ServicoCadastro] Erro ao cadastrar:', erro);
      throw erro;
    }
  }

  /**
   * Valida email
   */
  public validarEmail(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  /**
   * Valida CPF
   */
  public validarCPF(cpf: string): boolean {
    const numeros = cpf.replace(/\D/g, '');

    if (numeros.length !== 11) return false;
    if (/^(\d)\1+$/.test(numeros)) return false;

    let soma = 0;
    let resto;

    for (let i = 1; i <= 9; i++) {
      soma += parseInt(numeros.substring(i - 1, i)) * (11 - i);
    }
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(numeros.substring(9, 10))) return false;

    soma = 0;
    for (let i = 1; i <= 10; i++) {
      soma += parseInt(numeros.substring(i - 1, i)) * (12 - i);
    }
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(numeros.substring(10, 11))) return false;

    return true;
  }

  /**
   * Valida senha
   */
  public validarSenha(senha: string): boolean {
    return senha.length >= 6;
  }

  /**
   * Valida se senhas coincidem
   */
  public validarSenhasCoincidentes(senha: string, confirmarSenha: string): boolean {
    return senha === confirmarSenha && senha.length > 0;
  }
}
