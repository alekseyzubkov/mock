import { IncomingMessage } from 'http';
import { EHttpMethods } from '../constant/http-methods';
import { TBody } from '../types/request-body';

export function getBody(req: IncomingMessage): Promise<TBody> | TBody {
  const method = req.method! as EHttpMethods;

  if (method === EHttpMethods.GET) {
    return {};
  }
  return new Promise((res) => {
    let body: unknown;
    req
      .on('data', (chunk) => {
        try {
          const text = chunk.toString();
          body = JSON.parse(text);
        } catch (error) {
          body = {};
        }
      })
      .on('end', () => {
        res((body || {}) as TBody);
      });
  });
}
