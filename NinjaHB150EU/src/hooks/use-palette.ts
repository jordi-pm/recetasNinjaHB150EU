import { useColorScheme } from 'react-native';
import { dark, light, type Palette } from '@/theme/colors';

export function usePalette(): Palette {
  return useColorScheme() === 'dark' ? dark : light;
}
