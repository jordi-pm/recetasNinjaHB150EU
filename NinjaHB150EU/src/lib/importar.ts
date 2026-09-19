import type { CategoriaId, Ingrediente, Paso, Receta, Unidad } from '@/data/tipos';
import { norm } from './format';

/* ---------------------------------------------------------------------------
   Importar recetas de fuera.

   Dos vías: una URL (casi todas las webs de cocina publican los datos en
   JSON-LD schema.org/Recipe) o texto pegado a pelo. Lo que sale es un
   borrador que el usuario revisa: nunca se guarda nada sin que lo vea.
--------------------------------------------------------------------------- */

export type Borrador = {
  nombre: string;
  raciones: number;
  ing: Ingrediente[];
  pasos: Paso[];
  cat: CategoriaId;
  caliente: boolean;
  origen?: string;
  /** Lo que no hemos sabido interpretar, para que lo revise el usuario. */
  dudas: string[];
};

/* ------------------------------ cantidades ----------------------------- */

const UNIDADES: [RegExp, Unidad][] = [
  [/^(g|gr|gramos?)$/, 'g'],
  [/^(kg|kilos?|kilogramos?)$/, 'g'],
  [/^(ml|mililitros?|cc)$/, 'ml'],
  [/^(l|litros?)$/, 'ml'],
  [/^(cucharadas?|cdas?|tbsp)$/, 'cda'],
  [/^(cucharaditas?|cdtas?|tsp)$/, 'cdta'],
  [/^(dientes?)$/, 'diente'],
  [/^(latas?|botes?)$/, 'lata'],
  [/^(ramas?|tallos?)$/, 'rama'],
  [/^(hojas?)$/, 'hoja'],
];

const FRACCIONES: Record<string, number> = {
  '½': 0.5, '¼': 0.25, '¾': 0.75, '⅓': 1 / 3, '⅔': 2 / 3, '⅛': 0.125,
};

function numeroDe(txt: string): number | null {
  const t = txt.replace(',', '.').trim();
  if (FRACCIONES[t] !== undefined) return FRACCIONES[t];
  const mixta = t.match(/^(\d+)\s*([½¼¾⅓⅔⅛])$/);
  if (mixta) return parseInt(mixta[1], 10) + FRACCIONES[mixta[2]];
  const frac = t.match(/^(\d+)\s*\/\s*(\d+)$/);
  if (frac) return parseInt(frac[1], 10) / parseInt(frac[2], 10);
  const n = parseFloat(t);
  return isFinite(n) ? n : null;
}

/** «400 g de tomate entero pelado» → {c:400, u:'g', n:'tomate entero pelado'} */
export function parsearIngrediente(linea: string): Ingrediente {
  let t = linea.replace(/^[-*•·\s]+/, '').replace(/\s+/g, ' ').trim();

  const m = t.match(/^([\d.,]+\s*[½¼¾⅓⅔⅛]?|[½¼¾⅓⅔⅛]|\d+\s*\/\s*\d+)\s*([a-zA-ZáéíóúñÁÉÍÓÚÑ.]*)\s*(?:de\s+)?(.*)$/);
  if (!m) return { c: null, u: '', n: t };

  let c = numeroDe(m[1]);
  const posibleUnidad = norm(m[2] || '').replace(/\.$/, '');
  let u: Unidad = '';
  let resto = m[3];

  const hit = UNIDADES.find(([re]) => re.test(posibleUnidad));
  if (hit) {
    u = hit[1];
    // normalizar kg y litros a las unidades base
    if (/^(kg|kilos?|kilogramos?)$/.test(posibleUnidad) && c !== null) c *= 1000;
    if (/^(l|litros?)$/.test(posibleUnidad) && c !== null) c *= 1000;
  } else if (m[2]) {
    // no era una unidad: formaba parte del nombre
    resto = `${m[2]} ${m[3]}`.trim();
    u = 'ud';
  } else {
    u = 'ud';
  }

  if (c === null) return { c: null, u: '', n: t };
  return { c, u, n: resto || t };
}

/* --------------------------- adivinar programa -------------------------- */

