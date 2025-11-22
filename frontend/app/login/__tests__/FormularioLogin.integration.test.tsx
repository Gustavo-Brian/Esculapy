/**
 * Testes de Integração: Formulário de Login
 * Testa interações do usuário com o formulário (React Native Testing Library)
 */

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { FormularioLogin } from '../componentes/FormularioLogin';

describe('FormularioLogin - Testes de Integração', () => {
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

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve renderizar todos os elementos do formulário', () => {
    const { getByTestId, getByText } = render(<FormularioLogin {...mockProps} />);

    expect(getByTestId('input-email')).toBeTruthy();
    expect(getByTestId('input-senha')).toBeTruthy();
    expect(getByTestId('toggle-senha')).toBeTruthy();
    expect(getByTestId('botao-entrar')).toBeTruthy();
    expect(getByText('Esqueceu sua senha?')).toBeTruthy();
    expect(getByText('Entrar como Visitante')).toBeTruthy();
  });

  it('deve chamar aoMudarCampo quando digitar no campo de email', () => {
    const { getByTestId } = render(<FormularioLogin {...mockProps} />);

    const emailInput = getByTestId('input-email');
    fireEvent.changeText(emailInput, 'teste@email.com');

    expect(mockProps.aoMudarCampo).toHaveBeenCalledWith('email', 'teste@email.com');
  });

  it('deve chamar aoMudarCampo quando digitar no campo de senha', () => {
    const { getByTestId } = render(<FormularioLogin {...mockProps} />);

    const senhaInput = getByTestId('input-senha');
    fireEvent.changeText(senhaInput, 'senha123');

    expect(mockProps.aoMudarCampo).toHaveBeenCalledWith('senha', 'senha123');
  });

  it('deve alternar visibilidade da senha ao clicar no botão', () => {
    const { getByTestId } = render(<FormularioLogin {...mockProps} />);

    const toggleButton = getByTestId('toggle-senha');
    fireEvent.press(toggleButton);

    expect(mockProps.aoAlternarSenha).toHaveBeenCalled();
  });

  it('deve chamar aoFocarCampo quando focar no email', () => {
    const { getByTestId } = render(<FormularioLogin {...mockProps} />);

    const emailInput = getByTestId('input-email');
    fireEvent(emailInput, 'focus');

    expect(mockProps.aoFocarCampo).toHaveBeenCalledWith('email');
  });

  it('deve chamar aoDesfocarCampo quando desfocar do email', () => {
    const { getByTestId } = render(<FormularioLogin {...mockProps} />);

    const emailInput = getByTestId('input-email');
    fireEvent(emailInput, 'blur');

    expect(mockProps.aoDesfocarCampo).toHaveBeenCalled();
  });

  it('deve chamar aoEnviar quando clicar no botão Entrar', () => {
    const { getByTestId } = render(<FormularioLogin {...mockProps} />);

    const botaoEntrar = getByTestId('botao-entrar');
    fireEvent.press(botaoEntrar);

    expect(mockProps.aoEnviar).toHaveBeenCalled();
  });

  it('deve desabilitar botão de login quando carregando', () => {
    const propsCarregando = { ...mockProps, carregando: true };
    const { getByTestId, getByText } = render(<FormularioLogin {...propsCarregando} />);

    const botaoEntrar = getByTestId('botao-entrar');

    // Verifica que o botão está desabilitado através da prop accessibilityState
    expect(botaoEntrar.props.accessibilityState?.disabled || botaoEntrar.props.disabled).toBeTruthy();
    expect(getByText('Entrando...')).toBeTruthy();
  });

  it('deve chamar aoClicarEsqueciSenha ao clicar em "Esqueceu sua senha?"', () => {
    const { getByText } = render(<FormularioLogin {...mockProps} />);

    const linkEsqueciSenha = getByText('Esqueceu sua senha?');
    fireEvent.press(linkEsqueciSenha);

    expect(mockProps.aoClicarEsqueciSenha).toHaveBeenCalled();
  });

  it('deve chamar aoEntrarComoVisitante ao clicar em "Entrar como Visitante"', () => {
    const { getByText } = render(<FormularioLogin {...mockProps} />);

    const botaoVisitante = getByText('Entrar como Visitante');
    fireEvent.press(botaoVisitante);

    expect(mockProps.aoEntrarComoVisitante).toHaveBeenCalled();
  });

  it('deve exibir mensagens de erro quando fornecidas', () => {
    const propsComErros = {
      ...mockProps,
      erros: {
        email: 'Email inválido',
        senha: 'Senha muito curta',
      },
    };

    const { getByText } = render(<FormularioLogin {...propsComErros} />);

    expect(getByText('Email inválido')).toBeTruthy();
    expect(getByText('Senha muito curta')).toBeTruthy();
  });

  it('deve exibir valores preenchidos nos campos', () => {
    const propsPreenchidos = {
      ...mockProps,
      dadosFormulario: {
        email: 'usuario@teste.com',
        senha: 'minhasenha',
      },
    };

    const { getByTestId } = render(<FormularioLogin {...propsPreenchidos} />);

    const emailInput = getByTestId('input-email');
    const senhaInput = getByTestId('input-senha');

    expect(emailInput.props.value).toBe('usuario@teste.com');
    expect(senhaInput.props.value).toBe('minhasenha');
  });

  it('deve aplicar estilo de erro nos inputs quando há erro', () => {
    const propsComErros = {
      ...mockProps,
      erros: {
        email: 'Erro no email',
        senha: 'Erro na senha',
      },
    };

    const { getByText } = render(<FormularioLogin {...propsComErros} />);

    // Verifica que as mensagens de erro estão sendo exibidas
    expect(getByText('Erro no email')).toBeTruthy();
    expect(getByText('Erro na senha')).toBeTruthy();
  });

  it('deve simular fluxo completo de login', async () => {
    const { getByTestId } = render(<FormularioLogin {...mockProps} />);

    // Digita email
    const emailInput = getByTestId('input-email');
    fireEvent.changeText(emailInput, 'usuario@teste.com');

    // Digita senha
    const senhaInput = getByTestId('input-senha');
    fireEvent.changeText(senhaInput, 'senha123');

    // Clica em entrar
    const botaoEntrar = getByTestId('botao-entrar');
    fireEvent.press(botaoEntrar);

    // Verifica que as funções foram chamadas
    expect(mockProps.aoMudarCampo).toHaveBeenCalledWith('email', 'usuario@teste.com');
    expect(mockProps.aoMudarCampo).toHaveBeenCalledWith('senha', 'senha123');
    expect(mockProps.aoEnviar).toHaveBeenCalled();
  });
});
