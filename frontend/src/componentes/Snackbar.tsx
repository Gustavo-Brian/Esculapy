/**
 * Componente Snackbar - Esculapi
 * Toast moderno para feedback visual
 */

import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { temaMedico } from '@/src/estilos/temaMedico';

export type SnackbarType = 'success' | 'error' | 'info' | 'warning';

interface SnackbarProps {
  visible: boolean;
  message: string;
  type?: SnackbarType;
  duration?: number;
  onDismiss?: () => void;
}

export function Snackbar({
  visible,
  message,
  type = 'info',
  duration = 3000,
  onDismiss,
}: SnackbarProps) {
  const translateY = useRef(new Animated.Value(100)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Anima para aparecer
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      // Auto-dismiss após duration
      const timer = setTimeout(() => {
        handleDismiss();
      }, duration);

      return () => clearTimeout(timer);
    } else {
      handleDismiss();
    }
  }, [visible]);

  const handleDismiss = () => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 100,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (onDismiss) onDismiss();
    });
  };

  const getConfig = () => {
    switch (type) {
      case 'success':
        return {
          icon: 'checkmark-circle' as const,
          color: temaMedico.cores.sucesso,
          backgroundColor: temaMedico.cores.sucesso + '15',
        };
      case 'error':
        return {
          icon: 'close-circle' as const,
          color: temaMedico.cores.erro,
          backgroundColor: temaMedico.cores.erro + '15',
        };
      case 'warning':
        return {
          icon: 'warning' as const,
          color: temaMedico.cores.alerta,
          backgroundColor: temaMedico.cores.alerta + '15',
        };
      case 'info':
      default:
        return {
          icon: 'information-circle' as const,
          color: temaMedico.cores.info,
          backgroundColor: temaMedico.cores.info + '15',
        };
    }
  };

  const config = getConfig();

  if (!visible) {
    return null;
  }

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateY }],
          opacity,
        },
      ]}
    >
      <View style={[styles.snackbar, { backgroundColor: config.backgroundColor }]}>
        <View style={[styles.iconContainer, { backgroundColor: config.color + '30' }]}>
          <Ionicons name={config.icon} size={20} color={config.color} />
        </View>
        <Text style={styles.message}>{message}</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    zIndex: 9999,
    alignItems: 'center',
  },
  snackbar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    maxWidth: 400,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  message: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: temaMedico.cores.textoPrimario,
  },
});
