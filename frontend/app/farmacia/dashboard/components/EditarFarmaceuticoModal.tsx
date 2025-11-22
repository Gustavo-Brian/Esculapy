/**
 * Modal para editar farmacêutico
 */

import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { temaMedico } from '@/src/estilos/temaMedico';
import type { Farmaceutico } from '@/src/servicos/types/api.types';

interface EditarFarmaceuticoModalProps {
  visible: boolean;
  farmaceutico: Farmaceutico | null;
  onSave: (farmaceuticoId: number, nome: string, numeroCelular: string) => Promise<void>;
  onCancel: () => void;
}

export const EditarFarmaceuticoModal: React.FC<EditarFarmaceuticoModalProps> = ({
  visible,
  farmaceutico,
  onSave,
  onCancel,
}) => {
  const [nome, setNome] = useState('');
  const [numeroCelular, setNumeroCelular] = useState('');
  const [salvando, setSalvando] = useState(false);
  const [erros, setErros] = useState<{ nome?: string; numeroCelular?: string }>({});

  useEffect(() => {
    if (farmaceutico) {
      setNome(farmaceutico.nome);
      setNumeroCelular(farmaceutico.numeroCelular);
      setErros({});
    }
  }, [farmaceutico]);

  const validar = (): boolean => {
    const novosErros: { nome?: string; numeroCelular?: string } = {};

    if (!nome.trim()) {
      novosErros.nome = 'Nome é obrigatório';
    }

    if (!numeroCelular.trim()) {
      novosErros.numeroCelular = 'Número de celular é obrigatório';
    } else if (!/^\d{10,11}$/.test(numeroCelular.replace(/\D/g, ''))) {
      novosErros.numeroCelular = 'Número de celular inválido';
    }

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleSalvar = async () => {
    if (!farmaceutico || !validar()) return;

    setSalvando(true);
    try {
      await onSave(farmaceutico.id, nome.trim(), numeroCelular.replace(/\D/g, ''));
    } catch (error) {
      // Erro já é tratado no handler
    } finally {
      setSalvando(false);
    }
  };

  const formatarCelular = (valor: string) => {
    const numeros = valor.replace(/\D/g, '');
    if (numeros.length <= 11) {
      return numeros
        .replace(/^(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{5})(\d)/, '$1-$2');
    }
    return numeroCelular;
  };

  if (!farmaceutico) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onCancel}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.overlay}
      >
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Ionicons name="create-outline" size={24} color={temaMedico.cores.primaria} />
            <Text style={styles.title}>Editar Farmacêutico</Text>
          </View>

          {/* Campos */}
          <View style={styles.form}>
            {/* Nome */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nome *</Text>
              <TextInput
                style={[styles.input, erros.nome && styles.inputError]}
                value={nome}
                onChangeText={(text) => {
                  setNome(text);
                  if (erros.nome) setErros({ ...erros, nome: undefined });
                }}
                placeholder="Nome completo"
                editable={!salvando}
              />
              {erros.nome && <Text style={styles.errorText}>{erros.nome}</Text>}
            </View>

            {/* Número de Celular */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Celular *</Text>
              <TextInput
                style={[styles.input, erros.numeroCelular && styles.inputError]}
                value={formatarCelular(numeroCelular)}
                onChangeText={(text) => {
                  const numeros = text.replace(/\D/g, '');
                  setNumeroCelular(numeros);
                  if (erros.numeroCelular) setErros({ ...erros, numeroCelular: undefined });
                }}
                placeholder="(00) 00000-0000"
                keyboardType="phone-pad"
                maxLength={15}
                editable={!salvando}
              />
              {erros.numeroCelular && <Text style={styles.errorText}>{erros.numeroCelular}</Text>}
            </View>

            {/* Informações não editáveis */}
            <View style={styles.infoBox}>
              <View style={styles.infoRow}>
                <Ionicons name="mail" size={16} color={temaMedico.cores.textoSecundario} />
                <Text style={styles.infoText}>{farmaceutico.email}</Text>
              </View>
              <View style={styles.infoRow}>
                <Ionicons name="medical" size={16} color={temaMedico.cores.textoSecundario} />
                <Text style={styles.infoText}>CRF: {farmaceutico.crfP}</Text>
              </View>
            </View>
          </View>

          {/* Botões */}
          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onCancel}
              disabled={salvando}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.saveButton, salvando && styles.buttonDisabled]}
              onPress={handleSalvar}
              disabled={salvando}
            >
              {salvando ? (
                <ActivityIndicator size="small" color="#FFF" />
              ) : (
                <>
                  <Ionicons name="checkmark-circle" size={20} color="#FFF" />
                  <Text style={styles.saveButtonText}>Salvar</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
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
    maxWidth: 500,
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: `${temaMedico.cores.textoClaro}30`,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: temaMedico.cores.textoTitulo,
  },
  form: {
    gap: 16,
    marginBottom: 24,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: temaMedico.cores.textoTitulo,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: `${temaMedico.cores.textoClaro}50`,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    color: temaMedico.cores.textoTitulo,
    backgroundColor: '#FFF',
  },
  inputError: {
    borderColor: temaMedico.cores.erro,
  },
  errorText: {
    fontSize: 12,
    color: temaMedico.cores.erro,
    marginTop: 4,
  },
  infoBox: {
    backgroundColor: `${temaMedico.cores.primaria}10`,
    borderRadius: 8,
    padding: 12,
    gap: 8,
    marginTop: 8,
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
  buttonsContainer: {
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
  saveButton: {
    backgroundColor: temaMedico.cores.primaria,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFF',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});
