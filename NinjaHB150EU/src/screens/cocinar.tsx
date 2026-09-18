import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useKeepAwake } from 'expo-keep-awake';
import { SymbolView } from 'expo-symbols';
import { useMemo, useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PanelKey } from '@/components/panel-key';
import { usePalette } from '@/hooks/use-palette';
import { botonUsaCalor, pasosCocina, recetaPorId } from '@/lib/format';
import { FONT } from '@/theme/colors';

export default function Cocinar() {
  useKeepAwake(); // la pantalla no se apaga mientras cocinas
  const { id, k } = useLocalSearchParams<{ id: string; k?: string }>();
  const c = usePalette();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [i, setI] = useState(0);

  const receta = recetaPorId(String(id));
  const escala = Math.max(1, Number(k) || 1);
  const pasos = useMemo(() => (receta ? pasosCocina(receta, escala) : []), [receta, escala]);

  if (!receta || pasos.length === 0) {
    return (
      <View style={[styles.center, { backgroundColor: c.bg }]}>
        <Text style={{ color: c.muted }}>Receta no encontrada.</Text>
      </View>
    );
  }

  const total = pasos.length;
  const paso = pasos[i];
  const ultimo = i === total - 1;

  const avanzar = () => {
    if (ultimo) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      router.back();
    } else {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
      setI(i + 1);
    }
  };
  const retroceder = () => {
    if (i > 0) {
      Haptics.selectionAsync().catch(() => {});
      setI(i - 1);
    }
  };

  return (
    <View style={[styles.root, { backgroundColor: c.bg, paddingTop: insets.top + 8 }]}>
      <View style={styles.top}>
        <Pressable onPress={() => router.back()} hitSlop={12} style={styles.close} accessibilityLabel="Salir">
          {Platform.OS === 'ios' ? (
            <SymbolView name="xmark" size={16} tintColor={c.text} resizeMode="scaleAspectFit" />
          ) : (
            <Text style={{ color: c.text, fontSize: 17 }}>✕</Text>
          )}
        </Pressable>
        <View style={[styles.track, { backgroundColor: c.separator }]}>
          <View
            style={[styles.fill, { backgroundColor: c.panel, width: `${((i + 1) / total) * 100}%` }]}
          />
        </View>
        <Text style={[styles.escala, { color: c.muted }]} allowFontScaling={false}>
          {escala}×
        </Text>
      </View>

      <Text style={[styles.receta, { color: c.muted }]} numberOfLines={1}>
        {receta.nombre}
      </Text>

      <ScrollView contentContainerStyle={styles.main} showsVerticalScrollIndicator={false}>
        <Text style={[styles.contador, { color: c.muted }]} allowFontScaling={false}>
          PASO {i + 1} DE {total}
        </Text>

        {paso.cap ? <Text style={[styles.cap, { color: c.muted }]}>{paso.cap}</Text> : null}
        {paso.txt ? <Text style={[styles.txt, { color: c.text }]}>{paso.txt}</Text> : null}

        {paso.b ? (
          <View style={styles.keyBlock}>
            <Text style={[styles.pulsa, { color: c.muted }]} allowFontScaling={false}>
              PULSA EN LA BATIDORA
            </Text>
            <View style={styles.keyRow}>
              <PanelKey label={paso.b} size="lg" />
              {paso.sub ? <PanelKey label={paso.sub} size="lg" /> : null}
            </View>
            {botonUsaCalor(paso.b) ? (
              <Text style={[styles.heat, { color: c.hot }]}>Se encenderá el piloto HEAT ON.</Text>
            ) : null}
          </View>
        ) : null}
      </ScrollView>

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
          style={({ pressed }) => [styles.next, { backgroundColor: ultimo ? c.ok : c.panel, opacity: pressed ? 0.8 : 1 }]}>
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
  main: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: 20, paddingVertical: 24 },
  contador: { fontFamily: FONT.mono, fontSize: 12.5, fontWeight: '700', letterSpacing: 1.6 },
  cap: { fontSize: 15, marginTop: 16, lineHeight: 21 },
  txt: { fontSize: 30, fontWeight: '700', lineHeight: 37, marginTop: 8, letterSpacing: -0.6 },
  keyBlock: { marginTop: 30, gap: 10 },
  pulsa: { fontFamily: FONT.mono, fontSize: 11.5, fontWeight: '700', letterSpacing: 1.4 },
  keyRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  heat: { fontSize: 14, marginTop: 2, fontWeight: '500' },
  nav: { flexDirection: 'row', gap: 12, paddingHorizontal: 18, paddingTop: 14, borderTopWidth: StyleSheet.hairlineWidth },
  prev: { width: 58, borderWidth: 1, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  next: { flex: 1, flexDirection: 'row', gap: 9, alignItems: 'center', justifyContent: 'center', paddingVertical: 17, borderRadius: 13 },
  nextTxt: { color: '#FFF', fontSize: 17.5, fontWeight: '700' },
});
