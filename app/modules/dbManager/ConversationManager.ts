import DBManager from './DBManager';
import UserManager from './UserManager';
import { getUserManager } from '..';

export default class ConversationManager
  extends DBManager
  implements RxDB.IConversationManager {
  private userManager: UserManager;
  constructor() {
    super();
    this.collection = this.localDatabase.conversations;
    this.userManager = getUserManager();
    this.generateConversation();
  }

  public async generateConversation() {
    const users: IUser[] = await this.userManager.getOther();
    const own: IUser = await this.userManager.getOwnInfo();
    const conversations = users.map((user) => ({
      cid: `${own.uid}:${user.uid}`,
      toId: user.uid,
      title: String(user.nickname),
    }));
    this.bulkInsert(conversations);
  }

  public async getLatestConversation() {
    const own: IUser = await this.userManager.getOwnInfo();
    const users: IUser[] = await this.userManager.getOther();
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
