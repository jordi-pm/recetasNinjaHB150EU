import { RECETAS } from '../src/data/recetas';
import { cargaMl, desglose, maxEscala } from '../src/lib/volumen';

const over: string[] = [];
RECETAS.forEach((r) => {
  const c = cargaMl(r, 1);
  const pct = Math.round((c / r.limiteMl) * 100);
  const flag = c > r.limiteMl ? '  <<< SE PASA' : '';
  console.log(
    r.id.padEnd(23), String(c).padStart(5) + ' ml', ('de ' + r.limiteMl).padStart(8),
    (pct + '%').padStart(5), 'max=' + maxEscala(r), flag
  );
  if (c > r.limiteMl) over.push(r.id);
});
console.log('\nSe pasan a 1x:', over.length ? over.join(', ') : 'ninguna');
console.log('\nDesglose crema de calabaza:');
desglose(RECETAS.find((r) => r.id === 'calabaza')!, 1).forEach((d) =>
  console.log('  ', String(d.ml).padStart(5) + ' ml', d.ing.n.slice(0, 55))
);
