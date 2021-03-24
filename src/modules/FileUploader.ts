import OSS from 'ali-oss';
import { ossOptions } from '../../ossConfig';
class FileUploader {
  private client: OSS;

  constructor() {
    this.client = new OSS(ossOptions);
  }

  public async putObject(file: File): NodeStyleReturn<OSS.PutObjectResult> {
    let result: OSS.PutObjectResult = null;
    let err = null;
    try {
      result = await this.client.put(file.name, file);
    } catch (e) {
      err = e;
    }
    return [err, result];
  }
}

export default new FileUploader();
