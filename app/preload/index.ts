import { WindowName } from '../browser-window';
import { ipcRenderer } from 'electron';
import { remote } from 'electron';
import { proxyConsole } from '../modules/Console';

// 打开新的窗口
const openWindow = (name: WindowName) => {
  const result = ipcRenderer.send('OPEN_WINDOW', name);
  return result;
};

const closeWindow = (name?: WindowName) => {
  const result = ipcRenderer.send('CLOSE_WINDOW', name);
  return result;
};

const maximizeWindow = (name?: WindowName) => {
  const result = ipcRenderer.send('MAXIMIZE_WINDOW', name);
  return result;
};

const minimizeWindow = (name?: WindowName) => {
  const result = ipcRenderer.send('MINIMIZE_WINDOW', name);
  return result;
};

window.$client = {
  ipcRenderer,
  openWindow,
  closeWindow,
  maximizeWindow,
  minimizeWindow,
  remote,
};

window.console = proxyConsole();
