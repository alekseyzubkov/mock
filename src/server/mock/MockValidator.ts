import Ajv, { ValidateFunction } from 'ajv';
import { TMockData } from './types';
import { mockSchema } from './schemas';
import { ValidateError } from '../error/ValidateError';

export class MockValidator {
  protected validator: ValidateFunction<TMockData>;

  constructor() {
    const ajv = new Ajv({
      allErrors: true,
      removeAdditional: true,
      coerceTypes: true,
      useDefaults: true,
    });
    this.validator = ajv.compile(mockSchema);
  }

  validate(data:unknown) {
    const isValid = this.validator(data);

    if (isValid) { return data; }

    throw new ValidateError({
      data,
      errors: this.validator.errors,
    });
  }
}


export const mockValidator = new MockValidator();


