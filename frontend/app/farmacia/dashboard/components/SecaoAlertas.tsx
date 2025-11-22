/**
 * Componente de Seção de Alertas
 * Exibe alertas de estoque baixo, esgotados e recentes
 */

import React, { ComponentProps } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { temaMedico } from '@/src/estilos/temaMedico';
import type { Alerta, NivelAlerta } from '../tipos/alerta.types';

interface SecaoAlertasProps {
  alertas: Alerta[];
}

export const SecaoAlertas: React.FC<SecaoAlertasProps> = ({ alertas }) => {
  const getCorPorNivel = (nivel: NivelAlerta): string => {
    switch (nivel) {
      case 'error':
        return temaMedico.cores.erro;
      case 'warning':
        return temaMedico.cores.alerta;
      case 'success':
        return temaMedico.cores.sucesso;
      case 'info':
      default:
        return temaMedico.cores.primaria;
    }
  };

  const getIconePorTipo = (tipo: string): ComponentProps<typeof Ionicons>['name'] => {
    switch (tipo) {
      case 'esgotado':
        return 'close-circle';
      case 'estoque_baixo':
        return 'alert-circle';
      case 'recente':
        return 'time';
      case 'vendas':
        return 'trending-up';
      case 'aguardando_receita':
        return 'document-text';
      case 'em_separacao':
        return 'cube';
      case 'pendente':
        return 'hourglass';
      default:
        return 'information-circle';
    }
  };

  if (alertas.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.titulo}>Alertas</Text>
        <View style={styles.emptyContainer}>
          <Ionicons name="checkmark-circle" size={48} color={temaMedico.cores.sucesso} />
          <Text style={styles.emptyText}>Nenhum alerta no momento</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Alertas</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {alertas.map((alerta) => (
          <View key={alerta.id} style={styles.alertCard}>
            <View style={styles.alertHeader}>
              <Ionicons
                name={getIconePorTipo(alerta.tipo)}
                size={24}
                color={getCorPorNivel(alerta.nivel)}
              />
              <Text style={[styles.alertTitulo, { color: getCorPorNivel(alerta.nivel) }]}>
                {alerta.titulo}
              </Text>
            </View>
            <Text style={styles.alertMensagem}>{alerta.mensagem}</Text>
            {alerta.quantidade !== undefined && (
              <View style={styles.alertBadge}>
                <Text style={styles.badgeText}>
                  {alerta.quantidade === 0 ? 'Esgotado' : `${alerta.quantidade} unid.`}
                </Text>
              </View>
            )}
          </View>
        ))}
      </ScrollView>
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
  scrollContent: {
    gap: 12,
    paddingRight: 16,
  },
  alertCard: {
    width: 280,
    backgroundColor: temaMedico.cores.backgroundCard,
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: temaMedico.cores.alerta,
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  alertTitulo: {
    fontSize: 15,
    fontWeight: '700',
  },
  alertMensagem: {
    fontSize: 14,
    color: temaMedico.cores.textoSubtitulo,
    lineHeight: 20,
    marginBottom: 8,
  },
  alertBadge: {
    backgroundColor: temaMedico.cores.backgroundInput,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: temaMedico.cores.textoTitulo,
  },
  emptyContainer: {
    backgroundColor: temaMedico.cores.backgroundCard,
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    gap: 8,
  },
  emptyText: {
    fontSize: 14,
    color: temaMedico.cores.textoSubtitulo,
  },
});
