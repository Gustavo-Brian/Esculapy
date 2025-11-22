/**
 * Serviço de Catálogo
 * Gerencia o catálogo completo de produtos
 */

import { ProdutoCatalogo } from '../tipos/ProdutoCatalogo';
import { EstatisticasCatalogo } from '../tipos/EstatisticasCatalogo';

// Dados mockados
const PRODUTOS_MOCKADOS = [
  {
    id: 1,
    nome: 'Paracetamol 500mg',
    vendedor: 'Farmácia Central',
    avaliacao: 4.8,
    preco: 15.9,
    icone: 'medical',
    cor: '#8B5CF6',
  },
  {
    id: 2,
    nome: 'Vitamina C',
    vendedor: 'Drogaria Saúde',
    avaliacao: 4.9,
    preco: 29.99,
    icone: 'fitness',
    cor: '#10B981',
  },
  {
    id: 3,
    nome: 'Protetor Solar FPS 50',
    vendedor: 'Pharma Bem-Estar',
    avaliacao: 4.7,
    preco: 54.5,
    icone: 'sunny',
    cor: '#F59E0B',
  },
  {
    id: 4,
    nome: 'Curativos (10 un)',
    vendedor: 'Farmácia Central',
    avaliacao: 4.6,
    preco: 8.0,
    icone: 'bandage',
    cor: '#3B82F6',
  },
  {
    id: 5,
    nome: 'Ibuprofeno 400mg',
    vendedor: 'Pharma Bem-Estar',
    avaliacao: 4.9,
    preco: 22.3,
    icone: 'medical',
    cor: '#8B5CF6',
  },
  {
    id: 6,
    nome: 'Xarope para Tosse',
    vendedor: 'Drogaria Saúde',
    avaliacao: 4.5,
    preco: 35.0,
    icone: 'water',
    cor: '#10B981',
  },
];

export class ServicoCatalogo {
  private _produtos: ProdutoCatalogo[] = [];
  private _carregando: boolean = false;
  private _erro: string | null = null;

  /**
   * Carrega produtos do catálogo
   */
  public async carregarProdutos(): Promise<ProdutoCatalogo[]> {
    try {
      this._carregando = true;
      this._erro = null;

      console.log('[ServicoCatalogo] Carregando produtos...');

      // TODO: Quando backend implementar:
      // const dados = await apiGet('/api/produtos');
      // this._produtos = dados.map(p => ProdutoCatalogo.deAPI(p));

      // Por enquanto, usa dados mockados
      this._produtos = PRODUTOS_MOCKADOS.map((p) => ProdutoCatalogo.criar(p));

      console.log('[ServicoCatalogo] Produtos carregados:', this._produtos.length);

      return this._produtos;
    } catch (erro: any) {
      this._erro = erro.message || 'Erro ao carregar produtos';
      console.error('[ServicoCatalogo] Erro:', this._erro);
      throw new Error(this._erro);
    } finally {
      this._carregando = false;
    }
  }

  /**
   * Busca produtos por termo
   */
  public buscar(termo: string): ProdutoCatalogo[] {
    if (!termo || termo.trim() === '') {
      return this._produtos;
    }

    return this._produtos.filter((produto) => produto.correspondeABusca(termo));
  }

  /**
   * Filtra produtos bem avaliados
   */
  public obterBemAvaliados(): ProdutoCatalogo[] {
    return this._produtos.filter((p) => p.temBoaAvaliacao());
  }

  /**
   * Filtra produtos com ótima avaliação
   */
  public obterOtimasAvaliacoes(): ProdutoCatalogo[] {
    return this._produtos.filter((p) => p.temOtimaAvaliacao());
  }

  /**
   * Filtra produtos baratos
   */
  public obterBaratos(): ProdutoCatalogo[] {
    return this._produtos.filter((p) => p.eBarato());
  }

  /**
   * Filtra produtos caros
   */
  public obterCaros(): ProdutoCatalogo[] {
    return this._produtos.filter((p) => p.eCaro());
  }

  /**
   * Filtra produtos por vendedor
   */
  public filtrarPorVendedor(nomeVendedor: string): ProdutoCatalogo[] {
    return this._produtos.filter((p) => p.pertenceAVendedor(nomeVendedor));
  }

  /**
   * Obtém produto por ID
   */
  public obterProdutoPorId(id: number): ProdutoCatalogo | undefined {
    return this._produtos.find((p) => p.id === id);
  }

  /**
   * Ordena produtos por preço (menor primeiro)
   */
  public ordenarPorPrecoMenor(): ProdutoCatalogo[] {
    return [...this._produtos].sort((a, b) => a.preco - b.preco);
  }

  /**
   * Ordena produtos por preço (maior primeiro)
   */
  public ordenarPorPrecoMaior(): ProdutoCatalogo[] {
    return [...this._produtos].sort((a, b) => b.preco - a.preco);
  }

  /**
   * Ordena produtos por avaliação (melhor primeiro)
   */
  public ordenarPorAvaliacaoMaior(): ProdutoCatalogo[] {
    return [...this._produtos].sort((a, b) => b.avaliacao - a.avaliacao);
  }

  /**
   * Ordena produtos por nome (A-Z)
   */
  public ordenarPorNome(): ProdutoCatalogo[] {
    return [...this._produtos].sort((a, b) => a.nome.localeCompare(b.nome));
  }

  /**
   * Obtém vendedores únicos
   */
  public obterVendedoresUnicos(): string[] {
    const vendedores = new Set(this._produtos.map((p) => p.vendedor));
    return Array.from(vendedores);
  }

  /**
   * Calcula estatísticas do catálogo
   */
  public calcularEstatisticas(): EstatisticasCatalogo {
    const totalProdutos = this._produtos.length;
    const totalLojas = this.obterVendedoresUnicos().length;

    return new EstatisticasCatalogo({
      totalProdutos,
      totalLojas,
    });
  }

  /**
   * Calcula preço médio
   */
  public calcularPrecoMedio(): number {
    if (this._produtos.length === 0) return 0;
    const soma = this._produtos.reduce((acc, p) => acc + p.preco, 0);
    return soma / this._produtos.length;
  }

  /**
   * Calcula avaliação média
   */
  public calcularAvaliacaoMedia(): number {
    if (this._produtos.length === 0) return 0;
    const soma = this._produtos.reduce((acc, p) => acc + p.avaliacao, 0);
    return soma / this._produtos.length;
  }

  /**
   * Obtém resumo do catálogo
   */
  public obterResumo() {
    const estatisticas = this.calcularEstatisticas();
    return {
      totalProdutos: estatisticas.totalProdutos,
      totalLojas: estatisticas.totalLojas,
      bemAvaliados: this.obterBemAvaliados().length,
      baratos: this.obterBaratos().length,
      precoMedio: this.calcularPrecoMedio(),
      avaliacaoMedia: this.calcularAvaliacaoMedia(),
    };
  }

  // Getters
  get produtos(): ProdutoCatalogo[] { return this._produtos; }
  get carregando(): boolean { return this._carregando; }
  get erro(): string | null { return this._erro; }
  get totalProdutos(): number { return this._produtos.length; }
  get temProdutos(): boolean { return this._produtos.length > 0; }
}
