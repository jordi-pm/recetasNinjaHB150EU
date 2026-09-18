import type { Ingrediente, Receta } from '@/data/tipos';

/* ---------------------------------------------------------------------------
   Cuánto sitio ocupa cada ingrediente en la jarra.

   AVISO: esto es un cálculo de la app, NO un dato del manual de Ninja. Sirve
   para decidir si un escalado 2×/3× se saldría de la línea grabada. Las
   cantidades a 1× vienen del recetario oficial y se dan por buenas.

   Las densidades son "densidad aparente": lo que ocupa el ingrediente tal y
   como entra en la jarra, con sus huecos de aire. Por eso la coliflor en
   ramilletes (0,40) ocupa mucho más de lo que pesa, y la espinaca cruda (0,15)
   todavía más.
--------------------------------------------------------------------------- */

const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

/** g/ml aparentes. El primero que casa por palabra clave, gana: orden importa. */
const DENSIDADES: [RegExp, number][] = [
  // hojas y verdura muy aireada
  [/espinaca baby|espinaca fresca/, 0.15],
  [/kale|hojas de kale/, 0.15],
  [/coliflor/, 0.40],
  [/brocoli/, 0.40],
  [/champinon|shiitake|seta/, 0.35],
  [/parmesano rallado|queso rallado/, 0.40],
  // verdura en trozos de 2,5 cm
  [/calabaza|boniato|patata|zanahoria|calabacin|apio|puerro|cebolla|chalota|pimiento/, 0.60],
  [/tomate en lata|tomate entero pelado|tinned tomato/, 1.00],
  [/alcachofa/, 0.70],
  [/alubia|garbanzo|legumbre/, 0.75],
  [/maiz/, 0.70],
  [/espinaca congelada/, 0.90],
  // fruta
  [/fruta congelada|frutos rojos|arandano|mora|fresa|mango|pina|frambuesa/, 0.62],
  [/platano|manzana/, 0.65],
  // congelados varios
  [/hielo|cubitos/, 0.60],
  // grasas y líquidos
  [/aceite/, 0.91],
  [/mantequilla/, 0.91],
  [/nata|leche|caldo|agua|zumo|vino|tequila|triple seco|sirope|yogur|suero/, 1.00],
  [/queso crema/, 1.00],
  [/mayonesa/, 0.94],
  [/leche de coco/, 1.00],
  // secos y sólidos
  [/azucar glas/, 0.55],
  [/azucar/, 0.85],
  [/pectina/, 1.00],
  [/chocolate blanco|chips de chocolate|chocolate negro|chocolate con leche/, 0.75],
  [/cacao en polvo/, 0.45],
  [/anacardo|nuez|almendra|fruto seco/, 0.60],
  [/crema de cacahuete/, 1.05],
  [/fideos|macarron|pasta/, 0.45],
  [/proteina en polvo/, 0.45],
  [/caramelo/, 0.70],
  [/helado/, 0.55],
  [/pollo|ternera|pavo|cerdo|jamon|solomillo/, 0.90],
];

/** Gramos por unidad, para ingredientes contados en piezas. */
const PESOS: [RegExp, number][] = [
  [/cebolla mediana/, 130],
  [/cebolla/, 90],
  [/chalota/, 30],
  [/diente/, 5],
  [/zanahoria pequena/, 50],
  [/zanahoria/, 70],
  [/patata/, 150],
  [/puerro/, 100],
  [/apio/, 40],
  [/platano pequeno|platanos maduros pequenos/, 90],
  [/platano/, 120],
  [/manzana/, 180],
  [/caramelo/, 3],
  [/menta|hoja/, 0.3],
  [/proteina/, 30],
  [/lata/, 400],
];

const ML_POR_UNIDAD: Record<string, number> = { cda: 15, cdta: 5 };

const busca = (tabla: [RegExp, number][], nombre: string, porDefecto: number) => {
  const n = norm(nombre);
  for (const [re, v] of tabla) if (re.test(n)) return v;
  return porDefecto;
};

export const densidadDe = (nombre: string) => busca(DENSIDADES, nombre, 0.70);
export const pesoUnidadDe = (nombre: string) => busca(PESOS, nombre, 100);

/** Volumen aparente en ml que ocupa este ingrediente en la jarra. */
export function volumenMl(ing: Ingrediente, k = 1): number {
  if (ing.fuera) return 0;
  if (ing.mlForzado !== undefined) return ing.mlForzado * k;
  if (ing.c === null) return 0;
  const c = ing.c * k;

  switch (ing.u) {
    case 'ml':
      return c;
    case 'g':
      return c / densidadDe(ing.n);
    case 'cda':
    case 'cdta':
      return c * ML_POR_UNIDAD[ing.u] * (densidadDe(ing.n) >= 0.9 ? 1 : 1);
    case 'ud':
    case 'diente':
    case 'rama':
    case 'hoja':
    case 'cacito':
    case 'lata':
      return (c * pesoUnidadDe(ing.n)) / densidadDe(ing.n);
    default:
      return 0;
  }
}

/** Carga total de la receta a escala k, en ml. */
export function cargaMl(r: Receta, k = 1): number {
  return Math.round(r.ing.reduce((t, ing) => t + volumenMl(ing, k), 0));
}

/** Máximo múltiplo que sigue cabiendo bajo la línea que aplica. */
export function maxEscala(r: Receta): number {
  const base = cargaMl(r, 1);
  if (base <= 0) return 3;
  return Math.max(1, Math.min(3, Math.floor(r.limiteMl / base)));
}

/** Desglose para enseñar de dónde sale el número. */
export function desglose(r: Receta, k = 1) {
  return r.ing
    .map((ing, i) => ({ i, ing, ml: Math.round(volumenMl(ing, k)) }))
    .filter((x) => x.ml > 0)
    .sort((a, b) => b.ml - a.ml);
}
