/**
 * Testes Unitários: Funções de Formatação
 * Testa formatação de valores e textos
 */

describe('Formatação de Moeda', () => {
  const formatarMoeda = (valor: number): string => {
    return valor.toFixed(2).replace('.', ',');
  };

  it('deve formatar valor com centavos', () => {
    expect(formatarMoeda(15.90)).toBe('15,90');
  });

  it('deve formatar valor inteiro', () => {
    expect(formatarMoeda(100)).toBe('100,00');
  });

  it('deve formatar valor com um centavo', () => {
    expect(formatarMoeda(9.99)).toBe('9,99');
  });

  it('deve formatar zero', () => {
    expect(formatarMoeda(0)).toBe('0,00');
  });

  it('deve arredondar para duas casas decimais', () => {
    expect(formatarMoeda(15.999)).toBe('16,00');
  });
});

describe('Formatação de CPF', () => {
  const formatarCPF = (cpf: string): string => {
    const cpfLimpo = cpf.replace(/\D/g, '');
    if (cpfLimpo.length !== 11) return cpf;
    return cpfLimpo.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  it('deve formatar CPF corretamente', () => {
    expect(formatarCPF('12345678901')).toBe('123.456.789-01');
  });

  it('deve manter CPF já formatado', () => {
    expect(formatarCPF('123.456.789-01')).toBe('123.456.789-01');
  });

  it('não deve formatar CPF inválido', () => {
    expect(formatarCPF('123')).toBe('123');
  });

  it('deve remover caracteres especiais antes de formatar', () => {
    expect(formatarCPF('123-456-789-01')).toBe('123.456.789-01');
  });
});

describe('Formatação de Telefone', () => {
  const formatarTelefone = (telefone: string): string => {
    const telefoneLimpo = telefone.replace(/\D/g, '');

    if (telefoneLimpo.length === 11) {
      return telefoneLimpo.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    } else if (telefoneLimpo.length === 10) {
      return telefoneLimpo.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }

    return telefone;
  };

  it('deve formatar celular com 11 dígitos', () => {
    expect(formatarTelefone('11987654321')).toBe('(11) 98765-4321');
  });

  it('deve formatar telefone fixo com 10 dígitos', () => {
    expect(formatarTelefone('1133334444')).toBe('(11) 3333-4444');
  });

  it('não deve formatar telefone inválido', () => {
    expect(formatarTelefone('123')).toBe('123');
  });

  it('deve remover formatação existente e reformatar', () => {
    expect(formatarTelefone('(11) 98765-4321')).toBe('(11) 98765-4321');
  });
});

describe('Formatação de Data', () => {
  const formatarData = (data: Date): string => {
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const ano = data.getFullYear();
    return `${dia}/${mes}/${ano}`;
  };

  it('deve formatar data corretamente', () => {
    const data = new Date(2024, 0, 15); // 15 de janeiro de 2024
    expect(formatarData(data)).toBe('15/01/2024');
  });

  it('deve adicionar zero à esquerda em dia e mês', () => {
    const data = new Date(2024, 8, 5); // 5 de setembro de 2024
    expect(formatarData(data)).toBe('05/09/2024');
  });

  it('deve formatar último dia do ano', () => {
    const data = new Date(2024, 11, 31); // 31 de dezembro de 2024
    expect(formatarData(data)).toBe('31/12/2024');
  });
});

describe('Formatação de Texto', () => {
  const capitalizarPrimeiraLetra = (texto: string): string => {
    if (!texto) return texto;
    return texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase();
  };

  it('deve capitalizar primeira letra', () => {
    expect(capitalizarPrimeiraLetra('dipirona')).toBe('Dipirona');
  });

  it('deve manter apenas primeira letra maiúscula', () => {
    expect(capitalizarPrimeiraLetra('DIPIRONA')).toBe('Dipirona');
  });

  it('deve funcionar com texto vazio', () => {
    expect(capitalizarPrimeiraLetra('')).toBe('');
  });

  it('deve funcionar com uma letra', () => {
    expect(capitalizarPrimeiraLetra('a')).toBe('A');
  });
});

describe('Truncar Texto', () => {
  const truncarTexto = (texto: string, tamanhoMax: number): string => {
    if (texto.length <= tamanhoMax) return texto;
    return texto.substring(0, tamanhoMax) + '...';
  };

  it('deve truncar texto longo', () => {
    const texto = 'Este é um texto muito longo que precisa ser truncado';
    expect(truncarTexto(texto, 20)).toBe('Este é um texto muit...');
  });

  it('não deve truncar texto curto', () => {
    expect(truncarTexto('Texto curto', 20)).toBe('Texto curto');
  });

  it('deve truncar no tamanho exato', () => {
    expect(truncarTexto('1234567890', 10)).toBe('1234567890');
  });

  it('deve adicionar reticências quando truncar', () => {
    const resultado = truncarTexto('Texto longo demais', 10);
    expect(resultado).toContain('...');
    expect(resultado.length).toBe(13); // 10 + 3 (...)
  });
});
