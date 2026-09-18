/* Datos verificados contra:
   - Manual: "HB150UK Series INSTRUCTIONS – Blender & Soup Maker", SharkNinja, HB150UK_IB_MP_190828_Mv1 (ninjakitchen.eu)
   - Recetario: "Blender & Soup Maker – INSPIRATION GUIDE", SharkNinja, HB150UK_IG_25Recipe_MP_200622_Mv1
   Ninguna receta procede de Air Fryer, Multicooker, Creami ni de otros modelos Ninja. */

const MAQUINA = {
  modelo: 'Ninja Foodi Blender & Soup Maker HB150EU',
  potencia: '1000 W · 220-240 V, 50-60 Hz',
  jarra: 'Jarra de cristal de 1,7 L con elemento calefactor integrado',
  piezas: [
    ['A', 'Tapa de la jarra con tapón central extraíble'],
    ['B', 'Jarra de cristal de 1,7 L con elemento calefactor integrado'],
    ['C', 'Base motora'],
    ['D', 'Tamper (empujador)'],
    ['E', 'Cepillo de limpieza']
  ],
  programas: [
    { b: 'SMOOTHIE',     seccion: 'BLEND',    calor: false, dur: '45 s',  d: 'Combina tus ingredientes frescos o congelados, líquidos y polvos favoritos.' },
    { b: 'DESSERT',      seccion: 'BLEND',    calor: false, dur: '1 min', d: 'Usa fruta congelada y lácteos para hacer sorbetes y postres helados.' },
    { b: 'FROZEN DRINK', seccion: 'BLEND',    calor: false, dur: '1 min', d: 'Tritura hielo y fruta congelada para bebidas heladas de coctelería.' },
    { b: 'MILKSHAKE',    seccion: 'BLEND',    calor: false, dur: '1 min', d: 'Bate leche y tus sabores favoritos para un batido espumoso.' },
    { b: 'SMOOTH SOUP',  seccion: 'COOK',     calor: true,  dur: '≈30 min', d: 'Cocina y tritura tus cremas suaves favoritas.' },
    { b: 'CHUNKY SOUP',  seccion: 'COOK',     calor: true,  dur: '≈30 min', d: 'Prepara sopa casera con más textura.' },
    { b: 'JAM',          seccion: 'COOK',     calor: true,  dur: '≈30 min', d: 'Haz tus propias mermeladas con textura, o cuélalas después para un resultado fino.' },
    { b: 'SAUCE',        seccion: 'COOK',     calor: true,  dur: '≈30 min', d: 'Crea salsas dulces o saladas y fondues.' },
    { b: 'CHOP',         seccion: 'PRE-COOK', calor: false, dur: 'unos segundos', d: 'Pica rápidamente los ingredientes antes de hacer sopas, salsas y dips.' },
    { b: 'SAUTÉ',        seccion: 'PRE-COOK', calor: true,  dur: '≈5 min', d: 'Saca más sabor cocinando cebolla, ajo, especias y más antes de hacer una sopa, salsa o dip.' }
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
    ['Accesorios', 'Usa SOLO los accesorios suministrados con el producto o recomendados por SharkNinja. Otros accesorios, incluidos tarros de conserva, pueden provocar incendio, descarga eléctrica o lesiones.'],
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
    'Los programas Auto-iQ no permiten cambiar tiempo ni temperatura: están fijados por Ninja. Para elegir temperatura, usa el ajuste manual COOK.',
    'Si retiras la tapa con un programa en marcha, la cocción o el triturado se pausan. Vuelve a poner la tapa y pulsa otra vez el botón del programa para continuar donde se quedó.',
    'Los programas Auto-iQ cuentan hacia atrás; los modos manuales cuentan hacia arriba desde 0.',
    'El panel vuelve al modo de espera tras 3 minutos de inactividad.',
    'Aviso de removido: 3 pitidos seguidos de 2 segundos de pausa antes de cada removido, en todos los programas Auto-iQ.',
    'Consejo del manual: en recetas espesas como helados y dips, usa el tamper para empujar los ingredientes hacia las cuchillas.',
    'Consejo del manual (COOK manual): pulsa PULSE periódicamente durante la cocción para repartir el calor y cocinar de forma uniforme.'
  ],
  discrepancias: [
    { t: 'SAUTE / SAUTÉ', d: 'La página de funciones del manual imprime el botón como SAUTE (sin tilde) y el recetario oficial lo escribe SAUTÉ. Es el mismo botón. En la app se usa SAUTÉ.' },
    { t: 'Duración del COOK manual', d: 'La página de funciones del manual dice que COOK funciona “60 minutos o hasta que se pare manualmente”, pero la página de instrucciones dice “el temporizador contará hasta 60 segundos”. Las recetas oficiales cocinan 14–20 minutos en COOK, coherente con los 60 minutos. La app usa 60 minutos y señala la contradicción en lugar de resolverla.' },
    { t: 'Capacidad de la jarra', d: 'La jarra se describe como de 1,7 L, pero las líneas grabadas que el manual manda respetar son 1,4 L (HOT / sopa) y 1,6 L (COLD). La app usa siempre 1,4 L y 1,6 L como límites.' },
    { t: 'HB150EU vs HB150UK', d: 'El manual y el recetario oficiales que Ninja publica para este aparato están editados como “HB150UK Series” en ninjakitchen.eu; el HB150EU es la misma máquina con enchufe europeo, y las fichas oficiales del HB150EU listan exactamente los mismos 10 programas Auto-iQ y las mismas capacidades (1,7 L en frío / 1,4 L en caliente). Comprueba siempre los nombres contra el panel de tu unidad.' },
    { t: 'Modelos NO incluidos', d: 'El modelo estadounidense HB150 lleva otros programas (EXTRACT, ICE CREAM, HEARTY SOUP, SAUCE/DIP). Esos nombres NO existen en tu panel y ninguna receta de la app los usa.' }
  ]
};

