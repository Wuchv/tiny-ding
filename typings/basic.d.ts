declare interface IUser {
  uid: string;
  access_token: string;
  account: string;
  avatarUrl: string;
  nickname: string;
}

declare enum EMsgType {
  TEXT = 'text',
  IMAGE = 'image',
  FILE = 'file',
}

declare interface IMessage {
  msgId: string;
  cid: string;
  from: string;
  to: string;
  sender: string;
  avatarUrl: string;
  msgType: EMsgType;
  content: string;
  timestamp: number;
}

declare interface IConversation {
  cid: string;
  title: string;
  subtitle?: string;
  avatarUrl?: string;
}