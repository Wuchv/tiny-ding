import { RxJsonSchema } from 'rxdb';

export const userSchema: RxJsonSchema<IUser> = {
  title: 'local user schema',
  description: '本地用户信息存储',
  version: 0,
  keyCompression: true,
  type: 'object',
  properties: {
    uid: {
      type: 'string',
      primary: true,
    },
    access_token: {
      type: 'string',
    },
    account: {
      type: 'string',
    },
    avatarUrl: {
      type: ['string', 'null'],
    },
    nickname: {
      type: ['string', 'null'],
    },
  },
  required: ['uid'],
};

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
    sender: {
      type: 'string',
    },
    avatarUrl: {
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
  required: [
    'msgId',
    'cid',
    'from',
    'to',
    'msgType',
    'sender',
    'content',
    'timestamp',
  ],
};

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
