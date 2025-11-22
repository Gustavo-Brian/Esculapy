/**
 * Modal de Formulário de Produto - Admin
 * Criar ou editar produtos do catálogo master
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  TextInput,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { temaMedico } from '@/src/estilos/temaMedico';
import type {
  Produto,
  ProdutoRequest,
  TipoProduto,
  TipoReceita,
} from '@/src/servicos/types/admin.types';

interface ProdutoFormModalProps {
  visible: boolean;
  produto: Produto | null; // null = criar, preenchido = editar
  processando: boolean;
  onClose: () => void;
  onSalvar: (produtoData: ProdutoRequest) => Promise<void>;
}

export const ProdutoFormModal: React.FC<ProdutoFormModalProps> = ({
  visible,
  produto,
  processando,
  onClose,
  onSalvar,
}) => {
  const [formData, setFormData] = useState<ProdutoRequest>({
    ean: '',
    nome: '',
    principioAtivo: '',
    laboratorio: '',
    descricao: '',
    codigoRegistroMS: '',
    bulaUrl: '',
    tipoProduto: 'MEDICAMENTO',
    tipoReceita: 'NAO_EXIGIDO',
  });

  const [erros, setErros] = useState<Partial<Record<keyof ProdutoRequest, string>>>({});

  // Preenche formulário quando produto muda
  useEffect(() => {
    if (produto) {
      setFormData({
        ean: produto.ean,
        nome: produto.nome,
        principioAtivo: produto.principioAtivo,
        laboratorio: produto.laboratorio,
        descricao: produto.descricao,
        codigoRegistroMS: produto.codigoRegistroMS,
        bulaUrl: produto.bulaUrl || '',
        tipoProduto: produto.tipoProduto,
        tipoReceita: produto.tipoReceita,
      });
    } else {
      // Reseta formulário para criar novo
      setFormData({
        ean: '',
        nome: '',
        principioAtivo: '',
        laboratorio: '',
        descricao: '',
        codigoRegistroMS: '',
        bulaUrl: '',
        tipoProduto: 'MEDICAMENTO',
        tipoReceita: 'NAO_EXIGIDO',
      });
    }
    setErros({});
  }, [produto, visible]);

  const handleChange = (field: keyof ProdutoRequest, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Limpa erro do campo
    if (erros[field]) {
      setErros(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validarFormulario = (): boolean => {
    const novosErros: Partial<Record<keyof ProdutoRequest, string>> = {};

    if (!formData.ean.trim()) novosErros.ean = 'EAN é obrigatório';
    if (!formData.nome.trim()) novosErros.nome = 'Nome é obrigatório';
    if (!formData.principioAtivo.trim()) novosErros.principioAtivo = 'Princípio ativo é obrigatório';
    if (!formData.laboratorio.trim()) novosErros.laboratorio = 'Laboratório é obrigatório';
    if (!formData.descricao.trim()) novosErros.descricao = 'Descrição é obrigatória';
    if (!formData.codigoRegistroMS.trim()) novosErros.codigoRegistroMS = 'Código MS é obrigatório';

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleSubmit = async () => {
    if (!validarFormulario()) {
      return;
    }

    try {
      await onSalvar(formData);
      // Modal será fechado pelo hook após sucesso
    } catch (error) {
      // Erro já foi tratado pelo hook
      console.error('[ProdutoFormModal] Erro ao salvar:', error);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {produto ? 'Editar Produto' : 'Novo Produto'}
            </Text>
            <TouchableOpacity onPress={onClose} disabled={processando}>
              <Ionicons name="close" size={28} color={temaMedico.cores.textoPrincipal} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
            {/* EAN */}
            <View style={styles.field}>
              <Text style={styles.label}>EAN (Código de Barras) *</Text>
              <TextInput
                style={[styles.input, erros.ean && styles.inputError]}
                placeholder="13 dígitos"
                value={formData.ean}
                onChangeText={value => handleChange('ean', value)}
                editable={!processando}
                keyboardType="numeric"
              />
              {erros.ean && <Text style={styles.errorText}>{erros.ean}</Text>}
            </View>

            {/* Nome */}
            <View style={styles.field}>
              <Text style={styles.label}>Nome do Produto *</Text>
              <TextInput
                style={[styles.input, erros.nome && styles.inputError]}
                placeholder="Ex: Dipirona 500mg"
                value={formData.nome}
                onChangeText={value => handleChange('nome', value)}
                editable={!processando}
              />
              {erros.nome && <Text style={styles.errorText}>{erros.nome}</Text>}
            </View>

            {/* Princípio Ativo */}
            <View style={styles.field}>
              <Text style={styles.label}>Princípio Ativo *</Text>
              <TextInput
                style={[styles.input, erros.principioAtivo && styles.inputError]}
                placeholder="Ex: Dipirona Sódica"
                value={formData.principioAtivo}
                onChangeText={value => handleChange('principioAtivo', value)}
                editable={!processando}
              />
              {erros.principioAtivo && <Text style={styles.errorText}>{erros.principioAtivo}</Text>}
            </View>

            {/* Laboratório */}
            <View style={styles.field}>
              <Text style={styles.label}>Laboratório *</Text>
              <TextInput
                style={[styles.input, erros.laboratorio && styles.inputError]}
                placeholder="Ex: EMS"
                value={formData.laboratorio}
                onChangeText={value => handleChange('laboratorio', value)}
                editable={!processando}
              />
              {erros.laboratorio && <Text style={styles.errorText}>{erros.laboratorio}</Text>}
            </View>

            {/* Descrição */}
            <View style={styles.field}>
              <Text style={styles.label}>Descrição *</Text>
              <TextInput
                style={[styles.textArea, erros.descricao && styles.inputError]}
                placeholder="Descrição detalhada do produto"
                value={formData.descricao}
                onChangeText={value => handleChange('descricao', value)}
                editable={!processando}
                multiline
                numberOfLines={4}
              />
              {erros.descricao && <Text style={styles.errorText}>{erros.descricao}</Text>}
            </View>

            {/* Código de Registro MS */}
            <View style={styles.field}>
              <Text style={styles.label}>Código de Registro MS (ANVISA) *</Text>
              <TextInput
                style={[styles.input, erros.codigoRegistroMS && styles.inputError]}
                placeholder="Ex: 1234567890123"
                value={formData.codigoRegistroMS}
                onChangeText={value => handleChange('codigoRegistroMS', value)}
                editable={!processando}
              />
              {erros.codigoRegistroMS && <Text style={styles.errorText}>{erros.codigoRegistroMS}</Text>}
            </View>

            {/* URL da Bula (opcional) */}
            <View style={styles.field}>
              <Text style={styles.label}>URL da Bula (opcional)</Text>
              <TextInput
                style={styles.input}
                placeholder="https://..."
                value={formData.bulaUrl}
                onChangeText={value => handleChange('bulaUrl', value)}
                editable={!processando}
                keyboardType="url"
                autoCapitalize="none"
              />
            </View>

            {/* Tipo de Produto */}
            <View style={styles.field}>
              <Text style={styles.label}>Tipo de Produto *</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={formData.tipoProduto}
                  onValueChange={value => handleChange('tipoProduto', value as TipoProduto)}
                  enabled={!processando}
                >
                  <Picker.Item label="Medicamento" value="MEDICAMENTO" />
                  <Picker.Item label="Perfumaria" value="PERFUMARIA" />
                  <Picker.Item label="Suplemento" value="SUPLEMENTO" />
                  <Picker.Item label="Equipamento" value="EQUIPAMENTO" />
                  <Picker.Item label="Conveniência" value="CONVENIENCIA" />
                </Picker>
              </View>
            </View>

            {/* Tipo de Receita */}
            <View style={styles.field}>
              <Text style={styles.label}>Tipo de Receita *</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={formData.tipoReceita}
                  onValueChange={value => handleChange('tipoReceita', value as TipoReceita)}
                  enabled={!processando}
                >
                  <Picker.Item label="Sem Receita (OTC)" value="NAO_EXIGIDO" />
                  <Picker.Item label="Receita Branca Simples" value="BRANCA_SIMPLES" />
                  <Picker.Item label="Receita Controle Especial" value="BRANCA_CONTROLE_ESPECIAL" />
                  <Picker.Item label="Receita Azul (B)" value="AZUL_B" />
                  <Picker.Item label="Receita Amarela (A)" value="AMARELA_A" />
                </Picker>
              </View>
            </View>
          </ScrollView>

          {/* Ações */}
          <View style={styles.modalActions}>
            <TouchableOpacity
              style={[styles.cancelButton]}
              onPress={onClose}
              disabled={processando}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.saveButton, processando && styles.saveButtonDisabled]}
              onPress={handleSubmit}
              disabled={processando}
            >
              {processando ? (
                <ActivityIndicator size="small" color="#FFF" />
              ) : (
                <Text style={styles.saveButtonText}>
                  {produto ? 'Atualizar' : 'Criar'}
                </Text>
              )}
            </TouchableOpacity>
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
  field: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: temaMedico.cores.textoPrincipal,
    marginBottom: 8,
  },
  input: {
    backgroundColor: temaMedico.cores.background,
    borderWidth: 1,
    borderColor: temaMedico.cores.borda,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: temaMedico.cores.textoPrincipal,
  },
  inputError: {
    borderColor: '#F44336',
  },
  textArea: {
    backgroundColor: temaMedico.cores.background,
    borderWidth: 1,
    borderColor: temaMedico.cores.borda,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: temaMedico.cores.textoPrincipal,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  errorText: {
    fontSize: 12,
    color: '#F44336',
    marginTop: 4,
  },
  pickerContainer: {
    backgroundColor: temaMedico.cores.background,
    borderWidth: 1,
    borderColor: temaMedico.cores.borda,
    borderRadius: 8,
    overflow: 'hidden',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: temaMedico.cores.borda,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: temaMedico.cores.borda,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: temaMedico.cores.textoPrincipal,
  },
  saveButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    backgroundColor: temaMedico.cores.primaria,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
  },
});
