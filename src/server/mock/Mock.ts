import { IFilter, TMockData } from './types';
import { TRequestData } from '../types/request-data';
import { BaseFilter, BodyFilter, PathParamsFilter } from './filters';

export class Mock {
  protected filters: IFilter[];

  constructor(private readonly data: TMockData) {
    const { path, options } = data;
    this.filters = [
      new BaseFilter(data.headers, { type: options.headers_match_type, path }, 'headers'),
      new PathParamsFilter(data.path_params, { type: options.path_params_match_type, path }, 'path'),
      new BaseFilter(data.query, { type: options.query_match_type, path }, 'query'),
      new BodyFilter(data.body),

    ];
  }

  getResponseData(data: TRequestData) {
    const isMatch = this.filters.every((filter) => filter.isMatch(data));

    if (!isMatch) { return undefined; }

    return {
      statusCode: this.data.options.result_status,
      data: this.data.result_data,
    };
  }

  get mock() {
    return this.data;
  }
}
