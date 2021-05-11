import { RxDocument, RxChangeEvent } from 'rxdb';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import DBManager from './DBManager';
import { loadUnreadMessage } from '../../services';

export default class MessageManager
  extends DBManager
  implements RxDB.IMessageManager {
  constructor() {
    super();
    this.collection = this.localDatabase.messages;
    // this.collection.remove();
  }

  //订阅未读消息的增加
  public unreadDot$(uid: string, currentTo: string): Observable<IMessage> {
    return this.insert$.pipe(
      filter((msg: IMessage) => msg.fromId !== currentTo && msg.fromId !== uid)
    );
  }

  // 订阅当前会话消息的接收
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

  // 根据fromId和toId查询message
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

  // 根据uid和最后离线时间增量式拉取message
  public async loadMessage(uid: string): Promise<IMessage[]> {
    const msgs: IMessage[] = await loadUnreadMessage({
      uid,
    });
    await this.collection.bulkInsert(msgs as any);
    return msgs;
  }
}
