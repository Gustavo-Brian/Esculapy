/**
 * OfferCard Component
 * Card de oferta de produto em uma farmácia
 * Segue o padrão de design da página seller (borda roxa + sombra forte)
 */

import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { temaMedico } from '@/src/estilos/temaMedico';
import type { ProductOffer } from '../hooks/useProductOffers';

interface OfferCardProps {
  offer: ProductOffer;
  onPress: (farmaciaId: number) => void;
  onAddToCart?: (offer: ProductOffer) => void;
  isBestPrice?: boolean;
}

export const OfferCard: React.FC<OfferCardProps> = ({ offer, onPress, onAddToCart, isBestPrice }) => {
  return (
    <TouchableOpacity
      style={[
        styles.container,
        isBestPrice && styles.containerBestPrice,
        !offer.ativo && styles.containerInactive,
      ]}
      onPress={() => onPress(offer.farmaciaId)}
      activeOpacity={0.7}
    >
      {/* Badge de melhor preço */}
      {isBestPrice && (
        <View style={styles.badgeBestPrice}>
          <Ionicons name="star" size={12} color={temaMedico.cores.textoBranco} />
          <Text style={styles.badgeText}>Melhor Preço</Text>
        </View>
      )}

      {/* Badge de indisponível */}
      {!offer.ativo && (
        <View style={styles.badgeInactive}>
          <Text style={styles.badgeInactiveText}>Indisponível</Text>
        </View>
      )}

      {/* Informações da farmácia */}
      <View style={styles.farmaciaRow}>
        <View style={styles.farmaciaIcone}>
          <Ionicons name="storefront" size={24} color={temaMedico.cores.primaria} />
        </View>
        <View style={styles.farmaciaInfo}>
          <Text style={styles.farmaciaNome} numberOfLines={1}>
            {offer.farmaciaNome}
          </Text>
          {offer.avaliacao && offer.avaliacao > 0 && (
            <View style={styles.avaliacaoRow}>
              <Ionicons name="star" size={14} color={temaMedico.cores.terciaria} />
              <Text style={styles.avaliacaoTexto}>{offer.avaliacao.toFixed(1)}</Text>
            </View>
          )}
        </View>
      </View>

      {/* Informações de localização e entrega */}
      <View style={styles.infoRow}>
        <View style={styles.infoItem}>
          <Ionicons name="location-outline" size={14} color={temaMedico.cores.textoSubtitulo} />
          <Text style={styles.infoTexto}>{offer.distancia}</Text>
        </View>
        <View style={styles.infoItem}>
          <Ionicons name="time-outline" size={14} color={temaMedico.cores.textoSubtitulo} />
          <Text style={styles.infoTexto}>{offer.tempoEntrega}</Text>
        </View>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Preço e estoque */}
      <View style={styles.footerRow}>
        <View style={styles.precoContainer}>
          <Text style={styles.precoLabel}>Preço</Text>
          <Text style={styles.preco}>
            R$ {offer.preco.toFixed(2).replace('.', ',')}
          </Text>
        </View>

        <View style={styles.estoqueContainer}>
          <View style={styles.estoqueRow}>
            <Ionicons
              name={offer.quantidade > 0 ? 'checkmark-circle' : 'close-circle'}
              size={16}
              color={offer.quantidade > 0 ? temaMedico.cores.sucesso : temaMedico.cores.erro}
            />
            <Text style={[
              styles.estoqueTexto,
              offer.quantidade === 0 && styles.estoqueTextoZero
            ]}>
              {offer.quantidade > 0
                ? `${offer.quantidade} un.`
                : 'Esgotado'}
            </Text>
          </View>
        </View>
      </View>

      {/* Botões de ação */}
      {!offer.ativo || offer.quantidade === 0 ? (
        <TouchableOpacity
          style={[styles.botao, styles.botaoDesabilitado]}
          disabled
        >
          <Text style={styles.botaoTexto}>Indisponível</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.botoesContainer}>
          <TouchableOpacity
            style={[styles.botao, styles.botaoSecundario]}
            onPress={() => onPress(offer.farmaciaId)}
          >
            <Ionicons name="storefront-outline" size={16} color={temaMedico.cores.primaria} />
            <Text style={[styles.botaoTexto, styles.botaoTextoSecundario]}>Ver Loja</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.botao, styles.botaoPrimario]}
            onPress={() => onAddToCart?.(offer)}
          >
            <Ionicons name="cart-outline" size={16} color={temaMedico.cores.textoBranco} />
            <Text style={styles.botaoTexto}>Adicionar</Text>
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: temaMedico.cores.backgroundCard,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
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
    position: 'relative',
  },
  containerBestPrice: {
    borderColor: temaMedico.cores.sucesso,
  },
  containerInactive: {
    opacity: 0.6,
  },
  badgeBestPrice: {
    position: 'absolute',
    top: -8,
    left: 16,
    backgroundColor: temaMedico.cores.sucesso,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 10,
    ...temaMedico.sombras.pequena,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: temaMedico.fontes.pesos.bold,
    color: temaMedico.cores.textoBranco,
  },
  badgeInactive: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: temaMedico.cores.erro,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 10,
  },
  badgeInactiveText: {
    fontSize: 11,
    fontWeight: temaMedico.fontes.pesos.bold,
    color: temaMedico.cores.textoBranco,
  },
  farmaciaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  farmaciaIcone: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: temaMedico.cores.primaria + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  farmaciaInfo: {
    flex: 1,
  },
  farmaciaNome: {
    fontSize: 16,
    fontWeight: temaMedico.fontes.pesos.bold,
    color: temaMedico.cores.textoTitulo,
    marginBottom: 4,
  },
  avaliacaoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  avaliacaoTexto: {
    fontSize: 13,
    fontWeight: temaMedico.fontes.pesos.semibold,
    color: temaMedico.cores.textoSubtitulo,
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
  infoTexto: {
    fontSize: 13,
    color: temaMedico.cores.textoSubtitulo,
  },
  divider: {
    height: 1,
    backgroundColor: temaMedico.cores.borda,
    marginVertical: 12,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  precoContainer: {
    flex: 1,
  },
  precoLabel: {
    fontSize: 12,
    color: temaMedico.cores.textoClaro,
    marginBottom: 4,
  },
  preco: {
    fontSize: 24,
    fontWeight: temaMedico.fontes.pesos.bold,
    color: temaMedico.cores.primaria,
  },
  estoqueContainer: {
    alignItems: 'flex-end',
  },
  estoqueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  estoqueTexto: {
    fontSize: 13,
    fontWeight: temaMedico.fontes.pesos.medium,
    color: temaMedico.cores.sucesso,
  },
  estoqueTextoZero: {
    color: temaMedico.cores.erro,
  },
  botoesContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  botao: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: temaMedico.bordas.media,
    ...temaMedico.sombras.pequena,
  },
  botaoPrimario: {
    backgroundColor: temaMedico.cores.primaria,
  },
  botaoSecundario: {
    backgroundColor: temaMedico.cores.backgroundCard,
    borderWidth: 1.5,
    borderColor: temaMedico.cores.primaria,
  },
  botaoDesabilitado: {
    backgroundColor: temaMedico.cores.textoClaro,
    opacity: 0.5,
  },
  botaoTexto: {
    fontSize: 14,
    fontWeight: temaMedico.fontes.pesos.semibold,
    color: temaMedico.cores.textoBranco,
  },
  botaoTextoSecundario: {
    color: temaMedico.cores.primaria,
  },
});
