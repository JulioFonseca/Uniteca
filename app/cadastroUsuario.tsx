import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Image, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import * as ImagePicker from 'expo-image-picker';
import { db, auth } from '../services/firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';

export default function CadastroUsuario() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [faculdade, setFaculdade] = useState('');
  const [senha, setSenha] = useState('');
  const [imagemUri, setImagemUri] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const router = useRouter();

  const validarEmail = (email: string) => {
    const regex = /\S+@\S+\.\S+/;
    return regex.test(email);
  };

  const escolherImagem = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão negada', 'Permita o acesso à galeria.');
      return;
    }

    const resultado = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!resultado.canceled && resultado.assets?.[0]?.uri) {
      setImagemUri(resultado.assets[0].uri);
    }
  };

  const uploadToCloudinary = async (uri: string): Promise<string> => {
    const data = new FormData();
    const blob: any = {
      uri,
      type: 'image/jpeg',
      name: 'profile.jpg',
    };

    data.append('file', blob);
    data.append('upload_preset', 'uniteca_upload'); // substitua aqui
    data.append('cloud_name', 'duhhud3ef');       // substitua aqui

    const res = await fetch('https://api.cloudinary.com/v1_1/duhhud3ef/image/upload', {
      method: 'POST',
      body: data,
    });

    const json = await res.json();

    if (json.secure_url) return json.secure_url;
    else throw new Error('Erro no upload: ' + JSON.stringify(json));
  };

  const handleCadastro = async () => {
    if (!nome || !email || !faculdade || !senha) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }

    if (!validarEmail(email)) {
      Alert.alert('Erro', 'Por favor, insira um e-mail válido.');
      return;
    }

    try {
      setUploading(true);
      let fotoUrl = '';

      if (imagemUri) {
        fotoUrl = await uploadToCloudinary(imagemUri);
      }

      const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
      const { uid } = userCredential.user;

      await setDoc(doc(db, 'usuarios', uid), {
        nome,
        email,
        faculdade,
        foto: fotoUrl,
        criadoEm: new Date(),
      });

      Alert.alert('Cadastro realizado', 'Sua conta foi criada com sucesso!');
      router.replace('/login');
    } catch (error: any) {
      console.error('Erro ao cadastrar:', error);
      let mensagem = 'Erro ao cadastrar. Tente novamente.';

      if (error.code === 'auth/email-already-in-use') {
        mensagem = 'Este e-mail já está em uso.';
      } else if (error.code === 'auth/invalid-email') {
        mensagem = 'E-mail inválido.';
      } else if (error.code === 'auth/weak-password') {
        mensagem = 'A senha precisa ter pelo menos 6 caracteres.';
      }

      Alert.alert('Erro', mensagem);
    } finally {
      setUploading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      className="flex-1 bg-[#003867]"
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <View className="flex-1 justify-center px-8 py-4">

          {/* Logo */}
          <View className="items-center mb-6">
            <Image
              source={require('../assets/images/logo-uniteca.png')}
              className="w-48 h-48"
              resizeMode="contain"
            />
          </View>

          {/* Foto de perfil */}
          

          {/* Inputs */}
          <Text className="text-white mb-1 ml-1">Nome</Text>
          <TextInput
            className="bg-white rounded-lg p-3 mb-4"
            placeholder="Digite seu nome"
            value={nome}
            onChangeText={setNome}
          />

          <Text className="text-white mb-1 ml-1">Email</Text>
          <TextInput
            className="bg-white rounded-lg p-3 mb-4"
            placeholder="Digite seu email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text className="text-white mb-1 ml-1">Faculdade</Text>
          <TextInput
            className="bg-white rounded-lg p-3 mb-4"
            placeholder="Digite sua faculdade"
            value={faculdade}
            onChangeText={setFaculdade}
          />

          <Text className="text-white mb-1 ml-1">Senha</Text>
          <TextInput
            className="bg-white rounded-lg p-3 mb-6"
            placeholder="Crie uma senha"
            value={senha}
            onChangeText={setSenha}
            secureTextEntry
          />

          {/* Botão de cadastro */}
          <TouchableOpacity
            onPress={handleCadastro}
            className="bg-[#005BBB] rounded-lg py-3 items-center"
            disabled={uploading}
          >
            <Text className="text-white text-base font-semibold">
              {uploading ? 'Cadastrando...' : 'Cadastrar'}
            </Text>
          </TouchableOpacity>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
