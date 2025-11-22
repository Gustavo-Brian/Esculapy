/**
 * Tela: Cadastrar Farmacêutico - Esculapi
 * Permite que o dono da farmácia (ROLE_LOJISTA_ADMIN) cadastre farmacêuticos
 * Arquitetura: OOP + Português
 */

import { ScrollView, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Text, View } from '@/src/componentes/Themed';
import { ProtectedFarmaciaRoute } from '@/src/componentes/ProtectedFarmaciaRoute';
import { useCadastroFarmaceutico } from '../../hooks/useCadastroFarmaceutico';
import { temaMedico } from '@/src/estilos/temaMedico';

export default function TelaCadastrarFarmaceutico() {
  const { carregando, mostrarSenha, dadosFormulario, erros, manipuladores } = useCadastroFarmaceutico();

  return (
    <ProtectedFarmaciaRoute>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={estilos.pagina}>
        {/* Cabeçalho */}
        <View style={estilos.cabecalho}>
          <TouchableOpacity style={estilos.cabecalho__botaoVoltar} onPress={manipuladores.aoVoltar}>
            <Ionicons name="arrow-back" size={24} color={temaMedico.cores.primaria} />
          </TouchableOpacity>
          <Text style={estilos.cabecalho__titulo}>Cadastrar Farmacêutico</Text>
          <View style={estilos.cabecalho__espacador} />
        </View>

        <ScrollView style={estilos.conteudo} showsVerticalScrollIndicator={false}>
          {/* Informações */}
          <View style={estilos.caixaInfo}>
            <Ionicons name="information-circle" size={24} color={temaMedico.cores.sucesso} />
            <Text style={estilos.caixaInfo__texto}>
              Cadastre farmacêuticos para ajudar a gerenciar sua farmácia. Eles poderão validar
              receitas médicas dos pedidos.
            </Text>
          </View>

          {/* Formulário */}
          <View style={estilos.formulario}>
            {/* Nome */}
            <View style={estilos.campo__grupo}>
              <Text style={estilos.campo__rotulo}>
                Nome Completo <Text style={estilos.campo__obrigatorio}>*</Text>
              </Text>
              <TextInput
                style={[estilos.campo, erros.nome && estilos.campo_erro]}
                value={dadosFormulario.nome}
                onChangeText={(text) => manipuladores.aoAlterarCampo('nome', text)}
                placeholder="Ex: João Silva"
                placeholderTextColor={temaMedico.cores.textoClaro}
                editable={!carregando}
                autoCapitalize="words"
              />
              {erros.nome && <Text style={estilos.campo__erro}>{erros.nome}</Text>}
            </View>

            {/* Email */}
            <View style={estilos.campo__grupo}>
              <Text style={estilos.campo__rotulo}>
                Email <Text style={estilos.campo__obrigatorio}>*</Text>
              </Text>
              <TextInput
                style={[estilos.campo, erros.email && estilos.campo_erro]}
                value={dadosFormulario.email}
                onChangeText={(text) => manipuladores.aoAlterarCampo('email', text)}
                placeholder="Ex: joao@exemplo.com"
                placeholderTextColor={temaMedico.cores.textoClaro}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!carregando}
              />
              {erros.email && <Text style={estilos.campo__erro}>{erros.email}</Text>}
            </View>

            {/* Senha */}
            <View style={estilos.campo__grupo}>
              <Text style={estilos.campo__rotulo}>
                Senha <Text style={estilos.campo__obrigatorio}>*</Text>
              </Text>
              <View style={estilos.campo__senhaContainer}>
                <TextInput
                  style={[estilos.campo__senha, erros.senha && estilos.campo_erro]}
                  value={dadosFormulario.senha}
                  onChangeText={(text) => manipuladores.aoAlterarCampo('senha', text)}
                  placeholder="Mínimo 6 caracteres"
                  placeholderTextColor={temaMedico.cores.textoClaro}
                  secureTextEntry={!mostrarSenha}
                  editable={!carregando}
                />
                <TouchableOpacity
                  style={estilos.campo__senhaIcone}
                  onPress={manipuladores.aoAlternarSenha}
                >
                  <Ionicons
                    name={mostrarSenha ? 'eye-off' : 'eye'}
                    size={20}
                    color={temaMedico.cores.textoSubtitulo}
                  />
                </TouchableOpacity>
              </View>
              {erros.senha && <Text style={estilos.campo__erro}>{erros.senha}</Text>}
            </View>

            {/* CPF */}
            <View style={estilos.campo__grupo}>
              <Text style={estilos.campo__rotulo}>
                CPF <Text style={estilos.campo__obrigatorio}>*</Text>
              </Text>
              <TextInput
                style={[estilos.campo, erros.cpf && estilos.campo_erro]}
                value={dadosFormulario.cpf}
                onChangeText={(text) => manipuladores.aoAlterarCampo('cpf', text)}
                placeholder="000.000.000-00"
                placeholderTextColor={temaMedico.cores.textoClaro}
                keyboardType="numeric"
                editable={!carregando}
                maxLength={14}
              />
              {erros.cpf && <Text style={estilos.campo__erro}>{erros.cpf}</Text>}
            </View>

            {/* CRF */}
            <View style={estilos.campo__grupo}>
              <Text style={estilos.campo__rotulo}>
                CRF <Text style={estilos.campo__obrigatorio}>*</Text>
              </Text>
              <TextInput
                style={[estilos.campo, erros.crfP && estilos.campo_erro]}
                value={dadosFormulario.crfP}
                onChangeText={(text) => manipuladores.aoAlterarCampo('crfP', text)}
                placeholder="Ex: CRF-SP 12345"
                placeholderTextColor={temaMedico.cores.textoClaro}
                editable={!carregando}
              />
              {erros.crfP && <Text style={estilos.campo__erro}>{erros.crfP}</Text>}
              <Text style={estilos.campo__ajuda}>
                Número do registro no Conselho Regional de Farmácia
              </Text>
            </View>

            {/* Telefone */}
            <View style={estilos.campo__grupo}>
              <Text style={estilos.campo__rotulo}>
                Telefone <Text style={estilos.campo__obrigatorio}>*</Text>
              </Text>
              <TextInput
                style={[estilos.campo, erros.numeroCelular && estilos.campo_erro]}
                value={dadosFormulario.numeroCelular}
                onChangeText={(text) => manipuladores.aoAlterarCampo('numeroCelular', text)}
                placeholder="(00) 00000-0000"
                placeholderTextColor={temaMedico.cores.textoClaro}
                keyboardType="phone-pad"
                editable={!carregando}
                maxLength={15}
              />
              {erros.numeroCelular && (
                <Text style={estilos.campo__erro}>{erros.numeroCelular}</Text>
              )}
            </View>
          </View>

          {/* Botão de Cadastrar */}
          <TouchableOpacity
            style={[estilos.botao__cadastrar, carregando && estilos.botao__cadastrar_desabilitado]}
            onPress={manipuladores.aoSubmeter}
            disabled={carregando}
          >
            {carregando ? (
              <ActivityIndicator color="#FFF" size="small" />
            ) : (
              <>
                <Ionicons name="person-add" size={20} color="#FFF" style={{ marginRight: 8 }} />
                <Text style={estilos.botao__cadastrarTexto}>Cadastrar Farmacêutico</Text>
              </>
            )}
          </TouchableOpacity>

          {/* Espaço no final */}
          <View style={{ height: 30 }} />
        </ScrollView>
      </View>
    </ProtectedFarmaciaRoute>
  );
}

