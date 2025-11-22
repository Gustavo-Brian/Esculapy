/**
 * Modal de Confirmação para Remover Produto do Estoque
 */

import React from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { temaMedico } from '@/src/estilos/temaMedico';
import type { EstoqueResponse } from '@/src/servicos/types/api.types';

interface ConfirmarRemocaoModalProps {
  visible: boolean;
  produto: EstoqueResponse | null;
  onConfirm: () => Promise<void>;
  onCancel: () => void;
  onZerarEstoque?: () => Promise<void>;
  carregando?: boolean;
  mostrarOpcaoZerar?: boolean;
}

export const ConfirmarRemocaoModal: React.FC<ConfirmarRemocaoModalProps> = ({
  visible,
  produto,
  onConfirm,
  onCancel,
  onZerarEstoque,
  carregando = false,
  mostrarOpcaoZerar = false,
}) => {
  if (!produto) return null;

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onCancel}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.iconContainer}>
            <Ionicons name="warning" size={48} color={temaMedico.cores.erro} />
          </View>

          <Text style={styles.title}>Remover Produto?</Text>

          <Text style={styles.message}>
            Tem certeza que deseja remover <Text style={styles.produtoNome}>{produto.produtoNome || 'este produto'}</Text> do
            seu estoque?
          </Text>

          <View style={styles.details}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Quantidade:</Text>
              <Text style={styles.detailValue}>{produto.quantidade} unidades</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Preço:</Text>
              <Text style={styles.detailValue}>R$ {produto.preco.toFixed(2)}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Valor Total:</Text>
              <Text style={styles.detailValue}>
                R$ {(produto.quantidade * produto.preco).toFixed(2)}
              </Text>
            </View>
          </View>

          {mostrarOpcaoZerar ? (
            <>
              <Text style={styles.infoMessage}>
                Este produto foi usado em pedidos e não pode ser removido. Você pode zerar o estoque para
                torná-lo indisponível.
              </Text>

              <View style={styles.buttonsContainer}>
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={onCancel}
                  disabled={carregando}
                >
                  <Text style={styles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.button, styles.zerarButton, carregando && styles.buttonDisabled]}
                  onPress={onZerarEstoque}
                  disabled={carregando}
                >
                  {carregando ? (
                    <ActivityIndicator size="small" color="#FFF" />
                  ) : (
                    <>
                      <Ionicons name="close-circle" size={20} color="#FFF" />
                      <Text style={styles.zerarButtonText}>Zerar Estoque</Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <>
              <Text style={styles.warning}>Esta ação não pode ser desfeita!</Text>

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
                      <Ionicons name="trash" size={20} color="#FFF" />
                      <Text style={styles.confirmButtonText}>Remover</Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    backgroundColor: temaMedico.cores.background,
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: `${temaMedico.cores.erro}15`,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: temaMedico.cores.textoTitulo,
    marginBottom: 12,
  },
  message: {
    fontSize: 15,
    color: temaMedico.cores.textoSubtitulo,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
  },
  produtoNome: {
    fontWeight: '700',
    color: temaMedico.cores.textoTitulo,
  },
  details: {
    width: '100%',
    backgroundColor: temaMedico.cores.backgroundCard,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    gap: 10,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 14,
    color: temaMedico.cores.textoSubtitulo,
    fontWeight: '600',
  },
  detailValue: {
    fontSize: 14,
    color: temaMedico.cores.textoTitulo,
    fontWeight: '700',
  },
  warning: {
    fontSize: 13,
    color: temaMedico.cores.erro,
    fontWeight: '600',
    marginBottom: 24,
    textAlign: 'center',
  },
  infoMessage: {
    fontSize: 14,
    color: temaMedico.cores.primaria,
    fontWeight: '600',
    marginBottom: 24,
    textAlign: 'center',
    backgroundColor: `${temaMedico.cores.primaria}15`,
    padding: 12,
    borderRadius: 8,
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  button: {
    flex: 1,
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  cancelButton: {
    backgroundColor: temaMedico.cores.backgroundInput,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: temaMedico.cores.textoTitulo,
  },
  confirmButton: {
    backgroundColor: temaMedico.cores.erro,
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFF',
  },
  zerarButton: {
    backgroundColor: '#FF8C00',
  },
  zerarButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFF',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});
