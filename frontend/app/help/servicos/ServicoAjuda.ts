/**
 * Serviço de Ajuda (FAQ)
 * Gerencia tópicos de ajuda e perguntas frequentes
 */

import { TopicoAjuda, CategoriaTopico } from '../tipos/TopicoAjuda';
import { CategoriaAjuda } from '../tipos/CategoriaAjuda';

// Dados mockados de tópicos de ajuda
const TOPICOS_MOCKADOS = [
  {
    id: 1,
    titulo: 'Como fazer um pedido',
    descricao: 'Aprenda a fazer pedidos no app',
    categoria: 'pedidos' as CategoriaTopico,
    icone: 'cart-outline',
    conteudo: 'Para fazer um pedido:\n1. Navegue pelo catálogo de produtos\n2. Adicione os produtos ao carrinho\n3. Revise seu carrinho\n4. Escolha a forma de pagamento\n5. Confirme o pedido\n\nVocê receberá uma confirmação por e-mail.',
    tags: ['pedido', 'comprar', 'carrinho'],
    visualizacoes: 245,
    util: 89,
    ordem: 1,
  },
  {
    id: 2,
    titulo: 'Formas de pagamento aceitas',
    descricao: 'Veja as opções de pagamento disponíveis',
    categoria: 'pagamento' as CategoriaTopico,
    icone: 'card-outline',
    conteudo: 'Aceitamos as seguintes formas de pagamento:\n\n- Cartão de crédito (Visa, Mastercard, Elo)\n- Cartão de débito\n- PIX\n- Boleto bancário\n\nTodos os pagamentos são processados com segurança.',
    tags: ['pagamento', 'cartão', 'pix', 'boleto'],
    visualizacoes: 198,
    util: 72,
    ordem: 2,
  },
  {
    id: 3,
    titulo: 'Como rastrear minha entrega',
    descricao: 'Acompanhe seu pedido em tempo real',
    categoria: 'entrega' as CategoriaTopico,
    icone: 'location-outline',
    conteudo: 'Para rastrear sua entrega:\n\n1. Acesse "Meus Pedidos"\n2. Selecione o pedido que deseja rastrear\n3. Clique em "Rastrear Entrega"\n\nVocê verá o status atualizado e a localização do pedido.',
    tags: ['rastreio', 'entrega', 'acompanhar'],
    visualizacoes: 312,
    util: 124,
    ordem: 3,
  },
  {
    id: 4,
    titulo: 'Política de devolução e reembolso',
    descricao: 'Como devolver produtos e solicitar reembolso',
    categoria: 'devolucao' as CategoriaTopico,
    icone: 'return-down-back-outline',
    conteudo: 'Você pode devolver produtos em até 7 dias após o recebimento.\n\nPara solicitar devolução:\n1. Entre em contato com o suporte\n2. Informe o número do pedido\n3. Aguarde autorização\n4. Envie o produto de volta\n\nO reembolso será processado em até 10 dias úteis.',
    tags: ['devolução', 'reembolso', 'trocar'],
    visualizacoes: 156,
    util: 54,
    ordem: 4,
  },
  {
    id: 5,
    titulo: 'Como alterar meus dados cadastrais',
    descricao: 'Atualize suas informações pessoais',
    categoria: 'conta' as CategoriaTopico,
    icone: 'person-outline',
    conteudo: 'Para alterar seus dados:\n\n1. Acesse "Minha Conta"\n2. Clique em "Editar Perfil"\n3. Atualize as informações desejadas\n4. Salve as alterações\n\nSeus dados serão atualizados imediatamente.',
    tags: ['conta', 'perfil', 'dados', 'alterar'],
    visualizacoes: 89,
    util: 32,
    ordem: 5,
  },
  {
    id: 6,
    titulo: 'Como alterar minha senha',
    descricao: 'Mantenha sua conta segura',
    categoria: 'conta' as CategoriaTopico,
    icone: 'lock-closed-outline',
    conteudo: 'Para alterar sua senha:\n\n1. Acesse "Minha Conta"\n2. Clique em "Alterar Senha"\n3. Digite a senha atual\n4. Digite a nova senha\n5. Confirme a nova senha\n6. Salve\n\nA senha deve ter no mínimo 8 caracteres.',
    tags: ['senha', 'segurança', 'alterar'],
    visualizacoes: 67,
    util: 28,
    ordem: 6,
  },
];

export class ServicoAjuda {
  private _topicos: TopicoAjuda[];
  private _categorias: CategoriaAjuda[];
  private _carregando: boolean = false;
  private _erro: string | null = null;

