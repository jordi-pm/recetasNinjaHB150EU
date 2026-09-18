import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { fotoDe } from '@/data/fotos';
import type { Receta } from '@/data/tipos';
import { usePalette } from '@/hooks/use-palette';
import { categoriaPorId, tiempoTotal } from '@/lib/format';
import { useApp } from '@/lib/store';
import { FONT, RADIUS } from '@/theme/colors';

export function RecipeCard({ receta }: { receta: Receta }) {
  const c = usePalette();
  const router = useRouter();
  const { esFav, alternarFav } = useApp();
  const fav = esFav(receta.id);
  const foto = fotoDe(receta.foto);
  const cat = categoriaPorId(receta.cat);

  return (
    <Pressable
      onPress={() => router.push(`/receta/${receta.id}`)}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: c.card, opacity: pressed ? 0.7 : 1, transform: [{ scale: pressed ? 0.99 : 1 }] },
      ]}
      accessibilityRole="button"
      accessibilityLabel={receta.nombre}>
      {foto ? (
        <Image source={foto} style={styles.thumb} contentFit="cover" transition={150} />
      ) : (
        <View style={[styles.thumb, styles.thumbPh, { backgroundColor: c.cardAlt }]}>
          <Text style={{ fontSize: 28 }}>{cat?.emoji}</Text>
        </View>
      )}

      <View style={styles.body}>
        <Text style={[styles.title, { color: c.text }]} numberOfLines={2}>
          {receta.nombre}
        </Text>
        <Text style={[styles.meta, { color: c.muted }]} numberOfLines={1}>
          {tiempoTotal(receta)} min · {receta.raciones} raciones · {receta.dificultad}
        </Text>
        <Text style={[styles.prog, { color: c.tint }]} numberOfLines={1}>
          {receta.programa}
        </Text>
      </View>

      <Pressable
        hitSlop={10}
        onPress={() => alternarFav(receta.id)}
        style={styles.star}
        accessibilityRole="button"
        accessibilityLabel={fav ? 'Quitar de favoritos' : 'Añadir a favoritos'}>
        {Platform.OS === 'ios' ? (
          <SymbolView
            name={fav ? 'star.fill' : 'star'}
            size={22}
            tintColor={fav ? '#F5A524' : c.muted}
            resizeMode="scaleAspectFit"
          />
        ) : (
          <Text style={{ fontSize: 20, opacity: fav ? 1 : 0.3 }}>⭐</Text>
        )}
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 10,
    borderRadius: RADIUS,
  },
  thumb: { width: 76, height: 76, borderRadius: 10 },
  thumbPh: { alignItems: 'center', justifyContent: 'center' },
  body: { flex: 1, gap: 3 },
  title: { fontSize: 16, fontWeight: '600', lineHeight: 20 },
  meta: { fontSize: 12.5, fontFamily: FONT.mono },
  prog: { fontSize: 11.5, fontFamily: FONT.mono, fontWeight: '600' },
  star: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
});
