/**
 * Layout Admin Dashboard - Esculapi
 * Layout principal com navegação por tabs para área administrativa
 */

import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { temaMedico } from '@/src/estilos/temaMedico';
import { ProtectedAdminRoute } from '@/src/componentes/ProtectedAdminRoute';

export default function AdminLayout() {
  return (
    <ProtectedAdminRoute>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: temaMedico.cores.primaria,
          tabBarInactiveTintColor: temaMedico.cores.textoClaro,
          tabBarStyle: {
            backgroundColor: temaMedico.cores.background,
            borderTopColor: temaMedico.cores.borda,
            height: 60,
            paddingBottom: 8,
            paddingTop: 8,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '600',
          },
        }}
      >
        {/* Dashboard Overview */}
        <Tabs.Screen
          name="index"
          options={{
            title: 'Dashboard',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="stats-chart" size={size} color={color} />
            ),
          }}
        />

        {/* Gerenciamento de Farmácias */}
        <Tabs.Screen
          name="farmacias"
          options={{
            title: 'Farmácias',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="business" size={size} color={color} />
            ),
          }}
        />

        {/* Gerenciamento de Usuários */}
        <Tabs.Screen
          name="usuarios"
          options={{
            title: 'Usuários',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="people" size={size} color={color} />
            ),
          }}
        />

        {/* Gerenciamento de Produtos (Catálogo) */}
        <Tabs.Screen
          name="produtos"
          options={{
            title: 'Catálogo',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="medkit" size={size} color={color} />
            ),
          }}
        />
      </Tabs>
    </ProtectedAdminRoute>
  );
}
