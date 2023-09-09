import http from 'http';

import { config } from './config';
import { mongoDB } from './libs/mongodb';
import { router } from './router';

import { MockDataReader } from './mock/MockDataReader';

async function run() {
  new MockDataReader(__dirname).loadAndValidate();

  await mongoDB.connect();

  const server = http.createServer(router);

  const { host, port } = config;
  server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
  });
}

run();
