import { BrowserWindow, BrowserWindowConstructorOptions } from 'electron';
import {
  isDev,
  RENDER_SERVER_URL,
  RENDER_FILE_URL,
  PRELOAD_FILE,
} from '../../constants';

const options: BrowserWindowConstructorOptions = {
  width: 700,
  height: 500,
  webPreferences: {
    nodeIntegration: true,
    webSecurity: false,
    enableRemoteModule: true,
    preload: PRELOAD_FILE,
  },
};

const URL = isDev
  ? `${RENDER_SERVER_URL}/#/video-call`
  : `${RENDER_FILE_URL}#video-call`;

export const createVideoCallWindow = () => {
  const win = new BrowserWindow(options);
  win.loadURL(URL);
  return win;
};
