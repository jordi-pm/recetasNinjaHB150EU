import * as Clipboard from 'expo-clipboard';
import { Stack, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, ScrollView,
  StyleSheet, Text, TextInput, View,
} from 'react-native';

import { JugGauge } from '@/components/jug-gauge';
import { PanelKey } from '@/components/panel-key';
import { Callout, Card, SectionTitle } from '@/components/ui-kit';
import { usePalette } from '@/hooks/use-palette';
import { cantidad } from '@/lib/format';
import { aReceta, desdeTexto, desdeUrl, type Borrador } from '@/lib/importar';
import { useApp } from '@/lib/store';
import { cargaMl } from '@/lib/volumen';
import { FONT, RADIUS } from '@/theme/colors';

type Modo = 'url' | 'texto';

/** Trae una receta de fuera y la adapta a los programas del aparato. */
export default function Importar() {
  const c = usePalette();
  const router = useRouter();
  const { guardarPropia } = useApp();

  const [modo, setModo] = useState<Modo>('url');
  const [url, setUrl] = useState('');
  const [texto, setTexto] = useState('');
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [borrador, setBorrador] = useState<Borrador | null>(null);

  const pegar = async () => {
    const t = await Clipboard.getStringAsync();
    if (!t) return;
    if (/^https?:\/\//i.test(t.trim())) { setModo('url'); setUrl(t.trim()); }
    else { setModo('texto'); setTexto(t); }
  };

  const importar = async () => {
    setError(null);
    setCargando(true);
    try {
      const b = modo === 'url' ? await desdeUrl(url) : desdeTexto(texto);
      if (!b.ing.length) throw new Error('No hemos encontrado ingredientes. Revisa lo que has pegado.');
      setBorrador(b);
    } catch (e: any) {
      setError(e?.message ?? 'No hemos podido leer esa receta.');
    } finally {
      setCargando(false);
    }
  };

  const guardar = () => {
    if (!borrador) return;
    const r = aReceta(borrador);
    guardarPropia(r);
    router.replace(`/receta/${r.id}`);
  };

  /* ------------------------------ revisión ------------------------------ */
  if (borrador) {
    const receta = aReceta(borrador, 'previa');
    const carga = cargaMl(receta, 1);
    const pasa = carga > receta.limiteMl;

    return (
      <>
        <Stack.Screen
          options={{
            title: 'Revisa la receta',
            headerRight: () => (
              <Pressable onPress={guardar} hitSlop={10}>
                <Text style={{ color: c.tint, fontSize: 17, fontWeight: '600' }}>Guardar</Text>
              </Pressable>
            ),
          }}
        />
        <ScrollView style={{ backgroundColor: c.bg }} contentInsetAdjustmentBehavior="automatic" contentContainerStyle={styles.content}>
          <Callout tone="warn" title="Esto es un borrador">
            {borrador.dudas.join(' ')}
          </Callout>

          <SectionTitle style={styles.st}>{borrador.nombre}</SectionTitle>
          <Card style={styles.pad}>
            <View style={styles.keyRow}>
              {receta.pasos.filter((p) => p.b).map((p, i) => <PanelKey key={i} label={p.b!} size="sm" />)}
            </View>
            <Text style={[styles.body, { color: c.muted }]}>
              {borrador.raciones} raciones · {borrador.caliente ? 'lleva calor' : 'en frío'}
            </Text>
            <View style={styles.gauge}>
              <JugGauge cargaMl={carga} limiteMl={receta.limiteMl} />
              <Text style={[styles.body, { color: pasa ? c.danger : c.textSoft, flex: 1 }]}>
                {carga} ml de {receta.limiteMl} ml{'\n'}
                <Text style={{ fontSize: 12 }}>
                  {pasa ? 'Se pasa de la línea: reduce cantidades al editarla.' : 'Cabe en tu jarra.'}
                </Text>
              </Text>
            </View>
          </Card>

          <SectionTitle style={styles.st}>Ingredientes · {borrador.ing.length}</SectionTitle>
          <Card style={styles.pad}>
            {borrador.ing.map((ing, i) => {
              const q = cantidad(ing, 1);
              return (
                <View key={i} style={[styles.fila, i > 0 && { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: c.separator }]}>
                  <Text style={[styles.qty, { color: q.libre ? c.danger : c.text }]}>{q.txt}</Text>
                  <Text style={[styles.body, { color: c.textSoft, flex: 1 }]}>{ing.n}</Text>
                </View>
              );
            })}
          </Card>

          <SectionTitle style={styles.st}>Pasos propuestos</SectionTitle>
          <Card style={styles.pad}>
            {receta.pasos.map((p, i) => (
              <View key={i} style={[styles.paso, i > 0 && { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: c.separator }]}>
                <Text style={[styles.num, { color: c.muted }]}>{i + 1}</Text>
                <View style={{ flex: 1, gap: 6 }}>
                  {p.t ? <Text style={[styles.body, { color: c.textSoft }]}>{p.t}</Text> : null}
                  {p.b ? <PanelKey label={p.b} size="sm" /> : null}
                </View>
              </View>
            ))}
          </Card>

          <Pressable onPress={() => setBorrador(null)} style={[styles.ghost, { borderColor: c.separator }]}>
            <Text style={{ color: c.tint, fontSize: 15.5, fontWeight: '600' }}>Empezar de nuevo</Text>
          </Pressable>
        </ScrollView>
      </>
    );
  }

  /* ------------------------------ entrada ------------------------------- */
  return (
    <>
      <Stack.Screen options={{ title: 'Importar receta' }} />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView style={{ backgroundColor: c.bg }} contentInsetAdjustmentBehavior="automatic" contentContainerStyle={styles.content} keyboardDismissMode="on-drag">
          <Callout tone="tip" title="Trae una receta de donde sea">
            Pega la dirección de una web de cocina y la adaptamos a los programas de tu aparato, comprobando si
            cabe en tu jarra. Si la web no se deja leer, copia el texto y pégalo abajo.
          </Callout>

          <View style={[styles.seg, { backgroundColor: c.cardAlt }]}>
            {(['url', 'texto'] as Modo[]).map((m) => (
              <Pressable key={m} onPress={() => setModo(m)} style={[styles.segBtn, modo === m && { backgroundColor: c.card }]}>
                <Text style={{ color: c.text, fontWeight: modo === m ? '600' : '400', fontSize: 14 }}>
                  {m === 'url' ? '🔗 Desde una web' : '📋 Pegar texto'}
                </Text>
              </Pressable>
            ))}
          </View>

          <Card style={styles.pad}>
            {modo === 'url' ? (
              <TextInput
                value={url}
                onChangeText={setUrl}
                placeholder="https://…"
                placeholderTextColor={c.muted}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="url"
                style={[styles.input, { color: c.text, borderColor: c.separator, backgroundColor: c.cardAlt }]}
              />
            ) : (
              <TextInput
                value={texto}
                onChangeText={setTexto}
                placeholder={'Crema de calabacín\n- 3 calabacines\n- 600 ml de caldo\nSofríe la cebolla y añade el caldo…'}
                placeholderTextColor={c.muted}
                multiline
                style={[styles.input, styles.area, { color: c.text, borderColor: c.separator, backgroundColor: c.cardAlt }]}
              />
            )}

            <Pressable onPress={pegar} style={[styles.ghost, { borderColor: c.separator }]}>
              <Text style={{ color: c.tint, fontSize: 15, fontWeight: '600' }}>📋 Pegar del portapapeles</Text>
            </Pressable>

            {error && <Callout tone="warn">{error}</Callout>}

            <Pressable
              onPress={importar}
              disabled={cargando || (modo === 'url' ? !url.trim() : texto.trim().length < 20)}
              style={[styles.cta, { backgroundColor: c.panel, opacity: cargando ? 0.6 : 1 }]}>
              {cargando ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={styles.ctaTxt}>Leer la receta</Text>
              )}
            </Pressable>
          </Card>

          <Text style={[styles.body, { color: c.muted, marginTop: 16 }]}>
            Lo que importes se guarda como receta tuya, separado de las que trae la app, y siempre puedes editarlo.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 16, paddingBottom: 60, paddingTop: 8, maxWidth: 720, width: '100%', alignSelf: 'center' },
  st: { marginTop: 22 },
  pad: { padding: 14, gap: 12, borderRadius: RADIUS },
  seg: { flexDirection: 'row', borderRadius: 10, padding: 3, gap: 3, marginTop: 16, marginBottom: 12 },
  segBtn: { flex: 1, alignItems: 'center', paddingVertical: 10, borderRadius: 8 },
  input: { borderWidth: 1, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 12, fontSize: 15 },
  area: { minHeight: 160, textAlignVertical: 'top' },
  ghost: { borderWidth: 1, borderRadius: 11, paddingVertical: 12, alignItems: 'center' },
  cta: { borderRadius: 13, paddingVertical: 16, alignItems: 'center' },
  ctaTxt: { color: '#FFF', fontSize: 16.5, fontWeight: '700' },
  body: { fontSize: 14, lineHeight: 20 },
  keyRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 7 },
  gauge: { flexDirection: 'row', gap: 16, alignItems: 'center' },
  fila: { flexDirection: 'row', gap: 10, paddingVertical: 8 },
  qty: { fontFamily: FONT.mono, fontSize: 13, fontWeight: '700', width: 78 },
  paso: { flexDirection: 'row', gap: 10, paddingVertical: 10 },
  num: { fontFamily: FONT.mono, fontSize: 12, fontWeight: '700', width: 18 },
});
