import { tulip, run_alone } from './meta';
import { Code } from './code';
import indicators from './indicators.json';

async function main() {
  console.log('你好，世界');
  const a = await tulip;
  console.log(a._new_task(1, 100));
  console.log(a._new_task(1, 100));
  console.log(a._new_task(1, 100));
  console.log(await run_alone(tulip, 72, [[1, 2, 3, 5]], [2], 1));
  const code = new Code(indicators[72]);
  console.log(code.Code());
}

main();
