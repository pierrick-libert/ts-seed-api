import {Params} from '../lib/enum';
import {Database} from '../lib/db/db.service';
import {Sample} from '../models/models/sample';
import {Repository, InsertResult} from 'typeorm';
import {Endpoint} from '../lib/app/app.interface';
import {ValidService} from '../lib/valid/valid.service';
import {ValidFactory} from '../lib/valid/valid.factory';
import {LoggerService} from '../lib/logger/logger.service';
import {HttpException} from '../lib/exceptions/http.factory';
import {Request, Response, Router, NextFunction} from 'express';
import {ResponseFactory} from '../lib/response/response.factory';
import {SampleFactory} from '../lib/modules/sample/sample.factory';
import {BadRequestException} from '../lib/exceptions/bad-request.exception';
import {ItemNotFoundException} from '../lib/exceptions/item-not-found.factory';
import {ResourceNotCreatedException} from '../lib/exceptions/resource-not-created.exception';

export class SampleEndpoint implements Endpoint {

  public factory: SampleFactory;
  public router: Router = Router();
  public validService: ValidService;
  public repository: Repository<Sample>;
  public basePath = '/sample';

  constructor() {
    this.factory = new SampleFactory();
    this.validService = new ValidService();
    this.initializeRoutes();
  }

  public async init(orm: string = 'default'): Promise<SampleEndpoint> {
    const connection = await Database.getInstance(orm).getConnection();
    this.repository = await connection.getRepository(Sample);
    return this;
  }

  public initializeRoutes(): void {
    // Get method
    this.router.get(this.basePath, (rq: Request, rs: Response, n: NextFunction) => this.getAll(rq, rs, n));
    this.router.get(`${this.basePath}/:id`, (rq: Request, rs: Response, n: NextFunction) => this.getById(rq, rs, n));
    // Post method
    this.router.post(this.basePath, (rq: Request, rs: Response, n: NextFunction) => this.create(rq, rs, n));
    // Put method
    this.router.put(`${this.basePath}/:id`, (rq: Request, rs: Response, n: NextFunction) => this.update(rq, rs, n));
    // Delete method
    this.router.delete(`${this.basePath}/:id`, (rq: Request, rs: Response, n: NextFunction) => this.delete(rq, rs, n));
  }

  /******************************************************************
  **                          GET Section                          **
  ******************************************************************/

  /*
  ** Method: GET
  ** Description: Get a list of samples
  **
  ** Path Parameters: None
  ** Query Parameters: None
  ** Body Parameters: none
  */
  public async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    let data: Sample[];
    try {
      data = await this.repository.createQueryBuilder('sample').getMany();
    } catch (error) {
      LoggerService.getInstance().logger.error(error);
      return next(new HttpException(500, error.message));
    }
    ResponseFactory.make(200, data, res);
  }

  /*
  ** Method: GET
  ** Description: Get a specific sample from its ID
  **
  ** Path Parameters: ID of the resource
  ** Query Parameters: None
  ** Body Parameters: none
  */
  public async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    // First check if the value is correct
    const valid = this.validService.checkParamsValidity(
      '[Sample] Get By Id', [Params.Path], ValidFactory.getUuidSchema(), req);
    if (valid.success === false) {
      return next(new BadRequestException(valid.message));
    }
    // Try to retrieve the resource from its ID
    let data: Sample | undefined = {} as Sample | undefined;
    try {
      data = await this.repository.createQueryBuilder('sample')
        .where('sample.id = :id', {id: req.params.id}).getOne();
      if (!data) {
        return next(new ItemNotFoundException(req.params.id, 'Sample'));
      }
    } catch (error) {
      LoggerService.getInstance().logger.error(error);
      return next(new HttpException(500, error.message));
    }
    ResponseFactory.make(200, data, res);
  }

  /******************************************************************
  **                          POST Section                         **
  ******************************************************************/

  /*
  ** Method: POST
  ** Description: Create a sample
  **
  ** Path Parameters: None
  ** Query Parameters: None
  ** Body Parameters: Refers to the model `Sample` in `/models/models/sample.ts`
  */
  public async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    // First check if the value is correct
    const valid = this.validService.checkParamsValidity(
      '[Sample] Create', [Params.Body], this.factory.createSchema(), req);
    if (valid.success === false) {
      return next(new BadRequestException(valid.message));
    }
    // Try to create the resource from the body
    let data: InsertResult = {} as InsertResult;
    try {
      data = await this.repository.insert(req.body as Sample);
      if (!data || data.raw.length === 0) {
        return next(new ResourceNotCreatedException());
      }
    } catch (error) {
      LoggerService.getInstance().logger.error(error);
      return next(new HttpException(500, error.message));
    }
    ResponseFactory.make(201, {'id': data.raw[0].id}, res);
  }

  /******************************************************************
  **                          PUT Section                          **
  ******************************************************************/

  /*
  ** Method: PUT
  ** Description: Update a sample
  **
  ** Path Parameters: ID from the resource
  ** Query Parameters: None
  ** Body Parameters: Refers to the model `Sample` in `/models/models/sample.ts`
  */
  public async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    // First check if the value is correct
    const valid = this.validService.checkParamsValidity(
      '[Sample] Update', [Params.Body, Params.Path], this.factory.updateSchema(), req);
    if (valid.success === false) {
      return next(new BadRequestException(valid.message));
    }
    // Try to update the resource from the body
    try {
      await this.repository.update(req.params.id, req.body as Sample);
    } catch (error) {
      LoggerService.getInstance().logger.error(error);
      return next(new HttpException(500, error.message));
    }
    ResponseFactory.make(200, {'id': req.params.id}, res);
  }

  /******************************************************************
  **                         DELETE Section                        **
  ******************************************************************/

  /*
  ** Method: DELETE
  ** Description: Delete a sample
  **
  ** Path Parameters: ID from the resource
  ** Query Parameters: None
  ** Body Parameters: None
  */
  public async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    // First check if the value is correct
    const valid = this.validService.checkParamsValidity(
      '[Sample] Delete', [Params.Path], ValidFactory.getUuidSchema(), req);
    if (valid.success === false) {
      return next(new BadRequestException(valid.message));
    }
    // Try to delete the resource
    try {
      await this.repository.delete(req.params.id);
    } catch (error) {
      LoggerService.getInstance().logger.error(error);
      return next(new HttpException(500, error.message));
    }
    ResponseFactory.make(200, {}, res);
  }
}
