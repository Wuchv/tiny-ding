import { app } from 'electron';
import {
  createWindow,
  WindowName,
  restoreMainWindow,
  closeMainWindow,
} from './browser-window';

const start = () => {
  // 请求单例锁，避免打开多个electron实例
  const gotTheLock = app.requestSingleInstanceLock();
  if (!gotTheLock) {
    app.quit();
    return;
  }

  // 如果有第二个实例 将重启应用
  app.on('second-instance', () => {
    restoreMainWindow();
  });

  app.on('ready', () => {
    createWindow(WindowName.MAIN);
  });

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('before-quit', () => closeMainWindow());

  app.on('activate', () => restoreMainWindow());
};

start();
