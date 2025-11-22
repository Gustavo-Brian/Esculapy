/**
 * Tela de Endereços
 * Gerenciamento de endereços do cliente
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Stack, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { temaMedico } from '@/src/estilos/temaMedico';
import { ModalEndereco } from '@/src/components/ModalEndereco';
import type { Endereco, EnderecoRequest } from '@/src/servicos/types/api.types';
import {
  listarEnderecos,
  criarEndereco,
  atualizarEndereco,
  deletarEndereco,
} from '@/src/servicos/enderecos/enderecoService';
import { useToast } from '@/src/hooks/useToast';

export default function TelaEnderecos() {
  const [enderecos, setEnderecos] = useState<Endereco[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [modalVisivel, setModalVisivel] = useState(false);
  const [enderecoEditando, setEnderecoEditando] = useState<Endereco | null>(null);
  const { showSuccess, showError } = useToast();

  const carregarEnderecos = useCallback(async () => {
    try {
      setCarregando(true);
      const response = await listarEnderecos();
      setEnderecos(response.enderecos);
    } catch (error: any) {
      console.error('[TelaEnderecos] Erro ao carregar endereços:', error);
      showError(error.message || 'Erro ao carregar endereços');
    } finally {
      setCarregando(false);
    }
  }, [showError]);

  useEffect(() => {
    carregarEnderecos();
  }, [carregarEnderecos]);

  const handleAbrirModal = () => {
    setEnderecoEditando(null);
    setModalVisivel(true);
  };

  const handleEditarEndereco = (endereco: Endereco) => {
    setEnderecoEditando(endereco);
    setModalVisivel(true);
  };

  const handleSalvarEndereco = async (enderecoData: EnderecoRequest) => {
    try {
      if (enderecoEditando) {
        await atualizarEndereco(enderecoEditando.id, enderecoData);
        showSuccess('Endereço atualizado com sucesso!');
      } else {
        await criarEndereco(enderecoData);
        showSuccess('Endereço adicionado com sucesso!');
      }
      await carregarEnderecos();
    } catch (error: any) {
      throw error; // Modal irá tratar
    }
  };

  const handleDeletarEndereco = (endereco: Endereco) => {
    Alert.alert(
      'Deletar Endereço',
      `Tem certeza que deseja deletar este endereço?\n\n${endereco.logradouro}, ${endereco.numero}`,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Deletar',
          style: 'destructive',
          onPress: async () => {
            try {
              await deletarEndereco(endereco.id);
              showSuccess('Endereço deletado com sucesso!');
              await carregarEnderecos();
            } catch (error: any) {
              showError(error.message || 'Erro ao deletar endereço');
            }
          },
        },
      ]
    );
  };

  const renderizarEndereco = (endereco: Endereco) => {
    const getIconeTipo = () => {
      switch (endereco.tipo) {
        case 'RESIDENCIAL':
          return 'home';
        case 'COMERCIAL':
          return 'business';
        default:
          return 'location';
      }
    };

    return (
      <View key={endereco.id} style={estilos.cartaoEndereco}>
        <View style={estilos.headerCartao}>
          <View style={estilos.tipoContainer}>
            <Ionicons name={getIconeTipo()} size={20} color={temaMedico.cores.primaria} />
            <Text style={estilos.tipoTexto}>
              {endereco.tipo.charAt(0) + endereco.tipo.slice(1).toLowerCase()}
            </Text>
          </View>
          <View style={estilos.acoesContainer}>
            <TouchableOpacity
              style={estilos.botaoAcao}
              onPress={() => handleEditarEndereco(endereco)}
            >
              <Ionicons name="create-outline" size={20} color={temaMedico.cores.primaria} />
            </TouchableOpacity>
            <TouchableOpacity
              style={estilos.botaoAcao}
              onPress={() => handleDeletarEndereco(endereco)}
            >
              <Ionicons name="trash-outline" size={20} color={temaMedico.cores.erro} />
            </TouchableOpacity>
          </View>
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
      </View>
    );
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={estilos.container}>
        {/* Header */}
        <View style={estilos.header}>
          <TouchableOpacity onPress={() => router.back()} style={estilos.botaoVoltar}>
            <Ionicons name="arrow-back" size={24} color={temaMedico.cores.textoTitulo} />
          </TouchableOpacity>
          <Text style={estilos.titulo}>Meus Endereços</Text>
          <View style={{ width: 24 }} />
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
                Adicione um endereço para facilitar suas compras
              </Text>
            </View>
          ) : (
            enderecos.map((endereco) => renderizarEndereco(endereco))
          )}

          <View style={{ height: 100 }} />
        </ScrollView>

        {/* Botão Flutuante */}
        <TouchableOpacity style={estilos.botaoFlutuante} onPress={handleAbrirModal}>
          <Ionicons name="add" size={28} color={temaMedico.cores.textoBranco} />
        </TouchableOpacity>

        {/* Modal */}
        <ModalEndereco
          visivel={modalVisivel}
          enderecoEditando={enderecoEditando}
          onFechar={() => {
            setModalVisivel(false);
            setEnderecoEditando(null);
          }}
          onSalvar={handleSalvarEndereco}
        />
      </View>
    </>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: temaMedico.cores.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: temaMedico.cores.backgroundCard,
    ...temaMedico.sombras.pequena,
  },
  botaoVoltar: {
    padding: 4,
  },
  titulo: {
    fontSize: temaMedico.fontes.tamanhos.xl,
    fontWeight: temaMedico.fontes.pesos.bold,
    color: temaMedico.cores.textoTitulo,
  },
  conteudo: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  containerCarregando: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  textoCarregando: {
    marginTop: 16,
    fontSize: temaMedico.fontes.tamanhos.md,
    color: temaMedico.cores.textoSubtitulo,
  },
  containerVazio: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
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
    backgroundColor: temaMedico.cores.backgroundCard,
    borderRadius: temaMedico.bordas.media,
    padding: 16,
    marginBottom: 12,
    ...temaMedico.sombras.pequena,
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
    color: temaMedico.cores.primaria,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  acoesContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  botaoAcao: {
    padding: 8,
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
  botaoFlutuante: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: temaMedico.cores.primaria,
    justifyContent: 'center',
    alignItems: 'center',
    ...temaMedico.sombras.media,
  },
});
