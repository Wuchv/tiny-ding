import { IpcRenderer } from 'electron';

interface client {
  ipcRenderer: IpcRenderer;
  actionCode: Function;
  openWindow: Function;
  closeWindow: Function;
  maximizeWindow: Function;
  minimizeWindow: Function;
}

declare global {
  interface Window {
    $client: client;
  }
}

export {};
