export enum WindowName {
  LOGIN_REGISTER = 'login_register',
  MAIN = 'main',
  VIDEO_CALL = 'video_call',
}
export const openWindow = (name: WindowName) => (isClose: boolean = true) => {
  window.$client.openWindow(name);
  isClose && window.$client.closeWindow();
};

export const openLoginWindow = openWindow(WindowName.LOGIN_REGISTER);

export const openMainWindow = openWindow(WindowName.MAIN);

export const openVideoCallWindow = openWindow(WindowName.VIDEO_CALL);

export const resolveTimestamp = (timestamp: number) => {
  const date = new Date(timestamp);
  const Y = date.getFullYear();
  const M =
    date.getMonth() + 1 < 10
      ? '0' + (date.getMonth() + 1)
      : date.getMonth() + 1;
  const D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
  const h = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
  const m =
    date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
  const s =
    date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();

  return { Y, M, D, h, m, s };
};

export const calcFileSize = (size: number | string): string => {
  if (typeof size === 'string') return size;
  const sizeLabel = ['B', 'KB', 'MB', 'GB'];
  let result = '';
  let cursor = 0;
  while (size >= 1024) {
    size = size / 1024;
    cursor++;
  }
  result = `${parseFloat(size.toFixed(2))} ${sizeLabel[cursor]}`;
  return result;
};
