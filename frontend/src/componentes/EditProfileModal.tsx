/**
 * Componente EditProfileModal - Esculapi
 * Modal para edição de dados do perfil
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { Modal } from './Modal';
import { temaMedico } from '@/src/estilos/temaMedico';

interface EditProfileModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (name: string, phone: string) => Promise<void>;
  initialName?: string;
  initialPhone?: string;
}

export function EditProfileModal({
  visible,
  onClose,
  onSubmit,
  initialName = '',
  initialPhone = '',
}: EditProfileModalProps) {
  const [name, setName] = useState(initialName);
  const [phone, setPhone] = useState(initialPhone);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Atualiza os valores quando os props mudam
  useEffect(() => {
    if (visible) {
      setName(initialName);
      setPhone(initialPhone);
      setError('');
    }
  }, [visible, initialName, initialPhone]);

  const handleSubmit = async () => {
    // Validações
    if (!name || name.trim().length < 3) {
      setError('Nome deve ter no mínimo 3 caracteres');
      return;
    }

    // Validação opcional de telefone
    if (phone && phone.length > 0 && phone.length < 10) {
      setError('Telefone inválido');
      return;
    }

    try {
      setError('');
      setLoading(true);
      await onSubmit(name.trim(), phone.trim());
      onClose();
    } catch (err: any) {
      setError(err.message || 'Erro ao atualizar perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setName(initialName);
    setPhone(initialPhone);
    setError('');
    onClose();
  };

  return (
    <Modal visible={visible} onClose={handleClose} title="Editar Perfil">
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Nome */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Nome Completo</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Digite seu nome"
            placeholderTextColor={temaMedico.cores.textoClaro}
            editable={!loading}
            autoCapitalize="words"
          />
        </View>

        {/* Telefone */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Telefone (opcional)</Text>
          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
            placeholder="(00) 00000-0000"
            placeholderTextColor={temaMedico.cores.textoClaro}
            keyboardType="phone-pad"
            editable={!loading}
          />
        </View>

        {/* Erro */}
        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        {/* Botões */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={handleClose}
            disabled={loading}
          >
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.confirmButton]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.confirmButtonText}>Salvar</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    maxHeight: 400,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: temaMedico.cores.textoPrimario,
    marginBottom: 8,
  },
  input: {
    backgroundColor: temaMedico.cores.backgroundInput,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: temaMedico.cores.borda,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: temaMedico.cores.textoPrimario,
  },
  errorText: {
    fontSize: 14,
    color: temaMedico.cores.erro,
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: temaMedico.cores.backgroundDestaque,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: temaMedico.cores.textoSecundario,
  },
  confirmButton: {
    backgroundColor: temaMedico.cores.primaria,
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
