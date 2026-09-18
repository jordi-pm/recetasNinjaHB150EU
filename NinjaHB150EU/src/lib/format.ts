import { CATEGORIAS, MAQUINA, RECETAS } from '@/data/recetas';
import type {
  Alergeno, BotonPanel, Categoria, Ingrediente, Pasillo, PasoCocina, Receta,
} from '@/data/tipos';

export { aporte, cargaMl, desglose, maxEscala, aprietaA1x } from './volumen';
import { cargaMl, maxEscala } from './volumen';

/* ----------------------------- cantidades ------------------------------ */

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

/** Equivalencia aproximada para quien pesa en vez de usar cucharas. */
const G_POR_CDA: [RegExp, number][] = [
  [/aceite/, 14], [/mantequilla/, 14], [/nata|leche|zumo|agua|sirope/, 15],
  [/azucar glas/, 8], [/azucar/, 12], [/cacao/, 6], [/crema de cacahuete/, 16],
  [/parmesano|queso rallado/, 6], [/concentrado de tomate/, 16], [/pectina/, 10],
  [/ajo picado/, 9], [/sazonador|tomillo|romero|albahaca|perejil|cilantro|comino|especia/, 3],
];

export function equivalencia(ing: Ingrediente, k: number): string | null {
  if (ing.c === null) return null;
  if (ing.u !== 'cda' && ing.u !== 'cdta') return null;
  const n = norm(ing.n);
  const porCda = G_POR_CDA.find(([re]) => re.test(n))?.[1];
  if (!porCda) return null;
  const factor = ing.u === 'cda' ? 1 : 1 / 3;
  const g = ing.c * k * porCda * factor;
  return `≈ ${fmt(Math.round(g))} g`;
}

/* ------------------------------ búsqueda ------------------------------- */

