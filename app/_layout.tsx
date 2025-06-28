import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import { useColorScheme } from 'nativewind';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import 'react-native-reanimated';

import '../global.css';

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  if (!loaded) return null;

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const { colorScheme } = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{
        headerShown: false,
      }}>
        <Stack.Screen name="index" options={{ title: 'Início', headerShown: false }} />
        {/* Add other screens here that are defined in your file system, e.g.: */}
        <Stack.Screen name="login" options={{ title: 'Login' }} />
        <Stack.Screen name="cadastroUsuario" options={{ title: 'Cadastro de Usuário' }} />
        <Stack.Screen name="home" options={{ title: 'Home' }} />
        {/* <Stack.Screen name="settings" options={{ title: 'Configurações' }} />
      <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} /> */}
      </Stack>
    </ThemeProvider>
  );
}
