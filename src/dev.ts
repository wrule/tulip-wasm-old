import * as tulip from '.';

async function main() {
  console.log(await tulip.sma_p([1, 2, 3, 5], 2));
}

main();
