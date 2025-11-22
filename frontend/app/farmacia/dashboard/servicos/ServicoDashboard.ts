/**
 * Serviço do Dashboard
 * Lógica de negócio centralizada do dashboard da farmácia
 */

import { ServicoEstoque } from './ServicoEstoque';
import { ItemEstoque } from '../tipos/ItemEstoque';
import { EstatisticasEstoque } from '../tipos/EstatisticasEstoque';
import { Alerta } from '../tipos/Alerta';

export interface AcaoRapida {
  id: string;
  titulo: string;
  icone: string;
  cor: string;
  acao: string;
}

export interface DadosVendas {
  mes: string;
  valor: number;
}

export class ServicoDashboard {
  private _servicoEstoque: ServicoEstoque;
  private _alertas: Alerta[] = [];
  private _acoesRapidas: AcaoRapida[] = [];
  private _dadosVendas: DadosVendas[] = [];
  private _carregando: boolean = false;
  private _erro: string | null = null;

  constructor() {
    this._servicoEstoque = new ServicoEstoque();
    this._acoesRapidas = this.gerarAcoesRapidas();
    this._dadosVendas = this.gerarVendasMock(); // Mock temporário até ter endpoint de vendas
  }

  /**
   * Carrega todos os dados do dashboard
   */
  public async carregarDashboard(): Promise<void> {
    try {
      this._carregando = true;
      this._erro = null;

      console.log('[ServicoDashboard] Carregando dados do dashboard...');

      // Carrega estoque e estatísticas em paralelo
      await Promise.all([
        this._servicoEstoque.carregarEstoque(),
        this._servicoEstoque.carregarEstatisticas(),
      ]);

      // Gera alertas baseados no estoque
      this._alertas = this.gerarAlertas(this._servicoEstoque.itens);

      console.log('[ServicoDashboard] Dashboard carregado com sucesso');
      console.log('[ServicoDashboard] Alertas gerados:', this._alertas.length);

    } catch (erro: any) {
      this._erro = erro.message || 'Erro ao carregar dashboard';
      console.error('[ServicoDashboard] Erro:', this._erro);
      throw new Error(this._erro);
    } finally {
      this._carregando = false;
    }
  }

  /**
   * Recarrega apenas o estoque
   */
  public async recarregarEstoque(): Promise<void> {
    await this._servicoEstoque.carregarEstoque();
    await this._servicoEstoque.carregarEstatisticas();
    this._alertas = this.gerarAlertas(this._servicoEstoque.itens);
  }

  /**
   * Gera alertas baseados no estoque
   */
  private gerarAlertas(itens: ItemEstoque[]): Alerta[] {
    const alertas: Alerta[] = [];

    // Alertas de produtos esgotados
    const esgotados = itens.filter((item) => item.estaEsgotado());
    esgotados.forEach((item) => {
      alertas.push(
        Alerta.criarAlertaEsgotado(item.produtoNome, item.produtoId, item.estoqueId)
      );
    });

    // Alertas de estoque baixo
    const baixoEstoque = itens.filter((item) => item.estaComEstoqueBaixo());
    baixoEstoque.forEach((item) => {
      alertas.push(
        Alerta.criarAlertaBaixoEstoque(
          item.produtoNome,
          item.quantidade,
          item.produtoId,
          item.estoqueId
        )
      );
    });

    // Ordena alertas por prioridade (alta -> média -> baixa)
    return alertas.sort((a, b) => {
      const prioridades: Record<string, number> = { alta: 3, media: 2, baixa: 1 };
      return prioridades[b.prioridade] - prioridades[a.prioridade];
    });
  }

  /**
   * Gera ações rápidas do dashboard
   */
  private gerarAcoesRapidas(): AcaoRapida[] {
    return [
      {
        id: 'adicionar',
        titulo: 'Adicionar Produto',
        icone: 'add-circle',
        cor: '#4CAF50',
        acao: 'adicionar',
      },
      {
        id: 'relatorio',
        titulo: 'Gerar Relatório',
        icone: 'document-text',
        cor: '#2196F3',
        acao: 'relatorio',
      },
      {
        id: 'farmaceuticos',
        titulo: 'Farmacêuticos',
        icone: 'people',
        cor: '#FF9800',
        acao: 'farmaceuticos',
      },
      {
        id: 'ajuda',
        titulo: 'Ajuda',
        icone: 'help-circle',
        cor: '#9C27B0',
        acao: 'ajuda',
      },
    ];
  }

  /**
   * Gera dados de vendas mock (temporário)
   */
  private gerarVendasMock(): DadosVendas[] {
    return [
      { mes: 'Jan', valor: 12500 },
      { mes: 'Fev', valor: 15800 },
      { mes: 'Mar', valor: 14200 },
      { mes: 'Abr', valor: 18900 },
      { mes: 'Mai', valor: 16700 },
      { mes: 'Jun', valor: 21500 },
    ];
  }

  /**
   * Filtra itens do estoque por status
   */
  public filtrarEstoquePorStatus(status: 'TODOS' | 'BAIXO' | 'ESGOTADO'): ItemEstoque[] {
    return this._servicoEstoque.filtrarPorStatus(status);
  }

  /**
   * Busca itens do estoque por nome
   */
  public buscarEstoquePorNome(nome: string): ItemEstoque[] {
    return this._servicoEstoque.buscarPorNome(nome);
  }

  /**
   * Adiciona produto ao estoque
   */
  public async adicionarProduto(
    produtoId: number,
    preco: number,
    quantidade: number
  ): Promise<void> {
    await this._servicoEstoque.adicionarProduto(produtoId, preco, quantidade);
    await this.recarregarEstoque();
  }

  /**
   * Atualiza item do estoque
   */
  public async atualizarItem(
    estoqueId: number,
    preco: number,
    quantidade: number
  ): Promise<void> {
    await this._servicoEstoque.atualizarItem(estoqueId, preco, quantidade);
    await this.recarregarEstoque();
  }

  /**
   * Remove item do estoque
   */
  public async removerItem(estoqueId: number): Promise<void> {
    await this._servicoEstoque.removerItem(estoqueId);
    await this.recarregarEstoque();
  }

  /**
   * Obtém alertas críticos (prioridade alta)
   */
  public obterAlertasCriticos(): Alerta[] {
    return this._alertas.filter((alerta) => alerta.eCritico());
  }

  /**
   * Obtém total de alertas críticos
   */
  public obterTotalAlertasCriticos(): number {
    return this.obterAlertasCriticos().length;
  }

  /**
   * Verifica se há alertas críticos
   */
  public temAlertasCriticos(): boolean {
    return this.obterTotalAlertasCriticos() > 0;
  }

  // Getters
  get itensEstoque(): ItemEstoque[] {
    return this._servicoEstoque.itens;
  }

  get estatisticas(): EstatisticasEstoque | null {
    return this._servicoEstoque.estatisticas;
  }

  get alertas(): Alerta[] {
    return this._alertas;
  }

  get acoesRapidas(): AcaoRapida[] {
    return this._acoesRapidas;
  }

  get dadosVendas(): DadosVendas[] {
    return this._dadosVendas;
  }

  get carregando(): boolean {
    return this._carregando || this._servicoEstoque.carregando;
  }

  get erro(): string | null {
    return this._erro || this._servicoEstoque.erro;
  }

  get temDados(): boolean {
    return this._servicoEstoque.temItens;
  }

  get totalItens(): number {
    return this._servicoEstoque.totalItens;
  }
}
