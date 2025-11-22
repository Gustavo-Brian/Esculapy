/**
 * Classe CanalAtendimento
 * Representa um canal de atendimento ao cliente
 */

export type TipoCanal = 'email' | 'telefone' | 'whatsapp' | 'chat' | 'faq';

export class CanalAtendimento {
  private _id: string;
  private _tipo: TipoCanal;
  private _nome: string;
  private _valor: string;
  private _icone: string;
  private _disponivel: boolean;
  private _horarioAtendimento?: string;

  constructor(dados: {
    id: string;
    tipo: TipoCanal;
    nome: string;
    valor: string;
    icone: string;
    disponivel: boolean;
    horarioAtendimento?: string;
  }) {
    this._id = dados.id;
    this._tipo = dados.tipo;
    this._nome = dados.nome;
    this._valor = dados.valor;
    this._icone = dados.icone;
    this._disponivel = dados.disponivel;
    this._horarioAtendimento = dados.horarioAtendimento;
  }

  // Getters
  get id(): string { return this._id; }
  get tipo(): TipoCanal { return this._tipo; }
  get nome(): string { return this._nome; }
  get valor(): string { return this._valor; }
  get icone(): string { return this._icone; }
  get disponivel(): boolean { return this._disponivel; }
  get horarioAtendimento(): string | undefined { return this._horarioAtendimento; }

  /**
   * Verifica se está disponível
   */
  public estaDisponivel(): boolean {
    return this._disponivel;
  }

  /**
   * Verifica se é canal de email
   */
  public eEmail(): boolean {
    return this._tipo === 'email';
  }

  /**
   * Verifica se é canal de telefone
   */
  public eTelefone(): boolean {
    return this._tipo === 'telefone';
  }

  /**
   * Verifica se é canal de WhatsApp
   */
  public eWhatsApp(): boolean {
    return this._tipo === 'whatsapp';
  }

  /**
   * Verifica se é canal de chat
   */
  public eChat(): boolean {
    return this._tipo === 'chat';
  }

  /**
   * Verifica se é FAQ
   */
  public eFAQ(): boolean {
    return this._tipo === 'faq';
  }

  /**
   * Obtém cor do canal
   */
  public obterCor(): string {
    const cores: Record<TipoCanal, string> = {
      email: '#EF4444',      // Vermelho
      telefone: '#10B981',   // Verde
      whatsapp: '#25D366',   // Verde WhatsApp
      chat: '#3B82F6',       // Azul
      faq: '#F59E0B',        // Laranja
    };
    return cores[this._tipo];
  }

  /**
   * Obtém URL de ação (para links externos)
   */
  public obterURLAcao(): string | null {
    switch (this._tipo) {
      case 'email':
        return `mailto:${this._valor}`;
      case 'telefone':
        return `tel:${this._valor.replace(/\D/g, '')}`;
      case 'whatsapp':
        const numero = this._valor.replace(/\D/g, '');
        return `https://wa.me/55${numero}`;
      case 'chat':
      case 'faq':
        return null; // Navegação interna
      default:
        return null;
    }
  }

  /**
   * Obtém texto de descrição
   */
  public obterDescricao(): string {
    const descricoes: Record<TipoCanal, string> = {
      email: 'Envie um e-mail para nossa equipe',
      telefone: 'Ligue para falar com um atendente',
      whatsapp: 'Converse conosco pelo WhatsApp',
      chat: 'Chat online com nossa equipe',
      faq: 'Perguntas frequentes e respostas',
    };
    return descricoes[this._tipo];
  }

  /**
   * Obtém texto do botão de ação
   */
  public obterTextoAcao(): string {
    const textos: Record<TipoCanal, string> = {
      email: 'Enviar E-mail',
      telefone: 'Ligar Agora',
      whatsapp: 'Abrir WhatsApp',
      chat: 'Iniciar Chat',
      faq: 'Ver Perguntas',
    };
    return textos[this._tipo];
  }

  /**
   * Formata valor para exibição
   */
  public formatarValor(): string {
    switch (this._tipo) {
      case 'telefone':
        // (11) 1234-5678
        const cleaned = this._valor.replace(/\D/g, '');
        if (cleaned.length === 11) {
          return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
        }
        return this._valor;
      case 'whatsapp':
        return this.formatarValor(); // Mesmo formato de telefone
      default:
        return this._valor;
    }
  }

  /**
   * Converte para JSON
   */
  public paraJSON() {
    return {
      id: this._id,
      tipo: this._tipo,
      nome: this._nome,
      valor: this._valor,
      icone: this._icone,
      disponivel: this._disponivel,
      horarioAtendimento: this._horarioAtendimento,
    };
  }

  /**
   * Canais padrão do sistema
   */
  public static obterCanaisPadrao(): CanalAtendimento[] {
    return [
      new CanalAtendimento({
        id: 'email',
        tipo: 'email',
        nome: 'E-mail',
        valor: 'suporte@esculapi.com.br',
        icone: 'mail-outline',
        disponivel: true,
        horarioAtendimento: '24/7',
      }),
      new CanalAtendimento({
        id: 'telefone',
        tipo: 'telefone',
        nome: 'Telefone',
        valor: '(11) 1234-5678',
        icone: 'call-outline',
        disponivel: true,
        horarioAtendimento: 'Seg-Sex: 8h-18h',
      }),
      new CanalAtendimento({
        id: 'whatsapp',
        tipo: 'whatsapp',
        nome: 'WhatsApp',
        valor: '(11) 98765-4321',
        icone: 'logo-whatsapp',
        disponivel: true,
        horarioAtendimento: 'Seg-Sex: 8h-18h',
      }),
      new CanalAtendimento({
        id: 'chat',
        tipo: 'chat',
        nome: 'Chat Online',
        valor: 'chat',
        icone: 'chatbubbles-outline',
        disponivel: false, // Indisponível por enquanto
        horarioAtendimento: 'Em breve',
      }),
      new CanalAtendimento({
        id: 'faq',
        tipo: 'faq',
        nome: 'Perguntas Frequentes',
        valor: '/help',
        icone: 'help-circle-outline',
        disponivel: true,
        horarioAtendimento: '24/7',
      }),
    ];
  }

  /**
   * Cria instância a partir de dados
   */
  public static criar(dados: any): CanalAtendimento {
    return new CanalAtendimento({
      id: dados.id,
      tipo: dados.tipo,
      nome: dados.nome,
      valor: dados.valor,
      icone: dados.icone,
      disponivel: dados.disponivel !== undefined ? dados.disponivel : true,
      horarioAtendimento: dados.horarioAtendimento,
    });
  }
}
