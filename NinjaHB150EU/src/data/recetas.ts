/* eslint-disable */
import type { Categoria, Receta } from './tipos';
// Tipos en ./tipos.ts
/* Recetas adaptadas para batidoras soperas con jarra calefactora: las que
   cuecen y trituran en el mismo vaso, con programas automáticos de sopa
   suave, sopa con trozos, salsa, mermelada, sofrito y picado.

   Cantidades pensadas para una jarra de 1,7 L con las dos líneas de llenado
   habituales: 1,4 L cuando se usa calor y 1,6 L en frío. Comprueba siempre
   las líneas grabadas en tu jarra. */

export const MAQUINA = {
  modelo: 'Batidora sopera con jarra calefactora',
  potencia: '1000 W · 220-240 V, 50-60 Hz (modelo de referencia)',
  jarra: 'Jarra de cristal de 1,7 L con elemento calefactor integrado',
  piezas: [
    ['A', 'Tapa de la jarra con tapón central extraíble'],
    ['B', 'Jarra de cristal de 1,7 L con elemento calefactor integrado'],
    ['C', 'Base motora'],
    ['D', 'Tamper (empujador)'],
    ['E', 'Cepillo de limpieza']
  ],
  programas: [
    { b: 'SMOOTHIE',     seccion: 'BLEND', calor: false, minProg: 0.75, dur: '45 s',  d: 'Bate fruta, verdura, líquidos y polvos en una sola marcha corta.' },
    { b: 'DESSERT',      seccion: 'BLEND', calor: false, minProg: 1, dur: '1 min', d: 'Usa fruta congelada y lácteos para hacer sorbetes y postres helados.' },
    { b: 'FROZEN DRINK', seccion: 'BLEND', calor: false, minProg: 1, dur: '1 min', d: 'Rompe hielo y fruta congelada hasta dejar una bebida granizada.' },
    { b: 'MILKSHAKE',    seccion: 'BLEND', calor: false, minProg: 1, dur: '1 min', d: 'Airea leche y helado hasta dejar el batido espumoso.' },
    { b: 'SMOOTH SOUP',  seccion: 'COOK', calor: true, minProg: 30, dur: '≈30 min', fases: ['Precalienta hasta que rompe a hervir', 'Pulsa y remueve para cocinar de forma uniforme', 'Tritura hasta dejar una crema fina'], d: 'Cuece y después tritura, sin que tengas que cambiar de programa.' },
    { b: 'CHUNKY SOUP',  seccion: 'COOK', calor: true, minProg: 30, dur: '≈30 min', fases: ['Precalienta hasta que rompe a hervir', 'Pulsa y remueve suavemente para cocinar de forma uniforme'], d: 'Cuece removiendo con pulsos suaves y deja los trozos enteros.' },
    { b: 'JAM',          seccion: 'COOK', calor: true, minProg: 30, dur: '≈30 min', d: 'Cuece fruta con azúcar a fuego lento hasta que espesa.' },
    { b: 'SAUCE',        seccion: 'COOK', calor: true, minProg: 30, dur: '≈30 min', d: 'Cocción larga y suave removiendo sola: salsas, dips y fondues.' },
    { b: 'CHOP',         seccion: 'PRE-COOK', calor: false, minProg: 0.25, dur: 'unos segundos', fases: ['Da pulsos cortos para picar groseramente los aromáticos'], d: 'Pulsos cortos para dejar la cebolla y el ajo picados, no triturados.' },
    { b: 'SAUTÉ',        seccion: 'PRE-COOK', calor: true, minProg: 5, dur: '≈5 min', fases: ['Cocina 5 minutos para soltar el sabor de los aromáticos'], d: 'Sofríe unos minutos lo que acabas de picar, antes de añadir el líquido.' }
  ],
  manual: [
    { b: 'BLEND', opciones: 'LOW · MED · HIGH · PULSE', d: 'Selecciona BLEND y después tu velocidad. LOW, MED y HIGH funcionan 60 segundos o hasta que lo pares manualmente. PULSE solo funciona mientras mantienes pulsado el botón.' },
    { b: 'COOK',  opciones: 'LOW · MED · HIGH',        d: 'Selecciona COOK y después la temperatura. El ajuste funciona 60 minutos o hasta que lo pares manualmente. Puedes pulsar PULSE durante COOK para remover suavemente.' }
  ],
  otros: [
    { b: 'POWER',     d: 'Enciende o apaga el aparato. Siempre es el primer botón.' },
    { b: 'CLEAN',     d: 'Combina calor y pulsos rápidos para eliminar restos pegados. Llena la jarra con 700 ml de agua y 2 gotas pequeñas de lavavajillas, tapa y pulsa CLEAN.' },
    { b: 'HEAT ON',   d: 'Piloto: se enciende cuando has seleccionado un programa o función que usa calor.' },
    { b: 'KEEP WARM', d: 'Piloto: se enciende después de cocinar; el aparato mantiene el contenido caliente hasta 60 minutos.' }
  ],
  capacidad: {
    calienteMl: 1400,
    frioMl: 1600,
    texto: 'En los modos COOK NO superes la línea marcada HOT (línea de sopa, 1,4 L). En modo BLEND NO superes la línea marcada COLD (1,6 L).'
  },
  seguridad: [
    ['Llenado', 'NO llenes los recipientes por encima de las líneas de llenado máximo (max fill / max liquid). Superar la capacidad máxima es la causa más habitual de sobrecarga del aparato.'],
    ['Llenado en caliente', 'En los modos COOK no superes la línea HOT (1,4 L); en modo BLEND no superes la línea COLD (1,6 L).'],
    ['Líquidos calientes', 'Ten cuidado si viertes líquido caliente en la batidora: puede salir proyectado del aparato por un chorro repentino.'],
    ['Jarra caliente', 'NO agarres la jarra por los laterales ni por debajo después de triturar o cocinar en caliente. La superficie está caliente durante y después del funcionamiento. Usa siempre manoplas o salvamanteles y las asas disponibles.'],
    ['Peso de la jarra', 'Agarra el asa firmemente con una mano y vierte con cuidado. Si la jarra pesa demasiado con una mano, usa una manopla y sujeta el peso con la otra mano.'],
    ['Vapor', 'Después de los programas con calor puede salir vapor al retirar la tapa. Mantén las manos en las pestañas exteriores y levanta la tapa en vertical.'],
    ['Tapa', 'NUNCA hagas funcionar el aparato sin la tapa y el tapón colocados. No intentes anular el mecanismo de bloqueo. Asegúrate de que la jarra y la tapa estén bien colocadas antes de usarlo.'],
    ['Tapón central', 'El aparato pita 3 veces para avisar de que el programa va a remover los ingredientes. Asegúrate de que el tapón central esté bien colocado durante el uso.'],
    ['Tamper', 'El tamper solo debe usarse con la tapa puesta en la jarra: retira el tapón central y sustitúyelo por el tamper.'],
    ['Manos fuera', 'Mantén manos y utensilios fuera de la jarra mientras tritura. NUNCA metas las manos en la jarra: podrías cortarte con las cuchillas. Si quedan ingredientes pegados en las paredes, para el aparato, retira la tapa y usa una espátula de goma solo con el aparato parado.'],
    ['Vacío', 'NO hagas funcionar el aparato con el recipiente vacío.'],
    ['Utensilios', 'Antes de ponerlo en marcha, retira todos los utensilios de la jarra. No hacerlo puede romper el recipiente y causar lesiones y daños materiales.'],
    ['Microondas', 'NO metas en el microondas ninguno de los recipientes ni accesorios del aparato.'],
    ['Cambios de temperatura', 'NO expongas los recipientes y accesorios a cambios bruscos de temperatura: pueden dañarse.'],
    ['Al retirar', 'NO intentes retirar la jarra mientras la batidora está en marcha. Espera a que las cuchillas dejen de girar antes de retirar la jarra.'],
    ['Sin vigilancia', 'NUNCA dejes el aparato funcionando sin vigilancia.'],
    ['Limpieza · jarra', 'NO sumerjas la jarra: sumergirla dañará el elemento calefactor integrado. Lava jarra, tapa y tamper con agua templada y jabón, usando el cepillo incluido para evitar el contacto directo con las cuchillas.'],
    ['Limpieza · lavavajillas', 'La tapa, el tapón central y el tamper son aptos para lavavajillas. NO laves la jarra en el lavavajillas: dañarás el elemento calefactor.'],
    ['Limpieza · base', 'Pulsa POWER para apagar, desenchufa la base motora y límpiala con un paño limpio y húmedo.'],
    ['Enfriar', 'Deja que todas las piezas se enfríen antes de montar, desmontar o limpiar.'],
    ['Sobrecalentamiento', 'Si el aparato se sobrecalienta, un interruptor térmico desactiva temporalmente el motor. Para reiniciarlo: desenchufa y deja enfriar unos 15 minutos antes de volver a usarlo.'],
    ['Accesorios', 'Usa SOLO los accesorios que vienen con tu aparato o los que autorice su fabricante. Otros accesorios, incluidos tarros de conserva, pueden provocar incendio, descarga eléctrica o lesiones.'],
    ['Niños', 'NO permitas que los niños usen este aparato ni jueguen con él. La limpieza y el mantenimiento no deben realizarlos niños. Mantén el aparato y su cable fuera del alcance de los niños.'],
    ['Uso', 'Solo para uso doméstico y en interiores. Úsalo siempre sobre una superficie seca y nivelada.']
  ],
  errores: [
    ['“Lid”', 'La tapa no está bien montada. Asegúrate de que está puesta y bloqueada antes de lanzar un programa.'],
    ['“JAr”', 'Aviso relativo al acople de la jarra. Asegúrate de que la jarra está bien encajada en la base antes de seleccionar un programa.'],
    ['“---” parpadeando', 'Estás intentando ejecutar un programa demasiadas veces seguidas. Por seguridad, algunos programas solo pueden ejecutarse 2 veces consecutivas.'],
    ['“E01” / “E02”', 'Retira y vuelve a colocar la jarra. Si no se soluciona, contacta con Atención al Cliente.']
  ],
  notas: [
    'Los programas automáticos no dejan cambiar tiempo ni temperatura: vienen fijados de fábrica. Si necesitas elegir la temperatura, usa el ajuste manual COOK.',
    'Si retiras la tapa con un programa en marcha, la cocción o el triturado se pausan. Vuelve a poner la tapa y pulsa otra vez el botón del programa para continuar donde se quedó.',
    'Los programas automáticos cuentan hacia atrás; los modos manuales cuentan hacia arriba desde 0.',
    'El panel vuelve al modo de espera tras 3 minutos de inactividad.',
    'Aviso de removido: 3 pitidos seguidos de 2 segundos de pausa antes de cada removido, en todos los programas automáticos.',
    'Consejo del manual: en recetas espesas como helados y dips, usa el tamper para empujar los ingredientes hacia las cuchillas.',
    'Consejo del manual (COOK manual): pulsa PULSE periódicamente durante la cocción para repartir el calor y cocinar de forma uniforme.'
  ],
  discrepancias: [
    { t: 'SAUTE o SAUTÉ', d: 'Según la serie, el mismo botón aparece rotulado con tilde o sin ella. Es el mismo programa; en la app se escribe SAUTÉ.' },
    { t: 'Cuánto dura el COOK manual', d: 'Hay paneles cuyo ajuste manual COOK se apaga solo a los 60 minutos y otros que cuentan de otra forma. Las recetas de aquí cuecen entre 14 y 20 minutos, así que no depende de ese límite, pero conviene que mires tu manual.' },
    { t: 'Capacidad de la jarra', d: 'Una jarra “de 1,7 L” no se llena hasta 1,7 L: las líneas grabadas suelen estar en 1,4 L para preparaciones con calor y 1,6 L en frío. La app usa siempre esas dos líneas.' },
    { t: 'Nombres del panel', d: 'Los rótulos de los botones varían entre modelos y entre mercados. Compara siempre los nombres de la app con los que lleva impresos tu aparato antes de pulsar.' },
    { t: 'Los cálculos de volumen son de la app', d: 'El sitio que ocupa cada receta lo estima la app a partir de densidades aproximadas, con un margen de ±20 %. No es un dato del fabricante: manda la línea grabada en tu jarra.' },
  ]
};

