import {Config} from '../config';
import {init, captureException} from '@sentry/node';
import {createLogger, format, transports, Logger, LogEntry} from 'winston';

export class LoggerService {
  private static instance: LoggerService;
  public logger: Logger;

  private constructor() {
    // Init the sentry if we have one
    if (Config.sentryDsn) {
      init({
        dsn: Config.sentryDsn,
        debug: !Config.isProd,
        environment: `[${Config.nodeEnv}]`
      });
    }
    // Then init the logger
    this.logger = createLogger({
      format: format.combine(
        format.timestamp(),
        format.json(),
      ),
      level: Config.isProd === true ? 'error' : 'debug',
      transports: [
        new transports.Console({})
      ]
    });
    // Create middlewares to send data to Sentry in case of error
    // The 'logged' event can only be on the transports so listening the first one should do the work
    // and avoid the duplicated in Sentry
    this.logger.transports[0].on('logged', (data: LogEntry) => {
      // Only send data to Sentry in case of error and if defined
      if (data.level === 'error' && Config.sentryDsn) {
        captureException(data);
      }
    });
    this.logger.on('error', (error: Error) => {
      // Only throw if sentry is configured
      if (Config.sentryDsn) {
        captureException(error);
      }
    });
  }

  // Singleton implementation
  public static getInstance(): LoggerService {
    if (!LoggerService.instance) {
      LoggerService.instance = new LoggerService();
    }
    return LoggerService.instance;
  }
}
