/**
 * Serviço de Autenticação
 * Gerencia login, logout e estado do usuário
 */

import { loginCliente as apiLogin } from '@/src/servicos/auth/authService';
import { Usuario } from '../tipos/Usuario';

export class ServicoAutenticacao {
  private _usuario: Usuario | null = null;
  private _carregando: boolean = false;
  private _erro: string | null = null;

  /**
   * Realiza login
   */
  public async fazerLogin(email: string, senha: string): Promise<Usuario> {
    try {
      this._carregando = true;
      this._erro = null;

      // Valida campos (lança erro se inválido)
      if (!this.validarEmail(email)) {
        throw new Error('Email inválido');
      }
      if (!this.validarSenha(senha)) {
        throw new Error('Senha deve ter no mínimo 6 caracteres');
      }

      // Chama API (salva token automaticamente no authService)
      const resposta = await apiLogin({ email, senha });

      // Cria instância do usuário
      // A API retorna: { token, userId, email, role }
      this._usuario = Usuario.deAPI({
        id: resposta.userId,
        nome: 'Usuário', // Nome será buscado posteriormente do backend
        email: resposta.email,
        role: resposta.role || 'cliente',
        token: resposta.token,
      });

      console.log('[ServicoAutenticacao] Login realizado com sucesso:', {
        userId: resposta.userId,
        email: resposta.email,
        role: resposta.role,
      });

      return this._usuario;

    } catch (erro: any) {
      this._erro = erro.message || 'Erro ao fazer login';
      throw new Error(this._erro);
    } finally {
      this._carregando = false;
    }
  }

  /**
   * Valida email (público para uso no hook)
   */
  public validarEmail(email: string): boolean {
    if (!email || email.trim().length === 0) {
      return false;
    }
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  /**
   * Valida senha (público para uso no hook)
   */
  public validarSenha(senha: string): boolean {
    if (!senha || senha.length === 0) {
      return false;
    }
    return senha.length >= 6;
  }

  /**
   * Faz logout
   */
  public fazerLogout(): void {
    this._usuario = null;
    this._erro = null;
  }

  // Getters
  get usuario(): Usuario | null { return this._usuario; }
  get carregando(): boolean { return this._carregando; }
  get erro(): string | null { return this._erro; }
  get estaAutenticado(): boolean { return this._usuario !== null; }
}
