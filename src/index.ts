import { tulip } from './meta';

async function main() {
  console.log('你好，世界');
  const a = await tulip();
  console.log(a._new_task(1, 100));
  console.log(a._new_task(1, 100));
  console.log(a._new_task(1, 100));
}

main();
