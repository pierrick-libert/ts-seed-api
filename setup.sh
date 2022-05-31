#!/bin/bash

npm run typeorm -- -d ormconfig.docker.ts migration:run
npm run compile && node ./dist/index.js --orm docker --port 8083
