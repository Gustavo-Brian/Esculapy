/**
 * Serviço de Favoritos
 * Gerencia produtos favoritos do usuário
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { ItemFavorito } from '../tipos/ItemFavorito';

const CHAVE_FAVORITOS = '@esculapi:favoritos';

export class ServicoFavoritos {
  private _itens: ItemFavorito[] = [];
  private _carregando: boolean = false;
  private _erro: string | null = null;

  /**
   * Carrega favoritos (localStorage ou API)
   */
  public async carregarFavoritos(): Promise<ItemFavorito[]> {
    try {
      this._carregando = true;
      this._erro = null;

      console.log('[ServicoFavoritos] Carregando favoritos...');

      // Tenta carregar do localStorage
      const favoritosStr = await AsyncStorage.getItem(CHAVE_FAVORITOS);

      if (favoritosStr) {
        const dados = JSON.parse(favoritosStr);
        this._itens = dados.map((item: any) => ItemFavorito.deJSON(item));
        console.log('[ServicoFavoritos] Favoritos carregados do localStorage:', this._itens.length);
      } else {
        this._itens = [];
        console.log('[ServicoFavoritos] Nenhum favorito encontrado');
      }

      // TODO: Quando backend implementar, buscar da API:
      // const dados = await apiGet('/api/favorites');
      // this._itens = dados.map(item => ItemFavorito.deAPI(item));

      return this._itens;
    } catch (erro: any) {
      this._erro = erro.message || 'Erro ao carregar favoritos';
      console.error('[ServicoFavoritos] Erro:', this._erro);
      throw new Error(this._erro);
    } finally {
      this._carregando = false;
    }
  }

  /**
   * Adiciona produto aos favoritos
   */
  public async adicionarFavorito(dados: {
    produtoId: number;
    produtoNome: string;
    produtoDescricao?: string;
    preco: number;
    farmaciaId: number;
    farmaciaNome: string;
    categoria?: string;
    tarja?: 'BRANCA' | 'VERMELHA' | 'AMARELA' | 'PRETA';
    imagemUrl?: string;
  }): Promise<void> {
    try {
      this._carregando = true;
      this._erro = null;

      console.log('[ServicoFavoritos] Adicionando favorito:', dados.produtoNome);

      // Verifica se já está nos favoritos
      const jaExiste = this._itens.some((item) => item.produtoId === dados.produtoId);

      if (jaExiste) {
        throw new Error('Produto já está nos favoritos');
      }

      // Cria novo item favorito
      const novoFavorito = new ItemFavorito({
        id: Date.now(), // ID temporário (backend geraria o real)
        ...dados,
        dataAdicionado: new Date(),
      });

      // Adiciona à lista
      this._itens.unshift(novoFavorito); // Adiciona no início

      // Salva no localStorage
      await this.salvarFavoritos();

      console.log('[ServicoFavoritos] Favorito adicionado com sucesso');

      // TODO: Quando backend implementar:
      // await apiPost('/api/favorites', { produtoId: dados.produtoId });
    } catch (erro: any) {
      this._erro = erro.message || 'Erro ao adicionar favorito';
      console.error('[ServicoFavoritos] Erro:', this._erro);
      throw new Error(this._erro);
    } finally {
      this._carregando = false;
    }
  }

  /**
   * Remove produto dos favoritos
   */
  public async removerFavorito(produtoId: number): Promise<void> {
    try {
      this._carregando = true;
      this._erro = null;

      console.log('[ServicoFavoritos] Removendo favorito:', produtoId);

      // Encontra o item
      const itemIndex = this._itens.findIndex((item) => item.produtoId === produtoId);

      if (itemIndex === -1) {
        throw new Error('Produto não está nos favoritos');
      }

      // Remove da lista
      this._itens.splice(itemIndex, 1);

      // Salva no localStorage
      await this.salvarFavoritos();

      console.log('[ServicoFavoritos] Favorito removido com sucesso');

      // TODO: Quando backend implementar:
      // await apiDelete(`/api/favorites/${produtoId}`);
    } catch (erro: any) {
      this._erro = erro.message || 'Erro ao remover favorito';
      console.error('[ServicoFavoritos] Erro:', this._erro);
      throw new Error(this._erro);
    } finally {
      this._carregando = false;
    }
  }

  /**
   * Verifica se produto está nos favoritos
   */
  public estaNosFavoritos(produtoId: number): boolean {
    return this._itens.some((item) => item.produtoId === produtoId);
  }

  /**
   * Alterna favorito (adiciona se não existe, remove se existe)
   */
  public async alternarFavorito(dados: {
    produtoId: number;
    produtoNome: string;
    produtoDescricao?: string;
    preco: number;
    farmaciaId: number;
    farmaciaNome: string;
    categoria?: string;
    tarja?: 'BRANCA' | 'VERMELHA' | 'AMARELA' | 'PRETA';
    imagemUrl?: string;
  }): Promise<boolean> {
    try {
      const estaNos = this.estaNosFavoritos(dados.produtoId);

      if (estaNos) {
        await this.removerFavorito(dados.produtoId);
        return false; // Removido
      } else {
        await this.adicionarFavorito(dados);
        return true; // Adicionado
      }
    } catch (erro: any) {
      throw erro;
    }
  }

  /**
   * Busca favoritos por nome
   */
  public buscarPorNome(nome: string): ItemFavorito[] {
    if (!nome || nome.trim() === '') {
      return this._itens;
    }

    const nomeLower = nome.toLowerCase();
    return this._itens.filter((item) =>
      item.produtoNome.toLowerCase().includes(nomeLower) ||
      (item.produtoDescricao && item.produtoDescricao.toLowerCase().includes(nomeLower))
    );
  }

  /**
   * Filtra favoritos por categoria
   */
  public filtrarPorCategoria(categoria: string): ItemFavorito[] {
    if (!categoria || categoria === 'todos') {
      return this._itens;
    }

    return this._itens.filter((item) =>
      item.categoria?.toLowerCase() === categoria.toLowerCase()
    );
  }

  /**
   * Ordena favoritos
   */
  public ordenar(criterio: 'nome' | 'preco' | 'data', crescente: boolean = true): ItemFavorito[] {
    const copiaItens = [...this._itens];

    copiaItens.sort((a, b) => {
      let comparacao = 0;

      if (criterio === 'nome') {
        comparacao = a.produtoNome.localeCompare(b.produtoNome);
      } else if (criterio === 'preco') {
        comparacao = a.preco - b.preco;
      } else if (criterio === 'data') {
        comparacao = a.dataAdicionado.getTime() - b.dataAdicionado.getTime();
      }

      return crescente ? comparacao : -comparacao;
    });

    return copiaItens;
  }

  /**
   * Obtém favoritos adicionados recentemente
   */
  public obterRecentes(limite: number = 5): ItemFavorito[] {
    return this._itens
      .filter((item) => item.foiAdicionadoRecentemente())
      .slice(0, limite);
  }

  /**
   * Obtém valor total dos favoritos
   */
  public calcularValorTotal(): number {
    return this._itens.reduce((total, item) => total + item.preco, 0);
  }

  /**
   * Limpa todos os favoritos
   */
  public async limparTodos(): Promise<void> {
    try {
      console.log('[ServicoFavoritos] Limpando todos os favoritos...');

      this._itens = [];
      await AsyncStorage.removeItem(CHAVE_FAVORITOS);

      console.log('[ServicoFavoritos] Favoritos limpos');

      // TODO: Quando backend implementar:
      // await apiDelete('/api/favorites/all');
    } catch (erro: any) {
      console.error('[ServicoFavoritos] Erro ao limpar:', erro);
      throw new Error('Erro ao limpar favoritos');
    }
  }

  /**
   * Salva favoritos no localStorage
   */
  private async salvarFavoritos(): Promise<void> {
    const dados = this._itens.map((item) => item.paraJSON());
    await AsyncStorage.setItem(CHAVE_FAVORITOS, JSON.stringify(dados));
  }

  // Getters
  get itens(): ItemFavorito[] { return this._itens; }
  get carregando(): boolean { return this._carregando; }
  get erro(): string | null { return this._erro; }
  get totalItens(): number { return this._itens.length; }
  get temFavoritos(): boolean { return this._itens.length > 0; }
  get estaVazio(): boolean { return this._itens.length === 0; }
}
