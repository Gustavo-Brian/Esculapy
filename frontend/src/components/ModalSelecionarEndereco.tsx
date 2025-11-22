/**
 * Modal de Seleção de Endereço
 * Modal para selecionar endereço no checkout
 */

import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { temaMedico } from '@/src/estilos/temaMedico';
import type { Endereco } from '@/src/servicos/types/api.types';
import { listarEnderecos } from '@/src/servicos/enderecos/enderecoService';

interface ModalSelecionarEnderecoProps {
  visivel: boolean;
  onFechar: () => void;
  onSelecionar: (endereco: Endereco) => void;
  onAdicionarNovo: () => void;
}

export const ModalSelecionarEndereco: React.FC<ModalSelecionarEnderecoProps> = ({
  visivel,
  onFechar,
  onSelecionar,
  onAdicionarNovo,
}) => {
  const [enderecos, setEnderecos] = useState<Endereco[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [enderecoSelecionado, setEnderecoSelecionado] = useState<number | null>(null);

  useEffect(() => {
    if (visivel) {
      carregarEnderecos();
    }
  }, [visivel]);

  const carregarEnderecos = async () => {
    try {
      setCarregando(true);
      const response = await listarEnderecos();
      setEnderecos(response.enderecos);
    } catch (error) {
      console.error('[ModalSelecionarEndereco] Erro ao carregar endereços:', error);
    } finally {
      setCarregando(false);
    }
  };

  const handleSelecionar = () => {
    const endereco = enderecos.find((e) => e.id === enderecoSelecionado);
    if (endereco) {
      onSelecionar(endereco);
    }
  };

  const getIconeTipo = (tipo: string) => {
    switch (tipo) {
      case 'RESIDENCIAL':
        return 'home';
      case 'COMERCIAL':
        return 'business';
      default:
        return 'location';
    }
  };

  return (
    <Modal visible={visivel} transparent animationType="slide" onRequestClose={onFechar}>
      <View style={estilos.overlay}>
        <View style={estilos.modalContainer}>
          {/* Header */}
          <View style={estilos.header}>
            <Text style={estilos.titulo}>Selecionar Endereço</Text>
            <TouchableOpacity onPress={onFechar} style={estilos.botaoFechar}>
              <Ionicons name="close" size={24} color={temaMedico.cores.textoSecundario} />
            </TouchableOpacity>
          </View>

          {/* Conteúdo */}
          <ScrollView style={estilos.conteudo} showsVerticalScrollIndicator={false}>
            {carregando ? (
              <View style={estilos.containerCarregando}>
                <ActivityIndicator size="large" color={temaMedico.cores.primaria} />
                <Text style={estilos.textoCarregando}>Carregando endereços...</Text>
              </View>
            ) : enderecos.length === 0 ? (
              <View style={estilos.containerVazio}>
                <Ionicons name="location-outline" size={80} color={temaMedico.cores.textoClaro} />
                <Text style={estilos.textoVazio}>Nenhum endereço cadastrado</Text>
                <Text style={estilos.subtextoVazio}>
                  Adicione um endereço para continuar com o pedido
                </Text>
              </View>
            ) : (
              enderecos.map((endereco) => (
                <TouchableOpacity
                  key={endereco.id}
                  style={[
                    estilos.cartaoEndereco,
                    enderecoSelecionado === endereco.id && estilos.cartaoEnderecoSelecionado,
                  ]}
                  onPress={() => setEnderecoSelecionado(endereco.id)}
                >
                  <View style={estilos.headerCartao}>
                    <View style={estilos.tipoContainer}>
                      <Ionicons
                        name={getIconeTipo(endereco.tipo)}
                        size={20}
                        color={
                          enderecoSelecionado === endereco.id
                            ? temaMedico.cores.primaria
                            : temaMedico.cores.textoClaro
                        }
                      />
                      <Text
                        style={[
                          estilos.tipoTexto,
                          enderecoSelecionado === endereco.id && estilos.tipoTextoSelecionado,
                        ]}
                      >
                        {endereco.tipo.charAt(0) + endereco.tipo.slice(1).toLowerCase()}
                      </Text>
                    </View>
                    {enderecoSelecionado === endereco.id && (
                      <Ionicons name="checkmark-circle" size={24} color={temaMedico.cores.primaria} />
                    )}
                  </View>

                  <Text style={estilos.enderecoTexto}>
                    {endereco.logradouro}, {endereco.numero}
                  </Text>
                  {endereco.complemento && (
                    <Text style={estilos.enderecoTexto}>{endereco.complemento}</Text>
                  )}
                  <Text style={estilos.enderecoTexto}>
                    {endereco.bairro} - {endereco.cidade}/{endereco.estado}
                  </Text>
                  <Text style={estilos.cepTexto}>CEP: {endereco.cep}</Text>
                </TouchableOpacity>
              ))
            )}

            {/* Botão Adicionar Novo */}
            <TouchableOpacity style={estilos.botaoAdicionarNovo} onPress={onAdicionarNovo}>
              <Ionicons name="add-circle-outline" size={24} color={temaMedico.cores.primaria} />
              <Text style={estilos.textoBotaoAdicionarNovo}>Adicionar Novo Endereço</Text>
            </TouchableOpacity>

            <View style={{ height: 20 }} />
          </ScrollView>

          {/* Footer */}
          {enderecos.length > 0 && (
            <View style={estilos.footer}>
              <TouchableOpacity style={estilos.botaoCancelar} onPress={onFechar}>
                <Text style={estilos.textoBotaoCancelar}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  estilos.botaoConfirmar,
                  !enderecoSelecionado && estilos.botaoConfirmarDesabilitado,
                ]}
                onPress={handleSelecionar}
                disabled={!enderecoSelecionado}
              >
                <Text style={estilos.textoBotaoConfirmar}>Confirmar</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

const estilos = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: temaMedico.cores.backgroundCard,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: temaMedico.cores.borda,
  },
  titulo: {
    fontSize: temaMedico.fontes.tamanhos.xl,
    fontWeight: temaMedico.fontes.pesos.bold,
    color: temaMedico.cores.textoTitulo,
  },
  botaoFechar: {
    padding: 4,
  },
  conteudo: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  containerCarregando: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  textoCarregando: {
    marginTop: 16,
    fontSize: temaMedico.fontes.tamanhos.md,
    color: temaMedico.cores.textoSubtitulo,
  },
  containerVazio: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  textoVazio: {
    marginTop: 16,
    fontSize: temaMedico.fontes.tamanhos.lg,
    fontWeight: temaMedico.fontes.pesos.semibold,
    color: temaMedico.cores.textoTitulo,
  },
  subtextoVazio: {
    marginTop: 8,
    fontSize: temaMedico.fontes.tamanhos.sm,
    color: temaMedico.cores.textoClaro,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  cartaoEndereco: {
    backgroundColor: temaMedico.cores.background,
    borderRadius: temaMedico.bordas.media,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: temaMedico.cores.borda,
  },
  cartaoEnderecoSelecionado: {
    borderColor: temaMedico.cores.primaria,
    backgroundColor: temaMedico.cores.primaria + '10',
  },
  headerCartao: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  tipoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tipoTexto: {
    fontSize: temaMedico.fontes.tamanhos.sm,
    fontWeight: temaMedico.fontes.pesos.semibold,
    color: temaMedico.cores.textoClaro,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  tipoTextoSelecionado: {
    color: temaMedico.cores.primaria,
  },
  enderecoTexto: {
    fontSize: temaMedico.fontes.tamanhos.md,
    color: temaMedico.cores.textoTitulo,
    marginBottom: 4,
  },
  cepTexto: {
    fontSize: temaMedico.fontes.tamanhos.sm,
    color: temaMedico.cores.textoClaro,
    marginTop: 4,
  },
  botaoAdicionarNovo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: temaMedico.bordas.media,
    borderWidth: 1.5,
    borderColor: temaMedico.cores.primaria,
    borderStyle: 'dashed',
    marginTop: 8,
  },
  textoBotaoAdicionarNovo: {
    fontSize: temaMedico.fontes.tamanhos.md,
    fontWeight: temaMedico.fontes.pesos.semibold,
    color: temaMedico.cores.primaria,
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: temaMedico.cores.borda,
  },
  botaoCancelar: {
    flex: 1,
    height: 50,
    borderRadius: temaMedico.bordas.media,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: temaMedico.cores.borda,
  },
  textoBotaoCancelar: {
    fontSize: temaMedico.fontes.tamanhos.md,
    fontWeight: temaMedico.fontes.pesos.semibold,
    color: temaMedico.cores.textoSubtitulo,
  },
  botaoConfirmar: {
    flex: 1,
    height: 50,
    borderRadius: temaMedico.bordas.media,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: temaMedico.cores.primaria,
  },
  botaoConfirmarDesabilitado: {
    opacity: 0.5,
  },
  textoBotaoConfirmar: {
    fontSize: temaMedico.fontes.tamanhos.md,
    fontWeight: temaMedico.fontes.pesos.semibold,
    color: temaMedico.cores.textoBranco,
  },
});
