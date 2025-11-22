/**
 * Modal de Cadastro de Farmacêutico - Esculapi
 * Permite que o dono da farmácia cadastre novos farmacêuticos
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
import { Ionicons } from '@expo/vector-icons';
import { Modal } from './Modal';
import { temaMedico } from '@/src/estilos/temaMedico';
import { RegisterFarmaceuticoRequest } from '@/src/servicos/types/api.types';
import {
  validarCPF,
  validarCRF,
  validarEmail,
  formatarCPF,
} from '@/src/servicos/farmaceutico/farmaceuticoService';

interface AdicionarFarmaceuticoModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (request: RegisterFarmaceuticoRequest) => Promise<void>;
}

export function AdicionarFarmaceuticoModal({
  visible,
  onClose,
  onSubmit,
}: AdicionarFarmaceuticoModalProps) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [cpf, setCpf] = useState('');
  const [crf, setCrf] = useState('');
  const [celular, setCelular] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [mostrarSenha, setMostrarSenha] = useState(false);

  // Limpa formulário quando modal abre/fecha
  useEffect(() => {
    if (visible) {
      setNome('');
      setEmail('');
      setSenha('');
      setConfirmarSenha('');
      setCpf('');
      setCrf('');
      setCelular('');
      setErrors({});
      setMostrarSenha(false);
    }
  }, [visible]);

  const validarFormulario = (): boolean => {
    const novosErros: Record<string, string> = {};

    // Nome
    if (!nome.trim()) {
      novosErros.nome = 'Nome é obrigatório';
    } else if (nome.trim().length < 3) {
      novosErros.nome = 'Nome deve ter pelo menos 3 caracteres';
    }

    // Email
    if (!email.trim()) {
      novosErros.email = 'Email é obrigatório';
    } else if (!validarEmail(email)) {
      novosErros.email = 'Email inválido';
    }

    // Senha
    if (!senha) {
      novosErros.senha = 'Senha é obrigatória';
    } else if (senha.length < 6) {
      novosErros.senha = 'Senha deve ter pelo menos 6 caracteres';
    }

    // Confirmar senha
    if (senha !== confirmarSenha) {
      novosErros.confirmarSenha = 'As senhas não coincidem';
    }

    // CPF
    if (!cpf.trim()) {
      novosErros.cpf = 'CPF é obrigatório';
    } else if (!validarCPF(cpf)) {
      novosErros.cpf = 'CPF inválido';
    }

    // CRF
    if (!crf.trim()) {
      novosErros.crf = 'CRF é obrigatório';
    } else if (!validarCRF(crf)) {
      novosErros.crf = 'CRF inválido (mínimo 3 caracteres)';
    }

    // Celular
    if (!celular.trim()) {
      novosErros.celular = 'Celular é obrigatório';
    } else if (celular.replace(/\D/g, '').length < 10) {
      novosErros.celular = 'Celular inválido (mínimo 10 dígitos)';
    }

    setErrors(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleSubmit = async () => {
    if (!validarFormulario()) return;

    try {
      setLoading(true);
      const request: RegisterFarmaceuticoRequest = {
        nome: nome.trim(),
        email: email.trim().toLowerCase(),
        senha,
        cpf: cpf.replace(/\D/g, ''), // Remove formatação do CPF
        crfP: crf.trim(), // Backend espera 'crfP'
        numeroCelular: celular.replace(/\D/g, ''), // Backend espera 'numeroCelular'
      };

      await onSubmit(request);
      onClose();
    } catch (err: any) {
      setErrors({ geral: err.message || 'Erro ao cadastrar farmacêutico' });
    } finally {
      setLoading(false);
    }
  };

  const handleCpfChange = (text: string) => {
    // Permite apenas números
    const apenasNumeros = text.replace(/\D/g, '');
    setCpf(apenasNumeros);
  };

  return (
    <Modal visible={visible} onClose={onClose} title="Adicionar Farmacêutico">
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Nome */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Nome Completo *</Text>
          <TextInput
            style={[styles.input, errors.nome && styles.inputError]}
            value={nome}
            onChangeText={setNome}
            placeholder="Digite o nome completo"
            placeholderTextColor={temaMedico.cores.textoClaro}
            editable={!loading}
            autoCapitalize="words"
          />
          {errors.nome && <Text style={styles.errorText}>{errors.nome}</Text>}
        </View>

        {/* Email */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email *</Text>
          <TextInput
            style={[styles.input, errors.email && styles.inputError]}
            value={email}
            onChangeText={setEmail}
            placeholder="exemplo@email.com"
            placeholderTextColor={temaMedico.cores.textoClaro}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!loading}
          />
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
        </View>

        {/* CPF */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>CPF *</Text>
          <TextInput
            style={[styles.input, errors.cpf && styles.inputError]}
            value={cpf}
            onChangeText={handleCpfChange}
            placeholder="00000000000"
            placeholderTextColor={temaMedico.cores.textoClaro}
            keyboardType="number-pad"
            maxLength={11}
            editable={!loading}
          />
          {cpf.length === 11 && (
            <Text style={styles.helperText}>{formatarCPF(cpf)}</Text>
          )}
          {errors.cpf && <Text style={styles.errorText}>{errors.cpf}</Text>}
        </View>

        {/* CRF */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>CRF (Registro Profissional) *</Text>
          <TextInput
            style={[styles.input, errors.crf && styles.inputError]}
            value={crf}
            onChangeText={setCrf}
            placeholder="Ex: 12345/SP"
            placeholderTextColor={temaMedico.cores.textoClaro}
            autoCapitalize="characters"
            editable={!loading}
          />
          {errors.crf && <Text style={styles.errorText}>{errors.crf}</Text>}
        </View>

        {/* Celular */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Celular *</Text>
          <TextInput
            style={[styles.input, errors.celular && styles.inputError]}
            value={celular}
            onChangeText={setCelular}
            placeholder="(11) 98765-4321"
            placeholderTextColor={temaMedico.cores.textoClaro}
            keyboardType="phone-pad"
            editable={!loading}
          />
          {errors.celular && <Text style={styles.errorText}>{errors.celular}</Text>}
        </View>

        {/* Senha */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Senha *</Text>
          <View style={styles.senhaContainer}>
            <TextInput
              style={[styles.inputSenha, errors.senha && styles.inputError]}
              value={senha}
              onChangeText={setSenha}
              placeholder="Mínimo 6 caracteres"
              placeholderTextColor={temaMedico.cores.textoClaro}
              secureTextEntry={!mostrarSenha}
              editable={!loading}
            />
            <TouchableOpacity
              style={styles.toggleSenha}
              onPress={() => setMostrarSenha(!mostrarSenha)}
            >
              <Ionicons
                name={mostrarSenha ? 'eye-off' : 'eye'}
                size={20}
                color={temaMedico.cores.textoSecundario}
              />
            </TouchableOpacity>
          </View>
          {errors.senha && <Text style={styles.errorText}>{errors.senha}</Text>}
        </View>

        {/* Confirmar Senha */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Confirmar Senha *</Text>
          <TextInput
            style={[styles.input, errors.confirmarSenha && styles.inputError]}
            value={confirmarSenha}
            onChangeText={setConfirmarSenha}
            placeholder="Digite a senha novamente"
            placeholderTextColor={temaMedico.cores.textoClaro}
            secureTextEntry={!mostrarSenha}
            editable={!loading}
          />
          {errors.confirmarSenha && (
            <Text style={styles.errorText}>{errors.confirmarSenha}</Text>
          )}
        </View>

        {/* Erro Geral */}
        {errors.geral && (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle" size={20} color={temaMedico.cores.erro} />
            <Text style={styles.errorTextGeral}>{errors.geral}</Text>
          </View>
        )}

        {/* Informação */}
        <View style={styles.infoContainer}>
          <Ionicons name="information-circle" size={20} color={temaMedico.cores.info} />
          <Text style={styles.infoText}>
            O farmacêutico receberá um email com as credenciais de acesso
          </Text>
        </View>

        {/* Botões */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={onClose}
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
              <Text style={styles.confirmButtonText}>Cadastrar</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    maxHeight: 500,
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

  inputError: {
    borderColor: temaMedico.cores.erro,
  },

  senhaContainer: {
    position: 'relative',
  },

  inputSenha: {
    backgroundColor: temaMedico.cores.backgroundInput,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: temaMedico.cores.borda,
    paddingVertical: 12,
    paddingHorizontal: 16,
    paddingRight: 48,
    fontSize: 16,
    color: temaMedico.cores.textoPrimario,
  },

  toggleSenha: {
    position: 'absolute',
    right: 12,
    top: 12,
    padding: 4,
  },

  helperText: {
    fontSize: 12,
    color: temaMedico.cores.textoSecundario,
    marginTop: 4,
  },

  errorText: {
    fontSize: 12,
    color: temaMedico.cores.erro,
    marginTop: 4,
  },

  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    backgroundColor: temaMedico.cores.erro + '10',
    borderRadius: 8,
    marginBottom: 16,
  },

  errorTextGeral: {
    flex: 1,
    fontSize: 14,
    color: temaMedico.cores.erro,
  },

  infoContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    padding: 12,
    backgroundColor: temaMedico.cores.info + '10',
    borderRadius: 8,
    marginBottom: 20,
  },

  infoText: {
    flex: 1,
    fontSize: 13,
    color: temaMedico.cores.info,
    lineHeight: 18,
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
