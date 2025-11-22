/**
 * Tela Carrinho - Arquitetura OOP + Português
 * Carrinho de compras com classes de domínio
 */

import React from 'react';
import {
  ScrollView,
  View,
  TouchableOpacity,
  Text,
  TextInput,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { temaMedico } from '@/src/estilos/temaMedico';
import { ModalSelecionarEndereco } from '@/src/components/ModalSelecionarEndereco';
import { ModalEndereco } from '@/src/components/ModalEndereco';
import { criarEndereco } from '@/src/servicos/enderecos/enderecoService';
import type { EnderecoRequest } from '@/src/servicos/types/api.types';

// Hook OOP
import { useDadosCarrinho } from './hooks/useDadosCarrinho';

export default function TelaCarrinho() {
  // Hook com toda a lógica OOP
  const {
    itens,
    cupomAplicado,
    codigoCupom,
    estaVazio,
    quantidadeTotal,
    subtotal,
    desconto,
    taxaEntrega,
    total,
    processandoPedido,
    modalEnderecoVisivel,
    modalNovoEnderecoVisivel,
    enderecoSelecionado,
    manipuladores,
  } = useDadosCarrinho();

  const handleSalvarNovoEndereco = async (enderecoData: EnderecoRequest) => {
    const enderecoCriado = await criarEndereco(enderecoData);
    manipuladores.aoSalvarNovoEndereco(enderecoCriado);
  };

  /**
   * Carrinho vazio
   */
  if (estaVazio) {
    return (
      <>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={estilos.container}>
          {/* Cabeçalho */}
          <View style={estilos.cabecalho}>
            <TouchableOpacity onPress={manipuladores.aoVoltar}>
              <Ionicons name="arrow-back" size={24} color={temaMedico.cores.textoTitulo} />
            </TouchableOpacity>
            <Text style={estilos.tituloCabecalho}>Carrinho</Text>
            <View style={{ width: 24 }} />
          </View>

          {/* Estado vazio */}
          <View style={estilos.containerVazio}>
            <Ionicons name="cart-outline" size={100} color={temaMedico.cores.textoClaro} />
            <Text style={estilos.tituloVazio}>Seu carrinho está vazio</Text>
            <Text style={estilos.mensagemVazio}>
              Adicione produtos ao seu carrinho para continuar
            </Text>
            <TouchableOpacity
              style={estilos.botaoIniciarCompras}
              onPress={manipuladores.aoIniciarCompras}
            >
              <Text style={estilos.textoBotaoIniciarCompras}>Começar a Comprar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </>
    );
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={estilos.container}>
        {/* Cabeçalho */}
        <View style={estilos.cabecalho}>
          <TouchableOpacity onPress={manipuladores.aoVoltar}>
            <Ionicons name="arrow-back" size={24} color={temaMedico.cores.textoTitulo} />
          </TouchableOpacity>
          <Text style={estilos.tituloCabecalho}>
            Carrinho ({quantidadeTotal} {quantidadeTotal === 1 ? 'item' : 'itens'})
          </Text>
          <TouchableOpacity onPress={manipuladores.aoIrFavoritos}>
            <Ionicons name="heart-outline" size={24} color={temaMedico.cores.textoTitulo} />
          </TouchableOpacity>
        </View>

        <ScrollView style={estilos.conteudo} showsVerticalScrollIndicator={false}>
          {/* Lista de Itens */}
          <View style={estilos.listaItens}>
            {itens.map((item) => (
              <View key={item.id} style={estilos.cartaoItem}>
                <View style={estilos.iconeItem}>
                  <Ionicons name="medical" size={32} color={temaMedico.cores.primaria} />
                </View>

                <View style={estilos.infoItem}>
                  <Text style={estilos.nomeItem}>{item.nome}</Text>
                  <Text style={estilos.farmaciaItem}>{item.farmacia}</Text>
                  <Text style={estilos.precoItem}>R$ {item.formatarPreco()}</Text>
                </View>

                <View style={estilos.acoesItem}>
                  <View style={estilos.controladorQuantidade}>
                    <TouchableOpacity
                      style={estilos.botaoQuantidade}
                      onPress={() => manipuladores.aoDecrementarQuantidade(item.id)}
                    >
                      <Ionicons name="remove" size={16} color={temaMedico.cores.primaria} />
                    </TouchableOpacity>

                    <Text style={estilos.textoQuantidade}>{item.quantidade}</Text>

                    <TouchableOpacity
                      style={estilos.botaoQuantidade}
                      onPress={() => manipuladores.aoIncrementarQuantidade(item.id)}
                    >
                      <Ionicons name="add" size={16} color={temaMedico.cores.primaria} />
                    </TouchableOpacity>
                  </View>

                  <TouchableOpacity
                    style={estilos.botaoRemover}
                    onPress={() => manipuladores.aoRemoverItem(item.id)}
                  >
                    <Ionicons name="trash-outline" size={18} color={temaMedico.cores.erro} />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>

          {/* Cupom */}
          <View style={estilos.secaoCupom}>
            <Text style={estilos.tituloCupom}>Cupom de Desconto</Text>

            {cupomAplicado ? (
              <View style={estilos.cupomAplicado}>
                <View>
                  <Text style={estilos.textoCupomAplicado}>Cupom: {cupomAplicado}</Text>
                  <Text style={estilos.descontoCupom}>Desconto aplicado!</Text>
                </View>
                <TouchableOpacity onPress={manipuladores.aoRemoverCupom}>
                  <Ionicons name="close-circle" size={24} color={temaMedico.cores.erro} />
                </TouchableOpacity>
              </View>
            ) : (
              <View style={estilos.containerInputCupom}>
                <TextInput
                  style={estilos.inputCupom}
                  placeholder="Digite o código do cupom"
                  placeholderTextColor={temaMedico.cores.textoClaro}
                  value={codigoCupom}
                  onChangeText={manipuladores.aoMudarCodigoCupom}
                  autoCapitalize="characters"
                />
                <TouchableOpacity
                  style={estilos.botaoAplicarCupom}
                  onPress={manipuladores.aoAplicarCupom}
                >
                  <Text style={estilos.textoBotaoAplicarCupom}>Aplicar</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Resumo do Pedido */}
          <View style={estilos.resumoPedido}>
            <Text style={estilos.tituloResumo}>Resumo do Pedido</Text>

            <View style={estilos.linhaResumo}>
              <Text style={estilos.labelResumo}>Subtotal:</Text>
              <Text style={estilos.valorResumo}>R$ {subtotal}</Text>
            </View>

            {desconto !== '0,00' && (
              <View style={estilos.linhaResumo}>
                <Text style={[estilos.labelResumo, { color: temaMedico.cores.sucesso }]}>
                  Desconto:
                </Text>
                <Text style={[estilos.valorResumo, { color: temaMedico.cores.sucesso }]}>
                  -R$ {desconto}
                </Text>
              </View>
            )}

            <View style={estilos.linhaResumo}>
              <Text style={estilos.labelResumo}>Taxa de Entrega:</Text>
              <Text style={estilos.valorResumo}>R$ {taxaEntrega}</Text>
            </View>

            <View style={[estilos.linhaResumo, estilos.linhaTotal]}>
              <Text style={estilos.labelTotal}>Total:</Text>
              <Text style={estilos.valorTotal}>R$ {total}</Text>
            </View>
          </View>

          <View style={estilos.espacamentoFinal} />
        </ScrollView>

        {/* Rodapé Fixo */}
        <View style={estilos.rodape}>
          <View style={estilos.infoRodape}>
            <Text style={estilos.labelRodape}>Total</Text>
            <Text style={estilos.valorRodape}>R$ {total}</Text>
          </View>

          {!enderecoSelecionado ? (
            // Sem endereço: mostrar botão "Adicionar Endereço" e "Finalizar Compra" desabilitado
            <View style={estilos.containerBotoesRodape}>
              <TouchableOpacity
                style={estilos.botaoAdicionarEndereco}
                onPress={manipuladores.aoAbrirNovoEndereco}
              >
                <Ionicons name="add-circle-outline" size={20} color={temaMedico.cores.primaria} />
                <Text style={estilos.textoBotaoAdicionarEndereco}>Adicionar Endereço</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[estilos.botaoFinalizar, estilos.botaoFinalizarDesabilitado]}
                disabled
              >
                <Text style={estilos.textoBotaoFinalizar}>Finalizar Compra</Text>
              </TouchableOpacity>
            </View>
          ) : (
            // Com endereço: botão normal
            <TouchableOpacity
              style={[estilos.botaoFinalizar, processandoPedido && estilos.botaoFinalizarDesabilitado]}
              onPress={manipuladores.aoFinalizarCompra}
              disabled={processandoPedido}
            >
              {processandoPedido ? (
                <ActivityIndicator color={temaMedico.cores.textoBranco} size="small" />
              ) : (
                <Text style={estilos.textoBotaoFinalizar}>Finalizar Compra</Text>
              )}
            </TouchableOpacity>
          )}
        </View>

        {/* Modais de Endereço */}
        <ModalSelecionarEndereco
          visivel={modalEnderecoVisivel}
          onFechar={manipuladores.aoFecharModalEndereco}
          onSelecionar={manipuladores.aoSelecionarEndereco}
          onAdicionarNovo={manipuladores.aoAbrirNovoEndereco}
        />

        <ModalEndereco
          visivel={modalNovoEnderecoVisivel}
          onFechar={manipuladores.aoFecharModalNovoEndereco}
          onSalvar={handleSalvarNovoEndereco}
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
  cabecalho: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: temaMedico.espacamentos.lg,
    paddingTop: 60,
    paddingBottom: temaMedico.espacamentos.lg,
    backgroundColor: temaMedico.cores.backgroundCard,
    ...temaMedico.sombras.pequena,
  },
  tituloCabecalho: {
    fontSize: temaMedico.fontes.tamanhos.xl,
    fontWeight: temaMedico.fontes.pesos.bold,
    color: temaMedico.cores.textoTitulo,
  },
  containerVazio: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: temaMedico.espacamentos.xxl,
  },
  tituloVazio: {
    fontSize: temaMedico.fontes.tamanhos.xl,
    fontWeight: temaMedico.fontes.pesos.bold,
    color: temaMedico.cores.textoTitulo,
    marginTop: temaMedico.espacamentos.lg,
  },
  mensagemVazio: {
    fontSize: temaMedico.fontes.tamanhos.md,
    color: temaMedico.cores.textoClaro,
    textAlign: 'center',
    marginTop: temaMedico.espacamentos.sm,
    marginBottom: temaMedico.espacamentos.xl,
  },
  botaoIniciarCompras: {
    backgroundColor: temaMedico.cores.primaria,
    paddingVertical: temaMedico.espacamentos.md,
    paddingHorizontal: temaMedico.espacamentos.xl,
    borderRadius: temaMedico.bordas.media,
  },
  textoBotaoIniciarCompras: {
    color: temaMedico.cores.textoBranco,
    fontSize: temaMedico.fontes.tamanhos.md,
    fontWeight: temaMedico.fontes.pesos.bold,
  },
  conteudo: {
    flex: 1,
  },
  listaItens: {
    padding: temaMedico.espacamentos.md,
  },
  cartaoItem: {
    flexDirection: 'row',
    backgroundColor: temaMedico.cores.backgroundCard,
    padding: temaMedico.espacamentos.md,
    borderRadius: temaMedico.bordas.media,
    marginBottom: temaMedico.espacamentos.md,
    ...temaMedico.sombras.pequena,
  },
  iconeItem: {
    width: 60,
    height: 60,
    backgroundColor: temaMedico.cores.background,
    borderRadius: temaMedico.bordas.media,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: temaMedico.espacamentos.md,
  },
  infoItem: {
    flex: 1,
  },
  nomeItem: {
    fontSize: temaMedico.fontes.tamanhos.md,
    fontWeight: temaMedico.fontes.pesos.semibold,
    color: temaMedico.cores.textoTitulo,
    marginBottom: 4,
  },
  farmaciaItem: {
    fontSize: temaMedico.fontes.tamanhos.sm,
    color: temaMedico.cores.textoClaro,
    marginBottom: 4,
  },
  precoItem: {
    fontSize: temaMedico.fontes.tamanhos.lg,
    fontWeight: temaMedico.fontes.pesos.bold,
    color: temaMedico.cores.primaria,
  },
  acoesItem: {
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  controladorQuantidade: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  botaoQuantidade: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: temaMedico.cores.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textoQuantidade: {
    fontSize: temaMedico.fontes.tamanhos.md,
    fontWeight: temaMedico.fontes.pesos.semibold,
    color: temaMedico.cores.textoTitulo,
    minWidth: 24,
    textAlign: 'center',
  },
  botaoRemover: {
    padding: 8,
  },
  secaoCupom: {
    margin: temaMedico.espacamentos.md,
    padding: temaMedico.espacamentos.lg,
    backgroundColor: temaMedico.cores.backgroundCard,
    borderRadius: temaMedico.bordas.media,
    ...temaMedico.sombras.pequena,
  },
  tituloCupom: {
    fontSize: temaMedico.fontes.tamanhos.lg,
    fontWeight: temaMedico.fontes.pesos.semibold,
    color: temaMedico.cores.textoTitulo,
    marginBottom: temaMedico.espacamentos.md,
  },
  containerInputCupom: {
    flexDirection: 'row',
    gap: 8,
  },
  inputCupom: {
    flex: 1,
    height: 48,
    backgroundColor: temaMedico.cores.background,
    borderRadius: temaMedico.bordas.media,
    paddingHorizontal: temaMedico.espacamentos.md,
    fontSize: temaMedico.fontes.tamanhos.md,
    color: temaMedico.cores.textoTitulo,
    borderWidth: 1,
    borderColor: temaMedico.cores.borda,
  },
  botaoAplicarCupom: {
    paddingHorizontal: temaMedico.espacamentos.lg,
    justifyContent: 'center',
    backgroundColor: temaMedico.cores.primaria,
    borderRadius: temaMedico.bordas.media,
  },
  textoBotaoAplicarCupom: {
    color: temaMedico.cores.textoBranco,
    fontSize: temaMedico.fontes.tamanhos.md,
    fontWeight: temaMedico.fontes.pesos.semibold,
  },
  cupomAplicado: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: temaMedico.espacamentos.md,
    backgroundColor: temaMedico.cores.background,
    borderRadius: temaMedico.bordas.media,
  },
  textoCupomAplicado: {
    fontSize: temaMedico.fontes.tamanhos.md,
    fontWeight: temaMedico.fontes.pesos.semibold,
    color: temaMedico.cores.textoTitulo,
  },
  descontoCupom: {
    fontSize: temaMedico.fontes.tamanhos.sm,
    color: temaMedico.cores.sucesso,
    marginTop: 4,
  },
  resumoPedido: {
    margin: temaMedico.espacamentos.md,
    padding: temaMedico.espacamentos.lg,
    backgroundColor: temaMedico.cores.backgroundCard,
    borderRadius: temaMedico.bordas.media,
    ...temaMedico.sombras.pequena,
  },
  tituloResumo: {
    fontSize: temaMedico.fontes.tamanhos.lg,
    fontWeight: temaMedico.fontes.pesos.semibold,
    color: temaMedico.cores.textoTitulo,
    marginBottom: temaMedico.espacamentos.md,
  },
  linhaResumo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: temaMedico.espacamentos.sm,
  },
  labelResumo: {
    fontSize: temaMedico.fontes.tamanhos.md,
    color: temaMedico.cores.textoSubtitulo,
  },
  valorResumo: {
    fontSize: temaMedico.fontes.tamanhos.md,
    fontWeight: temaMedico.fontes.pesos.semibold,
    color: temaMedico.cores.textoTitulo,
  },
  linhaTotal: {
    marginTop: temaMedico.espacamentos.md,
    paddingTop: temaMedico.espacamentos.md,
    borderTopWidth: 1,
    borderTopColor: temaMedico.cores.borda,
  },
  labelTotal: {
    fontSize: temaMedico.fontes.tamanhos.lg,
    fontWeight: temaMedico.fontes.pesos.semibold,
    color: temaMedico.cores.textoTitulo,
  },
  valorTotal: {
    fontSize: temaMedico.fontes.tamanhos.xl,
    fontWeight: temaMedico.fontes.pesos.bold,
    color: temaMedico.cores.primaria,
  },
  espacamentoFinal: {
    height: 100,
  },
  rodape: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: temaMedico.espacamentos.lg,
    backgroundColor: temaMedico.cores.backgroundCard,
    ...temaMedico.sombras.media,
  },
  infoRodape: {
    flex: 1,
  },
  labelRodape: {
    fontSize: temaMedico.fontes.tamanhos.sm,
    color: temaMedico.cores.textoClaro,
  },
  valorRodape: {
    fontSize: temaMedico.fontes.tamanhos.xl,
    fontWeight: temaMedico.fontes.pesos.bold,
    color: temaMedico.cores.primaria,
  },
  containerBotoesRodape: {
    flexDirection: 'row',
    gap: 8,
    flex: 1,
    justifyContent: 'flex-end',
  },
  botaoAdicionarEndereco: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: temaMedico.cores.backgroundCard,
    paddingVertical: temaMedico.espacamentos.sm,
    paddingHorizontal: temaMedico.espacamentos.md,
    borderRadius: temaMedico.bordas.media,
    borderWidth: 1.5,
    borderColor: temaMedico.cores.primaria,
  },
  textoBotaoAdicionarEndereco: {
    color: temaMedico.cores.primaria,
    fontSize: temaMedico.fontes.tamanhos.sm,
    fontWeight: temaMedico.fontes.pesos.semibold,
  },
  botaoFinalizar: {
    backgroundColor: temaMedico.cores.primaria,
    paddingVertical: temaMedico.espacamentos.md,
    paddingHorizontal: temaMedico.espacamentos.xl,
    borderRadius: temaMedico.bordas.media,
  },
  botaoFinalizarDesabilitado: {
    backgroundColor: temaMedico.cores.textoClaro,
    opacity: 0.6,
  },
  textoBotaoFinalizar: {
    color: temaMedico.cores.textoBranco,
    fontSize: temaMedico.fontes.tamanhos.md,
    fontWeight: temaMedico.fontes.pesos.bold,
  },
});
