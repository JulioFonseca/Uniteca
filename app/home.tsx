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
  Modal,
} from "react-native";
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { db, auth } from '../services/firebaseConfig';
import { signOut, getAuth } from "firebase/auth";
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import * as FileSystem from 'expo-file-system'; // Se estiver usando Expo
// import MapView from 'react-native-maps'
import WebView from 'react-native-webview'
import * as Location from 'expo-location';
import { Platform } from 'react-native';
import { collection, query, where, getDocs } from "firebase/firestore";
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import QRCode from 'react-native-qrcode-svg';
import MapView, { Marker } from 'react-native-maps';


export default function Home() {
  const [activeTab, setActiveTab] = useState<"materiais" | "Mapa" | "perfil">("materiais");
  const router = useRouter();
  const [nome, setNome] = useState('');
  const [faculdade, setFaculdade] = useState('');
  const [fotoPerfil, setFotoPerfil] = useState<string | null>(null);
  const [editando, setEditando] = useState(false);
  const [latitude, setLatitude] = useState(-3.7627885);
  const [longitude, setLongitude] = useState(-38.4860103);
  const [materiaisDisponiveis, setMateriaisDisponiveis] = useState<any[]>([]);
  const [termoBusca, setTermoBusca] = useState('');
  const [loading, setLoading] = useState(false);
  const [livrosEmprestados, setLivrosEmprestados] = useState<any[]>([]);
  const [livrosAlugados, setLivrosAlugados] = useState<any[]>([]);
  const [qrVisible, setQrVisible] = useState(false);
  const [qrData, setQrData] = useState('');

  const user = auth.currentUser;

  // Lista de localizações das faculdades Estácio em Fortaleza
  const estacioLocations = [
    {
      title: "Centro Universitário Estácio do Ceará | Via Corpvs",
      description: "R. Eliseu Uchôa Beco, 600 - Guararapes",
      latitude: -3.7627885,
      longitude: -38.4860103,
    },
    {
      title: "Unidade Estácio (Centro)",
      description: "Av. Duque de Caxias, 101 - Centro",
      latitude: -3.7259,
      longitude: -38.5253,
    },
    {
      title: "Centro Universitário Estácio - Campus Parangaba",
      description: "Av. Senador Fernandes Távora, 137A - Jóquei Clube",
      latitude: -3.7687,
      longitude: -38.5713,
    },
    {
      title: "Faculdade Estácio (Centro)",
      description: "Av. Duque de Caxias, 41-83 - Centro",
      latitude: -3.7259, // Mesmas coordenadas da outra unidade do Centro, se forem o mesmo ponto de interesse
      longitude: -38.5253,
    },
  ];

  const escolherFoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
      base64: true,
    });

    if (!result.canceled) {
      if (result.assets && result.assets[0]?.uri) {
        const selectedImageUri = result.assets[0].uri;
        // Opcional: Ainda pode definir o estado aqui se precisar exibir a imagem antes do upload
        setFotoPerfil(selectedImageUri);
        // Chame salvarFotoPerfil passando a URI diretamente
        await salvarFotoPerfil(selectedImageUri);
      }
    }
  };

  const materiaisFiltrados = materiaisDisponiveis.filter((material) => {
    const termo = termoBusca.toLowerCase();
    return (
      material.titulo.toLowerCase().includes(termo) ||
      material.autor.toLowerCase().includes(termo)
    );
  });


  const handleGerarQr = (livro: any) => {
    console.log(livro.id);
    setQrData(livro.id);
    setQrVisible(true);
  };


  const salvarEdicao = () => {
    setEditando(false);
  };


  const buscarMateriaisDisponiveis = async () => {
    try {
      setLoading(true); // Caso queira mostrar algum loader

      const materiaisRef = collection(db, "materiais");
      const q = query(materiaisRef, where("disponivel", "==", true));
      const querySnapshot = await getDocs(q);

      const materiais: { id: string;[key: string]: any }[] = [];

      querySnapshot.forEach((doc) => {
        materiais.push({ id: doc.id, ...doc.data() });
      });

      setMateriaisDisponiveis(materiais);
    } catch (error) {
      console.error("Erro ao buscar materiais disponíveis:", error);
    } finally {
      setLoading(false);
    }
  };


  const buscarDadosUsuario = async () => {
    console.log(user);
    if (user) {
      try {
        const docRef = doc(db, "usuarios", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const dados = docSnap.data();
          setNome(dados.nome || "Usuário");
          setFaculdade(dados.faculdade || "Faculdade");
          if (dados.foto) setFotoPerfil(dados.foto);
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
      router.replace("/login");
    } catch (error) {
      Alert.alert("Erro ao sair", (error as Error).message);
    }
  };

  const carregarLivrosAlugados = async () => {
    try {
      const alugueisRef = collection(db, "alugueis");
      const q = query(
        alugueisRef,
        where("usuarioId", "==", auth.currentUser?.uid),
        where("status", "==", "alugado")
      );
      const querySnapshot = await getDocs(q);

      const livros: any[] = [];

      for (const docAluguel of querySnapshot.docs) {
        const aluguel = docAluguel.data();
        const materialRef = await getDocs(
          query(collection(db, "materiais"), where("__name__", "==", aluguel.materialId))
        );
        materialRef.forEach((docMaterial) => {
          livros.push({
            id: docMaterial.id,
            titulo: docMaterial.data().titulo,
            autor: docMaterial.data().autor,
          });
        });
      }

      setLivrosAlugados(livros);
    } catch (error) {
      console.error("Erro ao buscar livros Alugados:", error);
    }
  };

  const carregarLivrosCadastradosPeloUsuario = async () => {
    try {
      const materiaisRef = collection(db, "materiais");

      const q = query(
        materiaisRef,
        where("usuarioId", "==", auth.currentUser?.uid)
      );

      const querySnapshot = await getDocs(q);

      const livros: any[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        livros.push({
          id: doc.id,
          titulo: data.titulo,
          autor: data.autor,
          categoria: data.categoria,
          disponivel: data.disponivel,
        });
      });

      setLivrosEmprestados(livros);
    } catch (error) {
      console.error("Erro ao buscar materiais cadastrados pelo usuário:", error);
    }
  };

  const abrirCameraParaDevolucao = () => {
    router.push("/scannerDevolucao");
  };


  const salvarFotoPerfil = async (imageUri: string) => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      // Upload no Cloudinary
      const data = new FormData();
      data.append('file', {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'profile.jpg',
      } as any);

      data.append('upload_preset', 'uniteca_upload'); // substitua aqui
      data.append('cloud_name', 'duhhud3ef');       // substitua aqui

      const response = await fetch('https://api.cloudinary.com/v1_1/duhhud3ef/image/upload', {
        method: 'POST',
        body: data,
      });

      const json = await response.json();

      if (!json.secure_url) {
        throw new Error('Erro ao fazer upload da imagem no Cloudinary.');
      }

      const fotoUrl = json.secure_url;

      // Atualiza o Firestore com a nova URL da foto
      await updateDoc(doc(db, 'usuarios', user.uid), {
        foto: fotoUrl,
      });

      return fotoUrl;
    } catch (error: any) {
      console.error('Erro ao salvar foto de perfil:', error);
      throw error;
    }
  };

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissão negada', 'Permita o uso da localização para usar o mapa.');
      }
    })();
  }, []);

  useEffect(() => {
    buscarDadosUsuario();
    buscarMateriaisDisponiveis();
    carregarLivrosAlugados();
    carregarLivrosCadastradosPeloUsuario();
  }, []);

  useFocusEffect(
    useCallback(() => {
      buscarDadosUsuario();
      buscarMateriaisDisponiveis();
      carregarLivrosAlugados();
      carregarLivrosCadastradosPeloUsuario();
    }, [])
  );

  const bbox = `${longitude - 0.002},${latitude - 0.002},${longitude + 0.002},${latitude + 0.002}`;

  const renderContent = () => {
    if (activeTab === "materiais") {
      return (
        <ScrollView className="mb-28 px-6">
          <View className="mb-6 pt-28">
            <Text className="text-3xl font-bold text-white">Olá, {nome}! 👋</Text>
            <Text className="mt-1 text-lg text-white">
              Você está na biblioteca Uniteca
            </Text>
          </View>

          <View className="mb-6 rounded-xl bg-white px-4 py-3">
            <TextInput
              placeholder="🔍 Buscar por título ou autor"
              value={termoBusca}
              onChangeText={setTermoBusca}
              className="text-gray-800"
            />
          </View>


          <Text className="mb-3 text-xl font-semibold text-white">Recomendações</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-6">
            {materiaisFiltrados.map((material) => (
              <TouchableOpacity
                key={material.id}
                className="mr-4 w-32 rounded-lg bg-white shadow-md"
                onPress={() =>
                  router.push({
                    pathname: "/detalhesMaterial",
                    params: {
                      titulo: material.titulo,
                      autor: material.autor,
                      categoria: material.categoria,
                      imagemUrl: material.imagemUrl,
                      materialId: material.id,
                      disponivel: material.disponivel
                    },
                  })
                }
              >
                {material.imagemUrl ? (
                  <Image
                    source={{ uri: material.imagemUrl }}
                    className="h-32 w-full rounded-t-lg"
                    resizeMode="cover"
                  />
                ) : (
                  <View className="h-32 w-full items-center justify-center rounded-t-lg bg-gray-200">
                    <Text className="text-gray-500">Sem imagem</Text>
                  </View>
                )}
                <View className="p-2">
                  <Text className="text-center text-xs font-bold text-gray-800">
                    {material.titulo}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <Text className="mb-3 text-xl font-semibold text-white">Mais vendidos</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {materiaisFiltrados.map((material) => (
              <TouchableOpacity
                key={material.id}
                className="mr-4 w-32 rounded-lg bg-white shadow-md"
                onPress={() =>
                  router.push({
                    pathname: "/detalhesMaterial",
                    params: {
                      titulo: material.titulo,
                      autor: material.autor,
                      categoria: material.categoria,
                      imagemUrl: material.imagemUrl,
                      materialId: material.id,
                      disponivel: material.disponivel
                    },
                  })
                }
              >
                {material.imagemUrl ? (
                  <Image
                    source={{ uri: material.imagemUrl }}
                    className="h-32 w-full rounded-t-lg"
                    resizeMode="cover"
                  />
                ) : (
                  <View className="h-32 w-full items-center justify-center rounded-t-lg bg-gray-200">
                    <Text className="text-gray-500">Sem imagem</Text>
                  </View>
                )}
                <View className="p-2">
                  <Text className="text-center text-xs font-bold text-gray-800">
                    {material.titulo}
                  </Text>
                </View>
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

          {/* <TouchableOpacity
            // onPress={() => router.push("/aluguelDevolucao")}
            className="mt-8 flex-row items-center justify-between rounded-2xl bg-white p-4"
          >
            <View>
              <Text className="text-lg font-bold text-[#003867]">Alugar ou Devolver</Text>
              <Text className="text-sm text-gray-500">Escaneie o QR Code do material</Text>
            </View>
            <Ionicons name="scan" size={28} color="#003867" />
          </TouchableOpacity> */}
        </ScrollView>
      );
    } else if (activeTab === "perfil") {
      return (
        <ScrollView className="flex-1 bg-[#003867] px-6 pt-16">

          {/* Botão de logout */}
          <TouchableOpacity
            onPress={fazerLogout}
            className="absolute top-6 right-3 z-50"
          >
            <Ionicons name="log-out-outline" className="left-0" size={32} color="white" />
          </TouchableOpacity>

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

          {/* Botão Editar/Salvar */}
          <TouchableOpacity
            onPress={editando ? salvarEdicao : () => setEditando(true)}
            className="bg-white py-4 rounded-xl mb-8"
          >
            <Text className="text-[#003867] text-center font-bold text-base">
              {editando ? "💾 Salvar" : "✏️ Editar Perfil"}
            </Text>
          </TouchableOpacity>

          {/* Livros emprestados */}
          <Text className="text-white text-xl font-bold mb-4">📚 Livros Alugados</Text>

          {livrosAlugados.length === 0 ? (
            <Text className="text-white mb-4">Nenhum livro alugado no momento.</Text>
          ) : (
            livrosAlugados.map((livro, index) => (
              <View key={index} className="mb-4 bg-white rounded-xl p-4">
                <Text className="text-[#003867] font-bold">{livro.titulo}</Text>
                <Text className="text-gray-500">Autor: {livro.autor}</Text>
              </View>
            ))
          )}

          <Text className="text-white text-xl font-bold mb-4">📚 Livros Cadastrados</Text>

          {livrosEmprestados.length === 0 ? (
            <Text className="text-white">Nenhum livro cadastrado no momento.</Text>
          ) : (
            livrosEmprestados.map((livro, index) => (
              <View key={index} className="mb-4 bg-white rounded-xl p-4">
                <Text className="text-[#003867] font-bold">{livro.titulo}</Text>
                <Text className="text-gray-500">Autor: {livro.autor}</Text>

                {/* Botão para gerar o QR Code */}
                <TouchableOpacity
                  onPress={() => handleGerarQr(livro)}
                  className="mt-2 bg-blue-500 p-2 rounded-lg"
                >
                  <Text className="text-white text-center">Gerar QR Code</Text>
                </TouchableOpacity>
              </View>
            ))
          )}

          {/* Modal com o QR Code */}
          <Modal visible={qrVisible} transparent animationType="slide">
            <View className="flex-1 justify-center items-center bg-black bg-opacity-70">
              <View className="bg-white p-6 rounded-xl items-center">
                <Text className="font-bold mb-4">📱 QR Code do Livro</Text>
                <QRCode value={qrData} size={200} />
                <TouchableOpacity
                  onPress={() => setQrVisible(false)}
                  className="mt-4 bg-red-500 p-2 rounded-lg"
                >
                  <Text className="text-white">Fechar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          {/* Botão de devolver */}
          {livrosAlugados.length != 0 ? (
          <TouchableOpacity
            onPress={abrirCameraParaDevolucao}
            className="bg-white py-4 rounded-xl mt-4 mb-32"
          >
            <Text className="text-[#003867] text-center font-bold text-base">
              📷 Escanear QR Code para Devolver
            </Text>
          </TouchableOpacity> ) : ""}
        </ScrollView> 
      );
    } else if (activeTab === "Mapa") {
      const initialRegion = {
        latitude: -3.7627885,
        longitude: -38.4860103,
        latitudeDelta: 0.05, // Ajuste para o nível de zoom
        longitudeDelta: 0.05, // Ajuste para o nível de zoom
      };

      return (
        <View className="flex-1">
          {Platform.OS === 'web' ? (
            <iframe
              src={`https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik`}
              style={{ width: '100%', height: '100%', border: 'none' }}
              loading="lazy"
            ></iframe>
          ) : (
            <View style={{ flex: 1 }}>
              <MapView style={{
                width: '100%',
                height: '100%',
              }}
                // Desabilitando controles nativos
                initialRegion={initialRegion}
                showsCompass={false}
                showsScale={false}
                showsTraffic={false}
                showsIndoors={false}
                showsPointsOfInterest={true}
                showsMyLocationButton={false} // Se você usa o botão de localização
                toolbarEnabled={true} // Apenas para Android, desabilita a toolbar em marcadores
              // Você pode adicionar mais props aqui para controlar o comportamento do mapa
              // Por exemplo, para desabilitar o zoom por pinça, scroll, etc.:
              // scrollEnabled={false}
              // zoomEnabled={false}
              // rotateEnabled={false}
              // pitchEnabled={false}
              >

                {/* Adicionando marcadores para cada unidade da Estácio em Fortaleza */}
                {estacioLocations.map((location, index) => (
                  <Marker
                    key={index}
                    coordinate={{
                      latitude: location.latitude,
                      longitude: location.longitude,
                    }}
                    title={location.title}
                    description={location.description}
                  />
                ))}
              </MapView>
            </View>
          )
          }
        </View >
      );
    }
  };

  return (
    <View className="flex-1 bg-[#003867]">

      {/* Botão de logout */}
      {/* <TouchableOpacity
        onPress={fazerLogout}
        className="absolute top-28 right-6 z-50 bg-blue-600 p-2 rounded-full"
      >
        <Ionicons name="log-out-outline" size={24} color="white" />
      </TouchableOpacity> */}



      {renderContent()}

      {/* Tab bar fixa */}
      <View className="absolute inset-x-0 bottom-0 flex-row items-center justify-between rounded-t-3xl bg-white px-4 py-3">
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
            className={`mt-1 text-sm ${activeTab === "materiais"
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
            className={`mt-1 text-sm ${activeTab === "Mapa"
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
            className={`mt-1 text-sm ${activeTab === "perfil"
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