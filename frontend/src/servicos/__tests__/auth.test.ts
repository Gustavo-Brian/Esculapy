/**
 * Testes Unitários: Serviços de Autenticação
 * Testa funções de login, cadastro e validação de tokens
 */

describe('Validação de Credenciais', () => {
  const validarCredenciais = (email: string, senha: string): { valido: boolean; erro?: string } => {
    if (!email || !senha) {
      return { valido: false, erro: 'Email e senha são obrigatórios' };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { valido: false, erro: 'Email inválido' };
    }

    if (senha.length < 6) {
      return { valido: false, erro: 'Senha deve ter no mínimo 6 caracteres' };
    }

    return { valido: true };
  };

  it('deve validar credenciais corretas', () => {
    const resultado = validarCredenciais('usuario@exemplo.com', 'senha123');
    expect(resultado.valido).toBe(true);
    expect(resultado.erro).toBeUndefined();
  });

  it('deve rejeitar email vazio', () => {
    const resultado = validarCredenciais('', 'senha123');
    expect(resultado.valido).toBe(false);
    expect(resultado.erro).toBe('Email e senha são obrigatórios');
  });

  it('deve rejeitar senha vazia', () => {
    const resultado = validarCredenciais('usuario@exemplo.com', '');
    expect(resultado.valido).toBe(false);
    expect(resultado.erro).toBe('Email e senha são obrigatórios');
  });

  it('deve rejeitar email inválido', () => {
    const resultado = validarCredenciais('emailinvalido', 'senha123');
    expect(resultado.valido).toBe(false);
    expect(resultado.erro).toBe('Email inválido');
  });

  it('deve rejeitar senha curta', () => {
    const resultado = validarCredenciais('usuario@exemplo.com', '12345');
    expect(resultado.valido).toBe(false);
    expect(resultado.erro).toBe('Senha deve ter no mínimo 6 caracteres');
  });
});

describe('Validação de Token JWT', () => {
  const validarToken = (token: string): boolean => {
    if (!token) return false;

    // Formato básico de JWT: header.payload.signature
    const partes = token.split('.');
    if (partes.length !== 3) return false;

    // Verifica se cada parte tem conteúdo
    return partes.every(parte => parte.length > 0);
  };

  it('deve validar token JWT correto', () => {
    const tokenValido = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoidXNlckBleGFtcGxlLmNvbSJ9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
    expect(validarToken(tokenValido)).toBe(true);
  });

  it('deve rejeitar token vazio', () => {
    expect(validarToken('')).toBe(false);
  });

  it('deve rejeitar token com formato inválido', () => {
    expect(validarToken('tokeninvalido')).toBe(false);
  });

  it('deve rejeitar token com apenas duas partes', () => {
    expect(validarToken('header.payload')).toBe(false);
  });

  it('deve rejeitar token com partes vazias', () => {
    expect(validarToken('..signature')).toBe(false);
  });
});

describe('Geração de Nome de Usuário', () => {
  const gerarUsername = (nomeCompleto: string): string => {
    if (!nomeCompleto) return '';

    // Remove acentos e caracteres especiais
    const normalizado = nomeCompleto
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();

    // Pega primeiro nome e sobrenome
    const partes = normalizado.split(' ').filter(p => p.length > 0);
    if (partes.length === 0) return '';
    if (partes.length === 1) return partes[0];

    return `${partes[0]}.${partes[partes.length - 1]}`;
  };

  it('deve gerar username com nome e sobrenome', () => {
    expect(gerarUsername('João Silva')).toBe('joao.silva');
  });

  it('deve gerar username com nome completo', () => {
    expect(gerarUsername('Maria Santos Oliveira')).toBe('maria.oliveira');
  });

  it('deve gerar username apenas com primeiro nome', () => {
    expect(gerarUsername('Carlos')).toBe('carlos');
  });

  it('deve remover acentos', () => {
    expect(gerarUsername('José Gonçalves')).toBe('jose.goncalves');
  });

  it('deve converter para minúsculas', () => {
    expect(gerarUsername('PAULO COSTA')).toBe('paulo.costa');
  });

  it('deve retornar string vazia para entrada vazia', () => {
    expect(gerarUsername('')).toBe('');
  });

  it('deve lidar com espaços extras', () => {
    expect(gerarUsername('  Ana   Paula  ')).toBe('ana.paula');
  });
});

