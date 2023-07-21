import * as tulip from '.';

async function main() {
  let a = undefined;
  let b = a;
  a = { name: 'kkkk' };
  console.log(b);
}

main();