export const CATEGORIAS: Categoria[] = [
  { id: 'sopas',    emoji: '🥣', nombre: 'Sopas y cremas' },
  { id: 'frias',    emoji: '🥤', nombre: 'Smoothies y bebidas frías' },
  { id: 'calientes',emoji: '☕', nombre: 'Bebidas calientes' },
  { id: 'salsas',   emoji: '🍅', nombre: 'Salsas' },
  { id: 'mermelada',emoji: '🍓', nombre: 'Mermeladas' },
  { id: 'postres',  emoji: '🍨', nombre: 'Postres' },
  { id: 'previas',  emoji: '🧅', nombre: 'Salteados / preparaciones previas' }
];

export const COMPATIBILIDAD = {
  titulo: 'Para qué aparato es esto',
  texto:
    'Está pensada para batidoras soperas de jarra calefactora de unos 1,7 L, ' +
    'con programas automáticos rotulados SMOOTH SOUP, CHUNKY SOUP, SAUCE, JAM, ' +
    'CHOP, SAUTÉ, SMOOTHIE, DESSERT, FROZEN DRINK y MILKSHAKE, más los ajustes ' +
    'manuales BLEND y COOK. Si tu jarra tiene otras capacidades o tu panel otros ' +
    'rótulos, ajusta las cantidades y guíate por tu manual.',
};

