/**
 * Componente SearchHeader - Esculapi
 * Cabeçalho reutilizável com campo de busca
 * Metodologia BEM para nomenclatura
 */

import { TouchableOpacity, TextInput, StyleSheet, View, Text } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { temaMedico } from '@/src/estilos/temaMedico';
import { forwardRef } from 'react';

interface SearchHeaderProps {
  titulo?: string;
  placeholder?: string;
  valorBusca: string;
  onChangeBusca: (texto: string) => void;
  onLimpar?: () => void;
  mostrarBotaoVoltar?: boolean;
  onVoltar?: () => void;
  autoFocus?: boolean;
  mostrarTitulo?: boolean;
}

export const SearchHeader = forwardRef<TextInput, SearchHeaderProps>(
  (
    {
      titulo = 'Buscar',
      placeholder = 'Buscar...',
      valorBusca,
      onChangeBusca,
      onLimpar,
      mostrarBotaoVoltar = true,
      onVoltar,
      autoFocus = false,
      mostrarTitulo = false,
    },
    ref
  ) => {
    const handleVoltar = () => {
      if (onVoltar) {
        onVoltar();
      } else {
        router.back();
      }
    };

    return (
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <View style={styles.cabecalho}>
          {mostrarTitulo && (
            <View style={styles.cabecalho__superior}>
              {mostrarBotaoVoltar ? (
                <TouchableOpacity
                  style={styles.cabecalho__botaoVoltar}
                  onPress={handleVoltar}
                  activeOpacity={0.7}
                >
                  <Ionicons name="arrow-back" size={24} color={temaMedico.cores.textoBranco} />
                </TouchableOpacity>
              ) : (
                <View style={styles.cabecalho__placeholder} />
              )}

              <Text style={styles.cabecalho__titulo}>{titulo}</Text>

              <View style={styles.cabecalho__placeholder} />
            </View>
          )}

          {/* Campo de Busca com botão voltar integrado */}
          <View style={styles.campoBusca__container}>
            {mostrarBotaoVoltar && !mostrarTitulo && (
              <TouchableOpacity
                style={styles.campoBusca__botaoVoltar}
                onPress={handleVoltar}
                activeOpacity={0.7}
              >
                <Ionicons name="arrow-back" size={24} color={temaMedico.cores.textoBranco} />
              </TouchableOpacity>
            )}

            <View style={styles.campoBusca}>
              <Ionicons
                name="search"
                size={22}
                color={temaMedico.cores.primaria}
                style={styles.campoBusca__icone}
              />
              <TextInput
                ref={ref}
                style={styles.campoBusca__input}
                placeholder={placeholder}
                placeholderTextColor={temaMedico.cores.textoClaro}
                value={valorBusca}
                onChangeText={onChangeBusca}
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="search"
                autoFocus={autoFocus}
              />
              {valorBusca.length > 0 && (
                <TouchableOpacity
                  style={styles.campoBusca__limpar}
                  onPress={onLimpar}
                  activeOpacity={0.7}
                >
                  <Ionicons name="close-circle" size={22} color={temaMedico.cores.textoClaro} />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </SafeAreaView>
    );
  }
);

SearchHeader.displayName = 'SearchHeader';

const styles = StyleSheet.create({
  // SAFE AREA
  safeArea: {
    backgroundColor: temaMedico.cores.primaria,
  },

  // CABEÇALHO
  cabecalho: {
    backgroundColor: temaMedico.cores.primaria,
    paddingBottom: temaMedico.espacamentos.lg,
  },

  cabecalho__superior: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: temaMedico.espacamentos.lg,
    paddingTop: temaMedico.espacamentos.sm,
    marginBottom: temaMedico.espacamentos.md,
  },

  cabecalho__botaoVoltar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  cabecalho__titulo: {
    fontSize: temaMedico.fontes.tamanhos.xxl,
    fontWeight: temaMedico.fontes.pesos.bold,
    color: temaMedico.cores.textoBranco,
  },

  cabecalho__placeholder: {
    width: 44,
  },

  // CAMPO DE BUSCA COM BOTÃO VOLTAR
  campoBusca__container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: temaMedico.espacamentos.lg,
    gap: temaMedico.espacamentos.sm,
  },

  campoBusca__botaoVoltar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // CAMPO DE BUSCA
  campoBusca: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: temaMedico.cores.backgroundCard,
    borderRadius: temaMedico.bordas.extra,
    paddingHorizontal: temaMedico.espacamentos.md,
    height: 52,
    ...temaMedico.sombras.media,
  },

  campoBusca__icone: {
    marginRight: temaMedico.espacamentos.sm,
  },

  campoBusca__input: {
    flex: 1,
    fontSize: temaMedico.fontes.tamanhos.md,
    color: temaMedico.cores.textoTitulo,
    paddingVertical: 0,
    height: 52,
  },

  campoBusca__limpar: {
    padding: temaMedico.espacamentos.xs,
    marginLeft: temaMedico.espacamentos.xs,
  },
});
