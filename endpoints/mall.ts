'use strict';

import {Endpoint} from '../lib/app/app.interface';
import { HttpException} from '../lib/exceptions/http.factory';
import {Request, Response, Router, NextFunction} from 'express';
import {ResponseFactory} from '../lib/response/response.factory';
import {ItemNotFoundException} from '../lib/exceptions/item-not-found.factory';

export default class Mall implements Endpoint {

  public basePath = '/mall';
  public router: Router = Router();

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes(): void {
    this.router.get(this.basePath, this.getAll.bind(this));
    this.router.post(this.basePath, this.create.bind(this));
    this.router.get(this.basePath + '/errornotfound', this.errorNotFound.bind(this));
    this.router.get(this.basePath + '/error', this.error.bind(this));
  }

  public getAll(request: Request, response: Response): void {
    ResponseFactory.make(200, {"message": "GET good"}, response);
  }

  public create(request: Request, response: Response): void {
    ResponseFactory.make(200, {"message": "POST good"}, response);
  }

  public errorNotFound(request: Request, response: Response, next: NextFunction): void {
    next(new ItemNotFoundException('Mall', 'Grand mall'));
  }

  public error(request: Request, response: Response, next: NextFunction): void {
    next(new HttpException(500, 'Grand mall'));
  }
}
