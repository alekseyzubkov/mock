import { JSONSchemaType } from 'ajv';
import * as mongodb from 'mongodb';

import { TBody } from '../types/request-body';
import { Validator } from '../helpers/Validator';
import { TCustomFilter } from '../types/custom-mock';
import { mongoDB } from '../libs/mongodb';

type TDelBody = {
  id?: string | string[];
  prefix?: string;
};
const schema: JSONSchemaType<TDelBody> = {
  type: 'object',
  anyOf: [
    { required: ['id'] },
    { required: ['prefix'] },
  ],
  properties: {
    id: {
      nullable: true,
      type: ['string', 'array'],
      oneOf: [
        { type: 'string' },
        { type: 'array', items: { type: 'string' } },
      ],
    },
    prefix: {
      nullable: true,
      type: 'string',
    },
  },
  additionalProperties: false,
};

const bodyValidator = new Validator<TDelBody>(schema);

function getMongoId(id: string): mongodb.BSON.ObjectId {
  return new mongodb.ObjectId(id);
}

export async function deleteMock(body: TBody) {
  const { id, prefix } = bodyValidator.validate(body);
  const filter: TCustomFilter = {};
  if (id) {
    // eslint-disable-next-line no-underscore-dangle
    filter._id = (typeof id === 'string') ? getMongoId(id) : { $in: id.map(getMongoId) };
  }
  if (prefix) {
    filter.prefix = prefix;
  }
  return mongoDB.deleteMock(filter);
}
