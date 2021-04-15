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
