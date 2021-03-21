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

  public async getLatestConversation() {
    const own: IUser = await UserManager.getOwnInfo();
    const users: IUser[] = await UserManager.getOther();
    const latestUser = users[0];
    if (!latestUser) {
      return {};
    }
    return {
      currentCid: `${own.uid}:${latestUser.uid}`,
      currentTo: latestUser.uid,
      currentConversationTitle: latestUser.nickname,
    };
  }
}

export default new ConversationManager();
