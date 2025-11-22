/**
 * Hook: Dados de Recuperação de Senha
 * Gerencia estado e ações de recuperação de senha
 */
import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { router } from 'expo-router';
import { DadosRecuperacao } from '../tipos/DadosRecuperacao';
import { ServicoRecuperacao } from '../servicos/ServicoRecuperacao';

export function useDadosRecuperacao() {
  const [email, setEmail] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [dataUltimoEnvio, setDataUltimoEnvio] = useState<Date | null>(null);

  /**
   * Manipulador: Mudar email
   */
  const aoMudarEmail = useCallback((novoEmail: string) => {
    setEmail(novoEmail);
  }, []);

  /**
   * Manipulador: Voltar
   */
  const aoVoltar = useCallback(() => {
    router.back();
  }, []);

  /**
   * Manipulador: Enviar email de recuperação
   */
  const aoEnviar = useCallback(async () => {
    try {
      setCarregando(true);

      // Criar instância com dados
      const dados = new DadosRecuperacao(email, dataUltimoEnvio || undefined);

      // Verificar se pode reenviar
      if (!dados.podeReenviar()) {
        Alert.alert(
          'Aguarde',
          'Aguarde pelo menos 1 minuto antes de tentar novamente.'
        );
        return;
      }

      // Enviar email
      const resultado = await ServicoRecuperacao.enviarEmailRecuperacao(dados);

      // Atualizar data do último envio
      setDataUltimoEnvio(new Date());

      // Mostrar sucesso
      Alert.alert(
        'E-mail Enviado',
        resultado.mensagem,
        [{ text: 'OK', onPress: aoVoltar }]
      );
    } catch (erro: any) {
      console.error('[useDadosRecuperacao] Erro ao enviar:', erro);
      Alert.alert('Erro', erro.message || 'Erro ao enviar e-mail de recuperação');
    } finally {
      setCarregando(false);
    }
  }, [email, dataUltimoEnvio, aoVoltar]);

  return {
    // Estado
    email,
    carregando,

    // Manipuladores
    manipuladores: {
      aoMudarEmail,
      aoVoltar,
      aoEnviar,
    },
  };
}
