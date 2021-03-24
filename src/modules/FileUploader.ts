import OSS from 'ali-oss';

class FileUploader {
  private client: OSS;

  constructor() {
    this.client = new OSS({
      region: 'oss-cn-hangzhou',
      accessKeyId: 'LTAI5tApF7d4zdPs5nV6sYJs',
      accessKeySecret: 'nl8tDSCTxBTdlETr728aTmMVjoPtZm',
      bucket: 'tiny-ding',
    });
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
