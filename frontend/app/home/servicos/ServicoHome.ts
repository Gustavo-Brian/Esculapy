/**
 * Serviço da Home
 * Camada de Lógica de Negócio (Business Logic Layer)
 *
 * Responsabilidades:
 * - Carregar produtos do catálogo com ofertas de estoque
 * - Carregar farmácias ativas
 * - Buscar melhores ofertas
 * - Fornecer fallback com dados mock
 * - Filtrar e buscar produtos
 * - Gerenciar estado de carregamento e erros
 */

import {
  listarCatalogo,
  listarFarmaciasPublicas,
  buscarProdutosComOfertas,
  buscarMelhoresOfertas,
  type FarmaciaPublica
} from '@/src/servicos/publico/publicoService';
import { Produto } from '../tipos/Produto';
import { Farmacia } from '../tipos/Farmacia';
import type { IServicoHome } from '../tipos/IServicoHome';
import { obterProdutosMock } from '../dados/mockProdutos';
import { obterFarmaciasMock } from '../dados/mockFarmacias';

export class ServicoHome implements IServicoHome {
  private _produtos: Produto[] = [];
  private _ofertas: Produto[] = [];
  private _farmacias: Farmacia[] = [];
  private _melhoresOfertas: Array<{
    produto: any;
    melhorOferta: any;
    economiza: number;
    farmacia: string;
  }> = [];
  private _carregando: boolean = false;
  private _erro: string | null = null;

  /**
   * Carrega todos os dados da tela inicial
   *
   * Usa novos endpoints públicos da API:
   * - GET /api/catalogo (produtos)
   * - GET /api/farmacias (farmácias ativas)
   * - GET /api/estoque/buscar-por-catalogo/{id} (ofertas por produto)
   *
   * Em caso de falha ou dados vazios, carrega dados mock automaticamente.
   *
   * @returns Promise que resolve quando os dados forem carregados
   */
  public async carregarDados(): Promise<void> {
    try {
      this._carregando = true;
      this._erro = null;

      console.log('[ServicoHome] Carregando dados da API pública...');

      // Busca dados em paralelo usando novos endpoints
      const [produtosComOfertas, dadosFarmacias, melhoresOfertas] = await Promise.all([
        buscarProdutosComOfertas().catch((err) => {
          console.warn('[ServicoHome] Erro ao buscar produtos com ofertas:', err);
          return [];
        }),
        listarFarmaciasPublicas().catch((err) => {
          console.warn('[ServicoHome] Erro ao buscar farmácias:', err);
          return [];
        }),
        buscarMelhoresOfertas().catch((err) => {
          console.warn('[ServicoHome] Erro ao buscar melhores ofertas:', err);
          return [];
        }),
      ]);

      // Converte produtos com ofertas para classes de domínio
      this._produtos = produtosComOfertas.map((item) => {
        // Para cada produto do catálogo, cria um Produto com o menor preço das ofertas
        const ofertas = item.ofertas;
        const menorPreco = Math.min(...ofertas.map((o) => o.preco));
        const maiorPreco = Math.max(...ofertas.map((o) => o.preco));

        // Se tem múltiplas ofertas com preços diferentes, considera o maior preço como "original"
        const temPromocao = ofertas.length > 1 && menorPreco < maiorPreco;

        // Pega a primeira farmácia da oferta mais barata
        const ofertaMaisBarata = ofertas.find(o => o.preco === menorPreco) || ofertas[0];

        return new Produto({
          id: item.id,
          nome: item.nome,
          descricao: item.descricao || '',
          preco: temPromocao ? maiorPreco : menorPreco,
          precoPromocional: temPromocao ? menorPreco : null,
          categoria: item.tipoProduto || 'MEDICAMENTO',
          imagem: null,
          emEstoque: ofertas.reduce((sum, o) => sum + (o.quantidade || 0), 0) > 0,
          farmaciaId: ofertaMaisBarata.farmaciaId,
          farmaciaNome: ofertaMaisBarata.farmaciaRazaoSocial,
        });
      });

      // Converte farmácias públicas para classes de domínio
      this._farmacias = dadosFarmacias.map((f) => this.converterFarmaciaPublica(f));

      // Armazena melhores ofertas
      this._melhoresOfertas = melhoresOfertas.slice(0, 10); // Top 10

      // Identifica produtos em oferta (com múltiplas ofertas de preços diferentes)
      this._ofertas = this._produtos.filter((p) => {
        const produtoOriginal = produtosComOfertas.find((po) => po.id === p.id);
        return produtoOriginal && produtoOriginal.ofertas.length > 1;
      });

      console.log('[ServicoHome] Dados carregados:', {
        produtos: this._produtos.length,
        ofertas: this._ofertas.length,
        farmacias: this._farmacias.length,
        melhoresOfertas: this._melhoresOfertas.length,
      });

      // Se não conseguiu dados da API, usa mock
      if (this._produtos.length === 0) {
        console.log('[ServicoHome] Nenhum produto da API, usando mock');
        this._produtos = obterProdutosMock();
        this._ofertas = this._produtos.filter((p) => p.estaEmPromocao());
      }

      if (this._farmacias.length === 0) {
        console.log('[ServicoHome] Nenhuma farmácia da API, usando mock');
        this._farmacias = obterFarmaciasMock();
      }
    } catch (erro: any) {
      console.error('[ServicoHome] Erro crítico ao carregar da API:', erro);
      this._erro = 'Erro ao carregar dados. Usando dados de exemplo.';

      // Usa dados mock em caso de erro crítico
      this._produtos = obterProdutosMock();
      this._ofertas = this._produtos.filter((p) => p.estaEmPromocao());
      this._farmacias = obterFarmaciasMock();
    } finally {
      this._carregando = false;
    }
  }

