/**
 * Endpoints da API - Esculapi
 * Centraliza todas as URLs dos endpoints
 */

/**
 * Endpoints de Autenticação
 */
export const AUTH_ENDPOINTS = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  REGISTER_CLIENTE: '/auth/register/cliente',
  REGISTER_FARMACIA: '/auth/register/farmacia',
  LOGOUT: '/auth/logout',
  REFRESH_TOKEN: '/auth/refresh',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
  VERIFY_EMAIL: '/auth/verify-email',
};

/**
 * Endpoints de Usuário
 */
export const USER_ENDPOINTS = {
  ME: '/user/me', // Endpoint do backend para buscar dados do usuário autenticado com roles
  PROFILE: '/user/profile',
  UPDATE_PROFILE: '/user/profile', // PUT /api/user/profile
  CHANGE_PASSWORD: '/user/password', // PUT /api/user/password
  UPDATE_PHOTO: '/user/photo',
  ADDRESSES: '/user/addresses',
  ADD_ADDRESS: '/user/addresses',
  UPDATE_ADDRESS: (id: number | string) => `/user/addresses/${id}`,
  DELETE_ADDRESS: (id: number | string) => `/user/addresses/${id}`,
  SET_DEFAULT_ADDRESS: (id: number | string) => `/user/addresses/${id}/default`,
};

/**
 * Endpoints de Produtos
 */
export const PRODUCT_ENDPOINTS = {
  LIST: '/products',
  SEARCH: '/products/search',
  DETAILS: (id: number | string) => `/products/${id}`,
  CATEGORIES: '/products/categories',
  BY_CATEGORY: (categoryId: number | string) => `/products/category/${categoryId}`,
  FEATURED: '/products/featured',
  POPULAR: '/products/popular',
  BY_SELLER: (sellerId: number | string) => `/products/seller/${sellerId}`,
  RELATED: (id: number | string) => `/products/${id}/related`,
  COMPARE_PRICES: (id: number | string) => `/products/${id}/compare-prices`,
};

/**
 * Endpoints de Carrinho
 */
export const CART_ENDPOINTS = {
  GET: '/cart',
  ADD_ITEM: '/cart/items',
  UPDATE_ITEM: (itemId: number | string) => `/cart/items/${itemId}`,
  REMOVE_ITEM: (itemId: number | string) => `/cart/items/${itemId}`,
  CLEAR: '/cart/clear',
  APPLY_COUPON: '/cart/coupon',
};

/**
 * Endpoints de Pedidos
 */
export const ORDER_ENDPOINTS = {
  LIST: '/orders',
  CREATE: '/orders',
  DETAILS: (id: number | string) => `/orders/${id}`,
  CANCEL: (id: number | string) => `/orders/${id}/cancel`,
  TRACK: (id: number | string) => `/orders/${id}/track`,
};

/**
 * Endpoints de Pagamento
 */
export const PAYMENT_ENDPOINTS = {
  METHODS: '/payment/methods',
  PROCESS: '/payment/process',
  CONFIRM: '/payment/confirm',
  HISTORY: '/payment/history',
};

/**
 * Endpoints de Entrega
 */
export const DELIVERY_ENDPOINTS = {
  CALCULATE: '/delivery/calculate',
  TRACK: (orderId: number | string) => `/delivery/track/${orderId}`,
  AVAILABLE_TIMES: '/delivery/available-times',
};

/**
 * Endpoints de Suporte
 */
export const SUPPORT_ENDPOINTS = {
  FAQ: '/support/faq',
  CONTACT: '/support/contact',
  TICKETS: '/support/tickets',
  CREATE_TICKET: '/support/tickets',
  TICKET_DETAILS: (id: number | string) => `/support/tickets/${id}`,
};

/**
 * Endpoints de Notificações
 */
export const NOTIFICATION_ENDPOINTS = {
  LIST: '/notifications',
  MARK_READ: (id: number | string) => `/notifications/${id}/read`,
  MARK_ALL_READ: '/notifications/read-all',
  DELETE: (id: number | string) => `/notifications/${id}`,
  SETTINGS: '/notifications/settings',
};

/**
 * Endpoints de Vendedores/Farmácias (Marketplace)
 */
