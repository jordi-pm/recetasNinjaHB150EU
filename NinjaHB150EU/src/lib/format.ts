import { MAQUINA, RECETAS, CATEGORIAS } from '@/data/recetas';
import type { Ingrediente, Receta, Categoria, PasoCocina } from '@/data/tipos';

const FRACS: Record<string, string> = {
  '0.125': '⅛', '0.25': '¼', '0.333': '⅓', '0.5': '½', '0.666': '⅔', '0.75': '¾',
};

export function fmt(n: number): string {
  const r = Math.round(n * 1000) / 1000;
  const ent = Math.floor(r);
  const frac = Math.round((r - ent) * 1000) / 1000;
  const f = FRACS[String(frac)];
  if (f) return ent ? `${ent}${f}` : f;
  if (Math.abs(r - Math.round(r)) < 0.001) return String(Math.round(r));
  return String(r).replace('.', ',');
}

export function cantidad(ing: Ingrediente, k: number) {
  if (ing.c === null) return { txt: 'al gusto', libre: true };
  return { txt: fmt(ing.c * k) + (ing.u ? ` ${ing.u}` : ''), libre: false };
}

export function lineaIng(ing: Ingrediente, k: number) {
  const q = cantidad(ing, k);
  return q.libre ? ing.n : `${q.txt} de ${ing.n}`;
}

export const norm = (s: string) =>
  (s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

export const tiempoTotal = (r: Receta) => (r.prep || 0) + (r.coccion || 0);

export const reposoTxt = (r: Receta) =>
  !r.reposo ? null : r.reposo >= 60 ? `${r.reposo / 60} h` : `${r.reposo} min`;

/** Máximo múltiplo que sigue cabiendo bajo la línea de llenado que aplica. */
export const maxEscala = (r: Receta) => Math.max(1, Math.floor(r.limiteMl / r.cargaMl));

export const esCaliente = (r: Receta) => r.limiteMl === MAQUINA.capacidad.calienteMl;

export const lineaNombre = (r: Receta) => (esCaliente(r) ? 'HOT (1,4 L)' : 'COLD (1,6 L)');

/** ¿El botón enciende el piloto HEAT ON? */
export function botonUsaCalor(b: string): boolean {
  const p = MAQUINA.programas.find((x: any) => x.b === b);
  if (p) return !!p.calor;
  return b === 'COOK';
}

export function programasDe(r: Receta): string[] {
  const out: string[] = [];
  r.pasos.forEach((p) => {
    if (p.b && !out.includes(p.b)) out.push(p.b);
  });
  return out;
}

export const recetaPorId = (id: string): Receta | undefined =>
  (RECETAS as Receta[]).find((r) => r.id === id);

export const categoriaPorId = (id: string): Categoria | undefined =>
  (CATEGORIAS as Categoria[]).find((c) => c.id === id);

export function ingredientesPrincipales(): string[] {
  const set = new Set<string>();
  (RECETAS as Receta[]).forEach((r) => set.add(r.principal));
  return Array.from(set).sort();
}

export type Filtros = {
  cat?: string;
  tiempo?: number;
  principal?: string;
  dieta?: string;
  temp?: string;
  textura?: string;
};

export function filtrar(q: string, f: Filtros): Receta[] {
  const base = (RECETAS as Receta[]).filter((r) => {
    if (f.cat && r.cat !== f.cat) return false;
    if (f.tiempo && tiempoTotal(r) > f.tiempo) return false;
    if (f.principal && r.principal !== f.principal) return false;
    if (f.dieta && !r.tags.includes(f.dieta)) return false;
    if (f.temp && !r.tags.includes(f.temp)) return false;
    if (f.textura && !r.tags.includes(f.textura)) return false;
    return true;
  });
  const n = norm(q).trim();
  if (!n) return base;
  const terms = n.split(/\s+/);
  return base.filter((r) => {
    const hay = norm(
      [r.nombre, r.original, r.principal, r.programa, r.cat, r.tags.join(' '),
       r.ing.map((i) => i.n).join(' ')].join(' ')
    );
    return terms.every((t) => hay.includes(t));
  });
}

/** Expande los pasos a un paso por acción, para el modo guiado. */
export function pasosCocina(r: Receta, k: number): PasoCocina[] {
  const out: PasoCocina[] = [];
  r.pasos.forEach((p) => {
    if (p.add && p.add.length) {
      p.add.forEach((i, idx) => {
        const ing = r.ing[i];
        const q = cantidad(ing, k);
        out.push({
          cap: idx === 0 ? p.t || 'Carga la jarra' : null,
          txt: q.libre
            ? ing.n.charAt(0).toUpperCase() + ing.n.slice(1)
            : `Añade ${q.txt} de ${ing.n}`,
        });
      });
      if (p.b) out.push({ txt: p.t || '', b: p.b, sub: p.sub });
    } else {
      out.push({ txt: p.t || '', b: p.b, sub: p.sub });
    }
  });
  return out.filter((s) => s.txt || s.b);
}

/** Avisos de seguridad del manual que aplican a esta receta concreta. */
export function seguridadDe(r: Receta): [string, string][] {
  const av: [string, string][] = [];
  if (esCaliente(r) || r.tags.includes('caliente')) {
    av.push(['Llenado en caliente', 'En los modos COOK NO superes la línea marcada HOT (1,4 L) de la jarra.']);
    av.push(['Jarra caliente', 'NO agarres la jarra por los laterales ni por debajo después de cocinar. Usa manoplas y el asa.']);
    av.push(['Vapor', 'Al retirar la tapa tras un programa con calor puede salir vapor. Manos en las pestañas exteriores y levanta en vertical.']);
    av.push(['Líquido caliente', 'Cuidado al verter líquido caliente en la batidora: puede salir proyectado por un chorro repentino.']);
  } else {
    av.push(['Llenado en frío', 'En modo BLEND NO superes la línea marcada COLD (1,6 L) de la jarra.']);
  }
  av.push(['Tapa', 'NUNCA la hagas funcionar sin la tapa y el tapón central. El aviso de removido son 3 pitidos y 2 s de pausa: asegúrate de que el tapón esté puesto.']);
  if (r.pasos.some((p) => /tamper/i.test(p.t || ''))) {
    av.push(['Tamper', 'Úsalo solo con la tapa puesta: retira el tapón central y sustitúyelo por el tamper. Nunca metas las manos en la jarra.']);
  }
  av.push(['Después', 'Lava la jarra a mano con el cepillo incluido. NO la sumerjas ni la metas en el lavavajillas: dañarías el elemento calefactor.']);
  return av;
}
