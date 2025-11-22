/**
 * Serviço de Carrinho
 * Gerencia operações do carrinho de compras com AsyncStorage
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { ItemCarrinho } from '../tipos/ItemCarrinho';

const STORAGE_KEY = '@esculapi:carrinho';
const CUPOM_KEY = '@esculapi:cupom';

export class ServicoCarrinho {
  private _itens: ItemCarrinho[] = [];
  private _cupomAplicado: string | null = null;
  private _descontoCupom: number = 0;

  constructor() {
    // Carregar carrinho do AsyncStorage será feito via método assíncrono
  }

  /**
   * Carrega o carrinho do AsyncStorage
   */
  public async carregarCarrinho(): Promise<void> {
    try {
      const [itensJSON, cupomJSON] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEY),
        AsyncStorage.getItem(CUPOM_KEY),
      ]);

      if (itensJSON) {
        const itensSalvos = JSON.parse(itensJSON);
        this._itens = itensSalvos.map((item: any) => ItemCarrinho.criar(item));
        console.log('[ServicoCarrinho] Carrinho carregado:', this._itens.length, 'itens');
      }

      if (cupomJSON) {
        const cupomSalvo = JSON.parse(cupomJSON);
        this._cupomAplicado = cupomSalvo.codigo;
        this._descontoCupom = cupomSalvo.desconto;
        console.log('[ServicoCarrinho] Cupom carregado:', this._cupomAplicado);
      }
    } catch (error) {
      console.error('[ServicoCarrinho] Erro ao carregar carrinho:', error);
      this._itens = [];
    }
  }

  /**
   * Salva o carrinho no AsyncStorage
   */
  private async salvarCarrinho(): Promise<void> {
    try {
      const itensJSON = JSON.stringify(this._itens.map(item => item.toJSON()));
      await AsyncStorage.setItem(STORAGE_KEY, itensJSON);
      console.log('[ServicoCarrinho] Carrinho salvo:', this._itens.length, 'itens');
    } catch (error) {
      console.error('[ServicoCarrinho] Erro ao salvar carrinho:', error);
    }
  }

  /**
   * Salva o cupom no AsyncStorage
   */
  private async salvarCupom(): Promise<void> {
    try {
      if (this._cupomAplicado) {
        const cupomJSON = JSON.stringify({
          codigo: this._cupomAplicado,
          desconto: this._descontoCupom,
        });
        await AsyncStorage.setItem(CUPOM_KEY, cupomJSON);
      } else {
        await AsyncStorage.removeItem(CUPOM_KEY);
      }
    } catch (error) {
      console.error('[ServicoCarrinho] Erro ao salvar cupom:', error);
    }
  }

  /**
   * Adiciona item ao carrinho
   */
  public async adicionarItem(item: ItemCarrinho): Promise<void> {
    // Verifica se o estoque já existe no carrinho (mesmo estoqueId)
    const itemExistente = this._itens.find(i => i.estoqueId === item.estoqueId);

    if (itemExistente) {
      itemExistente.incrementar();
      console.log('[ServicoCarrinho] Quantidade incrementada:', itemExistente.nome);
    } else {
      this._itens.push(item);
      console.log('[ServicoCarrinho] Item adicionado:', item.nome);
    }

    await this.salvarCarrinho();
  }

  /**
   * Remove item do carrinho
   */
  public async removerItem(itemId: number): Promise<void> {
    this._itens = this._itens.filter(item => item.id !== itemId);
    await this.salvarCarrinho();
  }

  /**
   * Incrementa quantidade de um item
   */
  public async incrementarQuantidade(itemId: number): Promise<void> {
    const item = this._itens.find(i => i.id === itemId);
    if (item) {
      item.incrementar();
      await this.salvarCarrinho();
    }
  }

  /**
   * Decrementa quantidade de um item
   */
  public async decrementarQuantidade(itemId: number): Promise<void> {
    const item = this._itens.find(i => i.id === itemId);
    if (item) {
      item.decrementar();
      await this.salvarCarrinho();
    }
  }

  /**
   * Aplica cupom de desconto
   */
  public async aplicarCupom(codigoCupom: string): Promise<boolean> {
    // Simular validação de cupom
    const cuponsValidos: Record<string, number> = {
      'DESC10': 10,
      'DESC20': 20,
      'PRIMEIRA': 15,
      'BEMVINDO': 25,
    };

    const desconto = cuponsValidos[codigoCupom.toUpperCase()];

    if (desconto) {
      this._cupomAplicado = codigoCupom.toUpperCase();
      this._descontoCupom = desconto;
      await this.salvarCupom();
      return true;
    }

    return false;
  }

  /**
   * Remove cupom aplicado
   */
  public async removerCupom(): Promise<void> {
    this._cupomAplicado = null;
    this._descontoCupom = 0;
    await this.salvarCupom();
  }

  /**
   * Calcula subtotal (soma dos itens)
   */
  public calcularSubtotal(): number {
    return this._itens.reduce((total, item) => total + item.calcularSubtotal(), 0);
  }

  /**
   * Calcula valor do desconto
   */
  public calcularDesconto(): number {
    if (this._descontoCupom === 0) return 0;
    return (this.calcularSubtotal() * this._descontoCupom) / 100;
  }

  /**
   * Calcula taxa de entrega
   */
  public calcularTaxaEntrega(): number {
    // Simular cálculo de frete
    return 5.00;
  }

  /**
   * Calcula total final
   */
  public calcularTotal(): number {
    const subtotal = this.calcularSubtotal();
    const desconto = this.calcularDesconto();
    const taxaEntrega = this.calcularTaxaEntrega();

    return subtotal - desconto + taxaEntrega;
  }

  /**
   * Formata subtotal
   */
  public formatarSubtotal(): string {
    return this.calcularSubtotal().toFixed(2).replace('.', ',');
  }

  /**
   * Formata desconto
   */
  public formatarDesconto(): string {
    return this.calcularDesconto().toFixed(2).replace('.', ',');
  }

  /**
   * Formata taxa de entrega
   */
  public formatarTaxaEntrega(): string {
    return this.calcularTaxaEntrega().toFixed(2).replace('.', ',');
  }

  /**
   * Formata total
   */
  public formatarTotal(): string {
    return this.calcularTotal().toFixed(2).replace('.', ',');
  }

  /**
   * Limpa o carrinho
   */
  public async limpar(): Promise<void> {
    this._itens = [];
    this._cupomAplicado = null;
    this._descontoCupom = 0;
    await Promise.all([
      this.salvarCarrinho(),
      this.salvarCupom(),
    ]);
    console.log('[ServicoCarrinho] Carrinho limpo');
  }

  // Getters
  get itens(): ItemCarrinho[] { return this._itens; }
  get cupomAplicado(): string | null { return this._cupomAplicado; }
  get descontoCupom(): number { return this._descontoCupom; }
  get quantidadeTotal(): number {
    return this._itens.reduce((total, item) => total + item.quantidade, 0);
  }
  get estaVazio(): boolean { return this._itens.length === 0; }
}
