import * as mongodb from 'mongodb';
import { TMockData } from './types';
import { TCustomFilter, TCustomMock } from '../types/custom-mock';
import { TBody } from '../types/request-body';
import { CustomError } from '../error/CustomError';
import { mockValidator } from './MockValidator';
import { mongoDB } from '../libs/mongodb';

class CustomMocks {
  constructor(protected collection: mongodb.Collection<TCustomMock>) {
  }

  async create(prefix: string, data: TMockData) {
    const { insertedId } = await this.collection.insertOne({ prefix, ...data });
    return this.getById(insertedId);
  }

  async update(id: string, prefix: string, data: TMockData) {
    const q = { _id: this.getMongoId(id) };

    await this.collection.updateOne(q, { $set: { prefix, ...data } }, { upsert: true });
    return this.getById(id);
  }

  async getByPrefix(prefix: string) {
    const list = await this.collection.find({ prefix }).toArray();
    return list;
  }

  async getById(id: string | mongodb.BSON.ObjectId) {
    const q = { _id: this.getMongoId(id) };
    return this.collection.findOne(q);
  }

  async createOrUpdate(data: TBody) {
    // eslint-disable-next-line no-underscore-dangle
    const id = data?._id as string;
    const prefix = data?.prefix as string;
    if (!prefix) {
      throw new CustomError('prefix is required', data);
    }
    const mock = mockValidator.validate(data);

    if (id) { return this.update(id, prefix, mock); }
    return this.create(prefix, mock);
  }

  getMongoId(id: string | mongodb.BSON.ObjectId): mongodb.BSON.ObjectId {
    return new mongodb.ObjectId(id);
  }

  async deleteMock(filter: TCustomFilter): Promise<mongodb.DeleteResult> {
    return this.collection.deleteMany(filter);
  }
}

export const customMocks = new CustomMocks(mongoDB.collection);
