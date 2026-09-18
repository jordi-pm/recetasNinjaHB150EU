import { createAudioPlayer, setAudioModeAsync, type AudioPlayer } from 'expo-audio';

/* Aviso sonoro propio: tres pitidos cortos, como el aviso de removido del
   aparato, para cuando tienes el móvil lejos y la app abierta. Las
   notificaciones del sistema llevan su propio sonido aparte. */

let reproductor: AudioPlayer | null = null;
let preparado = false;

async function preparar() {
  if (preparado) return;
  preparado = true;
  try {
    // suena aunque el móvil esté en silencio: cocinando es lo que quieres
    await setAudioModeAsync({ playsInSilentMode: true, interruptionMode: 'mixWithOthers' });
    reproductor = createAudioPlayer(require('@/assets/sonidos/aviso.wav'));
  } catch {
    reproductor = null;
  }
}

/** Suena el aviso. No hace nada si el usuario lo tiene apagado. */
export async function sonarAviso(activo: boolean) {
  if (!activo) return;
  try {
    await preparar();
    if (!reproductor) return;
    reproductor.seekTo(0);
    reproductor.play();
  } catch {
    // el sonido es un extra: nunca debe romper el temporizador
  }
}
