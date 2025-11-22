/**
 * Serviço de Produto
 * Gerencia operações de produto individual
 */

import { getProductDetails } from '@/src/servicos/produtos/produtoService';
import { DetalheProduto } from '../tipos/DetalheProduto';

export class ServicoProduto {
  private _produto: DetalheProduto | null = null;
  private _carregando: boolean = false;
  private _erro: string | null = null;
  private _quantidade: number = 1;
  private _favorito: boolean = false;

  /**
   * Carrega os detalhes do produto
   */
  public async carregarProduto(id: number): Promise<void> {
    try {
      this._carregando = true;
      this._erro = null;

      const dados = await getProductDetails(id);
      this._produto = DetalheProduto.deAPI(dados);

    } catch (erro: any) {
      console.warn('[ServicoProduto] Erro ao carregar da API:', erro);

      // Em desenvolvimento, sempre usa mock quando API falhar
      if (__DEV__) {
        console.log('[ServicoProduto] Usando dados mock para desenvolvimento (erro API)');
        this._produto = this.gerarProdutoMock(id);
      } else {
        this._erro = erro.message || 'Erro ao carregar produto';
        throw erro;
      }
    } finally {
      this._carregando = false;
    }
  }

  /**
   * Gera produto mock para desenvolvimento
   */
  private gerarProdutoMock(id: number): DetalheProduto {
    const produtosMock = [
      {
        id: 1,
        nome: 'Dipirona 500mg',
        preco: 15.90,
        precoPromocional: 12.90,
        descricao: 'Analgésico e antitérmico indicado para dores e febre. Embalagem com 20 comprimidos.',
        categoria: 'Analgésicos',
        estoque: 50,
        farmaciaId: 1,
        farmaciaNome: 'Farmácia Central',
        icone: 'medical',
      },
      {
        id: 2,
        nome: 'Paracetamol 750mg',
        preco: 18.50,
        precoPromocional: null,
        descricao: 'Analgésico e antitérmico de ação rápida. Caixa com 10 comprimidos.',
        categoria: 'Analgésicos',
        estoque: 30,
        farmaciaId: 2,
        farmaciaNome: 'Drogaria São Paulo',
        icone: 'medkit',
      },
      {
        id: 3,
        nome: 'Vitamina C 1g',
        preco: 25.00,
        precoPromocional: 19.90,
        descricao: 'Suplemento vitamínico para reforço do sistema imunológico. 30 comprimidos efervescentes.',
        categoria: 'Vitaminas',
        estoque: 45,
        farmaciaId: 1,
        farmaciaNome: 'Farmácia Central',
        icone: 'nutrition',
      },
    ];

    const produto = produtosMock.find(p => p.id === id) || produtosMock[0];
    return DetalheProduto.deAPI(produto);
  }

  /**
   * Incrementa a quantidade
   */
  public incrementarQuantidade(): void {
    if (this._produto && this._produto.podeAdicionarQuantidade(this._quantidade + 1)) {
      this._quantidade++;
    }
  }

  /**
   * Decrementa a quantidade
   */
  public decrementarQuantidade(): void {
    if (this._quantidade > 1) {
      this._quantidade--;
    }
  }

  /**
   * Define a quantidade
   */
  public definirQuantidade(quantidade: number): void {
    if (quantidade >= 1 && this._produto && this._produto.podeAdicionarQuantidade(quantidade)) {
      this._quantidade = quantidade;
    }
  }

  /**
   * Alterna favorito
   */
  public alternarFavorito(): void {
    this._favorito = !this._favorito;
  }

  /**
   * Calcula o preço total
   */
  public calcularPrecoTotal(): number {
    if (!this._produto) return 0;
    return this._produto.calcularPrecoTotal(this._quantidade);
  }

  /**
   * Formata o preço total
   */
  public formatarPrecoTotal(): string {
    if (!this._produto) return '0,00';
    return this._produto.formatarPrecoTotal(this._quantidade);
  }

  /**
   * Verifica se pode adicionar ao carrinho
   */
  public podeAdicionarAoCarrinho(): boolean {
    return this._produto !== null && this._produto.estaDisponivel();
  }

  // Getters
  get produto(): DetalheProduto | null { return this._produto; }
  get carregando(): boolean { return this._carregando; }
  get erro(): string | null { return this._erro; }
  get quantidade(): number { return this._quantidade; }
  get favorito(): boolean { return this._favorito; }
}