const PISTAS: { re: RegExp; cat: CategoriaId; caliente: boolean; programa: string }[] = [
  { re: /crema|pur[ée]|vichyssoise|gazpacho fr[ií]o/, cat: 'sopas', caliente: true, programa: 'SMOOTH SOUP' },
  { re: /sopa|caldo|minestrone|consom[ée]/, cat: 'sopas', caliente: true, programa: 'CHUNKY SOUP' },
  { re: /mermelada|confitura|jam/, cat: 'mermelada', caliente: true, programa: 'JAM' },
  { re: /salsa|dip|fondue|pesto|bechamel/, cat: 'salsas', caliente: true, programa: 'SAUCE' },
  { re: /smoothie|batido verde|zumo/, cat: 'frias', caliente: false, programa: 'SMOOTHIE' },
  { re: /batido|milkshake/, cat: 'frias', caliente: false, programa: 'MILKSHAKE' },
  { re: /helado|sorbete|granizado/, cat: 'postres', caliente: false, programa: 'DESSERT' },
  { re: /c[óo]ctel|margarita|daiquiri|froz/, cat: 'frias', caliente: false, programa: 'FROZEN DRINK' },
  { re: /chocolate caliente|infusi[óo]n/, cat: 'calientes', caliente: true, programa: 'COOK' },
];

export function adivinarPrograma(nombre: string, texto: string) {
  const hay = norm(`${nombre} ${texto}`);
  const hit = PISTAS.find((p) => p.re.test(hay));
  return hit ?? { cat: 'sopas' as CategoriaId, caliente: true, programa: 'SMOOTH SOUP' };
}

/** Convierte los pasos en texto a pasos con los botones del aparato. */
export function pasosParaSopera(pasosTexto: string[], programa: string): Paso[] {
  const out: Paso[] = [];
  // norm() quita las tildes: así «sofríe», «sofrie» y «SOFRÍE» valen igual
  const necesitaSofrito =
    /SOUP|SAUCE/.test(programa) &&
    pasosTexto.some((p) => /sofri|sofre|pocha|rehoga|dora|saltea|refrie/.test(norm(p)));

  if (necesitaSofrito) {
    out.push({ t: 'Mete en la jarra la grasa, la cebolla y los aromáticos.' });
    out.push({ b: 'CHOP', t: 'Unos segundos de pulsos: queda picado, no triturado.' });
    out.push({ b: 'SAUTÉ', t: 'Cinco minutos de sofrito.' });
  }

  out.push({ t: 'Añade el resto de ingredientes.' });

  const b = programa as Paso['b'];
  if (b === 'COOK') out.push({ b: 'COOK', sub: 'MED', min: 20, t: 'Cuece a fuego medio.' });
  else out.push({ b, t: 'Deja que el programa termine.' });

  out.push({ vacia: true, t: 'Sirve.' });

  // Los pasos originales quedan como referencia al final
  pasosTexto.forEach((p) => {
    const limpio = p.replace(/\s+/g, ' ').trim();
    if (limpio.length > 8) out.push({ t: limpio });
  });

  return out;
}

/* ------------------------------- JSON-LD ------------------------------- */

function textoPlano(v: any): string {
  if (typeof v === 'string') return v.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  if (Array.isArray(v)) return v.map(textoPlano).join(' ');
  if (v && typeof v === 'object') return textoPlano(v.text ?? v.name ?? '');
  return '';
}

function listaDe(v: any): string[] {
  if (!v) return [];
  const arr = Array.isArray(v) ? v : [v];
  return arr.flatMap((x) => {
    if (x && typeof x === 'object' && Array.isArray(x.itemListElement)) return listaDe(x.itemListElement);
    const t = textoPlano(x);
    return t ? [t] : [];
  });
}

function buscarReceta(nodo: any): any | null {
  if (!nodo || typeof nodo !== 'object') return null;
  if (Array.isArray(nodo)) {
    for (const n of nodo) {
      const r = buscarReceta(n);
      if (r) return r;
    }
    return null;
  }
  const tipo = nodo['@type'];
  const tipos = Array.isArray(tipo) ? tipo : [tipo];
  if (tipos.includes('Recipe')) return nodo;
  if (nodo['@graph']) return buscarReceta(nodo['@graph']);
  return null;
}

