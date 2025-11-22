/**
 * Serviço de Farmácia
 * Gerencia dados da farmácia, produtos e avaliações
 */

console.log('🔥🔥🔥 [ServicoFarmacia.ts] ARQUIVO CARREGADO - VERSÃO NOVA COM LOGS! 🔥🔥🔥');

import { Farmacia, HorarioFuncionamento } from '../tipos/Farmacia';
import { AvaliacaoFarmacia } from '../tipos/AvaliacaoFarmacia';
import { ProdutoFarmacia } from '../tipos/ProdutoFarmacia';
import { buscarFarmaciaPublica, buscarProdutosComOfertas } from '@/src/servicos/publico/publicoService';
import type { FarmaciaPublica } from '@/src/servicos/publico/publicoService';

// Dados mockados
const FARMACIA_MOCKADA = {
  id: 1,
  nome: 'Farmácia Central',
  descricao: 'Sua farmácia de confiança há mais de 20 anos. Melhores preços e atendimento de qualidade.',
  nota: 4.8,
  avaliacoes: 230,
  distancia: '2.5 km',
  tempoEntrega: '30-40 min',
  verificada: true,
  seguidores: 1240,
  produtos: 450,
  vendas: 3500,
  telefone: '(11) 3456-7890',
  endereco: 'Rua das Flores, 123 - Centro, São Paulo - SP',
  horarios: [
    { dia: 'Seg - Sex', horario: '08:00 - 20:00' },
    { dia: 'Sábado', horario: '08:00 - 18:00' },
    { dia: 'Domingo', horario: '08:00 - 14:00' },
  ] as HorarioFuncionamento[],
};

const PRODUTOS_MOCKADOS = [
  {
    id: 1,
    nome: 'Paracetamol 500mg',
    descricao: 'Analgésico e antitérmico',
    preco: 12.90,
    precoAntigo: 18.90,
    nota: 4.7,
    desconto: 32,
    estoque: 45,
    laboratorio: 'EMS',
    principioAtivo: 'Paracetamol',
    tipoReceita: 'NAO_EXIGIDO',
  },
  {
    id: 2,
    nome: 'Vitamina C 1000mg - Suplemento Vitamínico',
    descricao: 'Suplemento vitamínico',
    preco: 24.90,
    precoAntigo: 32.00,
    nota: 4.8,
    desconto: 22,
    estoque: 120,
    laboratorio: 'Farmoquímica',
    principioAtivo: 'Ácido Ascórbico',
    tipoReceita: 'NAO_EXIGIDO',
  },
  {
    id: 3,
    nome: 'Dipirona Sódica 500mg',
    descricao: 'Analgésico e antitérmico',
    preco: 8.90,
    precoAntigo: 15.90,
    nota: 4.6,
    desconto: 44,
    estoque: 8,
    laboratorio: 'Medley',
    principioAtivo: 'Dipirona Sódica',
    tipoReceita: 'NAO_EXIGIDO',
  },
  {
    id: 4,
    nome: 'Ibuprofeno 600mg - Anti-inflamatório',
    descricao: 'Anti-inflamatório',
    preco: 15.90,
    precoAntigo: 22.90,
    nota: 4.7,
    desconto: 31,
    estoque: 0,
    laboratorio: 'Teuto',
    principioAtivo: 'Ibuprofeno',
    tipoReceita: 'RECEITA_BRANCA',
  },
  {
    id: 5,
    nome: 'Rivotril 2mg - Clonazepam',
    descricao: 'Ansiolítico e anticonvulsivante',
    preco: 43.00,
    precoAntigo: 45.00,
    nota: 4.9,
    desconto: 4,
    estoque: 25,
    laboratorio: 'Roche',
    principioAtivo: 'Clonazepam',
    tipoReceita: 'RECEITA_AZUL',
  },
];

const AVALIACOES_MOCKADAS = [
  {
    id: 1,
    usuario: 'João Silva',
    nota: 5,
    comentario: 'Excelente atendimento e produtos de qualidade!',
    data: '2 dias atrás',
    compraVerificada: true,
  },
  {
    id: 2,
    usuario: 'Maria Santos',
    nota: 4,
    comentario: 'Boa variedade de produtos e entrega rápida.',
    data: '1 semana atrás',
    compraVerificada: true,
  },
  {
    id: 3,
    usuario: 'Pedro Oliveira',
    nota: 5,
    comentario: 'Sempre compro aqui, nunca tive problemas.',
    data: '2 semanas atrás',
    compraVerificada: true,
  },
];

