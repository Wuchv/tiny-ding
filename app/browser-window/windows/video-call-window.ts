import { BrowserWindow, BrowserWindowConstructorOptions } from 'electron';
import {
  isDev,
  RENDER_SERVER_URL,
  RENDER_FILE_URL,
  PRELOAD_FILE,
} from '../../constants';

const options: BrowserWindowConstructorOptions = {
  width: 600,
  height: 478,
  resizable: false,
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

const urlParamStringify = (queryObj: SafeObject): string => {
  if (!queryObj || queryObj.constructor !== Object) {
    throw new Error('Query object should be an object.');
  }

  var stringified = '';
  Reflect.ownKeys(queryObj).forEach(function (c: string) {
    var value = queryObj[c];
    stringified += c;
    if (value !== true) {
      stringified += '=' + encodeURIComponent(queryObj[c] as string);
    }
    stringified += '&';
  });

  stringified = stringified.replace(/\&$/g, '');
  return stringified;
};

export const createVideoCallWindow = (urlParams: Record<string, string>) => {
  const win = new BrowserWindow(options);
  let url = URL;
  if (urlParams) {
    url = `${URL}?${urlParamStringify(urlParams)}`;
  }
  win.loadURL(url);
  return win;
};
