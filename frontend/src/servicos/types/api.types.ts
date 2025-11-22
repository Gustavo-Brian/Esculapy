/**
 * Types da API - Esculapi
 * Definições de tipos TypeScript para toda a API
 */

// ==================== TIPOS DE AUTENTICAÇÃO ====================

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  phone: string;
  password: string;
  password_confirmation: string;
}

// Login de Cliente (específico)
export interface LoginClienteRequest {
  email: string;
  senha: string;
}

export interface LoginClienteResponse {
  token: string;
  userId: number;
  email: string;
  role?: UserRole;
}

// Registro de Cliente (específico)
export interface RegisterClienteRequest {
  nome: string;
  email: string;
  senha: string;
  cpf: string;
  numeroCelular?: string;
  dataNascimento?: string; // formato: YYYY-MM-DD
}

export interface RegisterClienteResponse {
  token: string;
  userId: number;
  email: string;
  role?: UserRole;
}

// Registro de Farmácia (específico)
export interface RegisterFarmaciaRequest {
  email: string;
  senha: string;
  cnpj: string;
  razaoSocial: string;
  nomeFantasia: string;
  crfJ: string;
  emailContato: string;
  numeroCelularContato: string;
}

export interface RegisterFarmaciaResponse {
  token: string;
  userId: number;
  email: string;
  role?: UserRole;
}

export interface AuthResponse {
  access_token: string;
  refresh_token?: string;
  token_type: string;
  expires_in: number;
  user: User;
}

export type UserRole = 'ROLE_CLIENTE' | 'ROLE_LOJISTA_ADMIN' | 'ROLE_FARMACEUTICO' | 'ROLE_ADMIN';

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  role?: UserRole;
  photo_url?: string;
  email_verified_at?: string;
  created_at: string;
  updated_at: string;
}

// Resposta do endpoint /api/user/me do backend
export interface MeResponse {
  id: number;
  email: string;
  roles: string[]; // Array de roles do backend (ex: ["ROLE_CLIENTE"])
  cliente?: {
    id: number;
    nome: string;
    cpf: string;
  };
  farmaciaAdmin?: {
    id: number;
    nomeFantasia: string;
    razaoSocial?: string; // Opcional, caso backend adicione no futuro
    cnpj: string;
    status: string;
  };
  farmaceutico?: {
    id: number;
    nome: string;
    crfP: string;
    farmaciaId: number;
  };
}

// ==================== TIPOS DE ENDEREÇO ====================

export type TipoEndereco = 'RESIDENCIAL' | 'COMERCIAL' | 'OUTRO';

export interface Endereco {
  id: number;
  clienteId: number;
  tipo: TipoEndereco;
  cep: string;
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
}

export interface EnderecoRequest {
  tipo: TipoEndereco;
  cep: string;
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
}

export interface EnderecosResponse {
  enderecos: Endereco[];
  total: number;
}

// ==================== TIPOS DE PRODUTO ====================

export interface Product {
  id: number;
  name: string;
  description: string;
  short_description?: string;
  price: number;
  price_formatted: string;
  original_price?: number;
  original_price_formatted?: string;
  discount_percentage?: number;
  image_url?: string;
  images?: ProductImage[];
  category_id: number;
  category?: Category;
  seller_id: number;
  seller?: Seller;
  stock: number;
  is_active: boolean;
  is_featured: boolean;
  is_favorited?: boolean;
  rating?: number;
  reviews_count?: number;
  sales_count?: number;
  created_at: string;
  updated_at: string;
}

export interface ProductImage {
  id: number;
  product_id: number;
  url: string;
  is_main: boolean;
  order: number;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  icon?: string;
  parent_id?: number;
  is_active: boolean;
}

export interface ProductListParams {
  page?: number;
  per_page?: number;
  search?: string;
  category_id?: number;
  seller_id?: number;
  min_price?: number;
  max_price?: number;
  min_rating?: number;
  has_discount?: boolean;
  in_stock?: boolean;
  order_by?: 'name' | 'price' | 'created_at' | 'rating' | 'sales' | 'discount';
  order_direction?: 'asc' | 'desc';
  latitude?: number;
  longitude?: number;
  radius?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
}

