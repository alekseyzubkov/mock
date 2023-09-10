/* eslint-disable max-classes-per-file */
import * as mongodb from 'mongodb';

import { config } from '../config';
import { TCustomMock } from '../types/custom-mock';

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

  get collection() {
    return this.client.db().collection<TCustomMock>(this.collectionName);
  }
}

export const mongoDB = new Mongo();
