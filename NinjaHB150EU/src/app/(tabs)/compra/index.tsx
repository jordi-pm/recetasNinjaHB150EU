import { Stack } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { Alert, Platform, Pressable, SectionList, StyleSheet, Text, View } from 'react-native';
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';

import { Card } from '@/components/ui-kit';
import { usePalette } from '@/hooks/use-palette';
import { useApp, type ItemCompra } from '@/lib/store';
import { FONT, RADIUS } from '@/theme/colors';

export default function Compra() {
  const c = usePalette();
  const { compra, alternarItem, quitarItem, vaciarCompra, pendientes } = useApp();

  const pend = compra.filter((i) => !i.hecho);
  const hechos = compra.filter((i) => i.hecho);
  const secciones = [
    ...(pend.length ? [{ title: `Por comprar · ${pend.length}`, data: pend }] : []),
    ...(hechos.length ? [{ title: `En el carro · ${hechos.length}`, data: hechos }] : []),
  ];

  const confirmarVaciar = () =>
    Alert.alert('Vaciar la lista', '¿Seguro que quieres borrar todos los ingredientes?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Vaciar', style: 'destructive', onPress: vaciarCompra },
    ]);

  const Item = ({ item }: { item: ItemCompra }) => (
    <ReanimatedSwipeable
      friction={2}
      rightThreshold={40}
      renderRightActions={() => (
        <Pressable
          onPress={() => quitarItem(item.k)}
          style={[styles.delete, { backgroundColor: c.danger }]}
          accessibilityLabel="Quitar de la lista">
          <Text style={styles.deleteTxt}>Quitar</Text>
        </Pressable>
      )}>
      <Pressable
        onPress={() => alternarItem(item.k)}
        style={({ pressed }) => [styles.row, { backgroundColor: c.card, opacity: pressed ? 0.6 : 1 }]}>
        <View
          style={[
            styles.tick,
            item.hecho
              ? { backgroundColor: c.ok, borderColor: c.ok }
              : { borderColor: c.separator, backgroundColor: 'transparent' },
          ]}>
          {item.hecho &&
            (Platform.OS === 'ios' ? (
              <SymbolView name="checkmark" size={13} tintColor="#FFFFFF" resizeMode="scaleAspectFit" />
            ) : (
              <Text style={{ color: '#FFF', fontSize: 13 }}>✓</Text>
            ))}
        </View>
        <View style={{ flex: 1, gap: 2 }}>
          <Text
            style={[
              styles.itemTxt,
              { color: item.hecho ? c.muted : c.text },
              item.hecho && { textDecorationLine: 'line-through' },
            ]}>
            {item.t}
          </Text>
          <Text style={[styles.itemSrc, { color: c.muted }]} numberOfLines={1}>
            {item.r}
          </Text>
        </View>
      </Pressable>
    </ReanimatedSwipeable>
  );

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Compra',
          headerRight: () =>
            compra.length ? (
              <Pressable onPress={confirmarVaciar} hitSlop={10}>
                <Text style={{ color: c.danger, fontSize: 16 }}>Vaciar</Text>
              </Pressable>
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
              La lista está vacía.{'\n'}Abre una receta y pulsa «Añadir ingredientes a la lista de la compra».
            </Text>
          </View>
        }
        ListFooterComponent={
          compra.length ? (
            <Text style={[styles.footer, { color: c.muted }]}>
              {pendientes} por comprar · {hechos.length} en el carro{'\n'}Desliza un ingrediente para quitarlo.
            </Text>
          ) : null
        }
      />
    </>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 16, paddingBottom: 40 },
  sectionH: { fontSize: 13, fontWeight: '600', letterSpacing: 0.6, marginBottom: 8, marginLeft: 4 },
  wrapItem: { overflow: 'hidden' },
  first: { borderTopLeftRadius: RADIUS, borderTopRightRadius: RADIUS },
  last: { borderBottomLeftRadius: RADIUS, borderBottomRightRadius: RADIUS },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 14, paddingVertical: 12 },
  tick: { width: 24, height: 24, borderRadius: 7, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
  itemTxt: { fontSize: 15.5, lineHeight: 20 },
  itemSrc: { fontSize: 11.5, fontFamily: FONT.mono },
  delete: { justifyContent: 'center', alignItems: 'center', paddingHorizontal: 22 },
  deleteTxt: { color: '#FFF', fontSize: 15, fontWeight: '600' },
  empty: { alignItems: 'center', gap: 12, paddingVertical: 60, paddingHorizontal: 30 },
  emptyTxt: { fontSize: 15, textAlign: 'center', lineHeight: 21 },
  footer: { fontSize: 12.5, textAlign: 'center', marginTop: 4, lineHeight: 18, fontFamily: FONT.mono },
});
