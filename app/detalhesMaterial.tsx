// app/detalhesMaterial.tsx
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function DetalhesMaterial() {
  const router = useRouter();
  const {
    titulo = 'Título Desconhecido',
    autor = 'Autor não informado',
    categoria = 'Outro',
  } = useLocalSearchParams();

  const handleAlugar = () => {
    router.push('/aluguelDevolucao');
  };

  return (
    <View className="flex-1 bg-[#003867] px-6 pt-16">
      <TouchableOpacity onPress={() => router.back()} className="mb-4">
        <Ionicons name="arrow-back" size={28} color="white" />
      </TouchableOpacity>

      <Text className="mb-2 text-3xl font-bold text-white">{titulo}</Text>
      <Text className="mb-2 text-lg text-white">Autor: {autor}</Text>
      <Text className="mb-8 text-lg text-white">Categoria: {categoria}</Text>

      <TouchableOpacity
        onPress={handleAlugar}
        className="items-center rounded-xl bg-white py-4"
      >
        <Text className="text-base font-bold text-[#003867]">
          📚 Alugar este material
        </Text>
      </TouchableOpacity>
    </View>
  );
}
