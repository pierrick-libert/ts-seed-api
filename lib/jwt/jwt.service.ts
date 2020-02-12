'use strict';

import {Config} from '../config';
import * as jwt from 'jsonwebtoken';
import * as JwtInterface from './jwt.interface';

export class JwtService {

  public static createToken(data: JwtInterface.JwtPayload): string {
    return jwt.sign(Object.assign({}, data), Config.secretKey, {expiresIn: '30 days'});
  }

  public static extractPayload(token: string): JwtInterface.JwtPayload {
    return jwt.verify(token, Config.secretKey) as JwtInterface.JwtPayload;
  }

}
