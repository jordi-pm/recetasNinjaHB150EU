import { Stack } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Callout, Card, SectionTitle } from '@/components/ui-kit';
import { SINTOMAS } from '@/data/diagnostico';
import { usePalette } from '@/hooks/use-palette';
import { RADIUS } from '@/theme/colors';

/** «Me ha salido mal»: síntoma → causa → qué hacer ahora. */
export default function Diagnostico() {
  const c = usePalette();
  const [abierto, setAbierto] = useState<string | null>(null);

  return (
    <>
      <Stack.Screen options={{ title: '¿Qué ha salido mal?' }} />
      <ScrollView style={{ backgroundColor: c.bg }} contentInsetAdjustmentBehavior="automatic" contentContainerStyle={styles.content}>
        <Callout tone="tip" title="Dime qué ha pasado">
          Casi todo tiene arreglo sin tirar nada. Toca el síntoma que más se parezca.
        </Callout>

        <SectionTitle style={styles.st}>Síntomas</SectionTitle>
        <View style={{ gap: 10 }}>
          {SINTOMAS.map((s) => {
            const open = abierto === s.id;
            return (
              <Card key={s.id}>
                <Pressable
                  onPress={() => setAbierto(open ? null : s.id)}
                  accessibilityRole="button"
                  accessibilityState={{ expanded: open }}
                  style={({ pressed }) => [styles.cabecera, { opacity: pressed ? 0.6 : 1 }]}>
                  <Text style={{ fontSize: 24 }}>{s.emoji}</Text>
                  <Text style={[styles.titulo, { color: c.text }]}>{s.titulo}</Text>
                  <Text style={{ color: c.muted, fontSize: 17 }}>{open ? '⌃' : '⌄'}</Text>
                </Pressable>

                {open && (
                  <View style={{ paddingHorizontal: 14, paddingBottom: 14, gap: 12 }}>
                    {s.causas.map((ca, i) => (
                      <View key={i} style={[styles.causa, { borderTopColor: c.separator }, i === 0 && { borderTopWidth: 0, paddingTop: 0 }]}>
                        <Text style={[styles.porque, { color: c.muted }]}>{ca.porque}</Text>
                        <Text style={[styles.haz, { color: c.textSoft }]}>→ {ca.haz}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </Card>
            );
          })}
        </View>

        <Callout tone="hot" title="Y si se ha salido por la tapa">
          Apaga con POWER y desenchufa antes de limpiar nada. La jarra y lo que haya caído en la base están
          calientes: espera a que se enfríe y usa manoplas.
        </Callout>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 16, paddingBottom: 48, paddingTop: 8, maxWidth: 720, width: '100%', alignSelf: 'center' },
  st: { marginTop: 22 },
  cabecera: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: RADIUS },
  titulo: { flex: 1, fontSize: 15.5, fontWeight: '600', lineHeight: 20 },
  causa: { borderTopWidth: StyleSheet.hairlineWidth, paddingTop: 12, gap: 4 },
  porque: { fontSize: 13.5, lineHeight: 19, fontStyle: 'italic' },
  haz: { fontSize: 14.5, lineHeight: 20, fontWeight: '500' },
});
