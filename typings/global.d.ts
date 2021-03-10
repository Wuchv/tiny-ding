/// <reference path="./basic.d.ts" />
import { IpcRenderer } from 'electron';
import { RxCollection, RxDatabase } from 'rxdb';

interface client {
  ipcRenderer: IpcRenderer;
  openWindow: Function;
  closeWindow: Function;
  maximizeWindow: Function;
  minimizeWindow: Function;
  localDatabase: RxDB.LocalDatabaseType;
}

declare global {
  interface Window {
    $client: client;
  }

  namespace RxDB {
    type IDocument = IUser | IMessage | IConversation;

    type LocalDatabaseType = RxDatabase<ICollection>;

    interface ICollection {
      users: RxCollection<IUser>;
      messages: RxCollection<IMessage>;
      conversations: RxCollection<IConversation>;
    }
  }

  type valueOf<T> = T[keyof T];

  type PromiseReturnType<
    T extends (...arg: any[]) => any
  > = ReturnType<T> extends Promise<infer R> ? R : ReturnType<T>;
}