// Estilos
const estilos = {
  pagina: {
    flex: 1,
    backgroundColor: temaMedico.cores.background,
  },
  cabecalho: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: temaMedico.cores.backgroundCard,
    borderBottomWidth: 1,
    borderBottomColor: temaMedico.cores.borda,
  },
  cabecalho__botaoVoltar: {
    padding: 8,
  },
  cabecalho__titulo: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: temaMedico.cores.textoTitulo,
  },
  cabecalho__espacador: {
    width: 40,
  },
  conteudo: {
    flex: 1,
    padding: 16,
  },
  caixaInfo: {
    flexDirection: 'row' as const,
    backgroundColor: '#ECFDF5',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  caixaInfo__texto: {
    flex: 1,
    fontSize: 14,
    color: temaMedico.cores.sucesso,
    marginLeft: 12,
    lineHeight: 20,
  },
  formulario: {
    backgroundColor: temaMedico.cores.backgroundCard,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: temaMedico.cores.borda,
  },
  campo__grupo: {
    marginBottom: 20,
  },
  campo__rotulo: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: temaMedico.cores.textoTitulo,
    marginBottom: 8,
  },
  campo__obrigatorio: {
    color: temaMedico.cores.erro,
  },
  campo: {
    backgroundColor: temaMedico.cores.backgroundCard,
    borderWidth: 1,
    borderColor: temaMedico.cores.borda,
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
    color: temaMedico.cores.textoTitulo,
  },
  campo_erro: {
    borderColor: temaMedico.cores.erro,
    backgroundColor: '#FEF2F2',
  },
  campo__erro: {
    fontSize: 12,
    color: temaMedico.cores.erro,
    marginTop: 4,
  },
  campo__ajuda: {
    fontSize: 12,
    color: temaMedico.cores.textoSubtitulo,
    marginTop: 4,
  },
  campo__senhaContainer: {
    position: 'relative' as const,
  },
  campo__senha: {
    backgroundColor: temaMedico.cores.backgroundCard,
    borderWidth: 1,
    borderColor: temaMedico.cores.borda,
    borderRadius: 8,
    padding: 14,
    paddingRight: 50,
    fontSize: 16,
    color: temaMedico.cores.textoTitulo,
  },
  campo__senhaIcone: {
    position: 'absolute' as const,
    right: 14,
    top: 14,
    padding: 4,
  },
  botao__cadastrar: {
    flexDirection: 'row' as const,
    backgroundColor: temaMedico.cores.sucesso,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  botao__cadastrar_desabilitado: {
    backgroundColor: temaMedico.cores.textoClaro,
  },
  botao__cadastrarTexto: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: temaMedico.cores.textoBranco,
  },
};
