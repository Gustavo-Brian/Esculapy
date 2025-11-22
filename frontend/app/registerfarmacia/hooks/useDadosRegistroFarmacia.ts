/**
 * Hook OOP: useDadosRegistroFarmacia
 * Conecta o ServicoRegistroFarmacia ao React
 */

import { useState, useMemo } from 'react';
import { router } from 'expo-router';
import { Alert, Platform } from 'react-native';
import { ServicoRegistroFarmacia } from '../servicos/ServicoRegistroFarmacia';

export function useDadosRegistroFarmacia() {
  const [servico] = useState(() => new ServicoRegistroFarmacia());
  const [campoFocado, definirCampoFocado] = useState<string | null>(null);
  const [erros, definirErros] = useState<Record<string, string>>({});
  const [atualizando, definirAtualizando] = useState(false);

  /**
   * Manipuladores
   */
  const manipuladores = useMemo(() => ({
    /**
     * Volta para tela anterior
     */
    aoVoltar: () => {
      router.back();
    },

    /**
     * Vai para tela de login
     */
    aoIrParaLogin: () => {
      router.push('/login');
    },

    /**
     * Altera valor de um campo
     */
    aoAlterarCampo: (campo: string, valor: string) => {
      servico.alterarCampo(campo, valor);

      // Remove erro do campo ao digitar
      if (erros[campo]) {
        const novosErros = { ...erros };
        delete novosErros[campo];
        definirErros(novosErros);
      }

      definirAtualizando(!atualizando);
    },

    /**
     * Ao focar em um campo
     */
    aoFocarCampo: (campo: string) => {
      definirCampoFocado(campo);
    },

    /**
     * Ao desfocar de um campo
     */
    aoDesfocarCampo: (campo: string) => {
      definirCampoFocado(null);

      // Valida campo ao sair
      const erro = servico.validarCampo(campo);
      if (erro) {
        definirErros({ ...erros, [campo]: erro });
      }
    },

    /**
     * Alterna visibilidade da senha
     */
    aoAlternarSenha: () => {
      servico.alternarVisibilidadeSenha();
      definirAtualizando(!atualizando);
    },

    /**
     * Alterna visibilidade da confirmação de senha
     */
    aoAlternarConfirmarSenha: () => {
      servico.alternarVisibilidadeConfirmarSenha();
      definirAtualizando(!atualizando);
    },

    /**
     * Submete o formulário
     */
    aoSubmeter: async () => {
      // Valida todos os campos
      const errosValidacao = servico.validarFormulario();

      if (Object.keys(errosValidacao).length > 0) {
        definirErros(errosValidacao);
        Alert.alert('Erro', 'Por favor, corrija os erros no formulário');
        return;
      }

      // Registra farmácia
      const sucesso = await servico.registrar();

      if (sucesso) {
        // Para web, usa window.alert; para mobile, usa Alert
        if (Platform.OS === 'web') {
          window.alert('Farmácia registrada com sucesso! Você já está conectado.');
          router.replace('/home');
        } else {
          Alert.alert(
            'Sucesso!',
            'Farmácia registrada com sucesso! Você já está conectado.',
            [
              {
                text: 'OK',
                onPress: () => router.replace('/home'),
              },
            ]
          );
        }
      } else {
        if (Platform.OS === 'web') {
          window.alert(servico.erro || 'Erro ao registrar farmácia');
        } else {
          Alert.alert('Erro', servico.erro || 'Erro ao registrar farmácia');
        }
      }
    },
  }), [servico, erros, atualizando, campoFocado]);

  return {
    // Dados
    dados: servico.dados,

    // Estado UI
    mostrarSenha: servico.mostrarSenha,
    mostrarConfirmarSenha: servico.mostrarConfirmarSenha,
    campoFocado,
    erros,

    // Estado de Carregamento
    carregando: servico.carregando,
    erro: servico.erro,

    // Verificações
    formularioValido: servico.formularioValido,

    // Manipuladores
    manipuladores,
  };
}
