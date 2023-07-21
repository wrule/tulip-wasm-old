import * as tulip from '.';

async function main() {
  await tulip.init();
  console.log(tulip.sma([1, 2, 3, 4], 3));
}

main();
