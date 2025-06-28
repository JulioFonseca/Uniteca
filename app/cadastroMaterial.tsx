import * as ImagePicker from "expo-image-picker";
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
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc } from "firebase/firestore";
import { db, storage, auth } from "../services/firebaseConfig";
import { useNavigation } from "@react-navigation/native";
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';


// import { v4 as uuidv4 } from "uuid"; // para nome único da imagem

export default function CadastroMaterial() {
  const [titulo, setTitulo] = useState("");
  const [autor, setAutor] = useState("");
  const [categoria, setCategoria] = useState("Outro");
  const [imagemUri, setImagemUri] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [carregando, setCarregando] = useState(false);

  const categorias = ["Literatura", "Apostila", "Fantasia", "Artigo", "Programação", "Outro"];

  const navigation = useNavigation();

  const handleCadastro = async () => {
    if (!titulo || !autor || !imagemUri) {
      Alert.alert("Erro", "Preencha todos os campos e adicione uma imagem.");
      return;
    }
    setCarregando(true)
    try {
      // Upload da imagem para o Cloudinary
      const formData = new FormData();
      formData.append('file', {
        uri: imagemUri,
        type: 'image/jpeg',
        name: 'material.jpg',
      } as any); // 'as any' por causa do TS em React Native

      formData.append('upload_preset', 'uniteca_upload'); // seu upload_preset

      const response = await axios.post(
        'https://api.cloudinary.com/v1_1/duhhud3ef/image/upload',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      const imageUrl = response.data.secure_url;

      // Agora salva no Firestore com a URL da imagem
      await addDoc(collection(db, "materiais"), {
        titulo,
        autor,
        categoria,
        imagemUrl: imageUrl,
        disponivel: true,
        usuarioId: auth.currentUser?.uid,
      });
      
      navigation.goBack()
      setCarregando(false);
      Alert.alert("Sucesso", "Material cadastrado com sucesso!");
      setTitulo("");
      setAutor("");
      setCategoria("Livro");
      setImagemUri(null);
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Erro ao cadastrar material.");
    }
  };


  const tirarFoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permissão negada", "É necessário permitir o uso da câmera.");
      return;
    }

    const resultado = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [3, 4],
      quality: 0.7,
    });

    if (!resultado.canceled && resultado.assets[0]?.uri) {
      setImagemUri(resultado.assets[0].uri);
    }
  };

  const escolherDaGaleria = async () => {
    const { status } =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permissão negada", "É necessário permitir o acesso à galeria.");
      return;
    }

    const resultado = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [3, 4],
      quality: 0.7,
    });

    if (!resultado.canceled && resultado.assets[0]?.uri) {
      setImagemUri(resultado.assets[0].uri);
    }
  };

  return (
    <ScrollView className="flex-1 bg-[#003867] px-6 pb-10 pt-16">

      <View className="mb-8 mt-4 flex-row items-center justify-between">
        {/* Botão de voltar */}
        <TouchableOpacity onPress={() => navigation.goBack()} className="mb-0">
          <Ionicons name="arrow-back" size={28} color="white" />
        </TouchableOpacity>

        <Text className="flex-1 text-center text-2xl font-bold text-white -ml-6">
          Cadastro de Material
        </Text>
      </View>

      <Text className="mb-2 text-sm text-white">Título</Text>
      <TextInput
        className="mb-4 rounded-xl bg-white px-4 py-3 text-base"
        placeholder="Digite o título"
        value={titulo}
        onChangeText={setTitulo}
        editable={!carregando}
      />

      <Text className="mb-2 text-sm text-white">Autor</Text>
      <TextInput
        className="mb-4 rounded-xl bg-white px-4 py-3 text-base"
        placeholder="Digite o autor"
        value={autor}
        onChangeText={setAutor}
        editable={!carregando}
      />

      <Text className="mb-2 text-sm text-white">Categoria</Text>
      <TouchableOpacity
        onPress={() => !carregando && setModalVisible(true)}
        className="mb-6 rounded-xl bg-white px-4 py-3"
        disabled={carregando}
      >
        <Text className="text-base text-gray-700">{categoria}</Text>
      </TouchableOpacity>

      <Modal transparent animationType="slide" visible={modalVisible}>
        <View className="flex-1 justify-end bg-black/40">
          <View className="rounded-t-xl bg-white p-6">
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
          className="mb-4 h-60 w-full rounded-2xl"
          resizeMode="cover"
        />
      ) : (
        <View className="mb-4 flex h-60 items-center justify-center rounded-xl border border-dashed border-white bg-white/10">
          <Text className="text-sm text-white">Nenhuma imagem selecionada</Text>
        </View>
      )}

      <View className="mb-6 flex-row justify-between">
        <TouchableOpacity
          onPress={tirarFoto}
          className="mr-2 flex-1 rounded-xl bg-blue-600 px-4 py-3"
          disabled={carregando}
        >
          <Text className="text-center font-semibold text-white">
            Tirar Foto
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={escolherDaGaleria}
          className="ml-2 flex-1 rounded-xl bg-blue-400 px-4 py-3"
          disabled={carregando}
        >
          <Text className="text-center font-semibold text-white">Galeria</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        className={`rounded-xl py-4 ${carregando ? "bg-gray-400" : "bg-green-600"
          }`}
        onPress={handleCadastro}
        disabled={carregando}
      >
        {carregando ? (
          <ActivityIndicator color="#FFF" />
        ) : (
          <Text className="text-center text-base font-bold text-white">
            Cadastrar Material
          </Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}
