import RxdbManager from './RxdbManager';
import UserManager from './UserManager';

class ConversationManager extends RxdbManager {
  constructor() {
    super();
    this.collection = this.localDatabase.conversations;
    this.generateConversation();
  }

  public async generateConversation() {
    const users: IUser[] = await UserManager.getOther();
    const own: IUser = await UserManager.getOwnInfo();
    const conversations = users.map((user) => ({
      cid: `${own.uid}:${user.uid}`,
      toId: user.uid,
      title: user.nickname,
    }));
    this.bulkInsert(conversations);
  }
}

export default new ConversationManager();
