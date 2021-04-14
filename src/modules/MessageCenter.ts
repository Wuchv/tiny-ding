import * as io from 'socket.io-client';
import { RxDocument } from 'rxdb';
import { message } from 'antd';
import { UserManager, MessageManager } from './RxdbManager';

export enum EMsgType {
  TEXT = 'text',
  IMAGE = 'image',
  FILE = 'file',
  AUDIO = 'audio',
}

export enum EMessageEvent {
  SEND = 'sendMessageToServer',
  OBTAIN = 'obtainMessageFromServer',
  THROW_ERROR = 'throwSendMessageError',
}

export interface IMessageEvent {
  action: EMessageEvent;
  message: IMessage;
}

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

  public async sendMsg(msg: IMessage) {
    console.log(EMessageEvent.SEND, msg);
    // this.socket.emit(EMessageEvent.SEND, msg);
  }

  public async insertMsg(
    msg: Partial<IMessage>,
    file: Pick<File, 'name' | 'type'> & { data?: any },
    isCache: boolean
  ): Promise<IMessage> {
    const _msg = this.msgWrap(msg);
    if (isCache && _msg.attachment && file) {
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
    return _msg;
  }

  public async updateMsg(msg: Partial<IMessage>) {
    const { msgId, content, attachment } = msg;
    const doc: RxDocument<IMessage, any> = await MessageManager.findOne(msgId);
    await doc.atomicUpdate((oldDoc: RxDocument<IMessage, any>) => {
      oldDoc.content = content;
      oldDoc.attachment = { ...oldDoc.attachment, ...attachment };
      return oldDoc;
    });
    return doc.toJSON();
  }

  public async deleteMsg(msgId: string) {
    const doc: RxDocument<IMessage, any> = await MessageManager.findOne(msgId);
    doc.remove();
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

    this.socket.on(EMessageEvent.THROW_ERROR, (e: Error) => {
      message.error(e);
    });

    this.socket.on(EMessageEvent.OBTAIN, (message: IMessage) => {
      MessageManager.insert(message);
    });
  }
}

export default new MessageCenter();
