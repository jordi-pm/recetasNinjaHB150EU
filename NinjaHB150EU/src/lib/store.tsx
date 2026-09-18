import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import type { Pasillo, Receta } from '@/data/tipos';
import { cantidad, norm, pasilloDe } from './format';

/* ------------------------------- tipos -------------------------------- */

export type Cantidad = { c: number; u: string };

export type ItemCompra = {
  /** Clave estable: el nombre normalizado del ingrediente. */
  k: string;
  nombre: string;
  /** Cantidades sumadas por unidad. Vacío = «al gusto» o añadido a mano. */
  cants: Cantidad[];
  /** Nombres de las recetas de las que viene. */
  de: string[];
  pasillo: Pasillo;
  hecho: boolean;
  manual?: boolean;
};

export type Cocinada = {
  id: string;        // id de receta
  fecha: number;     // epoch ms
  escala: number;
  /** Qué tal cupo en la jarra: lo que de verdad pasó, no una estimación. */
  cupo?: 'sobrada' | 'justa' | 'se-paso';
  nota?: string;
  estrellas?: number; // 1..5
};

type Estado = {
  fav: string[];
  compra: ItemCompra[];
  notas: Record<string, string>;
  historial: Cocinada[];
  propias: Receta[];
  sonido: boolean;
};

type Ctx = Estado & {
  listo: boolean;
  esFav: (id: string) => boolean;
  alternarFav: (id: string) => void;
  añadirReceta: (r: Receta, k: number) => number;
  añadirManual: (texto: string) => void;
  yaEnLista: (r: Receta) => boolean;
  alternarItem: (k: string) => void;
  quitarItem: (k: string) => void;
  vaciarCompra: () => void;
  marcarTodoComprado: () => void;
  setNota: (id: string, nota: string) => void;
  registrarCocinada: (c: Cocinada) => void;
  actualizarCocinada: (fecha: number, parche: Partial<Cocinada>) => void;
  guardarPropia: (r: Receta) => void;
  borrarPropia: (id: string) => void;
  setSonido: (v: boolean) => void;
  restablecer: () => void;
  pendientes: number;
  vecesCocinada: (id: string) => number;
};

const CLAVE = 'sopera/estado/v1';
const AppCtx = createContext<Ctx | null>(null);

