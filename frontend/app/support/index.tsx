/**
 * Support Screen - Nova Arquitetura
 */

import React, { useState, useCallback } from 'react';
import { View, ScrollView, Text, TouchableOpacity, TextInput, StyleSheet, Alert } from 'react-native';
import { Stack, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { temaMedico } from '@/src/estilos/temaMedico';

export default function SupportScreen() {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleBack = useCallback(() => router.back(), []);
  const handleSubmit = useCallback(() => {
    if (!subject.trim() || !message.trim()) {
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }
    Alert.alert('Sucesso', 'Mensagem enviada! Entraremos em contato em breve.');
    setSubject('');
    setMessage('');
  }, [subject, message]);

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack}>
            <Ionicons name="arrow-back" size={24} color={temaMedico.cores.textoTitulo} />
          </TouchableOpacity>
          <Text style={styles.title}>Suporte</Text>
          <View style={{ width: 24 }} />
        </View>
        <ScrollView style={styles.content}>
          <Text style={styles.label}>Assunto</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite o assunto"
            value={subject}
            onChangeText={setSubject}
          />
          <Text style={styles.label}>Mensagem</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Descreva seu problema ou dúvida"
            value={message}
            onChangeText={setMessage}
            multiline
            numberOfLines={6}
            textAlignVertical="top"
          />
          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Enviar Mensagem</Text>
          </TouchableOpacity>
          <View style={styles.contactInfo}>
            <Text style={styles.contactTitle}>Outros canais de atendimento:</Text>
            <View style={styles.contactItem}>
              <Ionicons name="mail-outline" size={20} color={temaMedico.cores.primaria} />
              <Text style={styles.contactText}>suporte@esculapi.com.br</Text>
            </View>
            <View style={styles.contactItem}>
              <Ionicons name="call-outline" size={20} color={temaMedico.cores.primaria} />
              <Text style={styles.contactText}>(11) 1234-5678</Text>
            </View>
          </View>
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: temaMedico.cores.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: temaMedico.cores.backgroundCard,
    borderBottomWidth: 1,
    borderBottomColor: temaMedico.cores.borda,
  },
  title: { fontSize: 20, fontWeight: '700', color: temaMedico.cores.textoTitulo },
  content: { flex: 1, padding: 16 },
  label: { fontSize: 14, fontWeight: '600', color: temaMedico.cores.textoTitulo, marginBottom: 8 },
  input: {
    backgroundColor: temaMedico.cores.backgroundCard,
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    color: temaMedico.cores.textoTitulo,
    marginBottom: 16,
  },
  textArea: { height: 120 },
  button: {
    backgroundColor: temaMedico.cores.primaria,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 24,
  },
  buttonText: { fontSize: 16, fontWeight: '600', color: '#FFF' },
  contactInfo: { marginTop: 16 },
  contactTitle: { fontSize: 16, fontWeight: '600', color: temaMedico.cores.textoTitulo, marginBottom: 12 },
  contactItem: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  contactText: { fontSize: 15, color: temaMedico.cores.textoSubtitulo },
});
