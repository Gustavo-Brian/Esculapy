/**
 * Serviço de Estoque
 * Gerencia operações de estoque da farmácia
 */

import {
  buscarEstoqueProprio,
  adicionarProdutoEstoque,
  atualizarEstoque,
  removerItemEstoque,
  calcularEstatisticasEstoque,
  buscarProdutosBaixoEstoque,
  buscarProdutosEsgotados,
} from '@/src/servicos/estoque/estoqueService';
import { ItemEstoque } from '../tipos/ItemEstoque';
import { EstatisticasEstoque } from '../tipos/EstatisticasEstoque';

export class ServicoEstoque {
  private _itens: ItemEstoque[] = [];
  private _estatisticas: EstatisticasEstoque | null = null;
  private _carregando: boolean = false;
  private _erro: string | null = null;

  /**
   * Carrega todos os itens do estoque
   */
  public async carregarEstoque(filtroNome: string = ''): Promise<ItemEstoque[]> {
    try {
      this._carregando = true;
      this._erro = null;

      console.log('[ServicoEstoque] Carregando estoque...');

      const dados = await buscarEstoqueProprio(filtroNome);

      // Converte para classes de domínio
      this._itens = dados.map((item) => ItemEstoque.deAPI(item));

      console.log('[ServicoEstoque] Estoque carregado:', this._itens.length, 'itens');

      return this._itens;
    } catch (erro: any) {
      this._erro = erro.message || 'Erro ao carregar estoque';
      console.error('[ServicoEstoque] Erro:', this._erro);
      throw new Error(this._erro);
    } finally {
      this._carregando = false;
    }
  }

  /**
   * Carrega estatísticas do estoque
   */
  public async carregarEstatisticas(): Promise<EstatisticasEstoque> {
    try {
      this._carregando = true;
      this._erro = null;

      console.log('[ServicoEstoque] Calculando estatísticas...');

      const dados = await calcularEstatisticasEstoque();

      // Converte para classe de domínio
      this._estatisticas = EstatisticasEstoque.deAPI(dados);

      console.log('[ServicoEstoque] Estatísticas calculadas:', this._estatisticas.paraJSON());

      return this._estatisticas;
    } catch (erro: any) {
      this._erro = erro.message || 'Erro ao calcular estatísticas';
      console.error('[ServicoEstoque] Erro:', this._erro);
      throw new Error(this._erro);
    } finally {
      this._carregando = false;
    }
  }

  /**
   * Adiciona um produto ao estoque
   */
  public async adicionarProduto(
    produtoId: number,
    preco: number,
    quantidade: number
  ): Promise<void> {
    try {
      this._carregando = true;
      this._erro = null;

      console.log('[ServicoEstoque] Adicionando produto:', { produtoId, preco, quantidade });

      await adicionarProdutoEstoque({ produtoId, preco, quantidade });

      console.log('[ServicoEstoque] Produto adicionado com sucesso');

      // Recarrega o estoque
      await this.carregarEstoque();
    } catch (erro: any) {
      this._erro = erro.message || 'Erro ao adicionar produto';
      console.error('[ServicoEstoque] Erro:', this._erro);
      throw new Error(this._erro);
    } finally {
      this._carregando = false;
    }
  }

  /**
   * Atualiza um item do estoque
   */
  public async atualizarItem(
    estoqueId: number,
    preco: number,
    quantidade: number
  ): Promise<void> {
    try {
      this._carregando = true;
      this._erro = null;

      console.log('[ServicoEstoque] Atualizando item:', { estoqueId, preco, quantidade });

      // Valida dados antes de enviar
      const item = this._itens.find((i) => i.estoqueId === estoqueId);
      if (item) {
        item.atualizarPreco(preco);
        item.atualizarQuantidade(quantidade);
      }

      await atualizarEstoque(estoqueId, { produtoId: 0, preco, quantidade });

      console.log('[ServicoEstoque] Item atualizado com sucesso');

      // Recarrega o estoque
      await this.carregarEstoque();
    } catch (erro: any) {
      this._erro = erro.message || 'Erro ao atualizar item';
      console.error('[ServicoEstoque] Erro:', this._erro);
      throw new Error(this._erro);
    } finally {
      this._carregando = false;
    }
  }

