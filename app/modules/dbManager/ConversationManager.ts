import DBManager from './DBManager';

export default class ConversationManager
  extends DBManager
  implements RxDB.IConversationManager {
  constructor() {
    super();
    this.collection = this.localDatabase.conversations;
  }

  public async getLatestConversation() {
    const conversations: IConversation[] = (await this.getAllDocuments()) as IConversation[];
    if (conversations.length > 0) {
      const con = conversations[0];
      const conDoc = await this.findOne(con.cid);
      conDoc.update({
        $set: {
          unread: 0,
        },
      });
      return {
        currentCid: con.cid,
        currentTo: con.toId,
        currentConversationTitle: con.title,
        currentConversationAvatar: con.avatarUrl,
      };
    } else {
      return {
        currentCid: null,
        currentTo: null,
        currentConversationTitle: null,
        currentConversationAvatar: null,
      };
    }
  }
}
