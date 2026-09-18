# Mis Recetas Ninja HB150EU

App **nativa de iOS** (React Native + Expo) con el recetario de la
**Ninja Foodi Blender & Soup Maker HB150EU**. Solo contiene recetas del manual y
del recetario oficiales de ese aparato: nada de Air Fryer, Multicooker, Creami
ni de otros modelos Ninja.

## Cómo ejecutarla

```bash
npm install
npx expo run:ios          # compila y abre el simulador de iPhone
```

Para probarla en tu iPhone físico por cable:

```bash
npx expo run:ios --device
```

La primera compilación genera la carpeta `ios/` con el proyecto de Xcode
(`ios/MisRecetasNinjaHB150EU.xcworkspace`), que es el que se usa para firmar y
subir a TestFlight / App Store.

## Qué hay dentro

| Zona | Qué hace |
|---|---|
| `src/app/` | Rutas (expo-router). Pestañas nativas `UITabBarController`, stack nativo por pestaña con títulos grandes y buscador `UISearchController`. |
| `src/screens/` | Pantallas grandes: ficha de receta y modo «Cocinar ahora». |
| `src/components/` | `PanelKey` (réplica de una tecla del panel), `JugGauge` (jarra con las líneas 1,4 L / 1,6 L), `RecipeCard`, kit de UI. |
| `src/data/recetas.ts` | Las recetas, transcritas del recetario oficial, con su página de origen. |
| `src/data/tipos.ts` | Tipos de TypeScript del modelo de datos. |
| `src/lib/format.ts` | Escalado, filtros, búsqueda, expansión a pasos guiados, avisos de seguridad por receta. |
| `src/lib/store.tsx` | Favoritos y lista de la compra, persistidos con AsyncStorage. |

## Decisiones que conviene conocer

- **Los nombres de los botones no se traducen.** `SMOOTH SOUP`, `CHUNKY SOUP`,
  `SAUTÉ`, `CHOP`, `JAM`, `SAUCE`, `SMOOTHIE`, `DESSERT`, `FROZEN DRINK`,
  `MILKSHAKE`, `BLEND`, `COOK`, `PULSE`, `CLEAN` y `POWER` aparecen tal y como
  están impresos en el panel del HB150EU.
- **El escalado 2×/3× se bloquea** cuando la carga estimada superaría la línea
  grabada que aplica (1,4 L en modos con calor, 1,6 L en frío). En ese caso la
  app no muestra las cantidades: enseña el aviso y el nivel de la jarra.
  Con las cantidades oficiales, casi ninguna receta admite 2×.
- **Las discrepancias entre fuentes se señalan, no se resuelven.** Están
  recogidas en la pestaña «Mi HB150EU» y en la ficha de las recetas afectadas.
- El modo «Cocinar ahora» mantiene la pantalla encendida (`expo-keep-awake`) y
  usa retorno háptico al avanzar de paso.

## Fuentes

- Manual: *HB150UK Series Instructions — Blender & Soup Maker*, SharkNinja,
  `HB150UK_IB_MP_190828_Mv1` (ninjakitchen.eu).
- Recetario: *Blender & Soup Maker — Inspiration Guide*, SharkNinja,
  `HB150UK_IG_25Recipe_MP_200622_Mv1`.

Las fotos de las recetas proceden del recetario oficial de Ninja y se incluyen
para uso personal.
