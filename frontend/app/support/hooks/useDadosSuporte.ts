/**
 * Hook useDadosSuporte
 * Conecta o ServicoSuporte (OOP) com React
 * Padrão: OOP + Português
 */

import { useState, useCallback, useMemo } from 'react';
import { Alert, Linking } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/src/hooks/useAuth';
import { ServicoSuporte } from '../servicos/ServicoSuporte';
import { PrioridadeMensagem } from '../tipos/MensagemSuporte';

// Estados da UI
interface EstadoFormulario {
  assunto: string;
  mensagem: string;
}

interface EstadoSnackbar {
  visivel: boolean;
  mensagem: string;
  tipo: 'success' | 'error' | 'info';
}

export const useDadosSuporte = () => {
  const { user } = useAuth();

  // Instância única do serviço (OOP)
  const [servico] = useState(() => new ServicoSuporte());

  // Estados da UI
  const [formulario, setFormulario] = useState<EstadoFormulario>({
    assunto: '',
    mensagem: '',
  });

  const [snackbar, setSnackbar] = useState<EstadoSnackbar>({
    visivel: false,
    mensagem: '',
    tipo: 'info',
  });

  /**
   * Mostra snackbar
   */
  const mostrarSnackbar = useCallback((mensagem: string, tipo: EstadoSnackbar['tipo'] = 'info') => {
    setSnackbar({ visivel: true, mensagem, tipo });
  }, []);

  /**
   * Canais disponíveis
   */
  const canaisDisponiveis = useMemo(() => {
    return servico.canaisDisponiveis;
  }, [servico]);

  /**
   * Validação do formulário
   */
  const validacao = useMemo(() => {
    return servico.validarCampos(formulario.assunto, formulario.mensagem);
  }, [formulario.assunto, formulario.mensagem, servico]);

  /**
   * Manipuladores de eventos
   */
  const manipuladores = {
    /**
     * Volta para tela anterior
     */
    aoVoltarPress: useCallback(() => {
      router.back();
    }, []),

    /**
     * Atualiza assunto
     */
    aoMudarAssunto: useCallback((texto: string) => {
      setFormulario((prev) => ({ ...prev, assunto: texto }));
    }, []),

    /**
     * Atualiza mensagem
     */
    aoMudarMensagem: useCallback((texto: string) => {
      setFormulario((prev) => ({ ...prev, mensagem: texto }));
    }, []),

    /**
     * Envia mensagem de suporte
     */
    aoEnviarMensagem: useCallback(async (prioridade?: PrioridadeMensagem) => {
      try {
        // Valida campos
        const validacao = servico.validarCampos(formulario.assunto, formulario.mensagem);

        if (!validacao.valido) {
          Alert.alert('Erro', validacao.erros.join('\n'));
          return;
        }

        if (!user?.id) {
          Alert.alert('Erro', 'Você precisa estar logado para enviar uma mensagem');
          return;
        }

        console.log('[useDadosSuporte] Enviando mensagem...');

        await servico.enviarMensagem({
          usuarioId: user.id,
          assunto: formulario.assunto,
          mensagem: formulario.mensagem,
          prioridade: prioridade || 'normal',
        });

        mostrarSnackbar('Mensagem enviada com sucesso!', 'success');

        Alert.alert(
          'Sucesso',
          'Sua mensagem foi enviada! Entraremos em contato em breve.',
          [
            {
              text: 'OK',
              onPress: () => {
                // Limpa formulário
                setFormulario({ assunto: '', mensagem: '' });
              },
            },
          ]
        );
      } catch (erro: any) {
        console.error('[useDadosSuporte] Erro ao enviar:', erro);
        mostrarSnackbar(erro.message || 'Erro ao enviar mensagem', 'error');
        Alert.alert('Erro', erro.message || 'Erro ao enviar mensagem');
      }
    }, [servico, formulario, user, mostrarSnackbar]),

    /**
     * Abre canal de atendimento
     */
    aoAbrirCanal: useCallback(async (canalId: string) => {
      const canal = servico.obterCanalPorTipo(canalId);

      if (!canal) {
        mostrarSnackbar('Canal não encontrado', 'error');
        return;
      }

      if (!canal.estaDisponivel()) {
        mostrarSnackbar(`${canal.nome} não está disponível no momento`, 'info');
        return;
      }

      console.log('[useDadosSuporte] Abrindo canal:', canal.nome);

      // Obtém URL de ação
      const url = canal.obterURLAcao();

      if (url) {
        // Canais externos (email, telefone, whatsapp)
        try {
          const podeAbrir = await Linking.canOpenURL(url);

          if (podeAbrir) {
            await Linking.openURL(url);
          } else {
            mostrarSnackbar(`Não foi possível abrir ${canal.nome}`, 'error');
          }
        } catch (erro) {
          console.error('[useDadosSuporte] Erro ao abrir URL:', erro);
          mostrarSnackbar(`Erro ao abrir ${canal.nome}`, 'error');
        }
      } else {
        // Canais internos (chat, faq)
        if (canal.eFAQ()) {
          router.push('/help');
        } else if (canal.eChat()) {
          mostrarSnackbar('Chat online em breve!', 'info');
        }
      }
    }, [servico, mostrarSnackbar]),

    /**
     * Fecha snackbar
     */
    aoFecharSnackbar: useCallback(() => {
      setSnackbar((prev) => ({ ...prev, visivel: false }));
    }, []),

    /**
     * Limpa formulário
     */
    aoLimparFormulario: useCallback(() => {
      setFormulario({ assunto: '', mensagem: '' });
    }, []),
  };

  return {
    // Dados do formulário
    formulario: {
      assunto: formulario.assunto,
      mensagem: formulario.mensagem,
    },

    // Validação
    validacao: {
      valido: validacao.valido,
      erros: validacao.erros,
    },

    // Canais de atendimento
    canais: canaisDisponiveis,

    // Snackbar
    snackbar: {
      visivel: snackbar.visivel,
      mensagem: snackbar.mensagem,
      tipo: snackbar.tipo,
    },

    // Estados gerais
    carregando: servico.carregando,
    erro: servico.erro,

    // Manipuladores
    manipuladores,

    // Utilitários
    mostrarSnackbar,
  };
};
