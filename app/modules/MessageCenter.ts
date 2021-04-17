import * as io from 'socket.io-client';
import { fromEvent, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { RxDocument } from 'rxdb';
import { messageBox } from '../dialog';
import { getUserManager, getMessageManager } from '.';
import UserManager from './dbManager/UserManager';
import MessageManager from './dbManager/MessageManager';

enum EMessageEvent {
  SEND_MESSAGE = 'send_message_to_server',
  OBTAIN_MESSAGE = 'obtain_message_from_server',
  THROW_ERROR = 'throw_send_message_error',
  SEND_SIGNAL = 'send_signal_to_server',
  OBTAIN_SIGNAL = 'obtain_signal_from_server',
}

enum ESignalType {
  INITIATE_VIDEO_CALL = 'initiate_video_call',
  RECEIVE_VIDEO_CALL = 'receive_video_call',
  AGREE_TO_VIDEO_CALL = 'agree_to_video_call',
  REJECT_VIDEO_CALL = 'reject_video_call',
}

export const ofType = (type: ESignalType) => (source: Observable<ISignal>) =>
  source.pipe(filter((signal) => signal.type === type));

export default class MessageCenter {
  private userManager: UserManager;
  private messageManager: MessageManager;
  public socket: SocketIOClient.Socket;

  constructor() {
    this.userManager = getUserManager();
    this.messageManager = getMessageManager();
    this.initSocket();
  }

  public get receiveVideoCall$(): Observable<ISignal> {
    return fromEvent(this.socket, EMessageEvent.OBTAIN_SIGNAL).pipe(
      ofType(ESignalType.RECEIVE_VIDEO_CALL)
    );
  }

  public get agreeToVideoCall$(): Observable<ISignal> {
    return fromEvent(this.socket, EMessageEvent.OBTAIN_SIGNAL).pipe(
      ofType(ESignalType.AGREE_TO_VIDEO_CALL)
    );
  }

  public get rejectVideoCall$(): Observable<ISignal> {
    return fromEvent(this.socket, EMessageEvent.OBTAIN_SIGNAL).pipe(
      ofType(ESignalType.REJECT_VIDEO_CALL)
    );
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
    console.green(EMessageEvent.SEND_MESSAGE, msg);
    // this.socket.emit(EMessageEvent.SEND, msg);
  }

  public sendSignal(signal: ISignal) {
    console.green(EMessageEvent.SEND_SIGNAL, signal);
    this.socket.emit(EMessageEvent.SEND_SIGNAL, signal);
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
      console.red(`socket connected ${this.socket.id}`);
    });

    this.socket.on('disconnect', () => {
      // this.socket.disconnect();
      console.red(`socket disconnected ${this.socket.id}`);
    });

    this.socket.on(EMessageEvent.THROW_ERROR, (e: Error) => {
      messageBox.error(e);
    });

    this.socket.on(EMessageEvent.OBTAIN_MESSAGE, (message: IMessage) => {
      this.messageManager.insert(message);
    });
  }
}
