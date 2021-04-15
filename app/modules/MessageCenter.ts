import * as io from 'socket.io-client';
import { RxDocument } from 'rxdb';
import { messageBox } from '../dialog';
import { getUserManager, getMessageManager } from '.';
import UserManager from './dbManager/UserManager';
import MessageManager from './dbManager/MessageManager';

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

export default class MessageCenter {
  private userManager: UserManager;
  private messageManager: MessageManager;
  public socket: SocketIOClient.Socket;

  constructor() {
    this.userManager = getUserManager();
    this.messageManager = getMessageManager();
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

  public sendMsg(msg: IMessage) {
    console.green(EMessageEvent.SEND, msg);
    // this.socket.emit(EMessageEvent.SEND, msg);
  }

  public async insertMsg(
    msg: Partial<IMessage>,
    file: Pick<File, 'name' | 'type'> & { data?: any },
    isCache: boolean
  ): Promise<IMessage> {
    const _msg = this.msgWrap(msg);
    if (isCache && _msg.attachment && file) {
      const msgDoc = await this.messageManager.insert(_msg);
      msgDoc.putAttachment(
        {
          id: `${file.name}:${_msg.msgId}`,
          data: file.data,
          type: file.type,
        },
        true
      );
    } else {
      this.messageManager.insert(_msg);
    }
    return _msg;
  }

  public async updateMsg(msg: Partial<IMessage>) {
    const { msgId, content, attachment } = msg;
    const doc: RxDocument<IMessage, any> = await this.messageManager.findOne(
      msgId
    );
    await doc.atomicUpdate((oldDoc: RxDocument<IMessage, any>) => {
      oldDoc.content = content;
      oldDoc.attachment = { ...oldDoc.attachment, ...attachment };
      return oldDoc;
    });
    return doc.toJSON();
  }

  public async deleteMsg(msgId: string) {
    const doc: RxDocument<IMessage, any> = await this.messageManager.findOne(
      msgId
    );
    doc.remove();
  }

  private async initSocket() {
    const own = await this.userManager.getOwnInfo();
    this.socket = io.connect('ws://127.0.0.1:7000/im', {
      transports: ['websocket'],
      query: {
        uid: own.uid,
      },
    });

    this.socket.on('connect', () => {
      messageBox.info({ message: `socket connected ${this.socket.id}` });
    });

    this.socket.on('disconnect', () => {
      this.socket.disconnect();
      messageBox.info({ message: `socket disconnected ${this.socket.id}` });
    });

    this.socket.on(EMessageEvent.THROW_ERROR, (e: Error) => {
      messageBox.error(e);
    });

    this.socket.on(EMessageEvent.OBTAIN, (message: IMessage) => {
      this.messageManager.insert(message);
    });
  }
}
