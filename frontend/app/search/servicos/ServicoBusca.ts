/**
 * Serviço de Busca
 * Gerencia buscas de produtos e farmácias
 */

import { buscarTudo } from '@/src/servicos/busca/buscaService';
import { ProdutoHome, FarmaciaResponse } from '@/src/servicos/types/api.types';
import { ResultadoBusca } from '../tipos/ResultadoBusca';
import { CategoriaBusca } from '../tipos/CategoriaBusca';

// Dados mockados para fallback
const PRODUTOS_MOCKADOS: ProdutoHome[] = [
  {
    id: 1,
    nome: 'Paracetamol 500mg',
    descricao: 'Analgésico e antitérmico',
    preco: 12.9,
    precoPromocional: 9.9,
    categoria: 'Analgésicos',
    imagem: null,
    emEstoque: true,
    farmaciaId: 1,
    farmaciaNome: 'Farmácia Central',
  },
  {
    id: 2,
    nome: 'Vitamina C 1000mg',
    descricao: 'Suplemento vitamínico',
    preco: 24.9,
    precoPromocional: null,
    categoria: 'Vitaminas',
    imagem: null,
    emEstoque: true,
    farmaciaId: 2,
    farmaciaNome: 'Drogaria Popular',
  },
  {
    id: 3,
    nome: 'Dipirona 500mg',
    descricao: 'Analgésico e antitérmico',
    preco: 8.5,
    precoPromocional: 6.9,
    categoria: 'Analgésicos',
    imagem: null,
    emEstoque: true,
    farmaciaId: 1,
    farmaciaNome: 'Farmácia Central',
  },
  {
    id: 4,
    nome: 'Ibuprofeno 600mg',
    descricao: 'Anti-inflamatório',
    preco: 15.9,
    precoPromocional: null,
    categoria: 'Analgésicos',
    imagem: null,
    emEstoque: true,
    farmaciaId: 2,
    farmaciaNome: 'Drogaria Popular',
  },
  {
    id: 5,
    nome: 'Vitamina D 2000UI',
    descricao: 'Suplemento vitamínico',
    preco: 29.9,
    precoPromocional: 24.9,
    categoria: 'Vitaminas',
    imagem: null,
    emEstoque: true,
    farmaciaId: 1,
    farmaciaNome: 'Farmácia Central',
  },
];

const FARMACIAS_MOCKADAS: FarmaciaResponse[] = [
  {
    id: 1,
    nome: 'Farmácia Central',
    razaoSocial: 'Farmácia Central Ltda',
    cnpj: '12.345.678/0001-90',
    telefone: '(11) 1234-5678',
    email: 'contato@farmaciacentral.com.br',
    endereco: {
      logradouro: 'Rua Principal',
      numero: '123',
      complemento: null,
      bairro: 'Centro',
      cidade: 'São Paulo',
      estado: 'SP',
      cep: '01234-567',
    },
  },
  {
    id: 2,
    nome: 'Drogaria Popular',
    razaoSocial: 'Drogaria Popular S/A',
    cnpj: '98.765.432/0001-10',
    telefone: '(11) 9876-5432',
    email: 'contato@drogariapopular.com.br',
    endereco: {
      logradouro: 'Av. Comercial',
      numero: '456',
      complemento: 'Loja 1',
      bairro: 'Jardim',
      cidade: 'São Paulo',
      estado: 'SP',
      cep: '09876-543',
    },
  },
];

export class ServicoBusca {
  private _resultados: ResultadoBusca;
  private _categorias: CategoriaBusca[];
  private _carregando: boolean = false;
  private _erro: string | null = null;

  constructor() {
    this._resultados = ResultadoBusca.vazio();
    this._categorias = CategoriaBusca.obterCategoriasPadrao();
  }

