import { Stack } from 'expo-router';
import { FlatList, StyleSheet, Text, View } from 'react-native';

import { RecipeCard } from '@/components/recipe-card';
import { usePalette } from '@/hooks/use-palette';
import { recetaPorId } from '@/lib/format';
import { useApp } from '@/lib/store';

export default function Favoritos() {
  const c = usePalette();
  const { fav } = useApp();
  const recetas = fav.map(recetaPorId).filter(Boolean);

  return (
    <>
      <Stack.Screen options={{ title: 'Favoritos' }} />
      <FlatList
        style={{ backgroundColor: c.bg }}
        contentInsetAdjustmentBehavior="automatic"
        data={recetas as any[]}
        keyExtractor={(r) => r.id}
        contentContainerStyle={styles.content}
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
  content: { paddingHorizontal: 16, paddingBottom: 40 },
  empty: { alignItems: 'center', gap: 12, paddingVertical: 60, paddingHorizontal: 30 },
  emptyTxt: { fontSize: 15, textAlign: 'center', lineHeight: 21 },
});
