import { TMockData } from './types';
import { mockSchema } from './schemas';
import { Validator } from '../helpers/Validator';

export const mockValidator = new Validator<TMockData>(mockSchema);
