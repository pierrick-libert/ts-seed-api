#!/bin/bash

npm run typeorm -- -c docker migration:run
npm run compile && node ./dist/index.js --orm docker --port 8083
