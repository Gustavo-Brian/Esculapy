/**
 * Account Screen - Nova Arquitetura
 * Tela de configurações e perfil do usuário
 */

import { ChangePasswordModal } from '@/src/componentes/ChangePasswordModal';
import { ConfirmModal } from '@/src/componentes/ConfirmModal';
import { EditProfileModal } from '@/src/componentes/EditProfileModal';
import { ProtectedRoute } from '@/src/componentes/ProtectedRoute';
import { Snackbar } from '@/src/componentes/Snackbar';
import { accountStyles as styles } from '@/src/estilos/pages/accountStyles';
import { temaMedico } from '@/src/estilos/temaMedico';
import { Stack } from 'expo-router';
import React from 'react';
import { ScrollView, View } from 'react-native';

// Hook
import { useAccount } from './hooks/useAccount';

// Componentes
import { AccountHeader } from './components/AccountHeader';
import { LogoutButton } from './components/LogoutButton';
import { SettingsSection } from './components/SettingsSection';
import { UserCard } from './components/UserCard';

export default function AccountScreen() {
  // Hook com toda a lógica
  const { user, modals, snackbar, settingsSections, handlers } = useAccount();

  return (
    <ProtectedRoute>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        {/* Header */}
        <AccountHeader onBackPress={handlers.onBackPress} />

        {/* Conteúdo */}
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* User Info Card */}
          <UserCard user={user} />

          {/* Settings Sections */}
          {settingsSections.map((section, index) => (
            <SettingsSection key={index} section={section} />
          ))}

          {/* Logout Button */}
          <LogoutButton onPress={handlers.onLogoutPress} />

          <View style={styles.bottomSpacer} />
        </ScrollView>

        {/* Modais */}
        <ConfirmModal
          visible={modals.logout}
          onClose={handlers.onCloseLogoutModal}
          onConfirm={handlers.onConfirmLogout}
          title="Sair da Conta"
          message="Tem certeza que deseja sair da sua conta?"
          confirmText="Sair"
          cancelText="Cancelar"
          confirmColor={temaMedico.cores.erro}
        />

        <EditProfileModal
          visible={modals.editProfile}
          onClose={handlers.onCloseEditProfileModal}
          onSubmit={handlers.onSubmitEditProfile}
          initialName={user?.name}
          initialPhone={user?.phone}
        />

        <ChangePasswordModal
          visible={modals.changePassword}
          onClose={handlers.onCloseChangePasswordModal}
          onSubmit={handlers.onSubmitChangePassword}
        />

        {/* Snackbar */}
        <Snackbar
          visible={snackbar.visible}
          message={snackbar.message}
          type={snackbar.type}
          onDismiss={handlers.onDismissSnackbar}
        />
      </View>
    </ProtectedRoute>
  );
}
