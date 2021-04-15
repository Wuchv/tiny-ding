import { RxDocument, RxChangeEvent } from 'rxdb';
import { filter } from 'rxjs/operators';

import DBManager from './DBManager';

export default class MessageManager extends DBManager {
  constructor() {
    super();
    this.collection = this.localDatabase.messages;
    // this.collection.remove();
  }

  public collectionFilterById$(uid: string, currentTo: string) {
    return this.collection.$.pipe(
      filter((changeEvent: RxChangeEvent) => {
        const msg = changeEvent.rxDocument.toJSON();
        return msg.fromId === uid && msg.toId === currentTo;
      })
    );
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