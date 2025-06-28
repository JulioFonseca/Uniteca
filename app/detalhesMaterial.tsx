import { useLocalSearchParams, useRouter } from 'expo-router';
import { Image, Text, TouchableOpacity, View, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { db, auth } from '../services/firebaseConfig';
import { collection, addDoc, serverTimestamp, doc, updateDoc } from 'firebase/firestore';
import { useState } from 'react';

export default function DetalhesMaterial() {
  const router = useRouter();
  const {
    titulo = 'Título Desconhecido',
    autor = 'Autor não informado',
    categoria = 'Outro',
    imagemUrl,
    materialId,
    disponivel,
  } = useLocalSearchParams();

  const [loading, setLoading] = useState(false);

  const handleAlugar = async () => {
    const user = auth.currentUser;

    if (!user) {
      Alert.alert('Erro', 'Você precisa estar logado para alugar um material.');
      return;
    }

    if (disponivel !== 'true') {
      Alert.alert('Indisponível', 'Este material já está alugado.');
      return;
    }

    try {
      setLoading(true);

      // 1. Criar o registro de aluguel
      await addDoc(collection(db, 'alugueis'), {
        usuarioId: user.uid,
        materialId: materialId,
        status: 'alugado',
        dataAluguel: serverTimestamp(),
        dataDevolucao: null,
      });

      // 2. Atualizar o status do material (disponível = false)
      await updateDoc(doc(db, 'materiais', materialId as string), {
        disponivel: false,
      });

      setLoading(false);
      Alert.alert('Sucesso', 'Material alugado com sucesso!');
      router.back();

    } catch (error) {
      console.error('Erro ao alugar material:', error);
      setLoading(false);
      Alert.alert('Erro', 'Não foi possível realizar o aluguel.');
    }
  };

  return (
    <View className="flex-1 bg-[#003867] px-6 pt-16">
      {/* Botão de voltar */}
      {/* <TouchableOpacity onPress={() => router.back()} className="mb-4">
        <Ionicons name="arrow-back" size={28} color="white" />
      </TouchableOpacity> */}

      <View className="mb-8 mt-4 flex-row items-center justify-between">
        {/* Botão de voltar */}
        <TouchableOpacity onPress={() => router.back()} className="mb-0 bg-red">
          <Ionicons name="arrow-back" size={28} color="white" />
        </TouchableOpacity>

        <Text className="flex-1 text-center text-2xl font-bold text-white -ml-6">
          Detalhes de Material
        </Text>
      </View>

      {/* Imagem do Material */}
      {imagemUrl ? (
        <Image
          source={{ uri: imagemUrl as string }}
          style={{ width: '100%', height: 200, borderRadius: 12, marginBottom: 16 }}
          resizeMode="cover"
        />
      ) : (
        <View
          style={{
            width: '100%',
            height: 200,
            borderRadius: 12,
            marginBottom: 16,
            backgroundColor: '#ccc',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text className="text-white">Sem imagem disponível</Text>
        </View>
      )}

      {/* Detalhes */}
      <Text className="mb-2 text-3xl font-bold text-white">{titulo}</Text>
      <Text className="mb-2 text-lg text-white">Autor: {autor}</Text>
      <Text className="mb-8 text-lg text-white">Categoria: {categoria}</Text>

      {/* Loader ou Botão */}
      {loading ? (
        <ActivityIndicator size="large" color="#fff" />
      ) : (
        <TouchableOpacity
          onPress={handleAlugar}
          className={`items-center rounded-xl py-4 ${disponivel !== 'true' ? 'bg-gray-400' : 'bg-white'}`}
          disabled={disponivel !== 'true'}
        >
          <Text className={`text-base font-bold ${disponivel !== 'true' ? 'text-gray-700' : 'text-[#003867]'}`}>
            {disponivel !== 'true' ? 'Indisponível' : '📚 Alugar este material'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
