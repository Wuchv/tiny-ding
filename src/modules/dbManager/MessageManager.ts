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
    return docs.map((doc: RxDocument<any>) => doc.toJSON());
  }
}

export default new MessageManager();
