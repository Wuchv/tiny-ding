declare interface IUser {
  uid: string;
  access_token?: string;
  account: string;
  avatarUrl: string;
  nickname: string;
}

declare enum EMsgType {
  TEXT = 'text',
  IMAGE = 'image',
  FILE = 'file',
}

declare interface IAttachment {
  name: string;
  url: string;
  cache?: any;
}

declare interface IMessage {
  msgId: string;
  cid: string;
  fromId: string;
  toId: string;
  sender: string;
  avatarUrl: string;
  msgType: EMsgType;
  content: string;
  attachment?: IAttachment;
  timestamp: number;
}

declare interface IConversation {
  cid: string;
  toId: string;
  title: string;
  subtitle?: string;
  avatarUrl?: string;
}

declare module 'recorder-core';
