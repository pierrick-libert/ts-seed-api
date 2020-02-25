'use strict';

import * as cors from 'cors';
import * as express from 'express';
import * as fileUpload from 'express-fileupload';
import {inject} from 'aurelia-dependency-injection';
import {LoggerService} from '../logger/logger.service';
import {ResponseFactory} from '../response/response.factory';
import {MiddlewareFactory} from '../middleware/middleware.factory';

// List all endpoints used by your applications
import {Sample} from '../../endpoints/sample';

@inject(
  LoggerService,
  // endpoints
  Sample
)
export class AppService {

  // You can setup this basePath in your code to have the lang checked automatically
  public static basePath = '/:lang((en){1})';
  public port: number;
  public isProd: boolean;
  public app: express.Application;

  constructor(
    private loggerService: LoggerService,
    private sample: Sample) {
  }

  public init(port: number, isProd: boolean): void {
    this.app = express();
    this.port = port;
    this.isProd = isProd;
    // Call the inits
    this.loggerService.init(isProd);
    this.initializeMiddlewares();
    this.initializeEndpoints();
    this.initializeErrorMiddleware();
  }

  // Init all middlewares to handle errors and so on
  private initializeMiddlewares(): void {
    this.app.use(cors({credentials: true}));
    this.app.options('*', cors({credentials: true}));
    this.app.use(express.json({type: 'application/*'}));
    // Middleware
    this.app.use(fileUpload({
      limits: { fileSize: 10 * 1024 * 1024 }, // 10mb max
      abortOnLimit: true
      // useTempFiles : true,
      // tempFileDir : '/tmp/'
    }));
    this.app.use(MiddlewareFactory.logger);
  }

  // Init all routes for all endpoints mapped in index.ts
  private initializeEndpoints(): void {
    this.app.use('/', this.sample.router);
    // Put this at the end so it gets all call which are not mapped
    this.app.use('/', this.endpointNotMapped.bind(this));
  }

  // Init the error handling
  private initializeErrorMiddleware(): void {
    this.app.use(MiddlewareFactory.error);
  }

  private endpointNotMapped(request: express.Request, response: express.Response): void {
    ResponseFactory.make(404, {'message': 'Endpoint does not exist for this http method'}, response);
  }

  public listen(): void {
    this.app.listen(this.port, () => {
      this.loggerService.getLogger().info(`App listening on the port ${this.port}`);
    });
  }
}
