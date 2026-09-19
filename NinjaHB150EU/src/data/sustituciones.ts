/* Sustituciones habituales, con el matiz de cómo afectan a ESTE aparato:
   lo que importa aquí es si cambia el volumen o el comportamiento al cocer. */

export type Sustitucion = { en: RegExp; opciones: { por: string; nota?: string }[] };

export const SUSTITUCIONES: Sustitucion[] = [
  { en: /nata para montar|nata líquida/, opciones: [
    { por: 'Leche evaporada', nota: 'Mismo volumen, menos grasa: queda menos untuoso.' },
    { por: 'Leche de coco', nota: 'Mismo volumen. Aporta sabor propio, va bien en cremas de curry.' },
    { por: 'Anacardos remojados triturados', nota: 'Opción vegana. Suma volumen: descuéntalo del caldo.' },
  ]},
  { en: /mantequilla/, opciones: [
    { por: 'Aceite de oliva', nota: 'Misma cantidad. En SAUTÉ aguanta mejor el calor.' },
  ]},
  { en: /caldo de pollo/, opciones: [
    { por: 'Caldo de verduras', nota: 'Directo, mismo volumen. Hace la receta vegetariana.' },
    { por: 'Agua y media pastilla', nota: 'Sala menos al principio y corrige al final.' },
  ]},
  { en: /leche entera/, opciones: [
    { por: 'Bebida de avena', nota: 'Mismo volumen. Espesa un poco más al calentar.' },
  ]},
  { en: /queso crema/, opciones: [
    { por: 'Queso fresco batido', nota: 'Mismo volumen, más ligero. Puede cortarse si hierve fuerte.' },
  ]},
  { en: /azúcar/, opciones: [
    { por: 'Miel', nota: 'Usa un 25 % menos. En JAM espesa antes, vigila el final.' },
  ]},
  { en: /pectina/, opciones: [
    { por: 'Manzana rallada', nota: 'Una manzana aporta pectina natural. Ocupa sitio: réstalo de la fruta.' },
  ]},
  { en: /fresas? congeladas?|frutos rojos congelados/, opciones: [
    { por: 'Fruta fresca y un puñado de hielo', nota: 'El hielo ocupa más: no llenes hasta la línea.' },
  ]},
  { en: /anacardos?/, opciones: [
    { por: 'Almendra cruda', nota: 'Mismo peso. Queda algo más granulosa.' },
  ]},
  { en: /vino rosado|tequila|triple seco/, opciones: [
    { por: 'Zumo o refresco sin alcohol', nota: 'Mismo volumen. Quita el alcohol de la receta.' },
  ]},
];

export function sustitucionesDe(nombre: string) {
  const n = nombre.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  return SUSTITUCIONES.find((s) => s.en.test(n))?.opciones ?? [];
}
