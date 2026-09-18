# Mis Recetas Ninja HB150EU

App **nativa de iOS** (React Native + Expo) con el recetario de la
**Ninja Foodi Blender & Soup Maker HB150EU**. Solo contiene recetas del manual y
del recetario oficiales de ese aparato: nada de Air Fryer, Multicooker, Creami
ni de otros modelos Ninja.

```bash
npm install
npm test                  # 17 tests de datos y de cálculo, sin simulador
npm run typecheck         # app + scripts
npx expo run:ios          # compila y abre el simulador
npx expo run:ios --device # tu iPhone por cable
```

La compilación genera `ios/MisRecetasNinjaHB150EU.xcworkspace`, que es el
proyecto de Xcode con el que se firma y se sube a TestFlight.

## Qué hace

**Cocinar.** Modo guiado a pantalla completa, un paso por acción, con la tecla
del panel destacada. Temporizadores con aviso aunque tengas el móvil bloqueado,
los pasos de «cuando falten 6 minutos» marcados aparte, aviso de los 3 pitidos
antes de cada removido, y al terminar te ofrece el programa `CLEAN`. La pantalla
no se apaga y avanzas tocando en cualquier parte. Si sales a medias, la app te
ofrece reanudar donde lo dejaste.

**Capacidad.** Cada receta calcula cuánto ocupa en la jarra y lo compara con la
línea grabada que aplica (1,4 L en modos con calor, 1,6 L en frío). Si un
escalado 2×/3× se saldría, la app **no te enseña esas cantidades**. Hay además
una calculadora «¿cabe?» para cuando cocinas sin receta.

**Lista de la compra.** Agrupada por pasillo de supermercado, fusionando
ingredientes repetidos entre recetas, con añadidos a mano y compartir por la
hoja de iOS.

**Lo tuyo.** Favoritos, notas por receta, historial de lo que has cocinado
(incluido si cupo de verdad en la jarra) y un editor para tus propias recetas,
que se guardan marcadas como tuyas y nunca mezcladas con las oficiales.

**Buscar.** Tolerante a erratas, con filtros en una hoja modal (tipo, tiempo,
ingrediente, dieta, alérgeno, textura) y un modo «lo que tengo en casa».

## Estructura

| Zona | Qué hace |
|---|---|
| `src/app/` | Rutas (expo-router): pestañas `UITabBarController`, un stack nativo por pestaña con títulos grandes y `UISearchController`. |
| `src/screens/` | Ficha de receta y modo «Cocinar ahora». |
| `src/components/` | `PanelKey` (réplica de una tecla del panel), `JugGauge` (la jarra con sus dos líneas), `RecipeCard`, `SelectorTema`, kit de UI. |
| `src/data/recetas.ts` | Las recetas, transcritas del recetario oficial con su página de origen. |
| `src/data/tipos.ts` | Tipos. Los nombres de botón son una **unión cerrada**: inventarse un programa no compila. |
| `src/lib/volumen.ts` | Modelo de volumen con densidades por ingrediente. |
| `src/lib/format.ts` | Escalado, filtros, búsqueda, alérgenos, pasillos, pasos guiados. |
| `src/lib/temporizador.ts` | Cuenta atrás y notificaciones locales. |
| `src/lib/store.tsx` | Favoritos, lista, notas, historial y recetas propias (AsyncStorage). |
| `assets/docs/` | Los PDF oficiales, dentro de la app para funcionar sin conexión. |
| `scripts/tests.ts` | Tests. `scripts/check-volumen.ts` imprime la carga de cada receta. |

## Decisiones que conviene conocer

- **Los nombres de los botones no se traducen.** `SMOOTH SOUP`, `CHUNKY SOUP`,
  `SAUTÉ`, `CHOP`, `JAM`, `SAUCE`, `SMOOTHIE`, `DESSERT`, `FROZEN DRINK`,
  `MILKSHAKE`, `BLEND`, `COOK`, `PULSE`, `CLEAN` y `POWER` salen tal cual del
  panel del HB150EU, y el tipo `BotonPanel` impide usar otros.

- **El cálculo de volumen es de la app, no de Ninja.** Margen ±20 %. Modela que
  el líquido rellena los huecos entre los trozos, en vez de apilarse encima:
  `total = máx(Σ aparente de sólidos, Σ real de sólidos + Σ líquidos)`. La línea
  grabada en la jarra siempre manda sobre este número.

- **A 1× nunca se contradice a Ninja.** Las cantidades oficiales se dan por
  buenas. Cuando el cálculo dice que rozan o pasan la línea, se avisa con un
  aviso naranja y el consejo de echar el líquido hasta la línea, no con un
  bloqueo. Cinco recetas están en ese caso, y una de ellas (la salsa de tomate,
  4 latas de 400 g) tiene además la discrepancia documentada en la propia ficha.

- **Los alérgenos los deduce la app** de los nombres de los ingredientes y están
  etiquetados como tal. No son un dato oficial de Ninja.

- **Las discrepancias se señalan, no se resuelven.** Están en la pestaña
  «Mi HB150EU» y en la ficha de las recetas afectadas.

## Fuentes

- Manual: *HB150UK Series Instructions — Blender & Soup Maker*, SharkNinja,
  `HB150UK_IB_MP_190828_Mv1` (ninjakitchen.eu).
- Recetario: *Blender & Soup Maker — Inspiration Guide*, SharkNinja,
  `HB150UK_IG_25Recipe_MP_200622_Mv1`.

Las fotos de las recetas y los PDF proceden de la documentación oficial de Ninja
y se incluyen para uso personal.
