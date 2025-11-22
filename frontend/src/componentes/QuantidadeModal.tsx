/**
 * QuantidadeModal - Modal para selecionar quantidade de produto
 * Funciona tanto em mobile quanto web
 */

import React, { useState } from 'react';
import {
  Modal as RNModal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
  Animated,
  TextInput,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { temaMedico } from '@/src/estilos/temaMedico';

interface QuantidadeModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (quantidade: number) => void;
  produtoNome: string;
  estoqueDisponivel: number;
  preco: number;
}

export function QuantidadeModal({
  visible,
  onClose,
  onConfirm,
  produtoNome,
  estoqueDisponivel,
  preco,
}: QuantidadeModalProps) {
  const [quantidade, setQuantidade] = useState(1);
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (visible) {
      setQuantidade(1); // Reset para 1 quando abre
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const incrementar = () => {
    if (quantidade < estoqueDisponivel) {
      setQuantidade(quantidade + 1);
    }
  };

  const decrementar = () => {
    if (quantidade > 1) {
      setQuantidade(quantidade - 1);
    }
  };

  const handleConfirmar = () => {
    if (quantidade > 0 && quantidade <= estoqueDisponivel) {
      onConfirm(quantidade);
      onClose();
    }
  };

  const handleQuantidadeChange = (text: string) => {
    const numero = parseInt(text);
    if (!isNaN(numero) && numero > 0 && numero <= estoqueDisponivel) {
      setQuantidade(numero);
    } else if (text === '') {
      setQuantidade(1);
    }
  };

  const total = preco * quantidade;

  return (
    <RNModal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
          <TouchableWithoutFeedback>
            <Animated.View
              style={[
                styles.modalContainer,
                {
                  transform: [
                    {
                      scale: fadeAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.9, 1],
                      }),
                    },
                  ],
                },
              ]}
            >
              {/* Header */}
              <View style={styles.header}>
                <View style={styles.iconContainer}>
                  <Ionicons name="cart" size={24} color={temaMedico.cores.primaria} />
                </View>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                  <Ionicons name="close" size={24} color={temaMedico.cores.textoSecundario} />
                </TouchableOpacity>
              </View>

              {/* Content */}
              <View style={styles.content}>
                <Text style={styles.titulo}>Adicionar ao Carrinho</Text>

                <Text style={styles.produtoNome} numberOfLines={2}>
                  {produtoNome}
                </Text>

                <View style={styles.estoqueInfo}>
                  <Ionicons name="cube-outline" size={16} color={temaMedico.cores.textoSubtitulo} />
                  <Text style={styles.estoqueTexto}>
                    {estoqueDisponivel} unidade{estoqueDisponivel !== 1 ? 's' : ''} disponível{estoqueDisponivel !== 1 ? 'is' : ''}
                  </Text>
                </View>

                {/* Seletor de quantidade */}
                <View style={styles.quantidadeContainer}>
                  <Text style={styles.quantidadeLabel}>Quantidade</Text>

                  <View style={styles.seletorContainer}>
                    <TouchableOpacity
                      style={[
                        styles.botaoQuantidade,
                        quantidade === 1 && styles.botaoQuantidadeDesabilitado,
                      ]}
                      onPress={decrementar}
                      disabled={quantidade === 1}
                    >
                      <Ionicons
                        name="remove"
                        size={20}
                        color={quantidade === 1 ? temaMedico.cores.textoClaro : temaMedico.cores.primaria}
                      />
                    </TouchableOpacity>

                    <TextInput
                      style={styles.quantidadeInput}
                      value={String(quantidade)}
                      onChangeText={handleQuantidadeChange}
                      keyboardType="number-pad"
                      maxLength={3}
                      selectTextOnFocus
                    />

                    <TouchableOpacity
                      style={[
                        styles.botaoQuantidade,
                        quantidade === estoqueDisponivel && styles.botaoQuantidadeDesabilitado,
                      ]}
                      onPress={incrementar}
                      disabled={quantidade === estoqueDisponivel}
                    >
                      <Ionicons
                        name="add"
                        size={20}
                        color={
                          quantidade === estoqueDisponivel
                            ? temaMedico.cores.textoClaro
                            : temaMedico.cores.primaria
                        }
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Resumo do valor */}
                <View style={styles.resumoContainer}>
                  <View style={styles.resumoLinha}>
                    <Text style={styles.resumoLabel}>Preço unitário</Text>
                    <Text style={styles.resumoValor}>
                      R$ {preco.toFixed(2).replace('.', ',')}
                    </Text>
                  </View>

                  <View style={styles.divider} />

                  <View style={styles.resumoLinha}>
                    <Text style={styles.totalLabel}>Total</Text>
                    <Text style={styles.totalValor}>
                      R$ {total.toFixed(2).replace('.', ',')}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Footer com botões */}
              <View style={styles.footer}>
                <TouchableOpacity
                  style={[styles.botao, styles.botaoCancelar]}
                  onPress={onClose}
                >
                  <Text style={styles.botaoCancelarTexto}>Cancelar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.botao, styles.botaoConfirmar]}
                  onPress={handleConfirmar}
                >
                  <Ionicons name="checkmark" size={20} color={temaMedico.cores.textoBranco} />
                  <Text style={styles.botaoConfirmarTexto}>Adicionar</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </TouchableWithoutFeedback>
        </Animated.View>
      </TouchableWithoutFeedback>
    </RNModal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: temaMedico.cores.backgroundCard,
    borderRadius: 20,
    width: '100%',
    maxWidth: 420,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
    ...(Platform.OS === 'web' && {
      maxHeight: '90vh',
    }),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: temaMedico.cores.primaria + '15',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    padding: 4,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  titulo: {
    fontSize: 24,
    fontWeight: temaMedico.fontes.pesos.bold,
    color: temaMedico.cores.textoTitulo,
    marginBottom: 8,
  },
  produtoNome: {
    fontSize: 16,
    color: temaMedico.cores.textoSubtitulo,
    marginBottom: 16,
    lineHeight: 22,
  },
  estoqueInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 24,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: temaMedico.cores.primaria + '08',
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  estoqueTexto: {
    fontSize: 13,
    color: temaMedico.cores.textoSubtitulo,
    fontWeight: temaMedico.fontes.pesos.medium,
  },
  quantidadeContainer: {
    marginBottom: 24,
  },
  quantidadeLabel: {
    fontSize: 14,
    fontWeight: temaMedico.fontes.pesos.semibold,
    color: temaMedico.cores.textoTitulo,
    marginBottom: 12,
  },
  seletorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  botaoQuantidade: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: temaMedico.cores.primaria + '15',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: temaMedico.cores.primaria,
  },
  botaoQuantidadeDesabilitado: {
    backgroundColor: temaMedico.cores.textoClaro + '20',
    borderColor: temaMedico.cores.textoClaro,
    opacity: 0.5,
  },
  quantidadeInput: {
    width: 80,
    height: 56,
    borderWidth: 2,
    borderColor: temaMedico.cores.primaria,
    borderRadius: 12,
    fontSize: 24,
    fontWeight: temaMedico.fontes.pesos.bold,
    color: temaMedico.cores.textoTitulo,
    textAlign: 'center',
    backgroundColor: temaMedico.cores.backgroundCard,
  },
  resumoContainer: {
    backgroundColor: temaMedico.cores.primaria + '08',
    borderRadius: 12,
    padding: 16,
  },
  resumoLinha: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  resumoLabel: {
    fontSize: 14,
    color: temaMedico.cores.textoSubtitulo,
  },
  resumoValor: {
    fontSize: 14,
    fontWeight: temaMedico.fontes.pesos.medium,
    color: temaMedico.cores.textoTitulo,
  },
  divider: {
    height: 1,
    backgroundColor: temaMedico.cores.borda,
    marginVertical: 12,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: temaMedico.fontes.pesos.bold,
    color: temaMedico.cores.textoTitulo,
  },
  totalValor: {
    fontSize: 20,
    fontWeight: temaMedico.fontes.pesos.bold,
    color: temaMedico.cores.primaria,
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    padding: 20,
    paddingTop: 0,
  },
  botao: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
    ...temaMedico.sombras.pequena,
  },
  botaoCancelar: {
    backgroundColor: temaMedico.cores.backgroundCard,
    borderWidth: 1.5,
    borderColor: temaMedico.cores.borda,
  },
  botaoCancelarTexto: {
    fontSize: 16,
    fontWeight: temaMedico.fontes.pesos.semibold,
    color: temaMedico.cores.textoSubtitulo,
  },
  botaoConfirmar: {
    backgroundColor: temaMedico.cores.primaria,
  },
  botaoConfirmarTexto: {
    fontSize: 16,
    fontWeight: temaMedico.fontes.pesos.bold,
    color: temaMedico.cores.textoBranco,
  },
});
