/* Tests de datos y de cálculo. Se ejecutan con: npm test
   No necesitan simulador: son la red de seguridad de las reglas del proyecto. */
import assert from 'node:assert/strict';
import { test } from 'node:test';

import { CATEGORIAS, MAQUINA, RECETAS } from '../src/data/recetas';
import {
  alergenosDe, buscarAyuda, cantidad, equivalencia, filtrar, pasilloDe, pasosCocina, programasDe,
} from '../src/lib/format';
import { cargaMl, maxEscala } from '../src/lib/volumen';

const BOTONES_REALES = new Set<string>([
  ...MAQUINA.programas.map((p) => p.b),
  'BLEND', 'COOK', 'PULSE', 'CLEAN', 'POWER', 'LOW', 'MED', 'HIGH',
]);

test('ninguna receta usa un botón que no exista en el panel', () => {
  for (const r of RECETAS) {
    for (const p of r.pasos) {
      if (p.b) assert.ok(BOTONES_REALES.has(p.b), `${r.id}: botón inventado «${p.b}»`);
      if (p.sub) assert.ok(['LOW', 'MED', 'HIGH'].includes(p.sub), `${r.id}: ajuste «${p.sub}»`);
    }
  }
});

test('los índices de ingredientes de cada paso existen', () => {
  for (const r of RECETAS) {
    for (const p of r.pasos) {
      for (const i of p.add ?? []) {
        assert.ok(r.ing[i], `${r.id}: el paso apunta al ingrediente ${i}, que no existe`);
      }
    }
  }
});

test('todo ingrediente se usa, es guarnición, o está declarado como no usado', () => {
  for (const r of RECETAS) {
    const usados = new Set(r.pasos.flatMap((p) => p.add ?? []));
    r.ing.forEach((ing, i) => {
      const justificado = usados.has(i) || ing.fuera || r.sinUsar?.includes(i);
      assert.ok(justificado, `${r.id}: «${ing.n}» no se usa en ningún paso y no está declarado`);
    });
  }
});

test('cada receta tiene una categoría que existe', () => {
  const ids = new Set(CATEGORIAS.map((c) => c.id));
  for (const r of RECETAS) assert.ok(ids.has(r.cat), `${r.id}: categoría «${r.cat}»`);
});

test('el límite de llenado es una de las dos líneas grabadas', () => {
  for (const r of RECETAS) {
    assert.ok([1400, 1600].includes(r.limiteMl), `${r.id}: límite ${r.limiteMl}`);
  }
});

test('escalar nunca propone una carga por encima de la línea', () => {
  for (const r of RECETAS) {
    const max = maxEscala(r);
    assert.ok(max >= 1 && max <= 3, `${r.id}: escala máxima ${max}`);
    if (max > 1) {
      assert.ok(
        cargaMl(r, max) <= r.limiteMl,
        `${r.id}: a ${max}× se pasa (${cargaMl(r, max)} > ${r.limiteMl})`
      );
    }
    assert.ok(
      cargaMl(r, max + 1) > r.limiteMl || max === 3,
      `${r.id}: cabría a ${max + 1}× pero no se ofrece`
    );
  }
});

test('el volumen crece con la escala', () => {
  for (const r of RECETAS) {
    assert.ok(cargaMl(r, 2) > cargaMl(r, 1), `${r.id}: 2× no es mayor que 1×`);
  }
});

test('las cantidades se escalan de verdad', () => {
  const r = RECETAS.find((x) => x.id === 'calabaza')!;
  const ing = r.ing.find((i) => i.u === 'g')!;
  assert.equal(cantidad(ing, 1).txt, `${ing.c} g`);
  assert.equal(cantidad(ing, 2).txt, `${ing.c! * 2} g`);
});

test('los pasos guiados salen con al menos un paso por receta', () => {
  for (const r of RECETAS) {
    const pasos = pasosCocina(r, 1);
    assert.ok(pasos.length > 0, `${r.id}: sin pasos guiados`);
    for (const p of pasos) {
      assert.ok(p.txt || p.b || p.aviso, `${r.id}: paso guiado vacío`);
      assert.ok(typeof p.origen === 'number', `${r.id}: paso guiado sin origen`);
    }
  }
});

test('los ingredientes no usados del minestrone se avisan en el modo cocina', () => {
  const r = RECETAS.find((x) => x.id === 'minestrone')!;
  const pasos = pasosCocina(r, 1);
  assert.ok(
    pasos.some((p) => /no dice en qué paso van/.test(p.aviso ?? '')),
    'el minestrone debería avisar de apio y zanahoria'
  );
});

