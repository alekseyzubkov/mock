import UrlPattern from 'url-pattern';

import { TFilter, TFilterItem, TMatchType, TMockData, TResIsMatch } from './types';
import { TRequestData } from '../types/request-data';
import { VERSION_HEADER } from '../constant/headers';
import { compareObject } from '../helpers/compareObject';



export class Mock {
  private isMatchPathFn: (path: string) => TResIsMatch;

  protected readonly headersFilter: TFilterItem[] = [];

  protected readonly pathParamsFilter: TFilterItem[] = [];

  protected readonly queryFilter: TFilterItem[] = [];

  protected readonly isNeedCompareBody: boolean = true;

  constructor(private readonly data: TMockData) {
    const path = data.path;
    if (path.includes('/:')) {
      const pattern = new UrlPattern(path);
      this.isMatchPathFn = (url: string) => pattern.match(url);
    } else {
      this.isMatchPathFn = (url: string) => url === this.data.path ? {} : null;
    }

    this.headersFilter = this.getFilter(data.headers);
    this.pathParamsFilter = this.getFilter(data.path_params);
    this.queryFilter = this.getFilter(data.query);

    this.isNeedCompareBody = Boolean(Object.keys(data.body).length);
  }

  private getFilter(data: TFilter): TFilterItem[] {
    return Object
      .entries(data)
      .map(([key, value]) => ({ key, value }));
  }

  getResponseData(data: TRequestData) {
    const isMatch =  [
      this.isMatchPathData,
      this.isMatchHeader,
      this.isMatchQuery,
      this.isMatchBody,
    ].every(fn => fn.call(this, data));

    
    if (!isMatch) { return; }

    return {
      statusCode: this.data.options.result_status,
      data: this.data.result_data,
    };
  }

  get mock() {
    return this.data;
  }

  protected isMatchBody({ body }: TRequestData): boolean {

    if (!this.isNeedCompareBody) { return true; }

    return compareObject(this.data.body, body);
  }

  protected isMatchPathData({ path }: TRequestData): boolean {
    const matchPathData = this.isMatchPathFn(path);
    if (matchPathData === null) return false;

    return this.filterByType(
      this.pathParamsFilter,
      this.data.options.path_params_match_type,
      matchPathData,
    );
  }

  protected isMatchHeader({ headers }: TRequestData): boolean {
    return this.filterByType(
      this.headersFilter,
      this.data.options.headers_match_type,
      headers as TFilter,
    );
  }

  protected isMatchQuery({ query }: TRequestData): boolean {
    return this.filterByType(
      this.queryFilter,
      this.data.options.query_match_type,
      query as TFilter,
    );
  }

  protected filterByType(filters: TFilterItem[], type: TMatchType, data: TFilter): boolean {

    if (filters.length === 0) return true;

    const compareFn = ({ key, value }: TFilter) => {
      if (key === VERSION_HEADER && value) {
        return parseInt(data[key]) <= parseInt(value);
      }
      return data[key] === value;
    };

    if (type === TMatchType.ALL) {
      return filters.every(compareFn); 
    } else if (type === TMatchType.ANY) {
      return filters.some(compareFn);
    }
    return false;

  }
}
