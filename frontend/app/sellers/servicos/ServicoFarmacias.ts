/**
 * Serviço de Farmácias
 * Gerencia lista de farmácias com busca e filtros
 */

import { Farmacia } from '../tipos/Farmacia';
import { FiltroFarmacia, TipoFiltro } from '../tipos/FiltroFarmacia';

// Dados mockados para fallback
const FARMACIAS_MOCKADAS = [
  {
    id: 1,
    nome: 'Farmácia Central',
    avaliacao: 4.8,
    totalAvaliacoes: 312,
    distancia: '2.5 km',
    tempoEntrega: '30-45 min',
    produtos: 450,
    verificada: true,
    icone: 'medical',
    corCapa: 'rgba(59, 130, 246, 0.2)',
    tags: ['Entrega rápida', 'Melhores preços'],
  },
  {
    id: 2,
    nome: 'Drogaria Popular',
    avaliacao: 4.6,
    totalAvaliacoes: 289,
    distancia: '3.2 km',
    tempoEntrega: '40-55 min',
    produtos: 380,
    verificada: true,
    icone: 'fitness',
    corCapa: 'rgba(16, 185, 129, 0.2)',
    tags: ['Entrega rápida'],
  },
  {
    id: 3,
    nome: 'Farmácia São Paulo',
    avaliacao: 4.9,
    totalAvaliacoes: 510,
    distancia: '1.8 km',
    tempoEntrega: 'Fechada',
    produtos: 520,
    verificada: true,
    fechada: true,
    icone: 'storefront',
    corCapa: 'rgba(139, 92, 246, 0.2)',
    tags: ['Melhor avaliada'],
  },
  {
    id: 4,
    nome: 'Drogasil Express',
    avaliacao: 4.7,
    totalAvaliacoes: 423,
    distancia: '4.1 km',
    tempoEntrega: '50-65 min',
    produtos: 610,
    verificada: true,
    icone: 'medkit',
    corCapa: 'rgba(245, 158, 11, 0.2)',
    tags: ['Entrega rápida'],
  },
  {
    id: 5,
    nome: 'Farmácia Preço Bom',
    avaliacao: 4.4,
    totalAvaliacoes: 198,
    distancia: '5.3 km',
    tempoEntrega: '60-75 min',
    produtos: 340,
    verificada: true,
    icone: 'pricetag',
    corCapa: 'rgba(239, 68, 68, 0.2)',
    tags: ['Melhores preços'],
  },
];

export class ServicoFarmacias {
  private _farmacias: Farmacia[];
  private _filtros: FiltroFarmacia[];
  private _carregando: boolean = false;
  private _erro: string | null = null;

  constructor() {
    this._farmacias = [];
    this._filtros = FiltroFarmacia.obterFiltrosPadrao();
  }

  /**
   * Carrega lista de farmácias
   */
  public async carregarFarmacias(): Promise<Farmacia[]> {
    try {
      this._carregando = true;
      this._erro = null;

      console.log('[ServicoFarmacias] Carregando farmácias...');

      // TODO: Quando backend implementar, buscar da API:
      // const dados = await apiGet('/api/farmacias');
      // this._farmacias = dados.map(f => Farmacia.deAPI(f));

      // Por enquanto, usa dados mockados
      this._farmacias = FARMACIAS_MOCKADAS.map((f) => Farmacia.criar(f));

      console.log('[ServicoFarmacias] Farmácias carregadas:', this._farmacias.length);

      return this._farmacias;
    } catch (erro: any) {
      this._erro = erro.message || 'Erro ao carregar farmácias';
      console.error('[ServicoFarmacias] Erro:', this._erro);
      throw new Error(this._erro);
    } finally {
      this._carregando = false;
    }
  }

  /**
   * Busca farmácias por nome
   */
  public buscarPorNome(nome: string): Farmacia[] {
    if (!nome || nome.trim() === '') {
      return this._farmacias;
    }

    const nomeLower = nome.toLowerCase();
    return this._farmacias.filter((farmacia) =>
      farmacia.nome.toLowerCase().includes(nomeLower)
    );
  }

  /**
   * Filtra farmácias abertas
   */
  public filtrarAbertas(): Farmacia[] {
    return this._farmacias.filter((f) => f.estaAberta());
  }

