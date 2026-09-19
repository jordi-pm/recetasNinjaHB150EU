import { Stack, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Platform, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SymbolView } from 'expo-symbols';

import { RecipeCard } from '@/components/recipe-card';
import { usePalette } from '@/hooks/use-palette';
import { useApp, useRecetas } from '@/lib/store';
import { FONT, RADIUS } from '@/theme/colors';

type Vista = 'favoritas' | 'mias' | 'historial';

const fecha = (ms: number) =>
  new Date(ms).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });

const CUPO = { sobrada: 'cupo de sobra', justa: 'cupo justa', 'se-paso': 'se pasó de la línea' } as const;

export default function Favoritos() {
  const c = usePalette();
  const router = useRouter();
  const { fav, historial, propias } = useApp();
  const recetas = useRecetas();
  const [vista, setVista] = useState<Vista>('favoritas');

  const botonNueva = () => (
    <Pressable onPress={() => router.push('/nueva-receta')} hitSlop={12} accessibilityLabel="Crear una receta">
      {Platform.OS === 'ios' ? (
        <SymbolView name="plus" size={20} tintColor={c.tint} resizeMode="scaleAspectFit" />
      ) : (
        <Text style={{ color: c.tint, fontSize: 24 }}>+</Text>
      )}
    </Pressable>
  );

  const favoritas = useMemo(
    () => fav.map((id) => recetas.find((r) => r.id === id)).filter(Boolean),
    [fav, recetas]
  );

  const selector = (
    <View style={[styles.seg, { backgroundColor: c.cardAlt }]}>
      {(['favoritas', 'mias', 'historial'] as Vista[]).map((v) => (
        <Pressable
          key={v}
          onPress={() => setVista(v)}
          style={[styles.segBtn, vista === v && { backgroundColor: c.card }]}
          accessibilityRole="tab"
          accessibilityState={{ selected: vista === v }}>
          <Text style={{ color: c.text, fontWeight: vista === v ? '600' : '400', fontSize: 13.5 }}>
            {v === 'favoritas'
              ? `⭐ ${fav.length || ''}`.trim() || '⭐'
              : v === 'mias'
                ? `✏️ Mías${propias.length ? ` · ${propias.length}` : ''}`
                : `🕘 ${historial.length || ''}`.trim() || '🕘'}
          </Text>
        </Pressable>
      ))}
    </View>
  );

  if (vista === 'mias') {
    return (
      <>
        <Stack.Screen options={{ title: 'Favoritos', headerRight: botonNueva }} />
        <FlatList
          style={{ backgroundColor: c.bg }}
          contentInsetAdjustmentBehavior="automatic"
          data={propias}
          keyExtractor={(r) => r.id}
          contentContainerStyle={styles.content}
          ListHeaderComponent={<View style={{ marginBottom: 16 }}>{selector}</View>}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={{ fontSize: 40 }}>✏️</Text>
              <Text style={[styles.emptyTxt, { color: c.muted }]}>
                Aquí van tus recetas.{'\n'}Las guarda con el mismo control de capacidad que el resto.
              </Text>
              <Pressable
                onPress={() => router.push('/nueva-receta')}
                style={[styles.cta, { backgroundColor: c.panel }]}>
                <Text style={styles.ctaTxt}>+ Crear mi primera receta</Text>
              </Pressable>
            </View>
          }
          ListFooterComponent={
            propias.length ? (
              <Pressable
                onPress={() => router.push('/nueva-receta')}
                style={[styles.ctaGhost, { borderColor: c.separator }]}>
                <Text style={{ color: c.tint, fontSize: 15.5, fontWeight: '600' }}>+ Crear otra receta</Text>
              </Pressable>
            ) : null
          }
          renderItem={({ item }) => <RecipeCard receta={item} />}
        />
      </>
    );
  }

  if (vista === 'historial') {
    return (
      <>
        <Stack.Screen options={{ title: 'Favoritos', headerRight: botonNueva }} />
        <FlatList
          style={{ backgroundColor: c.bg }}
          contentInsetAdjustmentBehavior="automatic"
          data={historial}
          keyExtractor={(h) => String(h.fecha)}
          contentContainerStyle={styles.content}
          ListHeaderComponent={<View style={{ marginBottom: 16 }}>{selector}</View>}
          ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={{ fontSize: 40 }}>🕘</Text>
              <Text style={[styles.emptyTxt, { color: c.muted }]}>
                Aquí se apunta cada receta que terminas en el modo «Cocinar ahora».
              </Text>
            </View>
          }
          renderItem={({ item }) => {
            const r = recetas.find((x) => x.id === item.id);
            return (
              <Pressable
                onPress={() => r && router.push(`/receta/${r.id}`)}
                style={({ pressed }) => [styles.hist, { backgroundColor: c.card, opacity: pressed ? 0.7 : 1 }]}>
                <View style={{ flex: 1, gap: 3 }}>
                  <Text style={[styles.histTitulo, { color: c.text }]}>{r?.nombre ?? 'Receta borrada'}</Text>
                  <Text style={[styles.histMeta, { color: c.muted }]}>
                    {fecha(item.fecha)} · {item.escala}×{item.cupo ? ` · ${CUPO[item.cupo]}` : ''}
                  </Text>
                </View>
                <Text style={{ color: c.muted, fontSize: 19 }}>›</Text>
              </Pressable>
            );
          }}
        />
      </>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: 'Favoritos', headerRight: botonNueva }} />
      <FlatList
        style={{ backgroundColor: c.bg }}
        contentInsetAdjustmentBehavior="automatic"
        data={favoritas as any[]}
        keyExtractor={(r) => r.id}
        contentContainerStyle={styles.content}
        ListHeaderComponent={<View style={{ marginBottom: 16 }}>{selector}</View>}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={{ fontSize: 40 }}>⭐</Text>
            <Text style={[styles.emptyTxt, { color: c.muted }]}>
              Todavía no has marcado ninguna receta.{'\n'}Pulsa la estrella en cualquier receta.
            </Text>
          </View>
        }
        renderItem={({ item }) => <RecipeCard receta={item} />}
      />
    </>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 16, maxWidth: 720, width: '100%', alignSelf: 'center', paddingBottom: 40 },
  seg: { flexDirection: 'row', borderRadius: 10, padding: 3, gap: 3 },
  segBtn: { flex: 1, alignItems: 'center', paddingVertical: 9, borderRadius: 8 },
  hist: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: RADIUS },
  histTitulo: { fontSize: 15.5, fontWeight: '600' },
  histMeta: { fontSize: 12.5, fontFamily: FONT.mono },
  empty: { alignItems: 'center', gap: 12, paddingVertical: 50, paddingHorizontal: 30 },
  cta: { borderRadius: 13, paddingVertical: 15, paddingHorizontal: 26, marginTop: 6 },
  ctaTxt: { color: '#FFF', fontSize: 16, fontWeight: '700' },
  ctaGhost: { borderWidth: 1, borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginTop: 14 },
  emptyTxt: { fontSize: 15, textAlign: 'center', lineHeight: 21 },
});
