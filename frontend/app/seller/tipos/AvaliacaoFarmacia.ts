/**
 * Classe AvaliacaoFarmacia
 * Representa uma avaliação de cliente sobre a farmácia
 */

export class AvaliacaoFarmacia {
  private _id: number;
  private _nomeUsuario: string;
  private _nota: number;
  private _comentario: string;
  private _data: string;
  private _compraVerificada: boolean;

  constructor(dados: {
    id: number;
    nomeUsuario: string;
    nota: number;
    comentario: string;
    data: string;
    compraVerificada: boolean;
  }) {
    this._id = dados.id;
    this._nomeUsuario = dados.nomeUsuario;
    this._nota = dados.nota;
    this._comentario = dados.comentario;
    this._data = dados.data;
    this._compraVerificada = dados.compraVerificada;
  }

  // Getters
  get id(): number { return this._id; }
  get nomeUsuario(): string { return this._nomeUsuario; }
  get nota(): number { return this._nota; }
  get comentario(): string { return this._comentario; }
  get data(): string { return this._data; }
  get compraVerificada(): boolean { return this._compraVerificada; }

  /**
   * Verifica se é compra verificada
   */
  public eCompraVerificada(): boolean {
    return this._compraVerificada;
  }

  /**
   * Verifica se é nota alta (>= 4)
   */
  public eNotaAlta(): boolean {
    return this._nota >= 4;
  }

  /**
   * Verifica se é nota baixa (<= 2)
   */
  public eNotaBaixa(): boolean {
    return this._nota <= 2;
  }

  /**
   * Verifica se tem comentário longo (> 100 caracteres)
   */
  public temComentarioLongo(): boolean {
    return this._comentario.length > 100;
  }

  /**
   * Obtém array de estrelas (1-5)
   */
  public obterEstrelas(): number[] {
    return Array.from({ length: 5 }, (_, i) => i + 1);
  }

  /**
   * Verifica se estrela está preenchida
   */
  public estrelaPeenchida(estrela: number): boolean {
    return estrela <= this._nota;
  }

  /**
   * Obtém cor baseada na nota
   */
  public obterCorNota(): string {
    if (this._nota >= 4) return '#10B981'; // Verde
    if (this._nota >= 3) return '#F59E0B'; // Laranja
    return '#EF4444'; // Vermelho
  }

  /**
   * Formata nota com estrelas
   */
  public formatarNota(): string {
    const estrelas = '⭐'.repeat(this._nota);
    return `${estrelas} (${this._nota})`;
  }

  /**
   * Obtém resumo do comentário (primeiros 100 caracteres)
   */
  public obterResumoComentario(): string {
    if (this._comentario.length <= 100) return this._comentario;
    return `${this._comentario.substring(0, 97)}...`;
  }

  /**
   * Formata a data para exibição (ex: "há 2 dias")
   */
  public obterDataFormatada(): string {
    if (!this._data) return 'Data desconhecida';

    try {
      const dataAvaliacao = new Date(this._data);
      const agora = new Date();
      const diferencaMs = agora.getTime() - dataAvaliacao.getTime();
      const diferencaDias = Math.floor(diferencaMs / (1000 * 60 * 60 * 24));

      if (diferencaDias === 0) return 'Hoje';
      if (diferencaDias === 1) return 'Ontem';
      if (diferencaDias < 7) return `Há ${diferencaDias} dias`;
      if (diferencaDias < 30) {
        const semanas = Math.floor(diferencaDias / 7);
        return `Há ${semanas} ${semanas === 1 ? 'semana' : 'semanas'}`;
      }
      if (diferencaDias < 365) {
        const meses = Math.floor(diferencaDias / 30);
        return `Há ${meses} ${meses === 1 ? 'mês' : 'meses'}`;
      }

      const anos = Math.floor(diferencaDias / 365);
      return `Há ${anos} ${anos === 1 ? 'ano' : 'anos'}`;
    } catch (error) {
      // Se falhar ao parsear a data, retorna a data original
      return this._data;
    }
  }

  /**
   * Converte para JSON
   */
  public paraJSON() {
    return {
      id: this._id,
      nomeUsuario: this._nomeUsuario,
      nota: this._nota,
      comentario: this._comentario,
      data: this._data,
      compraVerificada: this._compraVerificada,
    };
  }

  /**
   * Cria instância a partir de dados
   */
  public static criar(dados: any): AvaliacaoFarmacia {
    return new AvaliacaoFarmacia({
      id: dados.id,
      nomeUsuario: dados.usuario || dados.nomeUsuario || dados.userName || '',
      nota: dados.nota || dados.rating || 0,
      comentario: dados.comentario || dados.comment || '',
      data: dados.data || dados.date || '',
      compraVerificada: dados.compraVerificada ?? dados.verifiedPurchase ?? false,
    });
  }

  /**
   * Cria instância a partir de dados da API
   */
  public static deAPI(dados: any): AvaliacaoFarmacia {
    return new AvaliacaoFarmacia({
      id: dados.id,
      nomeUsuario: dados.nomeUsuario || dados.user_name,
      nota: dados.nota || dados.rating,
      comentario: dados.comentario || dados.comment,
      data: dados.data || dados.created_at,
      compraVerificada: dados.compraVerificada ?? dados.verified_purchase,
    });
  }
}
