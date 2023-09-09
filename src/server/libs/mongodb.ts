import * as mongodb from 'mongodb';
import { config } from '../config';
import { TMockData } from '../mock/types';



// interface Pet {
//   name: string;
//   kind: 'dog' | 'cat' | 'fish';
// }

// const client = new MongoClient('mongodb://localhost:27017');
// const pets = client.db().collection<Pet>('pets');

type TCustomMock = TMockData & {
  prefix: string
};
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

  protected get collection() {
    return this.client.db().collection<TCustomMock>(this.collectionName);

  }


}



export const mongoDB = new Mongo();
