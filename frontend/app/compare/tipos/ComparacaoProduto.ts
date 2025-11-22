/**
 * Classe ComparacaoProduto
 * Representa um produto com múltiplas ofertas para comparação
 */

import { OfertaProduto } from './OfertaProduto';

export class ComparacaoProduto {
  private _produtoId: number;
  private _produtoNome: string;
  private _produtoDescricao: string;
  private _ofertas: OfertaProduto[];

  constructor(dados: {
    produtoId: number;
    produtoNome: string;
    produtoDescricao: string;
    ofertas: OfertaProduto[];
  }) {
    this._produtoId = dados.produtoId;
    this._produtoNome = dados.produtoNome;
    this._produtoDescricao = dados.produtoDescricao;
    this._ofertas = dados.ofertas || [];
  }

  // Getters
  get produtoId(): number { return this._produtoId; }
  get produtoNome(): string { return this._produtoNome; }
  get produtoDescricao(): string { return this._produtoDescricao; }
  get ofertas(): OfertaProduto[] { return this._ofertas; }

  /**
   * Verifica se tem ofertas
   */
  public temOfertas(): boolean {
    return this._ofertas.length > 0;
  }

  /**
   * Total de ofertas
   */
  public totalOfertas(): number {
    return this._ofertas.length;
  }

  /**
   * Obtém menor preço
   */
  public obterMenorPreco(): number {
    if (this._ofertas.length === 0) return 0;
    return Math.min(...this._ofertas.map((o) => o.preco));
  }

  /**
   * Obtém maior preço
   */
  public obterMaiorPreco(): number {
    if (this._ofertas.length === 0) return 0;
    return Math.max(...this._ofertas.map((o) => o.preco));
  }

  /**
   * Calcula preço médio
   */
  public calcularPrecoMedio(): number {
    if (this._ofertas.length === 0) return 0;
    const soma = this._ofertas.reduce((acc, o) => acc + o.preco, 0);
    return soma / this._ofertas.length;
  }

  /**
   * Calcula economia máxima
   */
  public calcularEconomiaMaxima(): number {
    if (this._ofertas.length === 0) return 0;
    return Math.max(...this._ofertas.map((o) => o.economia));
  }

  /**
   * Calcula diferença de preço (maior - menor)
   */
  public calcularDiferencaPreco(): number {
    return this.obterMaiorPreco() - this.obterMenorPreco();
  }

  /**
   * Formata menor preço
   */
  public formatarMenorPreco(): string {
    return `R$ ${this.obterMenorPreco().toFixed(2).replace('.', ',')}`;
  }

  /**
   * Formata maior preço
   */
  public formatarMaiorPreco(): string {
    return `R$ ${this.obterMaiorPreco().toFixed(2).replace('.', ',')}`;
  }

  /**
   * Formata preço médio
   */
  public formatarPrecoMedio(): string {
    return `R$ ${this.calcularPrecoMedio().toFixed(2).replace('.', ',')}`;
  }

  /**
   * Formata diferença de preço
   */
  public formatarDiferencaPreco(): string {
    return `R$ ${this.calcularDiferencaPreco().toFixed(2).replace('.', ',')}`;
  }

  /**
   * Obtém melhor oferta (menor preço)
   */
  public obterMelhorOferta(): OfertaProduto | null {
    if (this._ofertas.length === 0) return null;
    return this._ofertas.find((o) => o.eMelhorPreco()) ||
           this._ofertas.reduce((melhor, atual) =>
             atual.preco < melhor.preco ? atual : melhor
           );
  }

  /**
   * Obtém ofertas com entrega grátis
   */
  public obterOfertasComEntregaGratis(): OfertaProduto[] {
    return this._ofertas.filter((o) => o.entregaGratis());
  }

  /**
   * Obtém ofertas próximas (< 3km)
   */
  public obterOfertasProximas(): OfertaProduto[] {
    return this._ofertas.filter((o) => o.estaProxima());
  }

  /**
   * Obtém ofertas com avaliação alta
   */
  public obterOfertasComAvaliacaoAlta(): OfertaProduto[] {
    return this._ofertas.filter((o) => o.temAvaliacaoAlta());
  }

  /**
   * Obtém ofertas verificadas
   */
  public obterOfertasVerificadas(): OfertaProduto[] {
    return this._ofertas.filter((o) => o.eVerificada());
  }

