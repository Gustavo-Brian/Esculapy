/**
 * Layout de Tabs - Esculapi
 * Navegação principal do marketplace
 */

import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#8E8E93',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E5E5EA',
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        headerShown: false, // Cada tela tem seu próprio header customizado
      }}
    >
      {/* HOME - Marketplace Principal */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Início',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size || 24} color={color} />
          ),
        }}
      />

      {/* FARMÁCIAS */}
      <Tabs.Screen
        name="sellers"
        options={{
          title: 'Farmácias',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="storefront" size={size || 24} color={color} />
          ),
          href: '/sellers', // Aponta para a tela sellers fora do grupo tabs
        }}
      />

      {/* FAVORITOS */}
      <Tabs.Screen
        name="favorites"
        options={{
          title: 'Favoritos',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="heart" size={size || 24} color={color} />
          ),
          href: '/favorites',
        }}
      />

      {/* CARRINHO */}
      <Tabs.Screen
        name="cart"
        options={{
          title: 'Carrinho',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="cart" size={size || 24} color={color} />
          ),
          href: '/cart',
        }}
      />

      {/* PERFIL */}
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size || 24} color={color} />
          ),
          href: '/profile',
        }}
      />

      {/* Ocultar telas que não devem aparecer nas tabs */}
      <Tabs.Screen
        name="login"
        options={{
          href: null, // Remove das tabs mas mantém a rota (novo login)
        }}
      />
      <Tabs.Screen
        name="loginAntigo"
        options={{
          href: null, // Remove das tabs (login antigo - backup)
        }}
      />
      <Tabs.Screen
        name="two"
        options={{
          href: null, // Remove das tabs (tela de exemplo)
        }}
      />
    </Tabs>
  );
}
