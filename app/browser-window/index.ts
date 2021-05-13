import {
  app,
  BrowserWindow,
  BrowserWindowConstructorOptions,
  ipcMain,
  IpcMainEvent,
} from 'electron';
import { messageBox } from '../dialog';

import { createLoginAndRegisterWindow } from './windows/login-register-window';
import { createMainWindow } from './windows/main-window';
import { createVideoCallWindow } from './windows/video-call-window';

const client = require('electron-connect').client;

export enum WindowName {
  LOGIN_REGISTER = 'login_register',
  MAIN = 'main',
  VIDEO_CALL = 'video_call',
}

export type CreateWindowHandler = (
  urlParams?: SafeObject,
  options?: BrowserWindowConstructorOptions
) => BrowserWindow;

const HandlersMap: Record<WindowName, CreateWindowHandler> = {
  [WindowName.LOGIN_REGISTER]: createLoginAndRegisterWindow,
  [WindowName.MAIN]: createMainWindow,
  [WindowName.VIDEO_CALL]: createVideoCallWindow,
};

Object.freeze(HandlersMap); //冻结map，防止修改
let CLOSE_WINDOW = false;

// browserWindow store
const WindowMap = new Map<WindowName, BrowserWindow>();

const hackFakeCloseMainWindow = (win: BrowserWindow) => {
  win.on('close', (event) => {
    if (CLOSE_WINDOW) return;
    event.preventDefault();
    if (win.isFullScreen()) {
      win.setFullScreen(false);
    } else {
      win.hide();
    }
  });
};

export const createWindow = (
  name: WindowName,
  urlParams: SafeObject = null,
  options?: BrowserWindowConstructorOptions
): BrowserWindow => {
  const handler = HandlersMap[name];

  const win = handler(urlParams, options);
  client.create(win);

  WindowMap.set(name, win);

  win.on('closed', (e: Event) => WindowMap.delete(name));

  win.webContents.on('render-process-gone', async (event, details) => {
    console.red(event, details);
    messageBox.error({
      message: `The renderer process gone. ${details.reason}`,
      buttons: ['quit', 'relaunch'],
    });
  });

  win.webContents.openDevTools({ mode: 'detach' });

  return win;
};

export const restoreMainWindow = () => {
  const win = WindowMap.get(WindowName.LOGIN_REGISTER);
  win?.restore();
  win?.show();
};

export const closeMainWindow = () => {
  CLOSE_WINDOW = true;
  for (const win of WindowMap) {
    win[1].close();
  }
  CLOSE_WINDOW = false;
};

(async () => {
  await app.whenReady();

  ipcMain.on(
    'OPEN_SAVE_DIALOG',
    async (event: IpcMainEvent, filename: string) => {
      const storage = await messageBox.save({ defaultPath: filename });
      event.reply('SAVE_PATH', storage);
    }
  );

  ipcMain.on('OPEN_WINDOW', (event: IpcMainEvent, { name, params }) => {
    createWindow(name, params);
    event.returnValue = 1;
  });

  ipcMain.on('CLOSE_WINDOW', (e) => {
    const win = BrowserWindow.fromWebContents(e.sender);
    win?.close();
  });

  ipcMain.on('MAXIMIZE_WINDOW', (e) => {
    const win = BrowserWindow.fromWebContents(e.sender);
    console.green(win?.isMaximized());
    win?.isMaximized() ? win?.unmaximize() : win?.maximize();
  });

  ipcMain.on('MINIMIZE_WINDOW', (e) => {
    const win = BrowserWindow.fromWebContents(e.sender);
    win?.isMinimized() ? win?.restore() : win?.minimize();
  });
})();
