import * as mongodb from 'mongodb';

import { TMockData } from '../mock/types';

export type TCustomMock = Omit<TMockData, 'filePath'> & {
  prefix: string
};

export type TCustomFilter = mongodb.Filter<TCustomMock>;
