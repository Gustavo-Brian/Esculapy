/**
 * Hook useDadosAccount
 * Conecta o ServicoAccount (OOP) com React
 * Padrão: OOP + Português
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { router } from 'expo-router';
import { useAuth } from '@/src/hooks/useAuth';
import { ServicoAccount } from '../servicos/ServicoAccount';
import type { SettingsSection } from '../types/account.types';
import { temaMedico } from '@/src/estilos/temaMedico';

// Estados da UI
interface EstadoModais {
  logout: boolean;
  editarPerfil: boolean;
  alterarSenha: boolean;
}

interface EstadoSnackbar {
  visivel: boolean;
  mensagem: string;
  tipo: 'success' | 'error' | 'info' | 'warning';
}

export const useDadosAccount = () => {
  const { user: userAuth, logout: logoutAuth, updateUser } = useAuth();

  // Instância única do serviço (OOP)
  const [servico] = useState(() => new ServicoAccount());

  // Estados da UI
  const [modais, setModais] = useState<EstadoModais>({
    logout: false,
    editarPerfil: false,
    alterarSenha: false,
  });

  const [snackbar, setSnackbar] = useState<EstadoSnackbar>({
    visivel: false,
    mensagem: '',
    tipo: 'info',
  });

  const [carregando, setCarregando] = useState(true);

  /**
   * Mostra snackbar
   */
  const mostrarSnackbar = useCallback((mensagem: string, tipo: EstadoSnackbar['tipo'] = 'info') => {
    setSnackbar({ visivel: true, mensagem, tipo });
  }, []);

  /**
   * Carrega dados iniciais
   */
  useEffect(() => {
    const carregarDados = async () => {
      try {
        setCarregando(true);

        console.log('[useDadosAccount] Carregando dados...');

        await Promise.all([
          servico.carregarPerfil(),
          servico.carregarConfiguracoes(),
        ]);

        console.log('[useDadosAccount] Dados carregados com sucesso');
      } catch (erro: any) {
        console.error('[useDadosAccount] Erro ao carregar:', erro);
        mostrarSnackbar('Erro ao carregar dados da conta', 'error');
      } finally {
        setCarregando(false);
      }
    };

    carregarDados();
  }, [servico, mostrarSnackbar]);

  /**
   * Usuário para exibição (combina perfil OOP + auth context)
   */
  const usuarioExibicao = useMemo(() => {
    const perfil = servico.perfil;

    if (!perfil) {
      // Fallback para dados do auth context
      return {
        name: userAuth?.name || 'Usuário',
        email: userAuth?.email || 'email@exemplo.com',
        phone: undefined,
        role: userAuth?.role,
      };
    }

    return {
      name: perfil.obterNomeExibicao(),
      email: perfil.email,
      phone: perfil.telefone,
      role: perfil.obterTipo(),
      initials: perfil.obterIniciais(),
      subtitle: perfil.obterSubtitulo(),
    };
  }, [servico.perfil, userAuth]);

  /**
   * Seções de configurações
   */
  const secoesConfiguracoes = useMemo<SettingsSection[]>(() => {
    const perfil = servico.perfil;
    const eAdminFarmacia = perfil?.eAdminFarmacia() || false;

    return [
      // Seção Conta
      {
        title: 'Conta',
        items: [
          {
            icon: 'person-outline',
            title: 'Editar Perfil',
            subtitle: usuarioExibicao.name,
            onPress: () => setModais((prev) => ({ ...prev, editarPerfil: true })),
            show: true,
          },
          {
            icon: 'lock-closed-outline',
            title: 'Alterar Senha',
            subtitle: 'Mantenha sua conta segura',
            onPress: () => setModais((prev) => ({ ...prev, alterarSenha: true })),
            show: true,
          },
        ],
      },

      // Seção Farmácia (apenas admin)
      {
        title: 'Gerenciar Farmácia',
        items: [
          {
            icon: 'business-outline',
            title: 'Dashboard da Farmácia',
            subtitle: 'Gerenciar estoque e vendas',
            onPress: () => router.push('/farmacia/dashboard'),
            show: eAdminFarmacia,
          },
        ],
      },

      // Seção Preferências
      {
        title: 'Preferências',
        items: [
          {
            icon: 'notifications-outline',
            title: 'Notificações',
            subtitle: 'Gerencie suas notificações',
            onPress: () => mostrarSnackbar('Função em desenvolvimento', 'info'),
            show: true,
          },
          {
            icon: 'moon-outline',
            title: 'Modo Escuro',
            subtitle: 'Tema escuro',
            onPress: () => mostrarSnackbar('Função em desenvolvimento', 'info'),
            show: true,
          },
        ],
      },

      // Seção Ajuda
      {
        title: 'Ajuda & Suporte',
        items: [
          {
            icon: 'help-circle-outline',
            title: 'Central de Ajuda',
            subtitle: 'Perguntas frequentes',
            onPress: () => router.push('/help'),
            show: true,
          },
          {
            icon: 'chatbubble-outline',
            title: 'Falar com Suporte',
            subtitle: 'Tire suas dúvidas',
            onPress: () => router.push('/support'),
            show: true,
          },
        ],
      },
    ];
  }, [servico.perfil, usuarioExibicao.name, mostrarSnackbar]);

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
     * Abre modal de logout
     */
    aoLogoutPress: useCallback(() => {
      setModais((prev) => ({ ...prev, logout: true }));
    }, []),

    /**
     * Confirma logout
     */
    aoConfirmarLogout: useCallback(async () => {
      try {
        console.log('[useDadosAccount] Fazendo logout...');

        // Limpa dados locais do serviço
        await servico.limparDadosLocais();

        // Logout do auth context
        await logoutAuth();

        // Navega para login
        router.replace('/login');
      } catch (erro: any) {
        console.error('[useDadosAccount] Erro ao fazer logout:', erro);
        mostrarSnackbar('Erro ao fazer logout', 'error');
      }
    }, [servico, logoutAuth, mostrarSnackbar]),

    /**
     * Submete edição de perfil
     */
    aoSubmeterEdicaoPerfil: useCallback(async (nome: string, telefone: string) => {
      try {
        console.log('[useDadosAccount] Atualizando perfil...', { nome, telefone });

        await servico.atualizarPerfil({ nome, telefone });

        // Atualiza também no auth context (para compatibilidade)
        if (userAuth) {
          updateUser({ ...userAuth, name: nome, phone: telefone });
        }

        mostrarSnackbar('Perfil atualizado com sucesso!', 'success');
        setModais((prev) => ({ ...prev, editarPerfil: false }));

        // Recarrega perfil para garantir sincronização
        await servico.carregarPerfil();
      } catch (erro: any) {
        console.error('[useDadosAccount] Erro ao atualizar perfil:', erro);
        mostrarSnackbar(erro.message || 'Erro ao atualizar perfil', 'error');
      }
    }, [servico, userAuth, updateUser, mostrarSnackbar]),

    /**
     * Submete alteração de senha
     */
    aoSubmeterAlteracaoSenha: useCallback(async (senhaAtual: string, novaSenha: string) => {
      try {
        console.log('[useDadosAccount] Alterando senha...');

        await servico.alterarSenha(senhaAtual, novaSenha);

        mostrarSnackbar('Senha alterada com sucesso!', 'success');
        setModais((prev) => ({ ...prev, alterarSenha: false }));
      } catch (erro: any) {
        console.error('[useDadosAccount] Erro ao alterar senha:', erro);

        // Se é aviso de endpoint não implementado, mostra warning
        if (erro.message.includes('não implementado')) {
          mostrarSnackbar('⚠️ Endpoint não implementado no backend', 'warning');
          setModais((prev) => ({ ...prev, alterarSenha: false }));
        } else {
          mostrarSnackbar(erro.message || 'Erro ao alterar senha', 'error');
        }
      }
    }, [servico, mostrarSnackbar]),

    /**
     * Fecha modal de logout
     */
    aoFecharModalLogout: useCallback(() => {
      setModais((prev) => ({ ...prev, logout: false }));
    }, []),

    /**
     * Fecha modal de editar perfil
     */
    aoFecharModalEditarPerfil: useCallback(() => {
      setModais((prev) => ({ ...prev, editarPerfil: false }));
    }, []),

    /**
     * Fecha modal de alterar senha
     */
    aoFecharModalAlterarSenha: useCallback(() => {
      setModais((prev) => ({ ...prev, alterarSenha: false }));
    }, []),

    /**
     * Fecha snackbar
     */
    aoFecharSnackbar: useCallback(() => {
      setSnackbar((prev) => ({ ...prev, visivel: false }));
    }, []),
  };

  return {
    // Dados do usuário
    usuario: usuarioExibicao,
    perfil: servico.perfil,
    configuracoes: servico.configuracoes,

    // Seções de configurações
    secoesConfiguracoes,

    // Estados da UI
    modais: {
      logout: modais.logout,
      editarPerfil: modais.editarPerfil,
      alterarSenha: modais.alterarSenha,
    },

    // Snackbar
    snackbar: {
      visivel: snackbar.visivel,
      mensagem: snackbar.mensagem,
      tipo: snackbar.tipo,
    },

    // Estados gerais
    carregando: carregando || servico.carregando,
    erro: servico.erro,
    temPerfil: servico.temPerfil,

    // Manipuladores
    manipuladores,

    // Utilitários
    mostrarSnackbar,
  };
};
