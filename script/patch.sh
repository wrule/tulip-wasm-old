#!/bin/bash
git add .
git commit -m 'patch ready'
npm version patch
npm run build
npm publish --access public
