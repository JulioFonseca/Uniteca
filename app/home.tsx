import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Image,
  TextInput,
  Alert,
} from "react-native";
import * as ImagePicker from 'expo-image-picker';
import Ionicons from "react-native-vector-icons/Ionicons";
import { auth, db } from '../src/services/firebaseConfig'; 
import { signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"materiais" | "Mapa" | "perfil">("materiais");
  const router = useRouter();
  const [nome, setNome] = useState('');
  const [faculdade, setFaculdade] = useState('');
  const [fotoPerfil, setFotoPerfil] = useState<string | null>(null);
  const [editando, setEditando] = useState(false);

  const user = auth.currentUser;

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

  const buscarDadosUsuario = async () => {
    if (user) {
      try {
        const docRef = doc(db, "usuarios", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const dados = docSnap.data();
          setNome(dados.nome || "Usuário");
          setFaculdade(dados.faculdade || "Faculdade");
        } else {
          console.log("Nenhum dado encontrado para este usuário!");
        }
      } catch (error) {
        console.log("Erro ao buscar usuário:", error);
      }
    }
  };

  const fazerLogout = async () => {
    try {
      await signOut(auth);
      router.replace("/login"); // ou como estiver sua página de login
    } catch (error) {
      Alert.alert("Erro ao sair", (error as Error).message);
    }
  };

  useEffect(() => {
    buscarDadosUsuario();
  }, []);

  const renderContent = () => {
    if (activeTab === "materiais") {
      return (
        <ScrollView className="mb-28 px-6">
          <View className="mb-6">
            <Text className="text-3xl font-bold text-white">
              Olá, {nome}! 👋
            </Text>
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
              <TouchableOpacity
                key={item}
                className="mr-4 h-48 w-32 justify-end rounded-lg bg-blue-500 p-2"
                onPress={() =>
                  router.push({
                    pathname: "/detalhesMaterial",
                    params: {
                      titulo: `Livro ${item}`,
                      autor: `Autor ${item}`,
                      categoria: "Livro",
                    },
                  })
                }
              >
                <Text className="font-bold text-white">Livro {item}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <Text className="mb-3 text-xl font-semibold text-white">
            Mais vendidos
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {[1, 2, 3].map((item) => (
              <TouchableOpacity
                key={item}
                className="mr-4 h-48 w-32 justify-end rounded-lg bg-blue-500 p-2"
                onPress={() =>
                  router.push({
                    pathname: "/detalhesMaterial",
                    params: {
                      titulo: `Livro ${item}`,
                      autor: `Autor ${item}`,
                      categoria: "Livro",
                    },
                  })
                }
              >
                <Text className="font-bold text-white">Livro {item}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <TouchableOpacity
            onPress={() => router.push("/cadastroMaterial")}
            className="mt-6 rounded-xl bg-white p-4"
          >
            <Text className="text-center text-base font-bold text-[#003867]">
              ➕ Cadastrar novo material
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push("/aluguelDevolucao")}
            className="mt-8 flex-row items-center justify-between rounded-2xl bg-white p-4"
          >
            <View>
              <Text className="text-lg font-bold text-[#003867]">
                Alugar ou Devolver
              </Text>
              <Text className="text-sm text-gray-500">
                Escaneie o QR Code do material
              </Text>
            </View>
            <Ionicons name="scan" size={28} color="#003867" />
          </TouchableOpacity>
        </ScrollView>
      );
    } else if (activeTab === "perfil") {
      return (
        <ScrollView className="flex-1 bg-[#003867] px-6 pt-16">
            {/* Imagem de perfil */}
            <TouchableOpacity
              onPress={escolherFoto}
              className="self-center mb-6"
            >
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
                {editando ? "💾 Salvar" : "✏️ Editar Perfil"}
              </Text>
            </TouchableOpacity>

            {/* Livros emprestados */}
            <Text className="text-white text-xl font-bold mb-4">
              📚 Livros Emprestados
            </Text>

            {livrosEmprestados.map((livro, index) => (
              <View key={index} className="mb-4 bg-white rounded-xl p-4">
                <Text className="text-[#003867] font-bold">{livro.titulo}</Text>
                <Text className="text-gray-500">Autor: {livro.autor}</Text>
              </View>
            ))}
        </ScrollView>
      );
    }
  };

  return (
    <View className="flex-1 bg-[#003867] pt-16">

            {/* Botão de logout */}
            <TouchableOpacity onPress={fazerLogout} className="absolute top-8 right-6 z-50">
        <Ionicons name="log-out-outline" size={28} color="white" />
      </TouchableOpacity>
      
      {renderContent()}

      {/* Tab bar fixa */}
      <View className="absolute inset-x-0 bottom-0 flex-row items-center justify-between rounded-t-3xl bg-white px-4 py-3 shadow-lg">
        <TouchableOpacity
          onPress={() => setActiveTab("materiais")}
          className="flex-1 items-center"
        >
          <Ionicons
            name="book"
            size={24}
            color={activeTab === "materiais" ? "#003867" : "#888"}
          />
          <Text
            className={`mt-1 text-sm ${
              activeTab === "materiais"
                ? "font-bold text-[#003867]"
                : "text-gray-500"
            }`}
          >
            Materiais
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveTab("Mapa")}
          className="flex-1 items-center"
        >
          <Ionicons
            name="map"
            size={24}
            color={activeTab === "Mapa" ? "#003867" : "#888"}
          />
          <Text
            className={`mt-1 text-sm ${
              activeTab === "Mapa"
                ? "font-bold text-[#003867]"
                : "text-gray-500"
            }`}
          >
            Mapa
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveTab("perfil")}
          className="flex-1 items-center"
        >
          <Ionicons
            name="person"
            size={24}
            color={activeTab === "perfil" ? "#003867" : "#888"}
          />
          <Text
            className={`mt-1 text-sm ${
              activeTab === "perfil"
                ? "font-bold text-[#003867]"
                : "text-gray-500"
            }`}
          >
            Perfil
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
