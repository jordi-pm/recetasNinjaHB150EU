import * as ImagePicker from 'expo-image-picker';
import { Image } from 'expo-image';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useState } from 'react';
import {
  Alert, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View,
} from 'react-native';

import { JugGauge } from '@/components/jug-gauge';
import { PanelKey } from '@/components/panel-key';
import { Callout, Card, SectionTitle } from '@/components/ui-kit';
import { COMPATIBILIDAD } from '@/data/recetas';
import { usePalette } from '@/hooks/use-palette';
import {
  alergenosDe, cantidad, cargaMl, categoriaPorId, equivalencia, esCaliente, lineaNombre,
  limiteReal, maxEscala, NOMBRE_ALERGENO, programasDe, racionesPara, reposoTxt, seguridadDe, tiempoTotal,
} from '@/lib/format';
import { useApp, useRecetas } from '@/lib/store';
import { planificar } from '@/lib/tandas';
import { sustitucionesDe } from '@/data/sustituciones';
import { FONT, RADIUS } from '@/theme/colors';

export default function RecetaDetalle() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const c = usePalette();
  const router = useRouter();
  const recetas = useRecetas();
  const {
    esFav, alternarFav, añadirReceta, yaEnLista, notas, setNota, historial,
    actualizarCocinada, vecesCocinada, borrarPropia, fotos, setFoto, aparato,
  } = useApp();

  const [k, setK] = useState(1);
  const [puestos, setPuestos] = useState<number[]>([]);
  const [editandoNota, setEditandoNota] = useState(false);
  const [borrador, setBorrador] = useState('');

  const r = recetas.find((x) => x.id === String(id));
  if (!r) {
    return (
      <View style={[styles.center, { backgroundColor: c.bg }]}>
        <Text style={{ color: c.muted }}>Receta no encontrada.</Text>
      </View>
    );
  }

  const limite = limiteReal(r, aparato);
  const max = maxEscala(r, limite);
  const bloqueada = k > max;
  const carga = cargaMl(r, k);
  const aprieta = cargaMl(r, 1) > limite;
  const cat = categoriaPorId(r.cat);
  const fav = esFav(r.id);
  const alergenos = alergenosDe(r);
  const veces = vecesCocinada(r.id);
  const enLista = yaEnLista(r);
  const ultima = historial.find((h) => h.id === r.id);
  const nota = notas[r.id] ?? '';

  const hacerFoto = async () => {
    const acciones: any[] = [
      { text: 'Hacer una foto', onPress: async () => {
          const permiso = await ImagePicker.requestCameraPermissionsAsync();
          if (!permiso.granted) return;
          const res = await ImagePicker.launchCameraAsync({ quality: 0.6, allowsEditing: true, aspect: [16, 10] });
          if (!res.canceled && res.assets[0]) setFoto(r.id, res.assets[0].uri);
        } },
      { text: 'Elegir de la galería', onPress: async () => {
          const res = await ImagePicker.launchImageLibraryAsync({ quality: 0.6, allowsEditing: true, aspect: [16, 10] });
          if (!res.canceled && res.assets[0]) setFoto(r.id, res.assets[0].uri);
        } },
    ];
    if (fotos[r.id]) acciones.push({ text: 'Quitar la foto', style: 'destructive', onPress: () => setFoto(r.id, null) });
    acciones.push({ text: 'Cancelar', style: 'cancel' });
    Alert.alert('Foto del plato', 'Solo se guarda en tu móvil.', acciones);
  };

  const alternarPuesto = (i: number) =>
    setPuestos((p) => (p.includes(i) ? p.filter((x) => x !== i) : [...p, i]));

  return (
    <>
      <Stack.Screen
        options={{
          title: r.nombre,
          headerRight: () => (
            <Pressable onPress={() => alternarFav(r.id)} hitSlop={12} accessibilityLabel={fav ? 'Quitar de favoritos' : 'Añadir a favoritos'}>
              {Platform.OS === 'ios' ? (
                <SymbolView name={fav ? 'star.fill' : 'star'} size={22} tintColor={fav ? '#F5A524' : c.tint} resizeMode="scaleAspectFit" />
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
        <Pressable onPress={hacerFoto} accessibilityLabel={fotos[r.id] ? 'Cambiar la foto' : 'Hacer una foto del plato'}>
          {fotos[r.id] ? (
            <Image source={{ uri: fotos[r.id] }} style={styles.hero} contentFit="cover" transition={180} />
          ) : (
            <View style={[styles.hero, styles.heroPh, { backgroundColor: c.cardAlt }]}>
              <Text style={{ fontSize: 58 }}>{cat?.emoji}</Text>
              <Text style={[styles.heroPie, { color: c.muted }]}>Toca para poner tu foto</Text>
            </View>
          )}
        </Pressable>

        <Text style={[styles.title, { color: c.text }]}>{r.nombre}</Text>
        <Text style={[styles.original, { color: c.muted }]}>
          {r.propia ? 'Receta tuya' : r.plantilla ? 'Plantilla: eliges tú los ingredientes' : r.tecnica ? 'Técnica de base' : 'Para batidora sopera'}
        </Text>

        {alergenos.length > 0 && (
          <View style={styles.badges}>
            {alergenos.map((a) => (
              <View key={a} style={[styles.badge, { borderColor: c.separator, backgroundColor: c.cardAlt }]}>
                <Text style={[styles.badgeTxt, { color: c.textSoft }]}>{NOMBRE_ALERGENO[a]}</Text>
              </View>
            ))}
            <Text style={[styles.badgeNota, { color: c.muted }]}>deducido de los ingredientes</Text>
          </View>
        )}

        <View style={[styles.stats, { backgroundColor: c.card }]}>
          {([
            [String(racionesPara(r, k)), 'Raciones'],
            [`${tiempoTotal(r)}′`, 'Total'],
            [`${r.prep}′`, 'Prep.'],
            [r.dificultad, 'Dificultad'],
          ] as [string, string][]).map(([v, l], idx) => (
            <View key={l} style={[styles.stat, idx > 0 && { borderLeftWidth: StyleSheet.hairlineWidth, borderLeftColor: c.separator }]}>
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
          <Pressable onPress={() => router.push('/programas')}>
            <Text style={[styles.link, { color: c.tint }]}>¿Qué hace cada programa por dentro? ›</Text>
          </Pressable>
        </Card>

        {r.discrepancia ? (
          <View style={{ marginTop: 12 }}>
            <Callout tone="warn" title="⚠️ Léelo antes de empezar">{r.discrepancia}</Callout>
          </View>
        ) : null}

        <Pressable
          onPress={() => router.push(`/cocinar/${r.id}?k=${k}`)}
          disabled={bloqueada}
          style={({ pressed }) => [styles.cta, { backgroundColor: c.panel, opacity: bloqueada ? 0.4 : pressed ? 0.8 : 1 }]}>
          {Platform.OS === 'ios' && <SymbolView name="play.fill" size={16} tintColor="#FFFFFF" resizeMode="scaleAspectFit" />}
          <Text style={styles.ctaTxt}>Cocinar ahora</Text>
        </Pressable>

        {/* ------------------------- ingredientes ------------------------- */}
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
                  accessibilityLabel={`${n} veces, ${racionesPara(r, n)} raciones${bad ? ', no cabe en la jarra' : ''}`}
                  style={[styles.sc, {
                    backgroundColor: activo ? (bad ? c.danger : c.panel) : c.cardAlt,
                    borderColor: bad ? c.danger : activo ? c.panel : c.separator,
                  }]}>
                  <Text style={{ fontFamily: FONT.mono, fontWeight: '700', fontSize: 15, color: activo ? '#FFF' : bad ? c.danger : c.text }}>
                    {n}×{bad ? ' ⚠' : ''}
                  </Text>
                  <Text style={{ fontSize: 10.5, color: activo ? 'rgba(255,255,255,.75)' : c.muted, marginTop: 2 }}>
                    {racionesPara(r, n)} raciones
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {bloqueada ? (
            <>
              {(() => {
                const plan = planificar(r, racionesPara(r, k), limite);
                if (plan.imposible || plan.deUnaVez) return null;
                return (
                  <Callout tone="tip" title={`Hazlo en ${plan.tandas} tandas`}>
                    {`Para ${plan.raciones} raciones: ${plan.tandas} tandas de ${plan.escalaPorTanda}× (unos ${plan.cargaPorTanda} ml cada una, por debajo de los ${plan.limiteMl} ml).\n\nEntre tanda y tanda, enjuaga la jarra o pasa el programa CLEAN.`}
                  </Callout>
                );
              })()}
              <Callout tone="warn" title={`${k}× no cabe en tu jarra`}>
                {`A ${k}× la carga sería de unos ${(carga / 1000).toFixed(2).replace('.', ',')} L, por encima de la línea ${lineaNombre(r)} que el manual prohíbe superar. Por eso la app no te muestra esas cantidades: no serían una preparación segura.\n\nCon esta receta puedes llegar como máximo a ${max}×. Para más raciones, cocina dos tandas.`}
              </Callout>
              <View style={styles.gauge}>
                <JugGauge cargaMl={carga} limiteMl={limite} />
                <Text style={[styles.gaugeTxt, { color: c.muted, flex: 1 }]}>
                  Carga estimada a {k}×: {carga} ml{'\n'}Límite: {limite} ml
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
                const eq = equivalencia(ing, k);
                const puesto = puestos.includes(i);
                const noUsado = r.sinUsar?.includes(i);
                return (
                  <Pressable
                    key={i}
                    onPress={() => alternarPuesto(i)}
                    accessibilityLabel={`${q.txt} de ${ing.n}${puesto ? ', ya puesto' : ''}`}
                    style={[styles.ingRow, i > 0 && { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: c.separator }]}>
                    <View style={[styles.check, puesto ? { backgroundColor: c.ok, borderColor: c.ok } : { borderColor: c.separator }]}>
                      {puesto && Platform.OS === 'ios' && (
                        <SymbolView name="checkmark" size={11} tintColor="#FFF" resizeMode="scaleAspectFit" />
                      )}
                    </View>
                    <Text style={[styles.qty, { color: q.libre ? c.muted : c.text }, puesto && styles.tachado]}>{q.txt}</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.ingTxt, { color: c.textSoft }, puesto && styles.tachado]}>{ing.n}</Text>
                      {eq && <Text style={[styles.eq, { color: c.muted }]}>{eq}</Text>}
                      {sustitucionesDe(ing.n).length > 0 && (
                        <Text style={[styles.eq, { color: c.tint }]}>
                          ¿No tienes? {sustitucionesDe(ing.n).map((o) => o.por).join(' · ')}
                        </Text>
                      )}
                      {noUsado && <Text style={[styles.eq, { color: c.danger }]}>la receta original no dice dónde va</Text>}
                    </View>
                  </Pressable>
                );
              })}

              <View style={styles.gauge}>
                <JugGauge cargaMl={carga} limiteMl={limite} />
                <Text style={[styles.gaugeTxt, { color: c.muted, flex: 1 }]}>
                  Carga estimada a {k}×: {carga} ml de {limite} ml.{'\n'}
                  <Text style={{ fontSize: 11.5 }}>Cálculo de la app (±20 %), no del manual. Manda la línea grabada.</Text>
                </Text>
              </View>

              {aprieta && (
                <Callout tone="hot" title="Ojo con el llenado">
                  {`Nuestro cálculo da ~${(carga / 1000).toFixed(2).replace('.', ',')} L, por encima de la línea ${lineaNombre(r)}. Las cantidades están pensadas para llenar la jarra, así que van muy justas: ve echando el líquido hasta la línea grabada y guarda el resto en vez de forzarla.`}
                </Callout>
              )}

              <Pressable
                onPress={() => añadirReceta(r, k)}
                style={[styles.ghost, { borderColor: enLista ? c.ok : c.separator }]}>
                <Text style={{ color: enLista ? c.ok : c.tint, fontSize: 15.5, fontWeight: '600' }}>
                  {enLista
                    ? '✓ Ya están en la lista · tocar para volver a sumar'
                    : '🛒 Añadir ingredientes a la lista de la compra'}
                </Text>
              </Pressable>
            </>
          )}
        </Card>

        {/* --------------------------- preparación ------------------------ */}
        <SectionTitle style={styles.st}>Preparación</SectionTitle>
        <Card style={styles.pad}>
          {r.pasos.map((p, i) => (
            <View key={i} style={[styles.paso, i > 0 && { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: c.separator }]}>
              <View style={[styles.num, { backgroundColor: c.cardAlt, borderColor: c.separator }]}>
                <Text style={[styles.numTxt, { color: c.muted }]}>{i + 1}</Text>
              </View>
              <View style={{ flex: 1, gap: 8 }}>
                {p.faltan !== undefined && (
                  <Text style={[styles.faltan, { color: c.hot }]}>Cuando falten {p.faltan} min del programa</Text>
                )}
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
                    {p.min ? <Text style={[styles.min, { color: c.muted }]}>{p.min} min</Text> : null}
                  </View>
                ) : null}
                {p.aviso ? (
                  <Text
                    style={[
                      styles.pasoAviso,
                      { color: /vapor|caliente|quemad|manopla|cuidado/i.test(p.aviso) ? c.danger : c.cold },
                    ]}>
                    {p.aviso}
                  </Text>
                ) : null}
              </View>
            </View>
          ))}
          {r.tip ? <Callout tone="tip" title="Consejo del recetario">{r.tip}</Callout> : null}
          {r.nota ? <Callout tone="tip">{r.nota}</Callout> : null}
        </Card>

        {/* ----------------------------- tus notas ------------------------ */}
        <SectionTitle style={styles.st}>Tus notas</SectionTitle>
        <Card style={styles.pad}>
          {veces > 0 && (
            <Text style={[styles.body, { color: c.textSoft }]}>
              La has cocinado {veces} {veces === 1 ? 'vez' : 'veces'}.
            </Text>
          )}
          {ultima && !ultima.cupo && (
            <View style={{ gap: 8 }}>
              <Text style={[styles.body, { color: c.muted }]}>¿Qué tal cupo en la jarra la última vez?</Text>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                {([['sobrada', 'Sobrada'], ['justa', 'Justa'], ['se-paso', 'Se pasó']] as const).map(([v, t]) => (
                  <Pressable
                    key={v}
                    onPress={() => actualizarCocinada(ultima.fecha, { cupo: v })}
                    style={[styles.mini, { borderColor: c.separator }]}>
                    <Text style={{ color: c.tint, fontSize: 13.5, fontWeight: '600' }}>{t}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
          )}
          {ultima?.cupo && (
            <Text style={[styles.body, { color: c.textSoft }]}>
              Última vez cupo: <Text style={{ fontWeight: '700' }}>
                {ultima.cupo === 'sobrada' ? 'de sobra' : ultima.cupo === 'justa' ? 'justa' : 'se pasó de la línea'}
              </Text>
            </Text>
          )}

          {editandoNota ? (
            <>
              <TextInput
                value={borrador}
                onChangeText={setBorrador}
                multiline
                autoFocus
                placeholder="La próxima, menos sal…"
                placeholderTextColor={c.muted}
                style={[styles.input, { color: c.text, borderColor: c.separator, backgroundColor: c.cardAlt }]}
              />
              <View style={{ flexDirection: 'row', gap: 8 }}>
                <Pressable
                  onPress={() => { setNota(r.id, borrador); setEditandoNota(false); }}
                  style={[styles.mini, { borderColor: c.tint, flex: 1 }]}>
                  <Text style={{ color: c.tint, fontSize: 14.5, fontWeight: '600' }}>Guardar</Text>
                </Pressable>
                <Pressable onPress={() => setEditandoNota(false)} style={[styles.mini, { borderColor: c.separator, flex: 1 }]}>
                  <Text style={{ color: c.muted, fontSize: 14.5 }}>Cancelar</Text>
                </Pressable>
              </View>
            </>
          ) : (
            <Pressable
              onPress={() => { setBorrador(nota); setEditandoNota(true); }}
              style={[styles.ghost, { borderColor: c.separator }]}>
              <Text style={{ color: nota ? c.text : c.tint, fontSize: 15, fontWeight: nota ? '400' : '600' }}>
                {nota || '✎ Escribir una nota'}
              </Text>
            </Pressable>
          )}
        </Card>

        {/* ----------------------------- seguridad ------------------------ */}
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

        {/* ------------------------------ fuente -------------------------- */}
        <SectionTitle style={styles.st}>Sobre esta receta</SectionTitle>
        <Card style={styles.pad}>
          {r.propia ? (
            <>
              <Text style={[styles.body, { color: c.textSoft }]}>
                Receta tuya. Solo tú la ves y puedes editarla o borrarla cuando quieras.
              </Text>
              <Pressable
                onPress={() =>
                  Alert.alert('Borrar receta', `¿Seguro que quieres borrar «${r.nombre}»?`, [
                    { text: 'Cancelar', style: 'cancel' },
                    { text: 'Borrar', style: 'destructive', onPress: () => { borrarPropia(r.id); router.back(); } },
                  ])
                }
                style={[styles.ghost, { borderColor: c.danger }]}>
                <Text style={{ color: c.danger, fontSize: 15.5, fontWeight: '600' }}>Borrar esta receta</Text>
              </Pressable>
            </>
          ) : (
            <>
              <Text style={[styles.dt, { color: c.text }]}>{COMPATIBILIDAD.titulo}</Text>
              <Text style={[styles.body, { color: c.textSoft }]}>{COMPATIBILIDAD.texto}</Text>
              <Text style={[styles.body, { color: c.muted }]}>
                El sitio que ocupa en la jarra lo calcula la app con densidades aproximadas (±20 %). Antes de
                encender, mira la línea grabada en tu jarra: manda ella.
              </Text>
            </>
          )}
        </Card>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 16, maxWidth: 720, width: '100%', alignSelf: 'center', paddingBottom: 48 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  hero: { width: '100%', aspectRatio: 16 / 10, borderRadius: RADIUS, marginTop: 4 },
  heroPh: { alignItems: 'center', justifyContent: 'center', gap: 8 },
  heroPie: { fontSize: 12.5, fontWeight: '500' },
  title: { fontSize: 27, fontWeight: '700', lineHeight: 32, marginTop: 16, letterSpacing: -0.5 },
  original: { fontSize: 13.5, fontStyle: 'italic', marginTop: 4 },
  badges: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, alignItems: 'center', marginTop: 10 },
  badge: { borderWidth: 1, borderRadius: 7, paddingHorizontal: 8, paddingVertical: 4 },
  badgeTxt: { fontSize: 12, fontWeight: '600' },
  badgeNota: { fontSize: 11, fontStyle: 'italic' },
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
  sc: { flex: 1, alignItems: 'center', paddingVertical: 9, borderRadius: 10, borderWidth: 1 },
  ingRow: { flexDirection: 'row', gap: 10, paddingVertical: 10, alignItems: 'flex-start' },
  check: { width: 20, height: 20, borderRadius: 6, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center', marginTop: 1 },
  qty: { fontFamily: FONT.mono, fontSize: 13.5, fontWeight: '700', width: 74 },
  ingTxt: { fontSize: 14.5, lineHeight: 20 },
  eq: { fontSize: 11.5, fontFamily: FONT.mono, marginTop: 2 },
  tachado: { textDecorationLine: 'line-through', opacity: 0.45 },
  ingMini: { flexDirection: 'row', gap: 10 },
  qtyMini: { fontFamily: FONT.mono, fontSize: 13, fontWeight: '700', width: 76 },
  ingTxtMini: { flex: 1, fontSize: 14, lineHeight: 19 },
  gauge: { flexDirection: 'row', gap: 16, alignItems: 'center', marginTop: 8 },
  gaugeTxt: { fontSize: 13, lineHeight: 18 },
  ghost: { borderWidth: 1, borderRadius: 11, paddingVertical: 13, alignItems: 'center', marginTop: 6, paddingHorizontal: 12 },
  mini: { borderWidth: 1, borderRadius: 9, paddingVertical: 9, paddingHorizontal: 12, alignItems: 'center' },
  paso: { flexDirection: 'row', gap: 12, paddingVertical: 12 },
  num: { width: 26, height: 26, borderRadius: 13, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  numTxt: { fontFamily: FONT.mono, fontSize: 12, fontWeight: '700' },
  pasoTxt: { fontSize: 14.5, lineHeight: 20 },
  pasoAviso: { fontSize: 13, lineHeight: 18, fontWeight: '500' },
  faltan: { fontSize: 12.5, fontWeight: '700', fontFamily: FONT.mono },
  min: { fontSize: 12, fontFamily: FONT.mono },
  dt: { fontSize: 14.5, fontWeight: '700', marginBottom: 2 },
  body: { fontSize: 14, lineHeight: 20 },
  b: { fontWeight: '700' },
  link: { fontSize: 14.5, fontWeight: '600', marginTop: 6 },
  input: { borderWidth: 1, borderRadius: 10, padding: 12, fontSize: 15, minHeight: 90, textAlignVertical: 'top' },
});