export type AbaFarmacia = 'produtos' | 'avaliacoes';

export class ServicoFarmacia {
  private _farmacia: Farmacia | null = null;
  private _produtos: ProdutoFarmacia[] = [];
  private _avaliacoes: AvaliacaoFarmacia[] = [];
  private _seguindo: boolean = false;
  private _abaAtiva: AbaFarmacia = 'produtos';
  private _carregando: boolean = false;
  private _erro: string | null = null;

  constructor() {
    const instanceId = Math.random().toString(36).substring(7);
    console.log(`🔥 [ServicoFarmacia] NOVA INSTÂNCIA CRIADA - ID: ${instanceId} 🔥`);
  }

  /**
   * Carrega dados da farmácia
   */
  public async carregarFarmacia(farmaciaId: number): Promise<Farmacia> {
    console.log('[ServicoFarmacia] 🔴 INÍCIO carregarFarmacia - farmaciaId:', farmaciaId);
    console.log('[ServicoFarmacia] 🔴 Farmácia atual antes de carregar:', this._farmacia?.nome);

    try {
      this._carregando = true;
      this._erro = null;

      console.log('[ServicoFarmacia] Carregando farmácia:', farmaciaId);

      const dadosAPI = await buscarFarmaciaPublica(farmaciaId) as any;

      console.log('[ServicoFarmacia] ⚠️ DADOS COMPLETOS DA API:', dadosAPI);
      console.log('[ServicoFarmacia] nomeFantasia extraído:', dadosAPI.nomeFantasia);
      console.log('[ServicoFarmacia] 📞 Telefone da API:', {
        numeroCelularContato: dadosAPI.numeroCelularContato,
        telefone: dadosAPI.telefone,
        emailContato: dadosAPI.emailContato,
      });

      // Converte para modelo de domínio usando dados reais da API
      // Apenas informações importantes para o cliente
      const dadosParaCriar = {
        id: dadosAPI.id,
        nome: dadosAPI.nomeFantasia || dadosAPI.razaoSocial || 'Farmácia',
        descricao: 'Sua farmácia de confiança. Melhores preços e atendimento de qualidade.',
        nota: 4.8, // TODO: Quando backend implementar avaliações
        avaliacoes: 0, // TODO: Quando backend implementar avaliações
        distancia: '2.5 km', // TODO: Calcular baseado em geolocalização do cliente
        tempoEntrega: '30-40 min', // TODO: Calcular baseado em distância
        verificada: dadosAPI.status === 'ATIVO',
        seguidores: 0, // TODO: Quando backend implementar seguidores
        produtos: 0, // Será atualizado ao carregar produtos
        vendas: 0, // TODO: Quando backend implementar histórico de vendas
        telefone: dadosAPI.numeroCelularContato || '(00) 0000-0000',
        endereco: dadosAPI.enderecoComercial
          ? `${dadosAPI.enderecoComercial.logradouro || ''}, ${dadosAPI.enderecoComercial.numero || ''} - ${dadosAPI.enderecoComercial.bairro || ''}, ${dadosAPI.enderecoComercial.cidade || ''} - ${dadosAPI.enderecoComercial.estado || ''}`
          : 'Endereço não disponível',
        horarios: [
          { dia: 'Seg - Sex', horario: '08:00 - 20:00' },
          { dia: 'Sábado', horario: '08:00 - 18:00' },
          { dia: 'Domingo', horario: 'Fechado' },
        ] as HorarioFuncionamento[], // TODO: Quando backend implementar horários de funcionamento
      };

      console.log('[ServicoFarmacia] 🔍 DADOS ENVIADOS PARA Farmacia.criar():', dadosParaCriar);
      console.log('[ServicoFarmacia] 🔍 Especificamente, nome:', dadosParaCriar.nome);

      this._farmacia = Farmacia.criar(dadosParaCriar);

      console.log('[ServicoFarmacia] Farmácia CRIADA:', this._farmacia);
      console.log('[ServicoFarmacia] Farmácia carregada - nome:', this._farmacia.nome);
      console.log('[ServicoFarmacia] Farmácia carregada - _nome (private):', (this._farmacia as any)._nome);

      return this._farmacia;
    } catch (erro: any) {
      this._erro = erro.message || 'Erro ao carregar farmácia';
      console.error('[ServicoFarmacia] Erro:', this._erro);
      throw new Error(this._erro || 'Erro desconhecido');
    } finally {
      this._carregando = false;
    }
  }

