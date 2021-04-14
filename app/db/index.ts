import { createRxDatabase, addRxPlugin } from 'rxdb';
import { userSchema, messageSchema, conversationSchema } from './schemas';

addRxPlugin(require('pouchdb-adapter-leveldb'));
const leveldown = require('leveldown');

let database: RxDB.LocalDatabaseType = null;
const createLocalDB = async (): Promise<RxDB.LocalDatabaseType> => {
  if (database) {
    return database;
  }
  database = await createRxDatabase<RxDB.ICollection>({
    name: 'local_database',
    adapter: leveldown,
    password: 'tiny-ding-wuchvi',
  });

  await database.addCollections({
    users: {
      schema: userSchema,
    },
    messages: {
      schema: messageSchema,
    },
    conversations: {
      schema: conversationSchema,
    },
  });
  return database;
};

export { createLocalDB, database };
