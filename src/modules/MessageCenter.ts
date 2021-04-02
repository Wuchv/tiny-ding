import * as io from 'socket.io-client';
import { Subject } from 'rxjs';
import { message } from 'antd';
import UserManager from './dbManager/UserManager';
import MessageManager from './dbManager/MessageManager';

export enum EMsgType {
  TEXT = 'text',
  IMAGE = 'image',
  FILE = 'file',
  AUDIO = 'audio',
}

export enum EMessageEvent {
  SEND = 'send',
  OBTAIN = 'obtain',
}

export interface IMessageEvent {
  action: EMessageEvent;
  message: IMessage;
}

class MessageCenter {
  public socket: SocketIOClient.Socket;
  public msgEvent$: Subject<IMessageEvent>;

  constructor() {
    this.msgEvent$ = new Subject();
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

  public async sendMsg(
    msg: Partial<IMessage>,
    file: Pick<File, 'name' | 'type'> & { data: any }
  ) {
    const _msg = this.msgWrap(msg);
    // this.socket.emit('sendMessageToServer', msg);
    if (_msg.attachment && file) {
      const msgDoc = await MessageManager.insert(_msg);
      msgDoc.putAttachment(
        {
          id: `${file.name}:${_msg.msgId}`,
          data: file.data,
          type: file.type,
        },
        true
      );
    } else {
      MessageManager.insert(_msg);
    }
    // this.msgEvent$.next({
    //   action: EMessageEvent.SEND,
    //   message: msg as IMessage,
    // });
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

    this.socket.on('obtainMessageFromServer', (message: IMessage) => {
      MessageManager.insert(message);
      // this.msgEvent$.next({ action: EMessageEvent.OBTAIN, message });
    });
  }
}

export default new MessageCenter();
