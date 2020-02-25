'use strict';

import {Logger} from 'winston';
import {LoggerFactory} from './logger.factory';

export class LoggerService {

  private logger: Logger;

  constructor() {}

  // Init the logger
  public init(isProd: boolean): void {
    this.logger = new LoggerFactory(isProd).getLogger();
  }

  // Return the PostgreSQL client
  public getLogger(): Logger {
    return this.logger;
  }

}
