/**
 * Classe MensagemSuporte
 * Representa uma mensagem de suporte enviada pelo usuário
 */

export type StatusMensagem = 'pendente' | 'em_analise' | 'respondida' | 'resolvida';
export type PrioridadeMensagem = 'baixa' | 'normal' | 'alta' | 'urgente';

export class MensagemSuporte {
  private _id: number;
  private _usuarioId: number;
  private _assunto: string;
  private _mensagem: string;
  private _status: StatusMensagem;
  private _prioridade: PrioridadeMensagem;
  private _dataEnvio: Date;
  private _dataResposta?: Date;
  private _resposta?: string;

  constructor(dados: {
    id: number;
    usuarioId: number;
    assunto: string;
    mensagem: string;
    status: StatusMensagem;
    prioridade: PrioridadeMensagem;
    dataEnvio: Date;
    dataResposta?: Date;
    resposta?: string;
  }) {
    this._id = dados.id;
    this._usuarioId = dados.usuarioId;
    this._assunto = dados.assunto;
    this._mensagem = dados.mensagem;
    this._status = dados.status;
    this._prioridade = dados.prioridade;
    this._dataEnvio = dados.dataEnvio;
    this._dataResposta = dados.dataResposta;
    this._resposta = dados.resposta;
  }

  // Getters
  get id(): number { return this._id; }
  get usuarioId(): number { return this._usuarioId; }
  get assunto(): string { return this._assunto; }
  get mensagem(): string { return this._mensagem; }
  get status(): StatusMensagem { return this._status; }
  get prioridade(): PrioridadeMensagem { return this._prioridade; }
  get dataEnvio(): Date { return this._dataEnvio; }
  get dataResposta(): Date | undefined { return this._dataResposta; }
  get resposta(): string | undefined { return this._resposta; }

  /**
   * Verifica se foi respondida
   */
  public foiRespondida(): boolean {
    return this._status === 'respondida' || this._status === 'resolvida';
  }

  /**
   * Verifica se está pendente
   */
  public estaPendente(): boolean {
    return this._status === 'pendente';
  }

  /**
   * Verifica se está em análise
   */
  public estaEmAnalise(): boolean {
    return this._status === 'em_analise';
  }

  /**
   * Verifica se foi resolvida
   */
  public foiResolvida(): boolean {
    return this._status === 'resolvida';
  }

  /**
   * Verifica se tem alta prioridade
   */
  public temAltaPrioridade(): boolean {
    return this._prioridade === 'alta' || this._prioridade === 'urgente';
  }

  /**
   * Verifica se é urgente
   */
  public eUrgente(): boolean {
    return this._prioridade === 'urgente';
  }

  /**
   * Formata data de envio
   */
  public formatarDataEnvio(): string {
    return this._dataEnvio.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  /**
   * Formata data de resposta
   */
  public formatarDataResposta(): string | null {
    if (!this._dataResposta) return null;
    return this._dataResposta.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  /**
   * Calcula tempo de espera (em dias)
   */
  public calcularTempoEspera(): number {
    const agora = new Date();
    const dataReferencia = this._dataResposta || agora;
    const diferencaMs = dataReferencia.getTime() - this._dataEnvio.getTime();
    return Math.floor(diferencaMs / (1000 * 60 * 60 * 24));
  }

  /**
   * Obtém descrição do status
   */
  public obterDescricaoStatus(): string {
    const descricoes: Record<StatusMensagem, string> = {
      pendente: 'Aguardando análise',
      em_analise: 'Em análise pela equipe',
      respondida: 'Respondida',
      resolvida: 'Resolvida',
    };
    return descricoes[this._status];
  }

  /**
   * Obtém cor do status
   */
  public obterCorStatus(): string {
    const cores: Record<StatusMensagem, string> = {
      pendente: '#F59E0B',    // Laranja
      em_analise: '#3B82F6',  // Azul
      respondida: '#10B981',  // Verde
      resolvida: '#6B7280',   // Cinza
    };
    return cores[this._status];
  }

  /**
   * Obtém ícone do status
   */
  public obterIconeStatus(): string {
    const icones: Record<StatusMensagem, string> = {
      pendente: 'time-outline',
      em_analise: 'search-outline',
      respondida: 'checkmark-circle-outline',
      resolvida: 'checkmark-done-outline',
    };
    return icones[this._status];
  }

  /**
   * Obtém descrição da prioridade
   */
  public obterDescricaoPrioridade(): string {
    const descricoes: Record<PrioridadeMensagem, string> = {
      baixa: 'Prioridade Baixa',
      normal: 'Prioridade Normal',
      alta: 'Prioridade Alta',
      urgente: 'Urgente',
    };
    return descricoes[this._prioridade];
  }

  /**
   * Obtém cor da prioridade
   */
  public obterCorPrioridade(): string {
    const cores: Record<PrioridadeMensagem, string> = {
      baixa: '#6B7280',    // Cinza
      normal: '#3B82F6',   // Azul
      alta: '#F59E0B',     // Laranja
      urgente: '#EF4444',  // Vermelho
    };
    return cores[this._prioridade];
  }

  /**
   * Valida se a mensagem tem campos obrigatórios
   */
  public estaValida(): boolean {
    return this._assunto.trim().length >= 5 &&
           this._mensagem.trim().length >= 10;
  }

  /**
   * Obtém resumo da mensagem (primeiros 100 caracteres)
   */
  public obterResumo(): string {
    if (this._mensagem.length <= 100) return this._mensagem;
    return `${this._mensagem.substring(0, 97)}...`;
  }

  /**
   * Converte para JSON
   */
  public paraJSON() {
    return {
      id: this._id,
      usuarioId: this._usuarioId,
      assunto: this._assunto,
      mensagem: this._mensagem,
      status: this._status,
      prioridade: this._prioridade,
      dataEnvio: this._dataEnvio.toISOString(),
      dataResposta: this._dataResposta?.toISOString(),
      resposta: this._resposta,
    };
  }

  /**
   * Cria instância para nova mensagem
   */
  public static nova(dados: {
    usuarioId: number;
    assunto: string;
    mensagem: string;
    prioridade?: PrioridadeMensagem;
  }): MensagemSuporte {
    return new MensagemSuporte({
      id: Date.now(), // ID temporário
      usuarioId: dados.usuarioId,
      assunto: dados.assunto,
      mensagem: dados.mensagem,
      status: 'pendente',
      prioridade: dados.prioridade || 'normal',
      dataEnvio: new Date(),
    });
  }

  /**
   * Cria instância a partir de dados da API
   */
  public static deAPI(dados: any): MensagemSuporte {
    return new MensagemSuporte({
      id: dados.id,
      usuarioId: dados.usuarioId || dados.usuario_id,
      assunto: dados.assunto || dados.subject,
      mensagem: dados.mensagem || dados.message,
      status: dados.status,
      prioridade: dados.prioridade || dados.priority || 'normal',
      dataEnvio: new Date(dados.dataEnvio || dados.data_envio || dados.created_at),
      dataResposta: dados.dataResposta || dados.data_resposta ? new Date(dados.dataResposta || dados.data_resposta) : undefined,
      resposta: dados.resposta || dados.response,
    });
  }

  /**
   * Cria instância a partir de JSON
   */
  public static deJSON(dados: any): MensagemSuporte {
    return new MensagemSuporte({
      ...dados,
      dataEnvio: new Date(dados.dataEnvio),
      dataResposta: dados.dataResposta ? new Date(dados.dataResposta) : undefined,
    });
  }
}
