/**
 * Tela: Upload de Receita Médica
 * Permite cliente enviar foto ou PDF da receita para um pedido
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { temaMedico } from '@/src/estilos/temaMedico';
import { ProtectedRoute } from '@/src/componentes/ProtectedRoute';
import { uploadReceita } from '@/src/servicos/pedidos/pedidoService';

export default function UploadReceitaScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const pedidoId = parseInt(id || '0');

  const [receita, setReceita] = useState<string | null>(null);
  const [tipoArquivo, setTipoArquivo] = useState<'image/jpeg' | 'application/pdf'>('image/jpeg');
  const [uploading, setUploading] = useState(false);

  /**
   * Solicitar permissão e tirar foto da câmera
   */
  const tirarFoto = async () => {
    try {
      // Solicitar permissão
      const { status } = await ImagePicker.requestCameraPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert(
          'Permissão Necessária',
          'Precisamos de permissão para usar a câmera.'
        );
        return;
      }

      // Abrir câmera
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
        allowsEditing: true,
      });

      if (!result.canceled && result.assets[0]) {
        setReceita(result.assets[0].uri);
        setTipoArquivo('image/jpeg');
      }
    } catch (error) {
      console.error('Erro ao tirar foto:', error);
      Alert.alert('Erro', 'Não foi possível abrir a câmera');
    }
  };

  /**
   * Escolher foto da galeria
   */
  const escolherFoto = async () => {
    try {
      // Solicitar permissão
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert(
          'Permissão Necessária',
          'Precisamos de permissão para acessar suas fotos.'
        );
        return;
      }

      // Abrir galeria
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
        allowsEditing: true,
      });

      if (!result.canceled && result.assets[0]) {
        setReceita(result.assets[0].uri);
        setTipoArquivo('image/jpeg');
      }
    } catch (error) {
      console.error('Erro ao escolher foto:', error);
      Alert.alert('Erro', 'Não foi possível acessar a galeria');
    }
  };

  /**
   * Escolher arquivo PDF
   */
  const escolherPDF = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets[0]) {
        setReceita(result.assets[0].uri);
        setTipoArquivo('application/pdf');
      }
    } catch (error) {
      console.error('Erro ao escolher PDF:', error);
      Alert.alert('Erro', 'Não foi possível acessar os arquivos');
    }
  };

  /**
   * Enviar receita para o servidor
   */
  const enviarReceita = async () => {
    if (!receita) {
      Alert.alert('Atenção', 'Selecione uma foto ou arquivo PDF da receita');
      return;
    }

    setUploading(true);

    try {
      // Criar FormData
      const formData = new FormData();

      const fileName = receita.split('/').pop() || 'receita';
      const fileExtension = tipoArquivo === 'application/pdf' ? 'pdf' : 'jpg';

      formData.append('receita', {
        uri: receita,
        type: tipoArquivo,
        name: `receita-${pedidoId}.${fileExtension}`,
      } as any);

      // Fazer upload
      await uploadReceita(pedidoId, formData);

      Alert.alert(
        'Sucesso!',
        'Receita enviada com sucesso. Aguarde a validação do farmacêutico.',
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error: any) {
      console.error('Erro ao enviar receita:', error);
      Alert.alert(
        'Erro',
        error.message || 'Não foi possível enviar a receita. Tente novamente.'
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <ProtectedRoute>
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'Enviar Receita Médica',
          headerStyle: {
            backgroundColor: temaMedico.cores.backgroundCard,
          },
          headerTintColor: temaMedico.cores.textoTitulo,
        }}
      />

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Informações */}
        <View style={styles.infoBox}>
          <Ionicons name="information-circle" size={24} color={temaMedico.cores.primaria} />
          <View style={styles.infoTexts}>
            <Text style={styles.infoTitle}>Receita Médica Necessária</Text>
            <Text style={styles.infoDescription}>
              Para medicamentos controlados, é obrigatório o envio de receita médica válida.
            </Text>
          </View>
        </View>

        {/* Opções de Upload */}
        {!receita ? (
          <View style={styles.opcoes}>
            <Text style={styles.opcoesTitle}>Como deseja enviar?</Text>

            <TouchableOpacity style={styles.opcaoButton} onPress={tirarFoto}>
              <Ionicons name="camera" size={32} color={temaMedico.cores.primaria} />
              <View style={styles.opcaoTexts}>
                <Text style={styles.opcaoTitle}>Tirar Foto</Text>
                <Text style={styles.opcaoDescription}>
                  Use a câmera do celular
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={temaMedico.cores.textoClaro} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.opcaoButton} onPress={escolherFoto}>
              <Ionicons name="images" size={32} color={temaMedico.cores.primaria} />
              <View style={styles.opcaoTexts}>
                <Text style={styles.opcaoTitle}>Escolher da Galeria</Text>
                <Text style={styles.opcaoDescription}>
                  Selecione uma foto existente
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={temaMedico.cores.textoClaro} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.opcaoButton} onPress={escolherPDF}>
              <Ionicons name="document" size={32} color={temaMedico.cores.primaria} />
              <View style={styles.opcaoTexts}>
                <Text style={styles.opcaoTitle}>Arquivo PDF</Text>
                <Text style={styles.opcaoDescription}>
                  Enviar receita em PDF
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={temaMedico.cores.textoClaro} />
            </TouchableOpacity>
          </View>
        ) : (
          // Preview da Receita
          <View style={styles.preview}>
            <Text style={styles.previewTitle}>Receita Selecionada</Text>

            {tipoArquivo === 'image/jpeg' ? (
              <Image
                source={{ uri: receita }}
                style={styles.previewImage}
                resizeMode="contain"
              />
            ) : (
              <View style={styles.pdfPreview}>
                <Ionicons name="document-text" size={64} color={temaMedico.cores.primaria} />
                <Text style={styles.pdfName}>Arquivo PDF Selecionado</Text>
              </View>
            )}

            {/* Botões de Ação */}
            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.buttonSecondary}
                onPress={() => setReceita(null)}
                disabled={uploading}
              >
                <Ionicons name="close-circle" size={20} color={temaMedico.cores.textoSubtitulo} />
                <Text style={styles.buttonSecondaryText}>Escolher Outra</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.buttonPrimary, uploading && styles.buttonDisabled]}
                onPress={enviarReceita}
                disabled={uploading}
              >
                {uploading ? (
                  <>
                    <ActivityIndicator size="small" color="#fff" />
                    <Text style={styles.buttonPrimaryText}>Enviando...</Text>
                  </>
                ) : (
                  <>
                    <Ionicons name="cloud-upload" size={20} color="#fff" />
                    <Text style={styles.buttonPrimaryText}>Enviar Receita</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Dicas */}
        <View style={styles.dicas}>
          <Text style={styles.dicasTitle}>Dicas para uma boa foto:</Text>
          <View style={styles.dicaItem}>
            <Ionicons name="checkmark-circle" size={16} color={temaMedico.cores.sucesso} />
            <Text style={styles.dicaText}>Certifique-se que a receita está legível</Text>
          </View>
          <View style={styles.dicaItem}>
            <Ionicons name="checkmark-circle" size={16} color={temaMedico.cores.sucesso} />
            <Text style={styles.dicaText}>Fotografe em local bem iluminado</Text>
          </View>
          <View style={styles.dicaItem}>
            <Ionicons name="checkmark-circle" size={16} color={temaMedico.cores.sucesso} />
            <Text style={styles.dicaText}>Evite sombras ou reflexos</Text>
          </View>
          <View style={styles.dicaItem}>
            <Ionicons name="checkmark-circle" size={16} color={temaMedico.cores.sucesso} />
            <Text style={styles.dicaText}>Receita deve estar dentro da validade</Text>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </ProtectedRoute>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: temaMedico.cores.background,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#E3F2FD',
    padding: temaMedico.espacamentos.lg,
    margin: temaMedico.espacamentos.md,
    borderRadius: temaMedico.bordas.media,
    gap: 12,
  },
  infoTexts: {
    flex: 1,
  },
  infoTitle: {
    fontSize: temaMedico.fontes.tamanhos.md,
    fontWeight: temaMedico.fontes.pesos.semibold,
    color: temaMedico.cores.primaria,
    marginBottom: 4,
  },
  infoDescription: {
    fontSize: temaMedico.fontes.tamanhos.sm,
    color: temaMedico.cores.textoSubtitulo,
    lineHeight: 20,
  },
  opcoes: {
    padding: temaMedico.espacamentos.md,
  },
  opcoesTitle: {
    fontSize: temaMedico.fontes.tamanhos.lg,
    fontWeight: temaMedico.fontes.pesos.semibold,
    color: temaMedico.cores.textoTitulo,
    marginBottom: temaMedico.espacamentos.md,
  },
  opcaoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: temaMedico.cores.backgroundCard,
    padding: temaMedico.espacamentos.lg,
    borderRadius: temaMedico.bordas.media,
    marginBottom: temaMedico.espacamentos.md,
    gap: 12,
    ...temaMedico.sombras.pequena,
  },
  opcaoTexts: {
    flex: 1,
  },
  opcaoTitle: {
    fontSize: temaMedico.fontes.tamanhos.md,
    fontWeight: temaMedico.fontes.pesos.semibold,
    color: temaMedico.cores.textoTitulo,
    marginBottom: 2,
  },
  opcaoDescription: {
    fontSize: temaMedico.fontes.tamanhos.sm,
    color: temaMedico.cores.textoSubtitulo,
  },
  preview: {
    padding: temaMedico.espacamentos.md,
  },
  previewTitle: {
    fontSize: temaMedico.fontes.tamanhos.lg,
    fontWeight: temaMedico.fontes.pesos.semibold,
    color: temaMedico.cores.textoTitulo,
    marginBottom: temaMedico.espacamentos.md,
  },
  previewImage: {
    width: '100%',
    height: 400,
    backgroundColor: '#f5f5f5',
    borderRadius: temaMedico.bordas.media,
    marginBottom: temaMedico.espacamentos.lg,
  },
  pdfPreview: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
    padding: temaMedico.espacamentos.xxl,
    borderRadius: temaMedico.bordas.media,
    marginBottom: temaMedico.espacamentos.lg,
  },
  pdfName: {
    fontSize: temaMedico.fontes.tamanhos.md,
    color: temaMedico.cores.textoSubtitulo,
    marginTop: temaMedico.espacamentos.md,
  },
  actions: {
    flexDirection: 'row',
    gap: temaMedico.espacamentos.md,
  },
  buttonSecondary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: temaMedico.cores.backgroundCard,
    padding: temaMedico.espacamentos.md,
    borderRadius: temaMedico.bordas.media,
    gap: 8,
    borderWidth: 1,
    borderColor: temaMedico.cores.borda,
  },
  buttonSecondaryText: {
    fontSize: temaMedico.fontes.tamanhos.md,
    fontWeight: temaMedico.fontes.pesos.semibold,
    color: temaMedico.cores.textoSubtitulo,
  },
  buttonPrimary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: temaMedico.cores.primaria,
    padding: temaMedico.espacamentos.md,
    borderRadius: temaMedico.bordas.media,
    gap: 8,
  },
  buttonPrimaryText: {
    fontSize: temaMedico.fontes.tamanhos.md,
    fontWeight: temaMedico.fontes.pesos.semibold,
    color: '#fff',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  dicas: {
    margin: temaMedico.espacamentos.md,
    padding: temaMedico.espacamentos.lg,
    backgroundColor: temaMedico.cores.backgroundCard,
    borderRadius: temaMedico.bordas.media,
  },
  dicasTitle: {
    fontSize: temaMedico.fontes.tamanhos.md,
    fontWeight: temaMedico.fontes.pesos.semibold,
    color: temaMedico.cores.textoTitulo,
    marginBottom: temaMedico.espacamentos.md,
  },
  dicaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  dicaText: {
    flex: 1,
    fontSize: temaMedico.fontes.tamanhos.sm,
    color: temaMedico.cores.textoSubtitulo,
  },
});
