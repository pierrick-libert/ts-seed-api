import {captureException} from '@sentry/node';
import {JwtService} from '../jwt/jwt.service';
import {JwtPayload} from '../jwt/jwt.interface';
import {Request, Response, NextFunction} from 'express';
import {HttpException} from '../exceptions/http.factory';
import {LoginRequiredException} from '../exceptions/login-required.exception';

export class MiddlewareFactory {

  /******************************************************************
  **                     Before calling Endpoint                   **
  ******************************************************************/

  // Middleware use before requesting the endpoints to log data
  public static logger(req: Request, res: Response, next: NextFunction): void {
    console.log(`${req.method} ${req.path}`);
    next();
  }

  // Middleware used before using the endpoint to check permissions for normal user
  public static requiresLogin(req: Request, res: Response, next: NextFunction): void {
    const header: string = req.header('Authorization') || '';
    const token: string = header.replace('Bearer ', '');

    let jwtPayload: JwtPayload;
    try {
      jwtPayload = JwtService.extractPayload(token);
      if (!jwtPayload.id) {
        console.log(`[Require Login] -> token: ${token} - jwt: ${JSON.stringify(jwtPayload)}`);
        return next(new LoginRequiredException());
      }
    } catch (err) {
      captureException(err);
      console.log(`[Require Admin Login] -> token: ${token} - err: ${err.detail || err}`);
      return next(new LoginRequiredException());
    }
    // Session
    res.locals.session = jwtPayload;

    return next();
  }

  /******************************************************************
  **                      After calling Endpoint                   **
  ******************************************************************/

  // Middleware use after using the endpoints to manage exceptions
  public static error(error: HttpException, req: Request, res: Response, next: NextFunction): void {
    const status = error.status || 500;
    const message = error.message || 'Something went wrong';
    res.status(status).send({'message': message});
  }

}