  constructor() {
    this._topicos = [];
    this._categorias = CategoriaAjuda.obterCategoriasPadrao();
  }

  /**
   * Carrega tópicos de ajuda
   */
  public async carregarTopicos(): Promise<TopicoAjuda[]> {
    try {
      this._carregando = true;
      this._erro = null;

      console.log('[ServicoAjuda] Carregando tópicos...');

      // TODO: Quando backend implementar:
      // const dados = await apiGet('/api/ajuda/topicos');
      // this._topicos = dados.map(t => TopicoAjuda.deAPI(t));

      // Por enquanto, usa dados mockados
      this._topicos = TOPICOS_MOCKADOS.map((t) => TopicoAjuda.criar(t));

      // Atualiza total de tópicos por categoria
      this.atualizarTotaisCategorias();

      console.log('[ServicoAjuda] Tópicos carregados:', this._topicos.length);

      return this._topicos;
    } catch (erro: any) {
      this._erro = erro.message || 'Erro ao carregar tópicos';
      console.error('[ServicoAjuda] Erro:', this._erro);
      throw new Error(this._erro);
    } finally {
      this._carregando = false;
    }
  }

  /**
   * Busca tópicos por termo
   */
  public buscar(termo: string): TopicoAjuda[] {
    if (!termo || termo.trim() === '') {
      return this._topicos;
    }

    return this._topicos.filter((topico) => topico.correspondeABusca(termo));
  }

  /**
   * Filtra tópicos por categoria
   */
  public filtrarPorCategoria(categoria: CategoriaTopico): TopicoAjuda[] {
    return this._topicos.filter((topico) => topico.pertenceACategoria(categoria));
  }

  /**
   * Obtém tópicos populares
   */
  public obterTopicosPopulares(): TopicoAjuda[] {
    return this._topicos.filter((t) => t.ePopular());
  }

  /**
   * Obtém tópicos mais úteis
   */
  public obterTopicosMaisUteis(): TopicoAjuda[] {
    return this._topicos.filter((t) => t.eMuitoUtil());
  }

  /**
   * Ordena tópicos por relevância
   */
  public ordenarPorRelevancia(): TopicoAjuda[] {
    return [...this._topicos].sort((a, b) => b.calcularRelevancia() - a.calcularRelevancia());
  }

  /**
   * Ordena tópicos por visualizações
   */
  public ordenarPorVisualizacoes(): TopicoAjuda[] {
    return [...this._topicos].sort((a, b) => b.visualizacoes - a.visualizacoes);
  }

  /**
   * Obtém tópico por ID
   */
  public obterTopicoPorId(id: number): TopicoAjuda | undefined {
    return this._topicos.find((t) => t.id === id);
  }

  /**
   * Obtém categoria por ID
   */
  public obterCategoriaPorId(id: CategoriaTopico): CategoriaAjuda | undefined {
    return this._categorias.find((c) => c.id === id);
  }

  /**
   * Registra visualização de tópico
   */
  public registrarVisualizacao(topicoId: number): void {
    const topico = this.obterTopicoPorId(topicoId);
    if (topico) {
      topico.incrementarVisualizacoes();
      console.log('[ServicoAjuda] Visualização registrada:', topico.titulo);
    }
  }

  /**
   * Registra avaliação útil de tópico
   */
  public registrarUtil(topicoId: number): void {
    const topico = this.obterTopicoPorId(topicoId);
    if (topico) {
      topico.incrementarUtil();
      console.log('[ServicoAjuda] Avaliação útil registrada:', topico.titulo);
    }
  }

  /**
   * Atualiza total de tópicos por categoria
   */
  private atualizarTotaisCategorias(): void {
    this._categorias.forEach((categoria) => {
      const total = this._topicos.filter((t) => t.pertenceACategoria(categoria.id)).length;
      categoria.atualizarTotalTopicos(total);
    });
  }

  /**
   * Obtém estatísticas
   */
  public obterEstatisticas() {
    return {
      totalTopicos: this._topicos.length,
      topicosPopulares: this.obterTopicosPopulares().length,
      topicosMaisUteis: this.obterTopicosMaisUteis().length,
      totalCategorias: this._categorias.filter((c) => c.temTopicos()).length,
    };
  }

  // Getters
  get topicos(): TopicoAjuda[] { return this._topicos; }
  get categorias(): CategoriaAjuda[] { return this._categorias; }
  get carregando(): boolean { return this._carregando; }
  get erro(): string | null { return this._erro; }
  get totalTopicos(): number { return this._topicos.length; }
  get temTopicos(): boolean { return this._topicos.length > 0; }
}