test('la búsqueda aguanta una errata', () => {
  assert.ok(filtrar('calabaza', {}).length > 0, 'calabaza no encuentra nada');
  assert.ok(filtrar('calabasa', {}).length > 0, 'calabasa (con errata) no encuentra nada');
});

test('la búsqueda respeta los filtros', () => {
  const veganas = filtrar('', { dieta: 'vegana' });
  assert.ok(veganas.length > 0);
  for (const r of veganas) assert.ok(r.tags.includes('vegana'), `${r.id} no es vegana`);
});

test('los alérgenos detectan lo evidente', () => {
  const alfredo = RECETAS.find((r) => r.id === 'alfredo')!;
  assert.ok(alergenosDe(alfredo).includes('lacteos'), 'la salsa Alfredo lleva lácteos');
  const margarita = RECETAS.find((r) => r.id === 'margarita-mango')!;
  assert.ok(alergenosDe(margarita).includes('alcohol'), 'la margarita lleva alcohol');
  const sorbete = RECETAS.find((r) => r.id === 'sorbete-pina-coco')!;
  assert.ok(!alergenosDe(sorbete).includes('lacteos'), 'la leche de coco no es un lácteo');
});

test('los ingredientes caen en un pasillo razonable', () => {
  assert.equal(pasilloDe('cebolla pequeña, pelada'), 'verduras');
  assert.equal(pasilloDe('nata para montar'), 'lacteos');
  assert.equal(pasilloDe('fresas congeladas'), 'congelados');
  assert.equal(pasilloDe('caldo de verduras caliente'), 'despensa');
});

test('las equivalencias solo salen en cucharadas', () => {
  assert.equal(equivalencia({ c: 2, u: 'cda', n: 'aceite de oliva' }, 1), '≈ 28 g');
  assert.equal(equivalencia({ c: 400, u: 'g', n: 'coliflor' }, 1), null);
});

test('cada receta declara al menos un programa', () => {
  for (const r of RECETAS) {
    assert.ok(programasDe(r).length > 0, `${r.id}: ningún botón en los pasos`);
  }
});

test('la app no se atribuye fuentes oficiales', () => {
  const texto = JSON.stringify(RECETAS) + JSON.stringify(MAQUINA);
  for (const palabra of ['Ninja', 'Foodi', 'Auto-iQ', 'HB150', 'SharkNinja', 'oficial']) {
    assert.ok(!texto.includes(palabra), `los datos mencionan «${palabra}»`);
  }
});

test('las recetas con discrepancia la explican', () => {
  for (const r of RECETAS) {
    if (r.discrepancia) assert.ok(r.discrepancia.length > 40, `${r.id}: discrepancia demasiado escueta`);
  }
});

test('el buscador encuentra también los mensajes del aparato', () => {
  const jar = buscarAyuda('JAr');
  assert.ok(jar.length > 0, '«JAr» debería encontrar su explicación');
  const vapor = buscarAyuda('vapor');
  assert.ok(vapor.length > 0, '«vapor» debería encontrar el aviso de seguridad');
  assert.equal(buscarAyuda('x').length, 0, 'una sola letra no debería disparar resultados');
});

test('los pasos ya no repiten la orden que da la tecla', () => {
  for (const r of RECETAS) {
    for (const p of r.pasos) {
      if (!p.b || !p.t) continue;
      assert.ok(
        !p.t.includes(`Pulsa ${p.b}`),
        `${r.id}: el texto repite la tecla «${p.b}»`
      );
    }
  }
});

test('el modo cocina dice siempre qué hay dentro de la jarra', () => {
  const r = RECETAS.find((x) => x.id === 'calabaza')!;
  const pasos = pasosCocina(r, 1);
  const chop = pasos.find((p) => p.b === 'CHOP')!;
  assert.ok(chop.enJarra.length > 0, 'en el paso CHOP la jarra no puede estar vacía');
  assert.ok(chop.continua, 'CHOP debe indicar que el contenido sigue dentro');
  const soup = pasos.find((p) => p.b === 'SMOOTH SOUP')!;
  assert.ok(
    soup.enJarra.length > chop.enJarra.length,
    'al llegar a SMOOTH SOUP debe haber más cosas dentro que en CHOP'
  );
});

test('servir o desmoldar vacía la jarra', () => {
  for (const id of ['mermelada-fresa', 'helado-arandanos']) {
    const r = RECETAS.find((x) => x.id === id)!;
    const pasos = pasosCocina(r, 1);
    assert.equal(pasos[pasos.length - 1].enJarra.length, 0, `${id}: la jarra debería quedar vacía al final`);
  }
});
