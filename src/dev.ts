import * as tulip from '.';

async function main() {
  console.log(await tulip.sma([1, 2, 3, 5], 2));
}

main();
