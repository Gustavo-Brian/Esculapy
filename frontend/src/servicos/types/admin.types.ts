/**
 * Tipos TypeScript para o módulo Admin
 * Gerenciamento de Farmácias, Usuários e Catálogo de Produtos
 */

// ============================================
// ENUMS
// ============================================

/**
 * Status de aprovação de farmácias
 */
export enum LojistaStatus {
  PENDENTE_APROVACAO = 'PENDENTE_APROVACAO',
  ATIVO = 'ATIVO',
  SUSPENSO = 'SUSPENSO',
}

/**
 * Categorias de produtos
 */
export enum TipoProduto {
  MEDICAMENTO = 'MEDICAMENTO',
  PERFUMARIA = 'PERFUMARIA',
  SUPLEMENTO = 'SUPLEMENTO',
  EQUIPAMENTO = 'EQUIPAMENTO',
  CONVENIENCIA = 'CONVENIENCIA',
}

/**
 * Tipo de receita médica necessária
 */
export enum TipoReceita {
  NAO_EXIGIDO = 'NAO_EXIGIDO', // Sem receita (OTC)
  BRANCA_SIMPLES = 'BRANCA_SIMPLES', // Receita branca simples
  BRANCA_CONTROLE_ESPECIAL = 'BRANCA_CONTROLE_ESPECIAL', // Receita de controle especial
  AZUL_B = 'AZUL_B', // Receita azul - controlado tipo B
  AMARELA_A = 'AMARELA_A', // Receita amarela - controlado tipo A (mais restrito)
}

// ============================================
// FARMÁCIAS
// ============================================

/**
 * Endereço Comercial da Farmácia
 */
export interface EnderecoComercial {
  id: number;
  cep: string;
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
}

/**
 * Conta Bancária da Farmácia
 */
export interface ContaBancaria {
  id: number;
  codigoBanco: string; // Código do banco (ex: '001', '237')
  agencia: string;
  numeroConta: string;
  digitoVerificador: string;
  tipoConta: 'CORRENTE' | 'POUPANCA';
  documentoTitular: string; // CNPJ da farmácia
  nomeTitular: string;
}

/**
 * Usuário Admin da Farmácia
 */
export interface UsuarioAdmin {
  id: number;
  email: string;
  enabled: boolean;
  dataCriacao: string; // ISO date
}

/**
 * Farmácia (visualização completa para admin)
 */
export interface Farmacia {
  id: number;
  cnpj: string;
  razaoSocial: string;
  nomeFantasia: string;
  crfJ: string; // CRF da pessoa jurídica (registro da farmácia)
  emailContato: string;
  numeroCelularContato: string;
  dataCadastro: string; // ISO date
  status: LojistaStatus;
  enderecoComercial?: EnderecoComercial;
  contaBancaria?: ContaBancaria;
  usuarioAdmin?: UsuarioAdmin;
}

/**
 * Request para filtrar farmácias por status
 */
export interface ListFarmaciasParams {
  status?: LojistaStatus;
}

// ============================================
// USUÁRIOS
// ============================================

/**
 * Role/Perfil do usuário
 */
export interface Role {
  id: number;
  nome: 'ROLE_ADMIN' | 'ROLE_CLIENTE' | 'ROLE_LOJISTA_ADMIN' | 'ROLE_FARMACEUTICO';
}

/**
 * Perfil de Cliente (se houver)
 */
export interface ClientePerfil {
  id: number;
  nome: string;
  cpf: string;
  numeroCelular?: string;
  dataNascimento?: string; // ISO date
}

/**
 * Perfil de Farmácia Admin (se houver)
 */
export interface FarmaciaAdminPerfil {
  id: number;
  nomeFantasia: string;
  cnpj: string;
  status: LojistaStatus;
}

/**
 * Perfil de Farmacêutico (se houver)
 */
export interface FarmaceuticoPerfil {
  id: number;
  nome: string;
  cpf: string;
  crfP: string; // CRF da pessoa física (registro do farmacêutico)
  farmaciaId: number;
}

/**
 * Usuário (visualização completa para admin)
 */
export interface Usuario {
  id: number;
  email: string;
  enabled: boolean; // true = conta ativa, false = conta banida
  dataCriacao: string; // ISO date
  roles: Role[];
  // Perfis opcionais (depende das roles do usuário)
  cliente?: ClientePerfil;
  farmaciaAdmin?: FarmaciaAdminPerfil;
  farmaceutico?: FarmaceuticoPerfil;
}

/**
 * Request para buscar usuário por email
 */
export interface BuscarUsuarioParams {
  email: string;
}

// ============================================
// PRODUTOS (CATÁLOGO MASTER)
// ============================================

/**
 * Produto do Catálogo Master (gerenciado pelo admin)
 */
export interface Produto {
  id: number;
  ean: string; // Código de barras (único)
  nome: string;
  principioAtivo: string; // Princípio ativo do medicamento
  laboratorio: string;
  descricao: string;
  codigoRegistroMS: string; // Código de registro na ANVISA (único)
  bulaUrl?: string; // URL da bula do medicamento
  tipoProduto: TipoProduto;
  tipoReceita: TipoReceita;
  ativo: boolean; // true = ativo, false = desativado (soft delete)
}

/**
 * Request para criar produto no catálogo
 */
export interface ProdutoRequest {
  ean: string;
  nome: string;
  principioAtivo: string;
  laboratorio: string;
  descricao: string;
  codigoRegistroMS: string;
  bulaUrl?: string;
  tipoProduto: TipoProduto;
  tipoReceita: TipoReceita;
}

// ============================================
// RESPONSES E UTILITÁRIOS
// ============================================

/**
 * Response padrão de sucesso
 */
export interface SuccessResponse<T = any> {
  success: true;
  data: T;
  message?: string;
}

/**
 * Response padrão de erro
 */
export interface ErrorResponse {
  success: false;
  error: string;
  message: string;
  timestamp?: string;
  path?: string;
  status?: number;
}

/**
 * Estatísticas do dashboard admin
 */
export interface AdminStats {
  farmaciasPendentes: number;
  farmaciasAtivas: number;
  farmaciasSuspensas: number;
  totalUsuarios: number;
  usuariosAtivos: number;
  usuariosBanidos: number;
  totalProdutos: number;
  produtosAtivos: number;
}

/**
 * Filtros para listagem de produtos
 */
export interface ListProdutosParams {
  ativo?: boolean;
  tipoProduto?: TipoProduto;
  tipoReceita?: TipoReceita;
  search?: string; // Busca por nome ou código
  page?: number;
  limit?: number;
}
