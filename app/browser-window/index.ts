import {
  app,
  BrowserWindow,
  BrowserWindowConstructorOptions,
  ipcMain,
  IpcMainEvent,
} from 'electron';
import { messageBox } from '../dialog';

import { createLoginAndRegisterWindow } from './windows/login-register-window';

export enum WindowName {
  login_register = 'login_register',
}

export type CreateWindowHandler = (
  options?: BrowserWindowConstructorOptions
) => BrowserWindow;

const HandlersMap: Record<WindowName, CreateWindowHandler> = {
  [WindowName.login_register]: createLoginAndRegisterWindow,
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
  options?: BrowserWindowConstructorOptions
): BrowserWindow => {
  const handler = HandlersMap[name];

  const win = handler(options);
  WindowMap.set(name, win);

  win.on('closed', () => WindowMap.delete(name));

  win.webContents.on('render-process-gone', async (event, details) => {
    console.log(event, details);
    messageBox.error({
      message: `The renderer process gone. ${details.reason}`,
      buttons: ['quit', 'relaunch'],
    });
  });

  win.webContents.openDevTools({ mode: 'detach' });

  return win;
};

export const restoreMainWindow = () => {
  const win = WindowMap.get(WindowName.login_register);
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
  ipcMain.on('OPEN_WINDOW', (event: IpcMainEvent, name: WindowName) => {
    createWindow(name);
    event.returnValue = 1;
  });

  ipcMain.on('CLOSE_WINDOW', (e, options) => {
    const win = BrowserWindow.fromWebContents(e.sender);
    win?.close();
  });

  ipcMain.on('MAXIMIZE_WINDOW', (e, options) => {
    const win = BrowserWindow.fromWebContents(e.sender);
    console.log(win?.isMaximized());
    win?.isMaximized() ? win?.unmaximize() : win?.maximize();
  });

  ipcMain.on('MINIMIZE_WINDOW', (e, options) => {
    const win = BrowserWindow.fromWebContents(e.sender);
    win?.isMinimized() ? win?.restore() : win?.minimize();
  });
})();
