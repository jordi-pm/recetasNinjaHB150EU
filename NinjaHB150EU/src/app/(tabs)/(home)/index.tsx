import { Stack, useFocusEffect, useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useCallback, useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { RecipeCard } from '@/components/recipe-card';
import { Card, Eyebrow, SectionTitle } from '@/components/ui-kit';
import { CATEGORIAS } from '@/data/recetas';
import { usePalette } from '@/hooks/use-palette';
import { borrarSesion, leerSesion, type Sesion } from '@/lib/sesion';
import { useApp, useRecetas } from '@/lib/store';
import { FONT, RADIUS } from '@/theme/colors';

const DESTACADAS = ['calabaza', 'verduras-trozos', 'smoothie-fresa-pina'];

export default function Inicio() {
  const c = usePalette();
  const router = useRouter();
  const { fav, propias, historial } = useApp();
  const recetas = useRecetas();
  const [sesion, setSesion] = useState<Sesion | null>(null);

  useFocusEffect(
    useCallback(() => {
      leerSesion().then(setSesion);
    }, [])
  );

  const oficiales = recetas.filter((r) => !r.plantilla && !r.tecnica && !r.propia).length;
  const conRecetas = CATEGORIAS
    .map((cat) => ({ cat, n: recetas.filter((r) => r.cat === cat.id).length }))
    .filter((x) => x.n > 0);
  const recientes = historial.slice(0, 2).map((h) => recetas.find((r) => r.id === h.id)).filter(Boolean);
  const sesionReceta = sesion ? recetas.find((r) => r.id === sesion.id) : undefined;

  const Acceso = ({ icono, titulo, sub, onPress }: { icono: string; titulo: string; sub: string; onPress: () => void }) => (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.acceso, { backgroundColor: c.card, opacity: pressed ? 0.6 : 1 }]}>
      <Text style={{ fontSize: 22 }}>{icono}</Text>
      <View style={{ flex: 1, gap: 2 }}>
        <Text style={[styles.accesoTitulo, { color: c.text }]}>{titulo}</Text>
        <Text style={[styles.accesoSub, { color: c.muted }]}>{sub}</Text>
      </View>
      <Text style={{ color: c.muted, fontSize: 19 }}>›</Text>
    </Pressable>
  );

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Recetas',
          headerRight: () => (
            <Pressable onPress={() => router.push('/ajustes')} hitSlop={12} accessibilityLabel="Ajustes de la app">
              {Platform.OS === 'ios' ? (
                <SymbolView name="gearshape.fill" size={21} tintColor={c.tint} resizeMode="scaleAspectFit" />
              ) : (
                <Text style={{ fontSize: 19 }}>⚙️</Text>
              )}
            </Pressable>
          ),
        }}
      />
      <ScrollView
        style={{ backgroundColor: c.bg }}
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={styles.content}>
        {/* reanudar */}
        {sesion && sesionReceta && (
          <Pressable
            onPress={() => router.push(`/cocinar/${sesion.id}?k=${sesion.escala}&desde=${sesion.paso}`)}
            style={({ pressed }) => [styles.reanudar, { backgroundColor: c.hotSoft, borderColor: c.hot, opacity: pressed ? 0.8 : 1 }]}>
            <View style={{ flex: 1, gap: 3 }}>
              <Eyebrow color={c.hot}>Lo dejaste a medias</Eyebrow>
              <Text style={[styles.reanudarTitulo, { color: c.hot }]}>
                {sesionReceta.nombre} · paso {sesion.paso + 1}
              </Text>
            </View>
            <Pressable
              onPress={() => { borrarSesion(); setSesion(null); }}
              hitSlop={10}
              accessibilityLabel="Descartar">
              <Text style={{ color: c.hot, fontSize: 19 }}>×</Text>
            </Pressable>
            <Text style={{ color: c.hot, fontSize: 19 }}>›</Text>
          </Pressable>
        )}

        <View style={[styles.hero, { backgroundColor: c.hero }]}>
          <Eyebrow color="#8B99A8">Recetario personal</Eyebrow>
          <Text style={styles.heroTitle}>Sopas, cremas{'\n'}y batidos</Text>
          <Text style={styles.heroSub}>
            Para batidoras soperas de jarra calefactora. Cada paso te dice qué tecla pulsar y cuánto esperar.
          </Text>
          <View style={styles.chips}>
            {[`${oficiales} recetas`, '10 programas automáticos', '1,4 L HOT · 1,6 L COLD'].map((t) => (
              <View key={t} style={[styles.chip, { borderColor: c.panelBorder }]}>
                <Text style={styles.chipTxt} maxFontSizeMultiplier={1.3}>{t.toUpperCase()}</Text>
              </View>
            ))}
          </View>
        </View>

        <SectionTitle>Categorías</SectionTitle>
        <View style={styles.grid}>
          {conRecetas.map(({ cat, n }) => (
            <Pressable
              key={cat.id}
              onPress={() => router.push({ pathname: '/buscar', params: { cat: cat.id } })}
              style={({ pressed }) => [styles.cat, { backgroundColor: c.card, opacity: pressed ? 0.6 : 1 }]}>
              <Text style={{ fontSize: 26 }}>{cat.emoji}</Text>
              <View style={{ marginTop: 'auto', gap: 2 }}>
                <Text style={[styles.catName, { color: c.text }]}>{cat.nombre}</Text>
                <Text style={[styles.catCount, { color: c.muted }]}>{n} receta{n > 1 ? 's' : ''}</Text>
              </View>
            </Pressable>
          ))}
        </View>

        <SectionTitle style={styles.st}>Herramientas</SectionTitle>
        <View style={{ gap: 10 }}>
          <Acceso icono="📏" titulo="¿Cabe en la jarra?" sub="Comprueba si te pasas de la línea sin seguir receta" onPress={() => router.push('/cabe')} />
          <Acceso icono="⏱" titulo="Los programas por dentro" sub="Qué hace cada uno y cuánto tarda" onPress={() => router.push('/programas')} />
          <Acceso icono="✏️" titulo="Añadir receta tuya" sub={propias.length ? `Tienes ${propias.length} guardada${propias.length > 1 ? 's' : ''}` : 'Con la misma ficha y los mismos avisos'} onPress={() => router.push('/nueva-receta')} />
          <Acceso icono="⚙️" titulo="Mi aparato" sub="Programas, límites de llenado y avisos de seguridad" onPress={() => router.push('/maquina')} />
        </View>

        {propias.length > 0 && (
          <>
            <SectionTitle style={styles.st}>Tus recetas</SectionTitle>
            <View style={{ gap: 10 }}>
              {propias.map((r) => <RecipeCard key={r.id} receta={r} />)}
            </View>
          </>
        )}

        {recientes.length > 0 && (
          <>
            <SectionTitle style={styles.st}>Cocinadas hace poco</SectionTitle>
            <View style={{ gap: 10 }}>
              {recientes.map((r) => <RecipeCard key={r!.id} receta={r!} />)}
            </View>
          </>
        )}

        {fav.length > 0 && (
          <>
            <SectionTitle style={styles.st}>Tus favoritas</SectionTitle>
            <View style={{ gap: 10 }}>
              {fav.slice(0, 3).map((id) => {
                const r = recetas.find((x) => x.id === id);
                return r ? <RecipeCard key={id} receta={r} /> : null;
              })}
            </View>
          </>
        )}

        <SectionTitle style={styles.st}>Empieza por aquí</SectionTitle>
        <View style={{ gap: 10 }}>
          {DESTACADAS.map((id) => {
            const r = recetas.find((x) => x.id === id);
            return r ? <RecipeCard key={id} receta={r} /> : null;
          })}
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 16, maxWidth: 720, width: '100%', alignSelf: 'center', paddingBottom: 40 },
  reanudar: { flexDirection: 'row', alignItems: 'center', gap: 10, borderWidth: 1, borderRadius: RADIUS, padding: 14, marginBottom: 14 },
  reanudarTitulo: { fontSize: 15.5, fontWeight: '700' },
  hero: { borderRadius: RADIUS, padding: 18, gap: 8, marginBottom: 26 },
  heroTitle: { color: '#FFFFFF', fontSize: 25, fontWeight: '700', lineHeight: 29, letterSpacing: -0.4 },
  heroSub: { color: '#9DABB9', fontSize: 13.5, lineHeight: 19 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 6 },
  chip: { borderWidth: 1, borderRadius: 7, paddingHorizontal: 8, paddingVertical: 5, backgroundColor: '#23272E' },
  chipTxt: { color: '#C3CDD7', fontFamily: FONT.mono, fontSize: 10, fontWeight: '600', letterSpacing: 0.6 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  cat: { width: '48%', flexGrow: 1, minHeight: 104, borderRadius: RADIUS, padding: 14 },
  catName: { fontSize: 14.5, fontWeight: '600', lineHeight: 18 },
  catCount: { fontSize: 11.5, fontFamily: FONT.mono },
  st: { marginTop: 26 },
  acceso: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: RADIUS },
  accesoTitulo: { fontSize: 15.5, fontWeight: '600' },
  accesoSub: { fontSize: 12.5, lineHeight: 17 },
});
