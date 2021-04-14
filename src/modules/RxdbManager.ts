import { SingleInstance } from '@src/utils';

class RxdbManager {
  private localDatabase: any;
  constructor() {
    this.localDatabase = window.$client.remote.getGlobal('localDatabase');
  }

  public get userManager() {
    return this.localDatabase.userManager;
  }

  public get messageManager() {
    return this.localDatabase.messageManager;
  }

  public get conversationManager() {
    return this.localDatabase.conversationManager;
  }
}

const getRxdbManager = SingleInstance<typeof RxdbManager>(RxdbManager);
const rxdbManager = getRxdbManager();
const UserManager = rxdbManager.userManager;
const MessageManager = rxdbManager.messageManager;
const ConversationManager = rxdbManager.conversationManager;

export { UserManager, MessageManager, ConversationManager };
