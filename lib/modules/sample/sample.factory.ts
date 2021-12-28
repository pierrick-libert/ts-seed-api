import {ValidFactory} from '../../valid/valid.factory';

export class SampleFactory {

  /******************************************************************
  **                        Schema Validator                       **
  ******************************************************************/

  public createSchema(): any {
    return {
      properties: {
        name: ValidFactory.getStringSchema(1),
        lastname: ValidFactory.getStringSchema(0),
      },
      required: ['name'],
      type: 'object'
    };
  }

  public updateSchema(): any {
    return {
      properties: {
        name: ValidFactory.getStringSchema(0),
        lastname: ValidFactory.getStringSchema(0),
      },
      required: [],
      type: 'object'
    };
  }
}
