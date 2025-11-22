/**
 * Testes Unitários: Classe ItemCarrinho
 * Testa todos os métodos de negócio do item do carrinho
 */

import { ItemCarrinho } from '../tipos/ItemCarrinho';

describe('ItemCarrinho', () => {
  describe('calcularSubtotal()', () => {
    it('deve calcular subtotal corretamente', () => {
      const item = new ItemCarrinho({
        id: 1,
        estoqueId: 1,
        produtoId: 100,
        nome: 'Dipirona',
        preco: 10.00,
        quantidade: 5,
        farmacia: 'Farmácia Central',
        farmaciaId: 1,
      });

      expect(item.calcularSubtotal()).toBe(50.00);
    });

    it('deve retornar preço quando quantidade é 1', () => {
      const item = new ItemCarrinho({
        id: 1,
        estoqueId: 1,
        produtoId: 100,
        nome: 'Dipirona',
        preco: 15.90,
        quantidade: 1,
        farmacia: 'Farmácia Central',
        farmaciaId: 1,
      });

      expect(item.calcularSubtotal()).toBe(15.90);
    });

    it('deve calcular subtotal com valor decimal', () => {
      const item = new ItemCarrinho({
        id: 1,
        estoqueId: 1,
        produtoId: 100,
        nome: 'Dipirona',
        preco: 12.50,
        quantidade: 3,
        farmacia: 'Farmácia Central',
        farmaciaId: 1,
      });

      expect(item.calcularSubtotal()).toBe(37.50);
    });
  });

  describe('formatarPreco()', () => {
    it('deve formatar preço com vírgula', () => {
      const item = new ItemCarrinho({
        id: 1,
        estoqueId: 1,
        produtoId: 100,
        nome: 'Dipirona',
        preco: 15.90,
        quantidade: 1,
        farmacia: 'Farmácia Central',
        farmaciaId: 1,
      });

      expect(item.formatarPreco()).toBe('15,90');
    });

    it('deve formatar preço inteiro com centavos zerados', () => {
      const item = new ItemCarrinho({
        id: 1,
        estoqueId: 1,
        produtoId: 100,
        nome: 'Dipirona',
        preco: 20.00,
        quantidade: 1,
        farmacia: 'Farmácia Central',
        farmaciaId: 1,
      });

      expect(item.formatarPreco()).toBe('20,00');
    });
  });

  describe('formatarSubtotal()', () => {
    it('deve formatar subtotal com vírgula', () => {
      const item = new ItemCarrinho({
        id: 1,
        estoqueId: 1,
        produtoId: 100,
        nome: 'Dipirona',
        preco: 10.00,
        quantidade: 5,
        farmacia: 'Farmácia Central',
        farmaciaId: 1,
      });

      expect(item.formatarSubtotal()).toBe('50,00');
    });
  });

  describe('incrementar()', () => {
    it('deve incrementar quantidade', () => {
      const item = new ItemCarrinho({
        id: 1,
        estoqueId: 1,
        produtoId: 100,
        nome: 'Dipirona',
        preco: 10.00,
        quantidade: 1,
        farmacia: 'Farmácia Central',
        farmaciaId: 1,
      });

      item.incrementar();

      expect(item.quantidade).toBe(2);
    });

    it('deve incrementar múltiplas vezes', () => {
      const item = new ItemCarrinho({
        id: 1,
        estoqueId: 1,
        produtoId: 100,
        nome: 'Dipirona',
        preco: 10.00,
        quantidade: 1,
        farmacia: 'Farmácia Central',
        farmaciaId: 1,
      });

      item.incrementar();
      item.incrementar();
      item.incrementar();

      expect(item.quantidade).toBe(4);
    });
  });

  describe('decrementar()', () => {
    it('deve decrementar quantidade', () => {
      const item = new ItemCarrinho({
        id: 1,
        estoqueId: 1,
        produtoId: 100,
        nome: 'Dipirona',
        preco: 10.00,
        quantidade: 5,
        farmacia: 'Farmácia Central',
        farmaciaId: 1,
      });

      item.decrementar();

      expect(item.quantidade).toBe(4);
    });

    it('não deve decrementar abaixo de 1', () => {
      const item = new ItemCarrinho({
        id: 1,
        estoqueId: 1,
        produtoId: 100,
        nome: 'Dipirona',
        preco: 10.00,
        quantidade: 1,
        farmacia: 'Farmácia Central',
        farmaciaId: 1,
      });

      item.decrementar();

      expect(item.quantidade).toBe(1);
    });

    it('deve manter quantidade em 1 mesmo com múltiplos decrementos', () => {
      const item = new ItemCarrinho({
        id: 1,
        estoqueId: 1,
        produtoId: 100,
        nome: 'Dipirona',
        preco: 10.00,
        quantidade: 1,
        farmacia: 'Farmácia Central',
        farmaciaId: 1,
      });

      item.decrementar();
      item.decrementar();
      item.decrementar();

      expect(item.quantidade).toBe(1);
    });
  });

  describe('definirQuantidade()', () => {
    it('deve definir quantidade válida', () => {
      const item = new ItemCarrinho({
        id: 1,
        estoqueId: 1,
        produtoId: 100,
        nome: 'Dipirona',
        preco: 10.00,
        quantidade: 1,
        farmacia: 'Farmácia Central',
        farmaciaId: 1,
      });

      item.definirQuantidade(10);

      expect(item.quantidade).toBe(10);
    });

    it('não deve permitir quantidade menor que 1', () => {
      const item = new ItemCarrinho({
        id: 1,
        estoqueId: 1,
        produtoId: 100,
        nome: 'Dipirona',
        preco: 10.00,
        quantidade: 5,
        farmacia: 'Farmácia Central',
        farmaciaId: 1,
      });

      item.definirQuantidade(0);

      expect(item.quantidade).toBe(5); // Mantém valor anterior
    });

    it('não deve permitir quantidade negativa', () => {
      const item = new ItemCarrinho({
        id: 1,
        estoqueId: 1,
        produtoId: 100,
        nome: 'Dipirona',
        preco: 10.00,
        quantidade: 5,
        farmacia: 'Farmácia Central',
        farmaciaId: 1,
      });

      item.definirQuantidade(-10);

      expect(item.quantidade).toBe(5); // Mantém valor anterior
    });
  });

  describe('toJSON()', () => {
    it('deve serializar item para JSON', () => {
      const item = new ItemCarrinho({
        id: 1,
        estoqueId: 10,
        produtoId: 100,
        nome: 'Dipirona 500mg',
        preco: 15.90,
        quantidade: 2,
        farmacia: 'Farmácia Central',
        farmaciaId: 5,
        imagem: 'dipirona.jpg',
      });

      const json = item.toJSON();

      expect(json).toEqual({
        id: 1,
        estoqueId: 10,
        produtoId: 100,
        nome: 'Dipirona 500mg',
        preco: 15.90,
        quantidade: 2,
        farmacia: 'Farmácia Central',
        farmaciaId: 5,
        imagem: 'dipirona.jpg',
      });
    });

    it('deve serializar item sem imagem', () => {
      const item = new ItemCarrinho({
        id: 1,
        estoqueId: 10,
        produtoId: 100,
        nome: 'Dipirona',
        preco: 15.90,
        quantidade: 1,
        farmacia: 'Farmácia Central',
        farmaciaId: 5,
      });

      const json = item.toJSON();

      expect(json.imagem).toBeNull();
    });
  });

  describe('criar()', () => {
    it('deve criar instância a partir de dados', () => {
      const dados = {
        id: 1,
        estoqueId: 10,
        produtoId: 100,
        nome: 'Dipirona',
        preco: 15.90,
        quantidade: 2,
        farmacia: 'Farmácia Central',
        farmaciaId: 5,
      };

      const item = ItemCarrinho.criar(dados);

      expect(item).toBeInstanceOf(ItemCarrinho);
      expect(item.nome).toBe('Dipirona');
      expect(item.quantidade).toBe(2);
    });

    it('deve usar quantidade padrão 1 quando não fornecida', () => {
      const dados = {
        id: 1,
        estoqueId: 10,
        produtoId: 100,
        nome: 'Dipirona',
        preco: 15.90,
        farmacia: 'Farmácia Central',
        farmaciaId: 5,
      };

      const item = ItemCarrinho.criar(dados);

      expect(item.quantidade).toBe(1);
    });

    it('deve aceitar campos com snake_case', () => {
      const dados = {
        id: 1,
        estoque_id: 10,
        produto_id: 100,
        nome: 'Dipirona',
        preco: 15.90,
        quantidade: 1,
        farmacia: 'Farmácia Central',
        farmacia_id: 5,
      };

      const item = ItemCarrinho.criar(dados);

      expect(item.estoqueId).toBe(10);
      expect(item.produtoId).toBe(100);
      expect(item.farmaciaId).toBe(5);
    });
  });

  describe('criarDeEstoque()', () => {
    it('deve criar item a partir de EstoqueResponse', () => {
      const estoque = {
        estoqueId: 10,
        produtoId: 100,
        produtoNome: 'Dipirona 500mg',
        preco: 15.90,
        farmaciaId: 5,
        farmaciaRazaoSocial: 'Farmácia Central LTDA',
      };

      const item = ItemCarrinho.criarDeEstoque(estoque);

      expect(item).toBeInstanceOf(ItemCarrinho);
      expect(item.nome).toBe('Dipirona 500mg');
      expect(item.farmacia).toBe('Farmácia Central LTDA');
      expect(item.quantidade).toBe(1);
      expect(item.estoqueId).toBe(10);
      expect(item.farmaciaId).toBe(5);
    });

    it('deve usar estoqueId como id do item', () => {
      const estoque = {
        estoqueId: 10,
        produtoId: 100,
        produtoNome: 'Dipirona',
        preco: 15.90,
        farmaciaId: 5,
        farmaciaRazaoSocial: 'Farmácia Central',
      };

      const item = ItemCarrinho.criarDeEstoque(estoque);

      expect(item.id).toBe(10);
    });
  });

  describe('getters', () => {
    it('deve retornar todos os valores via getters', () => {
      const item = new ItemCarrinho({
        id: 1,
        estoqueId: 10,
        produtoId: 100,
        nome: 'Dipirona',
        preco: 15.90,
        quantidade: 2,
        farmacia: 'Farmácia Central',
        farmaciaId: 5,
        imagem: 'dipirona.jpg',
      });

      expect(item.id).toBe(1);
      expect(item.estoqueId).toBe(10);
      expect(item.produtoId).toBe(100);
      expect(item.nome).toBe('Dipirona');
      expect(item.preco).toBe(15.90);
      expect(item.quantidade).toBe(2);
      expect(item.farmacia).toBe('Farmácia Central');
      expect(item.farmaciaId).toBe(5);
      expect(item.imagem).toBe('dipirona.jpg');
    });
  });
});
