import { Stack, useRouter } from 'expo-router';
import { abrirDocumento } from '@/lib/documentos';
import { Alert, Platform, Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';

import { IconoTemaActual, SelectorTema } from '@/components/selector-tema';
import { Card, SectionTitle } from '@/components/ui-kit';
import { FUENTE_GUIA, FUENTE_MANUAL, RECETAS } from '@/data/recetas';
import { usePalette } from '@/hooks/use-palette';
import { useApp } from '@/lib/store';
import { pedirPermisoAvisos } from '@/lib/temporizador';
import { useTema } from '@/lib/tema';
import { FONT, RADIUS } from '@/theme/colors';

const NOMBRE_PREF = { claro: 'Claro', oscuro: 'Oscuro', sistema: 'Sistema' } as const;

export default function Ajustes() {
  const c = usePalette();
  const router = useRouter();
  const { pref } = useTema();
  const { fav, compra, historial, propias, notas, sonido, setSonido, restablecer } = useApp();
  const oficiales = RECETAS.filter((r) => !r.plantilla && !r.tecnica).length;

  const confirmarReset = () =>
    Alert.alert(
      'Restablecer',
      'Se borrarán favoritos, lista de la compra, notas e historial. Tus recetas propias NO se tocan.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Restablecer', style: 'destructive', onPress: restablecer },
      ]
    );

  const Fila = ({ etiqueta, valor, primera, onPress }: { etiqueta: string; valor?: string; primera?: boolean; onPress?: () => void }) => {
    const contenido = (
      <View style={[styles.fila, { borderTopColor: c.separator }, primera && styles.sinBorde]}>
        <Text style={[styles.filaEtiqueta, { color: c.textSoft }]}>{etiqueta}</Text>
        {valor !== undefined && <Text style={[styles.filaValor, { color: c.muted }]}>{valor}</Text>}
        {onPress && <Text style={{ color: c.muted, fontSize: 18 }}>›</Text>}
      </View>
    );
    return onPress ? (
      <Pressable onPress={onPress} style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}>{contenido}</Pressable>
    ) : contenido;
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Ajustes',
          headerRight: () => (
            <Pressable onPress={() => router.back()} hitSlop={12}>
              <Text style={{ color: c.tint, fontSize: 17, fontWeight: '600' }}>Listo</Text>
            </Pressable>
          ),
        }}
      />
      <ScrollView
        style={{ backgroundColor: c.bg }}
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={styles.content}>
        <SectionTitle>Apariencia</SectionTitle>
        <Card style={styles.pad}>
          <View style={styles.cabecera}>
            <IconoTemaActual size={19} />
            <Text style={[styles.cabeceraTxt, { color: c.text }]}>{NOMBRE_PREF[pref]}</Text>
          </View>
          <SelectorTema />
          <Text style={[styles.body, { color: c.muted }]}>
            ☀️ claro · ◐ el ajuste de iOS · 🌙 oscuro. El modo oscuro va bien para cocinar de noche sin deslumbrarte.
          </Text>
        </Card>

        <SectionTitle style={styles.st}>Mientras cocinas</SectionTitle>
        <Card style={styles.pad}>
          <View style={[styles.fila, styles.sinBorde]}>
            <View style={{ flex: 1, gap: 2 }}>
              <Text style={[styles.filaEtiqueta, { color: c.textSoft }]}>Sonido en los avisos</Text>
              <Text style={[styles.ayuda, { color: c.muted }]}>
                Además de la vibración, para cuando tengas el móvil lejos.
              </Text>
            </View>
            <Switch value={sonido} onValueChange={setSonido} />
          </View>
          <Pressable
            onPress={() =>
              pedirPermisoAvisos().then((ok) =>
                Alert.alert(
                  ok ? 'Avisos activados' : 'Avisos desactivados',
                  ok
                    ? 'Te avisaremos cuando termine un temporizador aunque tengas el móvil bloqueado.'
                    : 'Sin permiso de notificaciones solo verás el temporizador con la app abierta. Puedes cambiarlo en Ajustes de iOS.'
                )
              )
            }
            style={[styles.ghost, { borderColor: c.separator }]}>
            <Text style={{ color: c.tint, fontSize: 15, fontWeight: '600' }}>Comprobar permiso de avisos</Text>
          </Pressable>
          <Text style={[styles.body, { color: c.muted }]}>
            En el modo cocina la pantalla no se apaga y puedes avanzar tocando en cualquier parte.
          </Text>
        </Card>

        <SectionTitle style={styles.st}>Herramientas</SectionTitle>
        <Card style={styles.pad}>
          <Fila primera etiqueta="¿Cabe en la jarra?" onPress={() => { router.back(); setTimeout(() => router.push('/cabe'), 350); }} />
          <Fila etiqueta="Los programas por dentro" onPress={() => { router.back(); setTimeout(() => router.push('/programas'), 350); }} />
          <Fila etiqueta="Añadir receta tuya" onPress={() => { router.back(); setTimeout(() => router.push('/nueva-receta'), 350); }} />
        </Card>

        <SectionTitle style={styles.st}>Tus datos</SectionTitle>
        <Card style={styles.pad}>
          <Fila primera etiqueta="Recetas favoritas" valor={String(fav.length)} />
          <Fila etiqueta="Ingredientes en la lista" valor={String(compra.length)} />
          <Fila etiqueta="Notas escritas" valor={String(Object.keys(notas).length)} />
          <Fila etiqueta="Veces que has cocinado" valor={String(historial.length)} />
          <Fila etiqueta="Recetas tuyas" valor={String(propias.length)} />
          <Pressable onPress={confirmarReset} style={[styles.destructivo, { borderColor: c.danger }]}>
            <Text style={{ color: c.danger, fontSize: 15.5, fontWeight: '600' }}>
              Restablecer favoritos, lista, notas e historial
            </Text>
          </Pressable>
        </Card>

        <SectionTitle style={styles.st}>Acerca de</SectionTitle>
        <Card style={styles.pad}>
          <Fila primera etiqueta="Aparato" valor="HB150EU" />
          <Fila etiqueta="Recetas oficiales" valor={String(oficiales)} />
          <Fila etiqueta="Versión" valor="1.1.0" />
          <Text style={[styles.body, { color: c.muted, marginTop: 12 }]}>
            Todas las recetas oficiales salen del manual y del recetario de la Ninja Foodi Blender &amp; Soup Maker
            HB150EU. Ninguna procede de Air Fryer, Multicooker, Creami ni de otros modelos Ninja. Los cálculos de
            volumen y los alérgenos los deduce la app y no son datos de Ninja.
          </Text>
          <Pressable onPress={() => abrirDocumento('manual', FUENTE_MANUAL.url)}>
            <Text style={[styles.link, { color: c.tint }]}>Manual oficial (PDF) ›</Text>
          </Pressable>
          <Pressable onPress={() => abrirDocumento('recetario', FUENTE_GUIA.url)}>
            <Text style={[styles.link, { color: c.tint }]}>Recetario oficial (PDF) ›</Text>
          </Pressable>
        </Card>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 16, maxWidth: 720, width: '100%', alignSelf: 'center', paddingBottom: 40, paddingTop: Platform.OS === 'ios' ? 8 : 16 },
  pad: { padding: 14, gap: 10, borderRadius: RADIUS },
  st: { marginTop: 26 },
  cabecera: { flexDirection: 'row', alignItems: 'center', gap: 9 },
  cabeceraTxt: { fontSize: 17, fontWeight: '600' },
  fila: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 11, marginTop: 11, borderTopWidth: StyleSheet.hairlineWidth, gap: 12 },
  sinBorde: { borderTopWidth: 0, paddingTop: 0, marginTop: 0 },
  filaEtiqueta: { fontSize: 15, flex: 1 },
  filaValor: { fontSize: 15, fontFamily: FONT.mono, fontVariant: ['tabular-nums'] },
  ayuda: { fontSize: 12.5, lineHeight: 17 },
  destructivo: { borderWidth: 1, borderRadius: 11, paddingVertical: 13, alignItems: 'center', marginTop: 14, paddingHorizontal: 10 },
  ghost: { borderWidth: 1, borderRadius: 11, paddingVertical: 12, alignItems: 'center' },
  body: { fontSize: 13.5, lineHeight: 19 },
  link: { fontSize: 14.5, fontWeight: '600', marginTop: 8 },
});
