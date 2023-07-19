#!/bin/bash
webpack ./dist/index.js --output-filename tulip-wasm.js \
  --target='node' \
  --mode='production'
