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
  getMessageCenter,
  CustomHttp,
} from './modules';
import { createLocalDB } from './db';
import { proxyConsole } from './modules/Console';

const init = async () => {
  //代理原生 console 对象
  console = proxyConsole();
  await createLocalDB();
  (global as any).localDatabase = {
    userManager: getUserManager(),
    messageManager: getMessageManager(),
    conversationManager: getConversationManager(),
  };
  (global as any).MessageCenter = getMessageCenter();
  (global as any).CustomHttp = CustomHttp;
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
    createWindow(WindowName.LOGIN_REGISTER);
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
