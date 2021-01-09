import { BrowserWindow, BrowserWindowConstructorOptions } from 'electron';
import {
  isDev,
  RENDER_SERVER_URL,
  RENDER_FILE_URL,
  PRELOAD_FILE,
} from '../../constants';

const options: BrowserWindowConstructorOptions = {
  width: 900,
  height: 650,
  resizable: false,
  titleBarStyle: 'hidden',
  autoHideMenuBar: true,
  frame: false,
  webPreferences: {
    nodeIntegration: true,
    webSecurity: false,
    preload: PRELOAD_FILE,
    enableRemoteModule: true,
  },
};

const URL = isDev ? `${RENDER_SERVER_URL}/#/main` : `${RENDER_FILE_URL}#main`;

export const createMainWindow = () => {
  const win = new BrowserWindow(options);
  win.loadURL(URL);
  return win;
};
