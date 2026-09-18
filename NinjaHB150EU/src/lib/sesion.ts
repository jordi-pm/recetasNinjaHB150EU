import AsyncStorage from '@react-native-async-storage/async-storage';

const CLAVE = 'ninja-hb150eu/sesion/v1';
const CADUCA_MS = 6 * 60 * 60 * 1000; // 6 h

export type Sesion = { id: string; paso: number; escala: number; ts: number };

export async function guardarSesion(s: Omit<Sesion, 'ts'>) {
  try {
    await AsyncStorage.setItem(CLAVE, JSON.stringify({ ...s, ts: Date.now() }));
  } catch {}
}

export async function leerSesion(): Promise<Sesion | null> {
  try {
    const raw = await AsyncStorage.getItem(CLAVE);
    if (!raw) return null;
    const s = JSON.parse(raw) as Sesion;
    if (Date.now() - s.ts > CADUCA_MS) return null;
    if (s.paso <= 0) return null;
    return s;
  } catch {
    return null;
  }
}

export async function borrarSesion() {
  try {
    await AsyncStorage.removeItem(CLAVE);
  } catch {}
}
