/**
 * Componente CartãoProduto
 * Exibe um produto com orientação a objetos
 * Otimizado com React.memo para melhor performance
 */

import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { temaMedico } from '@/src/estilos/temaMedico';
import { Produto } from '../tipos/Produto';

interface PropriedadesCartaoProduto {
  produto: Produto;
  aoClicar: (produto: Produto) => void;
  aoAdicionarCarrinho: (produto: Produto) => void;
}

// Estilos movidos para fora do componente (performance)
const estilos = StyleSheet.create({
  container: {
    width: '48%',
    backgroundColor: temaMedico.cores.backgroundCard,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    ...temaMedico.sombras.pequena,
  },
  containerIcone: {
    width: '100%',
    height: 80,
    backgroundColor: temaMedico.cores.backgroundDestaque,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  badgeDesconto: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: temaMedico.cores.erro,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  textoDesconto: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFF',
  },
  nome: {
    fontSize: 14,
    fontWeight: '600',
    color: temaMedico.cores.textoTitulo,
    marginBottom: 4,
    minHeight: 36,
  },
  farmacia: {
    fontSize: 11,
    color: temaMedico.cores.textoClaro,
    marginBottom: 8,
  },
  containerPrecos: {
    marginBottom: 8,
  },
  precoAntigo: {
    fontSize: 11,
    color: temaMedico.cores.textoClaro,
    textDecorationLine: 'line-through',
  },
  preco: {
    fontSize: 18,
    fontWeight: '700',
    color: temaMedico.cores.primaria,
  },
  botaoAdicionar: {
    flexDirection: 'row',
    backgroundColor: temaMedico.cores.primaria,
    paddingVertical: 8,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  textoBotao: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFF',
  },
});

// Componente memoizado para evitar re-renderizações desnecessárias
export const CartaoProduto = React.memo<PropriedadesCartaoProduto>(({
  produto,
  aoClicar,
  aoAdicionarCarrinho,
}) => {
  return (
    <TouchableOpacity style={estilos.container} onPress={() => aoClicar(produto)}>
      {/* Ícone do Produto */}
      <View style={estilos.containerIcone}>
        <Ionicons name="medical" size={32} color={temaMedico.cores.primaria} />
      </View>

      {/* Badge de Desconto */}
      {produto.estaEmPromocao() && (
        <View style={estilos.badgeDesconto}>
          <Text style={estilos.textoDesconto}>-{produto.calcularDesconto()}%</Text>
        </View>
      )}

      {/* Informações */}
      <Text style={estilos.nome} numberOfLines={2}>
        {produto.nome}
      </Text>

      <Text style={estilos.farmacia} numberOfLines={1}>
        <Ionicons name="storefront-outline" size={12} /> {produto.farmaciaNome}
      </Text>

      {/* Preços */}
      <View style={estilos.containerPrecos}>
        {produto.estaEmPromocao() && produto.precoPromocional && (
          <Text style={estilos.precoAntigo}>
            R$ {produto.preco.toFixed(2).replace('.', ',')}
          </Text>
        )}
        <Text style={estilos.preco}>R$ {produto.formatarPreco()}</Text>
      </View>

      {/* Botão Adicionar */}
      <TouchableOpacity
        style={estilos.botaoAdicionar}
        onPress={(e) => {
          e.stopPropagation();
          aoAdicionarCarrinho(produto);
        }}
      >
        <Ionicons name="cart-outline" size={18} color="#FFF" />
        <Text style={estilos.textoBotao}>Adicionar</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
});

// DisplayName para debug
CartaoProduto.displayName = 'CartaoProduto';
