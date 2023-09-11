import { parse } from 'node:url';
import { IncomingMessage } from 'node:http';

import { EHttpMethods } from '../constant/http-methods';
import { TRequestData } from '../types/request-data';
import { Mocks, mocks } from '../mock/Mocks';
import { NotFoundError } from '../error/NotFoundError';
import { PREFIX_HEADER } from '../constant/headers';
import { mockValidator } from '../mock/MockValidator';
import { TResponseMock } from '../types/response-mock';
import { customMocks } from '../mock/CustomMocks';

async function getDataByPrefix(
  data: TRequestData,
  inputPrefix?: string,
): Promise < TResponseMock | undefined > {
  const prefix = inputPrefix || data.headers[PREFIX_HEADER];

  if (!prefix) { return undefined; }

  const mocksData = await customMocks.getByPrefix(prefix as string);

  const validMockData = mocksData.map((d) => mockValidator.validate(d));
  const prefixMocks = new Mocks().addMocks(validMockData);

  return prefixMocks.getResponseData(data);
}

async function getData(data: TRequestData): Promise<TResponseMock | undefined> {
  const prefixResponseData = await getDataByPrefix(data);
  const responseData = mocks.getResponseData(data);
  return prefixResponseData || responseData;
}

function getRequestData(
  req: IncomingMessage,
  body: TRequestData['body'],
): TRequestData {
  const url = req.url!;
  const method = req.method! as EHttpMethods;
  const { headers } = req;

  const urlData = parse(url, true);
  const path = urlData.pathname!;
  const { query } = urlData;

  const data: TRequestData = {
    headers, method, path, query, body,
  };
  return data;
}

export async function getResponseDataByPrefix(
  req: IncomingMessage,
  body: TRequestData['body'],
  prefix: string,
) {
  const data: TRequestData = getRequestData(req, body);

  return getDataByPrefix(data, prefix);
}
export async function getResponseData(
  req: IncomingMessage,
  body: TRequestData['body'],
): Promise<TResponseMock> {
  const data: TRequestData = getRequestData(req, body);

  const responseData = await getData(data);

  if (responseData) { return responseData; }

  throw new NotFoundError(data);
}
