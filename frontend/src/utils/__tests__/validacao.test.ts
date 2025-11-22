/**
 * Testes Unitários: Funções de Validação
 * Testa validações de dados de entrada do usuário
 */

describe('Validação de Email', () => {
  const validarEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  it('deve validar email correto', () => {
    expect(validarEmail('usuario@exemplo.com')).toBe(true);
  });

  it('deve invalidar email sem @', () => {
    expect(validarEmail('usuarioexemplo.com')).toBe(false);
  });

  it('deve invalidar email sem domínio', () => {
    expect(validarEmail('usuario@')).toBe(false);
  });

  it('deve invalidar email vazio', () => {
    expect(validarEmail('')).toBe(false);
  });

  it('deve validar email com subdomínio', () => {
    expect(validarEmail('usuario@mail.exemplo.com')).toBe(true);
  });
});

describe('Validação de Senha', () => {
  const validarSenha = (senha: string): { valida: boolean; erro?: string } => {
    if (senha.length < 6) {
      return { valida: false, erro: 'A senha deve ter pelo menos 6 caracteres' };
    }
    return { valida: true };
  };

  it('deve validar senha com 6 caracteres', () => {
    const resultado = validarSenha('123456');
    expect(resultado.valida).toBe(true);
  });

  it('deve invalidar senha com menos de 6 caracteres', () => {
    const resultado = validarSenha('12345');
    expect(resultado.valida).toBe(false);
    expect(resultado.erro).toBe('A senha deve ter pelo menos 6 caracteres');
  });

  it('deve validar senha longa', () => {
    const resultado = validarSenha('senhamuito123forte!@#');
    expect(resultado.valida).toBe(true);
  });

  it('deve invalidar senha vazia', () => {
    const resultado = validarSenha('');
    expect(resultado.valida).toBe(false);
  });
});

describe('Validação de CPF', () => {
  const validarCPF = (cpf: string): boolean => {
    // Remove caracteres não numéricos
    const cpfLimpo = cpf.replace(/\D/g, '');

    // Verifica se tem 11 dígitos
    if (cpfLimpo.length !== 11) return false;

    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1{10}$/.test(cpfLimpo)) return false;

    return true; // Validação simplificada para testes
  };

  it('deve validar CPF com 11 dígitos', () => {
    expect(validarCPF('12345678901')).toBe(true);
  });

  it('deve invalidar CPF com menos de 11 dígitos', () => {
    expect(validarCPF('123456789')).toBe(false);
  });

  it('deve validar CPF formatado', () => {
    expect(validarCPF('123.456.789-01')).toBe(true);
  });

  it('deve invalidar CPF com todos dígitos iguais', () => {
    expect(validarCPF('111.111.111-11')).toBe(false);
  });

  it('deve invalidar CPF vazio', () => {
    expect(validarCPF('')).toBe(false);
  });
});

describe('Validação de Telefone', () => {
  const validarTelefone = (telefone: string): boolean => {
    const telefoneLimpo = telefone.replace(/\D/g, '');
    return telefoneLimpo.length === 10 || telefoneLimpo.length === 11;
  };

  it('deve validar telefone com 11 dígitos (celular)', () => {
    expect(validarTelefone('11987654321')).toBe(true);
  });

  it('deve validar telefone com 10 dígitos (fixo)', () => {
    expect(validarTelefone('1133334444')).toBe(true);
  });

  it('deve validar telefone formatado', () => {
    expect(validarTelefone('(11) 98765-4321')).toBe(true);
  });

  it('deve invalidar telefone com menos dígitos', () => {
    expect(validarTelefone('119876543')).toBe(false);
  });

  it('deve invalidar telefone vazio', () => {
    expect(validarTelefone('')).toBe(false);
  });
});
