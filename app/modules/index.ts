import UserManager from './dbManager/UserManager';
import MessageManager from './dbManager/MessageManager';
import ConversationManager from './dbManager/ConversationManager';
import MessageCenter from './MessageCenter';
import RTCPeer from './RTCPeer';

const SingleInstance = (Manager: any) => {
  let instance: any = null;
  return () => instance || (instance = new Manager());
};

export const getUserManager = SingleInstance(UserManager);
export const getMessageManager = SingleInstance(MessageManager);
export const getConversationManager = SingleInstance(ConversationManager);
export const getMessageCenter = SingleInstance(MessageCenter);
export const getRTCPeer = SingleInstance(RTCPeer);