// ==================== TIPOS DE CARRINHO ====================

export interface Cart {
  id: number;
  user_id: number;
  items: CartItem[];
  subtotal: number;
  subtotal_formatted: string;
  discount: number;
  discount_formatted: string;
  shipping: number;
  shipping_formatted: string;
  total: number;
  total_formatted: string;
  coupon?: Coupon;
  updated_at: string;
}

export interface CartItem {
  id: number;
  cart_id: number;
  product_id: number;
  product: Product;
  quantity: number;
  unit_price: number;
  unit_price_formatted: string;
  subtotal: number;
  subtotal_formatted: string;
  created_at: string;
  updated_at: string;
}

export interface AddToCartRequest {
  product_id: number;
  quantity: number;
}

export interface UpdateCartItemRequest {
  quantity: number;
}

export interface Coupon {
  id: number;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  min_purchase?: number;
  max_discount?: number;
  expires_at?: string;
}

// ==================== TIPOS DE ENDEREÇO ====================

export interface Address {
  id: number;
  user_id: number;
  title: string;
  recipient_name: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zip_code: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface AddressRequest {
  title: string;
  recipient_name: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zip_code: string;
  is_default?: boolean;
}

// ==================== TIPOS DE PEDIDO ====================

export interface Order {
  id: number;
  user_id: number;
  order_number: string;
  status: OrderStatus;
  status_label: string;
  payment_method: string;
  payment_status: PaymentStatus;
  delivery_address: Address;
  items: OrderItem[];
  subtotal: number;
  subtotal_formatted: string;
  discount: number;
  discount_formatted: string;
  shipping: number;
  shipping_formatted: string;
  total: number;
  total_formatted: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  estimated_delivery?: string;
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  product_name: string;
  product_image?: string;
  quantity: number;
  unit_price: number;
  unit_price_formatted: string;
  subtotal: number;
  subtotal_formatted: string;
}

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'in_transit'
  | 'delivered'
  | 'cancelled';

export type PaymentStatus =
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'refunded';

export interface CreateOrderRequest {
  address_id: number;
  payment_method: string;
  coupon_code?: string;
  notes?: string;
}

// ==================== TIPOS DE SUPORTE ====================

export interface FAQ {
  id: number;
  question: string;
  answer: string;
  category: string;
  order: number;
}

export interface SupportTicket {
  id: number;
  user_id: number;
  subject: string;
  message: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high';
  messages: TicketMessage[];
  created_at: string;
  updated_at: string;
}

export interface TicketMessage {
  id: number;
  ticket_id: number;
  user_id?: number;
  admin_id?: number;
  message: string;
  is_admin: boolean;
  created_at: string;
}

export interface CreateTicketRequest {
  subject: string;
  message: string;
  priority?: 'low' | 'medium' | 'high';
}

// ==================== TIPOS DE NOTIFICAÇÃO ====================

export interface Notification {
  id: number;
  user_id: number;
  type: string;
  title: string;
  message: string;
  data?: any;
  is_read: boolean;
  created_at: string;
  read_at?: string;
}

// ==================== TIPOS DE RESPOSTA GENÉRICA ====================

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Record<string, string[]>;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
  status?: number;
}

// ==================== TIPOS DE PERFIL DE USUÁRIO ====================

export interface UpdateProfileRequest {
  name?: string;
  email?: string;
  phone?: string;
}

export interface ChangePasswordRequest {
  current_password: string;
  new_password: string;
  new_password_confirmation: string;
}

export interface UpdatePhotoRequest {
  photo: {
    uri: string;
    type: string;
    name: string;
  };
}

// ==================== TIPOS DE MARKETPLACE ====================

