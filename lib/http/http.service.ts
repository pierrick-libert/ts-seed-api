'use strict';

import * as axios from 'axios';
import * as querystring from 'querystring';

export class HttpService {

  public post(url: string, data: any, config?: any): Promise<any> {
    if (!config) {
      return axios.default.post(url, querystring.stringify(data));
    }
    return axios.default.post(url, data, config);
  }

  public put(url: string, data: any, config?: any): Promise<any> {
    if (!config) {
      return axios.default.put(url, querystring.stringify(data));
    }
    return axios.default.put(url, data, config);
  }

  public get(url: string, data: any, config?: any): Promise<any> {
    if (!config) {
      return axios.default.get(url + '?' + querystring.stringify(data));
    }
    return axios.default.get(url + '?' + querystring.stringify(data), config);
  }

  public getByPath(url: string, config?: any): Promise<any> {
    if (!config) {
      return axios.default.get(url);
    }
    return axios.default.get(url, config);
  }

}
