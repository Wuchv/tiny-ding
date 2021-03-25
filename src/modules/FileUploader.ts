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
    const url = this.client.signatureUrl(objectKey, { response });
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
    return [err, { name: file.name, url }];
  }
}

export default new FileUploader();
