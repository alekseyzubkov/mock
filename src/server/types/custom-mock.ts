import * as mongodb from 'mongodb';

import { TMockData } from '../mock/types';

export type TCustomMock = TMockData & {
  prefix: string
};

export type TCustomFilter = mongodb.Filter<TCustomMock>;