export const SELLER_ENDPOINTS = {
  LIST: '/sellers',
  DETAILS: (id: number | string) => `/sellers/${id}`,
  SEARCH: '/sellers/search',
  NEARBY: '/sellers/nearby',
  FEATURED: '/sellers/featured',
  REVIEWS: (id: number | string) => `/sellers/${id}/reviews`,
  ADD_REVIEW: (id: number | string) => `/sellers/${id}/reviews`,
  PRODUCTS: (id: number | string) => `/sellers/${id}/products`,
  FOLLOW: (id: number | string) => `/sellers/${id}/follow`,
  UNFOLLOW: (id: number | string) => `/sellers/${id}/unfollow`,
  FOLLOWERS: (id: number | string) => `/sellers/${id}/followers`,
  STATS: (id: number | string) => `/sellers/${id}/stats`,
};

/**
 * Endpoints de Avaliações
 */
export const REVIEW_ENDPOINTS = {
  PRODUCT_REVIEWS: (productId: number | string) => `/products/${productId}/reviews`,
  ADD_PRODUCT_REVIEW: (productId: number | string) => `/products/${productId}/reviews`,
  ORDER_REVIEW: (orderId: number | string) => `/orders/${orderId}/review`,
  MY_REVIEWS: '/reviews/my-reviews',
  UPDATE_REVIEW: (id: number | string) => `/reviews/${id}`,
  DELETE_REVIEW: (id: number | string) => `/reviews/${id}`,
  HELPFUL: (id: number | string) => `/reviews/${id}/helpful`,
};

/**
 * Endpoints de Favoritos
 */
export const FAVORITE_ENDPOINTS = {
  LIST: '/favorites',
  ADD_PRODUCT: '/favorites/products',
  REMOVE_PRODUCT: (productId: number | string) => `/favorites/products/${productId}`,
  ADD_SELLER: '/favorites/sellers',
  REMOVE_SELLER: (sellerId: number | string) => `/favorites/sellers/${sellerId}`,
  CHECK_PRODUCT: (productId: number | string) => `/favorites/products/${productId}/check`,
  CHECK_SELLER: (sellerId: number | string) => `/favorites/sellers/${sellerId}/check`,
};

/**
 * Endpoints de Comparação
 */
export const COMPARE_ENDPOINTS = {
  LIST: '/compare',
  ADD: '/compare/add',
  REMOVE: (productId: number | string) => `/compare/${productId}`,
  CLEAR: '/compare/clear',
};

/**
 * Endpoints de Ofertas/Promoções
 */
export const PROMOTION_ENDPOINTS = {
  LIST: '/promotions',
  DETAILS: (id: number | string) => `/promotions/${id}`,
  ACTIVE: '/promotions/active',
  FLASH_SALES: '/promotions/flash-sales',
  COUPONS: '/promotions/coupons',
  VALIDATE_COUPON: '/promotions/coupons/validate',
};

/**
 * Endpoints de Chat/Mensagens (Marketplace)
 */
export const CHAT_ENDPOINTS = {
  CONVERSATIONS: '/chat/conversations',
  CONVERSATION_DETAILS: (id: number | string) => `/chat/conversations/${id}`,
  SEND_MESSAGE: (conversationId: number | string) => `/chat/conversations/${conversationId}/messages`,
  MARK_READ: (conversationId: number | string) => `/chat/conversations/${conversationId}/read`,
  START_CONVERSATION: '/chat/conversations',
  DELETE_CONVERSATION: (id: number | string) => `/chat/conversations/${id}`,
};

/**
 * Endpoints de Catálogo (Público)
 */
export const CATALOGO_ENDPOINTS = {
  LISTAR: '/catalogo', // GET /api/catalogo
  DETALHES: (id: number | string) => `/catalogo/${id}`, // GET /api/catalogo/{id}
};

/**
 * Endpoints de Estoque (Público e Farmácia)
 */
export const ESTOQUE_ENDPOINTS = {
  BUSCAR_POR_NOME: '/estoque/buscar-por-nome', // GET /api/estoque/buscar-por-nome?nome=
  BUSCAR_POR_CATALOGO: (catalogoId: number | string) => `/estoque/buscar-por-catalogo/${catalogoId}`, // GET
  ESTOQUE_FARMACIA: (farmaciaId: number | string) => `/estoque/farmacia/${farmaciaId}`, // GET
  DETALHES: (estoqueId: number | string) => `/estoque/${estoqueId}`, // GET
};

