import UserManager from './dbManager/UserManager';
import MessageManager from './dbManager/MessageManager';
import ConversationManager from './dbManager/ConversationManager';
import MessageCenter from './MessageCenter';
import CustomAxios, { FILE_HEADER, DEFAULT_HEADER } from './CustomAxios';

const SingleInstance = (Manager: any) => {
  let instance: any = null;
  return () => instance || (instance = new Manager());
};

export const getUserManager = SingleInstance(UserManager);
export const getMessageManager = SingleInstance(MessageManager);
export const getConversationManager = SingleInstance(ConversationManager);
export const getMessageCenter = SingleInstance(MessageCenter);
export const CustomHttp = { CustomAxios, FILE_HEADER, DEFAULT_HEADER };
