#!/bin/bash
webpack ./dist/index.js --output-filename tulip.min.js \
  --target='node' \
  --mode='production'
