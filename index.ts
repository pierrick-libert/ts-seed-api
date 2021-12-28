import 'reflect-metadata';
import yargs from 'yargs';
import {Database} from './lib/db/db.service';
import {AppService} from './lib/app/app.service';
import {SentryFactory} from './lib/sentry/sentry.factory';
import {LoggerFactory} from './lib/logger/logger.factory';
import {LoggerService} from './lib/logger/logger.service';

// List all endpoints used by your applications
import {SampleEndpoint} from './endpoints/sample';

// Define if we're in a production env
const isProd = process.env.NODE_ENV === 'production';

// Parse arguments to handle options
const argv = yargs(process.argv.slice(2))
  .usage('Usage: $0 [options]')
  .example('$0 -p 8083 -o default', 'Launch the server with the given options')
  .alias('port', 'p').nargs('p', 1).describe('port', 'Port to listen')
  .alias('orm', 'o').nargs('o', 1).describe('orm', 'ORM config to be loaded to connect to the DB')
  .default({'port': 8083, 'orm': 'default'})
  .help('h').alias('h', 'help')
  .parseSync();

// Init the sentry with proper information
new SentryFactory(isProd);
// Init the DB Pool
const db = new Database(argv.orm);
// Init the logger
const logger = new LoggerService(new LoggerFactory(isProd));

if (isProd === false) {
  logger.getLogger().debug('Logging initialized at debug level');
}
(async () => {
  // Add all your endpoints there
  const app = new AppService(
    [
      await new SampleEndpoint(logger).init(db),
    ],
    logger,
    argv.port,
  );

  app.listen();
})();
