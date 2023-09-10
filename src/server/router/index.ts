import { IncomingMessage, ServerResponse } from 'http';
import request from 'request';

import { routMock } from './routMock';
import { mocks } from '../mock/Mocks';
import { getErrorData } from '../helpers/getErrorData';
import { getBody } from '../helpers/getBody';
import { TResponseMock } from '../types/response-mock';
import { deleteMock } from './routDelete';
import { TBody } from '../types/request-body';
import { customMocks } from '../mock/CustomMocks';
import { PROXY_HEADER } from '../constant/headers';

enum ERoutes {
  ping = '/internal/ping',
  health = '/internal/health',
  routes = '/internal/routes',
  update = '/internal/update',
  delete = '/internal/delete',
}

async function getList(body: TBody) {
  const prefix = body.prefix as string;
  if (prefix) return customMocks.getByPrefix(prefix);
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
      return { data: await customMocks.createOrUpdate(body) };
    case ERoutes.delete:
      return { data: await deleteMock(body) };
    default:
      return routMock(req, body);
  }
}
function proxyReq(req: IncomingMessage, res: ServerResponse) {
  const url = `http://mobile-gateway-service-v2.yc.dev.sravni-team.ru${req.url!}`;
  req.pipe(request(url)).pipe(res);
}

async function baseReq(req: IncomingMessage, res: ServerResponse) {
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
export async function router(req: IncomingMessage, res: ServerResponse) {
  if (req.headers?.[PROXY_HEADER]) {
    proxyReq(req, res);
  } else {
    baseReq(req, res);
  }
}
