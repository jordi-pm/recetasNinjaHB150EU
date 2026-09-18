import { Stack, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View,
} from 'react-native';

import { JugGauge } from '@/components/jug-gauge';
import { PanelKey } from '@/components/panel-key';
import { Callout, Card, SectionTitle } from '@/components/ui-kit';
import { MAQUINA } from '@/data/recetas';
import type {
  BotonPanel, CategoriaId, Ingrediente, Paso, Receta, Unidad,
} from '@/data/tipos';
import { usePalette } from '@/hooks/use-palette';
import { cargaMl } from '@/lib/volumen';
import { useApp } from '@/lib/store';
import { FONT, RADIUS } from '@/theme/colors';

const UNIDADES: Unidad[] = ['g', 'ml', 'cda', 'cdta', 'ud', 'diente', 'lata'];
const CATS: { v: CategoriaId; t: string }[] = [
  { v: 'sopas', t: '🥣 Sopas' }, { v: 'frias', t: '🥤 Frías' }, { v: 'calientes', t: '☕ Calientes' },
  { v: 'salsas', t: '🍅 Salsas' }, { v: 'mermelada', t: '🍓 Mermeladas' }, { v: 'postres', t: '🍨 Postres' },
  { v: 'previas', t: '🧅 Previas' },
];
const BOTONES: BotonPanel[] = [
  ...MAQUINA.programas.map((p) => p.b as BotonPanel), 'BLEND', 'COOK', 'PULSE',
];

type FilaIng = { id: number; n: string; c: string; u: Unidad };
type FilaPaso = { id: number; t: string; b: BotonPanel | null; min: string };

/** Editor de recetas propias. Los botones se eligen de una lista cerrada:
 *  aquí tampoco puedes inventarte un programa que tu panel no tiene. */
