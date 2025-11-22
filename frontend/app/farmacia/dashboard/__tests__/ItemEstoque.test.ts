/**
 * Testes Unitários: Classe ItemEstoque
 * Testa todos os métodos de negócio da classe de estoque da farmácia
 */

import { ItemEstoque } from '../tipos/ItemEstoque';

describe('ItemEstoque', () => {
  describe('estaEsgotado()', () => {
    it('deve retornar true quando quantidade é zero', () => {
      const item = new ItemEstoque({
        estoqueId: 1,
        produtoId: 100,
        produtoNome: 'Dipirona',
        quantidade: 0,
        preco: 10.00,
        farmaciaId: 1,
      });

      expect(item.estaEsgotado()).toBe(true);
    });

    it('deve retornar false quando há quantidade em estoque', () => {
      const item = new ItemEstoque({
        estoqueId: 1,
        produtoId: 100,
        produtoNome: 'Dipirona',
        quantidade: 5,
        preco: 10.00,
        farmaciaId: 1,
      });

      expect(item.estaEsgotado()).toBe(false);
    });
  });

  describe('estaComEstoqueBaixo()', () => {
    it('deve retornar true quando quantidade está entre 1 e 9', () => {
      const item = new ItemEstoque({
        estoqueId: 1,
        produtoId: 100,
        produtoNome: 'Dipirona',
        quantidade: 5,
        preco: 10.00,
        farmaciaId: 1,
      });

      expect(item.estaComEstoqueBaixo()).toBe(true);
    });

    it('deve retornar false quando quantidade é zero', () => {
      const item = new ItemEstoque({
        estoqueId: 1,
        produtoId: 100,
        produtoNome: 'Dipirona',
        quantidade: 0,
        preco: 10.00,
        farmaciaId: 1,
      });

      expect(item.estaComEstoqueBaixo()).toBe(false);
    });

    it('deve retornar false quando quantidade é 10 ou mais', () => {
      const item = new ItemEstoque({
        estoqueId: 1,
        produtoId: 100,
        produtoNome: 'Dipirona',
        quantidade: 10,
        preco: 10.00,
        farmaciaId: 1,
      });

      expect(item.estaComEstoqueBaixo()).toBe(false);
    });
  });

  describe('obterStatusEstoque()', () => {
    it('deve retornar ESGOTADO quando quantidade é zero', () => {
      const item = new ItemEstoque({
        estoqueId: 1,
        produtoId: 100,
        produtoNome: 'Dipirona',
        quantidade: 0,
        preco: 10.00,
        farmaciaId: 1,
      });

      expect(item.obterStatusEstoque()).toBe('ESGOTADO');
    });

    it('deve retornar BAIXO quando quantidade é menor que 10', () => {
      const item = new ItemEstoque({
        estoqueId: 1,
        produtoId: 100,
        produtoNome: 'Dipirona',
        quantidade: 9,
        preco: 10.00,
        farmaciaId: 1,
      });

      expect(item.obterStatusEstoque()).toBe('BAIXO');
    });

    it('deve retornar NORMAL quando quantidade é 10 ou mais', () => {
      const item = new ItemEstoque({
        estoqueId: 1,
        produtoId: 100,
        produtoNome: 'Dipirona',
        quantidade: 50,
        preco: 10.00,
        farmaciaId: 1,
      });

      expect(item.obterStatusEstoque()).toBe('NORMAL');
    });
  });

  describe('calcularValorTotal()', () => {
    it('deve calcular valor total corretamente', () => {
      const item = new ItemEstoque({
        estoqueId: 1,
        produtoId: 100,
        produtoNome: 'Dipirona',
        quantidade: 10,
        preco: 15.50,
        farmaciaId: 1,
      });

      expect(item.calcularValorTotal()).toBe(155.00);
    });

    it('deve retornar zero quando quantidade é zero', () => {
      const item = new ItemEstoque({
        estoqueId: 1,
        produtoId: 100,
        produtoNome: 'Dipirona',
        quantidade: 0,
        preco: 15.50,
        farmaciaId: 1,
      });

      expect(item.calcularValorTotal()).toBe(0);
    });
  });

  describe('formatarPreco()', () => {
    it('deve formatar preço em Real', () => {
      const item = new ItemEstoque({
        estoqueId: 1,
        produtoId: 100,
        produtoNome: 'Dipirona',
        quantidade: 10,
        preco: 15.90,
        farmaciaId: 1,
      });

      expect(item.formatarPreco()).toBe('R$ 15,90');
    });

    it('deve formatar preço inteiro com centavos zerados', () => {
      const item = new ItemEstoque({
        estoqueId: 1,
        produtoId: 100,
        produtoNome: 'Dipirona',
        quantidade: 10,
        preco: 20.00,
        farmaciaId: 1,
      });

      expect(item.formatarPreco()).toBe('R$ 20,00');
    });
  });

  describe('formatarValorTotal()', () => {
    it('deve formatar valor total em Real', () => {
      const item = new ItemEstoque({
        estoqueId: 1,
        produtoId: 100,
        produtoNome: 'Dipirona',
        quantidade: 5,
        preco: 10.00,
        farmaciaId: 1,
      });

      expect(item.formatarValorTotal()).toBe('R$ 50,00');
    });
  });

  describe('atualizarQuantidade()', () => {
    it('deve atualizar quantidade com sucesso', () => {
      const item = new ItemEstoque({
        estoqueId: 1,
        produtoId: 100,
        produtoNome: 'Dipirona',
        quantidade: 10,
        preco: 15.00,
        farmaciaId: 1,
      });

      item.atualizarQuantidade(20);

      expect(item.quantidade).toBe(20);
    });

    it('deve permitir zerar quantidade', () => {
      const item = new ItemEstoque({
        estoqueId: 1,
        produtoId: 100,
        produtoNome: 'Dipirona',
        quantidade: 10,
        preco: 15.00,
        farmaciaId: 1,
      });

      item.atualizarQuantidade(0);

      expect(item.quantidade).toBe(0);
    });

    it('deve lançar erro ao tentar quantidade negativa', () => {
      const item = new ItemEstoque({
        estoqueId: 1,
        produtoId: 100,
        produtoNome: 'Dipirona',
        quantidade: 10,
        preco: 15.00,
        farmaciaId: 1,
      });

      expect(() => {
        item.atualizarQuantidade(-5);
      }).toThrow('Quantidade não pode ser negativa');
    });
  });

  describe('atualizarPreco()', () => {
    it('deve atualizar preço com sucesso', () => {
      const item = new ItemEstoque({
        estoqueId: 1,
        produtoId: 100,
        produtoNome: 'Dipirona',
        quantidade: 10,
        preco: 15.00,
        farmaciaId: 1,
      });

      item.atualizarPreco(20.00);

      expect(item.preco).toBe(20.00);
    });

    it('deve lançar erro ao tentar preço zero', () => {
      const item = new ItemEstoque({
        estoqueId: 1,
        produtoId: 100,
        produtoNome: 'Dipirona',
        quantidade: 10,
        preco: 15.00,
        farmaciaId: 1,
      });

      expect(() => {
        item.atualizarPreco(0);
      }).toThrow('Preço deve ser maior que zero');
    });

    it('deve lançar erro ao tentar preço negativo', () => {
      const item = new ItemEstoque({
        estoqueId: 1,
        produtoId: 100,
        produtoNome: 'Dipirona',
        quantidade: 10,
        preco: 15.00,
        farmaciaId: 1,
      });

      expect(() => {
        item.atualizarPreco(-10);
      }).toThrow('Preço deve ser maior que zero');
    });
  });

  describe('paraJSON()', () => {
    it('deve serializar item para JSON', () => {
      const item = new ItemEstoque({
        estoqueId: 1,
        produtoId: 100,
        produtoNome: 'Dipirona 500mg',
        produtoDescricao: 'Analgésico',
        quantidade: 10,
        preco: 15.90,
        farmaciaId: 1,
        tarja: 'VERMELHA',
        categoria: 'Analgésicos',
      });

      const json = item.paraJSON();

      expect(json).toEqual({
        estoqueId: 1,
        produtoId: 100,
        produtoNome: 'Dipirona 500mg',
        produtoDescricao: 'Analgésico',
        quantidade: 10,
        preco: 15.90,
        farmaciaId: 1,
        tarja: 'VERMELHA',
        categoria: 'Analgésicos',
      });
    });
  });

  describe('deAPI()', () => {
    it('deve criar instância a partir de dados da API', () => {
      const dadosAPI = {
        estoqueId: 1,
        produtoId: 100,
        produtoNome: 'Dipirona 500mg',
        produtoDescricao: 'Analgésico',
        quantidade: 10,
        preco: 15.90,
        farmaciaId: 1,
        tarja: 'VERMELHA',
        categoria: 'Analgésicos',
      };

      const item = ItemEstoque.deAPI(dadosAPI);

      expect(item).toBeInstanceOf(ItemEstoque);
      expect(item.estoqueId).toBe(1);
      expect(item.produtoNome).toBe('Dipirona 500mg');
      expect(item.quantidade).toBe(10);
    });
  });

  describe('getters', () => {
    it('deve retornar todos os valores via getters', () => {
      const item = new ItemEstoque({
        estoqueId: 1,
        produtoId: 100,
        produtoNome: 'Dipirona',
        produtoDescricao: 'Analgésico',
        quantidade: 10,
        preco: 15.90,
        farmaciaId: 1,
        tarja: 'VERMELHA',
        categoria: 'Analgésicos',
      });

      expect(item.estoqueId).toBe(1);
      expect(item.produtoId).toBe(100);
      expect(item.produtoNome).toBe('Dipirona');
      expect(item.produtoDescricao).toBe('Analgésico');
      expect(item.quantidade).toBe(10);
      expect(item.preco).toBe(15.90);
      expect(item.farmaciaId).toBe(1);
      expect(item.tarja).toBe('VERMELHA');
      expect(item.categoria).toBe('Analgésicos');
    });
  });
});
