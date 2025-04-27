import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Image, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../src/services/firebaseConfig'; 

export default function CadastroUsuario() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [faculdade, setFaculdade] = useState('');
  const [senha, setSenha] = useState('');
  const router = useRouter();

  const validarEmail = (email: string) => {
    const regex = /\S+@\S+\.\S+/;
    return regex.test(email);
  };

  const handleCadastro = async () => {
    if (!nome || !email || !faculdade || !senha) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }

    if (!validarEmail(email)) {
      Alert.alert('Erro', 'Por favor, insira um e-mail válido.');
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, senha);
      Alert.alert('Cadastro realizado', 'Sua conta foi criada com sucesso!');
      router.replace('/login');
    } catch (error: any) {
      console.error('Erro ao cadastrar:', error);
      let mensagem = 'Erro ao cadastrar. Tente novamente.';
      
      if (error.code === 'auth/email-already-in-use') {
        mensagem = 'Este e-mail já está em uso.';
      } else if (error.code === 'auth/invalid-email') {
        mensagem = 'E-mail inválido.';
      } else if (error.code === 'auth/weak-password') {
        mensagem = 'A senha precisa ter pelo menos 6 caracteres.';
      }
      
      Alert.alert('Erro', mensagem);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      className="flex-1 bg-[#003867]"
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <View className="flex-1 justify-center px-8 py-4">

          {/* Logo */}
          <View className="items-center mb-6">
            <Image
              source={require('../assets/logo-uniteca.png')}
              className="w-48 h-48"
              resizeMode="contain"
            />
          </View>

          {/* Inputs */}
          <Text className="text-white mb-1 ml-1">Nome Completo</Text>
          <TextInput
            className="bg-white rounded-lg p-3 mb-4"
            placeholder="Digite seu nome"
            value={nome}
            onChangeText={setNome}
          />

          <Text className="text-white mb-1 ml-1">Email</Text>
          <TextInput
            className="bg-white rounded-lg p-3 mb-4"
            placeholder="Digite seu email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text className="text-white mb-1 ml-1">Faculdade</Text>
          <TextInput
            className="bg-white rounded-lg p-3 mb-4"
            placeholder="Digite sua faculdade"
            value={faculdade}
            onChangeText={setFaculdade}
          />

          <Text className="text-white mb-1 ml-1">Senha</Text>
          <TextInput
            className="bg-white rounded-lg p-3 mb-6"
            placeholder="Crie uma senha"
            value={senha}
            onChangeText={setSenha}
            secureTextEntry
          />

          {/* Botão de cadastro */}
          <TouchableOpacity
            onPress={handleCadastro}
            className="bg-[#005BBB] rounded-lg py-3 items-center"
          >
            <Text className="text-white text-base font-semibold">Cadastrar</Text>
          </TouchableOpacity>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
