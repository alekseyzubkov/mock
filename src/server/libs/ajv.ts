import Ajv from 'ajv';

export const ajv = new Ajv({
  allErrors: true,
  removeAdditional: true,
  coerceTypes: true,
  useDefaults: true,
});
