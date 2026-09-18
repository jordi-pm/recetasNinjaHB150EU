# Ficha para App Store Connect — Sopera

## Información de la app

**Nombre**  Sopera
**Subtítulo** (30 car. máx.)  Recetas para batidora sopera
**Categoría principal**  Comida y bebida
**Categoría secundaria**  Estilo de vida
**Idioma principal**  Español (España)
**Bundle ID**  com.jlumbrerasa.sopera
**SKU**  sopera-001

## Clasificación por edades

Responde **No** a todo. Resultado esperado: **4+**.
No hay contenido generado por usuarios, ni web, ni redes sociales, ni compras.
Ojo con una: *¿La app incluye referencias al alcohol?* → hay dos recetas con
alcohol (margarita y frozé). Marca **Frecuente/Intenso: No**, **Poco frecuente
o leve: Sí**. Eso deja la clasificación en 12+, que es lo correcto.

## Privacidad (App Privacy)

**¿Recopilas datos?**  **No**.
Todo (favoritos, lista de la compra, notas, historial, recetas propias) se
guarda solo en el dispositivo con AsyncStorage. No hay cuentas, ni analítica,
ni publicidad, ni SDK de terceros que recoja nada. No sale nada del móvil.

**URL de política de privacidad**: obligatoria igualmente. Tienes el texto en
`tienda/politica-privacidad.md`; súbelo a cualquier sitio público (GitHub Pages,
Notion público, tu web) y pega ahí la URL.

## Cifrado (aparece al subir la build)

*¿Tu app usa cifrado?* → **No**.
Ya está declarado en `app.json` (`usesNonExemptEncryption: false`), así que no
te lo debería volver a preguntar.

## Descripción

Sopera es un recetario para batidoras soperas: esas que cuecen y trituran en
la misma jarra, con programas automáticos de sopa suave, sopa con trozos,
salsa, mermelada, sofrito y picado.

Cada receta te dice exactamente qué tecla pulsar y cuándo. El modo «Cocinar
ahora» te lleva paso a paso, un gesto por pantalla, con la tecla del panel
bien grande y un temporizador que te avisa aunque tengas el móvil bloqueado
o la pantalla apagada.

Lo que la hace distinta:

• Control de capacidad. La app calcula cuánto ocupa cada receta y lo compara
  con las líneas grabadas de tu jarra. Si doblar la receta se saliera, no te
  enseña esas cantidades: te avisa. También hay una calculadora suelta para
  cuando cocinas sin receta.

• Temporizadores de verdad. Incluidos los pasos de «cuando falten 6 minutos,
  añade los fideos», que son los que se pasan siempre.

• Lista de la compra ordenada por pasillo del supermercado, fusionando lo que
  se repite entre recetas.

• Buscador que aguanta erratas y que también busca dentro de los avisos de
  seguridad y los mensajes de la pantalla del aparato.

• Tus propias recetas, con la misma ficha y el mismo control de capacidad.

• Notas, favoritos e historial de lo que has cocinado, incluido si de verdad
  cupo en la jarra.

Sin cuentas, sin anuncios, sin seguimiento. Todo se queda en tu móvil.

Sopera no está asociada a ningún fabricante de electrodomésticos.

## Novedades de esta versión

Primera versión.

## Palabras clave (100 car. máx.)

sopa,crema,batidora,sopera,recetas,smoothie,mermelada,salsa,cocina,temporizador

## Texto para el revisor (App Review Information)

App de recetas de cocina totalmente offline. No requiere cuenta ni inicio de
sesión. Todos los datos se guardan localmente en el dispositivo.

Las recetas son elaboraciones de cocina común (sopas, cremas, batidos,
mermeladas y salsas) adaptadas por el desarrollador para batidoras con jarra
calefactora. Los nombres en mayúsculas que aparecen en los pasos (SMOOTH SOUP,
CHUNKY SOUP, SAUTÉ, etc.) son descripciones funcionales de los programas que
llevan impresos este tipo de aparatos, usadas únicamente para indicar al
usuario qué botón debe pulsar en su propia máquina.

La app no está asociada, patrocinada ni respaldada por ningún fabricante, y no
incluye material con derechos de autor de terceros: ni imágenes, ni manuales,
ni textos de ningún recetario comercial.

## Capturas que hacen falta

- iPhone 6,9" (1320 × 2868) — obligatorias, mínimo 3
- iPad 13" (2064 × 2752) — obligatorias porque `supportsTablet: true`

Si no quieres preparar capturas de iPad, pon `"supportsTablet": false` en
`app.json` y te ahorras ese juego entero.
