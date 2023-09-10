import * as mongodb from 'mongodb';

import { config } from '../config';
import { TMockData } from '../mock/types';
import { mockValidator } from '../mock/MockValidator';
import { TBody } from '../types/request-body';

import { CustomError } from '../error/CustomError';
import { TCustomFilter, TCustomMock } from '../types/custom-mock';

export class Mongo {
  protected client: mongodb.MongoClient;

  protected collectionName: string;

  constructor() {
    this.client = new mongodb.MongoClient(config.mongo.connectionString);
    this.collectionName = config.mongo.collectionName;
  }

  async connect() {
    await this.client.connect();
    const db = this.client.db();
    console.log(`Successfully connected to database: ${db.databaseName}`);
  }

  async getByPrefix(prefix: string) {
    const list = await this.collection.find({ prefix }).toArray();
    return list;
  }

  async getById(id: string | mongodb.BSON.ObjectId) {
    const q = { _id: this.getMongoId(id) };
    return this.collection.findOne(q);
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

  protected get collection() {
    return this.client.db().collection<TCustomMock>(this.collectionName);
  }

  getMongoId(id: string | mongodb.BSON.ObjectId): mongodb.BSON.ObjectId {
    return new mongodb.ObjectId(id);
  }

  async deleteMock(filter: TCustomFilter): Promise<mongodb.DeleteResult> {
    return this.collection.deleteMany(filter);
  }
}
export const mongoDB = new Mongo();
