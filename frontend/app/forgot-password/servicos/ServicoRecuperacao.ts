/**
 * Serviço: Recuperação de Senha
 * Lógica de negócio para recuperação de senha
 */
import { forgotPassword, resetPassword } from '@/src/servicos/auth/authService';
import { DadosRecuperacao } from '../tipos/DadosRecuperacao';

export class ServicoRecuperacao {
  /**
   * Envia email de recuperação de senha
   */
  static async enviarEmailRecuperacao(
    dados: DadosRecuperacao
  ): Promise<{ sucesso: boolean; mensagem: string }> {
    try {
      // Validar dados
      const erro = dados.obterErroValidacao();
      if (erro) {
        throw new Error(erro);
      }

      // Enviar requisição para API usando authService
      const response = await forgotPassword(dados.formatarEmail());

      return {
        sucesso: true,
        mensagem: response.message ||
                 'Instruções de recuperação enviadas para seu e-mail.'
      };
    } catch (erro: any) {
      console.error('[ServicoRecuperacao] Erro ao enviar email:', erro);

      // Tratar erros específicos
      if (erro.response?.status === 404) {
        throw new Error('E-mail não encontrado em nossa base de dados');
      }

      if (erro.response?.status === 429) {
        throw new Error('Muitas tentativas. Aguarde alguns minutos.');
      }

      throw new Error(erro.message || 'Erro ao enviar email de recuperação');
    }
  }

  /**
   * Redefine senha com token
   */
  static async redefinirSenha(
    token: string,
    novaSenha: string,
    confirmacaoSenha: string
  ): Promise<{ sucesso: boolean; mensagem: string }> {
    try {
      // Validar se as senhas coincidem
      if (novaSenha !== confirmacaoSenha) {
        throw new Error('As senhas não coincidem');
      }

      // Enviar requisição para API usando authService
      const response = await resetPassword(token, novaSenha, confirmacaoSenha);

      return {
        sucesso: true,
        mensagem: response.message || 'Senha redefinida com sucesso!'
      };
    } catch (erro: any) {
      console.error('[ServicoRecuperacao] Erro ao redefinir senha:', erro);

      if (erro.response?.status === 400) {
        throw new Error('Token inválido ou expirado');
      }

      throw new Error(erro.message || 'Erro ao redefinir senha');
    }
  }
}
