/// <reference path="./basic.d.ts" />
import { IpcRenderer, Remote } from 'electron';
import { RxCollection, RxDatabase } from 'rxdb';

interface client {
  ipcRenderer: IpcRenderer;
  openWindow: Function;
  closeWindow: Function;
  maximizeWindow: Function;
  minimizeWindow: Function;
  remote: Remote;
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

  type NodeStyleReturn<T> = Promise<[string | Record<string, unknown>, T]>;

  namespace RxDB {
    type IDocument = IUser | IMessage | IConversation;

    type LocalDatabaseType = RxDatabase<ICollection>;

    interface ICollection {
      users: RxCollection<IUser>;
      messages: RxCollection<IMessage>;
      conversations: RxCollection<IConversation>;
    }
  }

  namespace Rxjs {
    interface INext {
      action: string;
      id?: string;
      payload?: any;
    }
  }

  type valueOf<T> = T[keyof T];

  type PromiseReturnType<
    T extends (...arg: any[]) => any
  > = ReturnType<T> extends Promise<infer R> ? R : ReturnType<T>;
}