/** Extrae la receta de un HTML con JSON-LD de schema.org. */
export function desdeHtml(html: string, url?: string): Borrador | null {
  const bloques = [...html.matchAll(/<script[^>]*application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi)];
  for (const b of bloques) {
    let datos: any;
    try {
      datos = JSON.parse(b[1].trim());
    } catch {
      continue;
    }
    const r = buscarReceta(datos);
    if (!r) continue;

    const nombre = textoPlano(r.name) || 'Receta importada';
    const ingTexto = listaDe(r.recipeIngredient ?? r.ingredients);
    const pasosTexto = listaDe(r.recipeInstructions);
    if (!ingTexto.length) continue;

    const raciones = parseInt(String(r.recipeYield ?? '4').replace(/\D/g, ''), 10) || 4;
    const pista = adivinarPrograma(nombre, `${ingTexto.join(' ')} ${pasosTexto.join(' ')}`);
    const ing = ingTexto.map(parsearIngrediente);

    const dudas: string[] = [];
    const sinCantidad = ing.filter((i) => i.c === null).length;
    if (sinCantidad) dudas.push(`${sinCantidad} ingrediente(s) sin cantidad clara: revísalos.`);
    if (!pasosTexto.length) dudas.push('La web no traía pasos: tendrás que escribirlos.');
    dudas.push('Los pasos con botón los hemos deducido nosotros. Compruébalos antes de cocinar.');

    return {
      nombre,
      raciones,
      ing,
      pasos: pasosParaSopera(pasosTexto, pista.programa),
      cat: pista.cat,
      caliente: pista.caliente,
      origen: url,
      dudas,
    };
  }
  return null;
}

/** Interpreta una receta pegada a mano. */
export function desdeTexto(texto: string): Borrador {
  const lineas = texto.split('\n').map((l) => l.trim()).filter(Boolean);
  const nombre = lineas[0]?.slice(0, 60) || 'Receta pegada';

  // Los ingredientes son las líneas que empiezan por cantidad o por viñeta
  const esIngrediente = (l: string) => /^[-*•·]|^[\d½¼¾⅓⅔⅛]/.test(l);
  const ingLineas = lineas.slice(1).filter(esIngrediente);
  const pasosLineas = lineas.slice(1).filter((l) => !esIngrediente(l) && l.length > 15);

  const pista = adivinarPrograma(nombre, texto);
  return {
    nombre,
    raciones: 4,
    ing: ingLineas.map(parsearIngrediente),
    pasos: pasosParaSopera(pasosLineas, pista.programa),
    cat: pista.cat,
    caliente: pista.caliente,
    dudas: [
      'Receta interpretada de texto suelto: repasa cantidades y unidades.',
      'Los pasos con botón los hemos deducido nosotros.',
    ],
  };
}

/** Descarga una URL y saca la receta. */
export async function desdeUrl(url: string): Promise<Borrador> {
  const limpia = url.trim();
  if (!/^https?:\/\//i.test(limpia)) throw new Error('Eso no parece una dirección web.');
  const res = await fetch(limpia, { headers: { 'User-Agent': 'Mozilla/5.0' } });
  if (!res.ok) throw new Error(`La web respondió ${res.status}.`);
  const html = await res.text();
  const b = desdeHtml(html, limpia);
  if (!b) throw new Error('Esa página no publica la receta en un formato que sepamos leer. Prueba a copiar y pegar el texto.');
  return b;
}

/** Pasa el borrador a receta guardable. */
export function aReceta(b: Borrador, id = `propia-${Date.now()}`): Receta {
  const programa = b.pasos.filter((p) => p.b).map((p) => p.b).join(' & ') || 'MANUAL';
  return {
    id,
    cat: b.cat,
    nombre: b.nombre,
    raciones: b.raciones,
    racionesNum: b.raciones,
    prep: 10,
    coccion: 30,
    dificultad: 'Fácil',
    programa,
    principal: b.ing[0]?.n.split(/[ ,]/)[0] ?? 'a elegir',
    tags: [],
    limiteMl: b.caliente ? 1400 : 1600,
    ing: b.ing,
    pasos: b.pasos,
    propia: true,
    nota: b.origen ? `Importada de ${b.origen}` : 'Importada de un texto pegado.',
  };
}
