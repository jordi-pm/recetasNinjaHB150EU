import { Stack } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useMemo, useState } from 'react';
import {
  Alert, Platform, Pressable, SectionList, Share, StyleSheet, Text, TextInput, View,
} from 'react-native';
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';

import { usePalette } from '@/hooks/use-palette';
import { fmt, NOMBRE_PASILLO, ORDEN_PASILLOS } from '@/lib/format';
import { useApp, type ItemCompra } from '@/lib/store';
import { FONT, RADIUS } from '@/theme/colors';

const textoCantidad = (it: ItemCompra) =>
  it.cants.map((q) => `${fmt(q.c)}${q.u ? ' ' + q.u : ''}`).join(' + ');

export default function Compra() {
  const c = usePalette();
  const { compra, alternarItem, quitarItem, vaciarCompra, marcarTodoComprado, añadirManual, pendientes } = useApp();
  const [nuevo, setNuevo] = useState('');

  const secciones = useMemo(() => {
    const pend = compra.filter((i) => !i.hecho);
    const hechos = compra.filter((i) => i.hecho);
    const porPasillo = ORDEN_PASILLOS
      .map((p) => ({ title: NOMBRE_PASILLO[p], data: pend.filter((i) => i.pasillo === p) }))
      .filter((s) => s.data.length > 0);
    return hechos.length
      ? [...porPasillo, { title: `✓ En el carro · ${hechos.length}`, data: hechos }]
      : porPasillo;
  }, [compra]);

  const compartir = () => {
    const lineas = ORDEN_PASILLOS.flatMap((p) => {
      const items = compra.filter((i) => i.pasillo === p && !i.hecho);
      if (!items.length) return [];
      return [
        '',
        NOMBRE_PASILLO[p].replace(/^\S+\s/, '').toUpperCase(),
        ...items.map((i) => `· ${textoCantidad(i)}${i.cants.length ? ' ' : ''}${i.nombre}`),
      ];
    });
    Share.share({ message: ['Lista de la compra', ...lineas].join('\n').trim() }).catch(() => {});
  };

  const confirmarVaciar = () =>
    Alert.alert('Vaciar la lista', '¿Seguro que quieres borrar todos los ingredientes?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Vaciar', style: 'destructive', onPress: vaciarCompra },
    ]);

  const Item = ({ item }: { item: ItemCompra }) => {
    const cant = textoCantidad(item);
    return (
      <ReanimatedSwipeable
        friction={2}
        rightThreshold={40}
        renderRightActions={() => (
          <Pressable
            onPress={() => quitarItem(item.k)}
            style={[styles.delete, { backgroundColor: c.danger }]}
            accessibilityLabel={`Quitar ${item.nombre}`}>
            <Text style={styles.deleteTxt}>Quitar</Text>
          </Pressable>
        )}>
        <Pressable
          onPress={() => alternarItem(item.k)}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: item.hecho }}
          accessibilityLabel={`${cant} ${item.nombre}`}
          style={({ pressed }) => [styles.row, { backgroundColor: c.card, opacity: pressed ? 0.6 : 1 }]}>
          <View style={[styles.tick, item.hecho ? { backgroundColor: c.ok, borderColor: c.ok } : { borderColor: c.separator }]}>
            {item.hecho &&
              (Platform.OS === 'ios' ? (
                <SymbolView name="checkmark" size={13} tintColor="#FFFFFF" resizeMode="scaleAspectFit" />
              ) : (
                <Text style={{ color: '#FFF', fontSize: 13 }}>✓</Text>
              ))}
          </View>
          <View style={{ flex: 1, gap: 2 }}>
            <Text style={[styles.itemTxt, { color: item.hecho ? c.muted : c.text }, item.hecho && styles.tachado]}>
              {cant ? <Text style={styles.cant}>{cant} </Text> : null}
              {item.nombre}
            </Text>
            {item.de.length > 0 && (
              <Text style={[styles.itemSrc, { color: c.muted }]} numberOfLines={1}>
                {item.de.join(' · ')}
              </Text>
            )}
          </View>
        </Pressable>
      </ReanimatedSwipeable>
    );
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Compra',
          headerRight: () =>
            compra.length ? (
              <View style={{ flexDirection: 'row', gap: 16 }}>
                <Pressable onPress={compartir} hitSlop={10} accessibilityLabel="Compartir la lista">
                  {Platform.OS === 'ios' ? (
                    <SymbolView name="square.and.arrow.up" size={20} tintColor={c.tint} resizeMode="scaleAspectFit" />
                  ) : (
                    <Text style={{ color: c.tint, fontSize: 16 }}>Compartir</Text>
                  )}
                </Pressable>
                <Pressable onPress={confirmarVaciar} hitSlop={10}>
                  <Text style={{ color: c.danger, fontSize: 16 }}>Vaciar</Text>
                </Pressable>
              </View>
            ) : null,
        }}
      />
      <SectionList
        style={{ backgroundColor: c.bg }}
        contentInsetAdjustmentBehavior="automatic"
        sections={secciones}
        keyExtractor={(i) => i.k}
        contentContainerStyle={styles.content}
        stickySectionHeadersEnabled={false}
        keyboardDismissMode="on-drag"
        ListHeaderComponent={
          <View style={[styles.añadir, { backgroundColor: c.card, borderColor: c.separator }]}>
            <TextInput
              value={nuevo}
              onChangeText={setNuevo}
              onSubmitEditing={() => { añadirManual(nuevo); setNuevo(''); }}
              returnKeyType="done"
              placeholder="Añadir algo a mano (pan, servilletas…)"
              placeholderTextColor={c.muted}
              style={[styles.inputAñadir, { color: c.text }]}
            />
            {nuevo.trim() ? (
              <Pressable onPress={() => { añadirManual(nuevo); setNuevo(''); }} hitSlop={8}>
                <Text style={{ color: c.tint, fontSize: 15, fontWeight: '600' }}>Añadir</Text>
              </Pressable>
            ) : null}
          </View>
        }
        renderSectionHeader={({ section }) => (
          <Text style={[styles.sectionH, { color: c.muted }]}>{section.title.toUpperCase()}</Text>
        )}
        renderSectionFooter={() => <View style={{ height: 22 }} />}
        renderItem={({ item, index, section }) => (
          <View
            style={[
              styles.wrapItem,
              { backgroundColor: c.card },
              index === 0 && styles.first,
              index === section.data.length - 1 && styles.last,
            ]}>
            <Item item={item} />
            {index < section.data.length - 1 && (
              <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: c.separator, marginLeft: 48 }} />
            )}
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={{ fontSize: 40 }}>🛒</Text>
            <Text style={[styles.emptyTxt, { color: c.muted }]}>
              La lista está vacía.{'\n'}Abre una receta y pulsa «Añadir ingredientes», o escribe algo arriba.
            </Text>
          </View>
        }
        ListFooterComponent={
          compra.length ? (
            <View style={{ gap: 12 }}>
              {pendientes > 0 && (
                <Pressable onPress={marcarTodoComprado} style={[styles.ghost, { borderColor: c.separator }]}>
                  <Text style={{ color: c.tint, fontSize: 15, fontWeight: '600' }}>Marcar todo como comprado</Text>
                </Pressable>
              )}
              <Text style={[styles.footer, { color: c.muted }]}>
                {pendientes} por comprar{'\n'}Desliza un ingrediente para quitarlo.
              </Text>
            </View>
          ) : null
        }
      />
    </>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 16, maxWidth: 720, width: '100%', alignSelf: 'center', paddingBottom: 40 },
  añadir: { flexDirection: 'row', alignItems: 'center', gap: 10, borderWidth: StyleSheet.hairlineWidth, borderRadius: RADIUS, paddingHorizontal: 14, marginBottom: 22 },
  inputAñadir: { flex: 1, paddingVertical: 13, fontSize: 15 },
  sectionH: { fontSize: 13, fontWeight: '600', letterSpacing: 0.6, marginBottom: 8, marginLeft: 4 },
  wrapItem: { overflow: 'hidden' },
  first: { borderTopLeftRadius: RADIUS, borderTopRightRadius: RADIUS },
  last: { borderBottomLeftRadius: RADIUS, borderBottomRightRadius: RADIUS },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 14, paddingVertical: 12 },
  tick: { width: 24, height: 24, borderRadius: 7, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
  itemTxt: { fontSize: 15.5, lineHeight: 21 },
  cant: { fontFamily: FONT.mono, fontWeight: '700' },
  itemSrc: { fontSize: 11.5 },
  tachado: { textDecorationLine: 'line-through' },
  delete: { justifyContent: 'center', alignItems: 'center', paddingHorizontal: 22 },
  deleteTxt: { color: '#FFF', fontSize: 15, fontWeight: '600' },
  ghost: { borderWidth: 1, borderRadius: 11, paddingVertical: 12, alignItems: 'center' },
  empty: { alignItems: 'center', gap: 12, paddingVertical: 50, paddingHorizontal: 30 },
  emptyTxt: { fontSize: 15, textAlign: 'center', lineHeight: 21 },
  footer: { fontSize: 12.5, textAlign: 'center', lineHeight: 18, fontFamily: FONT.mono },
});
