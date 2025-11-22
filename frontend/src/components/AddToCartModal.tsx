/**
 * Modal de Adicionar ao Carrinho
 * Exibe informações detalhadas do produto antes de adicionar
 */

import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { temaMedico } from '@/src/estilos/temaMedico';
import type { EstoqueResponse } from '@/src/servicos/types/api.types';

interface AddToCartModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (quantidade: number) => void;
  produto: {
    nome: string;
    preco: number;
    farmacia: string;
    estoque: number;
    tipoProduto?: string;
    tipoReceita?: string;
    principioAtivo?: string;
    laboratorio?: string;
  } | null;
}

export const AddToCartModal: React.FC<AddToCartModalProps> = ({
  visible,
  onClose,
  onConfirm,
  produto,
}) => {
  const [quantidade, setQuantidade] = useState(1);

  console.log('[AddToCartModal] Renderizando modal:', { visible, temProduto: !!produto });

  if (!produto) return null;

  const incrementar = () => {
    if (quantidade < produto.estoque) {
      setQuantidade(quantidade + 1);
    }
  };

  const decrementar = () => {
    if (quantidade > 1) {
      setQuantidade(quantidade - 1);
    }
  };

  const handleConfirm = () => {
    onConfirm(quantidade);
    setQuantidade(1); // Reset quantidade
  };

  const handleClose = () => {
    setQuantidade(1); // Reset quantidade
    onClose();
  };

  const valorTotal = produto.preco * quantidade;
  const precisaReceita = produto.tipoReceita && produto.tipoReceita !== 'NAO_EXIGIDO';

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Adicionar ao Carrinho</Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={temaMedico.cores.textoTitulo} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* Produto */}
            <View style={styles.produtoCard}>
              <View style={styles.produtoIcon}>
                <Ionicons
                  name={produto.tipoProduto === 'CORRELATO' ? 'fitness' : 'medical'}
                  size={40}
                  color={temaMedico.cores.primaria}
                />
              </View>
              <View style={styles.produtoInfo}>
                <Text style={styles.produtoNome}>{produto.nome}</Text>
                <Text style={styles.produtoFarmacia}>
                  <Ionicons name="storefront" size={14} color={temaMedico.cores.textoSecundario} />
                  {' '}{produto.farmacia}
                </Text>
              </View>
            </View>

            {/* Informações Adicionais */}
            {(produto.principioAtivo || produto.laboratorio) && (
              <View style={styles.infoSection}>
                <Text style={styles.sectionTitle}>Informações do Produto</Text>
                {produto.principioAtivo && (
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Princípio Ativo:</Text>
                    <Text style={styles.infoValue}>{produto.principioAtivo}</Text>
                  </View>
                )}
                {produto.laboratorio && (
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Laboratório:</Text>
                    <Text style={styles.infoValue}>{produto.laboratorio}</Text>
                  </View>
                )}
                {produto.tipoProduto && (
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Tipo:</Text>
                    <Text style={styles.infoValue}>{produto.tipoProduto}</Text>
                  </View>
                )}
              </View>
            )}

            {/* Alerta de Receita */}
            {precisaReceita && (
              <View style={styles.alertaReceita}>
                <Ionicons name="alert-circle" size={20} color={temaMedico.cores.alerta} />
                <View style={styles.alertaTexto}>
                  <Text style={styles.alertaTitulo}>Receita Necessária</Text>
                  <Text style={styles.alertaDescricao}>
                    Este medicamento requer {produto.tipoReceita?.replace('_', ' ')}.
                    Você precisará enviar a receita após finalizar o pedido.
                  </Text>
                </View>
              </View>
            )}

            {/* Preço Unitário */}
            <View style={styles.precoSection}>
              <Text style={styles.sectionTitle}>Preço</Text>
              <View style={styles.precoRow}>
                <Text style={styles.precoLabel}>Valor Unitário:</Text>
                <Text style={styles.precoValor}>
                  R$ {produto.preco.toFixed(2).replace('.', ',')}
                </Text>
              </View>
            </View>

            {/* Quantidade */}
            <View style={styles.quantidadeSection}>
              <View style={styles.quantidadeHeader}>
                <Text style={styles.sectionTitle}>Quantidade</Text>
                <Text style={styles.estoqueInfo}>
                  Disponível: {produto.estoque} un.
                </Text>
              </View>
              <View style={styles.quantidadeControle}>
                <TouchableOpacity
                  style={[styles.botaoQuantidade, quantidade === 1 && styles.botaoDesabilitado]}
                  onPress={decrementar}
                  disabled={quantidade === 1}
                >
                  <Ionicons name="remove" size={24} color={temaMedico.cores.primaria} />
                </TouchableOpacity>
                <View style={styles.quantidadeDisplay}>
                  <Text style={styles.quantidadeTexto}>{quantidade}</Text>
                </View>
                <TouchableOpacity
                  style={[
                    styles.botaoQuantidade,
                    quantidade >= produto.estoque && styles.botaoDesabilitado,
                  ]}
                  onPress={incrementar}
                  disabled={quantidade >= produto.estoque}
                >
                  <Ionicons name="add" size={24} color={temaMedico.cores.primaria} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Resumo */}
            <View style={styles.resumoSection}>
              <Text style={styles.sectionTitle}>Resumo</Text>
              <View style={styles.resumoRow}>
                <Text style={styles.resumoLabel}>Quantidade:</Text>
                <Text style={styles.resumoValor}>{quantidade} un.</Text>
              </View>
              <View style={styles.resumoRow}>
                <Text style={styles.resumoLabel}>Valor Unitário:</Text>
                <Text style={styles.resumoValor}>
                  R$ {produto.preco.toFixed(2).replace('.', ',')}
                </Text>
              </View>
              <View style={[styles.resumoRow, styles.resumoTotal]}>
                <Text style={styles.resumoTotalLabel}>Subtotal:</Text>
                <Text style={styles.resumoTotalValor}>
                  R$ {valorTotal.toFixed(2).replace('.', ',')}
                </Text>
              </View>
            </View>

            <View style={styles.espacamentoFinal} />
          </ScrollView>

          {/* Footer com Botões */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.botaoCancelar}
              onPress={handleClose}
            >
              <Text style={styles.textoBotaoCancelar}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.botaoConfirmar}
              onPress={handleConfirm}
            >
              <Ionicons name="cart" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
              <Text style={styles.textoBotaoConfirmar}>Adicionar</Text>
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
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: temaMedico.espacamentos.lg,
    paddingVertical: temaMedico.espacamentos.md,
    borderBottomWidth: 1,
    borderBottomColor: temaMedico.cores.borda,
  },
  headerTitle: {
    fontSize: temaMedico.fontes.tamanhos.xl,
    fontWeight: temaMedico.fontes.pesos.bold,
    color: temaMedico.cores.textoTitulo,
  },
  closeButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: temaMedico.espacamentos.lg,
  },
  produtoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: temaMedico.espacamentos.md,
    backgroundColor: '#F5F7FA',
    borderRadius: temaMedico.bordas.media,
    marginTop: temaMedico.espacamentos.lg,
  },
  produtoIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: temaMedico.cores.primaria + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: temaMedico.espacamentos.md,
  },
  produtoInfo: {
    flex: 1,
  },
  produtoNome: {
    fontSize: temaMedico.fontes.tamanhos.lg,
    fontWeight: temaMedico.fontes.pesos.semibold,
    color: temaMedico.cores.textoTitulo,
    marginBottom: 4,
  },
  produtoFarmacia: {
    fontSize: temaMedico.fontes.tamanhos.sm,
    color: temaMedico.cores.textoSecundario,
  },
  infoSection: {
    marginTop: temaMedico.espacamentos.lg,
    padding: temaMedico.espacamentos.md,
    backgroundColor: '#F5F7FA',
    borderRadius: temaMedico.bordas.media,
  },
  sectionTitle: {
    fontSize: temaMedico.fontes.tamanhos.md,
    fontWeight: temaMedico.fontes.pesos.semibold,
    color: temaMedico.cores.textoTitulo,
    marginBottom: temaMedico.espacamentos.sm,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: temaMedico.espacamentos.xs,
  },
  infoLabel: {
    fontSize: temaMedico.fontes.tamanhos.sm,
    color: temaMedico.cores.textoSecundario,
  },
  infoValue: {
    fontSize: temaMedico.fontes.tamanhos.sm,
    fontWeight: temaMedico.fontes.pesos.semibold,
    color: temaMedico.cores.textoTitulo,
    flex: 1,
    textAlign: 'right',
  },
  alertaReceita: {
    flexDirection: 'row',
    backgroundColor: temaMedico.cores.alerta + '15',
    borderLeftWidth: 4,
    borderLeftColor: temaMedico.cores.alerta,
    padding: temaMedico.espacamentos.md,
    borderRadius: temaMedico.bordas.pequena,
    marginTop: temaMedico.espacamentos.lg,
  },
  alertaTexto: {
    flex: 1,
    marginLeft: temaMedico.espacamentos.sm,
  },
  alertaTitulo: {
    fontSize: temaMedico.fontes.tamanhos.md,
    fontWeight: temaMedico.fontes.pesos.semibold,
    color: temaMedico.cores.alerta,
    marginBottom: 4,
  },
  alertaDescricao: {
    fontSize: temaMedico.fontes.tamanhos.sm,
    color: temaMedico.cores.textoSubtitulo,
    lineHeight: 18,
  },
  precoSection: {
    marginTop: temaMedico.espacamentos.lg,
  },
  precoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  precoLabel: {
    fontSize: temaMedico.fontes.tamanhos.md,
    color: temaMedico.cores.textoSecundario,
  },
  precoValor: {
    fontSize: temaMedico.fontes.tamanhos.xl,
    fontWeight: temaMedico.fontes.pesos.bold,
    color: temaMedico.cores.primaria,
  },
  quantidadeSection: {
    marginTop: temaMedico.espacamentos.lg,
  },
  quantidadeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: temaMedico.espacamentos.md,
  },
  estoqueInfo: {
    fontSize: temaMedico.fontes.tamanhos.sm,
    color: temaMedico.cores.textoSecundario,
  },
  quantidadeControle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: temaMedico.espacamentos.lg,
  },
  botaoQuantidade: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: temaMedico.cores.primaria + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  botaoDesabilitado: {
    opacity: 0.3,
  },
  quantidadeDisplay: {
    width: 80,
    height: 48,
    backgroundColor: '#F5F7FA',
    borderRadius: temaMedico.bordas.media,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantidadeTexto: {
    fontSize: temaMedico.fontes.tamanhos.xxl,
    fontWeight: temaMedico.fontes.pesos.bold,
    color: temaMedico.cores.textoTitulo,
  },
  resumoSection: {
    marginTop: temaMedico.espacamentos.lg,
    padding: temaMedico.espacamentos.md,
    backgroundColor: '#F5F7FA',
    borderRadius: temaMedico.bordas.media,
  },
  resumoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: temaMedico.espacamentos.xs,
  },
  resumoLabel: {
    fontSize: temaMedico.fontes.tamanhos.sm,
    color: temaMedico.cores.textoSecundario,
  },
  resumoValor: {
    fontSize: temaMedico.fontes.tamanhos.sm,
    fontWeight: temaMedico.fontes.pesos.semibold,
    color: temaMedico.cores.textoTitulo,
  },
  resumoTotal: {
    marginTop: temaMedico.espacamentos.sm,
    paddingTop: temaMedico.espacamentos.sm,
    borderTopWidth: 1,
    borderTopColor: temaMedico.cores.borda,
  },
  resumoTotalLabel: {
    fontSize: temaMedico.fontes.tamanhos.lg,
    fontWeight: temaMedico.fontes.pesos.semibold,
    color: temaMedico.cores.textoTitulo,
  },
  resumoTotalValor: {
    fontSize: temaMedico.fontes.tamanhos.xl,
    fontWeight: temaMedico.fontes.pesos.bold,
    color: temaMedico.cores.primaria,
  },
  espacamentoFinal: {
    height: 20,
  },
  footer: {
    flexDirection: 'row',
    padding: temaMedico.espacamentos.lg,
    borderTopWidth: 1,
    borderTopColor: temaMedico.cores.borda,
    gap: temaMedico.espacamentos.md,
  },
  botaoCancelar: {
    flex: 1,
    paddingVertical: temaMedico.espacamentos.md,
    borderRadius: temaMedico.bordas.media,
    borderWidth: 2,
    borderColor: temaMedico.cores.primaria,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textoBotaoCancelar: {
    fontSize: temaMedico.fontes.tamanhos.md,
    fontWeight: temaMedico.fontes.pesos.semibold,
    color: temaMedico.cores.primaria,
  },
  botaoConfirmar: {
    flex: 2,
    flexDirection: 'row',
    paddingVertical: temaMedico.espacamentos.md,
    borderRadius: temaMedico.bordas.media,
    backgroundColor: temaMedico.cores.primaria,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textoBotaoConfirmar: {
    fontSize: temaMedico.fontes.tamanhos.md,
    fontWeight: temaMedico.fontes.pesos.semibold,
    color: '#FFFFFF',
  },
});
