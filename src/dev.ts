import * as tulip from '.';

async function main() {
  await tulip.init();
  const list = Array(10000000).fill(0).map(() => Math.random() * 1000);
  const old_time = Date.now();
  tulip.sma(list, 3);
  console.log(Date.now() - old_time);
}

main();
