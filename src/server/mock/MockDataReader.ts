import { readFileSync, readdirSync, statSync } from 'fs';
import { extname, join } from 'path';
import { mockValidator } from './MockValidator';
import { TMockData } from './types';
import { Mocks, mocks } from './Mocks';
import { CustomError } from '../error/CustomError';
import { Validator } from '../helpers/Validator';

export class MockDataReader {
  protected mockValidator: Validator<TMockData> = mockValidator;

  protected mocks: Mocks = mocks;

  protected dataPath: string;

  protected files: string[] = [];

  constructor(basePath: string) {
    this.dataPath = join(basePath, '../../mock-data');
  }

  loadAndValidate() {
    this.readDir(this.dataPath);
    const mocksData = this.readAndValidateMocks();
    this.mocks.addMocks(mocksData);
  }

  protected readAndValidateMocks() {
    const res = this.files.map((path) => {
      try {
        const data = this.readFile(path);
        const validData = this.mockValidator.validate(data);

        return this.addPath(path, validData);
      } catch (error) {
        throw new CustomError('readMocks', { path, error });
      }
    }).filter(Boolean);

    return res as TMockData[];
  }

  protected addPath(filePath:string, validData: TMockData | undefined) {
    if (!validData) return undefined;
    const path = filePath
      .substring(this.dataPath.length, filePath.lastIndexOf('/'));

    return {
      ...validData,
      path: `${path}${validData.path ? `/${validData.path}` : ''}`,
      filePath: filePath.substring(this.dataPath.length),
    };
  }

  protected readFile(path:string) {
    const ext = extname(path);
    if (ext === '.js') {
      // eslint-disable-next-line import/no-dynamic-require, global-require
      return require(path);
    } if (ext === '.json') {
      const content = readFileSync(path, 'utf8');
      return JSON.parse(content);
    }
    return undefined;
  }

  protected readDir(path: string) {
    const files = readdirSync(path);
    files.forEach((fname) => {
      const filePath = join(path, fname);
      const stats = statSync(filePath);
      if (stats.isFile()) {
        this.files.push(filePath);
      }
      if (stats.isDirectory()) {
        this.readDir(filePath);
      }
    });
  }
}
