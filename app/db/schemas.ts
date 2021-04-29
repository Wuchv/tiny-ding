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
    fromId: {
      type: 'string',
    },
    toId: {
      type: 'string',
    },
    sender: {
      type: 'string',
    },
    avatarUrl: {
      type: ['string', 'null'],
    },
    msgType: {
      type: 'string',
    },
    content: {
      type: ['string', 'null'],
    },
    timestamp: {
      type: 'number',
    },
    attachment: {
      type: ['object', 'null'],
      properties: {
        url: {
          type: ['string', 'null'],
        },
        name: {
          type: 'string',
        },
        size: {
          type: ['string', 'number'],
        },
        type: {
          type: ['string', 'null'],
        },
      },
      required: ['url', 'type', 'name'],
    },
  },
  attachments: { encrypted: false },
  required: [
    'msgId',
    'cid',
    'fromId',
    'toId',
    'msgType',
    'sender',
    'content',
    'timestamp',
  ],
  indexes: ['timestamp'],
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
    toId: {
      type: 'string',
    },
    title: {
      type: 'string',
    },
    subtitle: {
      type: 'string',
    },
    avatarUrl: {
      type: ['string', 'null'],
    },
    unread: {
      type: 'number',
    },
  },
  required: ['cid', 'toId', 'title'],
};
