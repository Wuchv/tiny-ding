// 是否是开发环境
export const isDev: boolean = process.env.NODE_ENV === 'development';

export const host: string = '127.0.0.1';

export const port: number = 7000;

export const stunList: string[] = [
  'stun:stun.xten.com',
  'stun:stun.voipbuster.com',
  'stun:stun.sipgate.net',
  'stun:stun.ekiga.net',
  'stun:stun.ideasip.com',
  'stun:stun.voiparound.com',
  'stun:stun.voipstunt.com',
  'stun:stun.counterpath.com',
  'stun:stun.callwithus.com',
  'stun:stun.internetcalls.com',
];
