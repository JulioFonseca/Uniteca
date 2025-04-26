import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../src/services/firebaseConfig'; // Ajuste o caminho conforme necessário

//const auth = getAuth(auth); // Obtenha a instância de auth a partir do seu app Firebase


export default function Login() {
  // Renomeado de 'username' para 'email' para melhor clareza com autenticação Firebase
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    // Validação básica para garantir que os campos não estão vazios
    if (!email || !password) {
      Alert.alert('Erro de login', 'Por favor, preencha e-mail e senha.');
      return;
    }

    try {
      // Tenta fazer login com e-mail e senha usando Firebase Authentication
      await signInWithEmailAndPassword(auth, email, password);
      // Se o login for bem-sucedido, navega para a Home
      router.replace('/home');
    } catch (error) {
      // Se ocorrer um erro, exibe um alerta com a mensagem de erro do Firebase
      //console.error("Erro de login do Firebase:", error.message);
      let errorMessage = 'Ocorreu um erro ao fazer login. Tente novamente.';

      // Mensagens de erro comuns do Firebase (você pode adicionar mais conforme necessário)
    

      Alert.alert('Erro de login', errorMessage);
    }
  };

  return (
    <View className="flex-1 bg-[#003867] justify-center px-8">
      {/* Logo */}
      <View className="items-center mb-2">
        <Image
          source={require('../assets/logo-uniteca.png')}
          className="w-64 h-64"
          resizeMode="contain"
        />
      </View>

      {/* Input e-mail */}
      {/* Alterado o label e placeholder para refletir que é e-mail */}
      <Text className="text-white mb-1 ml-1">E-mail</Text>
      <TextInput
        className="bg-white rounded-lg p-3 mb-4"
        placeholder="Digite seu e-mail"
        value={email}
        onChangeText={setEmail} // Atualiza o estado 'email'
        keyboardType="email-address" // Sugere teclado de e-mail
        autoCapitalize="none" // Desativa capitalização automática
      />

      {/* Input senha */}
      <Text className="text-white mb-1 ml-1">Senha</Text>
      <TextInput
        className="bg-white rounded-lg p-3 mb-6"
        placeholder="Digite sua senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {/* Botão de login */}
      <TouchableOpacity
        onPress={handleLogin}
        className="bg-blue-600 rounded-lg py-3 items-center"
      >
        <Text className="text-white text-base font-semibold">Entrar</Text>
      </TouchableOpacity>

      {/* Link para cadastro */}
      <TouchableOpacity
        onPress={() => router.push('/cadastroUsuario')}
        className="mt-4 items-center"
      >
        <Text className="text-white underline">Não tem conta? Cadastre-se</Text>
      </TouchableOpacity>
    </View>
  );
}