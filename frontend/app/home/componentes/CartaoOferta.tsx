/**
 * Componente Cartão de Oferta (Melhor Preço)
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { temaMedico } from '@/src/estilos/temaMedico';

interface CartaoOfertaProps {
  produtoNome: string;
  farmacia: string;
  preco: number;
  economia: number;
  onPress?: () => void;
}

export const CartaoOferta: React.FC<CartaoOfertaProps> = ({
  produtoNome,
  farmacia,
  preco,
  economia,
  onPress,
}) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.badge}>
        <Ionicons name="pricetag" size={14} color="#FFF" />
        <Text style={styles.badgeText}>MELHOR PREÇO</Text>
      </View>

      <Text style={styles.nomeProduto} numberOfLines={2}>
        {produtoNome}
      </Text>

      <View style={styles.infoContainer}>
        <View style={styles.farmaciaRow}>
          <Ionicons name="storefront" size={14} color={temaMedico.cores.textoSecundario} />
          <Text style={styles.farmaciaText} numberOfLines={1}>
            {farmacia}
          </Text>
        </View>

        <View style={styles.precoContainer}>
          <Text style={styles.preco}>R$ {preco.toFixed(2)}</Text>
          {economia > 0 && (
            <View style={styles.economiaTag}>
              <Ionicons name="arrow-down" size={12} color={temaMedico.cores.sucesso} />
              <Text style={styles.economiaText}>
                Economize R$ {economia.toFixed(2)}
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: temaMedico.cores.backgroundCard,
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    width: 240,
    borderWidth: 1,
    borderColor: `${temaMedico.cores.primaria}30`,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: temaMedico.cores.primaria,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFF',
  },
  nomeProduto: {
    fontSize: 15,
    fontWeight: '700',
    color: temaMedico.cores.textoTitulo,
    marginBottom: 12,
    lineHeight: 20,
  },
  infoContainer: {
    gap: 8,
  },
  farmaciaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  farmaciaText: {
    fontSize: 12,
    color: temaMedico.cores.textoSecundario,
    flex: 1,
  },
  precoContainer: {
    gap: 4,
  },
  preco: {
    fontSize: 20,
    fontWeight: '700',
    color: temaMedico.cores.primaria,
  },
  economiaTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  economiaText: {
    fontSize: 12,
    fontWeight: '600',
    color: temaMedico.cores.sucesso,
  },
});
