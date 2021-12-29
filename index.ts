import 'reflect-metadata';
import yargs from 'yargs';
import {Config} from './lib/config';
import {AppService} from './lib/app/app.service';
import {LoggerService} from './lib/logger/logger.service';

// List all endpoints used by your applications
import {SampleEndpoint} from './endpoints/sample';

// Parse arguments to handle options
const argv = yargs(process.argv.slice(2))
  .usage('Usage: $0 [options]')
  .example('$0 -p 8083 -o default', 'Launch the server with the given options')
  .alias('port', 'p').nargs('p', 1).describe('port', 'Port to listen')
  .alias('orm', 'o').nargs('o', 1).describe('orm', 'ORM config to be loaded to connect to the DB')
  .default({'port': 8083, 'orm': 'default'})
  .help('h').alias('h', 'help')
  .parseSync();

if (Config.isProd === false) {
  LoggerService.getInstance().logger.debug('Logging initialized at debug level');
}
(async () => {
  // Add all your endpoints there
  const app = new AppService(
    [
      await new SampleEndpoint().init(argv.orm),
    ],
    argv.port,
  );

  app.listen();
})();
