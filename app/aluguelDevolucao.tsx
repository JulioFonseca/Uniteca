//import { BarCodeScanner } from 'expo-barcode-scanner';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function AluguelDevolucao() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const router = useRouter();

  // useEffect(() => {
  //   (async () => {
  //     const { status } = await BarCodeScanner.requestPermissionsAsync();
  //     setHasPermission(status === 'granted');
  //   })();
  // }, []);

  const handleBarCodeScanned = ({
    type,
    data,
  }: {
    type: string;
    data: string;
  }) => {
    setScanned(true);

    Alert.alert(
      'Código Detectado',
      `Tipo: ${type}\nDados: ${data}`,
      [
        {
          text: 'Alugar',
          onPress: () => {
            // Simula ação de aluguel
            Alert.alert('✅ Alugado com sucesso!');
            setScanned(false);
          },
        },
        {
          text: 'Devolver',
          onPress: () => {
            // Simula ação de devolução
            Alert.alert('✅ Devolvido com sucesso!');
            setScanned(false);
          },
        },
        {
          text: 'Cancelar',
          style: 'cancel',
          onPress: () => setScanned(false),
        },
      ],
      { cancelable: false },
    );
  };

  if (hasPermission === null) {
    return (
      <Text className="mt-40 text-center text-white">
        Solicitando permissão de câmera...
      </Text>
    );
  }
  if (hasPermission === false) {
    return (
      <Text className="mt-40 text-center text-white">Sem acesso à câmera</Text>
    );
  }

  return (
    <View className="flex-1 items-center justify-start bg-[#003867] pt-16">
      <TouchableOpacity
        onPress={() => router.back()}
        className="absolute left-4 top-10 z-10 rounded-xl bg-white/20 px-4 py-2"
      >
        <Text className="text-base text-white">← Voltar</Text>
      </TouchableOpacity>

      <Text className="mb-6 mt-14 text-2xl font-bold text-white">
        Aluguel e Devolução
      </Text>

      <View
        style={{
          width: 300,
          height: 300,
          overflow: 'hidden',
          borderRadius: 20,
          borderWidth: 4,
          borderColor: '#fff',
        }}
      >
        {/* <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        /> */}
      </View>

      <Text className="mt-4 text-center text-white">
        Aponte para o código do material
      </Text>
    </View>
  );
}