/**
 * Endpoints de Produtos (Backend Real - LEGACY)
 * @deprecated Use CATALOGO_ENDPOINTS e ESTOQUE_ENDPOINTS
 */
export const PRODUTOS_ENDPOINTS = {
  BUSCAR: '/estoque/buscar-por-nome', // GET /api/estoque/buscar-por-nome?nome=
  DETALHES: (id: number | string) => `/catalogo/${id}`, // GET /api/catalogo/{id}
  OFERTAS: (id: number | string) => `/estoque/buscar-por-catalogo/${id}`, // GET /api/estoque/buscar-por-catalogo/{id}
  CRIAR_CATALOGO: '/admin/catalogo', // POST /api/admin/catalogo (ADMIN apenas)
};

/**
 * Endpoints de Endereços do Cliente (ROLE_CLIENTE)
 */
export const ENDERECOS_ENDPOINTS = {
  LISTAR: '/enderecos/meus-enderecos', // GET /api/enderecos/meus-enderecos - Listar endereços do cliente
  CRIAR: '/enderecos', // POST /api/enderecos - Criar novo endereço
  ATUALIZAR: (enderecoId: number | string) => `/enderecos/${enderecoId}`, // PUT /api/enderecos/{id}
  DELETAR: (enderecoId: number | string) => `/enderecos/${enderecoId}`, // DELETE /api/enderecos/{id}
};

/**
 * Endpoints de Pedidos (ROLE_CLIENTE)
 */
export const PEDIDOS_ENDPOINTS = {
  CRIAR: '/pedidos', // POST /api/pedidos - Criar pedido
  MEUS_PEDIDOS: '/pedidos/meus-pedidos', // GET /api/pedidos/meus-pedidos
  DETALHES: (pedidoId: number | string) => `/pedidos/${pedidoId}`, // GET /api/pedidos/{id}
  UPLOAD_RECEITA: (pedidoId: number | string) => `/pedidos/${pedidoId}/receita`, // POST /api/pedidos/{id}/receita
};

/**
 * Endpoints de Farmácia Admin (ROLE_LOJISTA_ADMIN)
 */
export const FARMACIA_ADMIN_ENDPOINTS = {
  // Gerenciamento da Farmácia
  UPDATE_FARMACIA_INFO: '/farmacia-admin/minha-farmacia/info',
  UPDATE_FARMACIA_ENDERECO: '/farmacia-admin/minha-farmacia/endereco',
  UPDATE_FARMACIA_CONTA: '/farmacia-admin/minha-farmacia/conta-bancaria',
  GET_MINHA_FARMACIA: '/farmacia-admin/minha-farmacia',

  // Gerenciamento de Farmacêuticos
  ADD_FARMACEUTICO: '/farmacia-admin/farmaceuticos',
  LIST_FARMACEUTICOS: '/farmacia-admin/farmaceuticos',
  UPDATE_FARMACEUTICO: (farmaceuticoId: number | string) => `/farmacia-admin/farmaceuticos/${farmaceuticoId}`,
  DESATIVAR_FARMACEUTICO: (farmaceuticoId: number | string) => `/farmacia-admin/farmaceuticos/${farmaceuticoId}/desativar`,
  REATIVAR_FARMACEUTICO: (farmaceuticoId: number | string) => `/farmacia-admin/farmaceuticos/${farmaceuticoId}/reativar`,
  DELETE_FARMACEUTICO: (farmaceuticoId: number | string) => `/farmacia-admin/farmaceuticos/${farmaceuticoId}`,

  // Gerenciamento de Estoque
  ADD_ESTOQUE: '/farmacia-admin/estoque',
  LIST_ESTOQUE: '/farmacia-admin/estoque',
  UPDATE_ESTOQUE: (estoqueId: number | string) => `/farmacia-admin/estoque/${estoqueId}`,
  DELETE_ESTOQUE: (estoqueId: number | string) => `/farmacia-admin/estoque/${estoqueId}`,

  // Gerenciamento de Pedidos
  LIST_PEDIDOS: '/farmacia-admin/pedidos',
  UPDATE_STATUS_PEDIDO: (pedidoId: number | string) => `/farmacia-admin/pedidos/${pedidoId}/status`,
};

