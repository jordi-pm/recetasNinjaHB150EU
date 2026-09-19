import type { Receta } from '@/data/tipos';
import { cargaMl } from './volumen';

/* Cuando quieres más raciones de las que caben, la respuesta útil no es «no
   puedes», es «hazlo en dos tandas y así». Esto calcula el plan. */

export type Plan = {
  raciones: number;
  tandas: number;
  /** Multiplicador de la receta en cada tanda. */
  escalaPorTanda: number;
  cargaPorTanda: number;
  limiteMl: number;
  /** Cabe en una sola tanda: no hace falta plan. */
  deUnaVez: boolean;
  /** Ni troceándolo cabe: la receta base ya se pasa. */
  imposible: boolean;
};

export function planificar(r: Receta, racionesQuiero: number, limite: number = r.limiteMl): Plan {
  const limiteMl = limite;
  const base = cargaMl(r, 1);
  const escalaPedida = Math.max(1, racionesQuiero / r.racionesNum);

  if (base > limiteMl) {
    return {
      raciones: racionesQuiero, tandas: 1, escalaPorTanda: 1,
      cargaPorTanda: base, limiteMl, deUnaVez: false, imposible: true,
    };
  }

  // El mayor múltiplo entero que sigue cabiendo
  let porTanda = 1;
  while (cargaMl(r, porTanda + 1) <= limiteMl && porTanda < 6) porTanda++;

  const tandas = Math.max(1, Math.ceil(escalaPedida / porTanda));
  const escalaReal = Math.min(porTanda, Math.ceil(escalaPedida / tandas));

  return {
    raciones: racionesQuiero,
    tandas,
    escalaPorTanda: escalaReal,
    cargaPorTanda: cargaMl(r, escalaReal),
    limiteMl,
    deUnaVez: tandas === 1,
    imposible: false,
  };
}

/** Raciones que puedes pedir sin que el plan se vuelva absurdo. */
export function opcionesDeRaciones(r: Receta): number[] {
  const base = r.racionesNum;
  return [base, base * 2, base * 3, base * 4].filter((n, i, a) => a.indexOf(n) === i);
}
