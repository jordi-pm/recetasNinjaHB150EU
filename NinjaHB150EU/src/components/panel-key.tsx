import { StyleSheet, Text, View } from 'react-native';

import { usePalette } from '@/hooks/use-palette';
import type { BotonPanel } from '@/data/tipos';
import { botonUsaCalor } from '@/lib/format';
import { FONT } from '@/theme/colors';

/** Réplica de una tecla del panel. El LED va en ámbar
 *  cuando el programa usa calor (piloto HEAT ON) y en turquesa si no. */
const AJUSTES = ['LOW', 'MED', 'HIGH'];

export function PanelKey({ label, size = 'md' }: { label: BotonPanel | string; size?: 'sm' | 'md' | 'lg' }) {
  const c = usePalette();
  const esAjuste = AJUSTES.includes(label);
  const calor = !esAjuste && botonUsaCalor(label as BotonPanel);
  // Ámbar = enciende HEAT ON · turquesa = programa en frío · gris = ajuste
  const led = esAjuste ? '#6C7683' : calor ? '#F0913F' : '#5CC2D6';
  const dims =
    size === 'lg'
      ? { padV: 14, padH: 20, font: 19, dot: 10, radius: 13 }
      : size === 'sm'
        ? { padV: 5, padH: 9, font: 11, dot: 6, radius: 7 }
        : { padV: 8, padH: 12, font: 13, dot: 7, radius: 9 };

  return (
    <View
      accessible
      accessibilityRole="image"
      accessibilityLabel={
        esAjuste
          ? `Ajuste ${label} del panel`
          : `Tecla ${label} del panel${calor ? ', usa calor' : ''}`
      }
      style={[
        styles.key,
        {
          backgroundColor: c.panel,
          borderColor: c.panelBorder,
          paddingVertical: dims.padV,
          paddingHorizontal: dims.padH,
          borderRadius: dims.radius,
        },
      ]}>
      <View
        style={{
          width: dims.dot,
          height: dims.dot,
          borderRadius: dims.dot / 2,
          backgroundColor: led,
          shadowColor: led,
          shadowOpacity: esAjuste ? 0 : 0.9,
          shadowRadius: 4,
          shadowOffset: { width: 0, height: 0 },
        }}
      />
      <Text style={[styles.label, { fontSize: dims.font }]} maxFontSizeMultiplier={1.3}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  key: { flexDirection: 'row', alignItems: 'center', gap: 8, borderWidth: 1, alignSelf: 'flex-start' },
  label: { color: '#FFFFFF', fontFamily: FONT.mono, fontWeight: '600', letterSpacing: 0.5 },
});
