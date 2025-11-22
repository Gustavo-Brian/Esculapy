/**
 * Variáveis de Design System - Esculapi
 * Inspirado em arquitetura SCSS
 * Todas as constantes de design centralizadas
 */

// ==================== CORES ====================
export const cores = {
  // Cores Primárias
  primaria: '#007AFF',
  primariaEscura: '#041562',
  primariaClara: '#11468F',

  // Cores de Destaque
  destaque: '#DA1212',
  sucesso: '#28A745',
  aviso: '#FFC107',
  erro: '#FF3B30',

  // Cores de Texto
  textoEscuro: '#333333',
  textoMedio: '#666666',
  textoClaro: '#999999',
  textoBranco: '#FFFFFF',

  // Cores de Fundo
  fundoBranco: '#FFFFFF',
  fundoClaro: '#EEEEEE',
  fundoCinza: '#F8F9FA',
  fundoEscuro: '#333333',

  // Cores de Borda
  bordaPadrao: '#DDDDDD',
  bordaClara: '#E1E5E9',
  bordaEscura: '#CCCCCC',

  // Cores Específicas
  whatsapp: '#25D366',
  transparente: 'transparent',
};

// ==================== TIPOGRAFIA ====================
export const tipografia = {
  // Tamanhos de Fonte
  tamanhos: {
    minusculo: 10,
    pequeno: 12,
    normal: 14,
    medio: 16,
    grande: 18,
    titulo: 20,
    tituloGrande: 24,
    destaque: 28,
  },

  // Pesos de Fonte
  pesos: {
    normal: '400' as const,
    medio: '500' as const,
    semibold: '600' as const,
    bold: 'bold' as const,
  },

  // Altura de Linha
  alturaLinha: {
    compacta: 16,
    normal: 20,
    confortavel: 24,
    ampla: 28,
  },
};

// ==================== ESPAÇAMENTOS ====================
export const espacamentos = {
  // Espaçamentos Básicos
  minimo: 4,
  pequeno: 8,
  medio: 12,
  padrao: 15,
  grande: 20,
  extraGrande: 30,
  massivo: 40,

  // Padding Específico
  paddingContainer: 20,
  paddingCard: 15,
  paddingBotao: {
    horizontal: 20,
    vertical: 12,
  },

  // Margin Específico
  marginEntreSecoes: 20,
  marginEntreElementos: 15,
  marginPequeno: 10,
};

// ==================== BORDAS ====================
export const bordas = {
  // Raios de Borda
  raios: {
    pequeno: 8,
    medio: 12,
    grande: 18,
    extraGrande: 20,
    circular: 50,
  },

  // Larguras de Borda
  larguras: {
    fina: 1,
    media: 2,
    grossa: 3,
  },
};

// ==================== SOMBRAS ====================
export const sombras = {
  // Sombra Padrão
  padrao: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  // Sombra Leve
  leve: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },

  // Sombra Forte
  forte: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },

  // Sem Sombra
  nenhuma: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
};

// ==================== DIMENSÕES ====================
export const dimensoes = {
  // Alturas Padrão
  alturas: {
    input: 50,
    botao: 50,
    botaoPequeno: 40,
    botaoGrande: 60,
    header: 60,
    tabBar: 60,
  },

  // Larguras
  larguras: {
    iconePequeno: 20,
    iconeMedio: 24,
    iconeGrande: 40,
    logoMedia: 150,
    logoGrande: 400,
  },
};

// ==================== ANIMAÇÕES ====================
export const animacoes = {
  // Durações
  duracoes: {
    rapida: 150,
    normal: 300,
    lenta: 500,
  },

  // Opacidades
  opacidades: {
    desabilitado: 0.5,
    transparente: 0,
    semiTransparente: 0.7,
    opaco: 1,
  },
};

// ==================== BREAKPOINTS ====================
// Para uso futuro com responsividade
export const breakpoints = {
  mobile: 320,
  mobileGrande: 480,
  tablet: 768,
  desktop: 1024,
  desktopGrande: 1440,
};

// ==================== EXPORT DEFAULT ====================
export default {
  cores,
  tipografia,
  espacamentos,
  bordas,
  sombras,
  dimensoes,
  animacoes,
  breakpoints,
};
