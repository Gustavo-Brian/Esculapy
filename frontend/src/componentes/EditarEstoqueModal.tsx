/**
 * Modal de Edição Rápida de Estoque - Esculapi
 * Permite editar preço e quantidade de um produto
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Modal } from './Modal';
import { temaMedico } from '@/src/estilos/temaMedico';
import { EstoqueResponse } from '@/src/servicos/types/api.types';

interface EditarEstoqueModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (estoqueId: number, preco: number, quantidade: number) => Promise<void>;
  produto: EstoqueResponse | null;
}

export function EditarEstoqueModal({
  visible,
  onClose,
  onSubmit,
  produto,
}: EditarEstoqueModalProps) {
  const [preco, setPreco] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Atualiza os valores quando o produto muda
  useEffect(() => {
    if (visible && produto) {
      setPreco(produto.preco.toFixed(2));
      setQuantidade(String(produto.quantidade));
      setError('');
    }
  }, [visible, produto]);

  const handleSubmit = async () => {
    if (!produto) return;

    // Validações
    const precoNum = parseFloat(preco.replace(',', '.'));
    const quantidadeNum = parseInt(quantidade);

    if (isNaN(precoNum) || precoNum <= 0) {
      setError('Preço inválido');
      return;
    }

    if (isNaN(quantidadeNum) || quantidadeNum < 0) {
      setError('Quantidade inválida');
      return;
    }

    try {
      setError('');
      setLoading(true);
      await onSubmit(produto.estoqueId, precoNum, quantidadeNum);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Erro ao atualizar estoque');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (produto) {
      setPreco(produto.preco.toFixed(2));
      setQuantidade(String(produto.quantidade));
    }
    setError('');
    onClose();
  };

  const ajustarQuantidade = (incremento: number) => {
    const atual = parseInt(quantidade) || 0;
    const nova = Math.max(0, atual + incremento);
    setQuantidade(String(nova));
  };

  if (!produto) return null;

  return (
    <Modal visible={visible} onClose={handleClose} title="Editar Estoque">
      <View style={styles.container}>
        {/* Nome do Produto */}
        <View style={styles.produtoInfo}>
          <View style={styles.produtoIcone}>
            <Ionicons name="medical" size={24} color={temaMedico.cores.primaria} />
          </View>
          <View style={styles.produtoTextos}>
            <Text style={styles.produtoNome}>{produto.produtoNome}</Text>
            {produto.produtoDescricao && (
              <Text style={styles.produtoDescricao} numberOfLines={2}>
                {produto.produtoDescricao}
              </Text>
            )}
          </View>
        </View>

        {/* Preço */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Preço (R$)</Text>
          <TextInput
            style={styles.input}
            value={preco}
            onChangeText={setPreco}
            placeholder="0,00"
            placeholderTextColor={temaMedico.cores.textoClaro}
            keyboardType="decimal-pad"
            editable={!loading}
          />
        </View>

        {/* Quantidade */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Quantidade</Text>
          <View style={styles.quantidadeContainer}>
            <TouchableOpacity
              style={styles.quantidadeBotao}
              onPress={() => ajustarQuantidade(-1)}
              disabled={loading}
            >
              <Ionicons name="remove" size={20} color={temaMedico.cores.primaria} />
            </TouchableOpacity>

            <TextInput
              style={[styles.input, styles.quantidadeInput]}
              value={quantidade}
              onChangeText={setQuantidade}
              placeholder="0"
              placeholderTextColor={temaMedico.cores.textoClaro}
              keyboardType="number-pad"
              editable={!loading}
            />

            <TouchableOpacity
              style={styles.quantidadeBotao}
              onPress={() => ajustarQuantidade(+1)}
              disabled={loading}
            >
              <Ionicons name="add" size={20} color={temaMedico.cores.primaria} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Valor Total */}
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Valor Total em Estoque:</Text>
          <Text style={styles.totalValor}>
            R${' '}
            {(
              (parseFloat(preco.replace(',', '.')) || 0) * (parseInt(quantidade) || 0)
            )
              .toFixed(2)
              .replace('.', ',')}
          </Text>
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
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },

  produtoInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: temaMedico.cores.backgroundDestaque,
    borderRadius: 12,
    gap: 12,
    marginBottom: 8,
  },

  produtoIcone: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: temaMedico.cores.backgroundCard,
    alignItems: 'center',
    justifyContent: 'center',
  },

  produtoTextos: {
    flex: 1,
  },

  produtoNome: {
    fontSize: 16,
    fontWeight: '600',
    color: temaMedico.cores.textoPrimario,
    marginBottom: 4,
  },

  produtoDescricao: {
    fontSize: 13,
    color: temaMedico.cores.textoSecundario,
  },

  inputContainer: {
    gap: 8,
  },

  label: {
    fontSize: 14,
    fontWeight: '600',
    color: temaMedico.cores.textoPrimario,
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

  quantidadeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  quantidadeBotao: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: temaMedico.cores.backgroundDestaque,
    alignItems: 'center',
    justifyContent: 'center',
  },

  quantidadeInput: {
    flex: 1,
    textAlign: 'center',
  },

  totalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: temaMedico.cores.primaria + '10',
    borderRadius: 8,
    marginTop: 8,
  },

  totalLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: temaMedico.cores.textoSecundario,
  },

  totalValor: {
    fontSize: 20,
    fontWeight: 'bold',
    color: temaMedico.cores.primaria,
  },

  errorText: {
    fontSize: 14,
    color: temaMedico.cores.erro,
    marginTop: -8,
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
