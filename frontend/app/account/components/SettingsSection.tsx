/**
 * SettingsSection Component
 * Seção de configurações com lista de itens
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { temaMedico } from '@/src/estilos/temaMedico';
import type { SettingsSection as SettingsSectionType } from '../types/account.types';

interface SettingsSectionProps {
  section: SettingsSectionType;
}

export const SettingsSection: React.FC<SettingsSectionProps> = ({ section }) => {
  const visibleItems = section.items.filter((item) => item.show);

  if (visibleItems.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{section.title}</Text>
      <View style={styles.content}>
        {visibleItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.item,
              index === visibleItems.length - 1 && styles.itemLast,
            ]}
            onPress={item.onPress}
          >
            <View style={styles.icon}>
              <Ionicons name={item.icon} size={22} color={temaMedico.cores.primaria} />
            </View>
            <View style={styles.itemContent}>
              <Text style={styles.itemTitle}>{item.title}</Text>
              <Text style={styles.itemSubtitle}>{item.subtitle}</Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={temaMedico.cores.textoSecundario}
            />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: temaMedico.cores.textoSecundario,
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  content: {
    backgroundColor: temaMedico.cores.backgroundCard,
    borderRadius: 12,
    overflow: 'hidden',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 16,
    borderBottomWidth: 1,
    borderBottomColor: temaMedico.cores.borda,
  },
  itemLast: {
    borderBottomWidth: 0,
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: temaMedico.cores.backgroundDestaque,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemContent: {
    flex: 1,
    gap: 2,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: temaMedico.cores.textoPrimario,
  },
  itemSubtitle: {
    fontSize: 13,
    color: temaMedico.cores.textoSecundario,
  },
});
