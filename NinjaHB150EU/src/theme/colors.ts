import { Platform } from 'react-native';

/** Paleta tomada del propio aparato: grafito del panel de control,
 *  ámbar del piloto HEAT ON y turquesa para los programas en frío. */
const shared = {
  hot: '#D2691E',
  cold: '#0E7490',
  danger: '#C0392B',
  ok: '#2E7D57',
};

export const light = {
  ...shared,
  bg: '#F2F2F7',
  card: '#FFFFFF',
  cardAlt: '#F7F8FA',
  panel: '#15181D',
  panelBorder: '#30363F',
  hero: '#15181D',
  text: '#11151A',
  textSoft: '#3C4550',
  muted: '#6B7683',
  separator: '#DCE0E6',
  tint: '#0E7490',
  hotSoft: '#FDF0E6',
  coldSoft: '#E4F2F6',
  dangerSoft: '#FBE9E7',
};

export const dark = {
  ...shared,
  hot: '#F0913F',
  cold: '#5CC2D6',
  danger: '#FF7A6B',
  ok: '#6FC296',
  bg: '#000000',
  card: '#1C1C1E',
  cardAlt: '#2C2C2E',
  panel: '#0A0C10',
  panelBorder: '#3A3F48',
  hero: '#16191F',
  text: '#F2F3F5',
  textSoft: '#C9D0D8',
  muted: '#8E939B',
  separator: '#2F3136',
  tint: '#5CC2D6',
  hotSoft: '#2E1B0E',
  coldSoft: '#0D2930',
  dangerSoft: '#33150F',
};

export type Palette = typeof light;

/** Tipografía del sistema (SF Pro) + monoespaciada para los botones del panel */
export const FONT = {
  mono: Platform.select({ ios: 'Menlo', default: 'monospace' }) as string,
};

export const RADIUS = 14;