export default function NuevaReceta() {
  const c = usePalette();
  const router = useRouter();
  const { guardarPropia } = useApp();

  const [nombre, setNombre] = useState('');
  const [cat, setCat] = useState<CategoriaId>('sopas');
  const [raciones, setRaciones] = useState('4');
  const [prep, setPrep] = useState('10');
  const [coccion, setCoccion] = useState('30');
  const [caliente, setCaliente] = useState(true);
  const [ings, setIngs] = useState<FilaIng[]>([{ id: 1, n: '', c: '', u: 'g' }]);
  const [pasos, setPasos] = useState<FilaPaso[]>([{ id: 1, t: '', b: null, min: '' }]);

  const receta = useMemo<Receta>(() => {
    const ing: Ingrediente[] = ings
      .filter((f) => f.n.trim())
      .map((f) => {
        const num = parseFloat(f.c.replace(',', '.'));
        return { c: isFinite(num) && num > 0 ? num : null, u: f.u, n: f.n.trim() };
      });
    const ps: Paso[] = pasos
      .filter((p) => p.t.trim() || p.b)
      .map((p) => {
        const min = parseFloat(p.min.replace(',', '.'));
        return {
          t: p.t.trim() || undefined,
          b: p.b ?? undefined,
          min: isFinite(min) && min > 0 ? min : undefined,
        };
      });
    const rn = Math.max(1, parseInt(raciones, 10) || 1);
    return {
      id: 'propia-' + Date.now(),
      cat, foto: null,
      nombre: nombre.trim() || 'Receta sin nombre',
      original: 'Receta propia',
      raciones: rn, racionesNum: rn,
      prep: parseInt(prep, 10) || 0,
      coccion: parseInt(coccion, 10) || 0,
      dificultad: 'Fácil',
      programa: ps.filter((p) => p.b).map((p) => p.b).join(' & ') || 'MANUAL',
      principal: ing[0]?.n.split(',')[0].split(' ')[0] ?? 'a elegir',
      tags: [], pag: 0,
      limiteMl: caliente ? 1400 : 1600,
      ing, pasos: ps, propia: true,
    };
  }, [nombre, cat, raciones, prep, coccion, caliente, ings, pasos]);

  const carga = cargaMl(receta, 1);
  const pasa = carga > receta.limiteMl;
  const valida = nombre.trim().length > 1 && receta.ing.length > 0 && receta.pasos.length > 0;

  const guardar = () => {
    if (pasa) {
      Alert.alert(
        'Te pasas de la línea',
        `Tu receta da unos ${carga} ml, por encima de la línea ${caliente ? 'HOT (1,4 L)' : 'COLD (1,6 L)'}. ¿La guardas igualmente?`,
        [
          { text: 'Ajustar cantidades', style: 'cancel' },
          { text: 'Guardar igualmente', style: 'destructive', onPress: () => { guardarPropia(receta); router.back(); } },
        ]
      );
      return;
    }
    guardarPropia(receta);
    router.back();
  };

  const Campo = ({ label, valor, onChange, ancho, teclado }: any) => (
    <View style={{ flex: ancho ? 0 : 1, width: ancho }}>
      <Text style={[styles.label, { color: c.muted }]}>{label}</Text>
      <TextInput
        value={valor}
        onChangeText={onChange}
        keyboardType={teclado}
        style={[styles.input, { color: c.text, borderColor: c.separator, backgroundColor: c.cardAlt }]}
      />
    </View>
  );

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Receta tuya',
          headerRight: () => (
            <Pressable onPress={guardar} disabled={!valida} hitSlop={10}>
              <Text style={{ color: valida ? c.tint : c.muted, fontSize: 17, fontWeight: '600' }}>Guardar</Text>
            </Pressable>
          ),
        }}
      />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView
          style={{ backgroundColor: c.bg }}
          contentInsetAdjustmentBehavior="automatic"
          contentContainerStyle={styles.content}
          keyboardDismissMode="on-drag">
          <Callout tone="tip" title="Tus recetas van aparte">
            Se guardan marcadas como tuyas, separadas de las que trae la app. Los nombres de los botones
            se eligen de la lista real de tu panel.
          </Callout>

          <SectionTitle style={styles.st}>Lo básico</SectionTitle>
          <Card style={styles.pad}>
            <Campo label="Nombre" valor={nombre} onChange={setNombre} />
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <Campo label="Raciones" valor={raciones} onChange={setRaciones} teclado="number-pad" />
              <Campo label="Prep. (min)" valor={prep} onChange={setPrep} teclado="number-pad" />
              <Campo label="Cocción (min)" valor={coccion} onChange={setCoccion} teclado="number-pad" />
            </View>
            <Text style={[styles.label, { color: c.muted }]}>Categoría</Text>
            <View style={styles.wrap}>
              {CATS.map((o) => (
                <Pressable
                  key={o.v}
                  onPress={() => setCat(o.v)}
                  style={[styles.chip, { backgroundColor: cat === o.v ? c.panel : c.cardAlt, borderColor: cat === o.v ? c.panel : c.separator }]}>
                  <Text style={{ color: cat === o.v ? '#FFF' : c.text, fontSize: 13.5 }}>{o.t}</Text>
                </Pressable>
              ))}
            </View>
            <Text style={[styles.label, { color: c.muted }]}>¿Lleva calor?</Text>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              {([[true, '🔥 Sí · límite HOT 1,4 L'], [false, '🧊 No · límite COLD 1,6 L']] as const).map(([v, t]) => (
                <Pressable
                  key={String(v)}
                  onPress={() => setCaliente(v)}
                  style={[styles.chip, { flex: 1, alignItems: 'center', backgroundColor: caliente === v ? c.panel : c.cardAlt, borderColor: caliente === v ? c.panel : c.separator }]}>
                  <Text style={{ color: caliente === v ? '#FFF' : c.text, fontSize: 13 }}>{t}</Text>
                </Pressable>
              ))}
            </View>
          </Card>

          <SectionTitle style={styles.st}>Ingredientes</SectionTitle>
          <Card style={styles.pad}>
            {ings.map((f, i) => (
              <View key={f.id} style={[styles.fila, i > 0 && { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: c.separator, paddingTop: 10 }]}>
                <TextInput
                  value={f.n}
                  onChangeText={(n) => setIngs((p) => p.map((x) => (x.id === f.id ? { ...x, n } : x)))}
                  placeholder="cebolla, caldo de verduras…"
                  placeholderTextColor={c.muted}
                  style={[styles.input, { color: c.text, borderColor: c.separator, backgroundColor: c.cardAlt, flex: 1 }]}
                />
                <TextInput
                  value={f.c}
                  onChangeText={(v) => setIngs((p) => p.map((x) => (x.id === f.id ? { ...x, c: v } : x)))}
                  keyboardType="decimal-pad"
                  placeholder="0"
                  placeholderTextColor={c.muted}
                  style={[styles.input, { color: c.text, borderColor: c.separator, backgroundColor: c.cardAlt, width: 60, textAlign: 'right' }]}
                />
                <Pressable
                  onPress={() => setIngs((p) => p.map((x) => (x.id === f.id ? { ...x, u: UNIDADES[(UNIDADES.indexOf(x.u) + 1) % UNIDADES.length] } : x)))}
                  style={[styles.unidad, { borderColor: c.separator }]}>
                  <Text style={{ color: c.tint, fontFamily: FONT.mono, fontSize: 12.5, fontWeight: '700' }}>{f.u}</Text>
                </Pressable>
                <Pressable onPress={() => setIngs((p) => (p.length === 1 ? p : p.filter((x) => x.id !== f.id)))} hitSlop={8}>
                  <Text style={{ color: c.muted, fontSize: 19 }}>×</Text>
                </Pressable>
              </View>
            ))}
            <Pressable onPress={() => setIngs((p) => [...p, { id: Date.now(), n: '', c: '', u: 'g' }])} style={[styles.ghost, { borderColor: c.separator }]}>
              <Text style={{ color: c.tint, fontSize: 15, fontWeight: '600' }}>+ Ingrediente</Text>
            </Pressable>

            <View style={styles.gauge}>
              <JugGauge cargaMl={carga} limiteMl={receta.limiteMl} />
              <Text style={[styles.body, { color: pasa ? c.danger : c.muted, flex: 1 }]}>
                {carga} ml de {receta.limiteMl} ml{'\n'}
                <Text style={{ fontSize: 11.5 }}>{pasa ? 'Te pasas de la línea grabada.' : 'Cabe, según el cálculo de la app (±20 %).'}</Text>
              </Text>
            </View>
          </Card>

          <SectionTitle style={styles.st}>Pasos</SectionTitle>
          <Card style={styles.pad}>
            {pasos.map((p, i) => (
              <View key={p.id} style={[{ gap: 8 }, i > 0 && { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: c.separator, paddingTop: 12 }]}>
                <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
                  <Text style={[styles.numPaso, { color: c.muted }]}>{i + 1}</Text>
                  <TextInput
                    value={p.t}
                    onChangeText={(t) => setPasos((x) => x.map((y) => (y.id === p.id ? { ...y, t } : y)))}
                    placeholder="Qué hay que hacer"
                    placeholderTextColor={c.muted}
                    style={[styles.input, { color: c.text, borderColor: c.separator, backgroundColor: c.cardAlt, flex: 1 }]}
                  />
                  <Pressable onPress={() => setPasos((x) => (x.length === 1 ? x : x.filter((y) => y.id !== p.id)))} hitSlop={8}>
                    <Text style={{ color: c.muted, fontSize: 19 }}>×</Text>
                  </Pressable>
                </View>
                <View style={styles.wrap}>
                  <Pressable
                    onPress={() => setPasos((x) => x.map((y) => (y.id === p.id ? { ...y, b: null } : y)))}
                    style={[styles.chip, { backgroundColor: !p.b ? c.panel : c.cardAlt, borderColor: !p.b ? c.panel : c.separator }]}>
                    <Text style={{ color: !p.b ? '#FFF' : c.text, fontSize: 12.5 }}>sin botón</Text>
                  </Pressable>
                  {BOTONES.map((b) => (
                    <Pressable
                      key={b}
                      onPress={() => setPasos((x) => x.map((y) => (y.id === p.id ? { ...y, b } : y)))}
                      style={{ opacity: p.b === b ? 1 : 0.45 }}>
                      <PanelKey label={b} size="sm" />
                    </Pressable>
                  ))}
                </View>
                {p.b && (
                  <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
                    <Text style={[styles.body, { color: c.muted }]}>Minutos (opcional):</Text>
                    <TextInput
                      value={p.min}
                      onChangeText={(min) => setPasos((x) => x.map((y) => (y.id === p.id ? { ...y, min } : y)))}
                      keyboardType="decimal-pad"
                      placeholder="—"
                      placeholderTextColor={c.muted}
                      style={[styles.input, { color: c.text, borderColor: c.separator, backgroundColor: c.cardAlt, width: 70, textAlign: 'center' }]}
                    />
                  </View>
                )}
              </View>
            ))}
            <Pressable onPress={() => setPasos((p) => [...p, { id: Date.now(), t: '', b: null, min: '' }])} style={[styles.ghost, { borderColor: c.separator }]}>
              <Text style={{ color: c.tint, fontSize: 15, fontWeight: '600' }}>+ Paso</Text>
            </Pressable>
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 16, maxWidth: 720, width: '100%', alignSelf: 'center', paddingBottom: 60, paddingTop: 8 },
  st: { marginTop: 24 },
  pad: { padding: 14, gap: 12, borderRadius: RADIUS },
  label: { fontSize: 12.5, fontWeight: '600', marginBottom: 5 },
  input: { borderWidth: 1, borderRadius: 9, paddingHorizontal: 11, paddingVertical: 11, fontSize: 15 },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 7, alignItems: 'center' },
  chip: { borderWidth: 1, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 7 },
  fila: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  unidad: { borderWidth: 1, borderRadius: 9, paddingHorizontal: 9, paddingVertical: 12 },
  ghost: { borderWidth: 1, borderRadius: 11, paddingVertical: 12, alignItems: 'center' },
  gauge: { flexDirection: 'row', gap: 16, alignItems: 'center', marginTop: 4 },
  body: { fontSize: 13.5, lineHeight: 19 },
  numPaso: { fontFamily: FONT.mono, fontSize: 13, fontWeight: '700', width: 16 },
});
