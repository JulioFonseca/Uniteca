// app/perfilUsuario.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useRouter } from 'expo-router';

export default function PerfilUsuario() {
  const router = useRouter();

  const [nome, setNome] = useState('Julio Cesar');
  const [faculdade, setFaculdade] = useState('Unichristus');
  const [fotoPerfil, setFotoPerfil] = useState<string | null>(null);
  const [editando, setEditando] = useState(false);

  const livrosEmprestados = [
    { titulo: 'Clean Code', autor: 'Robert C. Martin' },
    { titulo: 'React Native em Ação', autor: 'Nader Dabit' },
  ];

  const escolherFoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      if (result.assets && result.assets[0]?.uri) {
        setFotoPerfil(result.assets[0].uri);
      }
    }
  };

  const salvarEdicao = () => {
    setEditando(false);
  };

  return (
    <ScrollView className="flex-1 bg-[#003867] px-6 pt-16">
      {/* Botão de voltar */}
      <TouchableOpacity onPress={() => router.back()} className="mb-6">
        <Ionicons name="arrow-back" size={28} color="white" />
      </TouchableOpacity>

      {/* Foto de perfil */}
      <TouchableOpacity onPress={escolherFoto} className="self-center mb-6">
        {fotoPerfil ? (
          <Image
            source={{ uri: fotoPerfil }}
            className="h-32 w-32 rounded-full"
          />
        ) : (
          <View className="h-32 w-32 rounded-full bg-white justify-center items-center">
            <Ionicons name="camera" size={40} color="#003867" />
          </View>
        )}
      </TouchableOpacity>

      {/* Nome do usuário */}
      <Text className="text-white mb-2">Nome</Text>
      <TextInput
        className="bg-white rounded-xl px-4 py-3 mb-4"
        value={nome}
        onChangeText={setNome}
        editable={editando}
      />

      {/* Faculdade */}
      <Text className="text-white mb-2">Faculdade</Text>
      <TextInput
        className="bg-white rounded-xl px-4 py-3 mb-6"
        value={faculdade}
        onChangeText={setFaculdade}
        editable={editando}
      />

      {/* Botão de Editar ou Salvar */}
      <TouchableOpacity
        onPress={editando ? salvarEdicao : () => setEditando(true)}
        className="bg-white py-4 rounded-xl mb-8"
      >
        <Text className="text-[#003867] text-center font-bold text-base">
          {editando ? '💾 Salvar' : '✏️ Editar Perfil'}
        </Text>
      </TouchableOpacity>

      {/* Livros emprestados */}
      <Text className="text-white text-xl font-bold mb-4">📚 Livros Emprestados</Text>

      {livrosEmprestados.map((livro, index) => (
        <View key={index} className="mb-4 bg-white rounded-xl p-4">
          <Text className="text-[#003867] font-bold">{livro.titulo}</Text>
          <Text className="text-gray-500">Autor: {livro.autor}</Text>
        </View>
      ))}
    </ScrollView>
  );
}
