/**
 * Hook useDadosCadastro
 * Conecta o ServicoCadastro (OOP) com React
 */

import { useState, useCallback } from 'react';
import { router } from 'expo-router';
import { ServicoCadastro } from '../servicos/ServicoCadastro';
import { DadosCadastro } from '../tipos/DadosCadastro';
import { useToast } from '@/src/hooks/useToast';

interface DadosFormulario {
  nome: string;
  email: string;
  cpf: string;
  telefone: string;
  dataNascimento: string;
  senha: string;
  confirmarSenha: string;
}

interface ErrosValidacao {
  nome?: string;
  email?: string;
  cpf?: string;
  telefone?: string;
  dataNascimento?: string;
  senha?: string;
  confirmarSenha?: string;
}

export const useDadosCadastro = () => {
  // Instância única do serviço
  const [servico] = useState(() => new ServicoCadastro());

  // Estados do React
  const [dadosFormulario, setDadosFormulario] = useState<DadosFormulario>({
    nome: '',
    email: '',
    cpf: '',
    telefone: '',
    dataNascimento: '',
    senha: '',
    confirmarSenha: '',
  });

  const [erros, setErros] = useState<ErrosValidacao>({});
  const [carregando, setCarregando] = useState(false);
  const [campoFocado, setCampoFocado] = useState<string | null>(null);
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);

  // Hook de toast
  const { showSuccess, showError } = useToast();

  /**
   * Valida o formulário completo
   */
  const validarFormulario = useCallback((): boolean => {
    const novosErros: ErrosValidacao = {};

    // Validar nome
    if (!dadosFormulario.nome.trim()) {
      novosErros.nome = 'Nome é obrigatório';
    } else if (dadosFormulario.nome.trim().length < 3) {
      novosErros.nome = 'Nome deve ter no mínimo 3 caracteres';
    }

    // Validar email
    if (!dadosFormulario.email.trim()) {
      novosErros.email = 'Email é obrigatório';
    } else if (!servico.validarEmail(dadosFormulario.email)) {
      novosErros.email = 'Email inválido';
    }

    // Validar CPF
    if (!dadosFormulario.cpf.trim()) {
      novosErros.cpf = 'CPF é obrigatório';
    } else if (!servico.validarCPF(dadosFormulario.cpf)) {
      novosErros.cpf = 'CPF inválido';
    }

    // Validar telefone (opcional)
    if (dadosFormulario.telefone.trim()) {
      const telefoneNumeros = dadosFormulario.telefone.replace(/\D/g, '');
      if (telefoneNumeros.length < 10) {
        novosErros.telefone = 'Telefone inválido';
      }
    }

    // Validar data de nascimento (opcional)
    if (dadosFormulario.dataNascimento.trim()) {
      const dados = new DadosCadastro({
        nome: dadosFormulario.nome,
        email: dadosFormulario.email,
        cpf: dadosFormulario.cpf,
        telefone: dadosFormulario.telefone,
        dataNascimento: dadosFormulario.dataNascimento,
        senha: dadosFormulario.senha,
      });

      if (!dados.validarDataNascimento()) {
        novosErros.dataNascimento = 'Data de nascimento inválida (DD/MM/AAAA)';
      }
    }

    // Validar senha
    if (!dadosFormulario.senha.trim()) {
      novosErros.senha = 'Senha é obrigatória';
    } else if (!servico.validarSenha(dadosFormulario.senha)) {
      novosErros.senha = 'Senha deve ter no mínimo 6 caracteres';
    }

    // Validar confirmação de senha
    if (!dadosFormulario.confirmarSenha.trim()) {
      novosErros.confirmarSenha = 'Confirmação de senha é obrigatória';
    } else if (!servico.validarSenhasCoincidentes(dadosFormulario.senha, dadosFormulario.confirmarSenha)) {
      novosErros.confirmarSenha = 'Senhas não coincidem';
    }

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  }, [dadosFormulario, servico]);

  /**
   * Manipuladores
   */
  const manipuladores = {
    /**
     * Altera valor de um campo com formatação automática
     */
    aoMudarCampo: useCallback((campo: keyof DadosFormulario, valor: string) => {
      let valorFormatado = valor;

      // Aplica formatação automática
      if (campo === 'cpf') {
        valorFormatado = DadosCadastro.formatarCPF(valor);
      } else if (campo === 'telefone') {
        valorFormatado = DadosCadastro.formatarTelefone(valor);
      } else if (campo === 'dataNascimento') {
        valorFormatado = DadosCadastro.formatarData(valor);
      }

      setDadosFormulario(anterior => ({ ...anterior, [campo]: valorFormatado }));

      // Limpa erro do campo ao digitar
      if (erros[campo]) {
        setErros(anterior => ({ ...anterior, [campo]: undefined }));
      }
    }, [erros]),

    /**
     * Define campo focado
     */
    aoFocarCampo: useCallback((campo: string) => {
      setCampoFocado(campo);
    }, []),

    /**
     * Remove foco do campo
     */
    aoDesfocarCampo: useCallback(() => {
      setCampoFocado(null);
    }, []),

    /**
     * Alterna visibilidade da senha
     */
    aoAlternarVisibilidadeSenha: useCallback(() => {
      setMostrarSenha(anterior => !anterior);
    }, []),

    /**
     * Alterna visibilidade da confirmação de senha
     */
    aoAlternarVisibilidadeConfirmarSenha: useCallback(() => {
      setMostrarConfirmarSenha(anterior => !anterior);
    }, []),

    /**
     * Submete o formulário de cadastro
     */
    aoEnviar: useCallback(async () => {
      try {
        // Valida antes de submeter
        if (!validarFormulario()) {
          return;
        }

        setCarregando(true);

        console.log('[useDadosCadastro] Iniciando cadastro:', { email: dadosFormulario.email });

        // Cria instância de DadosCadastro
        const dadosCadastro = new DadosCadastro({
          nome: dadosFormulario.nome,
          email: dadosFormulario.email,
          cpf: dadosFormulario.cpf,
          telefone: dadosFormulario.telefone || null,
          dataNascimento: dadosFormulario.dataNascimento || null,
          senha: dadosFormulario.senha,
        });

        // Usa o serviço para cadastrar
        const usuario = await servico.cadastrar(dadosCadastro);

        console.log('[useDadosCadastro] Cadastro bem-sucedido:', usuario.email);

        // Mostra sucesso
        showSuccess('Cadastro realizado com sucesso!');

        // Aguarda 1.5s antes de redirecionar
        setTimeout(() => {
          router.replace('/');
        }, 1500);
      } catch (erro: any) {
        console.error('[useDadosCadastro] Erro no cadastro:', erro);

        const mensagemErro = erro?.response?.data?.message || erro?.message || 'Erro ao fazer cadastro';

        showError(mensagemErro);
      } finally {
        setCarregando(false);
      }
    }, [dadosFormulario, validarFormulario, servico, showSuccess, showError]),

    /**
     * Navega para login
     */
    aoClicarLogin: useCallback(() => {
      router.push('/login');
    }, []),
  };

  return {
    // Dados
    dadosFormulario,
    erros,
    carregando,
    campoFocado,
    mostrarSenha,
    mostrarConfirmarSenha,

    // Manipuladores
    manipuladores,
  };
};
