import cors from 'cors';
import i18n from 'i18n';
import path from 'path';
import yaml from 'yamljs';
import {Endpoint} from './app.interface';
import fileUpload from 'express-fileupload';
import {serve, setup} from 'swagger-ui-express';
import express, {RequestHandler} from 'express';
import {LoggerService} from '../logger/logger.service';
import {ResponseFactory} from '../response/response.factory';
import {MiddlewareFactory} from '../middleware/middleware.factory';

export class AppService {

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

  public listen(): void {
    this.app.listen(this.port, () => {
      LoggerService.getInstance().logger.info(`App listening on the port ${this.port}`);
    });
  }

  // Init all middlewares to handle errors and so on
  private initializeMiddlewares(): void {
    this.app.use(cors({credentials: true}));
    this.app.options('*', cors({credentials: true}));
    this.app.use(express.json({type: 'application/*'}) as RequestHandler);
    // Configure translations module
    i18n.configure({
      locales: ['en', 'fr'],
      defaultLocale: 'en',
      directory: path.join(__dirname, '../../../locales')
    });
    this.app.use(i18n.init);
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
  private initializeEndpoints(endpoints: Endpoint[]): void {
    this.app.use('/swagger', serve, setup(yaml.load('./swagger/swagger-generated.yml')));
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
    ResponseFactory.make(404, {'message': 'Endpoint does not exist for this http method'}, response);
  }
}