  /**
   * Filtra farmácias fechadas
   */
  public filtrarFechadas(): Farmacia[] {
    return this._farmacias.filter((f) => f.estaFechada());
  }

  /**
   * Filtra farmácias verificadas
   */
  public filtrarVerificadas(): Farmacia[] {
    return this._farmacias.filter((f) => f.eVerificada());
  }

  /**
   * Filtra farmácias próximas (< 3km)
   */
  public filtrarProximas(): Farmacia[] {
    return this._farmacias.filter((f) => f.estaProxima());
  }

  /**
   * Filtra farmácias com entrega rápida
   */
  public filtrarComEntregaRapida(): Farmacia[] {
    return this._farmacias.filter((f) => f.temEntregaRapida());
  }

  /**
   * Filtra farmácias com melhores preços
   */
  public filtrarComMelhoresPrecos(): Farmacia[] {
    return this._farmacias.filter((f) => f.temMelhoresPrecos());
  }

  /**
   * Ordena farmácias por filtro
   */
  public ordenar(tipoFiltro: TipoFiltro, farmacias?: Farmacia[]): Farmacia[] {
    const lista = farmacias || this._farmacias;
    const copiaFarmacias = [...lista];

    switch (tipoFiltro) {
      case 'proximidade':
        return copiaFarmacias.sort((a, b) => a.obterDistanciaKm() - b.obterDistanciaKm());

      case 'avaliacao':
        return copiaFarmacias.sort((a, b) => {
          // Ordena por avaliação (maior primeiro)
          if (b.avaliacao !== a.avaliacao) {
            return b.avaliacao - a.avaliacao;
          }
          // Desempate por total de avaliações
          return b.totalAvaliacoes - a.totalAvaliacoes;
        });

      case 'entrega':
        return copiaFarmacias.sort((a, b) => {
          // Fechadas vão para o final
          if (a.estaFechada() && !b.estaFechada()) return 1;
          if (!a.estaFechada() && b.estaFechada()) return -1;

          // Entrega rápida tem prioridade
          if (a.temEntregaRapida() && !b.temEntregaRapida()) return -1;
          if (!a.temEntregaRapida() && b.temEntregaRapida()) return 1;

          return 0;
        });

      case 'preco':
        return copiaFarmacias.sort((a, b) => {
          // Melhores preços tem prioridade
          if (a.temMelhoresPrecos() && !b.temMelhoresPrecos()) return -1;
          if (!a.temMelhoresPrecos() && b.temMelhoresPrecos()) return 1;

          // Depois ordena por proximidade
          return a.obterDistanciaKm() - b.obterDistanciaKm();
        });

      default:
        return copiaFarmacias;
    }
  }

  /**
   * Busca e ordena farmácias
   */
  public buscarEOrdenar(nome: string, tipoFiltro: TipoFiltro): Farmacia[] {
    const farmaciasFiltradas = this.buscarPorNome(nome);
    return this.ordenar(tipoFiltro, farmaciasFiltradas);
  }

  /**
   * Obtém farmácia por ID
   */
  public obterPorId(id: number): Farmacia | undefined {
    return this._farmacias.find((f) => f.id === id);
  }

  /**
   * Obtém filtro por ID
   */
  public obterFiltroPorId(id: string): FiltroFarmacia | undefined {
    return this._filtros.find((f) => f.id === id);
  }

  /**
   * Obtém estatísticas das farmácias
   */
  public obterEstatisticas() {
    return {
      total: this._farmacias.length,
      abertas: this.filtrarAbertas().length,
      fechadas: this.filtrarFechadas().length,
      verificadas: this.filtrarVerificadas().length,
      proximas: this.filtrarProximas().length,
      entregaRapida: this.filtrarComEntregaRapida().length,
      melhoresPrecos: this.filtrarComMelhoresPrecos().length,
    };
  }

  // Getters
  get farmacias(): Farmacia[] { return this._farmacias; }
  get filtros(): FiltroFarmacia[] { return this._filtros; }
  get carregando(): boolean { return this._carregando; }
  get erro(): string | null { return this._erro; }
  get totalFarmacias(): number { return this._farmacias.length; }
  get temFarmacias(): boolean { return this._farmacias.length > 0; }
  get estaVazio(): boolean { return this._farmacias.length === 0; }
}