  /**
   * Obtém ofertas com estoque
   */
  public obterOfertasComEstoque(): OfertaProduto[] {
    return this._ofertas.filter((o) => o.temEstoque());
  }

  /**
   * Ordena ofertas por menor preço
   */
  public ordenarPorMenorPreco(): OfertaProduto[] {
    return [...this._ofertas].sort((a, b) => a.preco - b.preco);
  }

  /**
   * Ordena ofertas por melhor avaliação
   */
  public ordenarPorMelhorAvaliacao(): OfertaProduto[] {
    return [...this._ofertas].sort((a, b) => b.nota - a.nota);
  }

  /**
   * Ordena ofertas por proximidade
   */
  public ordenarPorProximidade(): OfertaProduto[] {
    return [...this._ofertas].sort((a, b) =>
      a.obterDistanciaKm() - b.obterDistanciaKm()
    );
  }

  /**
   * Ordena ofertas por maior economia
   */
  public ordenarPorMaiorEconomia(): OfertaProduto[] {
    return [...this._ofertas].sort((a, b) => b.economia - a.economia);
  }

  /**
   * Ordena ofertas por pontuação (melhor combinação)
   */
  public ordenarPorMelhorCombinacao(): OfertaProduto[] {
    return [...this._ofertas].sort((a, b) =>
      b.calcularPontuacao() - a.calcularPontuacao()
    );
  }

  /**
   * Obtém estatísticas da comparação
   */
  public obterEstatisticas() {
    return {
      totalOfertas: this.totalOfertas(),
      menorPreco: this.obterMenorPreco(),
      maiorPreco: this.obterMaiorPreco(),
      precoMedio: this.calcularPrecoMedio(),
      economiaMaxima: this.calcularEconomiaMaxima(),
      diferencaPreco: this.calcularDiferencaPreco(),
      ofertasComEntregaGratis: this.obterOfertasComEntregaGratis().length,
      ofertasProximas: this.obterOfertasProximas().length,
      ofertasComAvaliacaoAlta: this.obterOfertasComAvaliacaoAlta().length,
    };
  }

  /**
   * Obtém mensagem de resumo
   */
  public obterMensagemResumo(): string {
    const total = this.totalOfertas();
    const menorPreco = this.formatarMenorPreco();
    const diferenca = this.formatarDiferencaPreco();

    if (total === 0) {
      return 'Nenhuma oferta disponível';
    }

    if (total === 1) {
      return `1 oferta disponível por ${menorPreco}`;
    }

    return `${total} ofertas • Melhor: ${menorPreco} • Diferença: ${diferenca}`;
  }

  /**
   * Obtém oferta por ID
   */
  public obterOfertaPorId(id: number): OfertaProduto | undefined {
    return this._ofertas.find((o) => o.id === id);
  }

  /**
   * Converte para JSON
   */
  public paraJSON() {
    return {
      produtoId: this._produtoId,
      produtoNome: this._produtoNome,
      produtoDescricao: this._produtoDescricao,
      ofertas: this._ofertas.map((o) => o.paraJSON()),
    };
  }

  /**
   * Cria instância a partir de dados mockados
   */
  public static criar(dados: any): ComparacaoProduto {
    return new ComparacaoProduto({
      produtoId: dados.produtoId || dados.id || 1,
      produtoNome: dados.nome || dados.produtoNome,
      produtoDescricao: dados.descricao || dados.produtoDescricao || '',
      ofertas: (dados.ofertas || []).map((o: any) => OfertaProduto.criar(o)),
    });
  }

  /**
   * Cria instância a partir de dados da API
   */
  public static deAPI(dados: any): ComparacaoProduto {
    return new ComparacaoProduto({
      produtoId: dados.produtoId || dados.produto_id,
      produtoNome: dados.produtoNome || dados.produto_nome || dados.nome,
      produtoDescricao: dados.produtoDescricao || dados.produto_descricao || dados.descricao || '',
      ofertas: (dados.ofertas || dados.offers || []).map((o: any) => OfertaProduto.deAPI(o)),
    });
  }

  /**
   * Cria instância vazia
   */
  public static vazio(): ComparacaoProduto {
    return new ComparacaoProduto({
      produtoId: 0,
      produtoNome: '',
      produtoDescricao: '',
      ofertas: [],
    });
  }
}
