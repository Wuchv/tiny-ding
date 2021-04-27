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
  unread?: number;
  subtitle?: string;
  avatarUrl?: string;
}

declare enum ESignalType {
  INITIATE_VIDEO_CALL = 'initiate_video_call',
  AGREE_TO_VIDEO_CALL = 'agree_to_video_call',
  REJECT_VIDEO_CALL = 'reject_video_call',
  USER_OFFLINE = 'user_offline',
  NOT_ANSWERED = 'not_answered',
  SYNC_ICECANDIDATE = 'sync_icecandidate',
  PREPARE_TO_RECEIVE_VIDEO_STREAM = 'prepare_to_receive_video_stream',
  STOP_SEND_PREPARE = 'stop_send_prepare_to_receive_video_stream',
  HANG_UP = 'hang_up',
}

declare interface ISignal {
  type: ESignalType;
  payload: Pick<IMessage, 'fromId' | 'toId'> & {
    sdp?: RTCSessionDescriptionInit;
    iceCandidate?: RTCIceCandidate;
  };
}

type SafeObject = Record<string, any>;

declare module 'recorder-core';

declare module 'urljs';
