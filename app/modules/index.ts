import UserManager from './dbManager/UserManager';
import MessageManager from './dbManager/MessageManager';
import ConversationManager from './dbManager/ConversationManager';
import MessageCenter from './MessageCenter';
import CustomAxios, { FILE_HEADER, DEFAULT_HEADER } from './CustomAxios';

const SingleInstance = (Manager: any) => {
  let instance: any = null;
  return () => instance || (instance = new Manager());
};

type IGetManager<T> = () => T;

export const getUserManager: IGetManager<UserManager> = SingleInstance(
  UserManager
);
export const getMessageManager: IGetManager<MessageManager> = SingleInstance(
  MessageManager
);
export const getConversationManager: IGetManager<ConversationManager> = SingleInstance(
  ConversationManager
);
export const getMessageCenter: IGetManager<MessageCenter> = SingleInstance(
  MessageCenter
);
export const CustomHttp = { CustomAxios, FILE_HEADER, DEFAULT_HEADER };
