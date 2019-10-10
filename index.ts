'use strict';

import AppService from './lib/app/app.service';

// List all endpoints used by your applications
import Mall from './endpoints/mall';

// Add all your endpoints there
const app = new AppService(
  [
    new Mall(),
  ],
  5000,
);

app.listen();
