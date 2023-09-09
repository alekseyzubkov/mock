import { EHttpMethods } from '../constant/http-methods';
import { TRequestData } from '../types/request-data';
import { TResponseMock } from '../types/response-mock';
import { Mock } from './Mock';
import { TMockData } from './types';

export class Mocks {
  protected mocksByMethod: { [key in EHttpMethods]: Set<Mock> } = {
    [EHttpMethods.GET]: new Set(),
    [EHttpMethods.POST]: new Set(),
    [EHttpMethods.PUT]: new Set(),
    [EHttpMethods.DELETE]: new Set(),
  };

  addMocks(mocksData: TMockData[]) {
    mocksData.forEach((mockData) => {
      this.addMock(mockData);
    });
    return this;
  }

  addMock(mockData: TMockData) {
    this.mocksByMethod[mockData.method].add(new Mock(mockData));
    return this;
  }

  getResponseData(data: TRequestData): TResponseMock | undefined {
    const list = this.mocksByMethod[data.method];

    for (const mockClass of list) {
      const responseData = mockClass.getResponseData(data);
      if (responseData) return responseData;
    }

    return undefined;
  }

  getList(): TMockData[] {
    return Object
      .values(this.mocksByMethod)
      .map((list) => Array.from(list))
      .flat()
      .filter(Boolean)
      .map((el) => el.mock);
  }
}

export const mocks = new Mocks();