  /**
   * Converte FarmaciaPublica da API para a classe Farmacia do domínio
   */
  private converterFarmaciaPublica(f: FarmaciaPublica): Farmacia {
    const enderecoCompleto = f.endereco
      ? `${f.endereco.logradouro}, ${f.endereco.numero} - ${f.endereco.bairro}, ${f.endereco.cidade}/${f.endereco.estado}`
      : 'Endereço não disponível';

    return new Farmacia(
      f.id,
      f.nomeFantasia,
      enderecoCompleto,
      0, // distancia - poderia calcular com geolocalização
      '30-45 min', // tempo estimado padrão
      4.5, // avaliação padrão - poderia vir da API futuramente
      f.ativo,
      '08:00',
      '22:00'
    );
  }


  /**
   * Filtra produtos por categoria
   *
   * @param categoria - Nome da categoria a filtrar, ou 'todos' para retornar todos os produtos
   * @returns Array de produtos da categoria especificada
   *
   * @example
   * ```typescript
   * const analgésicos = servico.filtrarPorCategoria('Analgésicos');
   * const todos = servico.filtrarPorCategoria('todos');
   * ```
   */
  public filtrarPorCategoria(categoria: string): Produto[] {
    if (categoria === 'todos') {
      return this._produtos;
    }
    return this._produtos.filter(p =>
      p.categoria.toLowerCase() === categoria.toLowerCase()
    );
  }

  /**
   * Busca produtos por texto no nome ou descrição
   *
   * Busca case-insensitive em nome e descrição do produto.
   *
   * @param texto - Termo de busca
   * @returns Array de produtos que correspondem à busca
   *
   * @example
   * ```typescript
   * const resultados = servico.buscarProdutos('dipirona');
   * const resultados2 = servico.buscarProdutos('analgésico'); // busca na descrição
   * ```
   */
  public buscarProdutos(texto: string): Produto[] {
    const termoBusca = texto.toLowerCase();
    return this._produtos.filter(p =>
      p.nome.toLowerCase().includes(termoBusca) ||
      p.descricao.toLowerCase().includes(termoBusca)
    );
  }

  /**
   * Limpa o estado atual e recarrega todos os dados
   *
   * Útil para implementar pull-to-refresh na interface.
   * Limpa produtos, ofertas, farmácias e erros antes de recarregar.
   *
   * @returns Promise que resolve quando os dados forem recarregados
   *
   * @example
   * ```typescript
   * // Em um pull-to-refresh
   * const onRefresh = async () => {
   *   await servico.recarregar();
   * };
   * ```
   */
  public async recarregar(): Promise<void> {
    this._produtos = [];
    this._ofertas = [];
    this._farmacias = [];
    this._melhoresOfertas = [];
    this._erro = null;
    await this.carregarDados();
  }

  /**
   * Obtém as melhores ofertas (maior economia)
   */
  get melhoresOfertas() {
    return this._melhoresOfertas;
  }

  /**
   * Ordena produtos por preço
   *
   * Considera o preço final (com desconto, se houver).
   * Retorna uma nova array sem modificar a original.
   *
   * @param produtos - Array de produtos a ordenar
   * @param crescente - Se true, ordena do menor ao maior preço. Se false, do maior ao menor.
   * @returns Nova array com produtos ordenados
   *
   * @example
   * ```typescript
   * const produtosBaratos = servico.ordenarPorPreco(produtos, true);
   * const produtosCaros = servico.ordenarPorPreco(produtos, false);
   * ```
   */
  public ordenarPorPreco(produtos: Produto[], crescente: boolean = true): Produto[] {
    return [...produtos].sort((a, b) => {
      const precoA = a.obterPrecoFinal();
      const precoB = b.obterPrecoFinal();
      return crescente ? precoA - precoB : precoB - precoA;
    });
  }

  /**
   * Obtém apenas farmácias abertas no momento
   *
   * @returns Array de farmácias que estão abertas
   *
   * @example
   * ```typescript
   * const abertas = servico.obterFarmaciasAbertas();
   * console.log(`${abertas.length} farmácias abertas agora`);
   * ```
   */
  public obterFarmaciasAbertas(): Farmacia[] {
    return this._farmacias.filter(f => f.aberta);
  }

  /**
   * Obtém apenas farmácias com boa avaliação (4.5+)
   *
   * Utiliza o método `temBoaAvaliacao()` da classe Farmacia.
   *
   * @returns Array de farmácias recomendadas
   *
   * @example
   * ```typescript
   * const recomendadas = servico.obterFarmaciasRecomendadas();
   * ```
   */
  public obterFarmaciasRecomendadas(): Farmacia[] {
    return this._farmacias.filter(f => f.temBoaAvaliacao());
  }

  // Getters

  /** Lista completa de produtos carregados (produtos normais + ofertas) */
  get produtos(): Produto[] { return this._produtos; }

  /** Lista de produtos em promoção */
  get ofertas(): Produto[] { return this._ofertas; }

  /** Lista de farmácias em destaque */
  get farmacias(): Farmacia[] { return this._farmacias; }

  /** Indica se está carregando dados da API */
  get carregando(): boolean { return this._carregando; }

  /** Mensagem de erro, se houver */
  get erro(): string | null { return this._erro; }

  /** Verifica se há dados carregados (produtos ou farmácias) */
  get temDados(): boolean {
    return this._produtos.length > 0 || this._farmacias.length > 0;
  }
}
