/**
 * ProductInfo Component
 * Informações principais do produto
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { ProductDetail } from '../types/product.types';

interface ProductInfoProps {
  product: ProductDetail;
  onSellerPress: () => void;
  onComparePress: () => void;
}

export const ProductInfo: React.FC<ProductInfoProps> = ({
  product,
  onSellerPress,
  onComparePress,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{product.nome}</Text>
      <Text style={styles.subtitle}>{product.subtitulo}</Text>

      {/* Vendedor */}
      <TouchableOpacity style={styles.seller} onPress={onSellerPress}>
        <Ionicons name="storefront" size={20} color="#607AFB" />
        <Text style={styles.sellerText}>Vendido por {product.vendedor.nome}</Text>
      </TouchableOpacity>

      {/* Botão Comparar Preços */}
      <TouchableOpacity style={styles.compareButton} onPress={onComparePress}>
        <Ionicons name="swap-horizontal" size={20} color="#374151" />
        <Text style={styles.compareButtonText}>
          Comparar Preços em Outras Farmácias
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
  },
  seller: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#EEF2FF',
    borderRadius: 12,
    marginBottom: 12,
  },
  sellerText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#607AFB',
    marginLeft: 8,
  },
  compareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  compareButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginLeft: 8,
  },
});
