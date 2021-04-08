import OSS from 'ali-oss';
import { ossOptions } from '../../ossConfig';
import md5 from 'md5';
class FileUploader {
  private client: OSS;

  constructor() {
    this.client = new OSS(ossOptions);
  }

  public generateDownloadUrl(objectKey: string, filename: string): string {
    const response = {
      'content-disposition': `attachment; filename=${encodeURIComponent(
        filename
      )}`,
    };
    const url = this.client.signatureUrl(objectKey, {
      response,
      expires: 1000 * 60 * 60 * 24 * 90,
    });
    return url;
  }

  public async putObject(
    file: File,
    salt: string
  ): NodeStyleReturn<IAttachment> {
    let err = null;
    const objectKey = md5(`${file.name}:${salt}`);
    try {
      await this.client.put(objectKey, file);
    } catch (e) {
      err = e;
    }
    const url = this.generateDownloadUrl(objectKey, file.name);
    return [err, { name: file.name, url, type: file.type, size: file.size }];
  }

  public async putObjectAudioBlob(
    blob: Blob,
    salt: string
  ): NodeStyleReturn<IAttachment> {
    let err = null;
    const objectKey = md5(salt);
    try {
      await this.client.put(objectKey, blob);
    } catch (e) {
      err = e;
    }
    const url = this.generateDownloadUrl(objectKey, `${salt}-audio`);
    return [
      err,
      { name: `${salt}-audio`, url, type: 'audio/mpeg', size: blob.size },
    ];
  }
}

export default new FileUploader();
