#!/bin/bash

npm run typeorm migration:run
npm run compile
node ./dist/index.js
