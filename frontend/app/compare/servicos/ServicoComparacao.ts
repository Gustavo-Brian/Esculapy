/**
 * Serviço de Comparação de Preços
 * Gerencia comparação de ofertas entre farmácias
 */

import { ComparacaoProduto } from '../tipos/ComparacaoProduto';
import { OfertaProduto } from '../tipos/OfertaProduto';

// Dados mockados para fallback
const PRODUTO_MOCK = {
  produtoId: 1,
  nome: 'Paracetamol 500mg',
  descricao: '20 comprimidos',
  ofertas: [
    {
      id: 1,
      farmaciaId: 1,
      farmacia: 'Farmácia Central',
      nota: 4.8,
      distancia: '2.5 km',
      preco: 12.9,
      precoAntigo: 18.9,
      economia: 6.0,
      entrega: 'Grátis',
      tempoEntrega: '30-40 min',
      estoque: 15,
      verificada: true,
      melhorPreco: true,
    },
    {
      id: 2,
      farmaciaId: 2,
      farmacia: 'Drogaria Popular',
      nota: 4.6,
      distancia: '3.2 km',
      preco: 14.9,
      economia: 0,
      entrega: 'R$ 5,00',
      tempoEntrega: '35-45 min',
      estoque: 8,
      verificada: true,
      melhorPreco: false,
    },
    {
      id: 3,
      farmaciaId: 3,
      farmacia: 'Farmácia São Paulo',
      nota: 4.9,
      distancia: '1.8 km',
      preco: 15.9,
      economia: 0,
      entrega: 'R$ 3,50',
      tempoEntrega: '25-35 min',
      estoque: 20,
      verificada: true,
      melhorPreco: false,
    },
    {
      id: 4,
      farmaciaId: 4,
      farmacia: 'Drogasil',
      nota: 4.5,
      distancia: '4.5 km',
      preco: 13.9,
      economia: 3.0,
      precoAntigo: 16.9,
      entrega: 'Grátis',
      tempoEntrega: '45-55 min',
      estoque: 12,
      verificada: true,
      melhorPreco: false,
    },
  ],
};

export class ServicoComparacao {
  private _comparacao: ComparacaoProduto;
  private _carregando: boolean = false;
  private _erro: string | null = null;

  constructor() {
    this._comparacao = ComparacaoProduto.vazio();
  }

  /**
   * Carrega comparação de preços para um produto
   */
  public async carregarComparacao(produtoId: number): Promise<ComparacaoProduto> {
    try {
      this._carregando = true;
      this._erro = null;

      console.log('[ServicoComparacao] Carregando comparação para produto:', produtoId);

      // TODO: Quando backend implementar, buscar da API:
      // const dados = await apiGet(`/api/produtos/${produtoId}/comparar`);
      // this._comparacao = ComparacaoProduto.deAPI(dados);

      // Por enquanto, usa dados mockados
      this._comparacao = ComparacaoProduto.criar(PRODUTO_MOCK);

      console.log('[ServicoComparacao] Comparação carregada:', this._comparacao.totalOfertas(), 'ofertas');

      return this._comparacao;
    } catch (erro: any) {
      this._erro = erro.message || 'Erro ao carregar comparação';
      console.error('[ServicoComparacao] Erro:', this._erro);
      throw new Error(this._erro);
    } finally {
      this._carregando = false;
    }
  }

  /**
   * Ordena ofertas por critério
   */
  public ordenarOfertas(criterio: 'preco' | 'avaliacao' | 'proximidade' | 'economia' | 'melhor'): OfertaProduto[] {
    switch (criterio) {
      case 'preco':
        return this._comparacao.ordenarPorMenorPreco();

      case 'avaliacao':
        return this._comparacao.ordenarPorMelhorAvaliacao();

      case 'proximidade':
        return this._comparacao.ordenarPorProximidade();

      case 'economia':
        return this._comparacao.ordenarPorMaiorEconomia();

      case 'melhor':
        return this._comparacao.ordenarPorMelhorCombinacao();

      default:
        return this._comparacao.ofertas;
    }
  }

