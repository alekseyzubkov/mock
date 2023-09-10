import { JSONSchemaType } from 'ajv';
import { TFilter, TMatchType, TMockData } from './types';
import { EHttpMethods } from '../constant/http-methods';

const filterTypeSchema: JSONSchemaType<TMatchType> = {
  type: 'string',
  enum: Object.values(TMatchType),
  default: TMatchType.ALL,
};

const filterSchema: JSONSchemaType<TFilter> = {
  type: 'object',
  default: {},
  required: [],
  additionalProperties: { type: 'string' },
};

export const mockSchema: JSONSchemaType<TMockData> = {
  type: 'object',
  required: [
    'path', 'result_data',
  ],
  properties: {
    filePath: { type: 'string', nullable: true },
    path: { type: 'string' },
    method: {
      type: 'string',
      enum: Object.values(EHttpMethods),
      default: EHttpMethods.GET,
    },
    options: {
      type: 'object',
      default: {
        result_status: 200,
        headers_match_type: filterTypeSchema.default,
        path_params_match_type: filterTypeSchema.default,
        query_match_type: filterTypeSchema.default,
      },
      required: [],
      additionalProperties: false,
      properties: {
        headers_match_type: filterTypeSchema,
        path_params_match_type: filterTypeSchema,
        query_match_type: filterTypeSchema,
        result_status: {
          type: 'number',
          default: 200,
        },
      },
    },
    headers: filterSchema,
    path_params: filterSchema,
    query: filterSchema,
    body: {
      type: 'object',
      required: [],
      default: {},
      additionalProperties: true,
    },
    result_data: {
      type: 'object',
      required: [],
      additionalProperties: true,
    },
  },
  additionalProperties: false,
};
