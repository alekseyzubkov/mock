import { IncomingMessage, ServerResponse } from 'http';

import { routMock } from './routMock';
import { mocks } from '../mock/Mocks';
import { getErrorData } from '../helpers/getErrorData';
import { getBody } from '../helpers/getBody';
import { TResponseMock } from '../types/response-mock';
import { mongoDB } from '../libs/mongodb';
import { deleteMock } from './routDelete';
import { TBody } from '../types/request-body';

enum ERoutes {
  ping = '/internal/ping',
  health = '/internal/health',
  routes = '/internal/routes',
  update = '/internal/update',
  delete = '/internal/delete',
}

async function getList(body: TBody) {
  const prefix = body.prefix as string;
  if (prefix) return mongoDB.getByPrefix(prefix);
  return mocks.getList();
}
async function baseRoutes(req: IncomingMessage): Promise<TResponseMock> {
  const url = req.url!;
  const body = await getBody(req);

  switch (url) {
    case ERoutes.ping:
    case ERoutes.health:
      return { data: { message: 'OK' } };
    case ERoutes.routes:
      return { data: await getList(body) };
    case ERoutes.update:
      return { data: await mongoDB.createOrUpdate(body) };
    case ERoutes.delete:
      return { data: await deleteMock(body) };
    default:
      return routMock(req, body);
  }
}

export async function router(req: IncomingMessage, res: ServerResponse) {
  res.setHeader('content-type', 'application/json; charset=utf-8');

  try {
    const data = await baseRoutes(req);

    res.writeHead(200);
    res.write(JSON.stringify(data));
  } catch (error) {
    console.error(error);
    const { code, data } = getErrorData(error);
    res.writeHead(code);
    res.write(data);
  } finally {
    res.end();
  }
}
