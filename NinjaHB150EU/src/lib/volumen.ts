import type { Ingrediente, Receta } from '@/data/tipos';

/* ---------------------------------------------------------------------------
   Cuánto sitio ocupa una receta en la jarra.

   AVISO: es un cálculo de la app, NO un dato del fabricante. Margen
   estimado ±20 %. Sirve para decidir si un escalado 2×/3× se saldría de la
   línea grabada; la línea de la jarra siempre manda sobre este número.

   Modelo: los trozos sólidos dejan huecos entre sí, y el líquido los rellena
   en vez de apilarse encima. Por eso el total NO es la suma de volúmenes
   aparentes:

     volumen real de un sólido = masa / densidad del material
     volumen aparente (a granel) = volumen real / fracción de empaquetado
     TOTAL = máx( Σ aparente de sólidos , Σ real de sólidos + Σ líquidos )

   Con poco líquido manda el apilamiento de los trozos; con bastante líquido,
   los trozos quedan sumergidos y solo desplazan su volumen real.
--------------------------------------------------------------------------- */

const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

type Material = {
  /** Densidad del material, sin aire (g/ml). */
  ro: number;
  /** Fracción de empaquetado: 1 = líquido o pasta sin huecos. */
  empaque: number;
};

const LIQUIDO: Material = { ro: 1.0, empaque: 1 };

/** El primer patrón que casa, gana: el orden importa. */
const MATERIALES: [RegExp, Material][] = [
  // líquidos y pastas (sin huecos de aire)
  [/aceite/, { ro: 0.91, empaque: 1 }],
  [/nata|leche|caldo|agua|zumo|vino|tequila|triple seco|sirope|yogur|pure de tomate/, LIQUIDO],
  [/mayonesa|nata agria|queso crema|crema de cacahuete|concentrado de tomate|pasta de curry/, { ro: 1.0, empaque: 1 }],
  [/mantequilla/, { ro: 0.91, empaque: 1 }],
  [/pectina/, LIQUIDO],
  [/helado/, { ro: 0.55, empaque: 1 }],
  [/tomate entero pelado|tomate en lata/, { ro: 1.0, empaque: 1 }],
  [/espinaca congelada.*escurrid|espinaca picada/, { ro: 1.0, empaque: 1 }],

  // hojas y verdura muy aireada
  [/espinaca baby|espinaca fresca/, { ro: 0.95, empaque: 0.16 }],
  [/kale/, { ro: 0.95, empaque: 0.16 }],
  [/coliflor|brocoli/, { ro: 0.95, empaque: 0.45 }],
  [/champinon|shiitake|seta/, { ro: 0.95, empaque: 0.40 }],
  [/parmesano rallado|queso rallado/, { ro: 1.1, empaque: 0.38 }],

  // verdura y fruta en trozos
  [/calabaza|boniato|patata|zanahoria|calabacin|apio|puerro|cebolla|chalota|pimiento|alcachofa/,
    { ro: 1.0, empaque: 0.65 }],
  [/manzana|platano|pina|mango/, { ro: 0.95, empaque: 0.65 }],
  [/fresa|arandano|mora|frambuesa|frutos rojos|fruta congelada/, { ro: 0.95, empaque: 0.62 }],
  [/maiz|alubia|garbanzo|legumbre/, { ro: 1.05, empaque: 0.62 }],
  [/hielo|cubitos/, { ro: 0.92, empaque: 0.62 }],

  // secos y sólidos
  [/azucar glas/, { ro: 1.59, empaque: 0.35 }],
  [/azucar/, { ro: 1.59, empaque: 0.55 }],
  [/cacao en polvo/, { ro: 1.3, empaque: 0.35 }],
  [/proteina en polvo/, { ro: 1.2, empaque: 0.35 }],
  [/chocolate/, { ro: 1.3, empaque: 0.60 }],
  [/anacardo|nuez|almendra|fruto seco/, { ro: 1.0, empaque: 0.60 }],
  [/fideos|macarron|pasta/, { ro: 1.3, empaque: 0.35 }],
  [/caramelo/, { ro: 1.4, empaque: 0.60 }],
  [/pollo|ternera|pavo|cerdo|jamon|solomillo/, { ro: 1.05, empaque: 0.70 }],
  [/ajo|jengibre/, { ro: 1.0, empaque: 0.60 }],
  [/tomillo|romero|albahaca|perejil|cilantro|comino|sazonador|curry|sal|pimienta|especia|menta|vainilla/,
    { ro: 0.5, empaque: 0.5 }],
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
  [/platanos maduros pequenos|platano pequeno/, 90],
  [/platano/, 120],
  [/manzana/, 180],
  [/caramelo/, 3],
  [/menta|hoja/, 0.3],
  [/proteina/, 30],
  [/lata/, 400],
];

