const getRxdbManager = () => {
  const localDatabase = window.$client.remote.getGlobal('localDatabase');
  return {
    userManager: localDatabase.userManager,
    messageManager: localDatabase.messageManager,
    conversationManager: localDatabase.conversationManager,
  };
};

const rxdbManager = getRxdbManager();
const UserManager: RxDB.IUserManager = rxdbManager.userManager;
const MessageManager: RxDB.IMessageManager = rxdbManager.messageManager;
const ConversationManager: RxDB.IConversationManager =
  rxdbManager.conversationManager;

const MessageCenter: IMessageCenter = window.$client.remote.getGlobal(
  'MessageCenter'
);

const CustomHttp = window.$client.remote.getGlobal('CustomHttp');
const CustomAxios: ICustomAxios = CustomHttp.CustomAxios;
const DEFAULT_HEADER: string = CustomHttp.DEFAULT_HEADER;
const FILE_HEADER: string = CustomHttp.FILE_HEADER;

export {
  UserManager,
  MessageManager,
  ConversationManager,
  MessageCenter,
  CustomAxios,
  DEFAULT_HEADER,
  FILE_HEADER,
};

export enum EMsgType {
  TEXT = 'text',
  IMAGE = 'image',
  FILE = 'file',
  AUDIO = 'audio',
}

export enum ESignalType {
  INITIATE_VIDEO_CALL = 'initiate_video_call',
  AGREE_TO_VIDEO_CALL = 'agree_to_video_call',
  REJECT_VIDEO_CALL = 'reject_video_call',
  USER_OFFLINE = 'user_offline',
  NOT_ANSWERED = 'not_answered',
  PREPARE_TO_RECEIVE_VIDEO_STREAM = 'prepare_to_receive_video_stream',
  STOP_SEND_PREPARE = 'stop_send_prepare_to_receive_video_stream',
  HANG_UP = 'hang_up',
}
