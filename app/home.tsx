import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function Home() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-blue-900 px-6 pt-16">
      {/* Header de boas-vindas */}
      <Text className="text-white text-3xl font-bold mb-4">Olá, bem-vindo 👋</Text>
      <Text className="text-white text-lg mb-10">Você está na biblioteca Uniteca</Text>

      {/* Painel de ações */}
      <View className="space-y-4">
        <TouchableOpacity
          className="bg-blue-600 py-4 px-6 rounded-xl"
          onPress={() => alert('Funcionalidade em desenvolvimento')}
        >
          <Text className="text-white text-base font-semibold text-center">
            Ver materiais disponíveis
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-white py-4 px-6 rounded-xl"
          onPress={() => alert('Funcionalidade em desenvolvimento')}
        >
          <Text className="text-blue-800 text-base font-semibold text-center">
            Devolver material
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-blue-800 py-4 px-6 rounded-xl"
          onPress={() => alert('Funcionalidade em desenvolvimento')}
        >
          <Text className="text-white text-base font-semibold text-center">
            Perfil do usuário
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
