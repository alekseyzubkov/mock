import { IncomingHttpHeaders } from 'http';
import { ParsedUrlQuery } from 'querystring';
import { EHttpMethods } from '../constant/http-methods';

export type TRequestData = {
  path: string;
  headers: IncomingHttpHeaders,
  query: ParsedUrlQuery,
  body: Record<string, unknown>
  method: EHttpMethods,
};
