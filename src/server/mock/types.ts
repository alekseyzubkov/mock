import { EHttpMethods } from '../constant/http-methods';

export type TMockData = {
  filePath?: string;
  path: string;
  method: EHttpMethods,
  options: {
    headers_match_type: TMatchType,
    path_params_match_type: TMatchType,
    query_match_type: TMatchType,
    result_status: number,
  },
  headers: TFilter
  path_params: TFilter
  query: TFilter
  body: Record<string, unknown>

  result_data: Record<string, unknown>
};
export type TFilter = { [key: string]: string };

export enum TMatchType {
  'ALL' = 'all',
  'ANY' = 'any',
}

export type TResIsMatch = Record<string, string> | null;

export type TFilterItem = { key: string, value: string };
