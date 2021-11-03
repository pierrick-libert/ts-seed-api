'use strict';

import {Params} from '../lib/enum';
import {PgService} from '../lib/pg/pg.service';
import {AppService} from '../lib/app/app.service';
import {Endpoint} from '../lib/app/app.interface';
import {JwtService} from '../lib/jwt/jwt.service';
import {ValidService} from '../lib/valid/valid.service';
import {ValidFactory} from '../lib/valid/valid.factory';
import {LoggerService} from '../lib/logger/logger.service';
import {HttpException} from '../lib/exceptions/http.factory';
import {Request, Response, Router, NextFunction} from 'express';
import {ResponseFactory} from '../lib/response/response.factory';
import {MiddlewareFactory} from '../lib/middleware/middleware.factory';
import {BadRequestException} from '../lib/exceptions/bad-request.exception';
import {ItemNotFoundException} from '../lib/exceptions/item-not-found.factory';
import {ResourceNotCreatedException} from '../lib/exceptions/resource-not-created.exception';

export class Sample implements Endpoint {

  public pgService: PgService;
  public logger: LoggerService;
  public router: Router = Router();
  public validService: ValidService;
  public basePath = `${AppService.basePath}/sample`;

  // Just a sample for AJV validation, you should put it somewhere else for more complex project
  public authSchema = {
    properties: {
      email: ValidFactory.getStringSchema(1),
      password: ValidFactory.getStringSchema(1)
    },
    required: ['email', 'password'],
    type: 'object'
  };

  constructor(pgService: PgService, logger: LoggerService) {
    this.pgService = pgService;
    this.logger = logger;
    this.validService = new ValidService();
    this.initializeRoutes();
  }

  public initializeRoutes(): void {
    // Get method
    this.router.get(this.basePath, (rq: Request, rs: Response) => this.getAll(rq, rs));
    this.router.get(`${this.basePath}/error-not-found`, (rq: Request, rs: Response, n: NextFunction) => this.errorNotFound(rq, rs, n));
    this.router.get(`${this.basePath}/error`, (rq: Request, rs: Response, n: NextFunction) => this.error(rq, rs, n));
    this.router.get(`${this.basePath}/bad-request`, (rq: Request, rs: Response, n: NextFunction) => this.badRequest(rq, rs, n));
    this.router.get(`${this.basePath}/resource-not-created`,
      (rq: Request, rs: Response, n: NextFunction) => this.resourceNotCreated(rq, rs, n));
    this.router.get(`${this.basePath}/logged`, MiddlewareFactory.requiresLogin,
      (rq: Request, rs: Response, n: NextFunction) => this.getLogged(rq, rs, n));
    // Post method
    this.router.post(this.basePath, (rq: Request, rs: Response) => this.create(rq, rs));
    this.router.post(`${this.basePath}/auth`, (rq: Request, rs: Response, n: NextFunction) => this.auth(rq, rs, n));
    // Put method
    this.router.put(`${this.basePath}/:id`, (rq: Request, rs: Response, n: NextFunction) => this.update(rq, rs, n));
  }

  /******************************************************************
  **                          GET Section                          **
  ******************************************************************/

  /*
  ** Method: GET
  ** Description: Get data about a specific admin
  **
  ** Path Parameters: ID from the table `admin`
  ** Query Parameters: None
  ** Body Parameters: none
  */
  public getAll(request: Request, response: Response): void {
    ResponseFactory.make(200, {'message': 'GET good'}, response);
  }

  /*
  ** Method: GET
  ** Description: Return a 404 Not Found exception
  **
  ** Path Parameters: ID from the table `admin`
  ** Query Parameters: None
  ** Body Parameters: none
  */
  public errorNotFound(request: Request, response: Response, next: NextFunction): void {
    next(new ItemNotFoundException('Resource', 'My resource'));
  }

  /*
  ** Method: GET
  ** Description: Return an Internal Error
  **
  ** Path Parameters: ID from the table `admin`
  ** Query Parameters: None
  ** Body Parameters: none
  */
  public error(request: Request, response: Response, next: NextFunction): void {
    next(new HttpException(500, 'Internal Error'));
  }

  /*
  ** Method: GET
  ** Description: Return a 400 Bad Request
  **
  ** Path Parameters: ID from the table `admin`
  ** Query Parameters: None
  ** Body Parameters: none
  */
  public badRequest(request: Request, response: Response, next: NextFunction): void {
    next(new BadRequestException('Wrong payload'));
  }

  /*
  ** Method: GET
  ** Description: Return a 400 Resource creation has failed
  **
  ** Path Parameters: ID from the table `admin`
  ** Query Parameters: None
  ** Body Parameters: none
  */
  public resourceNotCreated(request: Request, response: Response, next: NextFunction): void {
    next(new ResourceNotCreatedException());
  }

  /*
  ** Method: GET
  ** Description: Get data about the logged user
  **
  ** Path Parameters: None
  ** Query Parameters: None
  ** Body Parameters: none
  */
  public async getLogged(req: Request, response: Response, next: NextFunction): Promise<void> {
    const user = {'id': '1', 'email': req.body.email, 'role': 'user'};
    ResponseFactory.make(200, {'message': ResponseFactory.message, 'user': user}, response);
  }

  /******************************************************************
  **                          POST Section                         **
  ******************************************************************/

  /*
  ** Method: POST
  ** Description: Create a resource
  **
  ** Path Parameters: None
  ** Query Parameters: None
  ** Body Parameters: None
  */
  public create(request: Request, response: Response): void {
    ResponseFactory.make(201, {'message': 'POST good'}, response);
  }

  /*
  ** Method: POST
  ** Description: Return a JWT token for an active user
  **
  ** Path Parameters: None
  ** Query Parameters: None
  ** Body Parameters: Email and Password of an active user
  */
  public async auth(req: Request, response: Response, next: NextFunction): Promise<void> {
    // Here is an example of how to properly use the Valid module
    // The first parameter will be used to display the content of the parameters with a key before hand
    // Thus in the log, you'll be able to recognize which payload belongs to which call
    // The second parameter is an array of all params you want to check, you may have:
    // - Params.Body, - Params.Query, - Params.Path and - Params.Files
    // The third parameter is the schema to validate your payload
    // The last parameter is the request sent by express
    const valid = this.validService.checkParamsValidity('Auth User', [Params.Body], this.authSchema, req);
    if (valid.success === false) {
      return next(new BadRequestException(valid.message));
    }
    // Your PG SQL should be there!
    if (req.body.email !== 'test@kalvad.com' || req.body.password !== 'kalvad42') {
      return next(new ItemNotFoundException(req.body.email, 'User'));
    }

    // Create the token
    const user = {'id': '1', 'email': req.body.email, 'role': 'user'};
    const token = JwtService.createToken(user);
    ResponseFactory.make(200, {'message': ResponseFactory.message, 'user': user, 'token': token}, response);
  }

  /******************************************************************
  **                          PUT Section                          **
  ******************************************************************/

  /*
  ** Method: PUT
  ** Description: Update an admin
  **
  ** Path Parameters: ID from the resource
  ** Query Parameters: None
  ** Body Parameters: None
  */
  public async update(req: Request, response: Response, next: NextFunction): Promise<void> {
    ResponseFactory.make(200, {'message': 'PUT good'}, response);
  }

}
