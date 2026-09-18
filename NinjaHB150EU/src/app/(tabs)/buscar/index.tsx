import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  FlatList, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, View,
} from 'react-native';

import { RecipeCard } from '@/components/recipe-card';
import { SectionTitle } from '@/components/ui-kit';
import { CATEGORIAS } from '@/data/recetas';
import type { Alergeno } from '@/data/tipos';
import { usePalette } from '@/hooks/use-palette';
import {
  buscarAyuda, filtrar, ingredientesPrincipales, nFiltros, NOMBRE_ALERGENO, type Filtros,
} from '@/lib/format';
import { useRecetas } from '@/lib/store';
import type { Palette } from '@/theme/colors';

type Opcion = { v: string | number; t: string };

const DESPENSA = [
  'cebolla', 'ajo', 'zanahoria', 'patata', 'tomate', 'calabaza', 'calabacín', 'puerro',
  'apio', 'coliflor', 'champiñón', 'espinaca', 'caldo', 'nata', 'leche', 'mantequilla',
  'aceite', 'pollo', 'chocolate', 'fresa', 'plátano', 'piña', 'azúcar', 'hielo',
];

function Chip({ label, activo, onPress, c }: { label: string; activo: boolean; onPress: () => void; c: Palette }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: activo }}
      style={({ pressed }) => [
        styles.chip,
        { backgroundColor: activo ? c.panel : c.card, borderColor: activo ? c.panel : c.separator, opacity: pressed ? 0.6 : 1 },
      ]}>
      <Text style={{ color: activo ? '#FFF' : c.text, fontSize: 14, fontWeight: activo ? '600' : '400' }}>{label}</Text>
    </Pressable>
  );
}

function FilaFiltro({
  label, valor, opciones, onSet, c,
}: { label: string; valor: string | number | undefined; opciones: Opcion[]; onSet: (v: any) => void; c: Palette }) {
  return (
    <View style={{ marginBottom: 16 }}>
      <SectionTitle>{label}</SectionTitle>
      <View style={styles.wrap}>
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
      </View>
    </View>
  );
}

