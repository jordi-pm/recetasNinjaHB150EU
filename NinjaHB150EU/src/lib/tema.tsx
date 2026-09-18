import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Appearance, useColorScheme } from 'react-native';

export type PrefTema = 'sistema' | 'claro' | 'oscuro';

const CLAVE = 'ninja-hb150eu/tema/v1';

type Ctx = {
  pref: PrefTema;
  setPref: (p: PrefTema) => void;
  /** El esquema que se está pintando ahora mismo. */
  esquema: 'light' | 'dark';
};

const TemaCtx = createContext<Ctx | null>(null);

function aplicar(p: PrefTema) {
  // Sobrescribe la apariencia de toda la app, barras nativas incluidas
  // (UINavigationBar y UITabBar leen el trait collection, no el estado de JS).
  Appearance.setColorScheme(p === 'sistema' ? 'unspecified' : p === 'oscuro' ? 'dark' : 'light');
}

export function TemaProvider({ children }: { children: React.ReactNode }) {
  const [pref, setPrefState] = useState<PrefTema>('sistema');
  const esquema: 'light' | 'dark' = useColorScheme() === 'dark' ? 'dark' : 'light';

  useEffect(() => {
    AsyncStorage.getItem(CLAVE)
      .then((v) => {
        if (v === 'claro' || v === 'oscuro' || v === 'sistema') {
          setPrefState(v);
          aplicar(v);
        }
      })
      .catch(() => {});
  }, []);

  const setPref = useCallback((p: PrefTema) => {
    setPrefState(p);
    aplicar(p);
    AsyncStorage.setItem(CLAVE, p).catch(() => {});
  }, []);

  const value = useMemo(() => ({ pref, setPref, esquema }), [pref, setPref, esquema]);
  return <TemaCtx.Provider value={value}>{children}</TemaCtx.Provider>;
}

export function useTema() {
  const c = useContext(TemaCtx);
  if (!c) throw new Error('useTema debe usarse dentro de <TemaProvider>');
  return c;
}
