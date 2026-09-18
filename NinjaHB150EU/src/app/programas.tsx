import { Stack } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { PanelKey } from '@/components/panel-key';
import { Callout, Card, SectionTitle } from '@/components/ui-kit';
import { FUENTE_GUIA, MAQUINA } from '@/data/recetas';
import { usePalette } from '@/hooks/use-palette';
import { FONT, RADIUS } from '@/theme/colors';

/** Qué hace cada programa por dentro y cuánto dura, para saber qué esperar. */
export default function Programas() {
  const c = usePalette();
  const maxMin = Math.max(...MAQUINA.programas.map((p) => p.minProg));

  return (
    <>
      <Stack.Screen options={{ title: 'Los programas por dentro' }} />
      <ScrollView
        style={{ backgroundColor: c.bg }}
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={styles.content}>
        <Callout tone="tip" title="De dónde sale esto">
          Las fases las describe el propio recetario de Ninja en sus plantillas de sopa (páginas 6–9). Las
          duraciones salen de los tiempos que el recetario da para cada programa. El manual no publica una tabla
          de tiempos, así que trátalas como orientativas.
        </Callout>

        {MAQUINA.programas.map((p) => (
          <View key={p.b} style={{ marginTop: 20 }}>
            <View style={styles.cabecera}>
              <PanelKey label={p.b} />
              <Text style={[styles.dur, { color: c.muted }]}>{p.dur}</Text>
            </View>
            <Card style={styles.pad}>
              <Text style={[styles.body, { color: c.textSoft }]}>{p.d}</Text>

              {/* barra de duración relativa */}
              <View style={[styles.barra, { backgroundColor: c.cardAlt }]}>
                <View
                  style={{
                    width: `${Math.max(3, (p.minProg / maxMin) * 100)}%`,
                    height: '100%',
                    borderRadius: 5,
                    backgroundColor: p.calor ? c.hot : c.cold,
                  }}
                />
              </View>

              {p.fases ? (
                p.fases.map((f, i) => (
                  <View key={i} style={styles.fase}>
                    <View style={[styles.punto, { backgroundColor: p.calor ? c.hot : c.cold }]} />
                    <Text style={[styles.faseTxt, { color: c.textSoft }]}>{f}</Text>
                  </View>
                ))
              ) : (
                <Text style={[styles.sinDoc, { color: c.muted }]}>
                  Ninja no publica el detalle de las fases de este programa. No nos lo inventamos.
                </Text>
              )}

              {p.calor && p.minProg >= 5 && (
                <Text style={[styles.pitidos, { color: c.hot }]}>
                  🔊 3 pitidos y 2 s de pausa antes de cada removido.
                </Text>
              )}
            </Card>
          </View>
        ))}

        <SectionTitle style={{ marginTop: 26 }}>Fuente</SectionTitle>
        <Card style={styles.pad}>
          <Text style={[styles.body, { color: c.muted }]}>
            {FUENTE_GUIA.nombre} ({FUENTE_GUIA.ref}).
          </Text>
        </Card>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 16, maxWidth: 720, width: '100%', alignSelf: 'center', paddingBottom: 40, paddingTop: 8 },
  cabecera: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  dur: { fontFamily: FONT.mono, fontSize: 12, fontWeight: '600' },
  pad: { padding: 14, gap: 10, borderRadius: RADIUS },
  body: { fontSize: 14, lineHeight: 20 },
  barra: { height: 6, borderRadius: 5, overflow: 'hidden' },
  fase: { flexDirection: 'row', gap: 9, alignItems: 'flex-start' },
  punto: { width: 7, height: 7, borderRadius: 4, marginTop: 6 },
  faseTxt: { flex: 1, fontSize: 13.5, lineHeight: 19 },
  sinDoc: { fontSize: 13, fontStyle: 'italic', lineHeight: 18 },
  pitidos: { fontSize: 12.5, fontWeight: '600' },
});
