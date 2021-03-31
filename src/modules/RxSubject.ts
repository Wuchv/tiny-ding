import { Subject, Observable } from 'rxjs';

export enum ERxEvent {
  FILE_TO_BASE64 = 'file_to_base64',
  IMAGE_TO_BASE64 = 'image_to_base64',
  AUDIO_CLOSE = 'audio_close',
}

export const generalSubject$: Subject<Rxjs.INext> = new Subject();

export const fileToBase64 = (img: File): Observable<Rxjs.INext> => {
  const fileReader$: Subject<Rxjs.INext> = new Subject();
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

export const imageToBase64 = (url: string): Observable<Rxjs.INext> => {
  const imgInfo$: Subject<Rxjs.INext> = new Subject();
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
