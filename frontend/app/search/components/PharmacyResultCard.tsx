/**
 * PharmacyResultCard Component
 * Card de farmácia nos resultados de busca
 */

import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { temaMedico } from '@/src/estilos/temaMedico';
import type { FarmaciaResponse } from '@/src/servicos/types/api.types';

interface PharmacyResultCardProps {
  pharmacy: FarmaciaResponse;
  onPress: (id: number) => void;
}

export const PharmacyResultCard: React.FC<PharmacyResultCardProps> = ({
  pharmacy,
  onPress,
}) => {
  return (
    <TouchableOpacity style={styles.container} onPress={() => onPress(pharmacy.id)}>
      {/* Ícone */}
      <View style={styles.iconContainer}>
        <Ionicons name="storefront" size={32} color={temaMedico.cores.primaria} />
      </View>

      {/* Informações */}
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {pharmacy.nome}
        </Text>

        <View style={styles.row}>
          <Ionicons
            name="location-outline"
            size={14}
            color={temaMedico.cores.textoSubtitulo}
          />
          <Text style={styles.address} numberOfLines={1}>
            {pharmacy.endereco.logradouro}, {pharmacy.endereco.numero} - {pharmacy.endereco.bairro}
          </Text>
        </View>

        <View style={styles.row}>
          <Ionicons name="call-outline" size={14} color={temaMedico.cores.textoSubtitulo} />
          <Text style={styles.phone}>{pharmacy.telefone}</Text>
        </View>
      </View>

      {/* Seta */}
      <Ionicons name="chevron-forward" size={20} color={temaMedico.cores.textoClaro} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: temaMedico.cores.backgroundCard,
    padding: 14,
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
    gap: 6,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: temaMedico.cores.textoTitulo,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  address: {
    flex: 1,
    fontSize: 13,
    color: temaMedico.cores.textoSubtitulo,
  },
  phone: {
    fontSize: 13,
    color: temaMedico.cores.textoSubtitulo,
  },
});
