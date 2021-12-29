import * as ValidInterface from './valid.interface';

export class ValidFactory {

  /******************************************************************
  **                     Basic verification                        **
  ******************************************************************/

  // String basic schema
  public static getStringProperty(minLength: number = 1, format: string = ''): ValidInterface.StringSchema {
    const schema = {
      type: 'string',
      minLength
    };
    if (format !== '') {
      schema['format'] = format;
    }
    return schema;
  }
  // Number basic schema
  public static getNumberProperty(minimum: number = 0): ValidInterface.NumberSchema {
    return {
      type: 'number',
      minimum
    };
  }
  // Boolean basic schema
  public static getBooleanProperty(): ValidInterface.BooleanSchema {
    return {
      type: 'boolean'
    };
  }
  // Check basic format date
  public static getFormatDateProperty(): ValidInterface.StringSchema {
    return {
      type: 'string',
      format: 'date',
      minLength: 1,
      pattern: '^[0-9]{4}-[0-9]{2}-[0-9]{2}'
    };
  }
  // Check uuid format
  public static getUuidProperty(minLength: number = 1): ValidInterface.StringSchema {
    return {
      type: 'string',
      minLength,
      pattern: '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}'
    };
  }
  // Check if a parameter is a number for query string parameter
  public static getStringNumberProperty(): ValidInterface.StringSchema {
    return {
      type: 'string',
      minLength: 1,
      pattern: '^-?[0-9]+\.?[0-9]*'
    };
  }

  /******************************************************************
  **                     Global verification                       **
  ******************************************************************/

  // Generic valid for id
  public static getIdSchema(): any {
    return {
      properties: {
        id: ValidFactory.getStringProperty(1)
      },
      required: ['id'],
      type: 'object'
    };
  }

  // Generic valid for uuiid
  public static getUuidSchema(): any {
    return {
      properties: {
        id: ValidFactory.getUuidProperty(1)
      },
      required: ['id'],
      type: 'object'
    };
  }

}
