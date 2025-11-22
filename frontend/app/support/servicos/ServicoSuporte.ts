/**
 * Serviço de Suporte
 * Gerencia mensagens de suporte e canais de atendimento
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { MensagemSuporte, PrioridadeMensagem } from '../tipos/MensagemSuporte';
import { CanalAtendimento } from '../tipos/CanalAtendimento';

const CHAVE_MENSAGENS = '@esculapi:mensagens_suporte';

export class ServicoSuporte {
  private _mensagens: MensagemSuporte[];
  private _canais: CanalAtendimento[];
  private _carregando: boolean = false;
  private _erro: string | null = null;

  constructor() {
    this._mensagens = [];
    this._canais = CanalAtendimento.obterCanaisPadrao();
  }

  /**
   * Carrega mensagens de suporte do usuário
   */
  public async carregarMensagens(usuarioId: number): Promise<MensagemSuporte[]> {
    try {
      this._carregando = true;
      this._erro = null;

      console.log('[ServicoSuporte] Carregando mensagens do usuário:', usuarioId);

      // TODO: Quando backend implementar, buscar da API:
      // const dados = await apiGet(`/api/suporte/mensagens?usuarioId=${usuarioId}`);
      // this._mensagens = dados.map(m => MensagemSuporte.deAPI(m));

      // Por enquanto, carrega do AsyncStorage
      const mensagensStr = await AsyncStorage.getItem(CHAVE_MENSAGENS);

      if (mensagensStr) {
        const dados = JSON.parse(mensagensStr);
        this._mensagens = dados
          .filter((m: any) => m.usuarioId === usuarioId)
          .map((m: any) => MensagemSuporte.deJSON(m));
        console.log('[ServicoSuporte] Mensagens carregadas:', this._mensagens.length);
      } else {
        this._mensagens = [];
        console.log('[ServicoSuporte] Nenhuma mensagem encontrada');
      }

      return this._mensagens;
    } catch (erro: any) {
      this._erro = erro.message || 'Erro ao carregar mensagens';
      console.error('[ServicoSuporte] Erro:', this._erro);
      throw new Error(this._erro);
    } finally {
      this._carregando = false;
    }
  }

  /**
   * Envia nova mensagem de suporte
   */
  public async enviarMensagem(dados: {
    usuarioId: number;
    assunto: string;
    mensagem: string;
    prioridade?: PrioridadeMensagem;
  }): Promise<MensagemSuporte> {
    try {
      this._carregando = true;
      this._erro = null;

      console.log('[ServicoSuporte] Enviando mensagem:', dados.assunto);

      // Cria nova mensagem
      const novaMensagem = MensagemSuporte.nova(dados);

      // Valida mensagem
      if (!novaMensagem.estaValida()) {
        throw new Error('Assunto deve ter no mínimo 5 caracteres e mensagem no mínimo 10 caracteres');
      }

      // Adiciona à lista
      this._mensagens.unshift(novaMensagem);

      // Salva no AsyncStorage
      await this.salvarMensagens();

      console.log('[ServicoSuporte] Mensagem enviada com sucesso');

      // TODO: Quando backend implementar:
      // const resposta = await apiPost('/api/suporte/mensagens', novaMensagem.paraJSON());
      // return MensagemSuporte.deAPI(resposta);

      return novaMensagem;
    } catch (erro: any) {
      this._erro = erro.message || 'Erro ao enviar mensagem';
      console.error('[ServicoSuporte] Erro:', this._erro);
      throw new Error(this._erro);
    } finally {
      this._carregando = false;
    }
  }

  /**
   * Busca mensagens por status
   */
  public filtrarPorStatus(status: 'pendente' | 'em_analise' | 'respondida' | 'resolvida'): MensagemSuporte[] {
    return this._mensagens.filter((m) => m.status === status);
  }

  /**
   * Busca mensagens pendentes
   */
  public obterMensagensPendentes(): MensagemSuporte[] {
    return this.filtrarPorStatus('pendente');
  }

  /**
   * Busca mensagens respondidas
   */
  public obterMensagensRespondidas(): MensagemSuporte[] {
    return this._mensagens.filter((m) => m.foiRespondida());
  }

  /**
   * Busca mensagens com alta prioridade
   */
  public obterMensagensAltaPrioridade(): MensagemSuporte[] {
    return this._mensagens.filter((m) => m.temAltaPrioridade());
  }

  /**
   * Busca mensagens recentes (últimos 30 dias)
   */
  public obterMensagensRecentes(): MensagemSuporte[] {
    const trintaDiasAtras = new Date();
    trintaDiasAtras.setDate(trintaDiasAtras.getDate() - 30);

    return this._mensagens.filter((m) =>
      m.dataEnvio >= trintaDiasAtras
    );
  }

  /**
   * Obtém mensagem por ID
   */
  public obterMensagemPorId(id: number): MensagemSuporte | undefined {
    return this._mensagens.find((m) => m.id === id);
  }

  /**
   * Obtém canal de atendimento por tipo
   */
  public obterCanalPorTipo(tipo: string): CanalAtendimento | undefined {
    return this._canais.find((c) => c.tipo === tipo);
  }

  /**
   * Obtém canais disponíveis
   */
  public obterCanaisDisponiveis(): CanalAtendimento[] {
    return this._canais.filter((c) => c.estaDisponivel());
  }

  /**
   * Obtém estatísticas das mensagens
   */
  public obterEstatisticas() {
    return {
      total: this._mensagens.length,
      pendentes: this.obterMensagensPendentes().length,
      respondidas: this.obterMensagensRespondidas().length,
      altaPrioridade: this.obterMensagensAltaPrioridade().length,
      recentes: this.obterMensagensRecentes().length,
    };
  }

  /**
   * Valida campos antes de enviar
   */
  public validarCampos(assunto: string, mensagem: string): {
    valido: boolean;
    erros: string[];
  } {
    const erros: string[] = [];

    if (!assunto || assunto.trim().length === 0) {
      erros.push('Assunto é obrigatório');
    } else if (assunto.trim().length < 5) {
      erros.push('Assunto deve ter no mínimo 5 caracteres');
    }

    if (!mensagem || mensagem.trim().length === 0) {
      erros.push('Mensagem é obrigatória');
    } else if (mensagem.trim().length < 10) {
      erros.push('Mensagem deve ter no mínimo 10 caracteres');
    }

    return {
      valido: erros.length === 0,
      erros,
    };
  }

  /**
   * Limpa histórico de mensagens
   */
  public async limparHistorico(): Promise<void> {
    try {
      console.log('[ServicoSuporte] Limpando histórico...');
      this._mensagens = [];
      await AsyncStorage.removeItem(CHAVE_MENSAGENS);
      console.log('[ServicoSuporte] Histórico limpo');
    } catch (erro: any) {
      console.error('[ServicoSuporte] Erro ao limpar histórico:', erro);
      throw new Error('Erro ao limpar histórico');
    }
  }

  /**
   * Salva mensagens no AsyncStorage
   */
  private async salvarMensagens(): Promise<void> {
    const dados = this._mensagens.map((m) => m.paraJSON());
    await AsyncStorage.setItem(CHAVE_MENSAGENS, JSON.stringify(dados));
  }

  // Getters
  get mensagens(): MensagemSuporte[] { return this._mensagens; }
  get canais(): CanalAtendimento[] { return this._canais; }
  get carregando(): boolean { return this._carregando; }
  get erro(): string | null { return this._erro; }
  get totalMensagens(): number { return this._mensagens.length; }
  get temMensagens(): boolean { return this._mensagens.length > 0; }
  get canaisDisponiveis(): CanalAtendimento[] { return this.obterCanaisDisponiveis(); }
}
