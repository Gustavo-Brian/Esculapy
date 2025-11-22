/**
 * Modal de Endereço
 * Modal para adicionar/editar endereços do cliente
 */

import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { temaMedico } from '@/src/estilos/temaMedico';
import type { Endereco, EnderecoRequest, TipoEndereco } from '@/src/servicos/types/api.types';
import { buscarCep } from '@/src/servicos/enderecos/enderecoService';

interface ModalEnderecoProps {
  visivel: boolean;
  enderecoEditando?: Endereco | null;
  onFechar: () => void;
  onSalvar: (endereco: EnderecoRequest) => Promise<void>;
}

export const ModalEndereco: React.FC<ModalEnderecoProps> = ({
  visivel,
  enderecoEditando,
  onFechar,
  onSalvar,
}) => {
  const [tipo, setTipo] = useState<TipoEndereco>('RESIDENCIAL');
  const [cep, setCep] = useState('');
  const [logradouro, setLogradouro] = useState('');
  const [numero, setNumero] = useState('');
  const [complemento, setComplemento] = useState('');
  const [bairro, setBairro] = useState('');
  const [cidade, setCidade] = useState('');
  const [estado, setEstado] = useState('');
  const [buscandoCep, setBuscandoCep] = useState(false);
  const [salvando, setSalvando] = useState(false);

  // Preencher campos quando editar
  useEffect(() => {
    if (enderecoEditando) {
      setTipo(enderecoEditando.tipo);
      setCep(enderecoEditando.cep);
      setLogradouro(enderecoEditando.logradouro);
      setNumero(enderecoEditando.numero);
      setComplemento(enderecoEditando.complemento || '');
      setBairro(enderecoEditando.bairro);
      setCidade(enderecoEditando.cidade);
      setEstado(enderecoEditando.estado);
    } else {
      limparCampos();
    }
  }, [enderecoEditando, visivel]);

  const limparCampos = () => {
    setTipo('RESIDENCIAL');
    setCep('');
    setLogradouro('');
    setNumero('');
    setComplemento('');
    setBairro('');
    setCidade('');
    setEstado('');
  };

  const formatarCep = (valor: string) => {
    const numeros = valor.replace(/\D/g, '');
    if (numeros.length <= 5) {
      return numeros;
    }
    return `${numeros.slice(0, 5)}-${numeros.slice(5, 8)}`;
  };

  const handleBuscarCep = async () => {
    const cepLimpo = cep.replace(/\D/g, '');

    if (cepLimpo.length !== 8) {
      Alert.alert('CEP Inválido', 'Por favor, digite um CEP válido com 8 dígitos.');
      return;
    }

    try {
      setBuscandoCep(true);
      const dadosCep = await buscarCep(cepLimpo);

      setLogradouro(dadosCep.logradouro);
      setBairro(dadosCep.bairro);
      setCidade(dadosCep.cidade);
      setEstado(dadosCep.estado);
      if (dadosCep.complemento) {
        setComplemento(dadosCep.complemento);
      }
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Erro ao buscar CEP');
    } finally {
      setBuscandoCep(false);
    }
  };

  const validarCampos = (): boolean => {
    if (!cep.trim()) {
      Alert.alert('Campo Obrigatório', 'Por favor, preencha o CEP.');
      return false;
    }

    if (cep.replace(/\D/g, '').length !== 8) {
      Alert.alert('CEP Inválido', 'Por favor, digite um CEP válido com 8 dígitos.');
      return false;
    }

    if (!logradouro.trim()) {
      Alert.alert('Campo Obrigatório', 'Por favor, preencha o logradouro.');
      return false;
    }

    if (!numero.trim()) {
      Alert.alert('Campo Obrigatório', 'Por favor, preencha o número.');
      return false;
    }

    if (!bairro.trim()) {
      Alert.alert('Campo Obrigatório', 'Por favor, preencha o bairro.');
      return false;
    }

    if (!cidade.trim()) {
      Alert.alert('Campo Obrigatório', 'Por favor, preencha a cidade.');
      return false;
    }

    if (!estado.trim()) {
      Alert.alert('Campo Obrigatório', 'Por favor, preencha o estado.');
      return false;
    }

    if (estado.length !== 2) {
      Alert.alert('Estado Inválido', 'Por favor, use a sigla do estado (ex: SP, RJ).');
      return false;
    }

    return true;
  };

  const handleSalvar = async () => {
    if (!validarCampos()) return;

    try {
      setSalvando(true);

      const enderecoData: EnderecoRequest = {
        tipo,
        cep: cep.replace(/\D/g, ''),
        logradouro: logradouro.trim(),
        numero: numero.trim(),
        complemento: complemento.trim() || undefined,
        bairro: bairro.trim(),
        cidade: cidade.trim(),
        estado: estado.trim().toUpperCase(),
      };

      await onSalvar(enderecoData);
      limparCampos();
      onFechar();
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Erro ao salvar endereço');
    } finally {
      setSalvando(false);
    }
  };

  return (
    <Modal
      visible={visivel}
      transparent
      animationType="slide"
      onRequestClose={onFechar}
    >
      <View style={estilos.overlay}>
        <View style={estilos.modalContainer}>
          {/* Header */}
          <View style={estilos.header}>
            <Text style={estilos.titulo}>
              {enderecoEditando ? 'Editar Endereço' : 'Novo Endereço'}
            </Text>
            <TouchableOpacity onPress={onFechar} style={estilos.botaoFechar}>
              <Ionicons name="close" size={24} color={temaMedico.cores.textoSecundario} />
            </TouchableOpacity>
          </View>

          <ScrollView style={estilos.conteudo} showsVerticalScrollIndicator={false}>
            {/* Tipo de Endereço */}
            <Text style={estilos.label}>Tipo de Endereço</Text>
            <View style={estilos.containerTipos}>
              {(['RESIDENCIAL', 'COMERCIAL', 'OUTRO'] as TipoEndereco[]).map((tipoOpcao) => (
                <TouchableOpacity
                  key={tipoOpcao}
                  style={[
                    estilos.chipTipo,
                    tipo === tipoOpcao && estilos.chipTipoAtivo,
                  ]}
                  onPress={() => setTipo(tipoOpcao)}
                >
                  <Text
                    style={[
                      estilos.textoChipTipo,
                      tipo === tipoOpcao && estilos.textoChipTipoAtivo,
                    ]}
                  >
                    {tipoOpcao.charAt(0) + tipoOpcao.slice(1).toLowerCase()}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* CEP */}
            <Text style={estilos.label}>CEP *</Text>
            <View style={estilos.containerCep}>
              <TextInput
                style={[estilos.input, estilos.inputCep]}
                placeholder="00000-000"
                placeholderTextColor={temaMedico.cores.textoClaro}
                value={cep}
                onChangeText={(text) => setCep(formatarCep(text))}
                keyboardType="numeric"
                maxLength={9}
              />
              <TouchableOpacity
                style={estilos.botaoBuscarCep}
                onPress={handleBuscarCep}
                disabled={buscandoCep}
              >
                {buscandoCep ? (
                  <ActivityIndicator size="small" color={temaMedico.cores.textoBranco} />
                ) : (
                  <Text style={estilos.textoBotaoBuscarCep}>Buscar</Text>
                )}
              </TouchableOpacity>
            </View>

            {/* Logradouro */}
            <Text style={estilos.label}>Logradouro (Rua/Avenida) *</Text>
            <TextInput
              style={estilos.input}
              placeholder="Rua das Flores"
              placeholderTextColor={temaMedico.cores.textoClaro}
              value={logradouro}
              onChangeText={setLogradouro}
            />

            {/* Número e Complemento */}
            <View style={estilos.containerDuplo}>
              <View style={estilos.campoDuplo}>
                <Text style={estilos.label}>Número *</Text>
                <TextInput
                  style={estilos.input}
                  placeholder="123"
                  placeholderTextColor={temaMedico.cores.textoClaro}
                  value={numero}
                  onChangeText={setNumero}
                  keyboardType="numeric"
                />
              </View>

              <View style={estilos.campoDuplo}>
                <Text style={estilos.label}>Complemento</Text>
                <TextInput
                  style={estilos.input}
                  placeholder="Apto 45"
                  placeholderTextColor={temaMedico.cores.textoClaro}
                  value={complemento}
                  onChangeText={setComplemento}
                />
              </View>
            </View>

            {/* Bairro */}
            <Text style={estilos.label}>Bairro *</Text>
            <TextInput
              style={estilos.input}
              placeholder="Centro"
              placeholderTextColor={temaMedico.cores.textoClaro}
              value={bairro}
              onChangeText={setBairro}
            />

            {/* Cidade e Estado */}
            <View style={estilos.containerDuplo}>
              <View style={[estilos.campoDuplo, { flex: 2 }]}>
                <Text style={estilos.label}>Cidade *</Text>
                <TextInput
                  style={estilos.input}
                  placeholder="São Paulo"
                  placeholderTextColor={temaMedico.cores.textoClaro}
                  value={cidade}
                  onChangeText={setCidade}
                />
              </View>

              <View style={estilos.campoDuplo}>
                <Text style={estilos.label}>Estado *</Text>
                <TextInput
                  style={estilos.input}
                  placeholder="SP"
                  placeholderTextColor={temaMedico.cores.textoClaro}
                  value={estado}
                  onChangeText={(text) => setEstado(text.toUpperCase())}
                  maxLength={2}
                  autoCapitalize="characters"
                />
              </View>
            </View>

            <View style={{ height: 20 }} />
          </ScrollView>

          {/* Footer */}
          <View style={estilos.footer}>
            <TouchableOpacity
              style={estilos.botaoCancelar}
              onPress={onFechar}
              disabled={salvando}
            >
              <Text style={estilos.textoBotaoCancelar}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[estilos.botaoSalvar, salvando && estilos.botaoSalvarDesabilitado]}
              onPress={handleSalvar}
              disabled={salvando}
            >
              {salvando ? (
                <ActivityIndicator size="small" color={temaMedico.cores.textoBranco} />
              ) : (
                <Text style={estilos.textoBotaoSalvar}>
                  {enderecoEditando ? 'Atualizar' : 'Salvar'}
                </Text>
              )}
            </TouchableOpacity>
          </View>
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
    maxHeight: '90%',
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
  label: {
    fontSize: temaMedico.fontes.tamanhos.sm,
    fontWeight: temaMedico.fontes.pesos.semibold,
    color: temaMedico.cores.textoSubtitulo,
    marginBottom: 8,
  },
  containerTipos: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  chipTipo: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: temaMedico.cores.borda,
    backgroundColor: temaMedico.cores.background,
  },
  chipTipoAtivo: {
    borderColor: temaMedico.cores.primaria,
    backgroundColor: temaMedico.cores.primaria + '15',
  },
  textoChipTipo: {
    fontSize: temaMedico.fontes.tamanhos.sm,
    color: temaMedico.cores.textoSubtitulo,
  },
  textoChipTipoAtivo: {
    color: temaMedico.cores.primaria,
    fontWeight: temaMedico.fontes.pesos.semibold,
  },
  containerCep: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  input: {
    height: 48,
    backgroundColor: temaMedico.cores.background,
    borderRadius: temaMedico.bordas.media,
    paddingHorizontal: 16,
    fontSize: temaMedico.fontes.tamanhos.md,
    color: temaMedico.cores.textoTitulo,
    borderWidth: 1,
    borderColor: temaMedico.cores.borda,
    marginBottom: 20,
  },
  inputCep: {
    flex: 1,
    marginBottom: 0,
  },
  botaoBuscarCep: {
    paddingHorizontal: 20,
    backgroundColor: temaMedico.cores.primaria,
    borderRadius: temaMedico.bordas.media,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 80,
  },
  textoBotaoBuscarCep: {
    color: temaMedico.cores.textoBranco,
    fontSize: temaMedico.fontes.tamanhos.sm,
    fontWeight: temaMedico.fontes.pesos.semibold,
  },
  containerDuplo: {
    flexDirection: 'row',
    gap: 12,
  },
  campoDuplo: {
    flex: 1,
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
  botaoSalvar: {
    flex: 1,
    height: 50,
    borderRadius: temaMedico.bordas.media,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: temaMedico.cores.primaria,
  },
  botaoSalvarDesabilitado: {
    opacity: 0.6,
  },
  textoBotaoSalvar: {
    fontSize: temaMedico.fontes.tamanhos.md,
    fontWeight: temaMedico.fontes.pesos.semibold,
    color: temaMedico.cores.textoBranco,
  },
});
