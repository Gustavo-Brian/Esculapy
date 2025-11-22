/**
 * Hook: useCadastroFarmaceutico
 * Gerencia lógica de cadastro de farmacêuticos (ROLE_LOJISTA_ADMIN)
 * Padrão: OOP + Português
 */

import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { router } from 'expo-router';
import { addFarmaceutico } from '@/src/servicos/farmacia/farmaciaAdminService';

interface DadosFormulario {
  nome: string;
  email: string;
  senha: string;
  cpf: string;
  crfP: string;
  numeroCelular: string;
}

interface ErrosFormulario {
  nome: string;
  email: string;
  senha: string;
  cpf: string;
  crfP: string;
  numeroCelular: string;
}

const FORMULARIO_INICIAL: DadosFormulario = {
  nome: '',
  email: '',
  senha: '',
  cpf: '',
  crfP: '',
  numeroCelular: '',
};

const ERROS_INICIAL: ErrosFormulario = {
  nome: '',
  email: '',
  senha: '',
  cpf: '',
  crfP: '',
  numeroCelular: '',
};

export function useCadastroFarmaceutico() {
  const [carregando, definirCarregando] = useState(false);
  const [mostrarSenha, definirMostrarSenha] = useState(false);
  const [dadosFormulario, definirDadosFormulario] = useState<DadosFormulario>(FORMULARIO_INICIAL);
  const [erros, definirErros] = useState<ErrosFormulario>(ERROS_INICIAL);

  /**
   * Formata CPF com máscara
   */
  const formatarCPF = useCallback((valor: string): string => {
    const numeros = valor.replace(/\D/g, '');
    if (numeros.length <= 11) {
      return numeros
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    }
    return valor;
  }, []);

  /**
   * Formata telefone com máscara
   */
  const formatarTelefone = useCallback((valor: string): string => {
    const numeros = valor.replace(/\D/g, '');
    if (numeros.length <= 11) {
      return numeros
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{5})(\d)/, '$1-$2');
    }
    return valor;
  }, []);

  /**
   * Valida email
   */
  const validarEmail = useCallback((email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }, []);

  /**
   * Valida CPF
   */
  const validarCPF = useCallback((cpf: string): boolean => {
    const numeros = cpf.replace(/\D/g, '');
    return numeros.length === 11;
  }, []);

  /**
   * Valida formulário completo
   */
  const validarFormulario = useCallback((): boolean => {
    const novosErros: ErrosFormulario = { ...ERROS_INICIAL };
    let valido = true;

    // Validar Nome
    if (!dadosFormulario.nome.trim()) {
      novosErros.nome = 'Nome é obrigatório';
      valido = false;
    } else if (dadosFormulario.nome.trim().length < 3) {
      novosErros.nome = 'Nome deve ter pelo menos 3 caracteres';
      valido = false;
    }

    // Validar Email
    if (!dadosFormulario.email.trim()) {
      novosErros.email = 'Email é obrigatório';
      valido = false;
    } else if (!validarEmail(dadosFormulario.email)) {
      novosErros.email = 'Email inválido';
      valido = false;
    }

    // Validar Senha
    if (!dadosFormulario.senha) {
      novosErros.senha = 'Senha é obrigatória';
      valido = false;
    } else if (dadosFormulario.senha.length < 6) {
      novosErros.senha = 'Senha deve ter pelo menos 6 caracteres';
      valido = false;
    }

    // Validar CPF
    if (!dadosFormulario.cpf.trim()) {
      novosErros.cpf = 'CPF é obrigatório';
      valido = false;
    } else if (!validarCPF(dadosFormulario.cpf)) {
      novosErros.cpf = 'CPF inválido';
      valido = false;
    }

    // Validar CRF
    if (!dadosFormulario.crfP.trim()) {
      novosErros.crfP = 'CRF é obrigatório';
      valido = false;
    } else if (dadosFormulario.crfP.trim().length < 3) {
      novosErros.crfP = 'CRF inválido';
      valido = false;
    }

    // Validar Telefone
    if (!dadosFormulario.numeroCelular.trim()) {
      novosErros.numeroCelular = 'Telefone é obrigatório';
      valido = false;
    } else {
      const numeros = dadosFormulario.numeroCelular.replace(/\D/g, '');
      if (numeros.length < 10) {
        novosErros.numeroCelular = 'Telefone inválido';
        valido = false;
      }
    }

    definirErros(novosErros);
    return valido;
  }, [dadosFormulario, validarEmail, validarCPF]);

  /**
   * Limpa formulário
   */
  const limparFormulario = useCallback(() => {
    definirDadosFormulario(FORMULARIO_INICIAL);
    definirErros(ERROS_INICIAL);
  }, []);

  /**
   * Handlers agrupados
   */
  const manipuladores = {
    /**
     * Altera campo do formulário
     */
    aoAlterarCampo: useCallback((campo: keyof DadosFormulario, valor: string) => {
      let valorFormatado = valor;

      // Aplica formatação específica
      if (campo === 'cpf') {
        valorFormatado = formatarCPF(valor);
      } else if (campo === 'numeroCelular') {
        valorFormatado = formatarTelefone(valor);
      }

      definirDadosFormulario(prev => ({ ...prev, [campo]: valorFormatado }));

      // Limpa erro do campo
      if (erros[campo]) {
        definirErros(prev => ({ ...prev, [campo]: '' }));
      }
    }, [formatarCPF, formatarTelefone, erros]),

    /**
     * Alterna visibilidade da senha
     */
    aoAlternarSenha: useCallback(() => {
      definirMostrarSenha(prev => !prev);
    }, []),

    /**
     * Submete formulário
     */
    aoSubmeter: useCallback(async () => {
      if (!validarFormulario()) {
        Alert.alert('Erro de Validação', 'Por favor, corrija os campos marcados em vermelho.');
        return;
      }

      definirCarregando(true);

      try {
        const resposta = await addFarmaceutico({
          nome: dadosFormulario.nome.trim(),
          email: dadosFormulario.email.trim().toLowerCase(),
          senha: dadosFormulario.senha,
          cpf: dadosFormulario.cpf.replace(/\D/g, ''),
          crfP: dadosFormulario.crfP.trim(),
          numeroCelular: dadosFormulario.numeroCelular.replace(/\D/g, ''),
        });

        Alert.alert(
          'Sucesso!',
          resposta.message || 'Farmacêutico cadastrado com sucesso!',
          [
            {
              text: 'Cadastrar Outro',
              onPress: limparFormulario,
            },
            {
              text: 'Voltar',
              onPress: () => router.back(),
            },
          ]
        );
      } catch (erro: any) {
        console.error('[useCadastroFarmaceutico] Erro:', erro);
        Alert.alert(
          'Erro',
          erro.message || 'Não foi possível cadastrar o farmacêutico. Tente novamente.'
        );
      } finally {
        definirCarregando(false);
      }
    }, [validarFormulario, dadosFormulario, limparFormulario]),

    /**
     * Volta para tela anterior
     */
    aoVoltar: useCallback(() => {
      router.back();
    }, []),
  };

  return {
    // Estados
    carregando,
    mostrarSenha,
    dadosFormulario,
    erros,

    // Handlers
    manipuladores,
  };
}
