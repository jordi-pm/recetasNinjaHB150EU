import * as Haptics from 'expo-haptics';
import * as Notifications from 'expo-notifications';
import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';

import { sonarAviso } from './sonido';

/* ---------------------------------------------------------------------------
   Temporizador para el modo cocina.

   Cuenta en tiempo real (no por ticks acumulados), así que sigue siendo exacto
   aunque la app pase a segundo plano. Al arrancar programa además una
   notificación local, para enterarte con el móvil bloqueado.
--------------------------------------------------------------------------- */

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

let permisoPedido = false;

export async function pedirPermisoAvisos(): Promise<boolean> {
  try {
    const actual = await Notifications.getPermissionsAsync();
    if (actual.granted) return true;
    if (permisoPedido && !actual.canAskAgain) return false;
    permisoPedido = true;
    const pedido = await Notifications.requestPermissionsAsync();
    return pedido.granted;
  } catch {
    return false;
  }
}

export type EstadoTemporizador = {
  /** Segundos restantes; null = no hay temporizador activo. */
  restante: number | null;
  total: number | null;
  corriendo: boolean;
  terminado: boolean;
  arrancar: (segundos: number, titulo: string, cuerpo: string) => void;
  pausar: () => void;
  reanudar: () => void;
  parar: () => void;
};

export function useTemporizador(conSonido = true): EstadoTemporizador {
  const [total, setTotal] = useState<number | null>(null);
  const [restante, setRestante] = useState<number | null>(null);
  const [corriendo, setCorriendo] = useState(false);
  const [terminado, setTerminado] = useState(false);

  const sonidoRef = useRef(conSonido);
  sonidoRef.current = conSonido;

  const finRef = useRef<number | null>(null);      // epoch ms en que acaba
  const pausaRef = useRef<number | null>(null);    // segundos congelados
  const notifRef = useRef<string | null>(null);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const limpiarNotif = useCallback(() => {
    if (notifRef.current) {
      Notifications.cancelScheduledNotificationAsync(notifRef.current).catch(() => {});
      notifRef.current = null;
    }
  }, []);

  const parar = useCallback(() => {
    if (tickRef.current) clearInterval(tickRef.current);
    tickRef.current = null;
    finRef.current = null;
    pausaRef.current = null;
    limpiarNotif();
    setCorriendo(false);
    setRestante(null);
    setTotal(null);
    setTerminado(false);
  }, [limpiarNotif]);

  const sincronizar = useCallback(() => {
    if (finRef.current === null) return;
    const seg = Math.max(0, Math.round((finRef.current - Date.now()) / 1000));
    setRestante(seg);
    if (seg === 0) {
      setCorriendo(false);
      setTerminado(true);
      if (tickRef.current) clearInterval(tickRef.current);
      tickRef.current = null;
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      sonarAviso(sonidoRef.current);
    }
  }, []);

  const arrancar = useCallback(
    (segundos: number, titulo: string, cuerpo: string) => {
      if (tickRef.current) clearInterval(tickRef.current);
      limpiarNotif();
      setTotal(segundos);
      setRestante(segundos);
      setTerminado(false);
      setCorriendo(true);
      finRef.current = Date.now() + segundos * 1000;
      pausaRef.current = null;

      tickRef.current = setInterval(sincronizar, 500);

      pedirPermisoAvisos().then((ok) => {
        if (!ok || finRef.current === null) return;
        Notifications.scheduleNotificationAsync({
          content: { title: titulo, body: cuerpo, sound: conSonido },
          trigger: {
            type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
            seconds: Math.max(1, segundos),
          },
        })
          .then((id) => {
            notifRef.current = id;
          })
          .catch(() => {});
      });
    },
    [conSonido, limpiarNotif, sincronizar]
  );

  const pausar = useCallback(() => {
    if (finRef.current === null) return;
    pausaRef.current = Math.max(0, Math.round((finRef.current - Date.now()) / 1000));
    finRef.current = null;
    if (tickRef.current) clearInterval(tickRef.current);
    tickRef.current = null;
    limpiarNotif();
    setCorriendo(false);
  }, [limpiarNotif]);

  const reanudar = useCallback(() => {
    if (pausaRef.current === null) return;
    const seg = pausaRef.current;
    pausaRef.current = null;
    arrancar(seg, 'Temporizador', 'Se acabó el tiempo.');
  }, [arrancar]);

  // Al volver del segundo plano, recalcular contra el reloj real.
  useEffect(() => {
    const sub = AppState.addEventListener('change', (s) => {
      if (s === 'active') sincronizar();
    });
    return () => sub.remove();
  }, [sincronizar]);

  useEffect(() => () => {
    if (tickRef.current) clearInterval(tickRef.current);
    limpiarNotif();
  }, [limpiarNotif]);

  return { restante, total, corriendo, terminado, arrancar, pausar, reanudar, parar };
}

export function mmss(seg: number): string {
  const m = Math.floor(seg / 60);
  const s = seg % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}
