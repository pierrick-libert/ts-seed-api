import {ValidFactory} from '../../valid/valid.factory';

export class SampleFactory {

  /******************************************************************
  **                        Schema Validator                       **
  ******************************************************************/

  public createSchema(): any {
    return {
      properties: {
        name: ValidFactory.getStringProperty(1),
        lastname: ValidFactory.getStringProperty(0),
      },
      required: ['name'],
      type: 'object'
    };
  }

  public updateSchema(): any {
    return {
      properties: {
        id: ValidFactory.getUuidProperty(),
        name: ValidFactory.getStringProperty(0),
        lastname: ValidFactory.getStringProperty(0),
      },
      required: [],
      type: 'object'
    };
  }
}
