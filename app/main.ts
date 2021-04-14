import { app } from 'electron';
import {
  createWindow,
  WindowName,
  restoreMainWindow,
  closeMainWindow,
} from './browser-window';
import {
  getUserManager,
  getMessageManager,
  getConversationManager,
} from './db/dbManager';
import { createLocalDB } from './db';

const init = async () => {
  await createLocalDB();
  (global as any).localDatabase = {
    userManager: getUserManager(),
    messageManager: getMessageManager(),
    conversationManager: getConversationManager(),
  };
  Object.freeze(global);
};

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

  app.on('ready', async () => {
    await init();
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
