/**
 * Testes Unitários: Classe Produto
 * Testa todos os métodos de negócio da classe de domínio
 */

import { Produto } from '../tipos/Produto';

describe('Produto', () => {
  describe('estaEmPromocao()', () => {
    it('deve retornar true quando tem preço promocional menor', () => {
      // Arrange
      const produto = new Produto({
        id: 1,
        nome: 'Dipirona',
        descricao: 'Analgésico',
        preco: 15.90,
        precoPromocional: 12.90,
        categoria: 'Analgésicos',
        emEstoque: true,
        farmaciaId: 1,
        farmaciaNome: 'Farmácia Central',
      });

      // Act
      const resultado = produto.estaEmPromocao();

      // Assert
      expect(resultado).toBe(true);
    });

    it('deve retornar false quando não tem preço promocional', () => {
      const produto = new Produto({
        id: 1,
        nome: 'Dipirona',
        descricao: 'Analgésico',
        preco: 15.90,
        precoPromocional: null,
        categoria: 'Analgésicos',
        emEstoque: true,
        farmaciaId: 1,
        farmaciaNome: 'Farmácia Central',
      });

      expect(produto.estaEmPromocao()).toBe(false);
    });

    it('deve retornar false quando preço promocional é maior que o normal', () => {
      const produto = new Produto({
        id: 1,
        nome: 'Dipirona',
        descricao: 'Analgésico',
        preco: 15.90,
        precoPromocional: 20.00,
        categoria: 'Analgésicos',
        emEstoque: true,
        farmaciaId: 1,
        farmaciaNome: 'Farmácia Central',
      });

      expect(produto.estaEmPromocao()).toBe(false);
    });

    it('deve retornar false quando preço promocional é igual ao normal', () => {
      const produto = new Produto({
        id: 1,
        nome: 'Dipirona',
        descricao: 'Analgésico',
        preco: 15.90,
        precoPromocional: 15.90,
        categoria: 'Analgésicos',
        emEstoque: true,
        farmaciaId: 1,
        farmaciaNome: 'Farmácia Central',
      });

      expect(produto.estaEmPromocao()).toBe(false);
    });
  });

  describe('obterPrecoFinal()', () => {
    it('deve retornar preço normal quando não está em promoção', () => {
      const produto = new Produto({
        id: 1,
        nome: 'Dipirona',
        descricao: 'Analgésico',
        preco: 15.90,
        precoPromocional: null,
        categoria: 'Analgésicos',
        emEstoque: true,
        farmaciaId: 1,
        farmaciaNome: 'Farmácia Central',
      });

      expect(produto.obterPrecoFinal()).toBe(15.90);
    });

    it('deve retornar preço promocional quando está em promoção', () => {
      const produto = new Produto({
        id: 1,
        nome: 'Dipirona',
        descricao: 'Analgésico',
        preco: 15.90,
        precoPromocional: 12.50,
        categoria: 'Analgésicos',
        emEstoque: true,
        farmaciaId: 1,
        farmaciaNome: 'Farmácia Central',
      });

      expect(produto.obterPrecoFinal()).toBe(12.50);
    });

    it('deve retornar preço normal quando preço promocional é maior', () => {
      const produto = new Produto({
        id: 1,
        nome: 'Dipirona',
        descricao: 'Analgésico',
        preco: 15.90,
        precoPromocional: 20.00,
        categoria: 'Analgésicos',
        emEstoque: true,
        farmaciaId: 1,
        farmaciaNome: 'Farmácia Central',
      });

      expect(produto.obterPrecoFinal()).toBe(15.90);
    });
  });

  describe('calcularDesconto()', () => {
    it('deve calcular desconto de 20% corretamente', () => {
      const produto = new Produto({
        id: 1,
        nome: 'Dipirona',
        descricao: 'Analgésico',
        preco: 100.00,
        precoPromocional: 80.00,
        categoria: 'Analgésicos',
        emEstoque: true,
        farmaciaId: 1,
        farmaciaNome: 'Farmácia Central',
      });

      // Desconto = ((100 - 80) / 100) * 100 = 20%
      expect(produto.calcularDesconto()).toBe(20);
    });

    it('deve calcular desconto de 50% corretamente', () => {
      const produto = new Produto({
        id: 1,
        nome: 'Dipirona',
        descricao: 'Analgésico',
        preco: 100.00,
        precoPromocional: 50.00,
        categoria: 'Analgésicos',
        emEstoque: true,
        farmaciaId: 1,
        farmaciaNome: 'Farmácia Central',
      });

      expect(produto.calcularDesconto()).toBe(50);
    });

    it('deve retornar 0 quando não está em promoção', () => {
      const produto = new Produto({
        id: 1,
        nome: 'Dipirona',
        descricao: 'Analgésico',
        preco: 15.90,
        precoPromocional: null,
        categoria: 'Analgésicos',
        emEstoque: true,
        farmaciaId: 1,
        farmaciaNome: 'Farmácia Central',
      });

      expect(produto.calcularDesconto()).toBe(0);
    });

    it('deve arredondar desconto para inteiro mais próximo', () => {
      const produto = new Produto({
        id: 1,
        nome: 'Dipirona',
        descricao: 'Analgésico',
        preco: 15.00,
        precoPromocional: 12.25,
        categoria: 'Analgésicos',
        emEstoque: true,
        farmaciaId: 1,
        farmaciaNome: 'Farmácia Central',
      });

      // Desconto = ((15 - 12.25) / 15) * 100 = 18.33... → 18
      expect(produto.calcularDesconto()).toBe(18);
    });

    it('deve retornar 0 quando preço promocional é maior', () => {
      const produto = new Produto({
        id: 1,
        nome: 'Dipirona',
        descricao: 'Analgésico',
        preco: 15.90,
        precoPromocional: 20.00,
        categoria: 'Analgésicos',
        emEstoque: true,
        farmaciaId: 1,
        farmaciaNome: 'Farmácia Central',
      });

      expect(produto.calcularDesconto()).toBe(0);
    });
  });

  describe('formatarPreco()', () => {
    it('deve formatar preço com vírgula e 2 casas decimais', () => {
      const produto = new Produto({
        id: 1,
        nome: 'Dipirona',
        descricao: 'Analgésico',
        preco: 15.90,
        precoPromocional: null,
        categoria: 'Analgésicos',
        emEstoque: true,
        farmaciaId: 1,
        farmaciaNome: 'Farmácia Central',
      });

      expect(produto.formatarPreco()).toBe('15,90');
    });

    it('deve formatar preço promocional quando em oferta', () => {
      const produto = new Produto({
        id: 1,
        nome: 'Dipirona',
        descricao: 'Analgésico',
        preco: 15.90,
        precoPromocional: 12.50,
        categoria: 'Analgésicos',
        emEstoque: true,
        farmaciaId: 1,
        farmaciaNome: 'Farmácia Central',
      });

      expect(produto.formatarPreco()).toBe('12,50');
    });

    it('deve formatar preço inteiro com centavos zerados', () => {
      const produto = new Produto({
        id: 1,
        nome: 'Dipirona',
        descricao: 'Analgésico',
        preco: 10.00,
        precoPromocional: null,
        categoria: 'Analgésicos',
        emEstoque: true,
        farmaciaId: 1,
        farmaciaNome: 'Farmácia Central',
      });

      expect(produto.formatarPreco()).toBe('10,00');
    });

    it('deve formatar preço com centavos exatos', () => {
      const produto = new Produto({
        id: 1,
        nome: 'Dipirona',
        descricao: 'Analgésico',
        preco: 9.99,
        precoPromocional: null,
        categoria: 'Analgésicos',
        emEstoque: true,
        farmaciaId: 1,
        farmaciaNome: 'Farmácia Central',
      });

      expect(produto.formatarPreco()).toBe('9,99');
    });
  });

  describe('paraJSON()', () => {
    it('deve serializar produto para objeto JSON', () => {
      const produto = new Produto({
        id: 1,
        nome: 'Dipirona 500mg',
        descricao: 'Analgésico e antitérmico',
        preco: 15.90,
        precoPromocional: 12.90,
        categoria: 'Analgésicos',
        imagem: 'dipirona.jpg',
        emEstoque: true,
        farmaciaId: 1,
        farmaciaNome: 'Farmácia Central',
      });

      const json = produto.paraJSON();

      expect(json).toEqual({
        id: 1,
        nome: 'Dipirona 500mg',
        descricao: 'Analgésico e antitérmico',
        preco: 15.90,
        precoPromocional: 12.90,
        categoria: 'Analgésicos',
        imagem: 'dipirona.jpg',
        emEstoque: true,
        farmaciaId: 1,
        farmaciaNome: 'Farmácia Central',
      });
    });

    it('deve serializar produto sem preço promocional', () => {
      const produto = new Produto({
        id: 2,
        nome: 'Paracetamol',
        descricao: 'Analgésico',
        preco: 18.50,
        precoPromocional: null,
        categoria: 'Analgésicos',
        emEstoque: true,
        farmaciaId: 2,
        farmaciaNome: 'Drogaria São Paulo',
      });

      const json = produto.paraJSON();

      expect(json.precoPromocional).toBeNull();
      expect(json.imagem).toBeNull();
    });
  });

  describe('deAPI()', () => {
    it('deve criar instância de Produto a partir de dados da API', () => {
      const dadosAPI = {
        id: 1,
        nome: 'Dipirona 500mg',
        descricao: 'Analgésico e antitérmico',
        preco: 15.90,
        precoPromocional: 12.90,
        categoria: 'Analgésicos',
        imagem: 'dipirona.jpg',
        emEstoque: true,
        farmaciaId: 1,
        farmaciaNome: 'Farmácia Central',
      };

      const produto = Produto.deAPI(dadosAPI);

      expect(produto).toBeInstanceOf(Produto);
      expect(produto.id).toBe(1);
      expect(produto.nome).toBe('Dipirona 500mg');
      expect(produto.preco).toBe(15.90);
      expect(produto.precoPromocional).toBe(12.90);
      expect(produto.estaEmPromocao()).toBe(true);
    });

    it('deve criar instância com valores null/undefined', () => {
      const dadosAPI = {
        id: 2,
        nome: 'Paracetamol',
        descricao: 'Analgésico',
        preco: 18.50,
        precoPromocional: null,
        categoria: 'Analgésicos',
        imagem: undefined,
        emEstoque: false,
        farmaciaId: 2,
        farmaciaNome: 'Drogaria São Paulo',
      };

      const produto = Produto.deAPI(dadosAPI);

      expect(produto.precoPromocional).toBeNull();
      expect(produto.imagem).toBeNull();
      expect(produto.emEstoque).toBe(false);
    });
  });

  describe('getters', () => {
    it('deve retornar todos os valores via getters', () => {
      const produto = new Produto({
        id: 1,
        nome: 'Dipirona',
        descricao: 'Analgésico',
        preco: 15.90,
        precoPromocional: 12.90,
        categoria: 'Analgésicos',
        imagem: 'dipirona.jpg',
        emEstoque: true,
        farmaciaId: 1,
        farmaciaNome: 'Farmácia Central',
      });

      expect(produto.id).toBe(1);
      expect(produto.nome).toBe('Dipirona');
      expect(produto.descricao).toBe('Analgésico');
      expect(produto.preco).toBe(15.90);
      expect(produto.precoPromocional).toBe(12.90);
      expect(produto.categoria).toBe('Analgésicos');
      expect(produto.imagem).toBe('dipirona.jpg');
      expect(produto.emEstoque).toBe(true);
      expect(produto.farmaciaId).toBe(1);
      expect(produto.farmaciaNome).toBe('Farmácia Central');
    });
  });
});
