import { IncomingMessage, ServerResponse } from 'http';

import { routMock } from './routMock';
import { EHttpMethods } from '../constant/http-methods';
import { mocks } from '../mock/Mocks';
import { mockValidator } from '../mock/MockValidator';
import { getErrorData } from '../helpers/getErrorData';
import { getBody } from '../helpers/getBody';
import { TResponseMock } from '../types/response-mock';



async function baseRoutes(req: IncomingMessage): Promise<TResponseMock> {
  const url = req.url!;
  const method = req.method! as EHttpMethods;

  const body = await getBody(req);

  if (url === '/routes') {
    return { data: mocks.getList() };
  }
  if (url === '/test') {
   
    return { data: {} };
  }
  if (url === '/validate' && method === EHttpMethods.POST) {
    return { data: mockValidator.validate(body) };
  }

  return routMock(req, body);
}


export async function router(req: IncomingMessage, res: ServerResponse) {
  res.setHeader('content-type', 'application/json; charset=utf-8');

  try {
    const data = await baseRoutes(req);

    res.writeHead(200);
    res.write(JSON.stringify(data));

  } catch (error) {
    const { code, data } = getErrorData(error);
    res.writeHead(code);
    res.write(data);

  } finally {
    res.end();

  }


}
