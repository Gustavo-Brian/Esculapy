/**
 * Serviço de Carrinho - Esculapi
 * Gerencia operações do carrinho de compras
 */

import { apiGet, apiPost, apiPut, apiDelete } from '../api/config';
import { CART_ENDPOINTS } from '../api/endpoints';
import {
  Cart,
  AddToCartRequest,
  UpdateCartItemRequest,
  ApiResponse,
} from '../types/api.types';

/**
 * Busca o carrinho atual do usuário
 */
export const getCart = async (): Promise<Cart> => {
  try {
    return await apiGet<Cart>(CART_ENDPOINTS.GET);
  } catch (error) {
    console.error('Erro ao buscar carrinho:', error);
    throw error;
  }
};

/**
 * Adiciona um produto ao carrinho
 */
export const addToCart = async (data: AddToCartRequest): Promise<Cart> => {
  try {
    return await apiPost<Cart>(CART_ENDPOINTS.ADD_ITEM, data);
  } catch (error) {
    console.error('Erro ao adicionar produto ao carrinho:', error);
    throw error;
  }
};

/**
 * Atualiza a quantidade de um item no carrinho
 */
export const updateCartItem = async (
  itemId: number | string,
  data: UpdateCartItemRequest
): Promise<Cart> => {
  try {
    return await apiPut<Cart>(CART_ENDPOINTS.UPDATE_ITEM(itemId), data);
  } catch (error) {
    console.error('Erro ao atualizar item do carrinho:', error);
    throw error;
  }
};

/**
 * Remove um item do carrinho
 */
export const removeCartItem = async (itemId: number | string): Promise<Cart> => {
  try {
    return await apiDelete<Cart>(CART_ENDPOINTS.REMOVE_ITEM(itemId));
  } catch (error) {
    console.error('Erro ao remover item do carrinho:', error);
    throw error;
  }
};

/**
 * Limpa todos os itens do carrinho
 */
export const clearCart = async (): Promise<ApiResponse> => {
  try {
    return await apiDelete<ApiResponse>(CART_ENDPOINTS.CLEAR);
  } catch (error) {
    console.error('Erro ao limpar carrinho:', error);
    throw error;
  }
};

/**
 * Aplica um cupom de desconto ao carrinho
 */
export const applyCoupon = async (couponCode: string): Promise<Cart> => {
  try {
    return await apiPost<Cart>(CART_ENDPOINTS.APPLY_COUPON, {
      coupon_code: couponCode,
    });
  } catch (error) {
    console.error('Erro ao aplicar cupom:', error);
    throw error;
  }
};

/**
 * Incrementa a quantidade de um item (helper)
 */
export const incrementCartItem = async (
  itemId: number | string,
  currentQuantity: number
): Promise<Cart> => {
  return updateCartItem(itemId, { quantity: currentQuantity + 1 });
};

/**
 * Decrementa a quantidade de um item (helper)
 * Remove o item se quantidade chegar a 0
 */
export const decrementCartItem = async (
  itemId: number | string,
  currentQuantity: number
): Promise<Cart> => {
  if (currentQuantity <= 1) {
    return removeCartItem(itemId);
  }
  return updateCartItem(itemId, { quantity: currentQuantity - 1 });
};

export default {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
  applyCoupon,
  incrementCartItem,
  decrementCartItem,
};
