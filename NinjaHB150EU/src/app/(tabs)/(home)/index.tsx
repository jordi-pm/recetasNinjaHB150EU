import { Stack, useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { RecipeCard } from '@/components/recipe-card';
import { Card, Eyebrow, SectionTitle } from '@/components/ui-kit';
import { CATEGORIAS, RECETAS } from '@/data/recetas';
import type { Categoria, Receta } from '@/data/tipos';
import { usePalette } from '@/hooks/use-palette';
import { recetaPorId } from '@/lib/format';
import { useApp } from '@/lib/store';
import { FONT, RADIUS } from '@/theme/colors';

const DESTACADAS = ['calabaza', 'verduras-trozos', 'smoothie-fresa-pina'];

export default function Inicio() {
  const c = usePalette();
  const router = useRouter();
  const { fav } = useApp();
  const oficiales = (RECETAS as Receta[]).filter((r) => !r.plantilla && !r.tecnica).length;

  const conRecetas = (CATEGORIAS as Categoria[])
    .map((cat) => ({ cat, n: (RECETAS as Receta[]).filter((r) => r.cat === cat.id).length }))
    .filter((x) => x.n > 0);

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Recetas',
          headerRight: () => (
            <Pressable
              onPress={() => router.push('/ajustes')}
              hitSlop={12}
              accessibilityLabel="Ajustes de la app">
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
        {/* Panel de control como cabecera */}
        <View style={[styles.hero, { backgroundColor: c.hero }]}>
          <Eyebrow color="#8B99A8">Recetario personal</Eyebrow>
          <Text style={styles.heroTitle}>Ninja Foodi{'\n'}Blender & Soup Maker</Text>
          <Text style={styles.heroSub}>
            Solo recetas del manual y el recetario oficiales del HB150EU. Sin Air Fryer, Multicooker ni otros modelos.
          </Text>
          <View style={styles.chips}>
            {[`${oficiales} recetas oficiales`, '10 programas Auto-iQ', '1,4 L HOT · 1,6 L COLD'].map((t) => (
              <View key={t} style={[styles.chip, { borderColor: c.panelBorder }]}>
                <Text style={styles.chipTxt} allowFontScaling={false}>
                  {t.toUpperCase()}
                </Text>
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
              style={({ pressed }) => [
                styles.cat,
                { backgroundColor: c.card, opacity: pressed ? 0.6 : 1 },
              ]}>
              <Text style={{ fontSize: 26 }}>{cat.emoji}</Text>
              <View style={{ marginTop: 'auto', gap: 2 }}>
                <Text style={[styles.catName, { color: c.text }]}>{cat.nombre}</Text>
                <Text style={[styles.catCount, { color: c.muted }]}>
                  {n} receta{n > 1 ? 's' : ''}
                </Text>
              </View>
            </Pressable>
          ))}
        </View>

        {fav.length > 0 && (
          <>
            <SectionTitle style={{ marginTop: 26 }}>Tus favoritas</SectionTitle>
            <View style={{ gap: 10 }}>
              {fav.slice(0, 3).map((id) => {
                const r = recetaPorId(id);
                return r ? <RecipeCard key={id} receta={r} /> : null;
              })}
            </View>
          </>
        )}

        <SectionTitle style={{ marginTop: 26 }}>Empieza por aquí</SectionTitle>
        <View style={{ gap: 10 }}>
          {DESTACADAS.map((id) => {
            const r = recetaPorId(id);
            return r ? <RecipeCard key={id} receta={r} /> : null;
          })}
        </View>

        <SectionTitle style={{ marginTop: 26 }}>Antes de cocinar</SectionTitle>
        <Card>
          <Pressable
            onPress={() => router.push('/maquina')}
            style={({ pressed }) => [styles.row, { opacity: pressed ? 0.6 : 1 }]}>
            <View style={{ flex: 1, gap: 3 }}>
              <Text style={[styles.rowTitle, { color: c.text }]}>Mi HB150EU</Text>
              <Text style={[styles.rowSub, { color: c.muted }]}>
                Los 10 programas con los nombres exactos del panel, límites de llenado y todos los avisos del manual.
              </Text>
            </View>
            <Text style={{ color: c.muted, fontSize: 20 }}>›</Text>
          </Pressable>
        </Card>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 16, paddingBottom: 40, gap: 0 },
  hero: { borderRadius: RADIUS, padding: 18, gap: 8, marginBottom: 26 },
  heroTitle: { color: '#FFFFFF', fontSize: 25, fontWeight: '700', lineHeight: 29, letterSpacing: -0.4 },
  heroSub: { color: '#9DABB9', fontSize: 13.5, lineHeight: 19 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 6 },
  chip: { borderWidth: 1, borderRadius: 7, paddingHorizontal: 8, paddingVertical: 5, backgroundColor: '#23272E' },
  chipTxt: { color: '#C3CDD7', fontFamily: FONT.mono, fontSize: 10, fontWeight: '600', letterSpacing: 0.6 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  cat: {
    width: '48%',
    flexGrow: 1,
    minHeight: 104,
    borderRadius: RADIUS,
    padding: 14,
  },
  catName: { fontSize: 14.5, fontWeight: '600', lineHeight: 18 },
  catCount: { fontSize: 11.5, fontFamily: FONT.mono },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14 },
  rowTitle: { fontSize: 16, fontWeight: '600' },
  rowSub: { fontSize: 13, lineHeight: 18 },
});
