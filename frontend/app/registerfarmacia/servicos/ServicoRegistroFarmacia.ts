/**
 * Serviço de Registro de Farmácia
 * Gerencia o processo de cadastro de nova farmácia
 */

import { DadosRegistroFarmacia } from '../tipos/DadosRegistroFarmacia';
import { registerFarmacia } from '@/src/servicos/auth/authService';
import AsyncStorage from '@react-native-async-storage/async-storage';

export class ServicoRegistroFarmacia {
  private _dados: DadosRegistroFarmacia;
  private _mostrarSenha: boolean = false;
  private _mostrarConfirmarSenha: boolean = false;
  private _carregando: boolean = false;
  private _erro: string | null = null;

  constructor() {
    this._dados = new DadosRegistroFarmacia();
  }

  /**
   * Altera valor de um campo
   */
  public alterarCampo(campo: string, valor: string): void {
    switch (campo) {
      case 'email':
        this._dados.definirEmail(valor);
        break;
      case 'senha':
        this._dados.definirSenha(valor);
        break;
      case 'confirmarSenha':
        this._dados.definirConfirmarSenha(valor);
        break;
      case 'cnpj':
        this._dados.definirCNPJ(valor);
        break;
      case 'razaoSocial':
        this._dados.definirRazaoSocial(valor);
        break;
      case 'nomeFantasia':
        this._dados.definirNomeFantasia(valor);
        break;
      case 'crfJ':
        this._dados.definirCRFJ(valor);
        break;
      case 'emailContato':
        this._dados.definirEmailContato(valor);
        break;
      case 'numeroCelularContato':
        this._dados.definirNumeroCelularContato(valor);
        break;
    }
  }

  /**
   * Alterna visibilidade da senha
   */
  public alternarVisibilidadeSenha(): void {
    this._mostrarSenha = !this._mostrarSenha;
  }

  /**
   * Alterna visibilidade da confirmação de senha
   */
  public alternarVisibilidadeConfirmarSenha(): void {
    this._mostrarConfirmarSenha = !this._mostrarConfirmarSenha;
  }

  /**
   * Valida um campo específico
   */
  public validarCampo(campo: string): string | null {
    switch (campo) {
      case 'email':
        return this._dados.validarEmail();
      case 'senha':
        return this._dados.validarSenha();
      case 'confirmarSenha':
        return this._dados.validarConfirmarSenha();
      case 'cnpj':
        return this._dados.validarCNPJ();
      case 'razaoSocial':
        return this._dados.validarRazaoSocial();
      case 'nomeFantasia':
        return this._dados.validarNomeFantasia();
      case 'crfJ':
        return this._dados.validarCRFJ();
      case 'emailContato':
        return this._dados.validarEmailContato();
      case 'numeroCelularContato':
        return this._dados.validarNumeroCelularContato();
      default:
        return null;
    }
  }

  /**
   * Valida todos os campos
   */
  public validarFormulario(): Record<string, string> {
    return this._dados.validarTodos();
  }

  /**
   * Registra a farmácia
   */
  public async registrar(): Promise<boolean> {
    try {
      this._carregando = true;
      this._erro = null;

      // Valida formulário
      const erros = this.validarFormulario();
      if (Object.keys(erros).length > 0) {
        this._erro = 'Por favor, corrija os erros no formulário';
        console.log('[ServicoRegistroFarmacia] Formulário inválido:', erros);
        return false;
      }

      const dadosParaEnvio = this._dados.paraJSON();
      console.log('[ServicoRegistroFarmacia] ============ INICIANDO REGISTRO ============');
      console.log('[ServicoRegistroFarmacia] Dados a serem enviados:', JSON.stringify(dadosParaEnvio, null, 2));
      console.log('[ServicoRegistroFarmacia] Chamando registerFarmacia do authService...');

      // Chama authService para registrar farmácia
      const resposta = await registerFarmacia(dadosParaEnvio);

      console.log('[ServicoRegistroFarmacia] Resposta recebida:', resposta);

      // Salva token e dados do usuário
      await Promise.all([
        AsyncStorage.setItem('@auth:token', resposta.token),
        AsyncStorage.setItem('@auth:usuario', JSON.stringify({
          id: resposta.userId,
          email: resposta.email,
          tipo: 'farmacia',
        })),
        AsyncStorage.setItem('@auth:role', 'farmacia'),
      ]);

      console.log('[ServicoRegistroFarmacia] Farmácia registrada com sucesso!');
      return true;

    } catch (erro: any) {
      this._erro = erro.message || 'Erro ao registrar farmácia';
      console.error('[ServicoRegistroFarmacia] Erro:', this._erro);
      return false;
    } finally {
      this._carregando = false;
    }
  }

  /**
   * Limpa o formulário
   */
  public limpar(): void {
    this._dados.limpar();
    this._mostrarSenha = false;
    this._mostrarConfirmarSenha = false;
    this._erro = null;
  }

  // Getters
  get dados(): DadosRegistroFarmacia { return this._dados; }
  get mostrarSenha(): boolean { return this._mostrarSenha; }
  get mostrarConfirmarSenha(): boolean { return this._mostrarConfirmarSenha; }
  get carregando(): boolean { return this._carregando; }
  get erro(): string | null { return this._erro; }
  get formularioValido(): boolean { return this._dados.eValido(); }
}