/* c = cantidad, u = unidad, n = nombre, esc:false = no se escala */
export const RECETAS: Receta[] = [
/* ---------------------------------- SOPAS --------------------------------- */
{
  id: 'tomate-albahaca', cat: 'sopas',
  nombre: 'Sopa de tomate y albahaca',
  raciones: 4, racionesNum: 4, prep: 5, coccion: 20, dificultad: 'Media', programa: 'MANUAL',
  principal: 'tomate', tags: ['vegetariana', 'suave'],
  limiteMl: 1400,
  ing: [
    { c: 3, u: 'cda', n: 'aceite de oliva' },
    { c: 1, u: 'ud', n: 'cebolla pequeña, pelada y cortada en cuartos' },
    { c: null, u: '', n: 'sal' },
    { c: 2, u: 'lata', n: 'tomate entero pelado (400 g cada lata)' },
    { c: 250, u: 'ml', n: 'caldo de pollo caliente' },
    { c: 0.5, u: 'cdta', n: 'albahaca seca' },
    { c: 80, u: 'ml', n: 'nata para montar' },
    { c: null, u: '', n: 'pimienta al gusto' }
  ],
  pasos: [
    { add: [0, 1, 2] },
    { b: 'CHOP', t: 'Unos segundos de pulsos y la cebolla queda picada, no hecha puré.' },
    { b: 'SAUTÉ', t: 'Cinco minutos de sofrito. Aquí es donde la sopa coge el sabor.' },
    { add: [3, 4, 5, 6, 7], t: 'Añade el resto de ingredientes en el orden indicado.' },
    { b: 'COOK', sub: 'HIGH', min: 14, t: 'A fuego fuerte.', aviso: 'Pulsa PULSE de vez en cuando para repartir el calor (consejo del manual).' },
    { b: 'BLEND', sub: 'HIGH', min: 1, t: 'Tritura hasta la textura que quieras.' },
    { vacia: true, t: 'Sirve.' }
  ],
  tip: 'Para una sopa aún más fina, tritura otro minuto. Añade copos de chile para un toque picante.'
},
{
  id: 'coliflor-curry', cat: 'sopas',
  nombre: 'Crema de coliflor al curry',
  raciones: '3-4', racionesNum: 4, prep: 10, coccion: 35, dificultad: 'Fácil', programa: 'PRE-COOK & SMOOTH SOUP',
  principal: 'coliflor', tags: ['vegetariana', 'suave'],
  limiteMl: 1400,
  ing: [
    { c: 2, u: 'cda', n: 'mantequilla' },
    { c: 2, u: 'cda', n: 'aceite de oliva virgen extra' },
    { c: 1.5, u: 'cdta', n: 'cilantro molido' },
    { c: 1, u: 'ud', n: 'cebolla mediana, pelada y cortada en cuartos' },
    { c: 2, u: 'diente', n: 'ajo, pelados y partidos por la mitad' },
    { c: null, u: '', n: 'sal' },
    { c: 400, u: 'g', n: 'coliflor en ramilletes de 2,5 cm' },
    { c: 1, u: 'cdta', n: 'pasta de curry verde' },
    { c: 500, u: 'ml', n: 'caldo de verduras caliente' },
    { c: 60, u: 'ml', n: 'leche de coco' },
    { c: 1, u: 'cda', n: 'zumo de lima' },
    { c: null, u: '', n: 'pimienta al gusto' }
  ],
  pasos: [
    { add: [0, 1, 2, 3, 4, 5] },
    { b: 'CHOP', t: 'Unos segundos de pulsos y la cebolla queda picada, no hecha puré.' },
    { b: 'SAUTÉ', t: 'Cinco minutos de sofrito. Aquí es donde la sopa coge el sabor.' },
    { add: [6, 7, 8, 9, 10, 11], t: 'Añade el resto de ingredientes.' },
    { b: 'SMOOTH SOUP', t: 'Se calienta hasta que arranca a hervir, va removiendo sola y remata triturando: sale ya como crema.' },
    { vacia: true, t: 'Sirve con cuidado: la jarra está caliente.' }
  ]
},
{
  id: 'calabaza', cat: 'sopas',
  nombre: 'Crema de calabaza',
  raciones: '3-4', racionesNum: 4, prep: 15, coccion: 35, dificultad: 'Fácil', programa: 'PRE-COOK & SMOOTH SOUP',
  principal: 'calabaza', tags: ['vegetariana', 'vegana', 'suave'],
  limiteMl: 1400,
  ing: [
    { c: 2, u: 'cda', n: 'aceite de oliva' },
    { c: 1, u: 'ud', n: 'cebolla pequeña, pelada y cortada en cuartos' },
    { c: null, u: '', n: 'sal' },
    { c: 120, u: 'g', n: 'anacardos crudos' },
    { c: 0.5, u: 'ud', n: 'manzana, pelada, sin corazón y en cuartos' },
    { c: 1, u: 'ud', n: 'zanahoria pequeña, pelada y en cuartos' },
    { c: 460, u: 'g', n: 'calabaza cacahuete pelada, en trozos de 2,5 cm' },
    { c: 1, u: 'cdta', n: 'hojas de tomillo seco' },
    { c: 750, u: 'ml', n: 'caldo de verduras caliente' },
    { c: null, u: '', n: 'pimienta al gusto' }
  ],
  pasos: [
    { add: [0, 1, 2] },
    { b: 'CHOP', t: 'Unos segundos de pulsos y la cebolla queda picada, no hecha puré.' },
    { b: 'SAUTÉ', t: 'Cinco minutos de sofrito. Aquí es donde la sopa coge el sabor.' },
    { add: [3, 4, 5, 6, 7, 8, 9], t: 'Añade el resto de ingredientes.' },
    { b: 'SMOOTH SOUP', t: 'Se calienta hasta que arranca a hervir, va removiendo sola y remata triturando: sale ya como crema.' },
    { vacia: true, t: 'Sirve con cuidado: la jarra está caliente.' }
  ],
  nota: 'Esta receta es la que más se acerca a la línea HOT (1,4 L). No añadas líquido extra.'
},
{
  id: 'pollo-fideos', cat: 'sopas',
  nombre: 'Sopa de pollo con fideos',
  raciones: '3-4', racionesNum: 4, prep: 15, coccion: 30, dificultad: 'Fácil', programa: 'CHUNKY SOUP',
  principal: 'pollo', tags: ['trozos'],
  limiteMl: 1400,
  ing: [
    { c: 1, u: 'ud', n: 'cebolla pequeña, sin extremos, pelada y en trozos de 2,5 cm' },
    { c: 2, u: 'rama', n: 'apio, sin extremos, en trozos de 2,5 cm' },
    { c: 2, u: 'ud', n: 'zanahorias, sin extremos, peladas y en trozos de 2,5 cm' },
    { c: 875, u: 'ml', n: 'caldo de pollo caliente' },
    { c: 0.25, u: 'cdta', n: 'tomillo seco' },
    { c: 255, u: 'g', n: 'pollo crudo en trozos de 2,5 cm' },
    { c: null, u: '', n: 'sal y pimienta al gusto' },
    { c: 45, u: 'g', n: 'fideos de huevo secos' }
  ],
  pasos: [
    { add: [0, 1, 2, 3, 4, 5, 6], t: 'Introduce en la jarra todos los ingredientes EXCEPTO los fideos.' },
    { b: 'CHUNKY SOUP', t: 'Precalentará hasta hervir y después removerá con pulsos suaves.' },
    { add: [7], faltan: 6, t: 'Añade los fideos de huevo.', aviso: 'Al abrir sale vapor: manos en las pestañas exteriores y levanta la tapa en vertical.' },
    { vacia: true, t: 'Sirve inmediatamente.' }
  ]
},
{
  id: 'champinones', cat: 'sopas',
  nombre: 'Crema de champiñones',
  raciones: '3-4', racionesNum: 4, prep: 5, coccion: 20, dificultad: 'Media', programa: 'MANUAL',
  principal: 'champiñón', tags: ['vegetariana', 'suave'],
  limiteMl: 1400,
  ing: [
    { c: 1, u: 'cda', n: 'aceite de oliva' },
    { c: 3, u: 'ud', n: 'chalotas, peladas' },
    { c: 1, u: 'cdta', n: 'perejil seco' },
    { c: 1, u: 'cdta', n: 'tomillo seco' },
    { c: 50, u: 'g', n: 'shiitake laminado' },
    { c: 150, u: 'g', n: 'champiñón castaña laminado' },
    { c: 100, u: 'g', n: 'champiñón blanco laminado' },
    { c: 500, u: 'ml', n: 'caldo de verduras caliente' },
    { c: 150, u: 'ml', n: 'nata para montar' },
    { c: null, u: '', n: 'sal y pimienta al gusto' }
  ],
  pasos: [
    { add: [0, 1, 2, 3] },
    { b: 'CHOP', t: 'Unos segundos de pulsos y la cebolla queda picada, no hecha puré.' },
    { b: 'SAUTÉ', t: 'Cinco minutos de sofrito. Aquí es donde la sopa coge el sabor.' },
    { add: [4, 5, 6, 7, 8, 9], t: 'Añade el resto de ingredientes en el orden indicado.' },
    { b: 'COOK', sub: 'HIGH', min: 14, t: 'A fuego fuerte.', aviso: 'Pulsa PULSE de vez en cuando para repartir el calor (consejo del manual).' },
    { b: 'BLEND', sub: 'HIGH', min: 1, t: 'Tritura hasta la textura que quieras.' },
    { vacia: true, t: 'Sirve.' }
  ],
  tip: 'Para una crema aún más fina, tritura otro minuto.'
},
{
  id: 'puerro-patata', cat: 'sopas',
  nombre: 'Crema de puerro y patata',
  raciones: '3-4', racionesNum: 4, prep: 15, coccion: 20, dificultad: 'Media', programa: 'MANUAL',
  principal: 'patata', tags: ['vegetariana', 'suave'],
  limiteMl: 1400,
  ing: [
    { c: 2, u: 'cda', n: 'aceite de oliva' },
    { c: 2, u: 'diente', n: 'ajo' },
    { c: 1, u: 'ud', n: 'puerro sin la parte verde, en cuartos y lavado' },
    { c: null, u: '', n: 'sal y pimienta blanca al gusto' },
    { c: 2, u: 'ud', n: 'patatas blancas, peladas y en trozos de 2,5 cm' },
    { c: 500, u: 'ml', n: 'caldo de verduras caliente' },
    { c: 250, u: 'ml', n: 'nata para montar' }
  ],
  pasos: [
    { add: [0, 1, 2, 3] },
    { b: 'CHOP', t: 'Unos segundos de pulsos y la cebolla queda picada, no hecha puré.' },
    { b: 'SAUTÉ', t: 'Cinco minutos de sofrito. Aquí es donde la sopa coge el sabor.' },
    { add: [4, 5, 6], t: 'Cuando el programa haya terminado, añade el resto de ingredientes.' },
    { b: 'COOK', sub: 'HIGH', min: 14, t: 'A fuego fuerte.', aviso: 'Pulsa PULSE de vez en cuando para repartir el calor (consejo del manual).' },
    { b: 'BLEND', sub: 'HIGH', min: 1, t: 'Tritura hasta la textura que quieras.' },
    { vacia: true, t: 'Sirve.' }
  ],
  tip: 'Para una crema aún más fina, tritura otro minuto.'
},
{
  id: 'verduras-trozos', cat: 'sopas',
  nombre: 'Sopa de verduras con trozos',
  raciones: '3-4', racionesNum: 4, prep: 15, coccion: 30, dificultad: 'Fácil', programa: 'CHUNKY SOUP',
  principal: 'verduras', tags: ['vegetariana', 'vegana', 'trozos'],
  limiteMl: 1400,
  ing: [
    { c: 75, u: 'g', n: 'cebolla, pelada y en trozos de 2,5 cm' },
    { c: 75, u: 'g', n: 'zanahoria, pelada y en trozos de 2,5 cm' },
    { c: 75, u: 'g', n: 'apio en trozos de 2,5 cm' },
    { c: 115, u: 'g', n: 'boniato, pelado y en trozos de 2,5 cm' },
    { c: 115, u: 'g', n: 'calabacín en trozos de 2,5 cm' },
    { c: 30, u: 'g', n: 'espinaca baby' },
    { c: 75, u: 'g', n: 'maíz dulce congelado' },
    { c: 700, u: 'ml', n: 'caldo de verduras caliente' },
    { c: 0.75, u: 'cdta', n: 'sazonador italiano' },
    { c: null, u: '', n: 'sal y pimienta blanca al gusto' }
  ],
  pasos: [
    { add: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], t: 'Introduce todos los ingredientes en la jarra, en el orden indicado.' },
    { b: 'CHUNKY SOUP', t: 'Se calienta hasta hervir y luego da pulsos suaves cada poco. No tritura: los trozos quedan enteros.' },
    { vacia: true, t: 'Sirve con cuidado: la jarra está caliente.' }
  ]
},
{
  id: 'minestrone', cat: 'sopas',
  nombre: 'Minestrone de alubias blancas',
  raciones: 4, racionesNum: 4, prep: 15, coccion: 35, dificultad: 'Media', programa: 'PRE-COOK & CHUNKY SOUP',
  principal: 'alubias', tags: ['vegetariana', 'trozos'], sinUsar: [13, 14],
  limiteMl: 1400,
  ing: [
    { c: null, u: '', n: 'aceite de oliva (cantidad no indicada en la receta original)' },
    { c: 1, u: 'ud', n: 'cebolla pequeña, pelada y en trozos de 2,5 cm' },
    { c: 0.5, u: 'cda', n: 'ajo picado' },
    { c: null, u: '', n: 'sal' },
    { c: 90, u: 'g', n: 'tomate en lata' },
    { c: 120, u: 'g', n: 'hojas de kale' },
    { c: 2, u: 'cda', n: 'parmesano rallado' },
    { c: 750, u: 'ml', n: 'caldo de verduras caliente' },
    { c: 2, u: 'cdta', n: 'concentrado de tomate' },
    { c: 0.5, u: 'cdta', n: 'romero seco' },
    { c: 0.125, u: 'cdta', n: 'tomillo seco' },
    { c: null, u: '', n: 'pimienta negra al gusto' },
    { c: 1, u: 'lata', n: 'alubias cannellini (400 g), escurridas' },
    { c: 1, u: 'rama', n: 'apio en trozos de 2,5 cm' },
    { c: 1, u: 'ud', n: 'zanahoria, pelada y en trozos de 2,5 cm' }
  ],
  pasos: [
    { add: [0, 1, 2, 3], t: 'Introduce en la jarra el aceite de oliva, la cebolla, el ajo y la sal.' },
    { b: 'CHOP', t: 'Unos segundos de pulsos y la cebolla queda picada, no hecha puré.' },
    { b: 'SAUTÉ', t: 'Cinco minutos de sofrito. Aquí es donde la sopa coge el sabor.' },
    { add: [4, 5, 6, 7, 8, 9, 10, 11], t: 'Añade el tomate, el kale, el parmesano, el caldo, el concentrado de tomate, el romero, la pimienta negra y el tomillo.' },
    { b: 'CHUNKY SOUP', t: 'Precalentará hasta hervir y después removerá con pulsos suaves.' },
    { add: [12], faltan: 6, t: 'Añade las alubias blancas.', aviso: 'Al abrir sale vapor: manos en las pestañas exteriores y levanta la tapa en vertical.' },
    { b: 'CHUNKY SOUP', t: 'Coloca la tapa y reinicia el programa.' },
    { vacia: true, t: 'Sirve con cuidado: la jarra está caliente.' }
  ],
  discrepancia: 'Esta receta tiene dos cabos sueltos que preferimos dejar a la vista: el apio y la zanahoria están en la lista pero ningún paso dice cuándo entran, y el aceite del sofrito no lleva cantidad. Échale el aceite que te pida el sofrito y mete el apio y la zanahoria con el resto de la verdura.'
},
{
  id: 'plantilla-trozos', cat: 'sopas',
  nombre: 'Plantilla: sopa con trozos a tu gusto',
  raciones: '3-4', racionesNum: 4, prep: 10, coccion: 35, dificultad: 'Fácil', programa: 'PRE-COOK & CHUNKY SOUP',
  principal: 'a elegir', tags: ['trozos'], plantilla: true,
  limiteMl: 1400,
  ing: [
    { c: 2, u: 'cda', n: 'aceite o mantequilla en total (oliva, coco, mantequilla, aguacate o girasol)' },
    { c: 1, u: 'ud', n: 'cebolla pequeña o chalota, pelada y en cuartos' },
    { c: 3, u: 'cdta', n: 'especias y aromáticos en total (ajo, jengibre, tomillo, sal, pimienta, semillas de cilantro, semillas de comino, concentrado de tomate)' },
    { c: 230, u: 'g', n: 'verdura en total, en trozos de 2,5 cm (zanahoria, patata, boniato, coliflor, brócoli, tomate, calabaza, apio, espinaca, kale, maíz, pimiento)', mlForzado: 230 },
    { c: 125, u: 'g', n: 'proteína en total, en trozos de 2,5 cm — opcional (solomillo de ternera, pechuga de pollo, pechuga de pavo, lomo de cerdo, jamón)', mlForzado: 120 },
    { c: 750, u: 'ml', n: 'base líquida en total (agua, caldo de verduras, caldo de ternera, leche de coco, caldo de pollo, puré de tomate)' },
    { c: 75, u: 'g', n: 'pasta y/o legumbres en total — opcional, 38 g de cada una (macarrones, fideos de huevo, garbanzos, alubias blancas, alubias negras)', mlForzado: 70 }
  ],
  pasos: [
    { add: [0, 1, 2], t: 'Empieza por la base de sabor: grasa, cebolla y lo que aromatice.' },
    { b: 'CHOP', t: 'Unos segundos de pulsos y la cebolla queda picada, no hecha puré.' },
    { b: 'SAUTÉ', t: 'Cinco minutos de sofrito. Aquí es donde la sopa coge el sabor.' },
    { add: [3, 4, 5], t: 'Añade la verdura, la proteína (si la usas) y la base líquida.' },
    { b: 'CHUNKY SOUP', t: 'Se calienta hasta hervir y luego da pulsos suaves cada poco, para que cueza parejo.' },
    { add: [6], faltan: 6, t: 'Si usas legumbres, añádelas ahora. Si usas pasta, sigue el tiempo del paquete.' },
    { vacia: true, t: 'Sirve con cuidado: la jarra está caliente.' }
  ],
  nota: 'Es una plantilla, no una receta cerrada: eliges tú los ingredientes dentro de cada grupo. Respeta las cantidades totales para no superar la línea de 1,4 L.'
},
{
  id: 'plantilla-suave', cat: 'sopas',
  nombre: 'Plantilla: crema suave a tu gusto',
  raciones: '3-4', racionesNum: 4, prep: 10, coccion: 35, dificultad: 'Fácil', programa: 'PRE-COOK & SMOOTH SOUP',
  principal: 'a elegir', tags: ['suave'], plantilla: true,
  limiteMl: 1400,
  ing: [
    { c: 2, u: 'cda', n: 'aceite o mantequilla en total (oliva, coco, mantequilla, aguacate o girasol)' },
    { c: 1, u: 'ud', n: 'cebolla pequeña o chalota, pelada y en cuartos' },
    { c: 3, u: 'cdta', n: 'especias y aromáticos en total (ajo, jengibre, tomillo, sal, pimienta, semillas de cilantro, semillas de comino, concentrado de tomate)' },
    { c: 460, u: 'g', n: 'verdura en total, en trozos de 2,5 cm (zanahoria, patata, boniato, coliflor, brócoli, tomate, calabaza, apio, espinaca, kale, champiñón, maíz, pimiento)', mlForzado: 460 },
    { c: 1000, u: 'ml', n: 'base líquida en total (agua, caldo de verduras, caldo de ternera, leche de coco, caldo de pollo, puré de tomate)' }
  ],
  pasos: [
    { add: [0, 1, 2], t: 'Empieza por la base de sabor: grasa, cebolla y lo que aromatice.' },
    { b: 'CHOP', t: 'Unos segundos de pulsos y la cebolla queda picada, no hecha puré.' },
    { b: 'SAUTÉ', t: 'Cinco minutos de sofrito. Aquí es donde la sopa coge el sabor.' },
    { add: [3, 4], t: 'Añade la verdura y la base líquida.' },
    { b: 'SMOOTH SOUP', t: 'Se calienta hasta que arranca a hervir, va removiendo sola y remata triturando: sale ya como crema.' },
    { vacia: true, t: 'Sirve con cuidado: la jarra está caliente.' }
  ],
  tip: 'Un par de chorritos de nata al final del programa y queda mucho más cremosa.',
  nota: 'Es una plantilla, no una receta cerrada. Con 1 L de líquido se queda muy cerca de la línea de 1,4 L: no añadas de más, y si acaso completa al final.'
},
/* --------------------------------- SALSAS --------------------------------- */
{
  id: 'salsa-tomate', cat: 'salsas',
  nombre: 'Salsa de tomate tradicional',
  raciones: '4-6', racionesNum: 6, prep: 5, coccion: 35, dificultad: 'Fácil', programa: 'PRE-COOK & SAUCE',
  principal: 'tomate', tags: ['vegetariana', 'vegana'],
  limiteMl: 1400,
  ing: [
    { c: 1, u: 'cda', n: 'aceite de oliva' },
    { c: 1, u: 'ud', n: 'cebolla amarilla pequeña, pelada y en cuartos' },
    { c: 2, u: 'diente', n: 'ajo, pelados' },
    { c: null, u: '', n: 'sal y pimienta negra al gusto' },
    { c: 4, u: 'lata', n: 'tomate entero pelado (400 g cada lata)' },
    { c: 1, u: 'cdta', n: 'azúcar' },
    { c: 1, u: 'cdta', n: 'sazonador italiano' }
  ],
  pasos: [
    { add: [0, 1, 2, 3], t: 'Introduce en la jarra el aceite de oliva, la cebolla, el ajo, la pimienta negra y la sal.' },
    { b: 'CHOP', t: 'Unos segundos de pulsos y la cebolla queda picada, no hecha puré.' },
    { b: 'SAUTÉ', t: 'Cinco minutos de sofrito. Aquí es donde la sopa coge el sabor.' },
    { add: [4, 5, 6], t: 'Añade el resto de ingredientes SIN pasar de la línea HOT (1,4 L) de la jarra.' },
    { b: 'SAUCE', t: 'Media hora a fuego suave, removiendo sola. No hace falta que estés encima.' },
    { vacia: true, t: 'Sirve con cuidado: la jarra está caliente.' }
  ],
  discrepancia: 'Ojo con la cantidad: 4 latas de 400 g son ya 1,6 L solo de tomate, por encima de la línea de 1,4 L que no debes pasar con calor. Ve echando latas hasta la línea grabada y guarda lo que sobre; con tres latas suele quedar justo.'
},
{
  id: 'alfredo', cat: 'salsas',
  nombre: 'Salsa Alfredo',
  raciones: '6-8', racionesNum: 8, prep: 10, coccion: 35, dificultad: 'Fácil', programa: 'PRE-COOK & SAUCE',
  principal: 'nata', tags: ['vegetariana'],
  limiteMl: 1400,
  ing: [
    { c: 115, u: 'g', n: 'mantequilla' },
    { c: 4, u: 'diente', n: 'ajo, pelados' },
    { c: 500, u: 'ml', n: 'nata para montar' },
    { c: 250, u: 'g', n: 'queso crema, cortado en ocho trozos' },
    { c: 220, u: 'g', n: 'parmesano rallado' }
  ],
  pasos: [
    { add: [0, 1] },
    { b: 'CHOP', t: 'Unos segundos de pulsos y la cebolla queda picada, no hecha puré.' },
    { b: 'SAUTÉ', t: 'Cinco minutos de sofrito. Aquí es donde la sopa coge el sabor.' },
    { add: [2, 3, 4], t: 'Añade el resto de ingredientes.' },
    { b: 'SAUCE', t: 'Media hora a fuego suave, removiendo sola. No hace falta que estés encima.' },
    { vacia: true, t: 'Sirve con cuidado: la jarra está caliente.' }
  ]
},
{
  id: 'dip-espinacas', cat: 'salsas',
  nombre: 'Dip de espinacas y alcachofas',
  raciones: '6-8', racionesNum: 8, prep: 10, coccion: 30, dificultad: 'Fácil', programa: 'SAUCE',
  principal: 'espinacas', tags: ['vegetariana'],
  limiteMl: 1400,
  ing: [
    { c: 400, u: 'g', n: 'corazones de alcachofa de lata, escurridos y en cuartos' },
    { c: 2, u: 'diente', n: 'ajo' },
    { c: 2, u: 'cda', n: 'zumo de limón' },
    { c: 60, u: 'g', n: 'mayonesa' },
    { c: 60, u: 'ml', n: 'nata agria' },
    { c: 125, u: 'g', n: 'queso crema a temperatura ambiente, en cuartos' },
    { c: 375, u: 'g', n: 'espinaca congelada picada, descongelada y bien escurrida' },
    { c: 28, u: 'g', n: 'parmesano rallado' },
    { c: null, u: '', n: 'sal y pimienta al gusto' }
  ],
  pasos: [
    { add: [0, 1, 2, 3, 4, 5, 6, 7, 8], t: 'Introduce todos los ingredientes en la jarra, en el orden indicado.' },
    { b: 'SAUCE', t: 'Media hora a fuego suave, removiendo sola. No hace falta que estés encima.' },
    { vacia: true, t: 'Sirve con cuidado: la jarra está caliente.' }
  ]
},
/* ------------------------------- MERMELADAS ------------------------------- */
{
  id: 'mermelada-frutos-rojos', cat: 'mermelada',
  nombre: 'Mermelada de frutos rojos',
  raciones: '6-8', racionesNum: 8, prep: 5, coccion: 30, reposo: 240, dificultad: 'Fácil', programa: 'CHOP & JAM',
  principal: 'frutos rojos', tags: ['vegetariana', 'vegana'],
  limiteMl: 1400,
  ing: [
    { c: 335, u: 'g', n: 'arándanos frescos' },
    { c: 150, u: 'g', n: 'moras frescas' },
    { c: 4, u: 'cda', n: 'zumo de limón' },
    { c: 350, u: 'g', n: 'azúcar' },
    { c: 20, u: 'ml', n: 'pectina' }
  ],
  pasos: [
    { add: [0, 1, 2, 3, 4], t: 'Introduce todos los ingredientes en la jarra.' },
    { b: 'CHOP', t: 'Unos segundos de pulsos y la cebolla queda picada, no hecha puré.' },
    { b: 'JAM', t: 'Media hora cociendo la fruta con el azúcar hasta que coge cuerpo.' },
    { vacia: true, t: 'Saca la mermelada de la jarra y déjala enfriar en la nevera al menos 4 horas antes de usarla.' }
  ]
},
{
  id: 'mermelada-fresa', cat: 'mermelada',
  nombre: 'Mermelada de fresa',
  raciones: '6-8', racionesNum: 8, prep: 10, coccion: 30, reposo: 240, dificultad: 'Fácil', programa: 'CHOP & JAM',
  principal: 'fresa', tags: ['vegetariana', 'vegana'],
  limiteMl: 1400,
  ing: [
    { c: 450, u: 'g', n: 'fresas frescas, sin el rabito' },
    { c: 210, u: 'g', n: 'azúcar' },
    { c: 1, u: 'cda', n: 'zumo de limón' },
    { c: 2, u: 'cdta', n: 'pectina' }
  ],
  pasos: [
    { add: [0, 1, 2, 3], t: 'Introduce todos los ingredientes en la jarra.' },
    { b: 'CHOP', t: 'Unos segundos de pulsos y la cebolla queda picada, no hecha puré.' },
    { b: 'JAM', t: 'Media hora cociendo la fruta con el azúcar hasta que coge cuerpo.' },
    { vacia: true, t: 'Saca la mermelada de la jarra y déjala enfriar en la nevera al menos 4 horas antes de usarla.' }
  ]
},
/* ----------------------------- BEBIDAS FRÍAS ------------------------------ */
{
  id: 'margarita-mango', cat: 'frias',
  nombre: 'Margarita de mango helada',
  raciones: 4, racionesNum: 4, prep: 5, coccion: 1, dificultad: 'Fácil', programa: 'FROZEN DRINK',
  principal: 'mango', tags: ['vegetariana', 'vegana', 'fria', 'alcohol'],
  limiteMl: 1600,
  ing: [
    { c: 250, u: 'ml', n: 'tequila' },
    { c: 125, u: 'ml', n: 'triple seco' },
    { c: 500, u: 'ml', n: 'zumo de mango' },
    { c: 560, u: 'g', n: 'mango congelado en trozos' },
    { c: 2, u: 'cda', n: 'zumo de lima' }
  ],
  pasos: [
    { add: [0, 1, 2, 3, 4], t: 'Introduce todos los ingredientes en la jarra.' },
    { b: 'FROZEN DRINK', t: 'Un minuto rompiendo el hielo y la fruta hasta dejarlo granizado.' },
    { vacia: true, t: 'Sirve.' }
  ]
},
{
  id: 'froze-fresa', cat: 'frias',
  nombre: 'Frozé de fresa',
  raciones: 4, racionesNum: 4, prep: 5, coccion: 1, dificultad: 'Fácil', programa: 'FROZEN DRINK',
  principal: 'fresa', tags: ['vegetariana', 'vegana', 'fria', 'alcohol'],
  limiteMl: 1600,
  ing: [
    { c: 750, u: 'ml', n: 'vino rosado' },
    { c: 12, u: 'hoja', n: 'menta fresca' },
    { c: 600, u: 'g', n: 'fresas congeladas' }
  ],
  pasos: [
    { add: [0, 1, 2], t: 'Introduce todos los ingredientes en la jarra, en el orden indicado.' },
    { b: 'FROZEN DRINK', t: 'Un minuto rompiendo el hielo y la fruta hasta dejarlo granizado.' },
    { vacia: true, t: 'Sirve.' }
  ]
},
{
  id: 'smoothie-frutos-rojos', cat: 'frias',
  nombre: 'Smoothie de frutos rojos',
  raciones: 4, racionesNum: 4, prep: 5, coccion: 1, dificultad: 'Fácil', programa: 'SMOOTHIE',
  principal: 'frutos rojos', tags: ['vegetariana', 'fria'],
  limiteMl: 1600,
  ing: [
    { c: 500, u: 'g', n: 'yogur' },
    { c: 250, u: 'ml', n: 'leche de almendras' },
    { c: 2, u: 'cacito', n: 'proteína en polvo' },
    { c: 560, u: 'g', n: 'frutos rojos congelados' }
  ],
  pasos: [
    { add: [0, 1, 2, 3], t: 'Introduce todos los ingredientes en la jarra.' },
    { b: 'SMOOTHIE', t: 'Menos de un minuto alternando pulsos y velocidad alta.' },
    { vacia: true, t: 'Sirve.' }
  ]
},
{
  id: 'smoothie-fresa-pina', cat: 'frias',
  nombre: 'Smoothie de fresa y piña',
  raciones: 4, racionesNum: 4, prep: 5, coccion: 1, dificultad: 'Fácil', programa: 'SMOOTHIE',
  principal: 'fresa', tags: ['vegetariana', 'vegana', 'fria'],
  limiteMl: 1600,
  ing: [
    { c: 300, u: 'g', n: 'fresas congeladas' },
    { c: 400, u: 'g', n: 'piña en trozos' },
    { c: 1, u: 'ud', n: 'plátano, pelado' },
    { c: 250, u: 'ml', n: 'zumo de naranja' }
  ],
  pasos: [
    { add: [0, 1, 2, 3], t: 'Introduce todos los ingredientes en la jarra.' },
    { b: 'SMOOTHIE', t: 'Menos de un minuto alternando pulsos y velocidad alta.' },
    { vacia: true, t: 'Sirve.' }
  ]
},
{
  id: 'batido-vainilla', cat: 'frias',
  nombre: 'Batido de vainilla',
  raciones: 4, racionesNum: 4, prep: 5, coccion: 1, dificultad: 'Fácil', programa: 'MILKSHAKE',
  principal: 'vainilla', tags: ['vegetariana', 'fria'],
  limiteMl: 1600,
  ing: [
    { c: 130, u: 'g', n: 'cubitos de hielo' },
    { c: 750, u: 'ml', n: 'helado de vainilla' },
    { c: 250, u: 'ml', n: 'leche entera' },
    { c: 0.125, u: 'cdta', n: 'extracto de vainilla' }
  ],
  pasos: [
    { add: [0, 1, 2, 3], t: 'Introduce todos los ingredientes en la jarra.' },
    { b: 'MILKSHAKE', t: 'Un minuto batiendo hasta que hace espuma.' },
    { vacia: true, t: 'Sirve.' }
  ]
},
{
  id: 'batido-chocolate', cat: 'frias',
  nombre: 'Batido de chocolate',
  raciones: 4, racionesNum: 4, prep: 5, coccion: 1, dificultad: 'Fácil', programa: 'MILKSHAKE',
  principal: 'chocolate', tags: ['vegetariana', 'fria'],
  limiteMl: 1600,
  ing: [
    { c: 130, u: 'g', n: 'cubitos de hielo' },
    { c: 750, u: 'ml', n: 'helado de chocolate' },
    { c: 250, u: 'ml', n: 'leche entera' },
    { c: 60, u: 'ml', n: 'sirope de chocolate' }
  ],
  pasos: [
    { add: [0, 1, 2, 3], t: 'Introduce todos los ingredientes en la jarra.' },
    { b: 'MILKSHAKE', t: 'Un minuto batiendo hasta que hace espuma.' },
    { vacia: true, t: 'Sirve.' }
  ]
},
{
  id: 'chocolate-helado', cat: 'frias',
  nombre: 'Chocolate caliente helado',
  raciones: 4, racionesNum: 4, prep: 5, coccion: 6, dificultad: 'Media', programa: 'PRE-COOK & FROZEN DRINK',
  principal: 'chocolate', tags: ['vegetariana', 'fria'],
  limiteMl: 1600,
  ing: [
    { c: 375, u: 'g', n: 'chips de chocolate con leche' },
    { c: 250, u: 'ml', n: 'leche entera' },
    { c: 2, u: 'cda', n: 'cacao en polvo' },
    { c: 125, u: 'ml', n: 'nata para montar' },
    { c: 650, u: 'g', n: 'hielo' }
  ],
  pasos: [
    { add: [0, 1, 2], t: 'Introduce en la jarra el chocolate, la leche y el cacao en polvo.' },
    { b: 'CHOP', t: 'Unos segundos de pulsos y la cebolla queda picada, no hecha puré.' },
    { b: 'SAUTÉ', t: 'Cinco minutos de sofrito. Aquí es donde la sopa coge el sabor.' },
    { add: [3, 4], t: 'Cuando el programa haya terminado, añade la nata y el hielo.', aviso: 'La jarra está caliente: usa manoplas y agárrala solo por el asa.' },
    { b: 'FROZEN DRINK', t: 'Un minuto rompiendo el hielo y la fruta hasta dejarlo granizado.' },
    { vacia: true, t: 'Sirve.' }
  ]
},
/* ---------------------------- BEBIDAS CALIENTES --------------------------- */
{
  id: 'chocolate-cacahuete', cat: 'calientes',
  nombre: 'Chocolate caliente con crema de cacahuete',
  raciones: '6-8', racionesNum: 8, prep: 5, coccion: 20, dificultad: 'Media', programa: 'MANUAL',
  principal: 'chocolate', tags: ['vegetariana', 'caliente'],
  limiteMl: 1400,
  ing: [
    { c: 750, u: 'ml', n: 'leche entera' },
    { c: 250, u: 'ml', n: 'nata líquida' },
    { c: 250, u: 'g', n: 'chips de chocolate con leche' },
    { c: 4, u: 'cda', n: 'crema de cacahuete suave' },
    { c: null, u: '', n: 'mini nubes, para decorar', fuera: true },
    { c: null, u: '', n: 'sirope de chocolate, para decorar', fuera: true }
  ],
  pasos: [
    { add: [0, 1, 2, 3], t: 'Introduce en la jarra la leche, la nata líquida, los chips de chocolate y la crema de cacahuete.' },
    { b: 'COOK', sub: 'MED', min: 20, t: 'A fuego medio.' },
    { b: 'PULSE', min: 5, t: 'Remueve con un pulso corto. Repítelo cada 5 minutos mientras cuece.' },
    { add: [4, 5], vacia: true, t: 'Sirve y decora con mini nubes y sirope de chocolate, al gusto.' }
  ]
},
/* --------------------------------- POSTRES -------------------------------- */
{
  id: 'fondue-chocolate', cat: 'postres',
  nombre: 'Fondue de chocolate',
  raciones: '6-8', racionesNum: 8, prep: 5, coccion: 30, dificultad: 'Fácil', programa: 'SAUCE',
  principal: 'chocolate', tags: ['vegetariana', 'caliente'],
  limiteMl: 1400,
  ing: [
    { c: 375, u: 'g', n: 'chips de chocolate negro' },
    { c: 250, u: 'ml', n: 'nata para montar' },
    { c: null, u: '', n: 'pretzels, para mojar', fuera: true },
    { c: null, u: '', n: 'nubes, para mojar', fuera: true },
    { c: null, u: '', n: 'fresas enteras, para mojar', fuera: true }
  ],
  pasos: [
    { add: [0, 1], t: 'Introduce en la jarra los chips de chocolate y la nata.' },
    { b: 'PULSE', t: 'Cinco pulsos cortos para romper el chocolate.' },
    { b: 'SAUCE', t: 'Media hora a fuego suave, removiendo sola. No hace falta que estés encima.' },
    { vacia: true, t: 'Sirve la fondue caliente con pretzels, nubes, fresas u otra fruta, al gusto.' }
  ]
},
{
  id: 'helado-arandanos', cat: 'postres',
  nombre: 'Helado de arándanos y vainilla',
  raciones: 4, racionesNum: 4, prep: 5, coccion: 1, reposo: 15, dificultad: 'Fácil', programa: 'DESSERT',
  principal: 'arándanos', tags: ['vegetariana'],
  limiteMl: 1600,
  ing: [
    { c: 95, u: 'g', n: 'chips de chocolate blanco' },
    { c: 180, u: 'ml', n: 'nata líquida' },
    { c: 1, u: 'cdta', n: 'extracto de vainilla' },
    { c: 2, u: 'cda', n: 'zumo de limón' },
    { c: 420, u: 'g', n: 'arándanos congelados' }
  ],
  pasos: [
    { add: [0, 1, 2, 3, 4], t: 'Introduce todos los ingredientes en la jarra, en el orden indicado.' },
    { b: 'DESSERT', t: 'Un minuto hasta que coge textura de helado.' },
    { t: 'Con el programa en marcha, empuja con el tamper hacia las cuchillas. Va en el hueco del tapón central, con la tapa puesta.' },
    { vacia: true, t: 'Saca el helado de la jarra y mételo en el congelador al menos 15 minutos antes de servir.' }
  ]
},
{
  id: 'sorbete-pina-coco', cat: 'postres',
  nombre: 'Sorbete de piña y coco',
  raciones: 4, racionesNum: 4, prep: 5, coccion: 1, reposo: 15, dificultad: 'Fácil', programa: 'DESSERT',
  principal: 'piña', tags: ['vegetariana', 'vegana'],
  limiteMl: 1600,
  ing: [
    { c: 400, u: 'g', n: 'piña congelada en trozos' },
    { c: 2, u: 'ud', n: 'plátanos maduros pequeños, congelados' },
    { c: 2, u: 'cda', n: 'zumo de lima fresco' },
    { c: 250, u: 'ml', n: 'leche de coco light' },
    { c: 2, u: 'cda', n: 'néctar de agave' },
    { c: 1, u: 'cdta', n: 'jengibre fresco rallado' }
  ],
  pasos: [
    { add: [0, 1, 2, 3, 4, 5], t: 'Introduce todos los ingredientes en la jarra, en el orden indicado.' },
    { b: 'DESSERT', t: 'Un minuto hasta que coge textura de helado.' },
    { t: 'Con el programa en marcha, empuja con el tamper hacia las cuchillas.' },
    { vacia: true, t: 'Saca el sorbete de la jarra y mételo en el congelador al menos 15 minutos antes de servir.' }
  ]
},
{
  id: 'helado-menta', cat: 'postres',
  nombre: 'Helado de vainilla y menta',
  raciones: 4, racionesNum: 4, prep: 5, coccion: 1, reposo: 15, dificultad: 'Media', programa: 'DESSERT',
  principal: 'menta', tags: ['vegetariana'],
  limiteMl: 1600,
  ing: [
    { c: 500, u: 'ml', n: 'nata para montar' },
    { c: 250, u: 'ml', n: 'leche evaporada' },
    { c: 10, u: 'ud', n: 'caramelos redondos de menta' },
    { c: 4, u: 'cda', n: 'azúcar glas' },
    { c: 0.5, u: 'cdta', n: 'extracto de menta' },
    { c: 250, u: 'ml', n: 'leche entera' }
  ],
  pasos: [
    { add: [0, 1], t: 'Mezcla la nata con la leche evaporada. Viértelo en cubiteras y congela 8 horas o toda la noche.' },
    { add: [2, 3, 4, 5], t: 'Introduce en la jarra los caramelos de menta, el azúcar glas, el extracto de menta, la leche entera y los cubitos de nata congelada.' },
    { b: 'DESSERT', t: 'Un minuto hasta que coge textura de helado.' },
    { t: 'Con el programa en marcha, empuja con el tamper hacia las cuchillas.' },
    { vacia: true, t: 'Saca el helado de la jarra y mételo en el congelador al menos 15 minutos antes de servir.' }
  ],
  nota: 'Esta receta necesita 8 horas de congelación previa de la mezcla de nata y leche evaporada.'
},
/* --------------------- SALTEADOS / PREPARACIONES PREVIAS ------------------- */
{
  id: 'base-sofrito', cat: 'previas',
  nombre: 'Base de sabor: sofrito con CHOP + SAUTÉ',
  raciones: '3-4', racionesNum: 4, prep: 5, coccion: 6, dificultad: 'Fácil', programa: 'PRE-COOK',
  principal: 'cebolla', tags: ['vegetariana', 'vegana'], tecnica: true,
  limiteMl: 1400,
  ing: [
    { c: 2, u: 'cda', n: 'aceite o mantequilla en total (oliva, coco, mantequilla, aguacate o girasol)' },
    { c: 1, u: 'ud', n: 'cebolla pequeña o chalota, pelada y en cuartos' },
    { c: 3, u: 'cdta', n: 'especias y aromáticos en total (ajo, jengibre, tomillo, sal, pimienta, semillas de cilantro, semillas de comino, concentrado de tomate)' }
  ],
  pasos: [
    { add: [0, 1, 2], t: 'Introduce en la jarra el aceite o la mantequilla, la cebolla y las especias y aromáticos.' },
    { b: 'CHOP', t: 'Unos segundos de pulsos y la cebolla queda picada, no hecha puré.' },
    { b: 'SAUTÉ', t: 'Cinco minutos de sofrito. Aquí es donde la sopa coge el sabor.' },
    { t: 'Ya tienes la base. Añade encima las verduras y el caldo y continúa con SMOOTH SOUP, CHUNKY SOUP o SAUCE, según la receta.' }
  ],
  nota: 'No es un plato, es el arranque: la base de sabor que usan casi todas las sopas y salsas de la app. Después le añades la verdura y el caldo.'
}
];
