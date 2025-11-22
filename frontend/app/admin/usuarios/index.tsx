/**
 * Admin - Gerenciamento de Usuários
 * Tela para buscar, visualizar e gerenciar usuários (banir/desbanir)
 */

import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { temaMedico } from '@/src/estilos/temaMedico';
import { Snackbar } from '@/src/componentes/Snackbar';
import { useUsuarios } from './hooks/useUsuarios';
import { UsuarioDetalhesModal } from './components/UsuarioDetalhesModal';

export default function UsuariosAdminScreen() {
  const {
    usuario,
    emailBusca,
    buscando,
    processando,
    modalDetalhesVisivel,
    snackbar,
    setEmailBusca,
    buscarUsuario,
    handleDesativarUsuario,
    handleReativarUsuario,
    limparBusca,
    fecharModalDetalhes,
    hideSnackbar,
  } = useUsuarios();

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <Snackbar
        visible={snackbar.visible}
        message={snackbar.message}
        type={snackbar.type}
        onDismiss={hideSnackbar}
      />
      <UsuarioDetalhesModal
        visible={modalDetalhesVisivel}
        usuario={usuario}
        processando={processando}
        onClose={fecharModalDetalhes}
        onDesativar={handleDesativarUsuario}
        onReativar={handleReativarUsuario}
      />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Gerenciar Usuários</Text>
          <Text style={styles.headerSubtitle}>Buscar e gerenciar contas de usuários</Text>
        </View>

        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Card de Busca */}
          <View style={styles.searchCard}>
            <Text style={styles.cardTitle}>Buscar Usuário por Email</Text>
            <Text style={styles.cardSubtitle}>
              Digite o email completo do usuário que deseja buscar
            </Text>

            {/* Input de Email */}
            <View style={styles.inputContainer}>
              <Ionicons name="mail" size={20} color={temaMedico.cores.textoClaro} />
              <TextInput
                style={styles.input}
                placeholder="exemplo@email.com"
                placeholderTextColor={temaMedico.cores.textoClaro}
                value={emailBusca}
                onChangeText={setEmailBusca}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!buscando}
                onSubmitEditing={buscarUsuario}
                returnKeyType="search"
              />
              {emailBusca.length > 0 && (
                <TouchableOpacity onPress={limparBusca} disabled={buscando}>
                  <Ionicons name="close-circle" size={20} color={temaMedico.cores.textoClaro} />
                </TouchableOpacity>
              )}
            </View>

            {/* Botão de Busca */}
            <TouchableOpacity
              style={[styles.searchButton, buscando && styles.searchButtonDisabled]}
              onPress={buscarUsuario}
              disabled={buscando || !emailBusca.trim()}
            >
              {buscando ? (
                <ActivityIndicator size="small" color="#FFF" />
              ) : (
                <>
                  <Ionicons name="search" size={20} color="#FFF" />
                  <Text style={styles.searchButtonText}>Buscar Usuário</Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          {/* Instruções */}
          <View style={styles.infoCard}>
            <View style={styles.infoIconContainer}>
              <Ionicons name="information-circle" size={24} color={temaMedico.cores.primaria} />
            </View>
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoTitle}>Como usar</Text>
              <Text style={styles.infoText}>
                1. Digite o email completo do usuário{'\n'}
                2. Clique em "Buscar Usuário"{'\n'}
                3. Visualize os detalhes e gerencie a conta
              </Text>
            </View>
          </View>

          {/* Funcionalidades */}
          <View style={styles.featuresCard}>
            <Text style={styles.featuresTitle}>Funcionalidades</Text>
            <View style={styles.featuresList}>
              <View style={styles.featureItem}>
                <View style={styles.featureIconContainer}>
                  <Ionicons name="search" size={20} color={temaMedico.cores.primaria} />
                </View>
                <View style={styles.featureTextContainer}>
                  <Text style={styles.featureTitle}>Buscar por Email</Text>
                  <Text style={styles.featureDescription}>
                    Encontre qualquer usuário pelo endereço de email
                  </Text>
                </View>
              </View>

              <View style={styles.featureItem}>
                <View style={styles.featureIconContainer}>
                  <Ionicons name="eye" size={20} color={temaMedico.cores.primaria} />
                </View>
                <View style={styles.featureTextContainer}>
                  <Text style={styles.featureTitle}>Visualizar Detalhes</Text>
                  <Text style={styles.featureDescription}>
                    Veja informações completas: perfis, roles e dados cadastrais
                  </Text>
                </View>
              </View>

              <View style={styles.featureItem}>
                <View style={styles.featureIconContainer}>
                  <Ionicons name="ban" size={20} color="#F44336" />
                </View>
                <View style={styles.featureTextContainer}>
                  <Text style={styles.featureTitle}>Banir/Desbanir</Text>
                  <Text style={styles.featureDescription}>
                    Desabilite ou reative contas de usuários
                  </Text>
                </View>
              </View>

              <View style={styles.featureItem}>
                <View style={styles.featureIconContainer}>
                  <Ionicons name="shield-checkmark" size={20} color="#4CAF50" />
                </View>
                <View style={styles.featureTextContainer}>
                  <Text style={styles.featureTitle}>Visualizar Roles</Text>
                  <Text style={styles.featureDescription}>
                    Veja todos os perfis do usuário (Cliente, Farmácia, Farmacêutico, Admin)
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Dica de Segurança */}
          <View style={styles.warningCard}>
            <Ionicons name="warning" size={24} color="#FF9800" />
            <View style={styles.warningTextContainer}>
              <Text style={styles.warningTitle}>Atenção</Text>
              <Text style={styles.warningText}>
                Banir um usuário desabilita completamente sua conta. Use esta ação com cuidado.
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: temaMedico.cores.background,
  },
  header: {
    backgroundColor: temaMedico.cores.primaria,
    padding: 20,
    paddingTop: 60,
    paddingBottom: 30,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  searchCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: temaMedico.cores.textoPrincipal,
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: temaMedico.cores.textoClaro,
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: temaMedico.cores.background,
    borderWidth: 1,
    borderColor: temaMedico.cores.borda,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: temaMedico.cores.textoPrincipal,
  },
  searchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: temaMedico.cores.primaria,
    paddingVertical: 14,
    borderRadius: 8,
    gap: 8,
  },
  searchButtonDisabled: {
    opacity: 0.6,
  },
  searchButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    gap: 12,
  },
  infoIconContainer: {
    marginTop: 2,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: temaMedico.cores.textoPrincipal,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: temaMedico.cores.textoSubtitulo,
    lineHeight: 20,
  },
  featuresCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: temaMedico.cores.textoPrincipal,
    marginBottom: 16,
  },
  featuresList: {
    gap: 16,
  },
  featureItem: {
    flexDirection: 'row',
    gap: 12,
  },
  featureIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: temaMedico.cores.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureTextContainer: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: temaMedico.cores.textoPrincipal,
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 13,
    color: temaMedico.cores.textoClaro,
    lineHeight: 18,
  },
  warningCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF3E0',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    gap: 12,
    alignItems: 'flex-start',
  },
  warningTextContainer: {
    flex: 1,
  },
  warningTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#E65100',
    marginBottom: 4,
  },
  warningText: {
    fontSize: 13,
    color: '#F57C00',
    lineHeight: 18,
  },
});
