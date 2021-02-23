import { createRxDatabase, addRxPlugin, RxDatabase } from 'rxdb';
import {
  friendSchema,
  messageSchema,
  conversationSchema,
  ICollection,
} from './schemas';

addRxPlugin(require('pouchdb-adapter-leveldb'));
const leveldown = require('leveldown');

export type LocalDatabaseType = RxDatabase<ICollection>;

export const createLocalDB = async (): Promise<LocalDatabaseType> => {
  const database = await createRxDatabase<ICollection>({
    name: 'local_database',
    adapter: leveldown,
    password: 'tiny-ding-wuchvi',
    multiInstance: false,
  });

  await database.addCollections({
    friends: {
      schema: friendSchema,
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
