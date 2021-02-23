export enum EMsgType {
  TEXT = 'text',
  IMAGE = 'image',
  FILE = 'file',
}

export interface IMessage {
  msgId: string;
  cid: string;
  from: string;
  to: string;
  sender: string;
  avatarUrl: string;
  msgType: EMsgType;
  content: string;
  timestamp: number;
}

const localMessages = window.$client.localDatabase.messages;

class MessageCenter {
  public sendMsg(msg: Partial<IMessage>) {
    const _msg = this.msgWrap(msg);
    localMessages.insert(_msg);
  }

  public async filterMsg(
    from?: string | null,
    to?: string | null,
    limit: number = 20
  ) {
    return localMessages.find().exec();
  }

  public msgChange$() {
    return localMessages.$;
  }

  private msgWrap(msg: Partial<IMessage>): IMessage {
    const timestamp = Date.now();
    const { from, to } = msg;
    return {
      ...msg,
      cid: `${from}:${to}`,
      msgId: `${from}:${to}:${timestamp}`,
      timestamp,
    } as IMessage;
  }
}

export default new MessageCenter();
