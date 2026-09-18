import type { ImageSourcePropType } from 'react-native';

export const FOTOS: Record<string, ImageSourcePropType> = {
  'alfredo': require('@/assets/fotos/alfredo.jpg'),
  'calabaza': require('@/assets/fotos/calabaza.jpg'),
  'champinones': require('@/assets/fotos/champinones.jpg'),
  'chocolate-cacahuete': require('@/assets/fotos/chocolate-cacahuete.jpg'),
  'chocolate-helado': require('@/assets/fotos/chocolate-helado.jpg'),
  'coliflor-curry': require('@/assets/fotos/coliflor-curry.jpg'),
  'dip-espinacas': require('@/assets/fotos/dip-espinacas.jpg'),
  'fondue-chocolate': require('@/assets/fotos/fondue-chocolate.jpg'),
  'froze-fresa': require('@/assets/fotos/froze-fresa.jpg'),
  'helado-arandanos': require('@/assets/fotos/helado-arandanos.jpg'),
  'helado-menta': require('@/assets/fotos/helado-menta.jpg'),
  'margarita-mango': require('@/assets/fotos/margarita-mango.jpg'),
  'mermelada-fresa': require('@/assets/fotos/mermelada-fresa.jpg'),
  'mermelada-frutos-rojos': require('@/assets/fotos/mermelada-frutos-rojos.jpg'),
  'minestrone': require('@/assets/fotos/minestrone.jpg'),
  'pollo-fideos': require('@/assets/fotos/pollo-fideos.jpg'),
  'puerro-patata': require('@/assets/fotos/puerro-patata.jpg'),
  'salsa-tomate': require('@/assets/fotos/salsa-tomate.jpg'),
  'smoothie-fresa-pina': require('@/assets/fotos/smoothie-fresa-pina.jpg'),
  'smoothie-frutos-rojos': require('@/assets/fotos/smoothie-frutos-rojos.jpg'),
  'sorbete-pina-coco': require('@/assets/fotos/sorbete-pina-coco.jpg'),
  'tomate-albahaca': require('@/assets/fotos/tomate-albahaca.jpg'),
  'verduras-trozos': require('@/assets/fotos/verduras-trozos.jpg'),
};

export function fotoDe(key: string | null | undefined): ImageSourcePropType | null {
  if (!key) return null;
  return FOTOS[key] ?? null;
}
