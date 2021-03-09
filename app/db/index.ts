import { createRxDatabase, addRxPlugin } from 'rxdb';
import { userSchema, messageSchema, conversationSchema } from './schemas';

addRxPlugin(require('pouchdb-adapter-leveldb'));
const leveldown = require('leveldown');

export const createLocalDB = async (): Promise<RxDB.LocalDatabaseType> => {
  const database = await createRxDatabase<RxDB.ICollection>({
    name: 'local_database',
    adapter: leveldown,
    password: 'tiny-ding-wuchvi',
    multiInstance: false,
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
