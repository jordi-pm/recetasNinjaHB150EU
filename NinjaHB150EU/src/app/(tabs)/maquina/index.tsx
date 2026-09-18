import { Stack } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { JugGauge } from '@/components/jug-gauge';
import { PanelKey } from '@/components/panel-key';
import { Callout, Card, SectionTitle } from '@/components/ui-kit';
import { COMPATIBILIDAD, MAQUINA } from '@/data/recetas';
import { usePalette } from '@/hooks/use-palette';
import { FONT, RADIUS } from '@/theme/colors';

export default function Maquina() {
  const c = usePalette();

  const FilaBoton = ({ b, texto, pie }: { b: string; texto: string; pie?: string }) => (
    <View style={[styles.progRow, { borderTopColor: c.separator }]}>
      <View style={{ width: 132 }}>
        <PanelKey label={b} size="sm" />
      </View>
      <View style={{ flex: 1, gap: 3 }}>
        <Text style={[styles.progTxt, { color: c.textSoft }]}>{texto}</Text>
        {pie ? <Text style={[styles.progPie, { color: c.muted }]}>{pie}</Text> : null}
      </View>
    </View>
  );

  return (
    <>
      <Stack.Screen options={{ title: 'Mi aparato' }} />
      <ScrollView
        style={{ backgroundColor: c.bg }}
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={styles.content}>
        <View style={[styles.hero, { backgroundColor: c.hero }]}>
          <Text style={styles.heroTitle}>{MAQUINA.modelo}</Text>
          <Text style={styles.heroSub}>
            {MAQUINA.potencia}
            {'\n'}
            {MAQUINA.jarra}
          </Text>
        </View>

        <SectionTitle>Límites de llenado</SectionTitle>
        <Card style={styles.pad}>
          <View style={{ flexDirection: 'row', gap: 18, alignItems: 'center' }}>
            <JugGauge cargaMl={1400} limiteMl={1400} />
            <Text style={[styles.body, { color: c.textSoft, flex: 1 }]}>{MAQUINA.capacidad.texto}</Text>
          </View>
          <Callout tone="warn" title="Nunca pases de las líneas">
            Superar la capacidad máxima es la causa más habitual de sobrecarga del aparato.
          </Callout>
        </Card>

        <SectionTitle style={styles.st}>Programas automáticos</SectionTitle>
        <Card style={styles.pad}>
          {MAQUINA.programas.map((p: any) => (
            <FilaBoton
              key={p.b}
              b={p.b}
              texto={p.d}
              pie={`Sección ${p.seccion} · ${p.dur}${p.calor ? ' · usa calor' : ''}`}
            />
          ))}
        </Card>

        <SectionTitle style={styles.st}>Ajustes manuales</SectionTitle>
        <Card style={styles.pad}>
          {MAQUINA.manual.map((p: any) => (
            <FilaBoton key={p.b} b={p.b} texto={p.d} pie={p.opciones} />
          ))}
        </Card>

        <SectionTitle style={styles.st}>Otros botones y pilotos</SectionTitle>
        <Card style={styles.pad}>
          {MAQUINA.otros.map((p: any) => (
            <FilaBoton key={p.b} b={p.b} texto={p.d} />
          ))}
        </Card>

        <SectionTitle style={styles.st}>Piezas</SectionTitle>
        <Card style={styles.pad}>
          {MAQUINA.piezas.map((p: any) => (
            <View key={p[0]} style={[styles.progRow, { borderTopColor: c.separator }]}>
              <Text style={[styles.letra, { color: c.tint }]}>{p[0]}</Text>
              <Text style={[styles.body, { color: c.textSoft, flex: 1 }]}>{p[1]}</Text>
            </View>
          ))}
        </Card>

        <SectionTitle style={styles.st}>⚠️ Seguridad — avisos del manual</SectionTitle>
        <Card style={styles.pad}>
          {MAQUINA.seguridad.map((s: any) => (
            <View key={s[0]} style={{ marginTop: 12 }}>
              <Text style={[styles.dt, { color: c.text }]}>{s[0]}</Text>
              <Text style={[styles.body, { color: c.textSoft }]}>{s[1]}</Text>
            </View>
          ))}
        </Card>

        <SectionTitle style={styles.st}>Cómo se comporta</SectionTitle>
        <Card style={styles.pad}>
          {MAQUINA.notas.map((n: string, i: number) => (
            <View key={i} style={[styles.progRow, { borderTopColor: c.separator }]}>
              <Text style={[styles.body, { color: c.textSoft, flex: 1 }]}>{n}</Text>
            </View>
          ))}
        </Card>

        <SectionTitle style={styles.st}>Mensajes de error</SectionTitle>
        <Card style={styles.pad}>
          {MAQUINA.errores.map((e: any) => (
            <View key={e[0]} style={[styles.progRow, { borderTopColor: c.separator }]}>
              <Text style={[styles.codigo, { color: c.hot }]}>{e[0]}</Text>
              <Text style={[styles.body, { color: c.textSoft, flex: 1 }]}>{e[1]}</Text>
            </View>
          ))}
        </Card>

        <SectionTitle style={styles.st}>Discrepancias entre fuentes</SectionTitle>
        <Card style={styles.pad}>
          <Text style={[styles.body, { color: c.muted }]}>
            Contradicciones reales encontradas al montar la app. Se señalan, no se resuelven por cuenta propia.
          </Text>
          {MAQUINA.discrepancias.map((d: any) => (
            <View key={d.t} style={{ marginTop: 12 }}>
              <Text style={[styles.dt, { color: c.text }]}>{d.t}</Text>
              <Text style={[styles.body, { color: c.textSoft }]}>{d.d}</Text>
            </View>
          ))}
        </Card>

        <SectionTitle style={styles.st}>{COMPATIBILIDAD.titulo}</SectionTitle>
        <Card style={styles.pad}>
          <Text style={[styles.body, { color: c.textSoft }]}>{COMPATIBILIDAD.texto}</Text>
          <Text style={[styles.body, { color: c.muted }]}>
            Los avisos de seguridad de esta pantalla son los habituales de este tipo de aparato. Tu manual manda
            sobre todo lo que leas aquí.
          </Text>
        </Card>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 16, maxWidth: 720, width: '100%', alignSelf: 'center', paddingBottom: 40 },
  hero: { borderRadius: RADIUS, padding: 18, gap: 6, marginBottom: 26 },
  heroTitle: { color: '#FFF', fontSize: 21, fontWeight: '700', lineHeight: 26, letterSpacing: -0.3 },
  heroSub: { color: '#9DABB9', fontSize: 13, lineHeight: 19 },
  st: { marginTop: 26 },
  pad: { padding: 14, gap: 10 },
  progRow: { flexDirection: 'row', gap: 12, paddingTop: 11, marginTop: 11, borderTopWidth: StyleSheet.hairlineWidth, alignItems: 'flex-start' },
  progTxt: { fontSize: 14, lineHeight: 19 },
  progPie: { fontSize: 11, fontFamily: FONT.mono },
  body: { fontSize: 14, lineHeight: 20 },
  dt: { fontSize: 14.5, fontWeight: '700', marginBottom: 2 },
  letra: { fontSize: 14, fontWeight: '700', fontFamily: FONT.mono, width: 20 },
  codigo: { fontSize: 13, fontFamily: FONT.mono, fontWeight: '700', width: 92 },
  link: { fontSize: 14.5, fontWeight: '600', marginTop: 4 },
});
