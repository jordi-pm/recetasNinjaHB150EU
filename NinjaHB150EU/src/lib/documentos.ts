import { Asset } from 'expo-asset';
import * as Sharing from 'expo-sharing';
import * as WebBrowser from 'expo-web-browser';

/* Los PDF oficiales van dentro de la app: en una cocina no puedes depender
   de tener cobertura, y además fija la fuente exacta que se usó. */

const LOCALES = {
  recetario: require('@/assets/docs/recetario-oficial-hb150.pdf'),
  manual: require('@/assets/docs/manual-oficial-hb150.pdf'),
} as const;

export type Documento = keyof typeof LOCALES;

/** Abre el PDF empaquetado; si no se puede, cae al enlace de internet. */
export async function abrirDocumento(cual: Documento, urlRespaldo: string) {
  try {
    const asset = Asset.fromModule(LOCALES[cual]);
    await asset.downloadAsync();
    const uri = asset.localUri ?? asset.uri;
    if (uri && (await Sharing.isAvailableAsync())) {
      await Sharing.shareAsync(uri, {
        mimeType: 'application/pdf',
        UTI: 'com.adobe.pdf',
        dialogTitle: cual === 'manual' ? 'Manual del HB150EU' : 'Recetario del HB150EU',
      });
      return;
    }
  } catch {
    // sin ruido: probamos con internet
  }
  WebBrowser.openBrowserAsync(urlRespaldo).catch(() => {});
}
