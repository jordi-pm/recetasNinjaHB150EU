import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { AppProvider } from '@/lib/store';
import { TemaProvider } from '@/lib/tema';

function Navegacion() {
  // Appearance.setColorScheme sobrescribe esto, así que la preferencia
  // del usuario llega también a los temas de navegación y a la barra de estado.
  const scheme = useColorScheme();
  const oscuro = scheme === 'dark';

  return (
    <ThemeProvider value={oscuro ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="receta/[id]"
          options={{ title: '', headerBackTitle: 'Atrás', headerLargeTitle: false }}
        />
        <Stack.Screen
          name="ajustes"
          options={{ presentation: 'modal', title: 'Ajustes', headerLargeTitle: false }}
        />
        <Stack.Screen
          name="cocinar/[id]"
          options={{ headerShown: false, presentation: 'fullScreenModal', animation: 'slide_from_bottom' }}
        />
      </Stack>
      <StatusBar style={oscuro ? 'light' : 'dark'} />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <TemaProvider>
        <AppProvider>
          <Navegacion />
        </AppProvider>
      </TemaProvider>
    </GestureHandlerRootView>
  );
}