// Vendedores/Farmácias
export interface Seller {
  id: number;
  name: string;
  trading_name?: string;
  description?: string;
  logo_url?: string;
  cover_url?: string;
  cnpj?: string;
  phone: string;
  email: string;
  address: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zip_code: string;
    latitude?: number;
    longitude?: number;
  };
  rating: number;
  reviews_count: number;
  sales_count: number;
  followers_count: number;
  products_count: number;
  is_active: boolean;
  is_verified: boolean;
  is_featured: boolean;
  is_following?: boolean;
  opening_hours?: OpeningHours[];
  badges?: SellerBadge[];
  delivery_options?: DeliveryOption[];
  created_at: string;
  updated_at: string;
}

export interface OpeningHours {
  day_of_week: number; // 0 = Domingo, 6 = Sábado
  day_name: string;
  is_open: boolean;
  opening_time?: string; // "08:00"
  closing_time?: string; // "18:00"
}

export interface SellerBadge {
  id: number;
  type: 'verified' | 'top_seller' | 'fast_delivery' | 'best_prices';
  name: string;
  icon?: string;
  color?: string;
}

export interface DeliveryOption {
  id: number;
  type: 'standard' | 'express' | 'scheduled' | 'pickup';
  name: string;
  description?: string;
  estimated_time: string; // "30-45 min"
  price: number;
  price_formatted: string;
  is_free_above?: number;
}

export interface SellerStats {
  total_sales: number;
  total_revenue: number;
  average_rating: number;
  reviews_count: number;
  followers_count: number;
  response_rate: number;
  response_time: string;
  on_time_delivery_rate: number;
}

// Avaliações/Reviews
export interface Review {
  id: number;
  user_id: number;
  user_name: string;
  user_avatar?: string;
  reviewable_type: 'product' | 'seller' | 'order';
  reviewable_id: number;
  rating: number;
  title?: string;
  comment?: string;
  images?: string[];
  helpful_count: number;
  is_helpful?: boolean;
  is_verified_purchase: boolean;
  seller_response?: SellerResponse;
  created_at: string;
  updated_at: string;
}

export interface SellerResponse {
  id: number;
  review_id: number;
  seller_id: number;
  message: string;
  created_at: string;
}

export interface CreateReviewRequest {
  rating: number;
  title?: string;
  comment?: string;
  images?: string[];
}

