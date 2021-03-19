import * as io from 'socket.io-client';
import { fromEvent, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { message } from 'antd';
import UserManager from './dbManager/UserManager';

export enum EMsgType {
  TEXT = 'text',
  IMAGE = 'image',
  FILE = 'file',
}

const localMessages = window.$client.localDatabase.messages;

class MessageCenter {
  public socket: SocketIOClient.Socket;

  constructor() {
    this.initSocket();
  }

  private msgWrap(msg: Partial<IMessage>): IMessage {
    const timestamp = Date.now();
    const { fromId, toId } = msg;
    return {
      ...msg,
      cid: `${fromId}:${toId}`,
      msgId: `${fromId}:${toId}:${timestamp}`,
      timestamp,
    } as IMessage;
  }

  private async initSocket() {
    const own = await UserManager.getOwnInfo();
    this.socket = io.connect('ws://127.0.0.1:7000/im', {
      transports: ['websocket'],
      query: {
        uid: own.uid,
      },
    });

    this.socket.on('connect', () => {
      console.log(`socket connected ${this.socket.id}`);
    });

    this.socket.on('disconnect', () => {
      this.socket.disconnect();
      console.log(`socket disconnected ${this.socket.id}`);
    });

    this.socket.on('throwSendMessageError', (e: Error) => {
      message.error(e);
    });
  }

  private sendMsgBySocket(msg: IMessage) {
    this.socket.emit('sendMessageToServer', msg, (data: any) => {
      console.log('sendMessageToServer', data);
    });
  }

  public msgSource() {
    const msgSource$: Observable<IMessage> = fromEvent(
      this.socket,
      'obtainMessageFromServer'
    ).pipe(
      map((msg: IMessage) => {
        localMessages.insert(msg);
        return msg;
      })
    );
    return msgSource$;
  }

  public sendMsg(msg: Partial<IMessage>) {
    const _msg = this.msgWrap(msg);
    this.sendMsgBySocket(_msg);
    // localMessages.insert(_msg);
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
