import { WindowName } from '../browser-window';
import { ipcRenderer } from 'electron';
import { remote } from 'electron';

// 打开新的窗口
function openWindow(name: WindowName) {
  const result = ipcRenderer.send('OPEN_WINDOW', name);
  return result;
}

function closeWindow(name?: WindowName) {
  const result = ipcRenderer.send('CLOSE_WINDOW', name);
  return result;
}

function maximizeWindow(name?: WindowName) {
  const result = ipcRenderer.send('MAXIMIZE_WINDOW', name);
  return result;
}

function minimizeWindow(name?: WindowName) {
  const result = ipcRenderer.send('MINIMIZE_WINDOW', name);
  return result;
}

window.$client = {
  ipcRenderer,
  openWindow,
  closeWindow,
  maximizeWindow,
  minimizeWindow,
  remote,
};
