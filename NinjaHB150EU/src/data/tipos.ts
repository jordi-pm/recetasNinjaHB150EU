/* ---------------------------------------------------------------------------
   Tipos del modelo. La regla central del proyecto —solo botones que existen
   de verdad en el panel— vive aquí como unión cerrada: inventarse
   un programa deja de compilar.
--------------------------------------------------------------------------- */

/** Los 10 programas automáticos impresos en el panel. */
export type ProgramaAutoIQ =
  | 'SMOOTHIE' | 'DESSERT' | 'FROZEN DRINK' | 'MILKSHAKE'
  | 'SMOOTH SOUP' | 'CHUNKY SOUP' | 'JAM' | 'SAUCE'
  | 'CHOP' | 'SAUTÉ';

/** Ajustes manuales y otros botones del panel. */
export type BotonManual = 'BLEND' | 'COOK' | 'PULSE' | 'CLEAN' | 'POWER';

/** Cualquier tecla que una receta puede pedirte pulsar. */
export type BotonPanel = ProgramaAutoIQ | BotonManual;

/** Ajuste que acompaña a BLEND o COOK. */
export type AjusteManual = 'LOW' | 'MED' | 'HIGH';

export type Unidad =
  | 'g' | 'ml' | 'cda' | 'cdta' | 'ud' | 'diente'
  | 'lata' | 'rama' | 'hoja' | 'cacito' | '';

export type CategoriaId =
  | 'sopas' | 'frias' | 'calientes' | 'salsas' | 'mermelada' | 'postres' | 'previas';

export type Etiqueta =
  | 'vegetariana' | 'vegana' | 'fria' | 'caliente' | 'suave' | 'trozos' | 'alcohol';

export type Ingrediente = {
  /** Cantidad numérica; null = «al gusto» / sin cantidad en la receta original. */
  c: number | null;
  u: Unidad;
  n: string;
  /** Volumen en ml, si hay que forzarlo en vez de calcularlo por densidad. */
  mlForzado?: number;
  /** No ocupa sitio en la jarra (guarniciones, acompañamientos). */
  fuera?: boolean;
};

export type Paso = {
  t?: string;
  /** Botón EXACTO tal y como está impreso en el panel. */
  b?: BotonPanel;
  sub?: AjusteManual;
  /** Índices de `ing` que se cargan en la jarra en este paso. */
  add?: number[];
  /** Minutos que dura este paso; arranca un temporizador en el modo cocina. */
  min?: number;
  /** Este paso ocurre cuando faltan N minutos para terminar el programa anterior. */
  faltan?: number;
  /** Aviso concreto para este paso (vapor, pitidos, tapa…). */
  aviso?: string;
};

export type Receta = {
  id: string;
  cat: CategoriaId;
  nombre: string;
  raciones: number | string;
  /** Raciones como número, para escalar y ordenar. */
  racionesNum: number;
  prep: number;
  coccion: number;
  reposo?: number;
  dificultad: 'Fácil' | 'Media';
  programa: string;
  principal: string;
  tags: Etiqueta[];
  /** Línea de llenado que aplica: 1400 (HOT) o 1600 (COLD). */
  limiteMl: 1400 | 1600;
  ing: Ingrediente[];
  pasos: Paso[];
  tip?: string;
  nota?: string;
  discrepancia?: string;
  /** Ingredientes que la receta original lista pero nunca usa en los pasos. */
  sinUsar?: number[];
  plantilla?: boolean;
  tecnica?: boolean;
  /** Recetas creadas por el usuario dentro de la app. */
  propia?: boolean;
};

export type Categoria = { id: CategoriaId; emoji: string; nombre: string };

export type PasoCocina = {
  cap?: string | null;
  txt: string;
  b?: BotonPanel;
  sub?: AjusteManual;
  min?: number;
  faltan?: number;
  aviso?: string;
  /** Índice del paso original, para poder reanudar. */
  origen: number;
};

export type Alergeno = 'lacteos' | 'gluten' | 'frutos-secos' | 'huevo' | 'alcohol' | 'soja';

export type Pasillo =
  | 'verduras' | 'fruta' | 'carne' | 'lacteos' | 'congelados'
  | 'despensa' | 'especias' | 'bebidas' | 'otros';
