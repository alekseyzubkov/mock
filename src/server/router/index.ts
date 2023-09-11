import { IncomingMessage, ServerResponse } from 'http';
import request from 'request';

import { getErrorData } from '../helpers/getErrorData';
import { PROXY_HEADER } from '../constant/headers';
import { routBase } from './routBase';
import { getResponseDataByPrefix } from './routMock';
import { getBody } from '../helpers/getBody';

async function proxyReq(req: IncomingMessage, res: ServerResponse) {
  const prefix = req.headers?.[PROXY_HEADER] as string;
  const body = await getBody(req);
  const requestData = await getResponseDataByPrefix(req, body, prefix);

  if (requestData) {
    const { data, statusCode } = requestData;
    res.writeHead(statusCode || 200);
    res.write(JSON.stringify(data));
    res.end();
  } else {
    const url = `http://mobile-gateway-service-v2.yc.dev.sravni-team.ru${req.url!}`;
    req.pipe(request(url)).pipe(res);
  }
}

async function baseReq(req: IncomingMessage, res: ServerResponse) {
  res.setHeader('content-type', 'application/json; charset=utf-8');
  try {
    const { data, statusCode } = await routBase(req);
    res.writeHead(statusCode || 200);
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
