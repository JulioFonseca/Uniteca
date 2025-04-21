import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Image } from 'react-native';
import { useRouter } from 'expo-router';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = () => {
    if (username === 'admin' && password === '1234') {
      router.replace('/home'); // navega para a Home
    } else {
      Alert.alert('Erro de login', 'Usuário ou senha incorretos.');
    }
  };

  return (
    <View className="flex-1 bg-[#003867] justify-center px-8">
      {/* Logo */}
      <View className="items-center mb-2">
        <Image
          source={require('../assets/logo-uniteca.png')} // coloque seu logo em assets/logo.png
          className="w-64 h-64"
          resizeMode="contain"
        />
      {/*<Text className="text-white text-2xl font-bold mt-4">Bem-vindo ao Unitecaa</Text>*/}
      </View>

      {/* Input usuário */}
      <Text className="text-white mb-1 ml-1">Usuário</Text>
      <TextInput
        className="bg-white rounded-lg p-3 mb-4"
        placeholder="Digite seu usuário"
        value={username}
        onChangeText={setUsername}
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
    </View>
  );
}
