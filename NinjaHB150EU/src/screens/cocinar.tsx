import * as Haptics from 'expo-haptics';
import { useKeepAwake } from 'expo-keep-awake';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PanelKey } from '@/components/panel-key';
import { usePalette } from '@/hooks/use-palette';
import { avisaPitidos, botonUsaCalor, minutosPaso, pasosCocina } from '@/lib/format';
import { borrarSesion, guardarSesion } from '@/lib/sesion';
import { useApp, useRecetas } from '@/lib/store';
import { mmss, useTemporizador } from '@/lib/temporizador';
import { FONT } from '@/theme/colors';

export default function Cocinar() {
  useKeepAwake();
  const { id, k, desde } = useLocalSearchParams<{ id: string; k?: string; desde?: string }>();
  const c = usePalette();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const recetas = useRecetas();
  const { sonido, registrarCocinada } = useApp();

  const receta = recetas.find((r) => r.id === String(id));
  const escala = Math.max(1, Number(k) || 1);
  const pasos = useMemo(() => (receta ? pasosCocina(receta, escala) : []), [receta, escala]);

  const [i, setI] = useState(Math.min(Number(desde) || 0, Math.max(0, pasos.length - 1)));
  const [registrado, setRegistrado] = useState(false);
  const t = useTemporizador(sonido);

  const total = pasos.length;
  const paso = pasos[i];
  const ultimo = i === total - 1;
  const minutos = paso ? minutosPaso(paso) : null;

  // Guardar por dónde vas, para poder reanudar.
  useEffect(() => {
    if (receta && i > 0) guardarSesion({ id: receta.id, paso: i, escala });
  }, [receta, i, escala]);

  const salir = useCallback(() => {
    t.parar();
    router.back();
  }, [router, t]);

  const terminar = useCallback(() => {
    t.parar();
    borrarSesion();
    if (receta && !registrado) {
      registrarCocinada({ id: receta.id, fecha: Date.now(), escala });
      setRegistrado(true);
    }
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    Alert.alert(
      '¡Listo!',
      'La jarra sigue caliente: agárrala solo por el asa.\n\n¿Quieres limpiarla ahora? Llena con 700 ml de agua y 2 gotas de lavavajillas, tapa y pulsa CLEAN.',
      [
        { text: 'Ahora no', style: 'cancel', onPress: () => router.back() },
        {
          text: 'Apunta el CLEAN',
          onPress: () => {
            router.back();
            setTimeout(
              () =>
                Alert.alert(
                  'Programa CLEAN',
                  '1. Enjuaga rápido la jarra.\n2. 700 ml de agua + 2 gotas de lavavajillas.\n3. Tapa bien.\n4. Pulsa CLEAN.\n\nNo sumerjas la jarra ni la metas en el lavavajillas.'
                ),
              400
            );
          },
        },
      ]
    );
  }, [escala, receta, registrado, registrarCocinada, router, t]);

  const avanzar = useCallback(() => {
    if (ultimo) return terminar();
    t.parar();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    setI((x) => x + 1);
  }, [t, terminar, ultimo]);

  const retroceder = useCallback(() => {
    if (i === 0) return;
    t.parar();
    Haptics.selectionAsync().catch(() => {});
    setI((x) => x - 1);
  }, [i, t]);

  if (!receta || total === 0) {
    return (
      <View style={[styles.center, { backgroundColor: c.bg }]}>
        <Text style={{ color: c.muted }}>Receta no encontrada.</Text>
      </View>
    );
  }

  const arrancarTemporizador = () => {
    if (!minutos) return;
    const seg = Math.round(minutos * 60);
    t.arrancar(
      seg,
      receta.nombre,
      paso.b ? `Ha terminado ${paso.b}.` : 'Se acabó el tiempo del paso.'
    );
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
  };

  return (
    <View style={[styles.root, { backgroundColor: c.bg, paddingTop: insets.top + 8 }]}>
      {/* barra superior */}
      <View style={styles.top}>
        <Pressable onPress={salir} hitSlop={12} style={styles.close} accessibilityLabel="Salir del modo cocina">
          {Platform.OS === 'ios' ? (
            <SymbolView name="xmark" size={16} tintColor={c.text} resizeMode="scaleAspectFit" />
          ) : (
            <Text style={{ color: c.text, fontSize: 17 }}>✕</Text>
          )}
        </Pressable>
        <View style={[styles.track, { backgroundColor: c.separator }]}>
          <View style={[styles.fill, { backgroundColor: c.panel, width: `${((i + 1) / total) * 100}%` }]} />
        </View>
        <Text style={[styles.escala, { color: c.muted }]} maxFontSizeMultiplier={1.6}>
          {escala}×
        </Text>
      </View>

      <Text style={[styles.receta, { color: c.muted }]} numberOfLines={1}>
        {receta.nombre}
      </Text>

      {/* el paso: tocar en cualquier parte avanza */}
      <Pressable
        style={{ flex: 1 }}
        onPress={avanzar}
        accessibilityRole="button"
        accessibilityLabel="Siguiente paso"
        accessibilityHint="Toca en cualquier parte de la pantalla para avanzar">
        <ScrollView contentContainerStyle={styles.main} showsVerticalScrollIndicator={false}>
          <Text style={[styles.contador, { color: c.muted }]} maxFontSizeMultiplier={1.6}>
            PASO {i + 1} DE {total}
          </Text>

          {paso.faltan !== undefined && (
            <View style={[styles.faltan, { backgroundColor: c.hotSoft, borderColor: c.hot }]}>
              <Text style={[styles.faltanTxt, { color: c.hot }]}>
                Cuando falten {paso.faltan} minutos del programa
              </Text>
            </View>
          )}

          {paso.cap ? <Text style={[styles.cap, { color: c.muted }]}>{paso.cap}</Text> : null}
          {paso.txt ? <Text style={[styles.txt, { color: c.text }]}>{paso.txt}</Text> : null}

          {paso.b ? (
            <View style={styles.keyBlock}>
              <Text style={[styles.pulsa, { color: c.muted }]} maxFontSizeMultiplier={1.6}>
                PULSA EN LA BATIDORA
              </Text>
              <View style={styles.keyRow}>
                <PanelKey label={paso.b} size="lg" />
                {paso.sub ? <PanelKey label={paso.sub} size="lg" /> : null}
              </View>
              {botonUsaCalor(paso.b) && (
                <Text style={[styles.heat, { color: c.hot }]}>Se encenderá el piloto HEAT ON.</Text>
              )}
              {avisaPitidos(paso.b) && (
                <Text style={[styles.sub, { color: c.muted }]}>
                  Durante el programa oirás 3 pitidos y 2 s de pausa antes de cada removido. Es normal: asegúrate
                  de que el tapón central está puesto.
                </Text>
              )}
            </View>
          ) : null}

          {paso.aviso ? (
            (() => {
              // Rojo solo para peligros reales; lo demás son consejos.
              const peligro = /vapor|caliente|quemad|manopla|cuidado/i.test(paso.aviso!);
              const fondo = peligro ? c.dangerSoft : c.coldSoft;
              const borde = peligro ? c.danger : c.cold;
              return (
                <View style={[styles.aviso, { backgroundColor: fondo, borderColor: borde }]}>
                  <Text style={[styles.avisoTxt, { color: borde }]}>{paso.aviso}</Text>
                </View>
              );
            })()
          ) : null}

          {/* qué hay dentro de la jarra ahora mismo */}
          {paso.enJarra.length > 0 && (
            <View style={[styles.jarra, { borderColor: c.separator, backgroundColor: c.cardAlt }]}>
              <Text style={[styles.jarraTitulo, { color: c.muted }]} maxFontSizeMultiplier={1.4}>
                EN LA JARRA AHORA
              </Text>
              <Text style={[styles.jarraLista, { color: c.textSoft }]}>
                {paso.enJarra.join(' · ')}
              </Text>
              {paso.b && paso.continua && (
                <Text style={[styles.jarraNota, { color: c.ok }]}>
                  ✓ No saques nada: sigue todo dentro y la jarra no se mueve de la base.
                </Text>
              )}
            </View>
          )}

          {/* temporizador */}
          {minutos ? (
            <View style={styles.timerBlock}>
              {t.restante === null ? (
                <Pressable
                  onPress={arrancarTemporizador}
                  style={[styles.timerBtn, { borderColor: c.tint }]}
                  accessibilityLabel={`Poner temporizador de ${minutos} minutos`}>
                  {Platform.OS === 'ios' && (
                    <SymbolView name="timer" size={17} tintColor={c.tint} resizeMode="scaleAspectFit" />
                  )}
                  <Text style={{ color: c.tint, fontSize: 16, fontWeight: '600' }}>
                    Poner temporizador de {minutos < 1 ? `${Math.round(minutos * 60)} s` : `${minutos} min`}
                  </Text>
                </Pressable>
              ) : (
                <View style={[styles.timerVivo, { backgroundColor: t.terminado ? c.ok : c.panel }]}>
                  <Text style={styles.timerNum} maxFontSizeMultiplier={1.6}>
                    {t.terminado ? '¡Tiempo!' : mmss(t.restante)}
                  </Text>
                  <View style={styles.timerAcciones}>
                    {!t.terminado && (
                      <Pressable onPress={t.corriendo ? t.pausar : t.reanudar} hitSlop={10}>
                        <Text style={styles.timerAccion}>{t.corriendo ? 'Pausar' : 'Seguir'}</Text>
                      </Pressable>
                    )}
                    <Pressable onPress={t.parar} hitSlop={10}>
                      <Text style={styles.timerAccion}>Quitar</Text>
                    </Pressable>
                  </View>
                </View>
              )}
              <Text style={[styles.sub, { color: c.muted }]}>
                Te avisamos aunque tengas el móvil bloqueado.
              </Text>
            </View>
          ) : null}
        </ScrollView>
      </Pressable>

      {/* navegación */}
      <View style={[styles.nav, { paddingBottom: insets.bottom + 14, borderTopColor: c.separator }]}>
        <Pressable
          onPress={retroceder}
          disabled={i === 0}
          style={({ pressed }) => [
            styles.prev,
            { borderColor: c.separator, opacity: i === 0 ? 0.3 : pressed ? 0.6 : 1 },
          ]}
          accessibilityLabel="Paso anterior">
          {Platform.OS === 'ios' ? (
            <SymbolView name="chevron.left" size={17} tintColor={c.text} resizeMode="scaleAspectFit" />
          ) : (
            <Text style={{ color: c.text, fontSize: 18 }}>‹</Text>
          )}
        </Pressable>
        <Pressable
          onPress={avanzar}
          style={({ pressed }) => [
            styles.next,
            { backgroundColor: ultimo ? c.ok : c.panel, opacity: pressed ? 0.8 : 1 },
          ]}>
          <Text style={styles.nextTxt}>{ultimo ? '¡Listo! Terminar' : 'Siguiente'}</Text>
          {!ultimo && Platform.OS === 'ios' && (
            <SymbolView name="arrow.right" size={15} tintColor="#FFFFFF" resizeMode="scaleAspectFit" />
          )}
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  top: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: 18 },
  close: { width: 34, height: 34, alignItems: 'center', justifyContent: 'center' },
  track: { flex: 1, height: 5, borderRadius: 99, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 99 },
  escala: { fontFamily: FONT.mono, fontSize: 13, fontWeight: '700', width: 28, textAlign: 'right' },
  receta: { fontSize: 13, marginTop: 10, paddingHorizontal: 20 },
  main: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: 20, paddingVertical: 20, gap: 0 },
  contador: { fontFamily: FONT.mono, fontSize: 12.5, fontWeight: '700', letterSpacing: 1.6 },
  faltan: { borderWidth: 1, borderRadius: 9, paddingHorizontal: 11, paddingVertical: 7, alignSelf: 'flex-start', marginTop: 12 },
  faltanTxt: { fontSize: 13.5, fontWeight: '700' },
  cap: { fontSize: 15, marginTop: 14, lineHeight: 21 },
  txt: { fontSize: 30, fontWeight: '700', lineHeight: 37, marginTop: 8, letterSpacing: -0.6 },
  keyBlock: { marginTop: 26, gap: 10 },
  pulsa: { fontFamily: FONT.mono, fontSize: 11.5, fontWeight: '700', letterSpacing: 1.4 },
  keyRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  heat: { fontSize: 14, fontWeight: '600' },
  sub: { fontSize: 13, lineHeight: 18 },
  aviso: { borderWidth: 1, borderRadius: 11, padding: 12, marginTop: 20 },
  avisoTxt: { fontSize: 14, lineHeight: 19, fontWeight: '500' },
  jarra: { borderWidth: 1, borderRadius: 12, padding: 13, marginTop: 22, gap: 5 },
  jarraTitulo: { fontFamily: FONT.mono, fontSize: 10.5, fontWeight: '700', letterSpacing: 1.2 },
  jarraLista: { fontSize: 15, lineHeight: 21, fontWeight: '500' },
  jarraNota: { fontSize: 13, lineHeight: 18, marginTop: 3, fontWeight: '600' },
  timerBlock: { marginTop: 24, gap: 8 },
  timerBtn: { flexDirection: 'row', gap: 8, alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderRadius: 12, paddingVertical: 14 },
  timerVivo: { borderRadius: 12, paddingVertical: 16, paddingHorizontal: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  timerNum: { color: '#FFF', fontFamily: FONT.mono, fontSize: 32, fontWeight: '700', fontVariant: ['tabular-nums'] },
  timerAcciones: { flexDirection: 'row', gap: 16 },
  timerAccion: { color: '#FFF', fontSize: 15, fontWeight: '600', opacity: 0.85 },
  nav: { flexDirection: 'row', gap: 12, paddingHorizontal: 18, paddingTop: 14, borderTopWidth: StyleSheet.hairlineWidth },
  prev: { width: 58, borderWidth: 1, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  next: { flex: 1, flexDirection: 'row', gap: 9, alignItems: 'center', justifyContent: 'center', paddingVertical: 17, borderRadius: 13 },
  nextTxt: { color: '#FFF', fontSize: 17.5, fontWeight: '700' },
});