export const norm = (s: string) =>
  (s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

/** Distancia de edición acotada: barata y suficiente para erratas de cocina. */
function cerca(a: string, b: string, max = 1): boolean {
  if (Math.abs(a.length - b.length) > max) return false;
  let i = 0, j = 0, fallos = 0;
  while (i < a.length && j < b.length) {
    if (a[i] === b[j]) { i++; j++; continue; }
    if (++fallos > max) return false;
    if (a.length > b.length) i++;
    else if (a.length < b.length) j++;
    else { i++; j++; }
  }
  return fallos + (a.length - i) + (b.length - j) <= max;
}

/** ¿Aparece el término en el texto, admitiendo una errata? */
function contiene(texto: string, termino: string): boolean {
  if (texto.includes(termino)) return true;
  if (termino.length < 5) return false; // en palabras cortas, una errata es otra palabra
  return texto.split(/[^a-z0-9]+/).some((p) => p.length >= 4 && cerca(p, termino, 1));
}

export type Filtros = {
  cat?: string;
  tiempo?: number;
  principal?: string;
  dieta?: string;
  temp?: string;
  textura?: string;
  sinAlergeno?: Alergeno;
  /** Solo recetas que pueda hacer con estos ingredientes en casa. */
  tengo?: string[];
  orden?: 'nombre' | 'tiempo' | 'dificultad';
};

export function nFiltros(f: Filtros): number {
  return (['cat', 'tiempo', 'principal', 'dieta', 'temp', 'textura', 'sinAlergeno'] as const)
    .filter((k) => f[k] !== undefined).length + (f.tengo?.length ? 1 : 0);
}

function textoDe(r: Receta): string {
  return norm([
    r.nombre, r.principal, r.programa, r.cat, r.tags.join(" "),
    r.ing.map((i) => i.n).join(' '),
  ].join(' '));
}

export function filtrar(q: string, f: Filtros, recetas: Receta[] = RECETAS): Receta[] {
  let base = recetas.filter((r) => {
    if (f.cat && r.cat !== f.cat) return false;
    if (f.tiempo && tiempoTotal(r) > f.tiempo) return false;
    if (f.principal && r.principal !== f.principal) return false;
    if (f.dieta && !r.tags.includes(f.dieta as any)) return false;
    if (f.temp && !r.tags.includes(f.temp as any)) return false;
    if (f.textura && !r.tags.includes(f.textura as any)) return false;
    if (f.sinAlergeno && alergenosDe(r).includes(f.sinAlergeno)) return false;
    return true;
  });

  if (f.tengo?.length) {
    const tengo = f.tengo.map(norm);
    base = base.filter((r) => {
      const principales = r.ing.filter((i) => i.c !== null && !i.fuera);
      const cubiertos = principales.filter((i) =>
        tengo.some((t) => norm(i.n).includes(t))
      ).length;
      return principales.length > 0 && cubiertos / principales.length >= 0.6;
    });
  }

  const n = norm(q).trim();
  if (n) {
    const terms = n.split(/\s+/);
    base = base.filter((r) => {
      const hay = textoDe(r);
      return terms.every((t) => contiene(hay, t));
    });
  }

  const orden = f.orden ?? 'nombre';
  return [...base].sort((a, b) => {
    if (orden === 'tiempo') return tiempoTotal(a) - tiempoTotal(b);
    if (orden === 'dificultad') return a.dificultad.localeCompare(b.dificultad) || a.nombre.localeCompare(b.nombre);
    return a.nombre.localeCompare(b.nombre, 'es');
  });
}

/* ------------------------------- recetas ------------------------------- */

export const tiempoTotal = (r: Receta) => (r.prep || 0) + (r.coccion || 0);

export const reposoTxt = (r: Receta) =>
  !r.reposo ? null : r.reposo >= 60 ? `${r.reposo / 60} h` : `${r.reposo} min`;

export const esCaliente = (r: Receta) => r.limiteMl === MAQUINA.capacidad.calienteMl;
export const lineaNombre = (r: Receta) => (esCaliente(r) ? 'HOT (1,4 L)' : 'COLD (1,6 L)');

export function racionesPara(r: Receta, k: number): number {
  return r.racionesNum * k;
}

export function botonUsaCalor(b: BotonPanel): boolean {
  const p = MAQUINA.programas.find((x) => x.b === b);
  if (p) return !!p.calor;
  return b === 'COOK';
}

/** Duración aproximada del programa automático, en minutos. */
export function minutosDe(b: BotonPanel): number | null {
  const p = MAQUINA.programas.find((x) => x.b === b);
  return p ? p.minProg : null;
}

/** ¿Este programa remueve y por tanto avisa con 3 pitidos? */
export function avisaPitidos(b: BotonPanel): boolean {
  const p = MAQUINA.programas.find((x) => x.b === b);
  return !!p && !!p.calor && p.minProg >= 5;
}

export function programasDe(r: Receta): BotonPanel[] {
  const out: BotonPanel[] = [];
  r.pasos.forEach((p) => {
    if (p.b && !out.includes(p.b)) out.push(p.b);
  });
  return out;
}

export const recetaPorId = (id: string, recetas: Receta[] = RECETAS) =>
  recetas.find((r) => r.id === id);

export const categoriaPorId = (id: string): Categoria | undefined =>
  CATEGORIAS.find((c) => c.id === id);

export function ingredientesPrincipales(recetas: Receta[] = RECETAS): string[] {
  return Array.from(new Set(recetas.map((r) => r.principal))).sort();
}

/* ------------------------------ alérgenos ------------------------------ */

const ALERGENOS: [Alergeno, RegExp][] = [
  ['lacteos', /nata|leche(?! de (coco|almendra))|mantequilla|queso|parmesano|yogur|helado|crema agria|evaporada/],
  ['gluten', /fideos|pasta|macarron|pretzel|harina|pan|cerveza/],
  ['frutos-secos', /anacardo|nuez|almendra|avellana|pistacho|cacahuete/],
  ['huevo', /huevo|mayonesa|fideos de huevo/],
  ['alcohol', /tequila|triple seco|vino|ron|licor/],
  ['soja', /soja|tofu/],
];

/** Deducidos de los ingredientes por la app. Orientativo, no una declaración de alérgenos. */
export function alergenosDe(r: Receta): Alergeno[] {
  const texto = norm(r.ing.map((i) => i.n).join(' | '));
  return ALERGENOS.filter(([, re]) => re.test(texto)).map(([a]) => a);
}

export const NOMBRE_ALERGENO: Record<Alergeno, string> = {
  lacteos: 'Lácteos',
  gluten: 'Gluten',
  'frutos-secos': 'Frutos secos',
  huevo: 'Huevo',
  alcohol: 'Alcohol',
  soja: 'Soja',
};

/* ------------------------------- pasillos ------------------------------ */

const PASILLOS: [Pasillo, RegExp][] = [
  ['congelados', /congelad|hielo|helado/],
  ['verduras', /cebolla|ajo|zanahoria|patata|puerro|apio|calabaza|calabacin|coliflor|brocoli|espinaca|kale|champinon|shiitake|seta|boniato|pimiento|tomate(?! en lata)|chalota|alcachofa|maiz|jengibre/],
  ['fruta', /manzana|platano|pina|mango|fresa|arandano|mora|frambuesa|lima|limon|naranja|menta/],
  ['carne', /pollo|ternera|pavo|cerdo|jamon|solomillo/],
  ['lacteos', /nata|leche|mantequilla|queso|parmesano|yogur|huevo|mayonesa/],
  ['bebidas', /tequila|triple seco|vino|zumo/],
  ['especias', /tomillo|romero|albahaca|perejil|cilantro|comino|sazonador|curry|sal|pimienta|especia|vainilla|pectina/],
  ['despensa', /caldo|azucar|chocolate|cacao|anacardo|nuez|almendra|cacahuete|fideos|pasta|macarron|alubia|garbanzo|lata|aceite|sirope|agave|pretzel|nube|proteina|caramelo/],
];

export function pasilloDe(nombre: string): Pasillo {
  const n = norm(nombre);
  for (const [p, re] of PASILLOS) if (re.test(n)) return p;
  return 'otros';
}

export const NOMBRE_PASILLO: Record<Pasillo, string> = {
  verduras: '🥕 Verdulería',
  fruta: '🍎 Fruta',
  carne: '🍗 Carnicería',
  lacteos: '🥛 Lácteos y huevos',
  congelados: '🧊 Congelados',
  despensa: '🥫 Despensa',
  especias: '🧂 Especias',
  bebidas: '🍷 Bebidas',
  otros: '🛒 Otros',
};

export const ORDEN_PASILLOS: Pasillo[] = [
  'verduras', 'fruta', 'carne', 'lacteos', 'congelados', 'despensa', 'especias', 'bebidas', 'otros',
];

/* ---------------------------- modo cocinar ----------------------------- */

/** Expande los pasos a un paso por acción, para el modo guiado. */
export function pasosCocina(r: Receta, k: number): PasoCocina[] {
  const out: PasoCocina[] = [];
  r.pasos.forEach((p, origen) => {
    if (p.add && p.add.length) {
      p.add.forEach((i, idx) => {
        const ing = r.ing[i];
        const q = cantidad(ing, k);
        out.push({
          origen,
          cap: idx === 0 ? p.t || 'Carga la jarra' : null,
          txt: q.libre
            ? ing.n.charAt(0).toUpperCase() + ing.n.slice(1)
            : `Añade ${q.txt} de ${ing.n}`,
          faltan: idx === 0 ? p.faltan : undefined,
          aviso: idx === 0 ? p.aviso : undefined,
        });
      });
      if (p.b) out.push({ origen, txt: p.t || '', b: p.b, sub: p.sub, min: p.min, aviso: p.aviso });
    } else {
      out.push({ origen, txt: p.t || '', b: p.b, sub: p.sub, min: p.min, faltan: p.faltan, aviso: p.aviso });
    }
  });

  // Ingredientes que la receta original lista pero nunca manda añadir.
  if (r.sinUsar?.length) {
    const lista = r.sinUsar.map((i) => lineaIng(r.ing[i], k)).join(', ');
    out.push({
      origen: r.pasos.length,
      txt: 'Revisa antes de servir',
      aviso: `La receta original lista ${lista} pero no dice en qué paso van. No los hemos colocado por ti: decide tú si los añades con el sofrito o con la verdura.`,
    });
  }

  return out.filter((s) => s.txt || s.b || s.aviso);
}

/** Minutos que dura un paso guiado, si se puede saber. */
export function minutosPaso(p: PasoCocina): number | null {
  if (p.min) return p.min;
  if (p.b) return minutosDe(p.b);
  return null;
}

/* ------------------------------ seguridad ------------------------------ */

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

export { cargaMl as cargaDe, maxEscala as escalaMaxima };

/* ------------------------------ diagnóstico ---------------------------- */

export type Ayuda = { titulo: string; texto: string; origen: string };

/** Busca también en los errores, avisos y notas del manual: escribir «JAr»
 *  o «humo» debe llevarte a la explicación, no a cero resultados. */
export function buscarAyuda(q: string): Ayuda[] {
  const n = norm(q).trim();
  if (n.length < 2) return [];
  const terms = n.split(/\s+/);
  const fuentes: Ayuda[] = [
    ...MAQUINA.errores.map(([t, d]) => ({ titulo: t, texto: d, origen: 'Mensaje de la pantalla' })),
    ...MAQUINA.seguridad.map(([t, d]) => ({ titulo: t, texto: d, origen: 'Aviso de seguridad' })),
    ...MAQUINA.notas.map((d) => ({ titulo: 'Cómo se comporta', texto: d, origen: 'Manual' })),
    ...MAQUINA.discrepancias.map((d) => ({ titulo: d.t, texto: d.d, origen: 'Discrepancia entre fuentes' })),
  ];
  return fuentes
    .filter((a) => {
      const hay = norm(a.titulo + ' ' + a.texto);
      return terms.every((t) => contiene(hay, t));
    })
    .slice(0, 4);
}