const CATEGORIAS = [
  { id: 'sopas',    emoji: '🥣', nombre: 'Sopas y cremas' },
  { id: 'frias',    emoji: '🥤', nombre: 'Smoothies y bebidas frías' },
  { id: 'calientes',emoji: '☕', nombre: 'Bebidas calientes' },
  { id: 'salsas',   emoji: '🍅', nombre: 'Salsas' },
  { id: 'mermelada',emoji: '🍓', nombre: 'Mermeladas' },
  { id: 'postres',  emoji: '🍨', nombre: 'Postres' },
  { id: 'previas',  emoji: '🧅', nombre: 'Salteados / preparaciones previas' }
];

const FUENTE_GUIA = { nombre: 'Ninja — Blender & Soup Maker, Inspiration Guide (recetario oficial)', ref: 'HB150UK_IG_25Recipe_MP_200622_Mv1', url: 'https://euronics.a.bigcontent.io/v1/static/307HB150UK_recipebook' };
const FUENTE_MANUAL = { nombre: 'Ninja — HB150UK Series Instructions, Blender & Soup Maker (manual oficial)', ref: 'HB150UK_IB_MP_190828_Mv1', url: 'https://m.media-amazon.com/images/I/B18r3XHlkaL.pdf' };

/* c = cantidad, u = unidad, n = nombre, esc:false = no se escala */
const RECETAS = [
/* ---------------------------------- SOPAS --------------------------------- */
{
  id: 'tomate-albahaca', cat: 'sopas', foto: 'fotos/tomate-albahaca.jpg',
  nombre: 'Sopa de tomate y albahaca', original: 'Tomato & Basil Soup',
  raciones: 4, prep: 5, coccion: 20, dificultad: 'Media', programa: 'MANUAL',
  principal: 'tomate', tags: ['vegetariana', 'suave'], pag: 11,
  cargaMl: 1255, limiteMl: 1400,
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
    { b: 'CHOP', t: 'Pulsa CHOP y espera a que termine.' },
    { b: 'SAUTÉ', t: 'Pulsa SAUTÉ y espera a que termine (unos 5 minutos).' },
    { add: [3, 4, 5, 6, 7], t: 'Añade el resto de ingredientes en el orden indicado.' },
    { b: 'COOK', sub: 'HIGH', t: 'Pulsa COOK y después HIGH. Cocina 14 minutos.' },
    { b: 'BLEND', sub: 'HIGH', t: 'Pulsa BLEND y después HIGH. Tritura 1 minuto, o hasta la textura que quieras.' },
    { t: 'Sirve.' }
  ],
  tip: 'Para una sopa aún más fina, tritura otro minuto. Añade copos de chile para un toque picante.'
},
{
  id: 'coliflor-curry', cat: 'sopas', foto: 'fotos/coliflor-curry.jpg',
  nombre: 'Crema de coliflor al curry', original: 'Curry Cauliflower Soup',
  raciones: '3-4', prep: 10, coccion: 35, dificultad: 'Fácil', programa: 'PRE-COOK & SMOOTH SOUP',
  principal: 'coliflor', tags: ['vegetariana', 'suave'], pag: 12,
  cargaMl: 1180, limiteMl: 1400,
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
    { b: 'CHOP', t: 'Pulsa CHOP y espera a que termine.' },
    { b: 'SAUTÉ', t: 'Pulsa SAUTÉ y espera a que termine.' },
    { add: [6, 7, 8, 9, 10, 11], t: 'Añade el resto de ingredientes.' },
    { b: 'SMOOTH SOUP', t: 'Pulsa SMOOTH SOUP y espera a que termine el programa.' },
    { t: 'Sirve con cuidado: la jarra está caliente.' }
  ]
},
{
  id: 'calabaza', cat: 'sopas', foto: 'fotos/calabaza.jpg',
  nombre: 'Crema de calabaza', original: 'Butternut Squash Soup',
  raciones: '3-4', prep: 15, coccion: 35, dificultad: 'Fácil', programa: 'PRE-COOK & SMOOTH SOUP',
  principal: 'calabaza', tags: ['vegetariana', 'vegana', 'suave'], pag: 13,
  cargaMl: 1390, limiteMl: 1400,
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
    { b: 'CHOP', t: 'Pulsa CHOP y espera a que termine.' },
    { b: 'SAUTÉ', t: 'Pulsa SAUTÉ y espera a que termine.' },
    { add: [3, 4, 5, 6, 7, 8, 9], t: 'Añade el resto de ingredientes.' },
    { b: 'SMOOTH SOUP', t: 'Pulsa SMOOTH SOUP y espera a que termine el programa.' },
    { t: 'Sirve con cuidado: la jarra está caliente.' }
  ],
  nota: 'Esta receta es la que más se acerca a la línea HOT (1,4 L). No añadas líquido extra.'
},
{
  id: 'pollo-fideos', cat: 'sopas', foto: 'fotos/pollo-fideos.jpg',
  nombre: 'Sopa de pollo con fideos', original: 'Chicken Noodle Soup',
  raciones: '3-4', prep: 15, coccion: 30, dificultad: 'Fácil', programa: 'CHUNKY SOUP',
  principal: 'pollo', tags: ['trozos'], pag: 14,
  cargaMl: 1350, limiteMl: 1400,
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
    { b: 'CHUNKY SOUP', t: 'Pulsa CHUNKY SOUP.' },
    { add: [7], t: 'Cuando falten 6 minutos para terminar el programa, abre y añade los fideos de huevo. Cuidado con el vapor.' },
    { t: 'Sirve inmediatamente.' }
  ]
},
{
  id: 'champinones', cat: 'sopas', foto: 'fotos/champinones.jpg',
  nombre: 'Crema de champiñones', original: 'Mushroom Soup',
  raciones: '3-4', prep: 5, coccion: 20, dificultad: 'Media', programa: 'MANUAL',
  principal: 'champiñón', tags: ['vegetariana', 'suave'], pag: 15,
  cargaMl: 1080, limiteMl: 1400,
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
    { b: 'CHOP', t: 'Pulsa CHOP y espera a que termine.' },
    { b: 'SAUTÉ', t: 'Pulsa SAUTÉ y espera a que termine.' },
    { add: [4, 5, 6, 7, 8, 9], t: 'Añade el resto de ingredientes en el orden indicado.' },
    { b: 'COOK', sub: 'HIGH', t: 'Pulsa COOK y después HIGH. Cocina 14 minutos.' },
    { b: 'BLEND', sub: 'HIGH', t: 'Pulsa BLEND y después HIGH. Tritura 1 minuto, o hasta la textura que quieras.' },
    { t: 'Sirve.' }
  ],
  tip: 'Para una crema aún más fina, tritura otro minuto.'
},
{
  id: 'puerro-patata', cat: 'sopas', foto: 'fotos/puerro-patata.jpg',
  nombre: 'Crema de puerro y patata', original: 'Leek & Potato Soup',
  raciones: '3-4', prep: 15, coccion: 20, dificultad: 'Media', programa: 'MANUAL',
  principal: 'patata', tags: ['vegetariana', 'suave'], pag: 16,
  cargaMl: 1230, limiteMl: 1400,
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
    { b: 'CHOP', t: 'Pulsa CHOP y espera a que termine.' },
    { b: 'SAUTÉ', t: 'Pulsa SAUTÉ y espera a que termine.' },
    { add: [4, 5, 6], t: 'Cuando el programa haya terminado, añade el resto de ingredientes.' },
    { b: 'COOK', sub: 'HIGH', t: 'Pulsa COOK y después HIGH. Cocina 14 minutos.' },
    { b: 'BLEND', sub: 'HIGH', t: 'Pulsa BLEND y después HIGH. Tritura 1 minuto, o hasta la textura que quieras.' },
    { t: 'Sirve.' }
  ],
  tip: 'Para una crema aún más fina, tritura otro minuto.'
},
{
  id: 'verduras-trozos', cat: 'sopas', foto: 'fotos/verduras-trozos.jpg',
  nombre: 'Sopa de verduras con trozos', original: 'Chunky Vegetable Soup',
  raciones: '3-4', prep: 15, coccion: 30, dificultad: 'Fácil', programa: 'CHUNKY SOUP',
  principal: 'verduras', tags: ['vegetariana', 'vegana', 'trozos'], pag: 17,
  cargaMl: 1235, limiteMl: 1400,
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
    { b: 'CHUNKY SOUP', t: 'Pulsa CHUNKY SOUP y espera a que termine el programa.' },
    { t: 'Sirve con cuidado: la jarra está caliente.' }
  ]
},
{
  id: 'minestrone', cat: 'sopas', foto: 'fotos/minestrone.jpg',
  nombre: 'Minestrone de alubias blancas', original: 'White Bean Minestrone',
  raciones: 4, prep: 15, coccion: 35, dificultad: 'Media', programa: 'PRE-COOK & CHUNKY SOUP',
  principal: 'alubias', tags: ['vegetariana', 'trozos'], pag: 19,
  cargaMl: 1380, limiteMl: 1400,
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
    { b: 'CHOP', t: 'Pulsa CHOP y espera a que termine.' },
    { b: 'SAUTÉ', t: 'Pulsa SAUTÉ y espera a que termine.' },
    { add: [4, 5, 6, 7, 8, 9, 10, 11], t: 'Añade el tomate, el kale, el parmesano, el caldo, el concentrado de tomate, el romero, la pimienta negra y el tomillo.' },
    { b: 'CHUNKY SOUP', t: 'Pulsa CHUNKY SOUP.' },
    { add: [12], t: 'Cuando falten 6 minutos para terminar el programa, añade las alubias blancas. Cuidado con el vapor.' },
    { b: 'CHUNKY SOUP', t: 'Coloca la tapa y pulsa CHUNKY SOUP otra vez para reiniciar el programa.' },
    { t: 'Sirve con cuidado: la jarra está caliente.' }
  ],
  discrepancia: 'La receta oficial tiene incoherencias: la lista de ingredientes incluye apio y zanahoria que no aparecen en los pasos; los pasos mencionan aceite de oliva sin darlo en la lista, y piden añadir “garbanzos” que tampoco figuran en la lista. Aquí se reproduce tal cual, sin inventar cantidades: usa el aceite que necesites para el sofrito y omite los garbanzos, o añádelos junto a las alubias bajo tu criterio.'
},
{
  id: 'plantilla-trozos', cat: 'sopas', foto: null,
  nombre: 'Plantilla oficial: sopa con trozos a tu gusto', original: 'How to Create Custom Chunky Soups',
  raciones: '3-4', prep: 10, coccion: 35, dificultad: 'Fácil', programa: 'PRE-COOK & CHUNKY SOUP',
  principal: 'a elegir', tags: ['trozos'], pag: 7, plantilla: true,
  cargaMl: 1300, limiteMl: 1400,
  ing: [
    { c: 2, u: 'cda', n: 'aceite o mantequilla en total (oliva, coco, mantequilla, aguacate o girasol)' },
    { c: 1, u: 'ud', n: 'cebolla pequeña o chalota, pelada y en cuartos' },
    { c: 3, u: 'cdta', n: 'especias y aromáticos en total (ajo, jengibre, tomillo, sal, pimienta, semillas de cilantro, semillas de comino, concentrado de tomate)' },
    { c: 230, u: 'g', n: 'verdura en total, en trozos de 2,5 cm (zanahoria, patata, boniato, coliflor, brócoli, tomate, calabaza, apio, espinaca, kale, maíz, pimiento)' },
    { c: 125, u: 'g', n: 'proteína en total, en trozos de 2,5 cm — opcional (solomillo de ternera, pechuga de pollo, pechuga de pavo, lomo de cerdo, jamón)' },
    { c: 750, u: 'ml', n: 'base líquida en total (agua, caldo de verduras, caldo de ternera, leche de coco, caldo de pollo, puré de tomate)' },
    { c: 75, u: 'g', n: 'pasta y/o legumbres en total — opcional, 38 g de cada una (macarrones, fideos de huevo, garbanzos, alubias blancas, alubias negras)' }
  ],
  pasos: [
    { add: [0, 1, 2], t: 'Construye el sabor: introduce el aceite o la mantequilla, la cebolla y las especias y aromáticos.' },
    { b: 'CHOP', t: 'Pulsa CHOP. La batidora picará groseramente los aromáticos.' },
    { b: 'SAUTÉ', t: 'Pulsa SAUTÉ. La batidora cocinará 5 minutos para liberar el sabor de los aromáticos.' },
    { add: [3, 4, 5], t: 'Añade la verdura, la proteína (si la usas) y la base líquida.' },
    { b: 'CHUNKY SOUP', t: 'Pulsa CHUNKY SOUP. La batidora precalentará hasta hervir y después removerá con pulsos suaves para cocinar de forma uniforme.' },
    { add: [6], t: 'Si usas legumbres, añádelas cuando falten 6 minutos de programa. Si usas pasta, sigue el tiempo de cocción del paquete.' },
    { t: 'Sirve con cuidado: la jarra está caliente.' }
  ],
  nota: 'Plantilla oficial del recetario Ninja (páginas 6–7), no una receta cerrada. Respeta las cantidades totales indicadas para no superar la línea HOT de 1,4 L.'
},
{
  id: 'plantilla-suave', cat: 'sopas', foto: null,
  nombre: 'Plantilla oficial: crema suave a tu gusto', original: 'How to Create Custom Smooth Soups',
  raciones: '3-4', prep: 10, coccion: 35, dificultad: 'Fácil', programa: 'PRE-COOK & SMOOTH SOUP',
  principal: 'a elegir', tags: ['suave'], pag: 9, plantilla: true,
  cargaMl: 1380, limiteMl: 1400,
  ing: [
    { c: 2, u: 'cda', n: 'aceite o mantequilla en total (oliva, coco, mantequilla, aguacate o girasol)' },
    { c: 1, u: 'ud', n: 'cebolla pequeña o chalota, pelada y en cuartos' },
    { c: 3, u: 'cdta', n: 'especias y aromáticos en total (ajo, jengibre, tomillo, sal, pimienta, semillas de cilantro, semillas de comino, concentrado de tomate)' },
    { c: 460, u: 'g', n: 'verdura en total, en trozos de 2,5 cm (zanahoria, patata, boniato, coliflor, brócoli, tomate, calabaza, apio, espinaca, kale, champiñón, maíz, pimiento)' },
    { c: 1000, u: 'ml', n: 'base líquida en total (agua, caldo de verduras, caldo de ternera, leche de coco, caldo de pollo, puré de tomate)' }
  ],
  pasos: [
    { add: [0, 1, 2], t: 'Construye el sabor: introduce el aceite o la mantequilla, la cebolla y las especias y aromáticos.' },
    { b: 'CHOP', t: 'Pulsa CHOP. La batidora picará groseramente los aromáticos.' },
    { b: 'SAUTÉ', t: 'Pulsa SAUTÉ. La batidora cocinará 5 minutos para liberar el sabor de los aromáticos.' },
    { add: [3, 4], t: 'Añade la verdura y la base líquida.' },
    { b: 'SMOOTH SOUP', t: 'Pulsa SMOOTH SOUP. La batidora precalentará hasta hervir, removerá para cocinar de forma uniforme y después lo triturará hasta dejar una crema fina.' },
    { t: 'Sirve con cuidado: la jarra está caliente.' }
  ],
  tip: 'Consejo oficial: añade un par de chorritos de nata al final del programa para una textura más cremosa.',
  nota: 'Plantilla oficial del recetario Ninja (páginas 8–9), no una receta cerrada. Con 1 L de base líquida esta plantilla queda muy cerca de la línea HOT de 1,4 L: no añadas líquido de más.'
},
/* --------------------------------- SALSAS --------------------------------- */
{
  id: 'salsa-tomate', cat: 'salsas', foto: 'fotos/salsa-tomate.jpg',
  nombre: 'Salsa de tomate tradicional', original: 'Traditional Tomato Sauce',
  raciones: '4-6', prep: 5, coccion: 35, dificultad: 'Fácil', programa: 'PRE-COOK & SAUCE',
  principal: 'tomate', tags: ['vegetariana', 'vegana'], pag: 21,
  cargaMl: 1750, limiteMl: 1400,
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
    { b: 'CHOP', t: 'Pulsa CHOP y espera a que termine.' },
    { b: 'SAUTÉ', t: 'Pulsa SAUTÉ y espera a que termine.' },
    { add: [4, 5, 6], t: 'Añade el resto de ingredientes SIN pasar de la línea HOT (1,4 L) de la jarra.' },
    { b: 'SAUCE', t: 'Pulsa SAUCE y espera a que termine el programa.' },
    { t: 'Sirve con cuidado: la jarra está caliente.' }
  ],
  discrepancia: 'La receta oficial pide 4 latas de 400 g de tomate (unos 1,6 L solo de tomate), pero el manual prohíbe pasar de la línea HOT de 1,4 L en los modos con calor. La app NO resuelve la contradicción por su cuenta: fíjate en la línea grabada de tu jarra y reduce la cantidad de tomate hasta no superarla.'
},
{
  id: 'alfredo', cat: 'salsas', foto: 'fotos/alfredo.jpg',
  nombre: 'Salsa Alfredo', original: 'Alfredo Sauce',
  raciones: '6-8', prep: 10, coccion: 35, dificultad: 'Fácil', programa: 'PRE-COOK & SAUCE',
  principal: 'nata', tags: ['vegetariana'], pag: 22,
  cargaMl: 1085, limiteMl: 1400,
  ing: [
    { c: 115, u: 'g', n: 'mantequilla' },
    { c: 4, u: 'diente', n: 'ajo, pelados' },
    { c: 500, u: 'ml', n: 'nata para montar' },
    { c: 250, u: 'g', n: 'queso crema, cortado en ocho trozos' },
    { c: 220, u: 'g', n: 'parmesano rallado' }
  ],
  pasos: [
    { add: [0, 1] },
    { b: 'CHOP', t: 'Pulsa CHOP y espera a que termine.' },
    { b: 'SAUTÉ', t: 'Pulsa SAUTÉ y espera a que termine.' },
    { add: [2, 3, 4], t: 'Añade el resto de ingredientes.' },
    { b: 'SAUCE', t: 'Pulsa SAUCE y espera a que termine el programa.' },
    { t: 'Sirve con cuidado: la jarra está caliente.' }
  ]
},
{
  id: 'dip-espinacas', cat: 'salsas', foto: 'fotos/dip-espinacas.jpg',
  nombre: 'Dip de espinacas y alcachofas', original: 'Spinach & Artichoke Dip',
  raciones: '6-8', prep: 10, coccion: 30, dificultad: 'Fácil', programa: 'SAUCE',
  principal: 'espinacas', tags: ['vegetariana'], pag: 23,
  cargaMl: 1120, limiteMl: 1400,
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
    { b: 'SAUCE', t: 'Pulsa SAUCE y espera a que termine el programa.' },
    { t: 'Sirve con cuidado: la jarra está caliente.' }
  ]
},
/* ------------------------------- MERMELADAS ------------------------------- */
{
  id: 'mermelada-frutos-rojos', cat: 'mermelada', foto: 'fotos/mermelada-frutos-rojos.jpg',
  nombre: 'Mermelada de frutos rojos', original: 'Mixed Berry Jam',
  raciones: '6-8', prep: 5, coccion: 30, reposo: 240, dificultad: 'Fácil', programa: 'CHOP & JAM',
  principal: 'frutos rojos', tags: ['vegetariana', 'vegana'], pag: 24,
  cargaMl: 900, limiteMl: 1400,
  ing: [
    { c: 335, u: 'g', n: 'arándanos frescos' },
    { c: 150, u: 'g', n: 'moras frescas' },
    { c: 4, u: 'cda', n: 'zumo de limón' },
    { c: 350, u: 'g', n: 'azúcar' },
    { c: 20, u: 'ml', n: 'pectina' }
  ],
  pasos: [
    { add: [0, 1, 2, 3, 4], t: 'Introduce todos los ingredientes en la jarra.' },
    { b: 'CHOP', t: 'Pulsa CHOP y espera a que termine.' },
    { b: 'JAM', t: 'Pulsa JAM y espera a que termine el programa.' },
    { t: 'Saca la mermelada de la jarra y déjala enfriar en la nevera al menos 4 horas antes de usarla.' }
  ]
},
{
  id: 'mermelada-fresa', cat: 'mermelada', foto: 'fotos/mermelada-fresa.jpg',
  nombre: 'Mermelada de fresa', original: 'Simple Berry Jam',
  raciones: '6-8', prep: 10, coccion: 30, reposo: 240, dificultad: 'Fácil', programa: 'CHOP & JAM',
  principal: 'fresa', tags: ['vegetariana', 'vegana'], pag: 25,
  cargaMl: 720, limiteMl: 1400,
  ing: [
    { c: 450, u: 'g', n: 'fresas frescas, sin el rabito' },
    { c: 210, u: 'g', n: 'azúcar' },
    { c: 1, u: 'cda', n: 'zumo de limón' },
    { c: 2, u: 'cdta', n: 'pectina' }
  ],
  pasos: [
    { add: [0, 1, 2, 3], t: 'Introduce todos los ingredientes en la jarra.' },
    { b: 'CHOP', t: 'Pulsa CHOP y espera a que termine.' },
    { b: 'JAM', t: 'Pulsa JAM y espera a que termine el programa.' },
    { t: 'Saca la mermelada de la jarra y déjala enfriar en la nevera al menos 4 horas antes de usarla.' }
  ]
},
/* ----------------------------- BEBIDAS FRÍAS ------------------------------ */
{
  id: 'margarita-mango', cat: 'frias', foto: 'fotos/margarita-mango.jpg',
  nombre: 'Margarita de mango helada', original: 'Frozen Mango Margarita',
  raciones: 4, prep: 5, coccion: 1, dificultad: 'Fácil', programa: 'FROZEN DRINK',
  principal: 'mango', tags: ['vegetariana', 'vegana', 'fria', 'alcohol'], pag: 27,
  cargaMl: 1465, limiteMl: 1600,
  ing: [
    { c: 250, u: 'ml', n: 'tequila' },
    { c: 125, u: 'ml', n: 'triple seco' },
    { c: 500, u: 'ml', n: 'zumo de mango' },
    { c: 560, u: 'g', n: 'mango congelado en trozos' },
    { c: 2, u: 'cda', n: 'zumo de lima' }
  ],
  pasos: [
    { add: [0, 1, 2, 3, 4], t: 'Introduce todos los ingredientes en la jarra.' },
    { b: 'FROZEN DRINK', t: 'Pulsa FROZEN DRINK y espera a que termine el programa.' },
    { t: 'Sirve.' }
  ]
},
{
  id: 'froze-fresa', cat: 'frias', foto: 'fotos/froze-fresa.jpg',
  nombre: 'Frozé de fresa', original: 'Strawberry Frozé',
  raciones: 4, prep: 5, coccion: 1, dificultad: 'Fácil', programa: 'FROZEN DRINK',
  principal: 'fresa', tags: ['vegetariana', 'vegana', 'fria', 'alcohol'], pag: 28,
  cargaMl: 1350, limiteMl: 1600,
  ing: [
    { c: 750, u: 'ml', n: 'vino rosado' },
    { c: 12, u: 'hoja', n: 'menta fresca' },
    { c: 600, u: 'g', n: 'fresas congeladas' }
  ],
  pasos: [
    { add: [0, 1, 2], t: 'Introduce todos los ingredientes en la jarra, en el orden indicado.' },
    { b: 'FROZEN DRINK', t: 'Pulsa FROZEN DRINK y espera a que termine el programa.' },
    { t: 'Sirve.' }
  ]
},
{
  id: 'smoothie-frutos-rojos', cat: 'frias', foto: 'fotos/smoothie-frutos-rojos.jpg',
  nombre: 'Smoothie de frutos rojos', original: 'Morning Berry Smoothie',
  raciones: 4, prep: 5, coccion: 1, dificultad: 'Fácil', programa: 'SMOOTHIE',
  principal: 'frutos rojos', tags: ['vegetariana', 'fria'], pag: 29,
  cargaMl: 1380, limiteMl: 1600,
  ing: [
    { c: 500, u: 'g', n: 'yogur' },
    { c: 250, u: 'ml', n: 'leche de almendras' },
    { c: 2, u: 'cacito', n: 'proteína en polvo' },
    { c: 560, u: 'g', n: 'frutos rojos congelados' }
  ],
  pasos: [
    { add: [0, 1, 2, 3], t: 'Introduce todos los ingredientes en la jarra.' },
    { b: 'SMOOTHIE', t: 'Pulsa SMOOTHIE y espera a que termine el programa (unos 45 segundos).' },
    { t: 'Sirve.' }
  ]
},
{
  id: 'smoothie-fresa-pina', cat: 'frias', foto: 'fotos/smoothie-fresa-pina.jpg',
  nombre: 'Smoothie de fresa y piña', original: 'Strawberry Pineapple Morning Blast',
  raciones: 4, prep: 5, coccion: 1, dificultad: 'Fácil', programa: 'SMOOTHIE',
  principal: 'fresa', tags: ['vegetariana', 'vegana', 'fria'], pag: 30,
  cargaMl: 1080, limiteMl: 1600,
  ing: [
    { c: 300, u: 'g', n: 'fresas congeladas' },
    { c: 400, u: 'g', n: 'piña en trozos' },
    { c: 1, u: 'ud', n: 'plátano, pelado' },
    { c: 250, u: 'ml', n: 'zumo de naranja' }
  ],
  pasos: [
    { add: [0, 1, 2, 3], t: 'Introduce todos los ingredientes en la jarra.' },
    { b: 'SMOOTHIE', t: 'Pulsa SMOOTHIE y espera a que termine el programa (unos 45 segundos).' },
    { t: 'Sirve.' }
  ]
},
{
  id: 'batido-vainilla', cat: 'frias', foto: null,
  nombre: 'Batido de vainilla', original: 'Vanilla Milkshake',
  raciones: 4, prep: 5, coccion: 1, dificultad: 'Fácil', programa: 'MILKSHAKE',
  principal: 'vainilla', tags: ['vegetariana', 'fria'], pag: 31,
  cargaMl: 1130, limiteMl: 1600,
  ing: [
    { c: 130, u: 'g', n: 'cubitos de hielo' },
    { c: 750, u: 'ml', n: 'helado de vainilla' },
    { c: 250, u: 'ml', n: 'leche entera' },
    { c: 0.125, u: 'cdta', n: 'extracto de vainilla' }
  ],
  pasos: [
    { add: [0, 1, 2, 3], t: 'Introduce todos los ingredientes en la jarra.' },
    { b: 'MILKSHAKE', t: 'Pulsa MILKSHAKE y espera a que termine el programa.' },
    { t: 'Sirve.' }
  ]
},
{
  id: 'batido-chocolate', cat: 'frias', foto: null,
  nombre: 'Batido de chocolate', original: 'Chocolate Milkshake Morning Blast',
  raciones: 4, prep: 5, coccion: 1, dificultad: 'Fácil', programa: 'MILKSHAKE',
  principal: 'chocolate', tags: ['vegetariana', 'fria'], pag: 31,
  cargaMl: 1190, limiteMl: 1600,
  ing: [
    { c: 130, u: 'g', n: 'cubitos de hielo' },
    { c: 750, u: 'ml', n: 'helado de chocolate' },
    { c: 250, u: 'ml', n: 'leche entera' },
    { c: 60, u: 'ml', n: 'sirope de chocolate' }
  ],
  pasos: [
    { add: [0, 1, 2, 3], t: 'Introduce todos los ingredientes en la jarra.' },
    { b: 'MILKSHAKE', t: 'Pulsa MILKSHAKE y espera a que termine el programa.' },
    { t: 'Sirve.' }
  ]
},
{
  id: 'chocolate-helado', cat: 'frias', foto: 'fotos/chocolate-helado.jpg',
  nombre: 'Chocolate caliente helado', original: 'Frozen Hot Chocolate',
  raciones: 4, prep: 5, coccion: 6, dificultad: 'Media', programa: 'PRE-COOK & FROZEN DRINK',
  principal: 'chocolate', tags: ['vegetariana', 'fria'], pag: 34,
  cargaMl: 1450, limiteMl: 1600,
  ing: [
    { c: 375, u: 'g', n: 'chips de chocolate con leche' },
    { c: 250, u: 'ml', n: 'leche entera' },
    { c: 2, u: 'cda', n: 'cacao en polvo' },
    { c: 125, u: 'ml', n: 'nata para montar' },
    { c: 650, u: 'g', n: 'hielo' }
  ],
  pasos: [
    { add: [0, 1, 2], t: 'Introduce en la jarra el chocolate, la leche y el cacao en polvo.' },
    { b: 'CHOP', t: 'Pulsa CHOP y espera a que termine.' },
    { b: 'SAUTÉ', t: 'Pulsa SAUTÉ y espera a que termine.' },
    { add: [3, 4], t: 'Cuando el programa haya terminado, añade la nata y el hielo. Cuidado: la jarra está caliente.' },
    { b: 'FROZEN DRINK', t: 'Pulsa FROZEN DRINK y espera a que termine el programa.' },
    { t: 'Sirve.' }
  ]
},
/* ---------------------------- BEBIDAS CALIENTES --------------------------- */
{
  id: 'chocolate-cacahuete', cat: 'calientes', foto: 'fotos/chocolate-cacahuete.jpg',
  nombre: 'Chocolate caliente con crema de cacahuete', original: 'Peanut Butter Hot Chocolate',
  raciones: '6-8', prep: 5, coccion: 20, dificultad: 'Media', programa: 'MANUAL',
  principal: 'chocolate', tags: ['vegetariana', 'caliente'], pag: 35,
  cargaMl: 1310, limiteMl: 1400,
  ing: [
    { c: 750, u: 'ml', n: 'leche entera' },
    { c: 250, u: 'ml', n: 'nata líquida' },
    { c: 250, u: 'g', n: 'chips de chocolate con leche' },
    { c: 4, u: 'cda', n: 'crema de cacahuete suave' },
    { c: null, u: '', n: 'mini nubes, para decorar' },
    { c: null, u: '', n: 'sirope de chocolate, para decorar' }
  ],
  pasos: [
    { add: [0, 1, 2, 3], t: 'Introduce en la jarra la leche, la nata líquida, los chips de chocolate y la crema de cacahuete.' },
    { b: 'COOK', sub: 'MED', t: 'Pulsa COOK y después MED. Deja cocinar 20 minutos.' },
    { b: 'PULSE', t: 'Pulsa PULSE cada 5 minutos durante la cocción para remover.' },
    { add: [4, 5], t: 'Sirve y decora con mini nubes y sirope de chocolate, al gusto.' }
  ]
},
/* --------------------------------- POSTRES -------------------------------- */
{
  id: 'fondue-chocolate', cat: 'postres', foto: 'fotos/fondue-chocolate.jpg',
  nombre: 'Fondue de chocolate', original: 'Chocolate Fondue',
  raciones: '6-8', prep: 5, coccion: 30, dificultad: 'Fácil', programa: 'SAUCE',
  principal: 'chocolate', tags: ['vegetariana', 'caliente'], pag: 33,
  cargaMl: 625, limiteMl: 1400,
  ing: [
    { c: 375, u: 'g', n: 'chips de chocolate negro' },
    { c: 250, u: 'ml', n: 'nata para montar' },
    { c: null, u: '', n: 'pretzels, para mojar' },
    { c: null, u: '', n: 'nubes, para mojar' },
    { c: null, u: '', n: 'fresas enteras, para mojar' }
  ],
  pasos: [
    { add: [0, 1], t: 'Introduce en la jarra los chips de chocolate y la nata.' },
    { b: 'PULSE', t: 'Pulsa PULSE 5 veces.' },
    { b: 'SAUCE', t: 'Pulsa SAUCE y espera a que termine el programa.' },
    { t: 'Sirve la fondue caliente con pretzels, nubes, fresas u otra fruta, al gusto.' }
  ]
},
{
  id: 'helado-arandanos', cat: 'postres', foto: 'fotos/helado-arandanos.jpg',
  nombre: 'Helado de arándanos y vainilla', original: 'Blueberry Vanilla Freeze',
  raciones: 4, prep: 5, coccion: 1, reposo: 15, dificultad: 'Fácil', programa: 'DESSERT',
  principal: 'arándanos', tags: ['vegetariana'], pag: 36,
  cargaMl: 740, limiteMl: 1600,
  ing: [
    { c: 95, u: 'g', n: 'chips de chocolate blanco' },
    { c: 180, u: 'ml', n: 'nata líquida' },
    { c: 1, u: 'cdta', n: 'extracto de vainilla' },
    { c: 2, u: 'cda', n: 'zumo de limón' },
    { c: 420, u: 'g', n: 'arándanos congelados' }
  ],
  pasos: [
    { add: [0, 1, 2, 3, 4], t: 'Introduce todos los ingredientes en la jarra, en el orden indicado.' },
    { b: 'DESSERT', t: 'Pulsa DESSERT.' },
    { t: 'Mientras el programa está en marcha, usa el tamper para empujar los ingredientes hacia las cuchillas. El tamper solo se usa con la tapa puesta, sustituyendo al tapón central.' },
    { t: 'Saca el helado de la jarra y mételo en el congelador al menos 15 minutos antes de servir.' }
  ]
},
{
  id: 'sorbete-pina-coco', cat: 'postres', foto: 'fotos/sorbete-pina-coco.jpg',
  nombre: 'Sorbete de piña y coco', original: 'Coconut Pineapple Sorbet',
  raciones: 4, prep: 5, coccion: 1, reposo: 15, dificultad: 'Fácil', programa: 'DESSERT',
  principal: 'piña', tags: ['vegetariana', 'vegana'], pag: 37,
  cargaMl: 940, limiteMl: 1600,
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
    { b: 'DESSERT', t: 'Pulsa DESSERT.' },
    { t: 'Mientras el programa está en marcha, usa el tamper para empujar los ingredientes hacia las cuchillas.' },
    { t: 'Saca el sorbete de la jarra y mételo en el congelador al menos 15 minutos antes de servir.' }
  ]
},
{
  id: 'helado-menta', cat: 'postres', foto: 'fotos/helado-menta.jpg',
  nombre: 'Helado de vainilla y menta', original: 'Vanilla Peppermint Ice Cream',
  raciones: 4, prep: 5, coccion: 1, reposo: 15, dificultad: 'Media', programa: 'DESSERT',
  principal: 'menta', tags: ['vegetariana'], pag: 39,
  cargaMl: 1100, limiteMl: 1600,
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
    { b: 'DESSERT', t: 'Pulsa DESSERT.' },
    { t: 'Mientras el programa está en marcha, usa el tamper para empujar los ingredientes hacia las cuchillas.' },
    { t: 'Saca el helado de la jarra y mételo en el congelador al menos 15 minutos antes de servir.' }
  ],
  nota: 'Esta receta necesita 8 horas de congelación previa de la mezcla de nata y leche evaporada.'
},
/* --------------------- SALTEADOS / PREPARACIONES PREVIAS ------------------- */
{
  id: 'base-sofrito', cat: 'previas', foto: null,
  nombre: 'Base de sabor: sofrito con CHOP + SAUTÉ', original: 'First: Build Flavour (Custom Soups)',
  raciones: '3-4', prep: 5, coccion: 6, dificultad: 'Fácil', programa: 'PRE-COOK',
  principal: 'cebolla', tags: ['vegetariana', 'vegana'], pag: 7, tecnica: true,
  cargaMl: 250, limiteMl: 1400,
  ing: [
    { c: 2, u: 'cda', n: 'aceite o mantequilla en total (oliva, coco, mantequilla, aguacate o girasol)' },
    { c: 1, u: 'ud', n: 'cebolla pequeña o chalota, pelada y en cuartos' },
    { c: 3, u: 'cdta', n: 'especias y aromáticos en total (ajo, jengibre, tomillo, sal, pimienta, semillas de cilantro, semillas de comino, concentrado de tomate)' }
  ],
  pasos: [
    { add: [0, 1, 2], t: 'Introduce en la jarra el aceite o la mantequilla, la cebolla y las especias y aromáticos.' },
    { b: 'CHOP', t: 'Pulsa CHOP. La batidora picará groseramente los aromáticos.' },
    { b: 'SAUTÉ', t: 'Pulsa SAUTÉ. La batidora cocinará 5 minutos para liberar el sabor de los aromáticos.' },
    { t: 'Ya tienes la base. Añade encima las verduras y el caldo y continúa con SMOOTH SOUP, CHUNKY SOUP o SAUCE, según la receta.' }
  ],
  nota: 'Es la primera mitad (“FIRST — BUILD FLAVOUR”) de las plantillas oficiales de sopa del recetario Ninja, páginas 6–9. Es la preparación previa que usan casi todas las recetas de sopa y salsa de esta app.'
}
];
