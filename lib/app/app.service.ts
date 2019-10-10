'use strict';

import * as cors from 'cors';
import * as express from 'express';
import {Endpoint} from './app.interface';
import {ResponseFactory} from '../response/response.factory';
import {MiddlewareFactory} from '../middleware/middleware.factory';

export default class AppService {

  public port: number;
  public app: express.Application;

  constructor(endpoints: Endpoint[], port: number) {
    this.app = express();
    this.port = port;
    // Call the inits
    this.initializeMiddlewares();
    this.initializeEndpoints(endpoints);
    this.initializeErrorMiddleware();
  }

  // Init all middlewares to handle errors and so on
  private initializeMiddlewares(): void {
    this.app.use(cors());
    this.app.options('*', cors());
    this.app.use(express.json({type: '*/*'}));
    // Middleware
    this.app.use(MiddlewareFactory.logger);
  }

  // Init all routes for all endpoints mapped in index.ts
  private initializeEndpoints(endpoints: Endpoint[]): void {
    endpoints.forEach((endpoint: Endpoint) => {
      this.app.use('/', endpoint.router);
    });
    // Put this at the end so it gets all call which are not mapped
    this.app.use('/', this.endpointNotMapped.bind(this));
  }

  // Init the error handling
  private initializeErrorMiddleware(): void {
    this.app.use(MiddlewareFactory.error);
  }

  private endpointNotMapped(request: express.Request, response: express.Response): void {
    ResponseFactory.make(404, {"message": "Endpoint does not exist for this http method"}, response);
  }

  public listen(): void {
    this.app.listen(this.port, () => {
      console.log(`App listening on the port ${this.port}`);
    });
  }
}
