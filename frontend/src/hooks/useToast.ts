/**
 * Hook compartilhado: useToast
 * Gerencia exibição de toasts/mensagens
 */

import { useState, useCallback } from 'react';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastState {
  visible: boolean;
  message: string;
  type: ToastType;
}

export function useToast() {
  const [toastState, setToastState] = useState<ToastState>({
    visible: false,
    message: '',
    type: 'info',
  });

  /**
   * Mostra toast de sucesso
   */
  const showSuccess = useCallback((message: string) => {
    setToastState({
      visible: true,
      message,
      type: 'success',
    });
  }, []);

  /**
   * Mostra toast de erro
   */
  const showError = useCallback((message: string) => {
    setToastState({
      visible: true,
      message,
      type: 'error',
    });
  }, []);

  /**
   * Mostra toast de info
   */
  const showInfo = useCallback((message: string) => {
    setToastState({
      visible: true,
      message,
      type: 'info',
    });
  }, []);

  /**
   * Mostra toast de aviso
   */
  const showWarning = useCallback((message: string) => {
    setToastState({
      visible: true,
      message,
      type: 'warning',
    });
  }, []);

  /**
   * Esconde toast
   */
  const hideToast = useCallback(() => {
    setToastState((prev) => ({
      ...prev,
      visible: false,
    }));
  }, []);

  return {
    toastState,
    showSuccess,
    showError,
    showInfo,
    showWarning,
    hideToast,
  };
}
