/**
 * ProductResultCard Component
 * Card de produto nos resultados de busca
 */

import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { temaMedico } from '@/src/estilos/temaMedico';
import type { ProdutoHome } from '@/src/servicos/types/api.types';

interface ProductResultCardProps {
  product: ProdutoHome;
  onPress: (id: number) => void;
}

export const ProductResultCard: React.FC<ProductResultCardProps> = ({
  product,
  onPress,
}) => {
  const hasDiscount = product.precoPromocional && product.precoPromocional < product.preco;

  return (
    <TouchableOpacity style={styles.container} onPress={() => onPress(product.id)}>
      {/* Ícone do Produto */}
      <View style={styles.iconContainer}>
        <Ionicons name="medical" size={32} color={temaMedico.cores.primaria} />
      </View>

      {/* Informações */}
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={2}>
          {product.nome}
        </Text>
        <Text style={styles.description} numberOfLines={1}>
          {product.descricao}
        </Text>
        <Text style={styles.pharmacy} numberOfLines={1}>
          <Ionicons name="storefront-outline" size={12} color={temaMedico.cores.textoClaro} />{' '}
          {product.farmaciaNome}
        </Text>
      </View>

      {/* Preço */}
      <View style={styles.priceContainer}>
        {hasDiscount && (
          <Text style={styles.oldPrice}>R$ {product.preco.toFixed(2).replace('.', ',')}</Text>
        )}
        <Text style={styles.price}>
          R${' '}
          {(product.precoPromocional || product.preco).toFixed(2).replace('.', ',')}
        </Text>
        {hasDiscount && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>
              -{Math.round(((product.preco - product.precoPromocional!) / product.preco) * 100)}%
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: temaMedico.cores.backgroundCard,
    padding: 12,
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 8,
    alignItems: 'center',
    ...temaMedico.sombras.pequena,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: temaMedico.cores.backgroundDestaque,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  info: {
    flex: 1,
    marginRight: 12,
  },
  name: {
    fontSize: 15,
    fontWeight: '600',
    color: temaMedico.cores.textoTitulo,
    marginBottom: 4,
  },
  description: {
    fontSize: 13,
    color: temaMedico.cores.textoSubtitulo,
    marginBottom: 4,
  },
  pharmacy: {
    fontSize: 12,
    color: temaMedico.cores.textoClaro,
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  oldPrice: {
    fontSize: 12,
    color: temaMedico.cores.textoClaro,
    textDecorationLine: 'line-through',
    marginBottom: 2,
  },
  price: {
    fontSize: 18,
    fontWeight: '700',
    color: temaMedico.cores.primaria,
    marginBottom: 4,
  },
  discountBadge: {
    backgroundColor: temaMedico.cores.sucesso,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  discountText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFF',
  },
});
