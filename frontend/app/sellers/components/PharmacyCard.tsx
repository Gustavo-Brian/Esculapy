/**
 * PharmacyCard Component
 * Card de farmácia
 */

import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { temaMedico } from '@/src/estilos/temaMedico';
import type { Pharmacy } from '../types/sellers.types';

interface PharmacyCardProps {
  pharmacy: Pharmacy;
  onPress: (id: number) => void;
}

export const PharmacyCard: React.FC<PharmacyCardProps> = ({ pharmacy, onPress }) => {
  return (
    <TouchableOpacity
      style={[styles.container, pharmacy.fechada && styles.containerClosed]}
      onPress={() => onPress(pharmacy.id)}
    >
      {/* Header com ícone */}
      <View style={[styles.header, { backgroundColor: pharmacy.corCapa }]}>
        <Ionicons name={pharmacy.icone as any} size={40} color={temaMedico.cores.primaria} />
      </View>

      {/* Conteúdo */}
      <View style={styles.content}>
        {/* Nome e verificação */}
        <View style={styles.titleRow}>
          <Text style={styles.name} numberOfLines={1}>
            {pharmacy.nome}
          </Text>
          {pharmacy.verificada && (
            <Ionicons
              name="checkmark-circle"
              size={18}
              color={temaMedico.cores.primaria}
              style={styles.verifiedIcon}
            />
          )}
        </View>

        {/* Avaliação */}
        <View style={styles.ratingRow}>
          <Ionicons name="star" size={16} color={temaMedico.cores.terciaria} />
          <Text style={styles.rating}>
            {pharmacy.avaliacao} ({pharmacy.totalAvaliacoes})
          </Text>
        </View>

        {/* Informações */}
        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Ionicons name="location-outline" size={14} color={temaMedico.cores.textoClaro} />
            <Text style={styles.infoText}>{pharmacy.distancia}</Text>
          </View>
          <View style={styles.infoItem}>
            <Ionicons name="time-outline" size={14} color={temaMedico.cores.textoClaro} />
            <Text style={styles.infoText}>{pharmacy.tempoEntrega}</Text>
          </View>
        </View>

        {/* Tags */}
        {pharmacy.tags.length > 0 && (
          <View style={styles.tagsRow}>
            {pharmacy.tags.map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* Badge de fechado */}
      {pharmacy.fechada && (
        <View style={styles.closedBadge}>
          <Text style={styles.closedText}>Fechada</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: temaMedico.cores.backgroundCard,
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    overflow: 'hidden',
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
  containerClosed: {
    opacity: 0.6,
  },
  header: {
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 16,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  name: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    color: temaMedico.cores.textoTitulo,
  },
  verifiedIcon: {
    marginLeft: 6,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  rating: {
    fontSize: 14,
    fontWeight: '600',
    color: temaMedico.cores.textoSubtitulo,
    marginLeft: 4,
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
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  tag: {
    backgroundColor: temaMedico.cores.backgroundDestaque,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '600',
    color: temaMedico.cores.primaria,
  },
  closedBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: temaMedico.cores.erro,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  closedText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFF',
  },
});