  /**
   * Busca produtos e farmácias
   */
  public async buscar(termo: string): Promise<ResultadoBusca> {
    try {
      this._carregando = true;
      this._erro = null;

      console.log('[ServicoBusca] Buscando:', termo);

      // Tenta buscar na API
      const dadosAPI = await buscarTudo(termo);

      // Se não houver resultados da API, usa mockados filtrados
      if (dadosAPI.produtos.length === 0 && dadosAPI.farmacias.length === 0) {
        console.log('[ServicoBusca] API sem resultados, usando dados mockados');
        const produtosFiltrados = this.filtrarProdutosMockados(termo);
        const farmaciasFiltradas = this.filtrarFarmaciasMockadas(termo);

        this._resultados = new ResultadoBusca({
          produtos: produtosFiltrados,
          farmacias: farmaciasFiltradas,
          termoBusca: termo,
        });
      } else {
        console.log('[ServicoBusca] Resultados da API:', {
          produtos: dadosAPI.produtos.length,
          farmacias: dadosAPI.farmacias.length,
        });

        this._resultados = ResultadoBusca.deAPI(dadosAPI, termo);
      }

      return this._resultados;
    } catch (erro: any) {
      this._erro = erro.message || 'Erro ao buscar';
      console.error('[ServicoBusca] Erro:', this._erro);

      // Em caso de erro, usa mockados
      console.log('[ServicoBusca] Erro na API, usando dados mockados');
      const produtosFiltrados = this.filtrarProdutosMockados(termo);
      const farmaciasFiltradas = this.filtrarFarmaciasMockadas(termo);

      this._resultados = new ResultadoBusca({
        produtos: produtosFiltrados,
        farmacias: farmaciasFiltradas,
        termoBusca: termo,
      });

      return this._resultados;
    } finally {
      this._carregando = false;
    }
  }

  /**
   * Filtra produtos mockados por termo
   */
  private filtrarProdutosMockados(termo: string): ProdutoHome[] {
    if (!termo || termo.trim() === '') {
      return [];
    }

    const termoLower = termo.toLowerCase();
    return PRODUTOS_MOCKADOS.filter(
      (p) =>
        p.nome.toLowerCase().includes(termoLower) ||
        p.descricao.toLowerCase().includes(termoLower) ||
        p.categoria?.toLowerCase().includes(termoLower)
    );
  }

  /**
   * Filtra farmácias mockadas por termo
   */
  private filtrarFarmaciasMockadas(termo: string): FarmaciaResponse[] {
    if (!termo || termo.trim() === '') {
      return [];
    }

    const termoLower = termo.toLowerCase();
    return FARMACIAS_MOCKADAS.filter((f) =>
      f.nome.toLowerCase().includes(termoLower)
    );
  }

  /**
   * Busca por categoria
   */
  public async buscarPorCategoria(categoriaId: string): Promise<ResultadoBusca> {
    const categoria = this._categorias.find((c) => c.id === categoriaId);

    if (!categoria) {
      throw new Error('Categoria não encontrada');
    }

    console.log('[ServicoBusca] Buscando por categoria:', categoria.nome);

    return this.buscar(categoria.nome);
  }

  /**
   * Limpa resultados da busca
   */
  public limparResultados(): void {
    console.log('[ServicoBusca] Limpando resultados');
    this._resultados = ResultadoBusca.vazio();
    this._erro = null;
  }

  /**
   * Obtém categoria por ID
   */
  public obterCategoria(categoriaId: string): CategoriaBusca | undefined {
    return this._categorias.find((c) => c.id === categoriaId);
  }

  /**
   * Filtra resultados atuais por categoria
   */
  public filtrarPorCategoria(categoria: string): ProdutoHome[] {
    return this._resultados.filtrarProdutosPorCategoria(categoria);
  }

  /**
   * Ordena produtos por menor preço
   */
  public ordenarPorMenorPreco(): ProdutoHome[] {
    return this._resultados.produtosPorMenorPreco();
  }

  /**
   * Ordena produtos por nome
   */
  public ordenarProdutosPorNome(): ProdutoHome[] {
    return this._resultados.produtosPorNome();
  }

  /**
   * Ordena farmácias por nome
   */
  public ordenarFarmaciasPorNome(): FarmaciaResponse[] {
    return this._resultados.farmaciasPorNome();
  }

  /**
   * Obtém produtos em promoção
   */
  public obterProdutosEmPromocao(): ProdutoHome[] {
    return this._resultados.obterProdutosEmPromocao();
  }

  /**
   * Obtém apenas produtos em estoque
   */
  public obterProdutosEmEstoque(): ProdutoHome[] {
    return this._resultados.produtosEmEstoque();
  }

  // Getters
  get resultados(): ResultadoBusca { return this._resultados; }
  get categorias(): CategoriaBusca[] { return this._categorias; }
  get carregando(): boolean { return this._carregando; }
  get erro(): string | null { return this._erro; }
  get temResultados(): boolean { return this._resultados.temResultados(); }
  get totalResultados(): number { return this._resultados.totalResultados(); }
  get totalProdutos(): number { return this._resultados.totalProdutos(); }
  get totalFarmacias(): number { return this._resultados.totalFarmacias(); }
}
