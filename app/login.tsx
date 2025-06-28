import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Image, KeyboardAvoidingView, ScrollView, Platform, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../services/firebaseConfig';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Estado para controle do carregamento
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Erro de login', 'Por favor, preencha e-mail e senha.');
      return;
    }

    setIsLoading(true); // Ativa o loading

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.replace('/home');
    } catch (error: any) {
      console.error("Erro de login do Firebase:", error.message);
      
      let errorMessage = 'Erro ao fazer login. Verifique suas credenciais.';

      if (error.code === 'auth/invalid-email') {
        errorMessage = 'E-mail inválido.';
      } else if (error.code === 'auth/user-not-found') {
        errorMessage = 'Usuário não encontrado.';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Senha incorreta.';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Muitas tentativas. Tente novamente mais tarde.';
      }

      Alert.alert('Erro de login', errorMessage);
    } finally {
      setIsLoading(false); // Desativa o loading após a tentativa de login
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      className="flex-1" 
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }} 
        className={`bg-[#003867] ${isLoading ? 'px-8' : 'px-8'}`}
      >
        {/* Logo */}
        <View className="items-center mb-2">
          <Image
            source={require('../assets/images/logo-uniteca.png')}
            style={{ width: 256, height: 256 }} 
            resizeMode="contain"
          />
        </View>

        {/* Input de e-mail */}
        <Text className="text-white mb-1 ml-1">E-mail</Text>
        <TextInput
          className="bg-white rounded-lg p-3 mb-4"
          placeholder="Digite seu e-mail"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        {/* Input de senha */}
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

         {isLoading && (
          <View className='z-40 absolute top-0 left-0 right-0 bottom-0 justify-center item-center'>
            <ActivityIndicator size={'large'} color={'#FFFFFF'} />
          </View>
        )} 
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
