/**
 * Types para a tela de Account (Configurações)
 */

import { Ionicons } from '@expo/vector-icons';

/**
 * Item de configuração
 */
export interface SettingItem {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  onPress: () => void;
  show: boolean;
}

/**
 * Seção de configurações
 */
export interface SettingsSection {
  title: string;
  items: SettingItem[];
}

/**
 * Estados dos modais
 */
export interface AccountModalsState {
  logout: boolean;
  changePassword: boolean;
  editProfile: boolean;
}

/**
 * Estados do Snackbar
 */
export interface AccountSnackbarState {
  visible: boolean;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

/**
 * Handlers da tela de account
 */
export interface AccountHandlers {
  onBackPress: () => void;
  onLogoutPress: () => void;
  onEditProfilePress: () => void;
  onChangePasswordPress: () => void;
  onCloseLogoutModal: () => void;
  onCloseEditProfileModal: () => void;
  onCloseChangePasswordModal: () => void;
  onConfirmLogout: () => Promise<void>;
  onSubmitEditProfile: (name: string, phone: string) => Promise<void>;
  onSubmitChangePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  onDismissSnackbar: () => void;
}
