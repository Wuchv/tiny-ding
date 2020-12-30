import { app, BrowserWindow } from 'electron';
import { createLoginAndRegisterWindow } from './browser-window/windows/login-register-window';

let mainWindow: BrowserWindow = null;
let createWindow = () => {
  mainWindow = createLoginAndRegisterWindow();

  mainWindow.webContents.openDevTools({ mode: 'detach' });

  mainWindow.on('close', () => {
    mainWindow = null;
  });
};

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
