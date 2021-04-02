import { RxDocument } from 'rxdb';
import RxdbManager from './RxdbManager';

class MessageManager extends RxdbManager {
  constructor() {
    super();
    this.collection = this.localDatabase.messages;
  }

  public async filterMsgByCid(fromId: string, toId: string) {
    const docs = await this.collection
      .find({
        selector: {
          fromId: { $eq: fromId },
          toId: { $eq: toId },
        },
      })
      .exec();
    return docs.map((doc: RxDocument<any>) => {
      const msg: IMessage = doc.toJSON();
      if (msg.attachment) {
        const attachment = doc.getAttachment(
          `${msg.attachment.name}:${msg.msgId}`
        );
        msg.attachment.cache = attachment;
        return msg;
      }
      return msg;
    });
  }
}

export default new MessageManager();
