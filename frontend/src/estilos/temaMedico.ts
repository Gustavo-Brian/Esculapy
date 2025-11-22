/**
 * Tema Médico - Inspirado em plataformas de residência médica
 * Cores suaves, cards modernos, interface profissional
 */

export const temaMedico = {
  // Cores Principais
  cores: {
    // Primárias
    primaria: '#6366F1',      // Roxo/Índigo
    secundaria: '#10B981',    // Verde
    terciaria: '#F59E0B',     // Amarelo/Laranja

    // Backgrounds
    background: '#F9FAFB',    // Cinza muito claro
    backgroundCard: '#FFFFFF',
    backgroundInput: '#F3F4F6', // Cinza claro para inputs
    backgroundDestaque: '#EEF2FF', // Roxo muito claro

    // Textos
    textoTitulo: '#111827',   // Preto suave
    textoSubtitulo: '#6B7280', // Cinza médio
    textoClaro: '#9CA3AF',    // Cinza claro
    textoBranco: '#FFFFFF',

    // Aliases para compatibilidade
    textoPrimario: '#111827',  // Mesmo que textoTitulo
    textoSecundario: '#6B7280', // Mesmo que textoSubtitulo
    texto: '#111827',          // Alias para textoTitulo
    branco: '#FFFFFF',         // Alias para textoBranco
    cinza: '#6B7280',          // Alias para textoSubtitulo
    fundo: '#F9FAFB',          // Alias para background
    fundoClaro: '#F3F4F6',     // Alias para backgroundInput
    aviso: '#F59E0B',          // Alias para alerta

    // Status
    sucesso: '#10B981',       // Verde
    erro: '#EF4444',          // Vermelho
    alerta: '#F59E0B',        // Laranja
    info: '#3B82F6',          // Azul

    // Destaques de Card
    cardRoxo: '#8B5CF6',
    cardVerde: '#10B981',
    cardAmarelo: '#F59E0B',
    cardAzul: '#3B82F6',

    // Bordas
    borda: '#E5E7EB',
    bordaFoco: '#6366F1',
  },

  // Gradientes
  gradientes: {
    primaria: ['#6366F1', '#8B5CF6'],
    sucesso: ['#10B981', '#059669'],
    alerta: ['#F59E0B', '#D97706'],
  },

  // Sombras
  sombras: {
    pequena: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    media: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    grande: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 4,
    },
  },

  // Bordas arredondadas
  bordas: {
    pequena: 8,
    media: 12,
    grande: 16,
    extra: 24,
    circular: 999,
  },

  // Espaçamentos
  espacamentos: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    xxl: 32,
  },

  // Fontes
  fontes: {
    tamanhos: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 18,
      xl: 20,
      xxl: 24,
      titulo: 28,
    },
    pesos: {
      regular: '400' as const,
      medium: '500' as const,
      semibold: '600' as const,
      bold: '700' as const,
    },
  },
};

// Estilos de Cards com ícones coloridos
export const estilosCardMedico = {
  cardBase: {
    backgroundColor: temaMedico.cores.backgroundCard,
    borderRadius: temaMedico.bordas.media,
    padding: temaMedico.espacamentos.lg,
    ...temaMedico.sombras.pequena,
  },

  iconeCircular: (cor: string) => ({
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: cor + '20', // 20 = 12% opacity
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  }),

  botaoPrimario: {
    backgroundColor: temaMedico.cores.primaria,
    paddingVertical: temaMedico.espacamentos.md,
    paddingHorizontal: temaMedico.espacamentos.lg,
    borderRadius: temaMedico.bordas.media,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    flexDirection: 'row' as const,
    ...temaMedico.sombras.pequena,
  },

  botaoSecundario: {
    backgroundColor: temaMedico.cores.backgroundDestaque,
    paddingVertical: temaMedico.espacamentos.md,
    paddingHorizontal: temaMedico.espacamentos.lg,
    borderRadius: temaMedico.bordas.media,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    flexDirection: 'row' as const,
  },

  progressBar: {
    height: 8,
    backgroundColor: temaMedico.cores.borda,
    borderRadius: 4,
    overflow: 'hidden' as const,
  },

  progressFill: (cor: string) => ({
    height: '100%',
    backgroundColor: cor,
    borderRadius: 4,
  }),
};

export default temaMedico;
