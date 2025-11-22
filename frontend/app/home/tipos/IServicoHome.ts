/**
 * Interface: IServicoHome
 * Define o contrato para o serviço da Home
 * Facilita criação de mocks para testes unitários
 */

import type { Produto } from './Produto';
import type { Farmacia } from './Farmacia';

export interface IServicoHome {
  /**
   * Lista de produtos carregados
   */
  readonly produtos: Produto[];

  /**
   * Lista de ofertas especiais
   */
  readonly ofertas: Produto[];

  /**
   * Lista de farmácias em destaque
   */
  readonly farmacias: Farmacia[];

  /**
   * Indica se está carregando dados
   */
  readonly carregando: boolean;

  /**
   * Mensagem de erro (se houver)
   */
  readonly erro: string | null;

  /**
   * Carrega dados de produtos e farmácias da API
   * Em caso de erro, carrega dados mock como fallback
   */
  carregarDados(): Promise<void>;

  /**
   * Filtra produtos por categoria
   * @param categoria - Categoria desejada ou 'todos' para ver todos
   * @returns Lista filtrada de produtos
   */
  filtrarPorCategoria(categoria: string): Produto[];

  /**
   * Busca produtos por termo de pesquisa
   * @param termo - Termo a ser buscado no nome/descrição
   * @returns Lista de produtos que correspondem à busca
   */
  buscarProdutos(termo: string): Produto[];

  /**
   * Limpa o estado e recarrega dados
   */
  recarregar(): Promise<void>;
}
