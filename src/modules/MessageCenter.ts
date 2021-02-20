export enum EMsgType {
  TEXT = 'text',
  IMAGE = 'image',
  FILE = 'file',
}

export interface IMessage {
  msgId: string;
  from: string;
  to: string;
  msgType: EMsgType;
  content: string;
  timestamp: number;
}

const localMessages = window.$client.localDatabase.messages;

class MessageCenter {
  public sendMsg(msg: Partial<IMessage>) {
    localMessages.insert(this.msgWrap(msg));
  }

  private msgWrap(msg: Partial<IMessage>): IMessage {
    const timestamp = Date.now();
    const from = '0';
    const to = '0';
    return {
      ...msg,
      msgId: `${msg.from}:${msg.to}:${timestamp}`,
      from,
      to,
      timestamp,
    } as IMessage;
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
}

export default new MessageCenter();
