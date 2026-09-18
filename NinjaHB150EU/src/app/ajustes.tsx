import { Stack, useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { Alert, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { IconoTemaActual, SelectorTema } from '@/components/selector-tema';
import { Card, SectionTitle } from '@/components/ui-kit';
import { FUENTE_GUIA, FUENTE_MANUAL, RECETAS } from '@/data/recetas';
import type { Receta } from '@/data/tipos';
import { usePalette } from '@/hooks/use-palette';
import { useApp } from '@/lib/store';
import { useTema } from '@/lib/tema';
import { FONT, RADIUS } from '@/theme/colors';

const NOMBRE_PREF = { claro: 'Claro', oscuro: 'Oscuro', sistema: 'Sistema' } as const;

export default function Ajustes() {
  const c = usePalette();
  const router = useRouter();
  const { pref } = useTema();
  const { fav, compra, restablecer } = useApp();
  const oficiales = (RECETAS as Receta[]).filter((r) => !r.plantilla && !r.tecnica).length;

  const confirmarReset = () =>
    Alert.alert(
      'Restablecer',
      'Se borrarán tus favoritos y la lista de la compra. Las recetas no se tocan.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Restablecer', style: 'destructive', onPress: restablecer },
      ]
    );

  const Fila = ({ etiqueta, valor, primera }: { etiqueta: string; valor: string; primera?: boolean }) => (
    <View
      style={[
        styles.fila,
        { borderTopColor: c.separator },
        primera && { borderTopWidth: 0, paddingTop: 0, marginTop: 0 },
      ]}>
      <Text style={[styles.filaEtiqueta, { color: c.textSoft }]}>{etiqueta}</Text>
      <Text style={[styles.filaValor, { color: c.muted }]}>{valor}</Text>
    </View>
  );

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Ajustes',
          headerRight: () => (
            <Pressable onPress={() => router.back()} hitSlop={12}>
              <Text style={{ color: c.tint, fontSize: 17, fontWeight: '600' }}>Listo</Text>
            </Pressable>
          ),
        }}
      />
      <ScrollView
        style={{ backgroundColor: c.bg }}
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={styles.content}>
        <SectionTitle>Apariencia</SectionTitle>
        <Card style={styles.pad}>
          <View style={styles.cabecera}>
            <IconoTemaActual size={19} />
            <Text style={[styles.cabeceraTxt, { color: c.text }]}>{NOMBRE_PREF[pref]}</Text>
          </View>
          <SelectorTema />
          <Text style={[styles.body, { color: c.muted }]}>
            ☀️ claro · ◐ el ajuste de iOS · 🌙 oscuro. El modo oscuro va bien para cocinar de noche sin deslumbrarte.
          </Text>
        </Card>

        <SectionTitle style={styles.st}>Tus datos</SectionTitle>
        <Card style={styles.pad}>
          <Fila primera etiqueta="Recetas favoritas" valor={String(fav.length)} />
          <Fila etiqueta="Ingredientes en la lista" valor={String(compra.length)} />
          <Pressable onPress={confirmarReset} style={[styles.destructivo, { borderColor: c.danger }]}>
            <Text style={{ color: c.danger, fontSize: 15.5, fontWeight: '600' }}>
              Restablecer favoritos y lista
            </Text>
          </Pressable>
        </Card>

        <SectionTitle style={styles.st}>Acerca de</SectionTitle>
        <Card style={styles.pad}>
          <Fila primera etiqueta="Aparato" valor="HB150EU" />
          <Fila etiqueta="Recetas oficiales" valor={String(oficiales)} />
          <Fila etiqueta="Versión" valor="1.0.0" />
          <Text style={[styles.body, { color: c.muted, marginTop: 12 }]}>
            Todas las recetas salen del manual y del recetario oficiales de la Ninja Foodi Blender &amp; Soup Maker
            HB150EU. Ninguna procede de Air Fryer, Multicooker, Creami ni de otros modelos Ninja.
          </Text>
          <Pressable onPress={() => WebBrowser.openBrowserAsync(FUENTE_MANUAL.url)}>
            <Text style={[styles.link, { color: c.tint }]}>Manual oficial (PDF) ›</Text>
          </Pressable>
          <Pressable onPress={() => WebBrowser.openBrowserAsync(FUENTE_GUIA.url)}>
            <Text style={[styles.link, { color: c.tint }]}>Recetario oficial (PDF) ›</Text>
          </Pressable>
        </Card>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 16, paddingBottom: 40, paddingTop: Platform.OS === 'ios' ? 8 : 16 },
  pad: { padding: 14, gap: 10 },
  st: { marginTop: 26 },
  cabecera: { flexDirection: 'row', alignItems: 'center', gap: 9 },
  cabeceraTxt: { fontSize: 17, fontWeight: '600' },
  fila: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 11, marginTop: 11, borderTopWidth: StyleSheet.hairlineWidth, gap: 12 },
  filaEtiqueta: { fontSize: 15, flex: 1 },
  filaValor: { fontSize: 15, fontFamily: FONT.mono, fontVariant: ['tabular-nums'] },
  destructivo: { borderWidth: 1, borderRadius: 11, paddingVertical: 13, alignItems: 'center', marginTop: 14 },
  body: { fontSize: 13.5, lineHeight: 19 },
  link: { fontSize: 14.5, fontWeight: '600', marginTop: 8 },
});
