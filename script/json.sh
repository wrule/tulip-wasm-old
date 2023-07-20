#!/bin/bash
mkdir -p dist
gcc c/print.c c/tiamalgamation.c -o dist/print
./dist/print > src/indicators.json
ts-node src/corrector.ts src/indicators.json
