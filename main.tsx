import { app, BrowserWindow } from 'electron';
import { isDev } from './src/constants';

let mainWindow: BrowserWindow = null;
let createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  mainWindow.webContents.openDevTools();
  if (isDev) {
    mainWindow.loadURL(`http://localhost:3000`);
  } else {
    mainWindow.loadFile('../index.html');
  }
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
