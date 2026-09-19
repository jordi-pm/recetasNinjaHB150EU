/* «Me ha salido mal» — lo que de verdad pasa cuando cocinas con una sopera.
   Son causas mecánicas del aparato, no consejos de cocina genéricos. */

export type Sintoma = {
  id: string;
  titulo: string;
  emoji: string;
  causas: { porque: string; haz: string }[];
};

export const SINTOMAS: Sintoma[] = [
  {
    id: 'espeso',
    titulo: 'Ha quedado demasiado espeso',
    emoji: '🥄',
    causas: [
      { porque: 'Poco líquido para la cantidad de verdura.', haz: 'Añade caldo caliente poco a poco y vuelve a triturar con BLEND en LOW, subiendo si hace falta.' },
      { porque: 'La verdura tenía poca agua (patata, boniato, legumbre).', haz: 'Cuenta con un 10-15 % más de líquido la próxima vez con esos ingredientes.' },
    ],
  },
  {
    id: 'aguado',
    titulo: 'Ha quedado aguado',
    emoji: '💧',
    causas: [
      { porque: 'Demasiado caldo, o la verdura soltó mucha agua.', haz: 'Vuelve a poner COOK en HIGH sin tapar del todo y deja que reduzca 10 minutos, pulsando PULSE de vez en cuando.' },
      { porque: 'Mediste el líquido antes de meter la verdura.', haz: 'Echa el líquido al final, hasta la línea, en vez de medirlo aparte.' },
    ],
  },
  {
    id: 'trozos',
    titulo: 'No ha triturado bien, quedan trozos',
    emoji: '🫘',
    causas: [
      { porque: 'Los trozos eran mayores de 2,5 cm.', haz: 'Córtalos más pequeños: es la causa más habitual.' },
      { porque: 'Usaste el programa de sopa con trozos.', haz: 'CHUNKY SOUP no tritura a propósito. Para crema fina usa SMOOTH SOUP.' },
      { porque: 'Faltaba líquido para que girase el remolino.', haz: 'Añade caldo y dale otro minuto de BLEND en HIGH.' },
    ],
  },
  {
    id: 'pegado',
    titulo: 'Se ha pegado o sabe a quemado',
    emoji: '🔥',
    causas: [
      { porque: 'Ingredientes con azúcar o lácteos al fondo sin líquido.', haz: 'Mete siempre primero la grasa y el líquido, y lo dulce después.' },
      { porque: 'Cocción manual larga sin remover.', haz: 'En COOK manual, pulsa PULSE cada pocos minutos para repartir el calor.' },
      { porque: 'Quedó residuo de una preparación anterior.', haz: 'Usa el programa CLEAN nada más terminar, con 700 ml de agua y dos gotas de lavavajillas.' },
    ],
  },
  {
    id: 'desborda',
    titulo: 'Se ha salido por la tapa',
    emoji: '🌋',
    causas: [
      { porque: 'Pasaste de la línea de llenado.', haz: 'Con calor no superes la línea marcada HOT. Es la causa número uno de desbordes.' },
      { porque: 'Ingredientes que hacen espuma (legumbre, leche, patata).', haz: 'Déjalo un dedo por debajo de la línea y añade una gota de aceite.' },
    ],
  },
  {
    id: 'no-arranca',
    titulo: 'No arranca o se para sola',
    emoji: '⚠️',
    causas: [
      { porque: 'La tapa o el tapón no están bien cerrados.', haz: 'Gira la tapa hasta que las flechas coincidan y encaja el tapón central.' },
      { porque: 'La jarra no está bien asentada en la base.', haz: 'Levántala y vuelve a colocarla girando el acople hasta que entre del todo.' },
      { porque: 'Motor sobrecalentado por exceso de carga.', haz: 'Desenchufa y deja enfriar unos 15 minutos. Después reduce la cantidad.' },
    ],
  },
  {
    id: 'soso',
    titulo: 'Sabe soso',
    emoji: '🧂',
    causas: [
      { porque: 'Te saltaste el sofrito.', haz: 'CHOP y SAUTÉ antes del caldo cambian el resultado más que cualquier especia.' },
      { porque: 'Sal añadida al final.', haz: 'Sala con el sofrito: la sal trabaja mejor desde el principio.' },
    ],
  },
];
