'use strict';

import {Response} from 'express';

export class ResponseFactory {

  public static make(status: number, body: any, response: Response): void {
    response.status(status).send(body);
  }

}
