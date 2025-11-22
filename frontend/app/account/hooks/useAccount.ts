/**
 * Hook useAccount
 * Gerencia toda a lógica da tela de configurações
 */

import { useState, useCallback, useMemo } from 'react';
import { router } from 'expo-router';
import { useAuth } from '@/src/hooks/useAuth';
import { useRole } from '@/src/hooks/useRole';
import type {
  AccountModalsState,
  AccountSnackbarState,
  SettingsSection,
  AccountHandlers,
} from '../types/account.types';

export const useAccount = () => {
  const { user, logout, updateUser } = useAuth();
  const { canManageFarmacia } = useRole();

  // Estados dos modais
  const [modals, setModals] = useState<AccountModalsState>({
    logout: false,
    changePassword: false,
    editProfile: false,
  });

  // Estados do Snackbar
  const [snackbar, setSnackbar] = useState<AccountSnackbarState>({
    visible: false,
    message: '',
    type: 'info',
  });

  /**
   * Mostra snackbar
   */
  const showSnackbar = useCallback(
    (message: string, type: AccountSnackbarState['type'] = 'info') => {
      setSnackbar({ visible: true, message, type });
    },
    []
  );

  /**
   * Handler para voltar
   */
  const handleBackPress = useCallback(() => {
    router.back();
  }, []);

  /**
   * Handler para logout
   */
  const handleConfirmLogout = useCallback(async () => {
    try {
      await logout();
      router.replace('/login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      showSnackbar('Erro ao fazer logout', 'error');
    }
  }, [logout, showSnackbar]);

  /**
   * Handler para editar perfil
   */
  const handleSubmitEditProfile = useCallback(
    async (name: string, phone: string) => {
      try {
        // Atualiza localmente enquanto backend não implementa o endpoint
        if (user) {
          const updatedUser = { ...user, name, phone };
          updateUser(updatedUser);
          showSnackbar('Perfil atualizado localmente!', 'success');

          // Nota: Quando o backend implementar PUT /api/user/profile, descomentar:
          // const updatedUser = await updateProfile({ name, phone });
          // updateUser(updatedUser);
        }
      } catch (error: any) {
        console.error('Erro ao atualizar perfil:', error);
        throw new Error(error?.message || 'Erro ao atualizar perfil');
      }
    },
    [user, updateUser, showSnackbar]
  );

  /**
   * Handler para alterar senha
   */
  const handleSubmitChangePassword = useCallback(
    async (currentPassword: string, newPassword: string) => {
      try {
        // Simulação enquanto backend não implementa o endpoint
        if (!currentPassword || !newPassword) {
          throw new Error('Preencha todos os campos');
        }

        // Simula sucesso
        await new Promise((resolve) => setTimeout(resolve, 1000));
        showSnackbar('⚠️ Endpoint de senha não implementado no backend', 'warning');

        // Nota: Quando o backend implementar PUT /api/user/password, descomentar:
        // await changePassword({
        //   current_password: currentPassword,
        //   new_password: newPassword,
        //   new_password_confirmation: newPassword,
        // });
        // showSnackbar('Senha alterada com sucesso!', 'success');
      } catch (error: any) {
        console.error('Erro ao alterar senha:', error);
        throw new Error(error?.message || 'Erro ao alterar senha');
      }
    },
    [showSnackbar]
  );

  /**
   * Seções de configurações
   */
  const settingsSections = useMemo<SettingsSection[]>(
    () => [
      // Seção Conta
      {
        title: 'Conta',
        items: [
          {
            icon: 'person-outline',
            title: 'Editar Perfil',
            subtitle: user?.name || 'Usuário',
            onPress: () => setModals((prev) => ({ ...prev, editProfile: true })),
            show: true,
          },
          {
            icon: 'lock-closed-outline',
            title: 'Alterar Senha',
            subtitle: 'Mantenha sua conta segura',
            onPress: () => setModals((prev) => ({ ...prev, changePassword: true })),
            show: true,
          },
        ],
      },

      // Seção Farmácia (apenas ROLE_LOJISTA_ADMIN)
      {
        title: 'Gerenciar Farmácia',
        items: [
          {
            icon: 'business-outline',
            title: 'Dashboard da Farmácia',
            subtitle: 'Visão geral do seu negócio',
            onPress: () => router.push('/farmacia/dashboard'),
            show: canManageFarmacia(),
          },
          {
            icon: 'cube-outline',
            title: 'Gerenciar Estoque',
            subtitle: 'Controle de produtos',
            onPress: () => router.push('/farmacia/estoque/gerenciar'),
            show: canManageFarmacia(),
          },
          {
            icon: 'add-circle-outline',
            title: 'Adicionar Estoque',
            subtitle: 'Cadastrar novos produtos',
            onPress: () => router.push('/farmacia/estoque/adicionar'),
            show: canManageFarmacia(),
          },
          {
            icon: 'people-outline',
            title: 'Cadastrar Farmacêutico',
            subtitle: 'Adicionar colaboradores',
            onPress: () => router.push('/farmacia/farmaceuticos/cadastrar'),
            show: canManageFarmacia(),
          },
          {
            icon: 'document-text-outline',
            title: 'Validar Receitas',
            subtitle: 'Gerenciar receitas pendentes',
            onPress: () => router.push('/farmacia/receitas/validar'),
            show: canManageFarmacia(),
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
            onPress: () => showSnackbar('Funcionalidade em desenvolvimento', 'info'),
            show: true,
          },
          {
            icon: 'location-outline',
            title: 'Endereços',
            subtitle: 'Gerencie seus endereços',
            onPress: () => router.push('/account/enderecos'),
            show: true,
          },
        ],
      },

      // Seção Suporte
      {
        title: 'Suporte',
        items: [
          {
            icon: 'help-circle-outline',
            title: 'Central de Ajuda',
            subtitle: 'FAQ e tutoriais',
            onPress: () => router.push('/help'),
            show: true,
          },
          {
            icon: 'chatbubble-ellipses-outline',
            title: 'Fale Conosco',
            subtitle: 'Entre em contato',
            onPress: () => router.push('/support'),
            show: true,
          },
        ],
      },

      // Seção Sobre
      {
        title: 'Sobre',
        items: [
          {
            icon: 'information-circle-outline',
            title: 'Sobre o Esculapi',
            subtitle: 'Versão 1.0.0',
            onPress: () => showSnackbar('Esculapi - Marketplace Farmacêutico', 'info'),
            show: true,
          },
          {
            icon: 'document-outline',
            title: 'Termos de Uso',
            subtitle: 'Leia nossos termos',
            onPress: () => showSnackbar('Funcionalidade em desenvolvimento', 'info'),
            show: true,
          },
          {
            icon: 'shield-checkmark-outline',
            title: 'Política de Privacidade',
            subtitle: 'Como protegemos seus dados',
            onPress: () => showSnackbar('Funcionalidade em desenvolvimento', 'info'),
            show: true,
          },
        ],
      },
    ],
    [user, canManageFarmacia, showSnackbar]
  );

  // Handlers agrupados
  const handlers: AccountHandlers = {
    onBackPress: handleBackPress,
    onLogoutPress: () => setModals((prev) => ({ ...prev, logout: true })),
    onEditProfilePress: () => setModals((prev) => ({ ...prev, editProfile: true })),
    onChangePasswordPress: () => setModals((prev) => ({ ...prev, changePassword: true })),
    onCloseLogoutModal: () => setModals((prev) => ({ ...prev, logout: false })),
    onCloseEditProfileModal: () => setModals((prev) => ({ ...prev, editProfile: false })),
    onCloseChangePasswordModal: () => setModals((prev) => ({ ...prev, changePassword: false })),
    onConfirmLogout: handleConfirmLogout,
    onSubmitEditProfile: handleSubmitEditProfile,
    onSubmitChangePassword: handleSubmitChangePassword,
    onDismissSnackbar: () => setSnackbar((prev) => ({ ...prev, visible: false })),
  };

  return {
    user,
    modals,
    snackbar,
    settingsSections,
    handlers,
  };
};
