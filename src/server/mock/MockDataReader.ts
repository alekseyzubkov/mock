import { readFileSync, readdirSync, statSync } from 'fs';
import { extname, join } from 'path';
import { MockValidator, mockValidator } from './MockValidator';
import { TMockData } from './types';
import { Mocks, mocks } from './Mocks';
import { CustomError } from '../error/CustomError';

export class MockDataReader {
  protected mockValidator: MockValidator = mockValidator;

  protected mocks: Mocks = mocks;


  protected dataPath: string;

  protected files: string[] = [];

  constructor( basePath: string) {
    this.dataPath = join(basePath, '../../mock-data');
  }

  loadAndValidate() {
    this.readDir(this.dataPath);
    const mocksData = this.readAndValidateMocks();
    this.mocks.addMocks(mocksData);

  }


  protected readAndValidateMocks() {
    const res = this.files.map(path => {
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
      path: `${path}${validData.path ? '/' + validData.path : '' }`,
    };

  }

  protected readFile(path:string) {
    const ext = extname(path);
    if (ext === '.js') {
      return require(path);
    } else if (ext === '.json') {
      const content = readFileSync(path, 'utf8');
      return JSON.parse(content);
    }
    

  }

  protected readDir(path: string) {
    const files = readdirSync(path);
    files.forEach(fname => {
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

