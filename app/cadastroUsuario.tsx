import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Image } from 'react-native';
import { useRouter } from 'expo-router';

export default function CadastroUsuario() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [faculdade, setFaculdade] = useState('');
  const [senha, setSenha] = useState('');
  const router = useRouter();

  const handleCadastro = () => {
    if (!nome || !email || !faculdade || !senha) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }

    // Aqui futuramente você salva no banco
    //Alert.alert('Cadastro realizado', 'Você já pode fazer login.');
    router.replace('/login'); // volta para login
  };

  return (
    <View className="flex-1 bg-[#003867] justify-center px-8">
      {/* Logo */}
      <View className="items-center mb-2">
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
        className="bg-blue-600 rounded-lg py-3 items-center"
      >
        <Text className="text-white text-base font-semibold">Cadastrar</Text>
      </TouchableOpacity>
    </View>
  );
}
