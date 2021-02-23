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
  cid: string;
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
    cid: {
      type: 'string',
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
  required: ['msgId', 'cid', 'from', 'to', 'msgType', 'content', 'timestamp'],
};

interface IConversation {
  cid: string;
  title: string;
  subtitle?: string;
  avatarUrl?: string;
}

export const conversationSchema: RxJsonSchema<IConversation> = {
  title: 'local conversation schema',
  description: '本地会话列表',
  version: 0,
  keyCompression: true,
  type: 'object',
  properties: {
    cid: {
      type: 'string',
      primary: true,
    },
    title: {
      type: 'string',
    },
    subtitle: {
      type: 'string',
    },
    avatarUrl: {
      type: 'string',
    },
  },
  required: ['cid', 'title'],
};

export interface ICollection {
  friends: RxCollection<IFriend>;
  messages: RxCollection<IMessage>;
  conversations: RxCollection<IConversation>;
}
