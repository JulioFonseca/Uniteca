import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
// import { useRouter } from 'expo-router';

export default function CadastroMaterial() {
  // const router = useRouter();

  const [titulo, setTitulo] = useState('');
  const [autor, setAutor] = useState('');
  const [categoria, setCategoria] = useState('Livro');
  const [imagemUri, setImagemUri] = useState<string | null>(null);

  const categorias = ['Livro', 'Apostila', 'Revista', 'Artigo', 'Outro'];

  const handleCadastro = () => {
    if (!titulo || !autor || !imagemUri) {
      Alert.alert('Erro', 'Preencha todos os campos e adicione uma imagem.');
      return;
    }

    // Simulação de envio
    Alert.alert('Sucesso', 'Material cadastrado com sucesso!');
    setTitulo('');
    setAutor('');
    setCategoria('Livro');
    setImagemUri(null);
  };

  const tirarFoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão negada', 'É necessário permitir o uso da câmera.');
      return;
    }

    const resultado = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [3, 4],
      quality: 0.7,
    });

    if (!resultado.canceled) {
      if (resultado.assets && resultado.assets[0]?.uri) {
        setImagemUri(resultado.assets[0].uri);
      }
    }
  };

  const escolherDaGaleria = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permissão negada',
        'É necessário permitir o acesso à galeria.',
      );
      return;
    }

    const resultado = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [3, 4],
      quality: 0.7,
    });

    if (!resultado.canceled) {
      if (resultado.assets && resultado.assets[0]?.uri) {
        setImagemUri(resultado.assets[0].uri);
      }
    }
  };

  return (
    <ScrollView className="flex-1 bg-[#003867] px-6 pt-16">
      <Text className="mb-6 text-2xl font-bold text-white">
        Cadastrar Material
      </Text>

      <Text className="mb-2 text-white">Título</Text>
      <TextInput
        className="mb-4 rounded-xl bg-white px-4 py-3"
        placeholder="Digite o título"
        value={titulo}
        onChangeText={setTitulo}
      />

      <Text className="mb-2 text-white">Autor</Text>
      <TextInput
        className="mb-4 rounded-xl bg-white px-4 py-3"
        placeholder="Digite o autor"
        value={autor}
        onChangeText={setAutor}
      />

      <Text className="mb-2 text-white">Categoria</Text>
      <View className="mb-6 rounded-xl bg-white">
        <Picker
          selectedValue={categoria}
          onValueChange={(itemValue) => setCategoria(itemValue)}
        >
          {categorias.map((cat) => (
            <Picker.Item label={cat} value={cat} key={cat} />
          ))}
        </Picker>
      </View>

      <Text className="mb-2 text-white">Imagem do Material</Text>
      {imagemUri && (
        <Image
          source={{ uri: imagemUri }}
          className="mb-4 h-56 w-full rounded-xl"
          resizeMode="cover"
        />
      )}

      <View className="mb-6 flex-row justify-between">
        <TouchableOpacity
          onPress={tirarFoto}
          className="mr-2 flex-1 rounded-xl bg-blue-700 px-4 py-3"
        >
          <Text className="text-center font-semibold text-white">
            Tirar Foto
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={escolherDaGaleria}
          className="ml-2 flex-1 rounded-xl bg-blue-500 px-4 py-3"
        >
          <Text className="text-center font-semibold text-white">Galeria</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        className="rounded-xl bg-green-600 py-4"
        onPress={handleCadastro}
      >
        <Text className="text-center text-base font-semibold text-white">
          Cadastrar Material
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
