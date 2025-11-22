/**
 * Componente de Ações Rápidas
 * Grid com 6 ações principais do dashboard
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { temaMedico } from '@/src/estilos/temaMedico';
import type { AcaoRapida } from '../tipos/acoes.types';

interface AcoesRapidasProps {
  acoes: AcaoRapida[];
}

export const AcoesRapidas: React.FC<AcoesRapidasProps> = ({ acoes }) => {
  if (acoes.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Ações Rápidas</Text>
      <View style={styles.grid}>
        {acoes.map((acao) => (
          <TouchableOpacity
            key={acao.id}
            style={styles.acaoCard}
            onPress={acao.onPress}
            activeOpacity={0.7}
          >
            <View style={[styles.iconeContainer, { backgroundColor: acao.cor }]}>
              <Ionicons name={acao.icone} size={24} color="#FFF" />
              {acao.badge !== undefined && acao.badge > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{acao.badge}</Text>
                </View>
              )}
            </View>
            <Text style={styles.acaoTitulo} numberOfLines={2}>
              {acao.titulo}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  titulo: {
    fontSize: 18,
    fontWeight: '700',
    color: temaMedico.cores.textoTitulo,
    marginBottom: 12,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  acaoCard: {
    width: '31%', // 3 colunas com gaps
    backgroundColor: temaMedico.cores.backgroundCard,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    gap: 10,
    minHeight: 120,
  },
  iconeContainer: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: temaMedico.cores.erro,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
    borderWidth: 2,
    borderColor: temaMedico.cores.backgroundCard,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFF',
  },
  acaoTitulo: {
    fontSize: 13,
    fontWeight: '600',
    color: temaMedico.cores.textoTitulo,
    textAlign: 'center',
    lineHeight: 18,
  },
});
