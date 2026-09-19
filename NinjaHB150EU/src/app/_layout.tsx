import { DarkTheme, DefaultTheme, Stack, ThemeProvider, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Pressable, StyleSheet, Text, useColorScheme, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { AppProvider } from '@/lib/store';
import { TemaProvider } from '@/lib/tema';

/** Pantalla de error de expo-router: mejor esto que un fondo en blanco. */
export function ErrorBoundary({ error, retry }: { error: Error; retry: () => Promise<void> }) {
  const oscuro = useColorScheme() === 'dark';
  const fg = oscuro ? '#E7ECF1' : '#141A20';
  const bg = oscuro ? '#000' : '#F2F2F7';
  return (
    <View style={[styles.err, { backgroundColor: bg }]}>
      <Text style={{ fontSize: 44 }}>🥣</Text>
      <Text style={[styles.errTitulo, { color: fg }]}>Algo se ha atascado</Text>
      <Text style={[styles.errTxt, { color: fg }]}>
        La app ha fallado en esta pantalla. Tus favoritos, notas y la lista de la compra están guardados.
      </Text>
      <Text style={[styles.errDetalle, { color: fg }]} numberOfLines={4}>
        {error.message}
      </Text>
      <Pressable onPress={retry} style={[styles.errBtn, { backgroundColor: oscuro ? '#1C1C1E' : '#15181D' }]}>
        <Text style={styles.errBtnTxt}>Volver a intentarlo</Text>
      </Pressable>
    </View>
  );
}

function Navegacion() {
  // Appearance.setColorScheme sobrescribe esto, así que la preferencia del
  // usuario llega también a los temas de navegación y a la barra de estado.
  const oscuro = useColorScheme() === 'dark';
  const router = useRouter();

  const cerrar = (titulo: string) => ({
    presentation: 'modal' as const,
    title: titulo,
    headerLargeTitle: false,
  });

  return (
    <ThemeProvider value={oscuro ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="receta/[id]" options={{ title: '', headerBackTitle: 'Atrás' }} />
        <Stack.Screen name="ajustes" options={cerrar('Ajustes')} />
        <Stack.Screen name="nueva-receta" options={cerrar('Receta tuya')} />
        <Stack.Screen name="programas" options={{ title: 'Programas', headerBackTitle: 'Atrás' }} />
        <Stack.Screen name="cabe" options={{ title: '¿Cabe?', headerBackTitle: 'Atrás' }} />
        <Stack.Screen name="diagnostico" options={{ title: 'Diagnóstico', headerBackTitle: 'Atrás' }} />
        <Stack.Screen name="importar" options={cerrar('Importar receta')} />
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

const styles = StyleSheet.create({
  err: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32, gap: 12 },
  errTitulo: { fontSize: 22, fontWeight: '700' },
  errTxt: { fontSize: 15, textAlign: 'center', lineHeight: 21, opacity: 0.8 },
  errDetalle: { fontSize: 12, fontFamily: 'Menlo', opacity: 0.5, textAlign: 'center' },
  errBtn: { borderRadius: 12, paddingVertical: 14, paddingHorizontal: 28, marginTop: 8 },
  errBtnTxt: { color: '#FFF', fontSize: 16, fontWeight: '600' },
});
