import { RECETAS } from '../src/data/recetas';
import { aporte, cargaMl } from '../src/lib/volumen';

for (const id of ['coliflor-curry', 'alfredo', 'salsa-tomate', 'plantilla-suave']) {
  const r = RECETAS.find((x) => x.id === id)!;
  console.log('\n=== ' + id + '  total=' + cargaMl(r, 1) + ' / ' + r.limiteMl);
  let ap = 0, re = 0, li = 0;
  r.ing.forEach((ing) => {
    const a = aporte(ing, 1);
    // recalcular el criterio de líquido igual que el módulo
    const liq = a.aparente === a.real && a.real > 0;
    console.log(
      '  ', (ing.c ?? '-') + ' ' + ing.u,
      ('real=' + Math.round(a.real)).padStart(11),
      ('apar=' + Math.round(a.aparente)).padStart(11),
      liq ? 'LIQ' : 'sol', ' ', ing.n.slice(0, 44)
    );
  });
}
