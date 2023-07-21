# tulip-wasm
tulip-wasm is a WebAssembly ported version of [tulip indicators](https://tulipindicators.org/), so it has extremely high performance while supporting browsers and Nodejs environments, and provides the ability to combine indicators and calculate them, as well as a friendly API.
## installation

```console
npm install tulip-wasm
```
## example
```
import * as tulip from 'tulip-wasm';

async function main() {
  await tulip.init();
  console.log(tulip.sma([1, 2, 3, 4, 5], 2));
}

main();
```
## documentation
tulip-wasm supports all 104 technical indicators of tulip indicators
You can learn what technical indicators tulip-wasm contains by reading the official documentation of [tulip indicators](https://tulipindicators.org/list)
All indicators can be accessed in a way like tulip.xxx
