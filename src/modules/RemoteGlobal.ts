const getRxdbManager = () => {
  const localDatabase = window.$client.remote.getGlobal('localDatabase');
  return {
    userManager: localDatabase.userManager,
    messageManager: localDatabase.messageManager,
    conversationManager: localDatabase.conversationManager,
  };
};

const getMessageCenter = () => window.$client.remote.getGlobal('MessageCenter');

const rxdbManager = getRxdbManager();
const UserManager = rxdbManager.userManager;
const MessageManager = rxdbManager.messageManager;
const ConversationManager = rxdbManager.conversationManager;
const MessageCenter = getMessageCenter();

export { UserManager, MessageManager, ConversationManager, MessageCenter };

export enum EMsgType {
  TEXT = 'text',
  IMAGE = 'image',
  FILE = 'file',
  AUDIO = 'audio',
}

export enum ESignalType {
  INITIATE_VIDEO_CALL = 'initiate_video_call',
  RECEIVE_VIDEO_CALL = 'receive_video_call',
  AGREE_TO_VIDEO_CALL = 'agree_to_video_call',
  REJECT_VIDEO_CALL = 'reject_video_call',
  USER_OFFLINE = 'user_offline',
  NOT_ANSWERED = 'not_answered',
}
