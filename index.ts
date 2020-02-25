'use strict';

import 'reflect-metadata';
import {AppService} from './lib/app/app.service';
import {Container} from 'aurelia-dependency-injection';
import {SentryFactory} from './lib/sentry/sentry.factory';

// Define if we're in a production env
const isProd = process.env.NODE_ENV === 'production' ? true : false;

// Init the sentry with proper information
new SentryFactory(isProd);

// Add all your endpoints there
const app = new Container().get(AppService);
app.init(5000, isProd);
app.listen();
