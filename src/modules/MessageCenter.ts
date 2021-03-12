import * as io from 'socket.io-client';

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
  public socket: SocketIOClient.Socket;

  constructor() {
    this.initSocket();
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

  private initSocket() {
    this.socket = io.connect('http://127.0.0.1:7000/im', {
      transports: ['websocket'],
      query: {
        uid: 'uid',
      },
    });

    this.socket.on('connect', () => {
      console.error(`socket connected ${this.socket.id}`);
    });

    this.socket.on('disconnect', () => {
      console.log(`socket disconnected ${this.socket.id}`);
    });

    this.socket.on('message', (data: any) => {
      console.log('message---', data);
    });
  }

  private sendMsgBySocket(msg: IMessage) {
    this.socket.emit('sendMessageToServer', msg, (data: any) => {
      console.log(data);
    });
  }

  public getMsgBySocket() {
    this.socket.on('getSocket', (msg: IMessage) => {
      console.log(msg);
    });
  }

  public sendMsg(msg: Partial<IMessage>) {
    const _msg = this.msgWrap(msg);
    this.sendMsgBySocket(_msg);
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
}

export default new MessageCenter();
