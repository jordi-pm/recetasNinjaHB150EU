import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import type { Receta } from '@/data/tipos';
import { lineaIng } from './format';

export type ItemCompra = { k: string; t: string; r: string; hecho: boolean };

type Estado = { fav: string[]; compra: ItemCompra[] };

type Ctx = Estado & {
  listo: boolean;
  esFav: (id: string) => boolean;
  alternarFav: (id: string) => void;
  añadirReceta: (r: Receta, k: number) => number;
  alternarItem: (k: string) => void;
  quitarItem: (k: string) => void;
  vaciarCompra: () => void;
  restablecer: () => void;
  pendientes: number;
};

const CLAVE = 'ninja-hb150eu/estado/v1';
const AppCtx = createContext<Ctx | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [fav, setFav] = useState<string[]>([]);
  const [compra, setCompra] = useState<ItemCompra[]>([]);
  const [listo, setListo] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(CLAVE)
      .then((raw) => {
        if (raw) {
          const o = JSON.parse(raw);
          if (Array.isArray(o.fav)) setFav(o.fav);
          if (Array.isArray(o.compra)) setCompra(o.compra);
        }
      })
      .catch(() => {})
      .finally(() => setListo(true));
  }, []);

  useEffect(() => {
    if (!listo) return;
    AsyncStorage.setItem(CLAVE, JSON.stringify({ fav, compra })).catch(() => {});
  }, [fav, compra, listo]);

  const esFav = useCallback((id: string) => fav.includes(id), [fav]);

  const alternarFav = useCallback((id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    setFav((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [id, ...prev]));
  }, []);

  const añadirReceta = useCallback((r: Receta, k: number) => {
    let añadidos = 0;
    setCompra((prev) => {
      const next = [...prev];
      r.ing.forEach((ing) => {
        const t = lineaIng(ing, k);
        const key = `${r.id}|${t}`;
        if (next.some((i) => i.k === key)) return;
        next.push({ k: key, t, r: r.nombre + (k > 1 ? ` (${k}×)` : ''), hecho: false });
        añadidos++;
      });
      return next;
    });
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    return r.ing.length;
  }, []);

  const alternarItem = useCallback((k: string) => {
    Haptics.selectionAsync().catch(() => {});
    setCompra((prev) => prev.map((i) => (i.k === k ? { ...i, hecho: !i.hecho } : i)));
  }, []);

  const quitarItem = useCallback((k: string) => {
    setCompra((prev) => prev.filter((i) => i.k !== k));
  }, []);

  const vaciarCompra = useCallback(() => setCompra([]), []);

  const restablecer = useCallback(() => {
    setFav([]);
    setCompra([]);
  }, []);

  const pendientes = useMemo(() => compra.filter((i) => !i.hecho).length, [compra]);

  const value = useMemo(
    () => ({ fav, compra, listo, esFav, alternarFav, añadirReceta, alternarItem, quitarItem, vaciarCompra, restablecer, pendientes }),
    [fav, compra, listo, esFav, alternarFav, añadirReceta, alternarItem, quitarItem, vaciarCompra, restablecer, pendientes]
  );

  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}

export function useApp() {
  const c = useContext(AppCtx);
  if (!c) throw new Error('useApp debe usarse dentro de <AppProvider>');
  return c;
}
