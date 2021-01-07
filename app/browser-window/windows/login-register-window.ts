import { BrowserWindow, BrowserWindowConstructorOptions } from 'electron';
import {
  isDev,
  RENDER_SERVER_URL,
  RENDER_FILE_URL,
  PRELOAD_FILE,
} from '../../constants';

const options: BrowserWindowConstructorOptions = {
  width: 300,
  height: 400,
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

const URL = isDev ? `${RENDER_SERVER_URL}/#/login` : `${RENDER_FILE_URL}#login`;

export const createLoginAndRegisterWindow = () => {
  const win = new BrowserWindow(options);
  // 隐藏Mac下的交通灯🚥和windows/linux下的菜单操作按钮
  if (process.platform === 'darwin') win.setWindowButtonVisibility(false);
  else win.setMenuBarVisibility(false);
  win.loadURL(URL);

  return win;
};