export interface ReviewStats {
  average_rating: number;
  total_reviews: number;
  ratings_breakdown: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

// Favoritos
export interface Favorite {
  id: number;
  user_id: number;
  favorable_type: 'product' | 'seller';
  favorable_id: number;
  favorable?: Product | Seller;
  created_at: string;
}

export interface FavoritesList {
  products: Product[];
  sellers: Seller[];
}

// Comparação
export interface CompareItem {
  id: number;
  user_id: number;
  product: Product;
  added_at: string;
}

export interface CompareList {
  items: Product[];
  max_items: number;
}

// Promoções
export interface Promotion {
  id: number;
  type: 'discount' | 'flash_sale' | 'bundle' | 'free_shipping';
  title: string;
  description?: string;
  image_url?: string;
  discount_percentage?: number;
  discount_amount?: number;
  products?: Product[];
  sellers?: Seller[];
  start_date: string;
  end_date: string;
  is_active: boolean;
  terms?: string;
}

export interface FlashSale {
  id: number;
  product_id: number;
  product: Product;
  original_price: number;
  sale_price: number;
  discount_percentage: number;
  quantity_available: number;
  quantity_sold: number;
  start_time: string;
  end_time: string;
  is_active: boolean;
}

// Chat/Mensagens
export interface Conversation {
  id: number;
  user_id: number;
  seller_id: number;
  seller: Seller;
  last_message?: Message;
  unread_count: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: number;
  conversation_id: number;
  sender_id: number;
  sender_type: 'user' | 'seller';
  message: string;
  type: 'text' | 'image' | 'product' | 'order';
  metadata?: {
    product_id?: number;
    order_id?: number;
    image_url?: string;
  };
  is_read: boolean;
  created_at: string;
}

export interface SendMessageRequest {
  message: string;
  type?: 'text' | 'image' | 'product' | 'order';
  metadata?: any;
}

// Filtros e Busca
export interface SellerListParams {
  page?: number;
  per_page?: number;
  search?: string;
  city?: string;
  state?: string;
  min_rating?: number;
  is_verified?: boolean;
  has_delivery?: boolean;
  latitude?: number;
  longitude?: number;
  radius?: number;
  order_by?: 'name' | 'rating' | 'sales' | 'distance';
  order_direction?: 'asc' | 'desc';
}

export interface PriceComparison {
  product_id: number;
  product_name: string;
  offers: ProductOffer[];
  lowest_price: number;
  highest_price: number;
  average_price: number;
}

export interface ProductOffer {
  seller_id: number;
  seller_name: string;
  seller_rating: number;
  price: number;
  price_formatted: string;
  stock: number;
  delivery_time: string;
  delivery_cost: number;
  delivery_cost_formatted: string;
  is_best_price: boolean;
}

// ==================== TIPOS DE FARMÁCIA ADMIN ====================

// Cadastro de Farmacêutico
export interface AddFarmaceuticoRequest {
  nome: string;
  email: string;
  senha: string;
  cpf: string;
  crfP: string;
  numeroCelular: string;
}

export interface AddFarmaceuticoResponse {
  success: boolean;
  message: string;
  farmaceuticoId?: number;
}

// Adicionar Produto ao Estoque
export interface AddEstoqueRequest {
  produtoId: number;
  preco: number;
  quantidade: number;
}

export interface AddEstoqueResponse {
  success: boolean;
  message: string;
  estoqueId?: number;
}

// Atualizar Estoque
export interface UpdateEstoqueRequest {
  preco?: number;
  quantidade?: number;
  ativo?: boolean; // Permitir ativar/desativar produto
}

export interface UpdateEstoqueResponse {
  success: boolean;
  message: string;
}

// Item de Estoque
export interface EstoqueItem {
  id: number;
  produtoId: number;
  produtoNome: string;
  produtoDescricao?: string;
  preco: number;
  quantidade: number;
  ativo: boolean; // Indica se o produto está ativo para venda
  farmaciaId: number;
  createdAt: string;
  updatedAt: string;
}

export interface EstoqueListResponse {
  items: EstoqueItem[];
  total: number;
}

// ==================== TIPOS DE FARMACÊUTICO ====================

// Pedido com Receita
export interface PedidoPendente {
  id: number;
  numero: string;
  clienteId: number;
  clienteNome: string;
  clienteEmail: string;
  status: string;
  total: number;
  createdAt: string;
  receita?: ReceitaMedica;
  itens: PedidoItem[];
}

export interface ReceitaMedica {
  id: number;
  pedidoId: number;
  caminhoArquivo: string;
  validada: boolean;
  dataValidacao?: string;
  farmaceuticoValidadorId?: number;
  farmaceuticoValidadorNome?: string;
  justificativaRejeicao?: string;
  createdAt: string;
}

export interface PedidoItem {
  id: number;
  pedidoId: number;
  produtoId: number;
  produtoNome: string;
  quantidade: number;
  precoUnitario: number;
  subtotal: number;
}

// Aprovar/Rejeitar Receita
export interface AprovarReceitaRequest {
  // Vazio - apenas POST para aprovar
}

export interface AprovarReceitaResponse {
  success: boolean;
  message: string;
}

export interface RejeitarReceitaRequest {
  justificativa: string;
}

export interface RejeitarReceitaResponse {
  success: boolean;
  message: string;
}

export interface PedidosPendentesResponse {
  pedidos: PedidoPendente[];
  total: number;
}

// Farmacêutico (usuário)
export interface Farmaceutico {
  id: number;
  nome: string;
  email: string;
  cpf: string;
  crfP: string;
  numeroCelular: string;
  farmaciaId: number;
  farmaciaRazaoSocial?: string;
  ativo: boolean;
  createdAt: string;
}

// ==================== TIPOS DE PEDIDOS (CLIENTE) ====================

// Item do carrinho para criar pedido
export interface ItemCarrinho {
  estoqueLojistaId: number; // ID do estoque da farmácia (backend usa estoqueLojistaId)
  produtoId: number;
  produtoNome?: string; // Opcional para exibição
  farmaciaId: number;
  quantidade: number;
  precoUnitario: number;
}

// Request para criar pedido (POST /api/pedidos)
export interface CarrinhoRequest {
  itens: ItemCarrinho[];
  enderecoId?: number; // ID do endereço de entrega (obrigatório na API)
  enderecoEntrega?: string; // Texto do endereço (deprecated - usar enderecoId)
  observacoes?: string;
}

// Status do pedido (conforme enum no banco de dados)
export type PedidoStatus =
  | 'AGUARDANDO_CONFIRMACAO'
  | 'AGUARDANDO_PAGAMENTO'
  | 'AGUARDANDO_RECEITA'
  | 'CANCELADO'
  | 'CONFIRMADO'
  | 'EM_PREPARACAO'
  | 'EM_TRANSPORTE'
  | 'ENTREGUE'
  | 'PRONTO_PARA_ENTREGA'
  | 'RECUSADO';

// Resposta ao criar pedido
export interface Pedido {
  id: number;
  numero: string;
  clienteId: number;
  clienteNome?: string;
  status: PedidoStatus;
  total: number;
  valorTotal?: number; // Alias para total
  enderecoEntrega?: string;
  observacoes?: string;
  createdAt: string;
  updatedAt: string;
  itens: PedidoItem[];
  receita?: ReceitaMedica;
}

// Lista de pedidos do cliente (GET /api/pedidos/meus-pedidos)
export interface MeusPedidosResponse {
  pedidos: Pedido[];
  total: number;
}

// Atualizar status do pedido (Farmácia Admin)
export interface PedidoStatusUpdateRequest {
  status: Exclude<PedidoStatus, 'AGUARDANDO_CONFIRMACAO' | 'AGUARDANDO_PAGAMENTO' | 'AGUARDANDO_RECEITA' | 'CANCELADO' | 'RECUSADO'>;
}

// ==================== TIPOS DE ESTOQUE (Backend Real) ====================

// Resposta do backend GET /api/produtos/buscar?nome=
export interface EstoqueResponse {
  estoqueId: number;
  produtoId: number;
  produtoNome: string;
  produtoDescricao: string | null;
  preco: number;
  quantidade: number;
  ativo?: boolean; // Campo opcional - indica se produto está ativo para venda
  farmaciaId: number;
  farmaciaRazaoSocial: string;
  farmaciaEndereco: string | null;
  farmaciaDistancia: number | null;
}

// Request para adicionar produto ao estoque (POST /api/farmacia-admin/estoque)
export interface EstoqueRequest {
  produtoId: number;
  preco: number;
  quantidade: number;
  ativo?: boolean; // Campo opcional - indica se produto está ativo para venda
}

// Resposta ao adicionar/atualizar estoque
export interface EstoqueLojista {
  id: number;
  produtoId: number;
  farmaciaId: number;
  preco: number;
  quantidade: number;
  ativo: boolean;
  createdAt: string;
  updatedAt: string;
  produto?: {
    id: number;
    nome: string;
    descricao: string | null;
  };
}

// Produto do catálogo central (produtos_catalogo table)
export interface ProdutoCatalogo {
  id: number;
  ean: string; // Código de barras
  nome: string; // Ex: "Dipirona Monoidratada 500mg 10 comprimidos"
  principioAtivo: string | null;
  laboratorio: string | null; // Ex: "Medley"
  descricao: string | null;
  codigoRegistroMS: string; // Registro na ANVISA (campo: codigo_registroans)
  bulaUrl: string | null; // Link para a bula digital
  tipoProduto: 'MEDICAMENTO' | 'CORRELATO'; // Enum
  tipoReceita: 'NAO_EXIGIDO' | 'RECEITA_BRANCA' | 'RECEITA_AZUL' | 'RECEITA_AMARELA'; // Enum
  ativo?: boolean; // Indica se o produto está ativo no catálogo
}

// Alias para compatibilidade com código existente
export type CatalogoResponse = ProdutoCatalogo;

// Produto para exibição na home e busca
export interface ProdutoHome {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
  precoPromocional: number | null;
  categoria: string;
  imagem: string | null;
  emEstoque: boolean;
  farmaciaId: number;
  farmaciaNome: string;
}

// Farmácia para listagem e busca
export interface FarmaciaResponse {
  id: number;
  nome: string;
  razaoSocial: string;
  cnpj: string;
  telefone: string;
  email: string;
  endereco: {
    logradouro: string;
    numero: string;
    complemento: string | null;
    bairro: string;
    cidade: string;
    estado: string;
    cep: string;
  };
}

// Request para criar produto no catálogo (ADMIN apenas)
export interface ProdutoRequest {
  nome: string;
  descricao?: string;
  categoria?: string;
  principioAtivo?: string;
  requerReceita: boolean;
}

// Estatísticas do estoque da farmácia
export interface EstoqueStats {
  totalProdutos: number;
  totalItens: number;
  valorTotal: number;
  produtosBaixoEstoque: number; // quantidade < 10
  produtosEsgotados: number; // quantidade = 0
}

/**
 * ========================================
 * FARMACÊUTICOS
 * ========================================
 */

// Request para cadastrar novo farmacêutico
export interface RegisterFarmaceuticoRequest {
  nome: string;
  email: string;
  senha: string;
  cpf: string;
  crfP: string; // Registro no Conselho Regional de Farmácia (backend usa 'crfP')
  numeroCelular: string; // Número de celular do farmacêutico
}

// Response do backend - Farmacêutico cadastrado
export interface Farmaceutico {
  id: number;
  nome: string;
  email: string;
  cpf: string;
  crfP: string;
  numeroCelular: string;
  ativo: boolean;
  farmaciaId: number;
  createdAt: string;
  updatedAt: string;
}

// Request para atualizar farmacêutico
export interface UpdateFarmaceuticoRequest {
  nome: string;
  numeroCelular: string;
}

/**
 * ========================================
 * GERENCIAMENTO DA FARMÁCIA (LOJISTA_ADMIN)
 * ========================================
 */

// Request para atualizar informações da farmácia
export interface UpdateFarmaciaInfoRequest {
  nomeFantasia: string;
  emailContato: string;
  numeroCelularContato: string;
}

// Request para atualizar endereço da farmácia
export interface UpdateFarmaciaEnderecoRequest {
  cep: string;
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
  tipo: 'COMERCIAL' | 'RESIDENCIAL';
}

// Request para atualizar conta bancária da farmácia
export interface UpdateFarmaciaContaBancariaRequest {
  codigoBanco: string;
  agencia: string;
  numeroConta: string;
  digitoVerificador: string;
  tipoConta: 'CORRENTE' | 'POUPANCA';
  documentoTitular: string;
  nomeTitular: string;
}

// Response completa da farmácia
export interface FarmaciaCompleta {
  id: number;
  razaoSocial: string;
  nomeFantasia: string;
  cnpj: string;
  emailContato: string;
  numeroCelularContato: string;
  status: 'PENDENTE_APROVACAO' | 'ATIVO' | 'SUSPENSO';
  endereco?: {
    id: number;
    cep: string;
    logradouro: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    estado: string;
    tipo: string;
  };
  contaBancaria?: {
    id: number;
    codigoBanco: string;
    agencia: string;
    numeroConta: string;
    digitoVerificador: string;
    tipoConta: string;
    documentoTitular: string;
    nomeTitular: string;
  };
  createdAt: string;
  updatedAt: string;
}
