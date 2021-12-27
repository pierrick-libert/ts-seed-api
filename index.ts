import 'reflect-metadata';
import {Database} from './lib/db/db.service';
import {AppService} from './lib/app/app.service';
import {SentryFactory} from './lib/sentry/sentry.factory';
import {LoggerFactory} from './lib/logger/logger.factory';
import {LoggerService} from './lib/logger/logger.service';

// List all endpoints used by your applications
import {SampleEndpoint} from './endpoints/sample';

// Define if we're in a production env
const isProd = process.env.NODE_ENV === 'production';

// Init the sentry with proper information
new SentryFactory(isProd);
// Init the DB Pool
const db = new Database();
// Init the logger
const logger = new LoggerService(new LoggerFactory(isProd));

if (isProd === false) {
  logger.getLogger().debug('Logging initialized at debug level');
}
// Add all your endpoints there
const app = new AppService(
  [
    new SampleEndpoint(db, logger),
  ],
  logger,
  8083,
);

app.listen();
