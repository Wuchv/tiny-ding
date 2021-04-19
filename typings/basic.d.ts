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
  AUDIO = 'audio',
}

declare interface IAttachment {
  url: string;
  name?: string;
  size?: string | number;
  type?: string;
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

declare enum ESignalType {
  INITIATE_VIDEO_CALL = 'initiate_video_call',
  AGREE_TO_VIDEO_CALL = 'agree_to_video_call',
  REJECT_VIDEO_CALL = 'reject_video_call',
  USER_OFFLINE = 'user_offline',
  NOT_ANSWERED = 'not_answered',
}

declare interface ISignal {
  type: ESignalType;
  payload: Pick<IMessage, 'fromId' | 'toId'>;
}

declare module 'recorder-core';
