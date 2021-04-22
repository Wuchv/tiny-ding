import { RxDocument, RxChangeEvent } from 'rxdb';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

import DBManager from './DBManager';

export default class MessageManager
  extends DBManager
  implements RxDB.IMessageManager {
  constructor() {
    super();
    this.collection = this.localDatabase.messages;
    // this.collection.remove();
  }

  public collectionFilterById$(
    uid: string,
    currentTo: string
  ): Observable<RxChangeEvent> {
    return this.collection.$.pipe(
      filter((changeEvent: RxChangeEvent) => {
        const msg = changeEvent.rxDocument.toJSON();
        return (
          (msg.fromId === uid && msg.toId === currentTo) ||
          (msg.fromId === currentTo && msg.toId === uid)
        );
      })
    );
  }

  public async filterMsgByCid(fromId: string, toId: string) {
    const docs = await this.collection
      .find({
        selector: {
          $or: [
            { fromId: { $eq: fromId }, toId: { $eq: toId } },
            { fromId: { $eq: toId }, toId: { $eq: fromId } },
          ],
        },
        sort: [{ timestamp: 'asc' }],
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
