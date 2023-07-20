import { tulip, run_alone } from './meta';

function main() {
  console.log('你好，世界');
  console.log(tulip);
  const outputs = run_alone(tulip, 48, [[1, 2, 3, 4, 5, 6]], [3], 1);
  console.log(outputs);
}

main();
