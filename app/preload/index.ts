import { WindowName } from '../browser-window';
import { ipcRenderer } from 'electron';
import { createLocalDB } from '../db';

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

(async () => {
  const localDatabase = await createLocalDB();
  window.$client = {
    ipcRenderer,
    openWindow,
    closeWindow,
    maximizeWindow,
    minimizeWindow,
    localDatabase,
  };
})();
