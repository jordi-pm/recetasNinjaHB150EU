import { StyleSheet, Text, View, type ViewStyle } from 'react-native';

import { usePalette } from '@/hooks/use-palette';
import { FONT, RADIUS } from '@/theme/colors';

/** Encabezado de sección al estilo de los ajustes de iOS. */
export function SectionTitle({ children, style }: { children: React.ReactNode; style?: ViewStyle }) {
  const c = usePalette();
  return (
    <Text style={[styles.sectionTitle, { color: c.muted }, style as any]}>
      {String(children).toUpperCase()}
    </Text>
  );
}

/** Tarjeta agrupada (grouped inset list de iOS). */
export function Card({ children, style }: { children: React.ReactNode; style?: ViewStyle }) {
  const c = usePalette();
  return <View style={[styles.card, { backgroundColor: c.card }, style]}>{children}</View>;
}

export function Separator({ inset = 0 }: { inset?: number }) {
  const c = usePalette();
  return <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: c.separator, marginLeft: inset }} />;
}

/** Aviso destacado: peligro, consejo o calor. */
export function Callout({
  tone = 'tip',
  title,
  children,
}: {
  tone?: 'tip' | 'warn' | 'hot';
  title?: string;
  children: React.ReactNode;
}) {
  const c = usePalette();
  const map = {
    tip: { bg: c.coldSoft, fg: c.cold },
    warn: { bg: c.dangerSoft, fg: c.danger },
    hot: { bg: c.hotSoft, fg: c.hot },
  }[tone];
  return (
    <View style={[styles.callout, { backgroundColor: map.bg, borderColor: map.fg }]}>
      {title ? <Text style={[styles.calloutTitle, { color: map.fg }]}>{title}</Text> : null}
      <Text style={[styles.calloutBody, { color: map.fg }]}>{children}</Text>
    </View>
  );
}

/** Etiqueta monoespaciada en versalitas. */
export function Eyebrow({ children, color }: { children: React.ReactNode; color?: string }) {
  const c = usePalette();
  return (
    <Text style={[styles.eyebrow, { color: color ?? c.muted }]}>{String(children).toUpperCase()}</Text>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.6,
    marginBottom: 8,
    marginLeft: 4,
  },
  card: { borderRadius: RADIUS, overflow: 'hidden' },
  callout: { borderRadius: 12, borderWidth: 1, padding: 13, gap: 4 },
  calloutTitle: { fontSize: 15, fontWeight: '700' },
  calloutBody: { fontSize: 14, lineHeight: 20 },
  eyebrow: { fontFamily: FONT.mono, fontSize: 11, fontWeight: '600', letterSpacing: 1.2 },
});
