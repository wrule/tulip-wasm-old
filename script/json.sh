#!/bin/bash
mkdir -p dist
gcc c/print.c c/tiamalgamation.c -o dist/print
./dist/print > src/indicators.json
node src/corrector.js src/indicators.json
