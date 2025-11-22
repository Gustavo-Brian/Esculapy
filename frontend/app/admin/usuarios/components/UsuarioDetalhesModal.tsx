/**
 * Modal de Detalhes do Usuário - Admin
 * Exibe informações completas do usuário e ações de gerenciamento
 */

import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { temaMedico } from '@/src/estilos/temaMedico';
import type { Usuario } from '@/src/servicos/types/admin.types';

interface UsuarioDetalhesModalProps {
  visible: boolean;
  usuario: Usuario | null;
  processando: boolean;
  onClose: () => void;
  onDesativar: (usuarioId: number) => void;
  onReativar: (usuarioId: number) => void;
}

export const UsuarioDetalhesModal: React.FC<UsuarioDetalhesModalProps> = ({
  visible,
  usuario,
  processando,
  onClose,
  onDesativar,
  onReativar,
}) => {
  if (!usuario) return null;

  const handleDesativar = () => {
    Alert.alert(
      'Banir Usuário',
      `Deseja banir o usuário "${usuario.email}"? Esta ação desabilitará a conta do usuário.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Banir',
          style: 'destructive',
          onPress: () => onDesativar(usuario.id),
        },
      ]
    );
  };

  const handleReativar = () => {
    Alert.alert(
      'Desbanir Usuário',
      `Deseja desbanir o usuário "${usuario.email}"? Esta ação reativará a conta do usuário.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Desbanir',
          onPress: () => onReativar(usuario.id),
        },
      ]
    );
  };

  const getRolesLabel = (roles: { id: number; nome: string }[]) => {
    return roles.map(r => {
      switch (r.nome) {
        case 'ROLE_ADMIN':
          return 'Administrador';
        case 'ROLE_CLIENTE':
          return 'Cliente';
        case 'ROLE_LOJISTA_ADMIN':
          return 'Admin Farmácia';
        case 'ROLE_FARMACEUTICO':
          return 'Farmacêutico';
        default:
          return r.nome;
      }
    }).join(', ');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Detalhes do Usuário</Text>
            <TouchableOpacity onPress={onClose} disabled={processando}>
              <Ionicons name="close" size={28} color={temaMedico.cores.textoPrincipal} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
            {/* Status Badge */}
            <View style={styles.statusContainer}>
              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: usuario.enabled ? '#4CAF50' : '#F44336' },
                ]}
              >
                <Ionicons
                  name={usuario.enabled ? 'checkmark-circle' : 'ban'}
                  size={20}
                  color="#FFF"
                />
                <Text style={styles.statusText}>
                  {usuario.enabled ? 'Conta Ativa' : 'Conta Banida'}
                </Text>
              </View>
            </View>

            {/* Informações Básicas */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Informações Básicas</Text>
              <View style={styles.infoRow}>
                <Ionicons name="person" size={20} color={temaMedico.cores.textoClaro} />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>ID</Text>
                  <Text style={styles.infoValue}>{usuario.id}</Text>
                </View>
              </View>
              <View style={styles.infoRow}>
                <Ionicons name="mail" size={20} color={temaMedico.cores.textoClaro} />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Email</Text>
                  <Text style={styles.infoValue}>{usuario.email}</Text>
                </View>
              </View>
              <View style={styles.infoRow}>
                <Ionicons name="shield-checkmark" size={20} color={temaMedico.cores.textoClaro} />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Perfis</Text>
                  <Text style={styles.infoValue}>{getRolesLabel(usuario.roles)}</Text>
                </View>
              </View>
              <View style={styles.infoRow}>
                <Ionicons name="calendar" size={20} color={temaMedico.cores.textoClaro} />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Data de Cadastro</Text>
                  <Text style={styles.infoValue}>{formatDate(usuario.dataCriacao)}</Text>
                </View>
              </View>
            </View>

            {/* Perfil de Cliente */}
            {usuario.cliente && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Perfil de Cliente</Text>
                <View style={styles.infoRow}>
                  <Ionicons name="person" size={20} color={temaMedico.cores.textoClaro} />
                  <View style={styles.infoContent}>
                    <Text style={styles.infoLabel}>Nome</Text>
                    <Text style={styles.infoValue}>{usuario.cliente.nome}</Text>
                  </View>
                </View>
                <View style={styles.infoRow}>
                  <Ionicons name="card" size={20} color={temaMedico.cores.textoClaro} />
                  <View style={styles.infoContent}>
                    <Text style={styles.infoLabel}>CPF</Text>
                    <Text style={styles.infoValue}>{usuario.cliente.cpf}</Text>
                  </View>
                </View>
                {usuario.cliente.numeroCelular && (
                  <View style={styles.infoRow}>
                    <Ionicons name="call" size={20} color={temaMedico.cores.textoClaro} />
                    <View style={styles.infoContent}>
                      <Text style={styles.infoLabel}>Celular</Text>
                      <Text style={styles.infoValue}>{usuario.cliente.numeroCelular}</Text>
                    </View>
                  </View>
                )}
                {usuario.cliente.dataNascimento && (
                  <View style={styles.infoRow}>
                    <Ionicons name="calendar" size={20} color={temaMedico.cores.textoClaro} />
                    <View style={styles.infoContent}>
                      <Text style={styles.infoLabel}>Data de Nascimento</Text>
                      <Text style={styles.infoValue}>
                        {formatDate(usuario.cliente.dataNascimento)}
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            )}

            {/* Perfil de Farmácia Admin */}
            {usuario.farmaciaAdmin && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Administrador de Farmácia</Text>
                <View style={styles.infoRow}>
                  <Ionicons name="business" size={20} color={temaMedico.cores.textoClaro} />
                  <View style={styles.infoContent}>
                    <Text style={styles.infoLabel}>Farmácia</Text>
                    <Text style={styles.infoValue}>{usuario.farmaciaAdmin.nomeFantasia}</Text>
                  </View>
                </View>
                <View style={styles.infoRow}>
                  <Ionicons name="document-text" size={20} color={temaMedico.cores.textoClaro} />
                  <View style={styles.infoContent}>
                    <Text style={styles.infoLabel}>CNPJ</Text>
                    <Text style={styles.infoValue}>{usuario.farmaciaAdmin.cnpj}</Text>
                  </View>
                </View>
                <View style={styles.infoRow}>
                  <Ionicons name="information-circle" size={20} color={temaMedico.cores.textoClaro} />
                  <View style={styles.infoContent}>
                    <Text style={styles.infoLabel}>Status da Farmácia</Text>
                    <Text style={styles.infoValue}>{usuario.farmaciaAdmin.status}</Text>
                  </View>
                </View>
              </View>
            )}

            {/* Perfil de Farmacêutico */}
            {usuario.farmaceutico && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Perfil de Farmacêutico</Text>
                <View style={styles.infoRow}>
                  <Ionicons name="person" size={20} color={temaMedico.cores.textoClaro} />
                  <View style={styles.infoContent}>
                    <Text style={styles.infoLabel}>Nome</Text>
                    <Text style={styles.infoValue}>{usuario.farmaceutico.nome}</Text>
                  </View>
                </View>
                <View style={styles.infoRow}>
                  <Ionicons name="medical" size={20} color={temaMedico.cores.textoClaro} />
                  <View style={styles.infoContent}>
                    <Text style={styles.infoLabel}>CRF</Text>
                    <Text style={styles.infoValue}>{usuario.farmaceutico.crfP}</Text>
                  </View>
                </View>
                <View style={styles.infoRow}>
                  <Ionicons name="business" size={20} color={temaMedico.cores.textoClaro} />
                  <View style={styles.infoContent}>
                    <Text style={styles.infoLabel}>ID da Farmácia</Text>
                    <Text style={styles.infoValue}>{usuario.farmaceutico.farmaciaId}</Text>
                  </View>
                </View>
              </View>
            )}
          </ScrollView>

          {/* Ações */}
          <View style={styles.modalActions}>
            {usuario.enabled ? (
              <TouchableOpacity
                style={styles.banButton}
                onPress={handleDesativar}
                disabled={processando}
              >
                {processando ? (
                  <ActivityIndicator size="small" color="#FFF" />
                ) : (
                  <>
                    <Ionicons name="ban" size={20} color="#FFF" />
                    <Text style={styles.buttonText}>Banir Usuário</Text>
                  </>
                )}
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.unbanButton}
                onPress={handleReativar}
                disabled={processando}
              >
                {processando ? (
                  <ActivityIndicator size="small" color="#FFF" />
                ) : (
                  <>
                    <Ionicons name="checkmark-circle" size={20} color="#FFF" />
                    <Text style={styles.buttonText}>Desbanir Usuário</Text>
                  </>
                )}
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: temaMedico.cores.borda,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: temaMedico.cores.textoPrincipal,
  },
  modalBody: {
    padding: 20,
  },
  statusContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFF',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: temaMedico.cores.textoPrincipal,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 16,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: temaMedico.cores.textoClaro,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
    color: temaMedico.cores.textoPrincipal,
    fontWeight: '500',
  },
  modalActions: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: temaMedico.cores.borda,
  },
  banButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F44336',
    paddingVertical: 14,
    borderRadius: 8,
    gap: 8,
  },
  unbanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    paddingVertical: 14,
    borderRadius: 8,
    gap: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
  },
});
