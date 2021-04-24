import path from 'path'; //如果想import引入需在tsconfig中配置esModuleInterop:true
import { format as urlFormat } from 'url';

export const RENDER_FILE_URL: string = urlFormat({
  protocol: 'file:',
  pathname: path.resolve(__dirname, '..', '..', 'dist', 'index.html'),
  slashes: true,
});

export const PRELOAD_FILE = path.resolve(__dirname, 'preload.js');

export const RENDER_SERVER_URL: string = 'http://localhost:3000';

export const isDev: boolean = process.env.NODE_ENV === 'development';

export const host: string = '127.0.0.1';

export const port: number = 7000;