  /**
   * Remove um item do estoque
   */
  public async removerItem(estoqueId: number): Promise<void> {
    try {
      this._carregando = true;
      this._erro = null;

      console.log('[ServicoEstoque] Removendo item:', estoqueId);

      await removerItemEstoque(estoqueId);

      console.log('[ServicoEstoque] Item removido com sucesso');

      // Remove da lista local
      this._itens = this._itens.filter((item) => item.estoqueId !== estoqueId);

      // Recarrega o estoque para sincronizar
      await this.carregarEstoque();
    } catch (erro: any) {
      this._erro = erro.message || 'Erro ao remover item';
      console.error('[ServicoEstoque] Erro:', this._erro);
      throw new Error(this._erro);
    } finally {
      this._carregando = false;
    }
  }

  /**
   * Filtra itens por status do estoque
   */
  public filtrarPorStatus(status: 'TODOS' | 'BAIXO' | 'ESGOTADO'): ItemEstoque[] {
    switch (status) {
      case 'BAIXO':
        return this._itens.filter((item) => item.estaComEstoqueBaixo());
      case 'ESGOTADO':
        return this._itens.filter((item) => item.estaEsgotado());
      case 'TODOS':
      default:
        return this._itens;
    }
  }

  /**
   * Busca itens por nome
   */
  public buscarPorNome(nome: string): ItemEstoque[] {
    if (!nome || nome.trim() === '') {
      return this._itens;
    }

    const nomeLower = nome.toLowerCase();
    return this._itens.filter((item) =>
      (item.produtoNome || '').toLowerCase().includes(nomeLower) ||
      (item.produtoDescricao && item.produtoDescricao.toLowerCase().includes(nomeLower))
    );
  }

  /**
   * Obtém itens com estoque baixo
   */
  public async obterItensBaixoEstoque(): Promise<ItemEstoque[]> {
    const dados = await buscarProdutosBaixoEstoque();
    return dados.map((item) => ItemEstoque.deAPI(item));
  }

  /**
   * Obtém itens esgotados
   */
  public async obterItensEsgotados(): Promise<ItemEstoque[]> {
    const dados = await buscarProdutosEsgotados();
    return dados.map((item) => ItemEstoque.deAPI(item));
  }

  /**
   * Ordena itens por nome
   */
  public ordenarPorNome(crescente: boolean = true): ItemEstoque[] {
    return [...this._itens].sort((a, b) => {
      const nomeA = a.produtoNome || '';
      const nomeB = b.produtoNome || '';
      const comparacao = nomeA.localeCompare(nomeB);
      return crescente ? comparacao : -comparacao;
    });
  }

  /**
   * Ordena itens por quantidade
   */
  public ordenarPorQuantidade(crescente: boolean = true): ItemEstoque[] {
    return [...this._itens].sort((a, b) => {
      return crescente ? a.quantidade - b.quantidade : b.quantidade - a.quantidade;
    });
  }

  /**
   * Ordena itens por valor total
   */
  public ordenarPorValor(crescente: boolean = true): ItemEstoque[] {
    return [...this._itens].sort((a, b) => {
      const valorA = a.calcularValorTotal();
      const valorB = b.calcularValorTotal();
      return crescente ? valorA - valorB : valorB - valorA;
    });
  }

  // Getters
  get itens(): ItemEstoque[] { return this._itens; }
  get estatisticas(): EstatisticasEstoque | null { return this._estatisticas; }
  get carregando(): boolean { return this._carregando; }
  get erro(): string | null { return this._erro; }
  get temItens(): boolean { return this._itens.length > 0; }
  get totalItens(): number { return this._itens.length; }
}
