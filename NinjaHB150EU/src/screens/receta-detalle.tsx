import { Image } from 'expo-image';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import * as WebBrowser from 'expo-web-browser';
import { useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { JugGauge } from '@/components/jug-gauge';
import { PanelKey } from '@/components/panel-key';
import { Callout, Card, SectionTitle } from '@/components/ui-kit';
import { fotoDe } from '@/data/fotos';
import { FUENTE_GUIA, FUENTE_MANUAL } from '@/data/recetas';
import { usePalette } from '@/hooks/use-palette';
import {
  cantidad, categoriaPorId, esCaliente, lineaNombre, maxEscala,
  programasDe, recetaPorId, reposoTxt, seguridadDe, tiempoTotal,
} from '@/lib/format';
import { useApp } from '@/lib/store';
import { FONT, RADIUS } from '@/theme/colors';

export default function RecetaDetalle() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const c = usePalette();
  const router = useRouter();
  const { esFav, alternarFav, añadirReceta } = useApp();
  const [k, setK] = useState(1);
  const [añadido, setAñadido] = useState(false);

  const r = recetaPorId(String(id));
  if (!r) {
    return (
      <View style={[styles.center, { backgroundColor: c.bg }]}>
        <Text style={{ color: c.muted }}>Receta no encontrada.</Text>
      </View>
    );
  }

  const max = maxEscala(r);
  const bloqueada = k > max;
  const carga = r.cargaMl * k;
  const foto = fotoDe(r.foto);
  const cat = categoriaPorId(r.cat);
  const fav = esFav(r.id);

  return (
    <>
      <Stack.Screen
        options={{
          title: r.nombre,
          headerRight: () => (
            <Pressable onPress={() => alternarFav(r.id)} hitSlop={12}>
              {Platform.OS === 'ios' ? (
                <SymbolView
                  name={fav ? 'star.fill' : 'star'}
                  size={22}
                  tintColor={fav ? '#F5A524' : c.tint}
                  resizeMode="scaleAspectFit"
                />
              ) : (
                <Text style={{ fontSize: 20, opacity: fav ? 1 : 0.4 }}>⭐</Text>
              )}
            </Pressable>
          ),
        }}
      />
      <ScrollView
        style={{ backgroundColor: c.bg }}
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={styles.content}>
        {foto ? (
          <Image source={foto} style={styles.hero} contentFit="cover" transition={200} />
        ) : (
          <View style={[styles.hero, styles.heroPh, { backgroundColor: c.cardAlt }]}>
            <Text style={{ fontSize: 56 }}>{cat?.emoji}</Text>
          </View>
        )}

        <Text style={[styles.title, { color: c.text }]}>{r.nombre}</Text>
        <Text style={[styles.original, { color: c.muted }]}>
          {r.original}
          {r.plantilla ? ' · plantilla oficial' : ''}
          {r.tecnica ? ' · técnica oficial' : ''}
        </Text>

        <View style={[styles.stats, { backgroundColor: c.card }]}>
          {([
            [String(r.raciones), 'Raciones'],
            [`${tiempoTotal(r)}′`, 'Total'],
            [`${r.prep}′`, 'Prep.'],
            [r.dificultad, 'Dificultad'],
          ] as [string, string][]).map(([v, l], i) => (
            <View
              key={l}
              style={[styles.stat, i > 0 && { borderLeftWidth: StyleSheet.hairlineWidth, borderLeftColor: c.separator }]}>
              <Text style={[styles.statV, { color: c.text }]} numberOfLines={1}>{v}</Text>
              <Text style={[styles.statL, { color: c.muted }]}>{l.toUpperCase()}</Text>
            </View>
          ))}
        </View>
        {reposoTxt(r) ? (
          <Text style={[styles.reposo, { color: c.muted }]}>+ {reposoTxt(r)} de reposo o congelación</Text>
        ) : null}

        <SectionTitle style={styles.st}>Programa</SectionTitle>
        <Card style={styles.pad}>
          <View style={styles.keyRow}>
            {programasDe(r).map((b) => <PanelKey key={b} label={b} />)}
          </View>
          <Text style={[styles.programa, { color: c.muted }]}>{r.programa}</Text>
        </Card>

        {r.discrepancia ? (
          <View style={{ marginTop: 12 }}>
            <Callout tone="warn" title="⚠️ Discrepancia en la fuente oficial">{r.discrepancia}</Callout>
          </View>
        ) : null}

        <Pressable
          onPress={() => router.push(`/cocinar/${r.id}?k=${k}`)}
          disabled={bloqueada}
          style={({ pressed }) => [
            styles.cta,
            { backgroundColor: c.panel, opacity: bloqueada ? 0.4 : pressed ? 0.8 : 1 },
          ]}>
          {Platform.OS === 'ios' && (
            <SymbolView name="play.fill" size={16} tintColor="#FFFFFF" resizeMode="scaleAspectFit" />
          )}
          <Text style={styles.ctaTxt}>Cocinar ahora</Text>
        </Pressable>

        <SectionTitle style={styles.st}>Ingredientes</SectionTitle>
        <Card style={styles.pad}>
          <View style={styles.scaler}>
            {[1, 2, 3].map((n) => {
              const bad = n > max;
              const activo = k === n;
              return (
                <Pressable
                  key={n}
                  onPress={() => setK(n)}
                  style={[
                    styles.sc,
                    {
                      backgroundColor: activo ? (bad ? c.danger : c.panel) : c.cardAlt,
                      borderColor: bad ? c.danger : activo ? c.panel : c.separator,
                    },
                  ]}>
                  <Text
                    style={{
                      fontFamily: FONT.mono, fontWeight: '700', fontSize: 15,
                      color: activo ? '#FFF' : bad ? c.danger : c.text,
                    }}>
                    {n}×{bad ? ' ⚠' : ''}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {bloqueada ? (
            <>
              <Callout tone="warn" title={`${k}× no cabe en tu jarra`}>
                {`A ${k}× la carga sería de unos ${(carga / 1000).toFixed(2).replace('.', ',')} L, por encima de la línea ${lineaNombre(r)} que el manual prohíbe superar. Por eso la app no te muestra esas cantidades: no serían una preparación segura.\n\nCon esta receta puedes llegar como máximo a ${max}×. Para más raciones, cocina dos tandas.`}
              </Callout>
              <View style={styles.gauge}>
                <JugGauge cargaMl={carga} limiteMl={r.limiteMl} />
                <Text style={[styles.gaugeTxt, { color: c.muted, flex: 1 }]}>
                  Carga estimada a {k}×: {Math.round(carga)} ml{'\n'}Límite: {r.limiteMl} ml
                </Text>
              </View>
              <Pressable onPress={() => setK(1)} style={[styles.ghost, { borderColor: c.separator }]}>
                <Text style={{ color: c.tint, fontSize: 15.5, fontWeight: '600' }}>Volver a 1×</Text>
              </Pressable>
            </>
          ) : (
            <>
              {r.ing.map((ing, i) => {
                const q = cantidad(ing, k);
                return (
                  <View
                    key={i}
                    style={[styles.ingRow, i > 0 && { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: c.separator }]}>
                    <Text style={[styles.qty, { color: q.libre ? c.muted : c.text }]}>{q.txt}</Text>
                    <Text style={[styles.ingTxt, { color: c.textSoft }]}>{ing.n}</Text>
                  </View>
                );
              })}
              <View style={styles.gauge}>
                <JugGauge cargaMl={carga} limiteMl={r.limiteMl} />
                <Text style={[styles.gaugeTxt, { color: c.muted, flex: 1 }]}>
                  Carga aproximada a {k}×: {Math.round(carga)} ml de {r.limiteMl} ml.{'\n'}
                  <Text style={{ fontSize: 11.5 }}>
                    Estimación de la app a partir de los ingredientes, no un dato del manual. Guíate siempre por las
                    líneas grabadas en la jarra.
                  </Text>
                </Text>
              </View>
              <Pressable
                onPress={() => { añadirReceta(r, k); setAñadido(true); }}
                disabled={añadido}
                style={[styles.ghost, { borderColor: añadido ? c.ok : c.separator }]}>
                <Text style={{ color: añadido ? c.ok : c.tint, fontSize: 15.5, fontWeight: '600' }}>
                  {añadido ? '✓ Añadidos a la lista de la compra' : '🛒 Añadir ingredientes a la lista de la compra'}
                </Text>
              </Pressable>
            </>
          )}
        </Card>

        <SectionTitle style={styles.st}>Preparación</SectionTitle>
        <Card style={styles.pad}>
          {r.pasos.map((p, i) => (
            <View
              key={i}
              style={[styles.paso, i > 0 && { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: c.separator }]}>
              <View style={[styles.num, { backgroundColor: c.cardAlt, borderColor: c.separator }]}>
                <Text style={[styles.numTxt, { color: c.muted }]}>{i + 1}</Text>
              </View>
              <View style={{ flex: 1, gap: 8 }}>
                {p.t ? <Text style={[styles.pasoTxt, { color: c.textSoft }]}>{p.t}</Text> : null}
                {p.add && !bloqueada
                  ? p.add.map((idx) => {
                      const ing = r.ing[idx];
                      const q = cantidad(ing, k);
                      return (
                        <View key={idx} style={styles.ingMini}>
                          <Text style={[styles.qtyMini, { color: q.libre ? c.muted : c.text }]}>{q.txt}</Text>
                          <Text style={[styles.ingTxtMini, { color: c.textSoft }]}>{ing.n}</Text>
                        </View>
                      );
                    })
                  : null}
                {p.b ? (
                  <View style={styles.keyRow}>
                    <PanelKey label={p.b} />
                    {p.sub ? <PanelKey label={p.sub} size="sm" /> : null}
                  </View>
                ) : null}
              </View>
            </View>
          ))}
          {r.tip ? <Callout tone="tip" title="Consejo del recetario">{r.tip}</Callout> : null}
          {r.nota ? <Callout tone="tip">{r.nota}</Callout> : null}
        </Card>

        <SectionTitle style={styles.st}>⚠️ Seguridad para esta receta</SectionTitle>
        <Card style={styles.pad}>
          {seguridadDe(r).map(([t, d]) => (
            <View key={t} style={{ marginTop: 10 }}>
              <Text style={[styles.dt, { color: esCaliente(r) ? c.hot : c.text }]}>{t}</Text>
              <Text style={[styles.body, { color: c.textSoft }]}>{d}</Text>
            </View>
          ))}
          <Pressable onPress={() => router.push('/maquina')} style={[styles.ghost, { borderColor: c.separator }]}>
            <Text style={{ color: c.tint, fontSize: 15.5, fontWeight: '600' }}>Ver todos los avisos del manual</Text>
          </Pressable>
        </Card>

        <SectionTitle style={styles.st}>Fuente</SectionTitle>
        <Card style={styles.pad}>
          <Text style={[styles.body, { color: c.textSoft }]}>
            <Text style={styles.b}>Fuente: </Text>{FUENTE_GUIA.nombre}, página {r.pag}.
          </Text>
          <Text style={[styles.body, { color: c.textSoft }]}>
            <Text style={styles.b}>Modelo: </Text>Ninja Foodi Blender &amp; Soup Maker HB150EU.
          </Text>
          <Text style={[styles.body, { color: c.textSoft }]}>
            <Text style={styles.b}>Nombres de los botones: </Text>{FUENTE_MANUAL.nombre}.
          </Text>
          <Text style={[styles.body, { color: c.textSoft }]}>
            <Text style={styles.b}>Verificación: </Text>
            {r.discrepancia
              ? 'verificada CON la discrepancia señalada arriba.'
              : 'ingredientes, cantidades y programa comprobados contra el recetario oficial.'}
          </Text>
          <Pressable onPress={() => WebBrowser.openBrowserAsync(FUENTE_GUIA.url)}>
            <Text style={[styles.link, { color: c.tint }]}>Abrir el recetario original (PDF) ›</Text>
          </Pressable>
          <Pressable onPress={() => WebBrowser.openBrowserAsync(FUENTE_MANUAL.url)}>
            <Text style={[styles.link, { color: c.tint }]}>Abrir el manual original (PDF) ›</Text>
          </Pressable>
        </Card>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 16, paddingBottom: 48 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  hero: { width: '100%', aspectRatio: 16 / 10, borderRadius: RADIUS, marginTop: 4 },
  heroPh: { alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 27, fontWeight: '700', lineHeight: 32, marginTop: 16, letterSpacing: -0.5 },
  original: { fontSize: 13.5, fontStyle: 'italic', marginTop: 4 },
  stats: { flexDirection: 'row', borderRadius: RADIUS, marginTop: 14, overflow: 'hidden' },
  stat: { flex: 1, alignItems: 'center', paddingVertical: 11, gap: 3 },
  statV: { fontSize: 16, fontWeight: '700' },
  statL: { fontSize: 9.5, fontFamily: FONT.mono, letterSpacing: 0.7 },
  reposo: { fontSize: 12, fontFamily: FONT.mono, marginTop: 8, marginLeft: 4 },
  st: { marginTop: 26 },
  pad: { padding: 14, gap: 10 },
  keyRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, alignItems: 'center' },
  programa: { fontSize: 11.5, fontFamily: FONT.mono, letterSpacing: 0.5 },
  cta: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 9, paddingVertical: 16, borderRadius: 13, marginTop: 18 },
  ctaTxt: { color: '#FFF', fontSize: 17, fontWeight: '700' },
  scaler: { flexDirection: 'row', gap: 8 },
  sc: { flex: 1, alignItems: 'center', paddingVertical: 11, borderRadius: 10, borderWidth: 1 },
  ingRow: { flexDirection: 'row', gap: 12, paddingVertical: 9, alignItems: 'flex-start' },
  qty: { fontFamily: FONT.mono, fontSize: 13.5, fontWeight: '700', width: 82 },
  ingTxt: { flex: 1, fontSize: 14.5, lineHeight: 20 },
  ingMini: { flexDirection: 'row', gap: 10 },
  qtyMini: { fontFamily: FONT.mono, fontSize: 13, fontWeight: '700', width: 76 },
  ingTxtMini: { flex: 1, fontSize: 14, lineHeight: 19 },
  gauge: { flexDirection: 'row', gap: 16, alignItems: 'center', marginTop: 8 },
  gaugeTxt: { fontSize: 13, lineHeight: 18 },
  ghost: { borderWidth: 1, borderRadius: 11, paddingVertical: 13, alignItems: 'center', marginTop: 6 },
  paso: { flexDirection: 'row', gap: 12, paddingVertical: 12 },
  num: { width: 26, height: 26, borderRadius: 13, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  numTxt: { fontFamily: FONT.mono, fontSize: 12, fontWeight: '700' },
  pasoTxt: { fontSize: 14.5, lineHeight: 20 },
  dt: { fontSize: 14.5, fontWeight: '700', marginBottom: 2 },
  body: { fontSize: 14, lineHeight: 20 },
  b: { fontWeight: '700' },
  link: { fontSize: 14.5, fontWeight: '600', marginTop: 6 },
});
