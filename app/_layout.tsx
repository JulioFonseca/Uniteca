import { Stack } from 'expo-router';
import { NativeWindStyleSheet } from 'nativewind';

NativeWindStyleSheet.setOutput({
  default: 'native',
});

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, // Oculta o header em todas as telas por padrão
      }}
    />
  );
}
