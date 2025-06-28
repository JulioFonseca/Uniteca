import { CameraView, useCameraPermissions } from "expo-camera";
import { router, Stack } from "expo-router";
import {
  Alert,
  AppState,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Overlay } from "./Overlay";
import { useEffect, useRef, useState } from "react";
import { collection, query, where, getDocs, updateDoc, doc, getDoc } from "firebase/firestore";
import { auth, db } from "../services/firebaseConfig";

export default function ScannerDevolucao() {
  const [permission, requestPermission] = useCameraPermissions();
  const qrLock = useRef(false);
  const appState = useRef(AppState.currentState);
  const [cameraAtiva, setCameraAtiva] = useState(true);

  async function processarDevolucao(materialId: string) {
    try {
      const usuarioId = auth.currentUser?.uid;

      if (!usuarioId) {
        Alert.alert("Erro", "Usuário não autenticado.");
        return;
      }

      // Buscar se o usuário tem aluguel ativo desse material
      const alugueisRef = collection(db, "alugueis");
      const q = query(
        alugueisRef,
        where("materialId", "==", materialId),
        where("usuarioId", "==", usuarioId),
        where("status", "==", "alugado")
      );

      const alugueisSnapshot = await getDocs(q);

      if (alugueisSnapshot.empty) {
        Alert.alert(
          "Erro",
          "Nenhum aluguel ativo encontrado para este material por este usuário."
        );
        router.back()
        return;
      }

      const aluguelDoc = alugueisSnapshot.docs[0];

      // Atualiza o aluguel como devolvido
      await updateDoc(aluguelDoc.ref, {
        status: "devolvido",
        dataDevolucao: new Date(),
      });

      // Torna o material disponível novamente
      const materialRef = doc(db, "materiais", materialId);
      await updateDoc(materialRef, {
        disponivel: true,
      });

      Alert.alert("Sucesso", "Material devolvido com sucesso!");
      router.back()
    } catch (error) {
      console.error("Erro ao processar devolução:", error);
      Alert.alert("Erro", "Erro ao registrar a devolução.");
      router.back()
    } finally {
      qrLock.current = false; // Libera para próximo scan (se voltar a ativar a câmera)
    }
  }

  useEffect(() => {
    requestPermission();

    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        qrLock.current = false;
        setCameraAtiva(true); // Reativa a câmera ao voltar para o app
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, []);

  async function handleBarcodeScanned(result: any) {
    if (qrLock.current || !cameraAtiva) return;

    qrLock.current = true;
    setCameraAtiva(false); 

    const materialId = result.data.trim();

    try {
      const materialRef = doc(db, "materiais", materialId);
      const materialSnap = await getDoc(materialRef);

      if (!materialSnap.exists()) {
        Alert.alert("Erro", "Material não encontrado no sistema.");
        qrLock.current = false;
        setCameraAtiva(true);
        return;
      }

      const material = materialSnap.data();
      const titulo = material.titulo || "Material";

      // Limita a 3 primeiras palavras
      const tituloLimitado = titulo.split(" ").slice(0, 3).join(" ");

      Alert.alert(
        "Confirmar devolução",
        `Deseja devolver: ${tituloLimitado}?`,
        [
          {
            text: "Cancelar",
            onPress: () => {
              qrLock.current = false;
              setCameraAtiva(true); // 🔵 Reativa a câmera para escanear novamente
            },
            style: "cancel",
          },
          {
            text: "Devolver",
            onPress: () => processarDevolucao(materialId),
          },
        ]
      );
    } catch (error) {
      console.error("Erro ao buscar material:", error);
      Alert.alert("Erro", "Falha ao buscar o material.");
      qrLock.current = false;
      setCameraAtiva(true);
    }
  }

  if (!permission) {
    return <View><Text>Verificando permissão da câmera...</Text></View>;
  }

  if (!permission.granted) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Permissão de câmera necessária.</Text>
        <Text onPress={requestPermission} style={{ color: "blue", marginTop: 10 }}>
          Permitir agora
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={StyleSheet.absoluteFillObject}>
      <Stack.Screen
        options={{
          title: "Scanner Devolução",
          headerShown: false,
        }}
      />
      {Platform.OS === "android" ? <StatusBar hidden /> : null}

      {cameraAtiva && (
        <CameraView
          style={StyleSheet.absoluteFillObject}
          facing="back"
          onBarcodeScanned={handleBarcodeScanned}
        />
      )}

      <Overlay />
    </SafeAreaView>
  );
}
