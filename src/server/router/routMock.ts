import { parse } from 'node:url';
import { IncomingMessage } from 'node:http';

import { EHttpMethods } from '../constant/http-methods';
import { TRequestData } from '../types/request-data';
import { Mocks, mocks } from '../mock/Mocks';
import { NotFoundError } from '../error/NotFoundError';
import { PREFIX_HEADER } from '../constant/headers';
import { mongoDB } from '../libs/mongodb';
import { mockValidator } from '../mock/MockValidator';
import { TResponseMock } from '../types/response-mock';

async function getPrefixResponseData(data: TRequestData) {
  const prefix = data.headers[PREFIX_HEADER];
  if (!prefix) { return undefined; }

  const mocksData = await mongoDB.getByPrefix(prefix as string);

  const validMockData = mocksData.map((d) => mockValidator.validate(d));
  const prefixMocks = new Mocks().addMocks(validMockData);

  return prefixMocks.getResponseData(data);
}

async function getResponseData(data: TRequestData) {
  const prefixResponseData = await getPrefixResponseData(data);
  const responseData = mocks.getResponseData(data);
  return prefixResponseData || responseData;
}

export async function routMock(
  req: IncomingMessage,
  body: TRequestData['body'],
): Promise<TResponseMock> {
  const url = req.url!;
  const method = req.method! as EHttpMethods;
  const { headers } = req;

  const urlData = parse(url, true);
  const path = urlData.pathname!;
  const { query } = urlData;

  const data: TRequestData = {
    headers, method, path, query, body,
  };

  const responseData = await getResponseData(data);

  if (responseData) { return responseData; }

  throw new NotFoundError(data);
}
