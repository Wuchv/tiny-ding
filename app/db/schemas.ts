import { RxCollection, RxJsonSchema } from 'rxdb';

interface IFriend {
  uid: string;
}

export const friendSchema: RxJsonSchema<IFriend> = {
  title: 'local friend schema',
  description: '好友列表本地存储',
  version: 0,
  keyCompression: true,
  type: 'object',
  properties: {
    uid: {
      type: 'string',
      primary: true,
    },
  },
  required: ['uid'],
};

export interface ICollection {
  friends: RxCollection<IFriend>;
}
