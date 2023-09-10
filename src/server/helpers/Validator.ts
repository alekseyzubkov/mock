import Ajv, { ValidateFunction } from 'ajv';
import { JSONSchemaType } from 'ajv/dist/core';
import { cloneDeep } from 'lodash';
import { ValidateError } from '../error/ValidateError';
import { ajv } from '../libs/ajv';

export class Validator<T> {
  protected validator: ValidateFunction<T>;

  protected ajv: Ajv = ajv;

  constructor(schema: JSONSchemaType<T>) {
    this.validator = ajv.compile(schema);
  }

  validate(inputData: unknown) {
    const data = cloneDeep(inputData);
    const isValid = this.validator(data);

    if (isValid) { return data; }

    throw new ValidateError({
      data: inputData,
      errors: this.validator.errors,
    });
  }
}