/**
 * Endpoints de Farmacêutico (ROLE_FARMACEUTICO)
 */
export const FARMACEUTICO_ENDPOINTS = {
  LIST_PEDIDOS_PENDENTES: '/farmaceutico/pedidos/pendentes',
  APROVAR_RECEITA: (pedidoId: number | string) => `/farmaceutico/pedidos/${pedidoId}/receita/aprovar`,
  REJEITAR_RECEITA: (pedidoId: number | string) => `/farmaceutico/pedidos/${pedidoId}/receita/rejeitar`,
};

/**
 * Endpoints de Admin (ROLE_ADMIN)
 * Gerenciamento do sistema: farmácias, usuários e catálogo de produtos
 */
export const ADMIN_ENDPOINTS = {
  // Gerenciamento de Farmácias
  LIST_FARMACIAS: '/admin/farmacias', // GET /api/admin/farmacias?status=PENDENTE_APROVACAO|ATIVO|SUSPENSO
  ATIVAR_FARMACIA: (farmaciaId: number | string) => `/admin/farmacias/${farmaciaId}/ativar`, // POST
  DESATIVAR_FARMACIA: (farmaciaId: number | string) => `/admin/farmacias/${farmaciaId}/desativar`, // POST

  // Gerenciamento de Usuários
  BUSCAR_USUARIO: '/admin/usuarios/buscar', // GET /api/admin/usuarios/buscar?email=user@example.com
  DESATIVAR_USUARIO: (usuarioId: number | string) => `/admin/usuarios/${usuarioId}/desativar`, // POST
  REATIVAR_USUARIO: (usuarioId: number | string) => `/admin/usuarios/${usuarioId}/reativar`, // POST

  // Gerenciamento de Catálogo de Produtos
  CREATE_PRODUTO: '/admin/catalogo', // POST /api/admin/catalogo
  UPDATE_PRODUTO: (produtoId: number | string) => `/admin/catalogo/${produtoId}`, // PUT
  DESATIVAR_PRODUTO: (produtoId: number | string) => `/admin/catalogo/${produtoId}/desativar`, // POST
  REATIVAR_PRODUTO: (produtoId: number | string) => `/admin/catalogo/${produtoId}/reativar`, // POST
  DELETE_PRODUTO: (produtoId: number | string) => `/admin/catalogo/${produtoId}`, // DELETE
};

/**
 * Helper para construir URLs com query params
 */
export const buildUrlWithParams = (endpoint: string, params: Record<string, any>): string => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, String(value));
    }
  });

  const queryString = searchParams.toString();
  return queryString ? `${endpoint}?${queryString}` : endpoint;
};

/**
 * Export default com todos os endpoints
 */
export default {
  AUTH: AUTH_ENDPOINTS,
  USER: USER_ENDPOINTS,
  PRODUCT: PRODUCT_ENDPOINTS,
  CART: CART_ENDPOINTS,
  ORDER: ORDER_ENDPOINTS,
  PAYMENT: PAYMENT_ENDPOINTS,
  DELIVERY: DELIVERY_ENDPOINTS,
  SUPPORT: SUPPORT_ENDPOINTS,
  NOTIFICATION: NOTIFICATION_ENDPOINTS,
  SELLER: SELLER_ENDPOINTS,
  REVIEW: REVIEW_ENDPOINTS,
  FAVORITE: FAVORITE_ENDPOINTS,
  COMPARE: COMPARE_ENDPOINTS,
  PROMOTION: PROMOTION_ENDPOINTS,
  CHAT: CHAT_ENDPOINTS,
  CATALOGO: CATALOGO_ENDPOINTS,
  ESTOQUE: ESTOQUE_ENDPOINTS,
  PRODUTOS: PRODUTOS_ENDPOINTS, // @deprecated - Use CATALOGO e ESTOQUE
  ENDERECOS: ENDERECOS_ENDPOINTS,
  PEDIDOS: PEDIDOS_ENDPOINTS,
  FARMACIA_ADMIN: FARMACIA_ADMIN_ENDPOINTS,
  FARMACEUTICO: FARMACEUTICO_ENDPOINTS,
  ADMIN: ADMIN_ENDPOINTS,
};
