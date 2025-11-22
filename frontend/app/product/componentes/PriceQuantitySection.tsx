/**
 * PriceQuantitySection Component
 * Seção de preço e controle de quantidade
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface PriceQuantitySectionProps {
  precoTotal: string;
  quantidade: number;
  onIncrement: () => void;
  onDecrement: () => void;
}

export const PriceQuantitySection: React.FC<PriceQuantitySectionProps> = ({
  precoTotal,
  quantidade,
  onIncrement,
  onDecrement,
}) => {
  return (
    <View style={styles.container}>
      {/* Preço */}
      <View style={styles.price}>
        <Text style={styles.priceLabel}>Preço</Text>
        <Text style={styles.priceValue}>R$ {precoTotal}</Text>
      </View>

      {/* Quantidade */}
      <View style={styles.quantity}>
        <Text style={styles.quantityLabel}>Quantidade:</Text>
        <View style={styles.quantityControls}>
          <TouchableOpacity
            style={[
              styles.quantityButton,
              quantidade === 1 && styles.quantityButtonDisabled,
            ]}
            onPress={onDecrement}
            disabled={quantidade === 1}
          >
            <Text style={styles.quantityButtonText}>-</Text>
          </TouchableOpacity>

          <Text style={styles.quantityValue}>{quantidade}</Text>

          <TouchableOpacity style={styles.quantityButton} onPress={onIncrement}>
            <Text style={styles.quantityButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF',
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginTop: 8,
  },
  price: {
    marginBottom: 20,
  },
  priceLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  priceValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#607AFB',
  },
  quantity: {},
  quantityLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#607AFB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonDisabled: {
    backgroundColor: '#E5E7EB',
  },
  quantityButtonText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFF',
  },
  quantityValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginHorizontal: 24,
    minWidth: 30,
    textAlign: 'center',
  },
});
