import { WindowName } from '../browser-window';
import { ipcRenderer } from 'electron';
import { remote } from 'electron';
import { proxyConsole } from '../modules/Console';

// 打开新的窗口
const openWindow = (name: WindowName, params: SafeObject = null) => {
  const result = ipcRenderer.send('OPEN_WINDOW', { name, params });
  return result;
};

// 打开文件保存弹窗
const openSaveDialog = (filename: string) => {
  const result = ipcRenderer.send('OPEN_SAVE_DIALOG', filename);
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
  remote,
  ipcRenderer,
  openSaveDialog,
  openWindow,
  closeWindow,
  maximizeWindow,
  minimizeWindow,
};

window.console = proxyConsole();
