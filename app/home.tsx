import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function Home() {
  const [activeTab, setActiveTab] = useState<
    'materiais' | 'devolucoes' | 'perfil'
  >('materiais');
  const router = useRouter();

  return (
    <View className="flex-1 bg-[#003867] pt-16">
      {/* Conteúdo Scrollável */}
      <ScrollView className="mb-28 px-6">
        <View className="mb-6">
          <Text className="text-3xl font-bold text-white">Olá, Julio! 👋</Text>
          <Text className="mt-1 text-lg text-white">
            Você está na biblioteca Uniteca
          </Text>
        </View>

        <View className="mb-6 rounded-xl bg-white px-4 py-3">
          <Text className="text-gray-400">🔍 Buscar por título ou autor</Text>
        </View>

        <Text className="mb-3 text-xl font-semibold text-white">
          Recomendações
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mb-6"
        >
          {[1, 2, 3].map((item) => (
            <View
              key={item}
              className="mr-4 h-48 w-32 justify-end rounded-lg bg-blue-500 p-2"
            >
              <Text className="font-bold text-white">Livro {item}</Text>
            </View>
          ))}
        </ScrollView>

        <Text className="mb-3 text-xl font-semibold text-white">
          Mais vendidos
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {[1, 2, 3].map((item) => (
            <View
              key={item}
              className="mr-4 h-48 w-32 justify-end rounded-lg bg-blue-700 p-2"
            >
              <Text className="font-bold text-white">Popular {item}</Text>
            </View>
          ))}
        </ScrollView>

        {/* Botão de Cadastrar Material */}
        <TouchableOpacity
          onPress={() => router.push('/cadastroMaterial')}
          className="mt-6 rounded-xl bg-white p-4"
        >
          <Text className="text-center text-base font-bold text-[#003867]">
            ➕ Cadastrar novo material
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Tab bar fixa com ícones e destaque do ativo */}
      <View className="absolute inset-x-0 bottom-0 flex-row items-center justify-between rounded-t-3xl bg-white px-4 py-3 shadow-lg">
        <TouchableOpacity
          onPress={() => setActiveTab('materiais')}
          className="flex-1 items-center"
        >
          <Ionicons
            name="book"
            size={24}
            color={activeTab === 'materiais' ? '#003867' : '#888'}
          />
          <Text
            className={`mt-1 text-sm ${
              activeTab === 'materiais'
                ? 'font-bold text-[#003867]'
                : 'text-gray-500'
            }`}
          >
            Materiais
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveTab('devolucoes')}
          className="flex-1 items-center"
        >
          <Ionicons
            name="refresh"
            size={24}
            color={activeTab === 'devolucoes' ? '#003867' : '#888'}
          />
          <Text
            className={`mt-1 text-sm ${
              activeTab === 'devolucoes'
                ? 'font-bold text-[#003867]'
                : 'text-gray-500'
            }`}
          >
            Devoluções
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveTab('perfil')}
          className="flex-1 items-center"
        >
          <Ionicons
            name="person"
            size={24}
            color={activeTab === 'perfil' ? '#003867' : '#888'}
          />
          <Text
            className={`mt-1 text-sm ${
              activeTab === 'perfil'
                ? 'font-bold text-[#003867]'
                : 'text-gray-500'
            }`}
          >
            Perfil
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
