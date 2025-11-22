/**
 * Testes Unitários: Hook useCart
 * Testa funcionalidades do carrinho de compras
 */

import { renderHook, act, waitFor } from '@testing-library/react-native';
import { useCart } from '../useCart';

// Mock do AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(() => Promise.resolve(null)),
  setItem: jest.fn(() => Promise.resolve()),
  removeItem: jest.fn(() => Promise.resolve()),
}));

describe('useCart Hook', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    // Limpar o carrinho singleton antes de cada teste
    const { result } = renderHook(() => useCart());
    await act(async () => {
      await result.current.limparCarrinho();
    });
  });

  describe('adicionarAoCarrinho', () => {
    it('deve adicionar um produto ao carrinho vazio', async () => {
      const { result } = renderHook(() => useCart());

      const produtoTeste = {
        estoqueId: 1,
        produtoId: 100,
        produtoNome: 'Dipirona 500mg',
        produtoDescricao: 'Analgésico',
        preco: 15.90,
        quantidade: 10,
        ativo: true,
        farmaciaId: 1,
        farmaciaRazaoSocial: 'Farmácia Central',
        farmaciaEndereco: null,
        farmaciaDistancia: null,
      };

      await act(async () => {
        await result.current.adicionarAoCarrinho(produtoTeste, 2);
      });

      await waitFor(() => {
        expect(result.current.servico.itens).toHaveLength(1);
        expect(result.current.servico.itens[0].quantidade).toBe(2);
        expect(result.current.servico.calcularSubtotal()).toBe(31.80); // 15.90 * 2
      });
    });

    it('deve incrementar quantidade de produto já existente', async () => {
      const { result } = renderHook(() => useCart());

      const produtoTeste = {
        estoqueId: 1,
        produtoId: 100,
        produtoNome: 'Dipirona 500mg',
        produtoDescricao: 'Analgésico',
        preco: 15.90,
        quantidade: 10,
        ativo: true,
        farmaciaId: 1,
        farmaciaRazaoSocial: 'Farmácia Central',
        farmaciaEndereco: null,
        farmaciaDistancia: null,
      };

      await act(async () => {
        await result.current.adicionarAoCarrinho(produtoTeste, 1);
        await result.current.adicionarAoCarrinho(produtoTeste, 1);
      });

      await waitFor(() => {
        expect(result.current.servico.itens).toHaveLength(1);
        expect(result.current.servico.itens[0].quantidade).toBe(2);
      });
    });

    it('deve adicionar múltiplos produtos diferentes', async () => {
      const { result } = renderHook(() => useCart());

      const produto1 = {
        estoqueId: 1,
        produtoId: 100,
        produtoNome: 'Dipirona',
        produtoDescricao: null,
        preco: 10.00,
        quantidade: 10,
        ativo: true,
        farmaciaId: 1,
        farmaciaRazaoSocial: 'Farmácia A',
        farmaciaEndereco: null,
        farmaciaDistancia: null,
      };

      const produto2 = {
        estoqueId: 2,
        produtoId: 101,
        produtoNome: 'Paracetamol',
        produtoDescricao: null,
        preco: 15.00,
        quantidade: 10,
        ativo: true,
        farmaciaId: 1,
        farmaciaRazaoSocial: 'Farmácia A',
        farmaciaEndereco: null,
        farmaciaDistancia: null,
      };

      await act(async () => {
        await result.current.adicionarAoCarrinho(produto1, 1);
        await result.current.adicionarAoCarrinho(produto2, 1);
      });

      await waitFor(() => {
        expect(result.current.servico.itens).toHaveLength(2);
        expect(result.current.servico.calcularSubtotal()).toBe(25.00);
      });
    });
  });

  describe('removerDoCarrinho', () => {
    it('deve remover produto do carrinho', async () => {
      const { result } = renderHook(() => useCart());

      const produtoTeste = {
        estoqueId: 1,
        produtoId: 100,
        produtoNome: 'Dipirona',
        produtoDescricao: null,
        preco: 10.00,
        quantidade: 10,
        ativo: true,
        farmaciaId: 1,
        farmaciaRazaoSocial: 'Farmácia A',
        farmaciaEndereco: null,
        farmaciaDistancia: null,
      };

      await act(async () => {
        await result.current.adicionarAoCarrinho(produtoTeste, 1);
      });

      await waitFor(() => {
        expect(result.current.servico.itens).toHaveLength(1);
      });

      const itemId = result.current.servico.itens[0].id;

      await act(async () => {
        await result.current.removerDoCarrinho(itemId);
      });

      await waitFor(() => {
        expect(result.current.servico.itens).toHaveLength(0);
        expect(result.current.servico.calcularSubtotal()).toBe(0);
      });
    });
  });

  describe('estaNoCarrinho', () => {
    it('deve verificar se produto está no carrinho', async () => {
      const { result } = renderHook(() => useCart());

      const produtoTeste = {
        estoqueId: 1,
        produtoId: 100,
        produtoNome: 'Dipirona',
        produtoDescricao: null,
        preco: 10.00,
        quantidade: 10,
        ativo: true,
        farmaciaId: 1,
        farmaciaRazaoSocial: 'Farmácia A',
        farmaciaEndereco: null,
        farmaciaDistancia: null,
      };

      expect(result.current.estaNoCarrinho(1)).toBe(false);

      await act(async () => {
        await result.current.adicionarAoCarrinho(produtoTeste, 1);
      });

      await waitFor(() => {
        expect(result.current.estaNoCarrinho(1)).toBe(true);
      });
    });
  });

  describe('obterQuantidade', () => {
    it('deve obter quantidade de produto no carrinho', async () => {
      const { result } = renderHook(() => useCart());

      const produtoTeste = {
        estoqueId: 1,
        produtoId: 100,
        produtoNome: 'Dipirona',
        produtoDescricao: null,
        preco: 10.00,
        quantidade: 10,
        ativo: true,
        farmaciaId: 1,
        farmaciaRazaoSocial: 'Farmácia A',
        farmaciaEndereco: null,
        farmaciaDistancia: null,
      };

      expect(result.current.obterQuantidade(1)).toBe(0);

      await act(async () => {
        await result.current.adicionarAoCarrinho(produtoTeste, 5);
      });

      await waitFor(() => {
        expect(result.current.obterQuantidade(1)).toBe(5);
      });
    });
  });

  describe('limparCarrinho', () => {
    it('deve limpar todos os itens do carrinho', async () => {
      const { result } = renderHook(() => useCart());

      const produto1 = {
        estoqueId: 1,
        produtoId: 100,
        produtoNome: 'Dipirona',
        produtoDescricao: null,
        preco: 10.00,
        quantidade: 10,
        ativo: true,
        farmaciaId: 1,
        farmaciaRazaoSocial: 'Farmácia A',
        farmaciaEndereco: null,
        farmaciaDistancia: null,
      };

      const produto2 = {
        estoqueId: 2,
        produtoId: 101,
        produtoNome: 'Paracetamol',
        produtoDescricao: null,
        preco: 15.00,
        quantidade: 10,
        ativo: true,
        farmaciaId: 1,
        farmaciaRazaoSocial: 'Farmácia A',
        farmaciaEndereco: null,
        farmaciaDistancia: null,
      };

      await act(async () => {
        await result.current.adicionarAoCarrinho(produto1, 2);
        await result.current.adicionarAoCarrinho(produto2, 1);
      });

      await waitFor(() => {
        expect(result.current.servico.itens).toHaveLength(2);
      });

      await act(async () => {
        await result.current.limparCarrinho();
      });

      await waitFor(() => {
        expect(result.current.servico.itens).toHaveLength(0);
        expect(result.current.servico.calcularSubtotal()).toBe(0);
      });
    });
  });

  describe('calcularTotal', () => {
    it('deve calcular total corretamente com múltiplos produtos', async () => {
      const { result } = renderHook(() => useCart());

      const produto1 = {
        estoqueId: 1,
        produtoId: 100,
        produtoNome: 'Dipirona',
        produtoDescricao: null,
        preco: 10.00,
        quantidade: 10,
        ativo: true,
        farmaciaId: 1,
        farmaciaRazaoSocial: 'Farmácia A',
        farmaciaEndereco: null,
        farmaciaDistancia: null,
      };

      const produto2 = {
        estoqueId: 2,
        produtoId: 101,
        produtoNome: 'Paracetamol',
        produtoDescricao: null,
        preco: 20.00,
        quantidade: 10,
        ativo: true,
        farmaciaId: 1,
        farmaciaRazaoSocial: 'Farmácia A',
        farmaciaEndereco: null,
        farmaciaDistancia: null,
      };

      await act(async () => {
        await result.current.adicionarAoCarrinho(produto1, 3); // 30.00
        await result.current.adicionarAoCarrinho(produto2, 2); // 40.00
      });

      await waitFor(() => {
        expect(result.current.servico.calcularSubtotal()).toBe(70.00);
      });
    });
  });

  describe('quantidadeItens', () => {
    it('deve retornar quantidade total de itens', async () => {
      const { result } = renderHook(() => useCart());

      const produtoTeste = {
        estoqueId: 1,
        produtoId: 100,
        produtoNome: 'Dipirona',
        produtoDescricao: null,
        preco: 10.00,
        quantidade: 10,
        ativo: true,
        farmaciaId: 1,
        farmaciaRazaoSocial: 'Farmácia A',
        farmaciaEndereco: null,
        farmaciaDistancia: null,
      };

      await act(async () => {
        await result.current.adicionarAoCarrinho(produtoTeste, 3);
      });

      await waitFor(() => {
        expect(result.current.quantidadeItens).toBe(3);
      });
    });
  });
});
