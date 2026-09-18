import { Stack, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { FlatList, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { RecipeCard } from '@/components/recipe-card';
import { SectionTitle } from '@/components/ui-kit';
import { CATEGORIAS, RECETAS } from '@/data/recetas';
import type { Categoria, Receta } from '@/data/tipos';
import { usePalette } from '@/hooks/use-palette';
import { filtrar, ingredientesPrincipales, type Filtros } from '@/lib/format';
import type { Palette } from '@/theme/colors';

type Opcion = { v: string | number; t: string };

function Chip({
  label, activo, onPress, c,
}: { label: string; activo: boolean; onPress: () => void; c: Palette }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        {
          backgroundColor: activo ? c.panel : c.card,
          borderColor: activo ? c.panel : c.separator,
          opacity: pressed ? 0.6 : 1,
        },
      ]}>
      <Text style={{ color: activo ? '#FFF' : c.text, fontSize: 14, fontWeight: activo ? '600' : '400' }}>
        {label}
      </Text>
    </Pressable>
  );
}

function FilaFiltro({
  label, valor, opciones, onSet, c,
}: {
  label: string;
  valor: string | number | undefined;
  opciones: Opcion[];
  onSet: (v: string | number | undefined) => void;
  c: Palette;
}) {
  return (
    <View style={{ marginBottom: 12 }}>
      <SectionTitle>{label}</SectionTitle>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
        <Chip c={c} label="Todo" activo={valor === undefined} onPress={() => onSet(undefined)} />
        {opciones.map((o) => (
          <Chip
            key={String(o.v)}
            c={c}
            label={o.t}
            activo={String(valor) === String(o.v)}
            onPress={() => onSet(valor === o.v ? undefined : o.v)}
          />
        ))}
      </ScrollView>
    </View>
  );
}

export default function Buscar() {
  const c = usePalette();
  const params = useLocalSearchParams<{ cat?: string }>();
  const [q, setQ] = useState('');
  const [filtros, setFiltros] = useState<Filtros>({});

  useEffect(() => {
    if (params.cat) setFiltros((f) => ({ ...f, cat: params.cat }));
  }, [params.cat]);

  const resultados = useMemo(() => filtrar(q, filtros), [q, filtros]);
  const activos = Object.keys(filtros).length > 0 || q.length > 0;

  const set = useCallback(
    (key: keyof Filtros) => (v: string | number | undefined) =>
      setFiltros((f) => {
        const next = { ...f };
        if (v === undefined) delete next[key];
        else (next as any)[key] = v;
        return next;
      }),
    []
  );

  const catsConRecetas = useMemo(
    () =>
      (CATEGORIAS as Categoria[])
        .filter((cat) => (RECETAS as Receta[]).some((r) => r.cat === cat.id))
        .map((cat) => ({ v: cat.id, t: `${cat.emoji} ${cat.nombre}` })),
    []
  );
  const principales = useMemo(() => ingredientesPrincipales().map((p) => ({ v: p, t: p })), []);

  const cabecera = (
    <View style={{ marginBottom: 18 }}>
      <FilaFiltro c={c} label="Tipo de receta" valor={filtros.cat} opciones={catsConRecetas} onSet={set('cat')} />
      <FilaFiltro
        c={c}
        label="Tiempo total"
        valor={filtros.tiempo}
        opciones={[{ v: 10, t: '≤ 10 min' }, { v: 25, t: '≤ 25 min' }, { v: 40, t: '≤ 40 min' }]}
        onSet={set('tiempo')}
      />
      <FilaFiltro c={c} label="Ingrediente principal" valor={filtros.principal} opciones={principales} onSet={set('principal')} />
      <FilaFiltro
        c={c}
        label="Dieta"
        valor={filtros.dieta}
        opciones={[{ v: 'vegetariana', t: 'Vegetariana' }, { v: 'vegana', t: 'Vegana' }]}
        onSet={set('dieta')}
      />
      <FilaFiltro
        c={c}
        label="Bebida"
        valor={filtros.temp}
        opciones={[{ v: 'fria', t: '🥤 Fría' }, { v: 'caliente', t: '☕ Caliente' }]}
        onSet={set('temp')}
      />
      <FilaFiltro
        c={c}
        label="Textura de sopa"
        valor={filtros.textura}
        opciones={[{ v: 'suave', t: 'Suave' }, { v: 'trozos', t: 'Con trozos' }]}
        onSet={set('textura')}
      />
      <View style={styles.countRow}>
        <Text style={[styles.count, { color: c.text }]}>
          {resultados.length} receta{resultados.length === 1 ? '' : 's'}
        </Text>
        {activos && (
          <Pressable
            onPress={() => {
              setFiltros({});
              setQ('');
            }}>
            <Text style={{ color: c.tint, fontSize: 15 }}>Limpiar</Text>
          </Pressable>
        )}
      </View>
    </View>
  );

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Buscar',
          headerSearchBarOptions: {
            placeholder: 'calabacín, pollo, chocolate…',
            onChangeText: (e: any) => setQ(e.nativeEvent.text),
            hideWhenScrolling: false,
            autoCapitalize: 'none',
          },
        }}
      />
      <FlatList
        style={{ backgroundColor: c.bg }}
        contentInsetAdjustmentBehavior="automatic"
        keyboardDismissMode="on-drag"
        data={resultados}
        keyExtractor={(r) => r.id}
        contentContainerStyle={styles.content}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        ListHeaderComponent={cabecera}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={{ fontSize: 40 }}>🔍</Text>
            <Text style={[styles.emptyTxt, { color: c.muted }]}>
              Ninguna receta compatible con la HB150EU coincide con esa búsqueda.
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
  chipRow: { gap: 8, paddingRight: 16 },
  chip: { borderWidth: 1, borderRadius: 999, paddingHorizontal: 14, paddingVertical: 8 },
  countRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 },
  count: { fontSize: 20, fontWeight: '700' },
  empty: { alignItems: 'center', gap: 12, paddingVertical: 50, paddingHorizontal: 30 },
  emptyTxt: { fontSize: 15, textAlign: 'center', lineHeight: 21 },
});
