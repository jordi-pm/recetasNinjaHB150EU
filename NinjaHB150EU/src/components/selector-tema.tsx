import { Host, Image as SwiftImage, Picker } from '@expo/ui/swift-ui';
import { pickerStyle, tag } from '@expo/ui/swift-ui/modifiers';
import { SymbolView, type SFSymbol } from 'expo-symbols';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { usePalette } from '@/hooks/use-palette';
import { useTema, type PrefTema } from '@/lib/tema';

type Opcion = { v: PrefTema; icono: SFSymbol; t: string };

const OPCIONES: Opcion[] = [
  { v: 'claro', icono: 'sun.max.fill', t: 'Claro' },
  { v: 'sistema', icono: 'circle.lefthalf.filled', t: 'Sistema' },
  { v: 'oscuro', icono: 'moon.fill', t: 'Oscuro' },
];

/** Sol / automático / luna. UISegmentedControl nativo en iOS. */
export function SelectorTema() {
  const { pref, setPref, esquema } = useTema();
  const c = usePalette();

  if (Platform.OS === 'ios') {
    return (
      <Host matchContents style={styles.host} colorScheme={esquema}>
        <Picker
          selection={pref}
          onSelectionChange={(v) => setPref(v as PrefTema)}
          modifiers={[pickerStyle('segmented')]}>
          {OPCIONES.map((o) => (
            <SwiftImage key={o.v} systemName={o.icono} modifiers={[tag(o.v)]} />
          ))}
        </Picker>
      </Host>
    );
  }

  return (
    <View style={[styles.fallback, { backgroundColor: c.cardAlt }]}>
      {OPCIONES.map((o) => {
        const activo = pref === o.v;
        return (
          <Pressable
            key={o.v}
            onPress={() => setPref(o.v)}
            accessibilityLabel={o.t}
            style={[styles.seg, activo && { backgroundColor: c.card }]}>
            <Text style={{ color: c.text, fontSize: 16 }}>
              {o.v === 'claro' ? '☀️' : o.v === 'oscuro' ? '🌙' : '◐'}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

/** El icono que representa el modo que se está pintando ahora. */
export function IconoTemaActual({ size = 17, color }: { size?: number; color?: string }) {
  const { esquema } = useTema();
  const c = usePalette();
  const nombre: SFSymbol = esquema === 'dark' ? 'moon.fill' : 'sun.max.fill';
  if (Platform.OS !== 'ios') return <Text style={{ fontSize: size }}>{esquema === 'dark' ? '🌙' : '☀️'}</Text>;
  return <SymbolView name={nombre} size={size} tintColor={color ?? c.tint} resizeMode="scaleAspectFit" />;
}

const styles = StyleSheet.create({
  host: { minHeight: 34 },
  fallback: { flexDirection: 'row', borderRadius: 9, padding: 2, gap: 2 },
  seg: { flex: 1, alignItems: 'center', paddingVertical: 8, borderRadius: 7 },
});