/* ------------------------------ provider ------------------------------- */

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [fav, setFav] = useState<string[]>([]);
  const [compra, setCompra] = useState<ItemCompra[]>([]);
  const [notas, setNotas] = useState<Record<string, string>>({});
  const [historial, setHistorial] = useState<Cocinada[]>([]);
  const [propias, setPropias] = useState<Receta[]>([]);
  const [sonido, setSonidoState] = useState(true);
  const [listo, setListo] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(CLAVE)
      .then((raw) => {
        if (!raw) return;
        const o = JSON.parse(raw);
        if (Array.isArray(o.fav)) setFav(o.fav);
        if (Array.isArray(o.compra)) setCompra(o.compra);
        if (o.notas && typeof o.notas === 'object') setNotas(o.notas);
        if (Array.isArray(o.historial)) setHistorial(o.historial);
        if (Array.isArray(o.propias)) setPropias(o.propias);
        if (typeof o.sonido === 'boolean') setSonidoState(o.sonido);
      })
      .catch(() => {})
      .finally(() => setListo(true));
  }, []);

  useEffect(() => {
    if (!listo) return;
    AsyncStorage.setItem(
      CLAVE,
      JSON.stringify({ fav, compra, notas, historial, propias, sonido })
    ).catch(() => {});
  }, [fav, compra, notas, historial, propias, sonido, listo]);

  /* ------------------------------ favoritos ---------------------------- */

  const esFav = useCallback((id: string) => fav.includes(id), [fav]);

  const alternarFav = useCallback((id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    setFav((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [id, ...prev]));
  }, []);

  /* --------------------------- lista de la compra ---------------------- */

  const añadirReceta = useCallback((r: Receta, k: number) => {
    let nuevos = 0;
    setCompra((prev) => {
      const next = [...prev];
      r.ing.forEach((ing) => {
        const key = norm(ing.n);
        const q = cantidad(ing, k);
        const idx = next.findIndex((i) => i.k === key);

        if (idx === -1) {
          next.push({
            k: key,
            nombre: ing.n,
            cants: q.libre ? [] : [{ c: ing.c! * k, u: ing.u }],
            de: [r.nombre],
            pasillo: pasilloDe(ing.n),
            hecho: false,
          });
          nuevos++;
          return;
        }
        // ya está: sumamos cantidad y anotamos la receta
        const it = next[idx];
        const cants = [...it.cants];
        if (!q.libre) {
          const j = cants.findIndex((c) => c.u === ing.u);
          if (j === -1) cants.push({ c: ing.c! * k, u: ing.u });
          else cants[j] = { ...cants[j], c: cants[j].c + ing.c! * k };
        }
        next[idx] = {
          ...it,
          cants,
          de: it.de.includes(r.nombre) ? it.de : [...it.de, r.nombre],
          hecho: false,
        };
      });
      return next;
    });
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    return nuevos;
  }, []);

  const yaEnLista = useCallback(
    (r: Receta) => r.ing.every((ing) => compra.some((i) => i.k === norm(ing.n))),
    [compra]
  );

  const añadirManual = useCallback((texto: string) => {
    const t = texto.trim();
    if (!t) return;
    const key = norm(t);
    setCompra((prev) =>
      prev.some((i) => i.k === key)
        ? prev
        : [...prev, { k: key, nombre: t, cants: [], de: [], pasillo: pasilloDe(t), hecho: false, manual: true }]
    );
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
  }, []);

  const alternarItem = useCallback((k: string) => {
    Haptics.selectionAsync().catch(() => {});
    setCompra((prev) => prev.map((i) => (i.k === k ? { ...i, hecho: !i.hecho } : i)));
  }, []);

  const quitarItem = useCallback(
    (k: string) => setCompra((prev) => prev.filter((i) => i.k !== k)),
    []
  );

  const vaciarCompra = useCallback(() => setCompra([]), []);
  const marcarTodoComprado = useCallback(
    () => setCompra((prev) => prev.map((i) => ({ ...i, hecho: true }))),
    []
  );

  /* ------------------------------ notas -------------------------------- */

  const setNota = useCallback((id: string, nota: string) => {
    setNotas((prev) => {
      const next = { ...prev };
      if (nota.trim()) next[id] = nota;
      else delete next[id];
      return next;
    });
  }, []);

  /* ----------------------------- historial ----------------------------- */

  const registrarCocinada = useCallback((c: Cocinada) => {
    setHistorial((prev) => [c, ...prev].slice(0, 500));
  }, []);

  const actualizarCocinada = useCallback((fecha: number, parche: Partial<Cocinada>) => {
    setHistorial((prev) => prev.map((h) => (h.fecha === fecha ? { ...h, ...parche } : h)));
  }, []);

  const vecesCocinada = useCallback(
    (id: string) => historial.filter((h) => h.id === id).length,
    [historial]
  );

  /* ---------------------------- recetas propias ------------------------ */

  const guardarPropia = useCallback((r: Receta) => {
    setPropias((prev) => {
      const i = prev.findIndex((x) => x.id === r.id);
      if (i === -1) return [...prev, r];
      const next = [...prev];
      next[i] = r;
      return next;
    });
  }, []);

  const borrarPropia = useCallback((id: string) => {
    setPropias((prev) => prev.filter((r) => r.id !== id));
    setFav((prev) => prev.filter((f) => f !== id));
  }, []);

  const setSonido = useCallback((v: boolean) => setSonidoState(v), []);

  const restablecer = useCallback(() => {
    setFav([]);
    setCompra([]);
    setNotas({});
    setHistorial([]);
  }, []);

  const pendientes = useMemo(() => compra.filter((i) => !i.hecho).length, [compra]);

  const value = useMemo(
    () => ({
      fav, compra, notas, historial, propias, sonido, listo,
      esFav, alternarFav, añadirReceta, añadirManual, yaEnLista,
      alternarItem, quitarItem, vaciarCompra, marcarTodoComprado,
      setNota, registrarCocinada, actualizarCocinada, vecesCocinada,
      guardarPropia, borrarPropia, setSonido, restablecer, pendientes,
    }),
    [
      fav, compra, notas, historial, propias, sonido, listo,
      esFav, alternarFav, añadirReceta, añadirManual, yaEnLista,
      alternarItem, quitarItem, vaciarCompra, marcarTodoComprado,
      setNota, registrarCocinada, actualizarCocinada, vecesCocinada,
      guardarPropia, borrarPropia, setSonido, restablecer, pendientes,
    ]
  );

  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}

export function useApp() {
  const c = useContext(AppCtx);
  if (!c) throw new Error('useApp debe usarse dentro de <AppProvider>');
  return c;
}

/** Todas las recetas: las oficiales más las tuyas. */
export function useRecetas(): Receta[] {
  const { propias } = useApp();
  const { RECETAS } = require('@/data/recetas') as { RECETAS: Receta[] };
  return useMemo(() => [...RECETAS, ...propias], [propias]);
}
