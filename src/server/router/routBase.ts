import { IncomingMessage } from 'http';
import { TResponseMock } from '../types/response-mock';
import { getBody } from '../helpers/getBody';
import { customMocks } from '../mock/CustomMocks';
import { deleteMock } from './routDelete';
import { getResponseData } from './routMock';
import { TBody } from '../types/request-body';
import { mocks } from '../mock/Mocks';

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

export async function routBase(req: IncomingMessage): Promise<TResponseMock> {
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
      return getResponseData(req, body);
  }
}
