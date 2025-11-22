import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastProps {
  visible: boolean;
  message: string;
  type?: ToastType;
  duration?: number;
  onHide: () => void;
}

/**
 * Componente Toast - Notificação temporária que aparece no topo da tela
 *
 * @param visible - Controla se o toast está visível
 * @param message - Mensagem a ser exibida
 * @param type - Tipo do toast (success, error, info, warning)
 * @param duration - Duração em ms antes de esconder automaticamente (padrão: 3000ms)
 * @param onHide - Callback quando o toast é escondido
 */
export const Toast: React.FC<ToastProps> = ({
  visible,
  message,
  type = 'success',
  duration = 3000,
  onHide,
}) => {
  const slideAnim = useRef(new Animated.Value(-100)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Animação de entrada
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      // Auto-esconder após duração
      const timer = setTimeout(() => {
        hideToast();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  const hideToast = () => {
    // Animação de saída
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onHide();
    });
  };

  if (!visible) return null;

  const getToastConfig = () => {
    switch (type) {
      case 'success':
        return {
          backgroundColor: '#D1FAE5',
          borderColor: '#059669',
          iconName: 'checkmark-circle' as const,
          iconColor: '#059669',
          textColor: '#065F46',
        };
      case 'error':
        return {
          backgroundColor: '#FEE2E2',
          borderColor: '#DC2626',
          iconName: 'close-circle' as const,
          iconColor: '#DC2626',
          textColor: '#991B1B',
        };
      case 'warning':
        return {
          backgroundColor: '#FEF3C7',
          borderColor: '#F59E0B',
          iconName: 'warning' as const,
          iconColor: '#F59E0B',
          textColor: '#92400E',
        };
      case 'info':
        return {
          backgroundColor: '#DBEAFE',
          borderColor: '#3B82F6',
          iconName: 'information-circle' as const,
          iconColor: '#3B82F6',
          textColor: '#1E40AF',
        };
      default:
        return {
          backgroundColor: '#D1FAE5',
          borderColor: '#059669',
          iconName: 'checkmark-circle' as const,
          iconColor: '#059669',
          textColor: '#065F46',
        };
    }
  };

  const config = getToastConfig();

  return (
    <Animated.View
      style={[
        styles.toast,
        {
          backgroundColor: config.backgroundColor,
          borderColor: config.borderColor,
          transform: [{ translateY: slideAnim }],
          opacity: opacityAnim,
        },
      ]}
    >
      <View style={styles.toast__content}>
        <Ionicons name={config.iconName} size={24} color={config.iconColor} />
        <Text style={[styles.toast__message, { color: config.textColor }]} numberOfLines={2}>
          {message}
        </Text>
      </View>
      <TouchableOpacity onPress={hideToast} style={styles.toast__closeButton}>
        <Ionicons name="close" size={20} color={config.textColor} />
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    top: 60,
    left: 16,
    right: 16,
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 9999,
  },
  toast__content: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  toast__message: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
  toast__closeButton: {
    padding: 4,
    marginLeft: 8,
  },
});