describe('Validação de Dados de Cadastro', () => {
  const validarCadastro = (dados: {
    nome: string;
    email: string;
    cpf: string;
    senha: string;
    confirmarSenha: string;
  }): { valido: boolean; erros: string[] } => {
    const erros: string[] = [];

    if (!dados.nome || dados.nome.trim().length < 3) {
      erros.push('Nome deve ter no mínimo 3 caracteres');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(dados.email)) {
      erros.push('Email inválido');
    }

    const cpfLimpo = dados.cpf.replace(/\D/g, '');
    if (cpfLimpo.length !== 11) {
      erros.push('CPF deve ter 11 dígitos');
    }

    if (dados.senha.length < 6) {
      erros.push('Senha deve ter no mínimo 6 caracteres');
    }

    if (dados.senha !== dados.confirmarSenha) {
      erros.push('Senhas não coincidem');
    }

    return { valido: erros.length === 0, erros };
  };

  it('deve validar cadastro completo correto', () => {
    const dados = {
      nome: 'João Silva',
      email: 'joao@exemplo.com',
      cpf: '123.456.789-01',
      senha: 'senha123',
      confirmarSenha: 'senha123',
    };

    const resultado = validarCadastro(dados);
    expect(resultado.valido).toBe(true);
    expect(resultado.erros).toHaveLength(0);
  });

  it('deve rejeitar nome curto', () => {
    const dados = {
      nome: 'Jo',
      email: 'joao@exemplo.com',
      cpf: '12345678901',
      senha: 'senha123',
      confirmarSenha: 'senha123',
    };

    const resultado = validarCadastro(dados);
    expect(resultado.valido).toBe(false);
    expect(resultado.erros).toContain('Nome deve ter no mínimo 3 caracteres');
  });

  it('deve rejeitar email inválido', () => {
    const dados = {
      nome: 'João Silva',
      email: 'emailinvalido',
      cpf: '12345678901',
      senha: 'senha123',
      confirmarSenha: 'senha123',
    };

    const resultado = validarCadastro(dados);
    expect(resultado.valido).toBe(false);
    expect(resultado.erros).toContain('Email inválido');
  });

  it('deve rejeitar CPF inválido', () => {
    const dados = {
      nome: 'João Silva',
      email: 'joao@exemplo.com',
      cpf: '123456',
      senha: 'senha123',
      confirmarSenha: 'senha123',
    };

    const resultado = validarCadastro(dados);
    expect(resultado.valido).toBe(false);
    expect(resultado.erros).toContain('CPF deve ter 11 dígitos');
  });

  it('deve rejeitar senha curta', () => {
    const dados = {
      nome: 'João Silva',
      email: 'joao@exemplo.com',
      cpf: '12345678901',
      senha: '12345',
      confirmarSenha: '12345',
    };

    const resultado = validarCadastro(dados);
    expect(resultado.valido).toBe(false);
    expect(resultado.erros).toContain('Senha deve ter no mínimo 6 caracteres');
  });

  it('deve rejeitar senhas diferentes', () => {
    const dados = {
      nome: 'João Silva',
      email: 'joao@exemplo.com',
      cpf: '12345678901',
      senha: 'senha123',
      confirmarSenha: 'senha456',
    };

    const resultado = validarCadastro(dados);
    expect(resultado.valido).toBe(false);
    expect(resultado.erros).toContain('Senhas não coincidem');
  });

  it('deve retornar múltiplos erros quando houver', () => {
    const dados = {
      nome: 'Jo',
      email: 'emailinvalido',
      cpf: '123',
      senha: '12345',
      confirmarSenha: 'senha123',
    };

    const resultado = validarCadastro(dados);
    expect(resultado.valido).toBe(false);
    expect(resultado.erros.length).toBeGreaterThan(1);
  });
});

describe('Persistência de Sessão', () => {
  const calcularTempoExpiracao = (token: string): number | null => {
    try {
      const partes = token.split('.');
      if (partes.length !== 3) return null;

      // Decodifica payload (parte central)
      const payload = JSON.parse(atob(partes[1]));

      if (!payload.exp) return null;

      // Retorna tempo restante em segundos
      const agora = Math.floor(Date.now() / 1000);
      return payload.exp - agora;
    } catch {
      return null;
    }
  };

  it('deve calcular tempo de expiração de token válido', () => {
    // Token mock com exp 1 hora no futuro
    const futuro = Math.floor(Date.now() / 1000) + 3600;
    const payload = btoa(JSON.stringify({ userId: 1, exp: futuro }));
    const token = `header.${payload}.signature`;

    const tempoRestante = calcularTempoExpiracao(token);
    expect(tempoRestante).toBeGreaterThan(3500);
    expect(tempoRestante).toBeLessThanOrEqual(3600);
  });

  it('deve retornar null para token sem expiração', () => {
    const payload = btoa(JSON.stringify({ userId: 1 }));
    const token = `header.${payload}.signature`;

    expect(calcularTempoExpiracao(token)).toBeNull();
  });

  it('deve retornar null para token inválido', () => {
    expect(calcularTempoExpiracao('tokeninvalido')).toBeNull();
  });

  it('deve identificar token expirado', () => {
    // Token com exp no passado
    const passado = Math.floor(Date.now() / 1000) - 3600;
    const payload = btoa(JSON.stringify({ userId: 1, exp: passado }));
    const token = `header.${payload}.signature`;

    const tempoRestante = calcularTempoExpiracao(token);
    expect(tempoRestante).toBeLessThan(0);
  });
});
