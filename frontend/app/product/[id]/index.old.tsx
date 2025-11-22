/**
 * Tela DetalheProduto - Arquitetura OOP + Português
 * Tela de detalhes do produto com classes de domínio
 */

import React from 'react';
import {
  ScrollView,
  View,
  TouchableOpacity,
  Text,
  ActivityIndicator,
} from 'react-native';
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { temaMedico } from '@/src/estilos/temaMedico';
import { productStyles as estilos } from '@/src/estilos/pages/productStyles';

// Hook OOP
import { useDadosProduto } from '../hooks/useDadosProduto';

// Componentes
import { CabecalhoProduto } from '../componentes/CabecalhoProduto';

export default function TelaDetalheProduto() {
  // Hook com toda a lógica OOP
  const {
    produto,
    quantidade,
    favorito,
    carregando,
    erro,
    precoTotal,
    manipuladores,
  } = useDadosProduto();

  /**
   * Loading
   */
  if (carregando) {
    return (
      <>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={estilos.containerCarregando}>
          <ActivityIndicator size="large" color={temaMedico.cores.primaria} />
          <Text style={estilos.textoCarregando}>Carregando produto...</Text>
        </View>
      </>
    );
  }

  /**
   * Erro
   */
  if (erro || !produto) {
    return (
      <>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={estilos.containerErro}>
          <Ionicons name="alert-circle-outline" size={64} color={temaMedico.cores.erro} />
          <Text style={estilos.textoErro}>{erro || 'Produto não encontrado'}</Text>
          <TouchableOpacity style={estilos.botaoVoltar} onPress={manipuladores.aoVoltar}>
            <Text style={estilos.textoBotaoVoltar}>Voltar</Text>
          </TouchableOpacity>
        </View>
      </>
    );
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={estilos.container}>
        {/* Cabeçalho Fixo */}
        <CabecalhoProduto
          favorito={favorito}
          aoVoltar={manipuladores.aoVoltar}
          aoAlternarFavorito={manipuladores.aoAlternarFavorito}
          aoCompartilhar={manipuladores.aoCompartilhar}
        />

        {/* Conteúdo Scrollável */}
        <ScrollView style={estilos.conteudo} showsVerticalScrollIndicator={false}>
          {/* Imagem do Produto */}
          <View style={estilos.containerImagem}>
            <Ionicons name={produto.icone as any} size={120} color={temaMedico.cores.primaria} />
          </View>

          {/* Badge de Desconto */}
          {produto.estaEmPromocao() && (
            <View style={estilos.badgeDesconto}>
              <Text style={estilos.textoDesconto}>-{produto.calcularDesconto()}% OFF</Text>
            </View>
          )}

          {/* Informações Principais */}
          <View style={estilos.secaoInfo}>
            <Text style={estilos.nomeProduto}>{produto.nome}</Text>

            <TouchableOpacity
              style={estilos.farmacia}
              onPress={manipuladores.aoClicarFarmacia}
            >
              <Ionicons name="storefront-outline" size={16} color={temaMedico.cores.textoClaro} />
              <Text style={estilos.textoFarmacia}>{produto.farmaciaNome}</Text>
            </TouchableOpacity>

            <View style={estilos.categoria}>
              <Ionicons name="pricetag-outline" size={14} color={temaMedico.cores.textoClaro} />
              <Text style={estilos.textoCategoria}>{produto.categoria}</Text>
            </View>

            {/* Preços */}
            <View style={estilos.containerPrecos}>
              {produto.estaEmPromocao() && (
                <Text style={estilos.precoAntigo}>R$ {produto.formatarPrecoNormal()}</Text>
              )}
              <Text style={estilos.preco}>R$ {produto.formatarPreco()}</Text>
            </View>

            {/* Estoque */}
            <View style={estilos.estoque}>
              <Ionicons
                name={produto.estaDisponivel() ? 'checkmark-circle' : 'close-circle'}
                size={16}
                color={produto.estaDisponivel() ? temaMedico.cores.sucesso : temaMedico.cores.erro}
              />
              <Text style={[
                estilos.textoEstoque,
                !produto.estaDisponivel() && estilos.textoEstoqueIndisponivel
              ]}>
                {produto.estaDisponivel()
                  ? `${produto.estoque} unidades disponíveis`
                  : 'Produto indisponível'}
              </Text>
            </View>
          </View>

          {/* Descrição */}
          <View style={estilos.secaoDescricao}>
            <Text style={estilos.tituloSecao}>Descrição</Text>
            <Text style={estilos.descricao}>{produto.descricao}</Text>
          </View>

          {/* Quantidade */}
          <View style={estilos.secaoQuantidade}>
            <Text style={estilos.tituloSecao}>Quantidade</Text>
            <View style={estilos.controladorQuantidade}>
              <TouchableOpacity
                style={estilos.botaoQuantidade}
                onPress={manipuladores.aoDecrementarQuantidade}
                disabled={quantidade <= 1}
              >
                <Ionicons
                  name="remove"
                  size={24}
                  color={quantidade <= 1 ? temaMedico.cores.textoClaro : temaMedico.cores.primaria}
                />
              </TouchableOpacity>

              <Text style={estilos.textoQuantidade}>{quantidade}</Text>

              <TouchableOpacity
                style={estilos.botaoQuantidade}
                onPress={manipuladores.aoIncrementarQuantidade}
                disabled={!produto.podeAdicionarQuantidade(quantidade + 1)}
              >
                <Ionicons
                  name="add"
                  size={24}
                  color={
                    produto.podeAdicionarQuantidade(quantidade + 1)
                      ? temaMedico.cores.primaria
                      : temaMedico.cores.textoClaro
                  }
                />
              </TouchableOpacity>
            </View>

            <View style={estilos.totalQuantidade}>
              <Text style={estilos.labelTotal}>Total:</Text>
              <Text style={estilos.valorTotal}>R$ {precoTotal}</Text>
            </View>
          </View>

          <View style={estilos.espacamentoFinal} />
        </ScrollView>

        {/* Rodapé Fixo com Botão */}
        <View style={estilos.rodape}>
          <TouchableOpacity
            style={[
              estilos.botaoAdicionar,
              !produto.estaDisponivel() && estilos.botaoAdicionarDesabilitado
            ]}
            onPress={manipuladores.aoAdicionarCarrinho}
            disabled={!produto.estaDisponivel()}
          >
            <Ionicons name="cart-outline" size={24} color={temaMedico.cores.textoBranco} />
            <Text style={estilos.textoBotaoAdicionar}>
              {produto.estaDisponivel() ? 'Adicionar ao Carrinho' : 'Indisponível'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}
