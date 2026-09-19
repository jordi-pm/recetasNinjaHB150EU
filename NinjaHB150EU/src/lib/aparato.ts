/* La jarra del usuario. Hasta ahora 1,4 / 1,6 L estaban fijos en el código;
   ahora son un ajuste, porque no todas las soperas tienen la misma jarra. */

export type Aparato = {
  /** Línea de llenado en modos con calor, en ml. */
  calienteMl: number;
  /** Línea de llenado en frío, en ml. */
  frioMl: number;
  /** Capacidad total de la jarra, para dibujar el indicador. */
  totalMl: number;
};

export const APARATO_POR_DEFECTO: Aparato = {
  calienteMl: 1400,
  frioMl: 1600,
  totalMl: 1700,
};

/** Presets habituales de batidoras soperas. */
export const PRESETS: { id: string; nombre: string; ap: Aparato }[] = [
  { id: '1.7', nombre: 'Jarra de 1,7 L', ap: { calienteMl: 1400, frioMl: 1600, totalMl: 1700 } },
  { id: '1.4', nombre: 'Jarra de 1,4 L', ap: { calienteMl: 1200, frioMl: 1300, totalMl: 1400 } },
  { id: '2.1', nombre: 'Jarra de 2,1 L', ap: { calienteMl: 1750, frioMl: 2000, totalMl: 2100 } },
];

export function limiteDe(ap: Aparato, conCalor: boolean): number {
  return conCalor ? ap.calienteMl : ap.frioMl;
}

/** Valida y encaja los valores para que no se pueda guardar un disparate. */
export function sanear(ap: Partial<Aparato>): Aparato {
  const total = Math.min(4000, Math.max(500, Math.round(ap.totalMl ?? APARATO_POR_DEFECTO.totalMl)));
  const frio = Math.min(total, Math.max(300, Math.round(ap.frioMl ?? Math.round(total * 0.94))));
  const caliente = Math.min(frio, Math.max(300, Math.round(ap.calienteMl ?? Math.round(total * 0.82))));
  return { totalMl: total, frioMl: frio, calienteMl: caliente };
}