const ML_CUCHARA: Record<string, number> = { cda: 15, cdta: 5 };

function materialDe(nombre: string): Material {
  const n = norm(nombre);
  for (const [re, m] of MATERIALES) if (re.test(n)) return m;
  return { ro: 1.0, empaque: 0.65 };
}

/** Gramos por pieza cuando la unidad ya dice de qué pieza hablamos. */
const PESO_POR_UNIDAD: Record<string, number> = {
  diente: 5,      // diente de ajo
  rama: 40,       // rama de apio
  hoja: 0.3,      // hoja de menta
  cacito: 30,     // cacito de proteína
  lata: 400,      // lata de 400 g, como las da el recetario
};

function pesoUnidadDe(nombre: string, unidad: string): number {
  const porUnidad = PESO_POR_UNIDAD[unidad];
  if (porUnidad !== undefined) return porUnidad;
  const n = norm(nombre);
  for (const [re, g] of PESOS) if (re.test(n)) return g;
  return 100;
}

type Aporte = { real: number; aparente: number };

/** Volumen real y aparente (ml) que aporta un ingrediente a escala k. */
export function aporte(ing: Ingrediente, k = 1): Aporte {
  if (ing.fuera || ing.c === null) return { real: 0, aparente: 0 };
  if (ing.mlForzado !== undefined) {
    const v = ing.mlForzado * k;
    return { real: v, aparente: v };
  }
  const c = ing.c * k;
  const mat = materialDe(ing.n);

  let gramos: number | null = null;
  let ml: number | null = null;

  switch (ing.u) {
    case 'ml':
      ml = c;
      break;
    case 'g':
      gramos = c;
      break;
    case 'cda':
    case 'cdta':
      ml = c * ML_CUCHARA[ing.u];
      break;
    case 'ud':
    case 'diente':
    case 'rama':
    case 'hoja':
    case 'cacito':
    case 'lata':
      gramos = c * pesoUnidadDe(ing.n, ing.u);
      break;
    default:
      return { real: 0, aparente: 0 };
  }

  if (ml !== null) {
    // Medido en volumen: ya es el volumen que ocupa.
    return { real: ml, aparente: ml / (mat.empaque === 1 ? 1 : mat.empaque) };
  }
  const real = gramos! / mat.ro;
  return { real, aparente: real / mat.empaque };
}

const esLiquido = (ing: Ingrediente) => materialDe(ing.n).empaque === 1;

/** Carga total de la receta a escala k, en ml. */
export function cargaMl(r: Receta, k = 1): number {
  let aparenteSolidos = 0;
  let realSolidos = 0;
  let liquidos = 0;

  r.ing.forEach((ing) => {
    const a = aporte(ing, k);
    if (esLiquido(ing)) liquidos += a.real;
    else {
      aparenteSolidos += a.aparente;
      realSolidos += a.real;
    }
  });

  return Math.round(Math.max(aparenteSolidos, realSolidos + liquidos));
}

/** Máximo múltiplo que sigue cabiendo bajo la línea que aplica (1..3).
 *  `limite` permite usar la jarra real del usuario en vez de la de la receta. */
export function maxEscala(r: Receta, limite: number = r.limiteMl): number {
  for (let k = 3; k >= 2; k--) if (cargaMl(r, k) <= limite) return k;
  return 1;
}

/** ¿La estimación a 1× ya roza o pasa la línea grabada? */
export function aprietaA1x(r: Receta, limite: number = r.limiteMl): boolean {
  return cargaMl(r, 1) > limite;
}

/** Desglose, para poder enseñar de dónde sale el número. */
export function desglose(r: Receta, k = 1) {
  return r.ing
    .map((ing, i) => ({ i, ing, ml: Math.round(aporte(ing, k).real), liquido: esLiquido(ing) }))
    .filter((x) => x.ml > 0)
    .sort((a, b) => b.ml - a.ml);
}
