import { Stack } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useMemo, useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { JugGauge } from '@/components/jug-gauge';
import { Callout, Card, SectionTitle } from '@/components/ui-kit';
import type { Ingrediente, Unidad } from '@/data/tipos';
import { usePalette } from '@/hooks/use-palette';
import { aporte } from '@/lib/volumen';
import { FONT, RADIUS } from '@/theme/colors';

const UNIDADES: Unidad[] = ['g', 'ml', 'cda', 'ud'];

type Fila = { id: number; n: string; c: string; u: Unidad };

/** «¿Me cabe esto en la jarra?» para cuando cocinas sin receta. */
export default function Cabe() {
  const c = usePalette();
  const [caliente, setCaliente] = useState(true);
  const [filas, setFilas] = useState<Fila[]>([{ id: 1, n: '', c: '', u: 'g' }]);

  const limite = caliente ? 1400 : 1600;

  const total = useMemo(() => {
    let aparenteSolidos = 0, realSolidos = 0, liquidos = 0;
    filas.forEach((f) => {
      const num = parseFloat(f.c.replace(',', '.'));
      if (!f.n.trim() || !isFinite(num) || num <= 0) return;
      const ing: Ingrediente = { c: num, u: f.u, n: f.n };
      const a = aporte(ing, 1);
      const esLiq = Math.abs(a.aparente - a.real) < 0.01;
      if (esLiq) liquidos += a.real;
      else { aparenteSolidos += a.aparente; realSolidos += a.real; }
    });
    return Math.round(Math.max(aparenteSolidos, realSolidos + liquidos));
  }, [filas]);

  const pasa = total > limite;
  const pct = Math.round((total / limite) * 100);

  const set = (id: number, parche: Partial<Fila>) =>
    setFilas((p) => p.map((f) => (f.id === id ? { ...f, ...parche } : f)));

  const añadir = () => setFilas((p) => [...p, { id: Date.now(), n: '', c: '', u: 'g' }]);
  const quitar = (id: number) => setFilas((p) => (p.length === 1 ? p : p.filter((f) => f.id !== id)));

  return (
    <>
      <Stack.Screen options={{ title: '¿Cabe en la jarra?' }} />
      <ScrollView
        style={{ backgroundColor: c.bg }}
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={styles.content}
        keyboardDismissMode="on-drag">
        <Card style={styles.pad}>
          <Text style={[styles.body, { color: c.textSoft }]}>
            Escribe lo que quieres meter y te decimos si te pasas de la línea grabada. Sirve aunque no sigas
            ninguna receta.
          </Text>
          <View style={styles.seg}>
            {([[true, '🔥 Con calor · HOT 1,4 L'], [false, '🧊 En frío · COLD 1,6 L']] as const).map(([v, t]) => (
              <Pressable
                key={String(v)}
                onPress={() => setCaliente(v)}
                style={[styles.segBtn, {
                  backgroundColor: caliente === v ? c.panel : c.cardAlt,
                  borderColor: caliente === v ? c.panel : c.separator,
                }]}>
                <Text style={{ color: caliente === v ? '#FFF' : c.text, fontSize: 13, fontWeight: '600' }}>{t}</Text>
              </Pressable>
            ))}
          </View>
        </Card>

        <SectionTitle style={styles.st}>Lo que vas a meter</SectionTitle>
        <Card style={styles.pad}>
          {filas.map((f, i) => (
            <View key={f.id} style={[styles.fila, i > 0 && { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: c.separator, paddingTop: 10 }]}>
              <TextInput
                value={f.n}
                onChangeText={(n) => set(f.id, { n })}
                placeholder="cebolla, caldo, calabaza…"
                placeholderTextColor={c.muted}
                style={[styles.input, { color: c.text, borderColor: c.separator, backgroundColor: c.cardAlt, flex: 1 }]}
              />
              <TextInput
                value={f.c}
                onChangeText={(v) => set(f.id, { c: v })}
                keyboardType="decimal-pad"
                placeholder="0"
                placeholderTextColor={c.muted}
                style={[styles.input, { color: c.text, borderColor: c.separator, backgroundColor: c.cardAlt, width: 64, textAlign: 'right' }]}
              />
              <Pressable
                onPress={() => set(f.id, { u: UNIDADES[(UNIDADES.indexOf(f.u) + 1) % UNIDADES.length] })}
                style={[styles.unidad, { borderColor: c.separator }]}
                accessibilityLabel={`Unidad ${f.u}, tocar para cambiar`}>
                <Text style={{ color: c.tint, fontFamily: FONT.mono, fontSize: 13, fontWeight: '700' }}>{f.u}</Text>
              </Pressable>
              <Pressable onPress={() => quitar(f.id)} hitSlop={8} accessibilityLabel="Quitar línea">
                <Text style={{ color: c.muted, fontSize: 19 }}>×</Text>
              </Pressable>
            </View>
          ))}
          <Pressable onPress={añadir} style={[styles.ghost, { borderColor: c.separator }]}>
            <Text style={{ color: c.tint, fontSize: 15, fontWeight: '600' }}>+ Añadir ingrediente</Text>
          </Pressable>
        </Card>

        <SectionTitle style={styles.st}>Resultado</SectionTitle>
        <Card style={styles.pad}>
          <View style={styles.resultado}>
            <JugGauge cargaMl={total} limiteMl={limite} />
            <View style={{ flex: 1, gap: 4 }}>
              <Text style={[styles.total, { color: pasa ? c.danger : c.ok }]}>
                {total} ml {Platform.OS === 'ios' && (
                  <SymbolView
                    name={pasa ? 'exclamationmark.triangle.fill' : 'checkmark.circle.fill'}
                    size={16}
                    tintColor={pasa ? c.danger : c.ok}
                    resizeMode="scaleAspectFit"
                  />
                )}
              </Text>
              <Text style={[styles.body, { color: c.muted }]}>
                {pct}% de la línea {caliente ? 'HOT (1,4 L)' : 'COLD (1,6 L)'}
              </Text>
            </View>
          </View>
          {pasa ? (
            <Callout tone="warn" title="Te pasas de la línea">
              {`Sobran unos ${total - limite} ml. Quita cantidad o repártelo en dos tandas: superar la línea es la causa más habitual de sobrecarga del aparato.`}
            </Callout>
          ) : total > 0 ? (
            <Callout tone="tip" title="Cabe">
              {`Te quedan unos ${limite - total} ml de margen hasta la línea.`}
            </Callout>
          ) : null}
          <Text style={[styles.disclaimer, { color: c.muted }]}>
            Cálculo de la app con densidades aproximadas (±20 %). No es un dato del manual: la línea grabada en tu
            jarra siempre manda.
          </Text>
        </Card>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 16, maxWidth: 720, width: '100%', alignSelf: 'center', paddingBottom: 60, paddingTop: 8 },
  pad: { padding: 14, gap: 10, borderRadius: RADIUS },
  st: { marginTop: 24 },
  body: { fontSize: 14, lineHeight: 20 },
  seg: { flexDirection: 'row', gap: 8 },
  segBtn: { flex: 1, borderWidth: 1, borderRadius: 10, paddingVertical: 10, alignItems: 'center' },
  fila: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  input: { borderWidth: 1, borderRadius: 9, paddingHorizontal: 10, paddingVertical: 10, fontSize: 15 },
  unidad: { borderWidth: 1, borderRadius: 9, paddingHorizontal: 10, paddingVertical: 11 },
  ghost: { borderWidth: 1, borderRadius: 11, paddingVertical: 12, alignItems: 'center', marginTop: 4 },
  resultado: { flexDirection: 'row', gap: 16, alignItems: 'center' },
  total: { fontSize: 28, fontWeight: '700', fontFamily: FONT.mono },
  disclaimer: { fontSize: 11.5, lineHeight: 16, fontStyle: 'italic' },
});
