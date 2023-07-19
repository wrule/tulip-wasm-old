#!/bin/bash
emcc -O3 c/index.c c/tiamalgamation.c -o dist/emcc-tulip.js \
  -s SINGLE_FILE=1 \
  -s ALLOW_MEMORY_GROWTH=1 \
  -s EXPORTED_FUNCTIONS='[
    "_free_task",
    "_free_current",
    "_reset",
    "_init",
    "_new_task",
    "_inputs_number",
    "_inputs_map",
    "_options_number",
    "_outputs_number",
    "_get_inputs_number",
    "_inputs_offset",
    "_outputs_offset",
    "_link_task",
    "_run_task",
    "_run"
  ]'
echo '// @ts-nocheck' > src/tulip.ts
echo 'export function tulip() {' >> src/tulip.ts
cat dist/emcc-tulip.js >> src/tulip.ts
echo 'return Module; }' >> src/tulip.ts
