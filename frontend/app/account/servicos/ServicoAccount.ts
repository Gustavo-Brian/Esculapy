/**
 * Serviço de Account
 * Gerencia perfil do usuário e configurações da conta
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiGet } from '@/src/servicos/api/config';
import { USER_ENDPOINTS } from '@/src/servicos/api/endpoints';
import { PerfilUsuario } from '../tipos/PerfilUsuario';
import { ConfiguracaoConta } from '../tipos/ConfiguracaoConta';

const CHAVE_PERFIL_LOCAL = '@esculapi:perfil_local';
const CHAVE_CONFIGURACOES = '@esculapi:configuracoes';

export class ServicoAccount {
  private _perfil: PerfilUsuario | null = null;
  private _configuracoes: ConfiguracaoConta | null = null;
  private _carregando: boolean = false;
  private _erro: string | null = null;

  /**
   * Carrega perfil do usuário (API + localStorage)
   */
  public async carregarPerfil(): Promise<PerfilUsuario> {
    try {
      this._carregando = true;
      this._erro = null;

      console.log('[ServicoAccount] Carregando perfil do usuário...');

      // 1. Busca dados da API
      const dadosAPI = await apiGet<any>(USER_ENDPOINTS.ME);

      console.log('[ServicoAccount] Dados da API recebidos:', dadosAPI);

      // 2. Busca dados locais (atualizações que o backend não persiste)
      const dadosLocaisStr = await AsyncStorage.getItem(CHAVE_PERFIL_LOCAL);
      const dadosLocais = dadosLocaisStr ? JSON.parse(dadosLocaisStr) : null;

      console.log('[ServicoAccount] Dados locais:', dadosLocais);

      // 3. Mescla dados API + localStorage
      this._perfil = PerfilUsuario.deDadosLocais(dadosAPI, dadosLocais);

      console.log('[ServicoAccount] Perfil carregado:', this._perfil.paraJSON());

      return this._perfil;
    } catch (erro: any) {
      this._erro = erro.message || 'Erro ao carregar perfil';
      console.error('[ServicoAccount] Erro:', this._erro);
      throw new Error(this._erro);
    } finally {
      this._carregando = false;
    }
  }

  /**
   * Carrega configurações da conta (localStorage)
   */
  public async carregarConfiguracoes(): Promise<ConfiguracaoConta> {
    try {
      console.log('[ServicoAccount] Carregando configurações...');

      const configStr = await AsyncStorage.getItem(CHAVE_CONFIGURACOES);

      if (configStr) {
        const dados = JSON.parse(configStr);
        this._configuracoes = ConfiguracaoConta.deJSON(dados);
        console.log('[ServicoAccount] Configurações carregadas:', this._configuracoes.paraJSON());
      } else {
        // Cria configurações padrão
        this._configuracoes = ConfiguracaoConta.padrao();
        console.log('[ServicoAccount] Usando configurações padrão');
        await this.salvarConfiguracoes();
      }

      return this._configuracoes;
    } catch (erro: any) {
      console.error('[ServicoAccount] Erro ao carregar configurações:', erro);
      // Retorna padrão em caso de erro
      this._configuracoes = ConfiguracaoConta.padrao();
      return this._configuracoes;
    }
  }

  /**
   * Atualiza perfil do usuário
   * (Salva localmente enquanto backend não implementa endpoint)
   */
  public async atualizarPerfil(dados: {
    nome?: string;
    telefone?: string;
    fotoPerfil?: string;
  }): Promise<void> {
    try {
      this._carregando = true;
      this._erro = null;

      console.log('[ServicoAccount] Atualizando perfil...', dados);

      if (!this._perfil) {
        throw new Error('Perfil não carregado');
      }

      // Atualiza dados localmente
      this._perfil.atualizarPerfil(dados);

      // Salva no localStorage
      await AsyncStorage.setItem(CHAVE_PERFIL_LOCAL, JSON.stringify(dados));

      console.log('[ServicoAccount] Perfil atualizado com sucesso');

      // TODO: Quando backend implementar, fazer chamada:
      // await apiPut('/api/user/profile', dados);
    } catch (erro: any) {
      this._erro = erro.message || 'Erro ao atualizar perfil';
      console.error('[ServicoAccount] Erro:', this._erro);
      throw new Error(this._erro);
    } finally {
      this._carregando = false;
    }
  }

  /**
   * Altera senha do usuário
   * (Mock enquanto backend não implementa endpoint)
   */
  public async alterarSenha(senhaAtual: string, novaSenha: string): Promise<void> {
    try {
      this._carregando = true;
      this._erro = null;

      console.log('[ServicoAccount] Alterando senha...');

      // Validações
      if (!senhaAtual || senhaAtual.trim().length === 0) {
        throw new Error('Senha atual é obrigatória');
      }

      if (!novaSenha || novaSenha.trim().length === 0) {
        throw new Error('Nova senha é obrigatória');
      }

      if (!this.validarForcaSenha(novaSenha)) {
        throw new Error('Senha muito fraca. Use no mínimo 6 caracteres');
      }

      // Mock: Simula delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      console.log('[ServicoAccount] ⚠️ Mock: Senha alterada (backend não implementado)');

      // TODO: Quando backend implementar, fazer chamada:
      // await apiPut('/api/user/password', {
      //   current_password: senhaAtual,
      //   new_password: novaSenha,
      //   new_password_confirmation: novaSenha,
      // });

      throw new Error('Endpoint de alteração de senha não implementado no backend');
    } catch (erro: any) {
      this._erro = erro.message || 'Erro ao alterar senha';
      console.error('[ServicoAccount] Erro:', this._erro);
      throw new Error(this._erro);
    } finally {
      this._carregando = false;
    }
  }

  /**
   * Valida força da senha
   */
  public validarForcaSenha(senha: string): boolean {
    if (!senha || senha.length < 6) return false;

    // Senha forte: mínimo 8 caracteres, letras e números
    if (senha.length >= 8 && /[a-zA-Z]/.test(senha) && /[0-9]/.test(senha)) {
      return true;
    }

    // Senha média: mínimo 6 caracteres
    if (senha.length >= 6) {
      return true;
    }

    return false;
  }

  /**
   * Atualiza configurações da conta
   */
  public async atualizarConfiguracao(
    tipo: 'notificacao' | 'modoEscuro' | 'idioma',
    valor: any
  ): Promise<void> {
    try {
      if (!this._configuracoes) {
        await this.carregarConfiguracoes();
      }

      console.log('[ServicoAccount] Atualizando configuração:', tipo, valor);

      if (tipo === 'notificacao' && typeof valor === 'object') {
        this._configuracoes!.atualizarNotificacao(valor.chave, valor.ativo);
      } else if (tipo === 'modoEscuro') {
        this._configuracoes!.definirModoEscuro(valor);
      } else if (tipo === 'idioma') {
        this._configuracoes!.definirIdioma(valor);
      }

      await this.salvarConfiguracoes();

      console.log('[ServicoAccount] Configuração atualizada');
    } catch (erro: any) {
      console.error('[ServicoAccount] Erro ao atualizar configuração:', erro);
      throw new Error('Erro ao atualizar configuração');
    }
  }

  /**
   * Salva configurações no localStorage
   */
  private async salvarConfiguracoes(): Promise<void> {
    if (this._configuracoes) {
      await AsyncStorage.setItem(
        CHAVE_CONFIGURACOES,
        JSON.stringify(this._configuracoes.paraJSON())
      );
    }
  }

  /**
   * Remove foto de perfil
   */
  public async removerFotoPerfil(): Promise<void> {
    if (this._perfil) {
      await this.atualizarPerfil({ fotoPerfil: undefined });
    }
  }

  /**
   * Limpa dados locais (logout)
   */
  public async limparDadosLocais(): Promise<void> {
    try {
      console.log('[ServicoAccount] Limpando dados locais...');

      await AsyncStorage.multiRemove([CHAVE_PERFIL_LOCAL, CHAVE_CONFIGURACOES]);

      this._perfil = null;
      this._configuracoes = null;

      console.log('[ServicoAccount] Dados locais limpos');
    } catch (erro: any) {
      console.error('[ServicoAccount] Erro ao limpar dados:', erro);
    }
  }

  // Getters
  get perfil(): PerfilUsuario | null { return this._perfil; }
  get configuracoes(): ConfiguracaoConta | null { return this._configuracoes; }
  get carregando(): boolean { return this._carregando; }
  get erro(): string | null { return this._erro; }
  get temPerfil(): boolean { return this._perfil !== null; }
}