  /**
   * Carrega produtos da farmácia
   * NOVA ABORDAGEM: Busca produtos com ofertas e filtra pela farmácia
   */
  public async carregarProdutos(farmaciaId: number): Promise<ProdutoFarmacia[]> {
    try {
      console.log('[ServicoFarmacia] Carregando produtos da farmácia:', farmaciaId);

      // Busca todos os produtos com suas ofertas
      const produtosComOfertas = await buscarProdutosComOfertas();

      console.log(`[ServicoFarmacia] ${produtosComOfertas.length} produtos com ofertas encontrados`);

      // Filtra apenas as ofertas desta farmácia
      const produtosDaFarmacia = produtosComOfertas
        .map((produto) => {
          // Filtra ofertas desta farmácia
          const ofertasDaFarmacia = produto.ofertas.filter(
            (oferta) => oferta.farmaciaId === farmaciaId
          );

          if (ofertasDaFarmacia.length === 0) return null;

          // Pega a primeira oferta (pode ter múltiplas, mas vamos usar a primeira)
          const oferta = ofertasDaFarmacia[0];

          return {
            produto,
            oferta,
          };
        })
        .filter((item) => item !== null);

      console.log(`[ServicoFarmacia] ${produtosDaFarmacia.length} produtos desta farmácia`);

      // Se não houver produtos, usa dados mockados
      if (produtosDaFarmacia.length === 0) {
        console.log('[ServicoFarmacia] Nenhum produto da API, usando dados mockados');
        this._produtos = PRODUTOS_MOCKADOS.map((p) => ProdutoFarmacia.criar(p));

        if (this._farmacia) {
          this._farmacia = Farmacia.criar({
            ...this._farmacia.paraJSON(),  // Usa paraJSON() ao invés de spread direto!
            produtos: this._produtos.length,
          });
        }

        return this._produtos;
      }

      // Converte para o formato de ProdutoFarmacia
      this._produtos = produtosDaFarmacia.map((item, index) => {
        const { produto, oferta } = item!;

        // Calcula desconto simulado
        const descontoSimulado = index % 3 === 0 ? Math.floor(Math.random() * 40) + 10 : 0;
        const precoAntigoSimulado = descontoSimulado > 0
          ? oferta.preco / (1 - descontoSimulado / 100)
          : undefined;

        console.log(`[ServicoFarmacia] ✓ Produto: ${produto.nome} | Preço: R$ ${oferta.preco} | Estoque: ${oferta.quantidade} | EstoqueId: ${oferta.estoqueId}`);

        return ProdutoFarmacia.criar({
          id: produto.id,
          estoqueId: oferta.estoqueId, // ID real do estoque_lojista
          nome: produto.nome,
          descricao: produto.descricao || undefined,
          preco: oferta.preco,
          precoAntigo: precoAntigoSimulado,
          nota: 4.5,
          desconto: descontoSimulado,
          farmacia: this._farmacia?.nome,
          estoque: oferta.quantidade,
          laboratorio: produto.laboratorio || undefined,
          principioAtivo: produto.principioAtivo || undefined,
          tipoReceita: produto.tipoReceita || undefined,
        });
      });

      // Atualiza contador de produtos na farmácia
      if (this._farmacia) {
        this._farmacia = Farmacia.criar({
          ...this._farmacia.paraJSON(),  // Usa paraJSON() ao invés de spread direto!
          produtos: this._produtos.length,
        });
      }

      console.log('[ServicoFarmacia] ✅ Produtos carregados com sucesso:', this._produtos.length);
      if (this._produtos.length > 0) {
        console.log('[ServicoFarmacia] Exemplo - Primeiro produto:', this._produtos[0].nome, '(ID:', this._produtos[0].id, ')');
      }

      return this._produtos;
    } catch (erro: any) {
      console.error('[ServicoFarmacia] Erro ao carregar produtos:', erro);

      // Em caso de erro, retorna produtos mockados
      console.log('[ServicoFarmacia] Erro ao carregar da API, usando dados mockados');
      this._produtos = PRODUTOS_MOCKADOS.map((p) => ProdutoFarmacia.criar(p));
      return this._produtos;
    }
  }

