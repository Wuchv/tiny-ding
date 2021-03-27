import { Subject } from 'rxjs';

export enum WindowName {
  login_register = 'login_register',
  main = 'main',
}

export enum ERxEvent {
  FILE_TO_BASE64 = 'file_to_base64',
  IMAGE_TO_BASE64 = 'image_to_base64',
}

export const openLoginWindow = () => {
  window.$client.openWindow(WindowName.login_register);
  window.$client.closeWindow();
};

export const openMainWindow = () => {
  window.$client.openWindow(WindowName.main);
  window.$client.closeWindow();
};

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

export const fileToBase64 = (img: File) => {
  const fileReader$ = new Subject();
  const reader: FileReader = new FileReader();
  reader.readAsDataURL(img);
  reader.onload = () => {
    fileReader$.next({
      action: ERxEvent.FILE_TO_BASE64,
      payload: reader.result,
    });
  };
  return fileReader$;
};

export const imageToBase64 = (url: string) => {
  const imgInfo$ = new Subject();
  const img: HTMLImageElement = new Image();
  img.src = url;
  let canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  img.onload = () => {
    canvas.width = img.width;
    canvas.height = img.height;
    context.drawImage(img, 0, 0);
    const URLData = canvas.toDataURL('image/png');
    imgInfo$.next({
      action: ERxEvent.IMAGE_TO_BASE64,
      payload: {
        base64: URLData,
        width: img.width,
        height: img.height,
      },
    });
    canvas = null;
  };
  img.onerror = () => {
    canvas = null;
  };
  return imgInfo$;
};