export default function Buscar() {
  const c = usePalette();
  const params = useLocalSearchParams<{ cat?: string }>();
  const router = useRouter();
  const recetas = useRecetas();
  const [q, setQ] = useState('');
  const [filtros, setFiltros] = useState<Filtros>({});
  const [abierto, setAbierto] = useState(false);

  useEffect(() => {
    if (params.cat) setFiltros((f) => ({ ...f, cat: params.cat }));
  }, [params.cat]);

  const resultados = useMemo(() => filtrar(q, filtros, recetas), [q, filtros, recetas]);
  const ayuda = useMemo(() => buscarAyuda(q), [q]);
  const n = nFiltros(filtros);

  const set = useCallback(
    (key: keyof Filtros) => (v: any) =>
      setFiltros((f) => {
        const next = { ...f };
        if (v === undefined) delete next[key];
        else (next as any)[key] = v;
        return next;
      }),
    []
  );

  const alternarTengo = (ing: string) =>
    setFiltros((f) => {
      const tengo = f.tengo ?? [];
      const next = tengo.includes(ing) ? tengo.filter((x) => x !== ing) : [...tengo, ing];
      return { ...f, tengo: next.length ? next : undefined };
    });

  const catsConRecetas = useMemo(
    () => CATEGORIAS.filter((cat) => recetas.some((r) => r.cat === cat.id)).map((cat) => ({ v: cat.id, t: `${cat.emoji} ${cat.nombre}` })),
    [recetas]
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
          headerRight: () => (
            <Pressable onPress={() => setAbierto(true)} hitSlop={10} accessibilityLabel={`Filtros${n ? `, ${n} activos` : ''}`}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                {Platform.OS === 'ios' ? (
                  <SymbolView
                    name={n ? 'line.3.horizontal.decrease.circle.fill' : 'line.3.horizontal.decrease.circle'}
                    size={21}
                    tintColor={c.tint}
                    resizeMode="scaleAspectFit"
                  />
                ) : (
                  <Text style={{ color: c.tint, fontSize: 15 }}>Filtros</Text>
                )}
                {n > 0 && (
                  <View style={[styles.badge, { backgroundColor: c.tint }]}>
                    <Text style={styles.badgeTxt}>{n}</Text>
                  </View>
                )}
              </View>
            </Pressable>
          ),
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
        ListHeaderComponent={
          <View>
            {ayuda.length > 0 && (
              <View style={{ marginBottom: 18, gap: 8 }}>
                <SectionTitle>Del manual</SectionTitle>
                {ayuda.map((a, i) => (
                  <Pressable
                    key={i}
                    onPress={() => router.push('/maquina')}
                    style={({ pressed }) => [styles.ayudaCard, { backgroundColor: c.card, opacity: pressed ? 0.7 : 1 }]}>
                    <View style={{ flex: 1, gap: 3 }}>
                      <Text style={[styles.ayudaOrigen, { color: c.hot }]}>{a.origen.toUpperCase()}</Text>
                      <Text style={[styles.ayudaTitulo, { color: c.text }]}>{a.titulo}</Text>
                      <Text style={[styles.ayudaTxt, { color: c.textSoft }]} numberOfLines={3}>{a.texto}</Text>
                    </View>
                    <Text style={{ color: c.muted, fontSize: 19 }}>›</Text>
                  </Pressable>
                ))}
              </View>
            )}
          <View style={styles.cabecera}>
            <Text style={[styles.count, { color: c.text }]}>
              {resultados.length} receta{resultados.length === 1 ? '' : 's'}
            </Text>
            <View style={{ flexDirection: 'row', gap: 14, alignItems: 'center' }}>
              <Pressable
                onPress={() =>
                  set('orden')(filtros.orden === 'tiempo' ? undefined : 'tiempo')
                }>
                <Text style={{ color: filtros.orden === 'tiempo' ? c.tint : c.muted, fontSize: 14 }}>
                  {filtros.orden === 'tiempo' ? '↑ por tiempo' : 'por nombre'}
                </Text>
              </Pressable>
              {(n > 0 || q) && (
                <Pressable onPress={() => { setFiltros({}); setQ(''); }}>
                  <Text style={{ color: c.tint, fontSize: 14 }}>Limpiar</Text>
                </Pressable>
              )}
            </View>
          </View>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={{ fontSize: 40 }}>🔍</Text>
            <Text style={[styles.emptyTxt, { color: c.muted }]}>
              Ninguna receta coincide con esa búsqueda.
            </Text>
          </View>
        }
        renderItem={({ item }) => <RecipeCard receta={item} />}
      />

      {/* hoja de filtros */}
      <Modal
        visible={abierto}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setAbierto(false)}>
        <View style={{ flex: 1, backgroundColor: c.bg }}>
          <View style={[styles.sheetTop, { borderBottomColor: c.separator }]}>
            <Pressable onPress={() => setFiltros({})} hitSlop={10}>
              <Text style={{ color: n ? c.tint : c.muted, fontSize: 16 }}>Limpiar</Text>
            </Pressable>
            <Text style={[styles.sheetTitulo, { color: c.text }]}>Filtros</Text>
            <Pressable onPress={() => setAbierto(false)} hitSlop={10}>
              <Text style={{ color: c.tint, fontSize: 16, fontWeight: '600' }}>Listo</Text>
            </Pressable>
          </View>
          <ScrollView contentContainerStyle={styles.sheetBody}>
            <FilaFiltro c={c} label="Tipo de receta" valor={filtros.cat} opciones={catsConRecetas} onSet={set('cat')} />
            <FilaFiltro c={c} label="Tiempo total" valor={filtros.tiempo}
              opciones={[{ v: 10, t: '≤ 10 min' }, { v: 25, t: '≤ 25 min' }, { v: 40, t: '≤ 40 min' }]} onSet={set('tiempo')} />
            <FilaFiltro c={c} label="Ingrediente principal" valor={filtros.principal}
              opciones={ingredientesPrincipales(recetas).map((p) => ({ v: p, t: p }))} onSet={set('principal')} />
            <FilaFiltro c={c} label="Dieta" valor={filtros.dieta}
              opciones={[{ v: 'vegetariana', t: 'Vegetariana' }, { v: 'vegana', t: 'Vegana' }]} onSet={set('dieta')} />
            <FilaFiltro c={c} label="Sin este alérgeno" valor={filtros.sinAlergeno}
              opciones={(['lacteos', 'gluten', 'frutos-secos', 'huevo', 'alcohol'] as Alergeno[]).map((a) => ({ v: a, t: NOMBRE_ALERGENO[a] }))}
              onSet={set('sinAlergeno')} />
            <FilaFiltro c={c} label="Bebida" valor={filtros.temp}
              opciones={[{ v: 'fria', t: '🥤 Fría' }, { v: 'caliente', t: '☕ Caliente' }]} onSet={set('temp')} />
            <FilaFiltro c={c} label="Textura de sopa" valor={filtros.textura}
              opciones={[{ v: 'suave', t: 'Suave' }, { v: 'trozos', t: 'Con trozos' }]} onSet={set('textura')} />
            <FilaFiltro c={c} label="Ordenar por" valor={filtros.orden}
              opciones={[{ v: 'tiempo', t: 'Tiempo' }, { v: 'dificultad', t: 'Dificultad' }]} onSet={set('orden')} />

            <SectionTitle>Lo que tengo en casa</SectionTitle>
            <Text style={[styles.ayuda, { color: c.muted }]}>
              Marca lo que tengas y te enseñamos las recetas que puedes hacer casi enteras.
            </Text>
            <View style={styles.wrap}>
              {DESPENSA.map((ing) => (
                <Chip
                  key={ing}
                  c={c}
                  label={ing}
                  activo={!!filtros.tengo?.includes(ing)}
                  onPress={() => alternarTengo(ing)}
                />
              ))}
            </View>

            <Pressable
              onPress={() => setAbierto(false)}
              style={[styles.verBtn, { backgroundColor: c.panel }]}>
              <Text style={styles.verTxt}>
                Ver {resultados.length} receta{resultados.length === 1 ? '' : 's'}
              </Text>
            </Pressable>
          </ScrollView>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 16, maxWidth: 720, width: '100%', alignSelf: 'center', paddingBottom: 40 },
  cabecera: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 },
  count: { fontSize: 20, fontWeight: '700' },
  badge: { minWidth: 17, height: 17, borderRadius: 9, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4 },
  badgeTxt: { color: '#FFF', fontSize: 11, fontWeight: '700' },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  ayudaCard: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 14, borderRadius: 14 },
  ayudaOrigen: { fontSize: 10, fontWeight: '700', letterSpacing: 0.8 },
  ayudaTitulo: { fontSize: 15.5, fontWeight: '600' },
  ayudaTxt: { fontSize: 13, lineHeight: 18 },
  chip: { borderWidth: 1, borderRadius: 999, paddingHorizontal: 14, paddingVertical: 8 },
  sheetTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: StyleSheet.hairlineWidth },
  sheetTitulo: { fontSize: 17, fontWeight: '700' },
  sheetBody: { padding: 16, paddingBottom: 48 },
  ayuda: { fontSize: 13, lineHeight: 18, marginBottom: 10 },
  verBtn: { borderRadius: 13, paddingVertical: 16, alignItems: 'center', marginTop: 26 },
  verTxt: { color: '#FFF', fontSize: 16.5, fontWeight: '700' },
  empty: { alignItems: 'center', gap: 12, paddingVertical: 50, paddingHorizontal: 30 },
  emptyTxt: { fontSize: 15, textAlign: 'center', lineHeight: 21 },
});