  /**
   * Carrega avaliações da farmácia
   */
  public async carregarAvaliacoes(farmaciaId: number): Promise<AvaliacaoFarmacia[]> {
    try {
      console.log('[ServicoFarmacia] Carregando avaliações da farmácia:', farmaciaId);

      // TODO: Quando backend implementar:
      // const dados = await apiGet(`/api/farmacias/${farmaciaId}/avaliacoes`);
      // this._avaliacoes = dados.map(a => AvaliacaoFarmacia.deAPI(a));

      // Por enquanto, usa dados mockados
      this._avaliacoes = AVALIACOES_MOCKADAS.map((a) => AvaliacaoFarmacia.criar(a));

      console.log('[ServicoFarmacia] Avaliações carregadas:', this._avaliacoes.length);

      return this._avaliacoes;
    } catch (erro: any) {
      console.error('[ServicoFarmacia] Erro ao carregar avaliações:', erro);
      return [];
    }
  }

  /**
   * Carrega todos os dados
   */
  public async carregarTodosDados(farmaciaId: number): Promise<void> {
    console.log('[ServicoFarmacia] ⭐ carregarTodosDados iniciado para farmaciaId:', farmaciaId);

    try {
      console.log('[ServicoFarmacia] 1️⃣ Chamando carregarFarmacia...');
      await this.carregarFarmacia(farmaciaId);
      console.log('[ServicoFarmacia] ✅ carregarFarmacia concluído');
    } catch (error) {
      console.error('[ServicoFarmacia] ❌ ERRO em carregarFarmacia:', error);
      throw error;
    }

    console.log('[ServicoFarmacia] 2️⃣ Carregando produtos e avaliações em paralelo...');
    await Promise.all([
      this.carregarProdutos(farmaciaId),
      this.carregarAvaliacoes(farmaciaId),
    ]);
    console.log('[ServicoFarmacia] ✅ Todos os dados carregados');
  }

  /**
   * Alterna seguir farmácia
   */
  public alternarSeguir(): boolean {
    this._seguindo = !this._seguindo;

    if (this._farmacia) {
      if (this._seguindo) {
        this._farmacia.incrementarSeguidores();
      } else {
        this._farmacia.decrementarSeguidores();
      }
    }

    console.log('[ServicoFarmacia] Seguindo:', this._seguindo);
    return this._seguindo;
  }

  /**
   * Altera aba ativa
   */
  public alterarAba(aba: AbaFarmacia): void {
    this._abaAtiva = aba;
    console.log('[ServicoFarmacia] Aba alterada:', aba);
  }

  /**
   * Filtra produtos com desconto
   */
  public obterProdutosComDesconto(): ProdutoFarmacia[] {
    return this._produtos.filter((p) => p.temDesconto());
  }

  /**
   * Filtra produtos bem avaliados
   */
  public obterProdutosBemAvaliados(): ProdutoFarmacia[] {
    return this._produtos.filter((p) => p.temBoaNota());
  }

  /**
   * Filtra avaliações positivas
   */
  public obterAvaliacoesPositivas(): AvaliacaoFarmacia[] {
    return this._avaliacoes.filter((a) => a.eNotaAlta());
  }

  /**
   * Filtra avaliações verificadas
   */
  public obterAvaliacoesVerificadas(): AvaliacaoFarmacia[] {
    return this._avaliacoes.filter((a) => a.eCompraVerificada());
  }

  /**
   * Calcula média de notas das avaliações
   */
  public calcularMediaAvaliacoes(): number {
    if (this._avaliacoes.length === 0) return 0;
    const soma = this._avaliacoes.reduce((acc, a) => acc + a.nota, 0);
    return soma / this._avaliacoes.length;
  }

  /**
   * Obtém estatísticas
   */
  public obterEstatisticas() {
    return {
      totalProdutos: this._produtos.length,
      produtosComDesconto: this.obterProdutosComDesconto().length,
      produtosBemAvaliados: this.obterProdutosBemAvaliados().length,
      totalAvaliacoes: this._avaliacoes.length,
      avaliacoesPositivas: this.obterAvaliacoesPositivas().length,
      avaliacoesVerificadas: this.obterAvaliacoesVerificadas().length,
      mediaAvaliacoes: this.calcularMediaAvaliacoes(),
    };
  }

  // Getters
  get farmacia(): Farmacia | null { return this._farmacia; }
  get produtos(): ProdutoFarmacia[] { return this._produtos; }
  get avaliacoes(): AvaliacaoFarmacia[] { return this._avaliacoes; }
  get seguindo(): boolean { return this._seguindo; }
  get abaAtiva(): AbaFarmacia { return this._abaAtiva; }
  get carregando(): boolean { return this._carregando; }
  get erro(): string | null { return this._erro; }
  get temFarmacia(): boolean { return this._farmacia !== null; }
  get temProdutos(): boolean { return this._produtos.length > 0; }
  get temAvaliacoes(): boolean { return this._avaliacoes.length > 0; }
}
