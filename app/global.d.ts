import { IpcRenderer } from 'electron';
import { LocalDatabaseType } from './db';
interface client {
  ipcRenderer: IpcRenderer;
  openWindow: Function;
  closeWindow: Function;
  maximizeWindow: Function;
  minimizeWindow: Function;
  localDatabase: LocalDatabaseType;
}

declare global {
  interface Window {
    $client: client;
  }
}

export {};
