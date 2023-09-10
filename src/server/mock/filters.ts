/* eslint-disable max-classes-per-file */

import UrlPattern from 'url-pattern';
import { VERSION_HEADER } from '../constant/headers';
import { TRequestData } from '../types/request-data';
import {
  IFilter, TFilter, TFilterItem, TMatchType,
} from './types';
import { compareObject } from '../helpers/compareObject';

export class BaseFilter implements IFilter {
  protected filterItems: TFilterItem[] = [];

  constructor(
    filter: TFilter,
    protected options: { type: TMatchType, path: string },
    protected filed: keyof TRequestData,
  ) {
    this.filterItems = Object
      .entries(filter)
      .map(([key, value]) => ({ key, value }));
  }

  isMatch(requestData: TRequestData) {
    if (this.filterItems.length === 0) return true;
    const data = this.getData(requestData);
    if (!data) { return false; }
    return this.compare(data);
  }

  protected getData(requestData: TRequestData): Record<string, string> | undefined {
    return requestData[this.filed] as Record<string, string>;
  }

  protected compare(data: Record<string, string>) {
    const { type } = this.options;

    const compareFn = ({ key, value }: TFilter) => {
      if (key === VERSION_HEADER && value) {
        return parseInt(data[key], 10) <= parseInt(value, 10);
      }
      return data[key] === value;
    };

    if (type === TMatchType.ALL) {
      return this.filterItems.every(compareFn);
    } if (type === TMatchType.ANY) {
      return this.filterItems.some(compareFn);
    }
    return false;
  }
}

export class PathParamsFilter extends BaseFilter {
  protected matchPath(url: string): Record<string, string> | undefined {
    const { path } = this.options;
    if (url.includes('/:')) {
      const pattern = new UrlPattern(url);
      return pattern.match(path) || undefined;
    }
    return (url === path ? {} : undefined);
  }

  protected getData(requestData: TRequestData): Record<string, string> | undefined {
    const data = this.matchPath(requestData.path);
    return data;
  }
}

export class BodyFilter implements IFilter {
  protected readonly isNeedCompareBody: boolean = true;

  constructor(
    protected mockBody: object,
  ) {
    this.isNeedCompareBody = Boolean(Object.keys(mockBody).length);
  }

  isMatch({ body }: TRequestData) {
    if (!this.isNeedCompareBody) return true;
    return compareObject(this.mockBody, body);
  }
}
