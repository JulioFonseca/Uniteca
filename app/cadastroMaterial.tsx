import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import {
  Alert,
  Image,
  Modal,
  Pressable,
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
  const [modalVisible, setModalVisible] = useState(false);

  const categorias = ['Livro', 'Apostila', 'Revista', 'Artigo', 'Outro'];

  const handleCadastro = () => {
    if (!titulo || !autor || !imagemUri) {
      Alert.alert('Erro', 'Preencha todos os campos e adicione uma imagem.');
      return;
    }

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
    <ScrollView className="flex-1 bg-[#003867] px-6 pb-10 pt-16">
      <Text className="mb-8 text-center text-3xl font-bold text-white">
        Cadastro de Material
      </Text>
      <Text className="mb-2 text-sm text-white">Título</Text>
      <TextInput
        className="mb-4 rounded-2xl bg-white px-4 py-3 text-base"
        placeholder="Digite o título"
        value={titulo}
        onChangeText={setTitulo}
      />

      <Text className="mb-2 text-sm text-white">Autor</Text>
      <TextInput
        className="mb-4 rounded-2xl bg-white px-4 py-3 text-base"
        placeholder="Digite o autor"
        value={autor}
        onChangeText={setAutor}
      />

      <Text className="mb-2 text-sm text-white">Categoria</Text>
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        className="mb-6 rounded-2xl bg-white px-4 py-3"
      >
        <Text className="text-base text-gray-700">{categoria}</Text>
      </TouchableOpacity>

      {/* Modal de Categorias */}
      <Modal transparent animationType="slide" visible={modalVisible}>
        <View className="flex-1 justify-end bg-black/40">
          <View className="rounded-t-2xl bg-white p-6">
            <Text className="mb-4 text-center text-lg font-bold">
              Escolha a Categoria
            </Text>
            {categorias.map((cat) => (
              <Pressable
                key={cat}
                onPress={() => {
                  setCategoria(cat);
                  setModalVisible(false);
                }}
                className="border-b border-gray-200 py-3"
              >
                <Text className="text-center text-base">{cat}</Text>
              </Pressable>
            ))}
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              className="mt-4"
            >
              <Text className="text-center text-base font-semibold text-blue-600">
                Cancelar
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Text className="mb-2 text-sm text-white">Imagem do Material</Text>
      {imagemUri ? (
        <Image
          source={{ uri: imagemUri }}
          className="mb-4 h-60 w-full rounded-2xl shadow-md"
          resizeMode="cover"
        />
      ) : (
        <View className="mb-4 flex h-60 items-center justify-center rounded-2xl border border-dashed border-white bg-white/10">
          <Text className="text-sm text-white">Nenhuma imagem selecionada</Text>
        </View>
      )}

      <View className="mb-6 flex-row justify-between">
        <TouchableOpacity
          onPress={tirarFoto}
          className="mr-2 flex-1 rounded-xl bg-blue-600 px-4 py-3"
        >
          <Text className="text-center font-semibold text-white">
            Tirar Foto
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={escolherDaGaleria}
          className="ml-2 flex-1 rounded-xl bg-blue-400 px-4 py-3"
        >
          <Text className="text-center font-semibold text-white">Galeria</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        className="rounded-2xl bg-green-600 py-4"
        onPress={handleCadastro}
      >
        <Text className="text-center text-base font-bold text-white">
          Cadastrar Material
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
