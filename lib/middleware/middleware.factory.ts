'use strict';

import {Request, Response, NextFunction} from 'express';
import {HttpException} from '../exceptions/http.factory';

export class MiddlewareFactory {

  public static logger(req: Request, res: Response, next: NextFunction): void {
    console.log(`${req.method} ${req.path}`);
    next();
  }

  public static error(error: HttpException, req: Request, res: Response, next: NextFunction): void {
    const status = error.status || 500;
    const message = error.message || 'Something went wrong';
    res.status(status).send({"message": message});
  }

}
