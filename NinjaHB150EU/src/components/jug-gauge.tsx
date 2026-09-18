import { StyleSheet, Text, View } from 'react-native';

import { usePalette } from '@/hooks/use-palette';
import { FONT } from '@/theme/colors';

const MAX_ML = 1700;   // capacidad total de la jarra
const H = 104;         // alto del dibujo
const W = 58;          // ancho de la jarra
const BORDE = 1.5;
const INSET = BORDE + 1;               // hueco entre el borde y el líquido
const UTIL = H - INSET * 2;            // alto útil para la escala

/** Altura en píxeles que ocupa un volumen, medida desde el fondo interior. */
const nivel = (ml: number) => (Math.min(ml, MAX_ML) / MAX_ML) * UTIL;

/** La jarra de la HB150EU con sus dos líneas grabadas (1,4 L HOT / 1,6 L COLD)
 *  y el nivel que alcanzaría la carga actual. Todo en la misma escala. */
export function JugGauge({ cargaMl, limiteMl }: { cargaMl: number; limiteMl: number }) {
  const c = usePalette();
  const over = cargaMl > limiteMl;
  const relleno = over ? c.danger : limiteMl === 1400 ? c.hot : c.cold;

  const Linea = ({ ml, color, label }: { ml: number; color: string; label: string }) => (
    <View style={[styles.linea, { bottom: INSET + nivel(ml) }]} pointerEvents="none">
      <View style={{ width: W, height: 1.5, backgroundColor: color }} />
      <Text style={[styles.lineaLabel, { color }]} maxFontSizeMultiplier={1.3}>
        {label}
      </Text>
    </View>
  );

  return (
    <View style={{ width: W + 36, height: H }}>
      <View style={[styles.jarra, { borderColor: c.separator, backgroundColor: c.cardAlt }]}>
        <View
          style={{
            position: 'absolute',
            left: INSET - BORDE,
            right: INSET - BORDE,
            bottom: INSET - BORDE,
            height: Math.max(3, nivel(cargaMl)),
            backgroundColor: relleno,
            opacity: 0.85,
            borderRadius: 3,
          }}
        />
      </View>
      <Linea ml={1400} color={c.hot} label="HOT" />
      <Linea ml={1600} color={c.cold} label="COLD" />
    </View>
  );
}

const styles = StyleSheet.create({
  jarra: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: W,
    height: H,
    borderWidth: BORDE,
    borderRadius: 8,
    overflow: 'hidden',
  },
  linea: { position: 'absolute', left: 0, right: 0, flexDirection: 'row', alignItems: 'center', gap: 3 },
  lineaLabel: { fontFamily: FONT.mono, fontSize: 8.5, fontWeight: '700' },
});
