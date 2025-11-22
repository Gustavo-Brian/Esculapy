/**
 * Componente CabecalhoProduto
 * Cabeçalho da tela de detalhes do produto
 */

import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { temaMedico } from '@/src/estilos/temaMedico';

interface PropriedadesCabecalhoProduto {
  favorito: boolean;
  aoVoltar: () => void;
  aoAlternarFavorito: () => void;
  aoCompartilhar: () => void;
}

export const CabecalhoProduto: React.FC<PropriedadesCabecalhoProduto> = ({
  favorito,
  aoVoltar,
  aoAlternarFavorito,
  aoCompartilhar,
}) => {
  return (
    <View style={estilos.container}>
      <TouchableOpacity style={estilos.botaoVoltar} onPress={aoVoltar}>
        <Ionicons name="arrow-back" size={24} color={temaMedico.cores.textoTitulo} />
      </TouchableOpacity>

      <View style={estilos.acoes}>
        <TouchableOpacity style={estilos.botaoAcao} onPress={aoAlternarFavorito}>
          <Ionicons
            name={favorito ? 'heart' : 'heart-outline'}
            size={24}
            color={favorito ? temaMedico.cores.erro : temaMedico.cores.textoTitulo}
          />
        </TouchableOpacity>

        <TouchableOpacity style={estilos.botaoAcao} onPress={aoCompartilhar}>
          <Ionicons name="share-outline" size={24} color={temaMedico.cores.textoTitulo} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const estilos = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: temaMedico.espacamentos.md,
    paddingTop: 60,
    paddingBottom: temaMedico.espacamentos.md,
    backgroundColor: temaMedico.cores.backgroundCard,
  },
  botaoVoltar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: temaMedico.cores.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  acoes: {
    flexDirection: 'row',
    gap: 12,
  },
  botaoAcao: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: temaMedico.cores.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
