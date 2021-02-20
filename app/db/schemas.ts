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

enum EMsgType {
  TEXT = 'text',
  IMAGE = 'image',
  FILE = 'file',
}

interface IMessage {
  msgId: string;
  from: string;
  to: string;
  msgType: EMsgType;
  content: string;
  timestamp: number;
}

export const messageSchema: RxJsonSchema<IMessage> = {
  title: 'local message schema',
  description: '本地消息列表',
  version: 0,
  keyCompression: true,
  type: 'object',
  properties: {
    msgId: {
      type: 'string',
      primary: true,
    },
    from: {
      type: 'string',
    },
    to: {
      type: 'string',
    },
    msgType: {
      type: 'string',
    },
    content: {
      type: 'string',
    },
    timestamp: {
      type: 'number',
    },
  },
  required: ['msgId', 'from', 'to', 'msgType', 'content'],
};

export interface ICollection {
  friends: RxCollection<IFriend>;
  messages: RxCollection<IMessage>;
}
