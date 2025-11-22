/**
 * Modal para confirmar desativação de farmacêutico
 */

import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { temaMedico } from '@/src/estilos/temaMedico';
import type { Farmaceutico } from '@/src/servicos/types/api.types';

interface ConfirmarDesativacaoFarmaceuticoModalProps {
  visible: boolean;
  farmaceutico: Farmaceutico | null;
  onConfirm: () => Promise<void>;
  onCancel: () => void;
  carregando?: boolean;
}

export const ConfirmarDesativacaoFarmaceuticoModal: React.FC<ConfirmarDesativacaoFarmaceuticoModalProps> = ({
  visible,
  farmaceutico,
  onConfirm,
  onCancel,
  carregando = false,
}) => {
  if (!farmaceutico) return null;

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onCancel}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Ícone de Alerta */}
          <View style={styles.iconContainer}>
            <Ionicons name="warning" size={64} color={temaMedico.cores.alerta} />
          </View>

          {/* Título */}
          <Text style={styles.title}>Desativar Farmacêutico?</Text>

          {/* Mensagem */}
          <Text style={styles.message}>
            Você está prestes a desativar o acesso de:
          </Text>

          {/* Informações do Farmacêutico */}
          <View style={styles.infoBox}>
            <View style={styles.infoHeader}>
              <Ionicons name="person-circle" size={32} color={temaMedico.cores.primaria} />
              <Text style={styles.infoNome}>{farmaceutico.nome}</Text>
            </View>

            <View style={styles.infoDetails}>
              <View style={styles.infoRow}>
                <Ionicons name="mail" size={14} color={temaMedico.cores.textoSecundario} />
                <Text style={styles.infoText}>{farmaceutico.email}</Text>
              </View>
              <View style={styles.infoRow}>
                <Ionicons name="medical" size={14} color={temaMedico.cores.textoSecundario} />
                <Text style={styles.infoText}>CRF: {farmaceutico.crfP}</Text>
              </View>
            </View>
          </View>

          {/* Aviso */}
          <View style={styles.warningBox}>
            <Ionicons name="information-circle" size={20} color={temaMedico.cores.primaria} />
            <Text style={styles.warningText}>
              O farmacêutico não poderá mais acessar o sistema, mas seus dados serão mantidos.
            </Text>
          </View>

          {/* Botões */}
          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onCancel}
              disabled={carregando}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.confirmButton, carregando && styles.buttonDisabled]}
              onPress={onConfirm}
              disabled={carregando}
            >
              {carregando ? (
                <ActivityIndicator size="small" color="#FFF" />
              ) : (
                <>
                  <Ionicons name="remove-circle" size={20} color="#FFF" />
                  <Text style={styles.confirmButtonText}>Desativar</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '90%',
    maxWidth: 450,
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
    alignItems: 'center',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: `${temaMedico.cores.alerta}15`,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: temaMedico.cores.textoTitulo,
    marginBottom: 12,
    textAlign: 'center',
  },
  message: {
    fontSize: 15,
    color: temaMedico.cores.textoSecundario,
    textAlign: 'center',
    marginBottom: 20,
  },
  infoBox: {
    width: '100%',
    backgroundColor: `${temaMedico.cores.primaria}10`,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: `${temaMedico.cores.primaria}20`,
  },
  infoNome: {
    fontSize: 16,
    fontWeight: '700',
    color: temaMedico.cores.textoTitulo,
    flex: 1,
  },
  infoDetails: {
    gap: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoText: {
    fontSize: 13,
    color: temaMedico.cores.textoSecundario,
  },
  warningBox: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: `${temaMedico.cores.primaria}10`,
    borderRadius: 8,
    padding: 12,
    marginBottom: 24,
  },
  warningText: {
    flex: 1,
    fontSize: 13,
    color: temaMedico.cores.primaria,
    lineHeight: 18,
  },
  buttonsContainer: {
    width: '100%',
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    height: 50,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  cancelButton: {
    backgroundColor: `${temaMedico.cores.textoClaro}20`,
    borderWidth: 1,
    borderColor: temaMedico.cores.textoClaro,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: temaMedico.cores.textoSecundario,
  },
  confirmButton: {
    backgroundColor: temaMedico.cores.erro,
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFF',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});