  /**
   * Filtra ofertas por critério
   */
  public filtrarOfertas(criterio: 'entregaGratis' | 'proximas' | 'avaliacaoAlta' | 'verificadas' | 'comEstoque'): OfertaProduto[] {
    switch (criterio) {
      case 'entregaGratis':
        return this._comparacao.obterOfertasComEntregaGratis();

      case 'proximas':
        return this._comparacao.obterOfertasProximas();

      case 'avaliacaoAlta':
        return this._comparacao.obterOfertasComAvaliacaoAlta();

      case 'verificadas':
        return this._comparacao.obterOfertasVerificadas();

      case 'comEstoque':
        return this._comparacao.obterOfertasComEstoque();

      default:
        return this._comparacao.ofertas;
    }
  }

  /**
   * Obtém melhor oferta
   */
  public obterMelhorOferta(): OfertaProduto | null {
    return this._comparacao.obterMelhorOferta();
  }

  /**
   * Obtém oferta por ID
   */
  public obterOfertaPorId(id: number): OfertaProduto | undefined {
    return this._comparacao.obterOfertaPorId(id);
  }

  /**
   * Obtém estatísticas da comparação
   */
  public obterEstatisticas() {
    return this._comparacao.obterEstatisticas();
  }

  /**
   * Calcula se vale a pena comprar uma oferta específica
   * Retorna análise comparativa
   */
  public analisarOferta(ofertaId: number): {
    valeAPena: boolean;
    motivo: string;
    economia: number;
    diferençaParaMelhor: number;
  } | null {
    const oferta = this.obterOfertaPorId(ofertaId);
    if (!oferta) return null;

    const melhorOferta = this.obterMelhorOferta();
    if (!melhorOferta) return null;

    const diferença = oferta.preco - melhorOferta.preco;
    const valeAPena = diferença <= 2.0; // Diferença aceitável de até R$2

    let motivo = '';
    if (oferta.id === melhorOferta.id) {
      motivo = 'Esta é a melhor oferta!';
    } else if (valeAPena) {
      if (oferta.entregaGratis() && !melhorOferta.entregaGratis()) {
        motivo = 'Entrega grátis compensa a diferença de preço';
      } else if (oferta.estaProxima() && !melhorOferta.estaProxima()) {
        motivo = 'Proximidade compensa a pequena diferença de preço';
      } else if (oferta.temAvaliacaoAlta() && oferta.nota > melhorOferta.nota) {
        motivo = 'Melhor avaliação com preço competitivo';
      } else {
        motivo = 'Diferença de preço aceitável';
      }
    } else {
      motivo = `Você pagará R$ ${diferença.toFixed(2)} a mais que a melhor oferta`;
    }

    return {
      valeAPena,
      motivo,
      economia: oferta.economia,
      diferençaParaMelhor: diferença,
    };
  }

  /**
   * Obtém recomendação de compra
   */
  public obterRecomendacao(): {
    oferta: OfertaProduto;
    motivo: string;
  } | null {
    const melhorCombinacao = this.ordenarOfertas('melhor');

    if (melhorCombinacao.length === 0) return null;

    const oferta = melhorCombinacao[0];
    const motivos: string[] = [];

    if (oferta.eMelhorPreco()) {
      motivos.push('Melhor preço');
    }

    if (oferta.entregaGratis()) {
      motivos.push('Entrega grátis');
    }

    if (oferta.temAvaliacaoAlta()) {
      motivos.push(`Bem avaliada (${oferta.formatarAvaliacao()})`);
    }

    if (oferta.estaProxima()) {
      motivos.push(`Próxima (${oferta.distancia})`);
    }

    if (oferta.temEconomia()) {
      motivos.push(`Economize ${oferta.formatarEconomia()}`);
    }

    const motivo = motivos.length > 0
      ? motivos.join(' • ')
      : 'Melhor combinação de preço, entrega e avaliação';

    return {
      oferta,
      motivo,
    };
  }

  // Getters
  get comparacao(): ComparacaoProduto { return this._comparacao; }
  get carregando(): boolean { return this._carregando; }
  get erro(): string | null { return this._erro; }
  get temOfertas(): boolean { return this._comparacao.temOfertas(); }
  get totalOfertas(): number { return this._comparacao.totalOfertas(); }
  get produtoNome(): string { return this._comparacao.produtoNome; }
  get produtoDescricao(): string { return this._comparacao.produtoDescricao; }
}
