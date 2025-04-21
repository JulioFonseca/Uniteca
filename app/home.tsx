import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'materiais' | 'devolucoes' | 'perfil'>('materiais');

  return (
    <View className="flex-1 bg-[#003867] pt-16">
      {/* Conteúdo Scrollável */}
      <ScrollView className="px-6 mb-28">
        <View className="mb-6">
          <Text className="text-white text-3xl font-bold">Olá, Julio! 👋</Text>
          <Text className="text-white text-lg mt-1">Você está na biblioteca Uniteca</Text>
        </View>

        <View className="bg-white rounded-xl px-4 py-3 mb-6">
          <Text className="text-gray-400">🔍 Buscar por título ou autor</Text>
        </View>

        <Text className="text-white text-xl font-semibold mb-3">Recomendações</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-6">
          {[1, 2, 3].map((item) => (
            <View
              key={item}
              className="w-32 h-48 bg-blue-500 mr-4 rounded-lg justify-end p-2"
            >
              <Text className="text-white font-bold">Livro {item}</Text>
            </View>
          ))}
        </ScrollView>

        <Text className="text-white text-xl font-semibold mb-3">Mais vendidos</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {[1, 2, 3].map((item) => (
            <View
              key={item}
              className="w-32 h-48 bg-blue-700 mr-4 rounded-lg justify-end p-2"
            >
              <Text className="text-white font-bold">Popular {item}</Text>
            </View>
          ))}
        </ScrollView>
      </ScrollView>

      {/* Tab bar fixa com ícones e destaque do ativo */}
      <View className="absolute bottom-0 left-0 right-0 bg-white py-3 px-4 flex-row justify-between items-center rounded-t-3xl shadow-lg">
        <TouchableOpacity
          onPress={() => setActiveTab('materiais')}
          className="flex-1 items-center"
        >
          <Ionicons
            name="book"
            size={24}
            color={activeTab === 'materiais' ? '#003867' : '#888'}
          />
          <Text className={`text-sm mt-1 ${activeTab === 'materiais' ? 'text-[#003867] font-bold' : 'text-gray-500'}`}>
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
          <Text className={`text-sm mt-1 ${activeTab === 'devolucoes' ? 'text-[#003867] font-bold' : 'text-gray-500'}`}>
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
          <Text className={`text-sm mt-1 ${activeTab === 'perfil' ? 'text-[#003867] font-bold' : 'text-gray-500'}`}>
            Perfil
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
