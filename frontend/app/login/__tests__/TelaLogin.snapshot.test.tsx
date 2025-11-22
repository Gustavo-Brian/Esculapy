/**
 * Testes Simples de Snapshot - Tela de Login
 * Testes rápidos que verificam se os componentes renderizam corretamente
 */

import React from 'react';
import { render } from '@testing-library/react-native';
import { FormularioLogin } from '../componentes/FormularioLogin';
import { CabecalhoLogin } from '../componentes/CabecalhoLogin';
import { RodapeLogin } from '../componentes/RodapeLogin';

// Mocks simples - apenas o necessário
const mockProps = {
  dadosFormulario: { email: '', senha: '' },
  erros: {},
  mostrarSenha: false,
  campoFocado: null,
  aoMudarCampo: jest.fn(),
  aoAlternarSenha: jest.fn(),
  aoFocarCampo: jest.fn(),
  aoDesfocarCampo: jest.fn(),
  aoClicarEsqueciSenha: jest.fn(),
  aoEnviar: jest.fn(),
  aoEntrarComoVisitante: jest.fn(),
  carregando: false,
};

describe('Tela de Login - Testes Simples', () => {
  describe('Snapshots', () => {
    it('CabecalhoLogin renderiza corretamente', () => {
      const { toJSON } = render(<CabecalhoLogin />);
      expect(toJSON()).toMatchSnapshot();
    });

    it('FormularioLogin renderiza corretamente', () => {
      const { toJSON } = render(<FormularioLogin {...mockProps} />);
      expect(toJSON()).toMatchSnapshot();
    });

    it('RodapeLogin renderiza corretamente', () => {
      const { toJSON } = render(<RodapeLogin aoClicarCadastro={jest.fn()} />);
      expect(toJSON()).toMatchSnapshot();
    });

    it('FormularioLogin com erros renderiza corretamente', () => {
      const propsComErros = {
        ...mockProps,
        erros: { email: 'Email inválido', senha: 'Senha obrigatória' },
      };
      const { toJSON } = render(<FormularioLogin {...propsComErros} />);
      expect(toJSON()).toMatchSnapshot();
    });

    it('FormularioLogin em estado de carregamento renderiza corretamente', () => {
      const propsCarregando = { ...mockProps, carregando: true };
      const { toJSON } = render(<FormularioLogin {...propsCarregando} />);
      expect(toJSON()).toMatchSnapshot();
    });
  });

  describe('Renderização Básica', () => {
    it('deve renderizar o cabeçalho sem erros', () => {
      const result = render(<CabecalhoLogin />);
      expect(result).toBeTruthy();
    });

    it('deve renderizar o formulário sem erros', () => {
      const result = render(<FormularioLogin {...mockProps} />);
      expect(result).toBeTruthy();
    });

    it('deve renderizar o rodapé sem erros', () => {
      const result = render(<RodapeLogin aoClicarCadastro={jest.fn()} />);
      expect(result).toBeTruthy();
    });

    it('deve renderizar campos de email e senha', () => {
      const { getByTestId } = render(<FormularioLogin {...mockProps} />);

      expect(getByTestId('input-email')).toBeTruthy();
      expect(getByTestId('input-senha')).toBeTruthy();
    });

    it('deve renderizar botão de entrar', () => {
      const { getByTestId } = render(<FormularioLogin {...mockProps} />);

      expect(getByTestId('botao-entrar')).toBeTruthy();
    });

    it('deve renderizar link de cadastro', () => {
      const { getByTestId } = render(<RodapeLogin aoClicarCadastro={jest.fn()} />);

      expect(getByTestId('link-cadastro')).toBeTruthy();
    });
  });

  describe('Textos e Labels', () => {
    it('deve exibir placeholders corretos nos inputs', () => {
      const { getByPlaceholderText } = render(<FormularioLogin {...mockProps} />);

      expect(getByPlaceholderText('Email')).toBeTruthy();
      expect(getByPlaceholderText('Senha')).toBeTruthy();
    });

    it('deve exibir texto do botão de entrar', () => {
      const { getByText } = render(<FormularioLogin {...mockProps} />);

      expect(getByText('Entrar')).toBeTruthy();
    });

    it('deve exibir "Entrando..." quando carregando', () => {
      const propsCarregando = { ...mockProps, carregando: true };
      const { getByText } = render(<FormularioLogin {...propsCarregando} />);

      expect(getByText('Entrando...')).toBeTruthy();
    });

    it('deve exibir link "Esqueceu sua senha?"', () => {
      const { getByText } = render(<FormularioLogin {...mockProps} />);

      expect(getByText('Esqueceu sua senha?')).toBeTruthy();
    });

    it('deve exibir opção "Entrar como Visitante"', () => {
      const { getByText } = render(<FormularioLogin {...mockProps} />);

      expect(getByText('Entrar como Visitante')).toBeTruthy();
    });
  });

  describe('Estados de Erro', () => {
    it('deve exibir mensagem de erro de email', () => {
      const propsComErro = {
        ...mockProps,
        erros: { email: 'Email inválido' },
      };
      const { getByText } = render(<FormularioLogin {...propsComErro} />);

      expect(getByText('Email inválido')).toBeTruthy();
    });

    it('deve exibir mensagem de erro de senha', () => {
      const propsComErro = {
        ...mockProps,
        erros: { senha: 'Senha muito curta' },
      };
      const { getByText } = render(<FormularioLogin {...propsComErro} />);

      expect(getByText('Senha muito curta')).toBeTruthy();
    });

    it('deve exibir múltiplos erros simultaneamente', () => {
      const propsComErros = {
        ...mockProps,
        erros: {
          email: 'Email inválido',
          senha: 'Senha obrigatória',
        },
      };
      const { getByText } = render(<FormularioLogin {...propsComErros} />);

      expect(getByText('Email inválido')).toBeTruthy();
      expect(getByText('Senha obrigatória')).toBeTruthy();
    });
  });

  describe('Elementos Visuais', () => {
    it('deve ter botão de alternar visibilidade da senha', () => {
      const { getByTestId } = render(<FormularioLogin {...mockProps} />);

      expect(getByTestId('toggle-senha')).toBeTruthy();
    });

    it('deve renderizar todos os testIDs necessários', () => {
      const { getByTestId } = render(<FormularioLogin {...mockProps} />);

      // Verifica que todos os testIDs estão presentes
      expect(getByTestId('input-email')).toBeTruthy();
      expect(getByTestId('input-senha')).toBeTruthy();
      expect(getByTestId('toggle-senha')).toBeTruthy();
      expect(getByTestId('botao-entrar')).toBeTruthy();
    });
  });
});
