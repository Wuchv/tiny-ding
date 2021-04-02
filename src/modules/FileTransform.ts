export const fileToArrayBuffer = (file: File, callback: Function) => {
  const reader: FileReader = new FileReader();
  reader.readAsArrayBuffer(file);
  reader.onload = (e) => {
    callback({
      name: file.name,
      type: file.type,
      buffer: e.target.result,
    });
  };
};

export const fileToBase64 = (file: File | Blob, callback: Function) => {
  const reader: FileReader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => {
    callback(reader.result);
  };
};

export const imageToBase64 = (url: string, callback: Function) => {
  const img: HTMLImageElement = new Image();
  img.src = url;
  let canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  img.onload = () => {
    canvas.width = img.width;
    canvas.height = img.height;
    context.drawImage(img, 0, 0);
    const URLData = canvas.toDataURL('image/png');
    callback({
      base64: URLData,
      width: img.width,
      height: img.height,
    });
    canvas = null;
  };
  img.onerror = () => {
    canvas = null;
  };
};
