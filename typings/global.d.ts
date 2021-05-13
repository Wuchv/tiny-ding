/// <reference path="./basic.d.ts" />
import { IpcRenderer, Remote } from 'electron';
import { RxCollection, RxDatabase } from 'rxdb';
import { MessageCenter } from './MessageCenter';
import {
  DBManager,
  UserManager,
  ConversationManager,
  MessageManager,
} from './RxdbManager';
import { CustomAxios } from './CustomAxios';

interface client {
  remote: Remote;
  ipcRenderer: IpcRenderer;
  openSaveDialog: Function;
  openWindow: Function;
  closeWindow: Function;
  maximizeWindow: Function;
  minimizeWindow: Function;
}

declare global {
  interface Window {
    $client: client;
    console: any;
  }

  interface Console {
    red: Function;
    green: Function;
    yellow: Function;
    blue: Function;
    magenta: Function;
    cyan: Function;
    white: Function;
    gray: Function;
    grey: Function;
  }

  type ICustomAxios = CustomAxios;

  type IMessageCenter = MessageCenter;

  type NodeStyleReturn<T> = Promise<[string | Record<string, unknown>, T]>;

  namespace RxDB {
    type IDocument = IUser | IMessage | IConversation;

    type LocalDatabaseType = RxDatabase<ICollection>;

    interface ICollection {
      users: RxCollection<IUser>;
      messages: RxCollection<IMessage>;
      conversations: RxCollection<IConversation>;
    }

    type IDBManager = DBManager;
    type IUserManager = UserManager;
    type IMessageManager = MessageManager;
    type IConversationManager = ConversationManager;
  }

  namespace Rxjs {
    interface INext {
      action: string;
      id?: string;
      payload?: any;
    }
  }

  type valueOf<T> = T[keyof T];

  type PromiseReturnType<T extends (...arg: any[]) => any> =
    ReturnType<T> extends Promise<infer R> ? R : ReturnType<T>;
}
