/**
 * ProductImage Component
 * Imagem/ícone do produto
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ProductImageProps {
  icone: string;
}

export const ProductImage: React.FC<ProductImageProps> = ({ icone }) => {
  return (
    <View style={styles.container}>
      <View style={styles.imageWrapper}>
        <Ionicons name={icone as any} size={64} color="#9CA3AF" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 32,
    backgroundColor: '#FFF',
  },
  imageWrapper: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#F9FAFB',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
