/**
 * ProductCard Component
 * Card de produto na grid
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { temaMedico } from '@/src/estilos/temaMedico';
import type { Product } from '../types/allproducts.types';

interface ProductCardProps {
  product: Product;
  onPress: (id: number) => void;
  onAddToCart: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onPress,
  onAddToCart,
}) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress(product.id)}
      activeOpacity={0.7}
    >
      {/* Ícone Circular Colorido */}
      <View style={[styles.icon, { backgroundColor: product.cor + '20' }]}>
        <Ionicons name={product.icone as any} size={32} color={product.cor} />
      </View>

      {/* Conteúdo */}
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={2}>
          {product.nome}
        </Text>
        <Text style={styles.seller} numberOfLines={1}>
          {product.vendedor}
        </Text>

        {/* Avaliação */}
        <View style={styles.rating}>
          <Ionicons name="star" size={14} color={temaMedico.cores.cardAmarelo} />
          <Text style={styles.ratingText}>{product.avaliacao}</Text>
        </View>

        {/* Preço */}
        <Text style={styles.price}>
          R$ {product.preco.toFixed(2).replace('.', ',')}
        </Text>

        {/* Botão Adicionar */}
        <TouchableOpacity
          style={styles.button}
          onPress={(e) => {
            e.stopPropagation();
            onAddToCart(product);
          }}
          activeOpacity={0.8}
        >
          <Ionicons name="add-circle" size={18} color="#FFF" style={{ marginRight: 6 }} />
          <Text style={styles.buttonText}>Adicionar</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: temaMedico.bordas.media,
    padding: temaMedico.espacamentos.md,
    marginBottom: temaMedico.espacamentos.md,
    borderWidth: 2,
    borderColor: temaMedico.cores.primaria,
    shadowColor: '#000',
    shadowOffset: {
      width: 3,
      height: 6,
    },
    shadowOpacity: 1.0,
    shadowRadius: 1,
    elevation: 12,
  },
  icon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: temaMedico.espacamentos.md,
  },
  content: {},
  name: {
    fontSize: temaMedico.fontes.tamanhos.md,
    fontWeight: temaMedico.fontes.pesos.semibold,
    color: temaMedico.cores.textoTitulo,
    marginBottom: 4,
    minHeight: 40,
  },
  seller: {
    fontSize: temaMedico.fontes.tamanhos.xs,
    color: temaMedico.cores.textoSubtitulo,
    marginBottom: temaMedico.espacamentos.sm,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: temaMedico.espacamentos.sm,
  },
  ratingText: {
    fontSize: temaMedico.fontes.tamanhos.sm,
    fontWeight: temaMedico.fontes.pesos.semibold,
    color: temaMedico.cores.textoTitulo,
    marginLeft: 4,
  },
  price: {
    fontSize: temaMedico.fontes.tamanhos.lg,
    fontWeight: temaMedico.fontes.pesos.bold,
    color: temaMedico.cores.primaria,
    marginBottom: temaMedico.espacamentos.md,
  },
  button: {
    flexDirection: 'row',
    backgroundColor: temaMedico.cores.primaria,
    paddingVertical: temaMedico.espacamentos.sm,
    paddingHorizontal: temaMedico.espacamentos.md,
    borderRadius: temaMedico.bordas.media,
    alignItems: 'center',
    justifyContent: 'center',
    ...temaMedico.sombras.pequena,
  },
  buttonText: {
    fontSize: temaMedico.fontes.tamanhos.sm,
    fontWeight: temaMedico.fontes.pesos.semibold,
    color: temaMedico.cores.textoBranco,
  },
});
