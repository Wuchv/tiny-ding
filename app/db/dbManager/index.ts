import UserManager from './UserManager';
import MessageManager from './MessageManager';
import ConversationManager from './ConversationManager';

const SingleInstance = (
  Manager:
    | typeof UserManager
    | typeof MessageManager
    | typeof ConversationManager
) => {
  let instance: UserManager | MessageManager | ConversationManager = null;
  return () => instance || (instance = new Manager());
};

export const getUserManager = SingleInstance(UserManager);
export const getMessageManager = SingleInstance(MessageManager);
export const getConversationManager = SingleInstance(ConversationManager);
