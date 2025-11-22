/**
 * Classe ResultadoBusca
 * Encapsula os resultados de uma busca (produtos + farmácias)
 */

import { ProdutoHome, FarmaciaResponse } from '@/src/servicos/types/api.types';

export class ResultadoBusca {
  private _produtos: ProdutoHome[];
  private _farmacias: FarmaciaResponse[];
  private _termoBusca: string;
  private _timestamp: Date;

  constructor(dados: {
    produtos: ProdutoHome[];
    farmacias: FarmaciaResponse[];
    termoBusca: string;
  }) {
    this._produtos = dados.produtos || [];
    this._farmacias = dados.farmacias || [];
    this._termoBusca = dados.termoBusca;
    this._timestamp = new Date();
  }

  // Getters
  get produtos(): ProdutoHome[] { return this._produtos; }
  get farmacias(): FarmaciaResponse[] { return this._farmacias; }
  get termoBusca(): string { return this._termoBusca; }
  get timestamp(): Date { return this._timestamp; }

  /**
   * Verifica se há resultados
   */
  public temResultados(): boolean {
    return this._produtos.length > 0 || this._farmacias.length > 0;
  }

  /**
   * Verifica se está vazio
   */
  public estaVazio(): boolean {
    return this._produtos.length === 0 && this._farmacias.length === 0;
  }

  /**
   * Total de produtos encontrados
   */
  public totalProdutos(): number {
    return this._produtos.length;
  }

  /**
   * Total de farmácias encontradas
   */
  public totalFarmacias(): number {
    return this._farmacias.length;
  }

  /**
   * Total geral de resultados
   */
  public totalResultados(): number {
    return this._produtos.length + this._farmacias.length;
  }

  /**
   * Obtém produtos em promoção
   */
  public obterProdutosEmPromocao(): ProdutoHome[] {
    return this._produtos.filter((p) => p.precoPromocional !== null && p.precoPromocional !== undefined);
  }

  /**
   * Produtos ordenados por menor preço
   */
  public produtosPorMenorPreco(): ProdutoHome[] {
    return [...this._produtos].sort((a, b) => {
      const precoA = a.precoPromocional || a.preco;
      const precoB = b.precoPromocional || b.preco;
      return precoA - precoB;
    });
  }

  /**
   * Produtos ordenados por nome
   */
  public produtosPorNome(): ProdutoHome[] {
    return [...this._produtos].sort((a, b) => a.nome.localeCompare(b.nome));
  }

  /**
   * Farmácias ordenadas por nome
   */
  public farmaciasPorNome(): FarmaciaResponse[] {
    return [...this._farmacias].sort((a, b) => a.nome.localeCompare(b.nome));
  }

  /**
   * Filtra produtos por categoria
   */
  public filtrarProdutosPorCategoria(categoria: string): ProdutoHome[] {
    if (!categoria || categoria.trim() === '') {
      return this._produtos;
    }

    const categoriaLower = categoria.toLowerCase();
    return this._produtos.filter((p) =>
      p.categoria?.toLowerCase().includes(categoriaLower)
    );
  }

  /**
   * Filtra produtos por disponibilidade em estoque
   */
  public produtosEmEstoque(): ProdutoHome[] {
    return this._produtos.filter((p) => p.emEstoque);
  }

  /**
   * Obtém produtos de uma farmácia específica
   */
  public produtosPorFarmacia(farmaciaId: number): ProdutoHome[] {
    return this._produtos.filter((p) => p.farmaciaId === farmaciaId);
  }

  /**
   * Verifica se o resultado é recente (menos de 5 minutos)
   */
  public eRecente(): boolean {
    const agora = new Date();
    const diferencaMs = agora.getTime() - this._timestamp.getTime();
    const minutos = Math.floor(diferencaMs / (1000 * 60));
    return minutos < 5;
  }

  /**
   * Mensagem de resumo dos resultados
   */
  public obterMensagemResumo(): string {
    const totalProd = this.totalProdutos();
    const totalFarm = this.totalFarmacias();

    if (this.estaVazio()) {
      return `Nenhum resultado encontrado para "${this._termoBusca}"`;
    }

    const partesProdutos = totalProd > 0 ? `${totalProd} produto${totalProd !== 1 ? 's' : ''}` : null;
    const partesFarmacias = totalFarm > 0 ? `${totalFarm} farmácia${totalFarm !== 1 ? 's' : ''}` : null;

    const partes = [partesProdutos, partesFarmacias].filter(Boolean);

    return `Encontrado${partes.length > 1 ? 's' : ''}: ${partes.join(' e ')}`;
  }

  /**
   * Limpa resultados
   */
  public limpar(): void {
    this._produtos = [];
    this._farmacias = [];
    this._termoBusca = '';
    this._timestamp = new Date();
  }

  /**
   * Atualiza resultados
   */
  public atualizar(produtos: ProdutoHome[], farmacias: FarmaciaResponse[]): void {
    this._produtos = produtos;
    this._farmacias = farmacias;
    this._timestamp = new Date();
  }

  /**
   * Converte para JSON
   */
  public paraJSON() {
    return {
      produtos: this._produtos,
      farmacias: this._farmacias,
      termoBusca: this._termoBusca,
      timestamp: this._timestamp.toISOString(),
    };
  }

  /**
   * Cria instância vazia
   */
  public static vazio(): ResultadoBusca {
    return new ResultadoBusca({
      produtos: [],
      farmacias: [],
      termoBusca: '',
    });
  }

  /**
   * Cria instância a partir de dados da API
   */
  public static deAPI(dados: any, termoBusca: string): ResultadoBusca {
    return new ResultadoBusca({
      produtos: dados.produtos || [],
      farmacias: dados.farmacias || [],
      termoBusca,
    });
  }
}
