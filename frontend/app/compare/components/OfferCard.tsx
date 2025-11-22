/**
 * OfferCard Component
 */

import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { temaMedico } from '@/src/estilos/temaMedico';
import type { ProductOffer } from '../types/compare.types';

interface OfferCardProps {
  offer: ProductOffer;
  onSelect: (id: number) => void;
  onPharmacyPress: (farmacia: string) => void;
}

export const OfferCard: React.FC<OfferCardProps> = ({ offer, onSelect, onPharmacyPress }) => {
  return (
    <View style={[styles.container, offer.melhorPreco && styles.bestOffer]}>
      {offer.melhorPreco && (
        <View style={styles.bestBadge}>
          <Text style={styles.bestBadgeText}>MELHOR PREÇO</Text>
        </View>
      )}

      {/* Header */}
      <TouchableOpacity
        style={styles.header}
        onPress={() => onPharmacyPress(offer.farmacia)}
      >
        <Text style={styles.pharmacyName}>{offer.farmacia}</Text>
        {offer.verificada && (
          <Ionicons name="checkmark-circle" size={18} color={temaMedico.cores.primaria} />
        )}
      </TouchableOpacity>

      {/* Rating e Distância */}
      <View style={styles.infoRow}>
        <View style={styles.infoItem}>
          <Ionicons name="star" size={14} color={temaMedico.cores.terciaria} />
          <Text style={styles.infoText}>{offer.nota}</Text>
        </View>
        <View style={styles.infoItem}>
          <Ionicons name="location-outline" size={14} color={temaMedico.cores.textoClaro} />
          <Text style={styles.infoText}>{offer.distancia}</Text>
        </View>
      </View>

      {/* Preço */}
      <View style={styles.priceRow}>
        <View>
          {offer.precoAntigo && (
            <Text style={styles.oldPrice}>R$ {offer.precoAntigo.toFixed(2)}</Text>
          )}
          <Text style={styles.price}>R$ {offer.preco.toFixed(2)}</Text>
        </View>
        {offer.economia > 0 && (
          <View style={styles.savingsBadge}>
            <Text style={styles.savingsText}>
              Economize R$ {offer.economia.toFixed(2)}
            </Text>
          </View>
        )}
      </View>

      {/* Entrega */}
      <View style={styles.deliveryRow}>
        <Ionicons name="bicycle-outline" size={16} color={temaMedico.cores.textoSubtitulo} />
        <Text style={styles.deliveryText}>
          {offer.entrega} • {offer.tempoEntrega}
        </Text>
      </View>

      {/* Estoque */}
      <Text style={styles.stock}>
        {offer.estoque > 10
          ? 'Em estoque'
          : `Apenas ${offer.estoque} unidade${offer.estoque > 1 ? 's' : ''}`}
      </Text>

      {/* Botão */}
      <TouchableOpacity style={styles.button} onPress={() => onSelect(offer.id)}>
        <Text style={styles.buttonText}>Adicionar ao Carrinho</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: temaMedico.cores.backgroundCard,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    ...temaMedico.sombras.pequena,
  },
  bestOffer: {
    borderWidth: 2,
    borderColor: temaMedico.cores.sucesso,
  },
  bestBadge: {
    position: 'absolute',
    top: -10,
    right: 16,
    backgroundColor: temaMedico.cores.sucesso,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  bestBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  pharmacyName: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    color: temaMedico.cores.textoTitulo,
  },
  infoRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  infoText: {
    fontSize: 13,
    color: temaMedico.cores.textoSubtitulo,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  oldPrice: {
    fontSize: 14,
    color: temaMedico.cores.textoClaro,
    textDecorationLine: 'line-through',
    marginBottom: 2,
  },
  price: {
    fontSize: 24,
    fontWeight: '700',
    color: temaMedico.cores.primaria,
  },
  savingsBadge: {
    backgroundColor: temaMedico.cores.sucesso + '20',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  savingsText: {
    fontSize: 13,
    fontWeight: '600',
    color: temaMedico.cores.sucesso,
  },
  deliveryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  deliveryText: {
    fontSize: 13,
    color: temaMedico.cores.textoSubtitulo,
  },
  stock: {
    fontSize: 12,
    color: temaMedico.cores.textoClaro,
    marginBottom: 12,
  },
  button: {
    backgroundColor: temaMedico.cores.primaria,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFF',
  },
});
