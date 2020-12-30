import path from 'path';
import { format as urlFormat } from 'url';

export const RENDER_FILE_URL: string = urlFormat({
  protocol: 'file:',
  pathname: path.resolve(__dirname, '..', '..', 'dist', 'index.html'),
  slashes: true,
});

export const RENDER_SERVER_URL: string = 'http://localhost:3000';

export const isDev: boolean = process.env.NODE_ENV === 'development';
