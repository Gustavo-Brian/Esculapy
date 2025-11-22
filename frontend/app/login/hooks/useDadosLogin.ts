/**
 * Hook useDadosLogin
 * Conecta o ServicoAutenticacao (OOP) com React
 */

import { useState, useCallback } from 'react';
import { router } from 'expo-router';
import { ServicoAutenticacao } from '../servicos/ServicoAutenticacao';
import { Usuario } from '../tipos/Usuario';
import { useToast } from '@/src/hooks/useToast';

interface DadosFormulario {
  email: string;
  senha: string;
}

interface ErrosValidacao {
  email?: string;
  senha?: string;
}

export const useDadosLogin = () => {
  // Instância única do serviço
  const [servico] = useState(() => new ServicoAutenticacao());

  // Estados do React
  const [dadosFormulario, setDadosFormulario] = useState<DadosFormulario>({
    email: '',
    senha: '',
  });

  const [erros, setErros] = useState<ErrosValidacao>({});
  const [carregando, setCarregando] = useState(false);
  const [mostrarSenha, setMostrarSenha] = useState(false);

  // Hook de toast
  const { showSuccess, showError } = useToast();

  /**
   * Valida o formulário usando o serviço
   */
  const validarFormulario = useCallback((): boolean => {
    const novosErros: ErrosValidacao = {};

    // Validar email
    if (!dadosFormulario.email.trim()) {
      novosErros.email = 'Email é obrigatório';
    } else if (!servico.validarEmail(dadosFormulario.email)) {
      novosErros.email = 'Email inválido';
    }

    // Validar senha
    if (!dadosFormulario.senha.trim()) {
      novosErros.senha = 'Senha é obrigatória';
    } else if (!servico.validarSenha(dadosFormulario.senha)) {
      novosErros.senha = 'Senha deve ter no mínimo 6 caracteres';
    }

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  }, [dadosFormulario, servico]);

  /**
   * Manipuladores
   */
  const manipuladores = {
    /**
     * Altera valor de um campo
     */
    aoMudarCampo: useCallback((campo: keyof DadosFormulario, valor: string) => {
      setDadosFormulario(anterior => ({ ...anterior, [campo]: valor }));

      // Limpa erro do campo ao digitar
      if (erros[campo]) {
        setErros(anterior => ({ ...anterior, [campo]: undefined }));
      }
    }, [erros]),

    /**
     * Alterna visibilidade da senha
     */
    aoAlternarVisibilidadeSenha: useCallback(() => {
      setMostrarSenha(anterior => !anterior);
    }, []),

    /**
     * Submete o formulário de login
     */
    aoEnviar: useCallback(async () => {
      try {
        // Valida antes de submeter
        if (!validarFormulario()) {
          return;
        }

        setCarregando(true);

        console.log('[useDadosLogin] Iniciando login:', { email: dadosFormulario.email });

        // Usa o serviço para fazer login
        const usuario = await servico.fazerLogin(
          dadosFormulario.email.trim().toLowerCase(),
          dadosFormulario.senha
        );

        console.log('[useDadosLogin] Login bem-sucedido:', usuario.email);

        // Mostra sucesso
        showSuccess('Login realizado com sucesso!');

        // Aguarda 1.5s antes de redirecionar
        setTimeout(() => {
          router.replace('/');
        }, 1500);
      } catch (erro: any) {
        console.error('[useDadosLogin] Erro no login:', erro);

        const mensagemErro = erro?.response?.data?.message || erro?.message || 'Erro ao fazer login';

        // Define erro genérico
        setErros({
          email: 'Credenciais inválidas',
          senha: 'Credenciais inválidas',
        });

        showError(mensagemErro);
      } finally {
        setCarregando(false);
      }
    }, [dadosFormulario, validarFormulario, servico, showSuccess, showError]),

    /**
     * Navega para esqueci minha senha
     */
    aoClicarEsqueciSenha: useCallback(() => {
      router.push('/forgot-password');
    }, []),

    /**
     * Navega para seleção de tipo de conta
     */
    aoClicarCadastro: useCallback(() => {
      router.push('/auth-select' as any);
    }, []),

    /**
     * Entra como visitante (sem login)
     */
    aoEntrarComoVisitante: useCallback(() => {
      console.log('[useDadosLogin] Entrando como visitante');
      router.replace('/home');
    }, []),
  };

  return {
    // Dados
    dadosFormulario,
    erros,
    carregando,
    mostrarSenha,

    // Manipuladores
    manipuladores,
  };
};
