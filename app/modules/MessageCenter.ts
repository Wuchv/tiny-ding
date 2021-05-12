import * as io from 'socket.io-client';
import { fromEvent, Observable, interval, of } from 'rxjs';
import { concat, filter, merge, take, takeUntil } from 'rxjs/operators';
import { RxDocument } from 'rxdb';
import { messageBox } from '../dialog';
import { getUserManager, getMessageManager, getConversationManager } from '.';
import UserManager from './dbManager/UserManager';
import MessageManager from './dbManager/MessageManager';
import { host, port } from '../constants';
import { offline } from '../services';

enum EMessageEvent {
  SEND_MESSAGE = 'send_message_to_server',
  OBTAIN_MESSAGE = 'obtain_message_from_server',
  THROW_ERROR = 'throw_send_message_error',
  SEND_SIGNAL = 'send_signal_to_server',
  OBTAIN_SIGNAL = 'obtain_signal_from_server',
}

enum ESignalType {
  INITIATE_VIDEO_CALL = 'initiate_video_call',
  AGREE_TO_VIDEO_CALL = 'agree_to_video_call',
  REJECT_VIDEO_CALL = 'reject_video_call',
  USER_OFFLINE = 'user_offline',
  NOT_ANSWERED = 'not_answered',
  PREPARE_TO_RECEIVE_VIDEO_STREAM = 'prepare_to_receive_video_stream',
  STOP_SEND_PREPARE = 'stop_send_prepare_to_receive_video_stream',
  HANG_UP = 'hang_up',
}

export const ofType = (type: ESignalType) => (source: Observable<ISignal>) =>
  source.pipe(filter((signal) => signal.type === type));

export default class MessageCenter implements IMessageCenter {
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
      ofType(ESignalType.INITIATE_VIDEO_CALL)
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

  public get userOffline$(): Observable<ISignal> {
    return fromEvent(this.socket, EMessageEvent.OBTAIN_SIGNAL).pipe(
      ofType(ESignalType.USER_OFFLINE)
    );
  }

  public get notAnswered$(): Observable<ISignal> {
    return fromEvent(this.socket, EMessageEvent.OBTAIN_SIGNAL).pipe(
      ofType(ESignalType.NOT_ANSWERED)
    );
  }

  public get sendVideoStream$(): Observable<ISignal> {
    return fromEvent(this.socket, EMessageEvent.OBTAIN_SIGNAL).pipe(
      ofType(ESignalType.PREPARE_TO_RECEIVE_VIDEO_STREAM)
    );
  }

  public get stopSendPrepare$(): Observable<ISignal> {
    return fromEvent(this.socket, EMessageEvent.OBTAIN_SIGNAL).pipe(
      ofType(ESignalType.STOP_SEND_PREPARE)
    );
  }

  public get sendPrepareToReceiveStream$(): Observable<number> {
    return interval(2000).pipe(
      concat(of(-1)),
      take(6),
      takeUntil(this.stopSendPrepare$)
    );
  }

  public get hangUp$(): Observable<ISignal> {
    return fromEvent(this.socket, EMessageEvent.OBTAIN_SIGNAL).pipe(
      ofType(ESignalType.HANG_UP)
    );
  }

  public noCall(delay: number) {
    return interval(delay).pipe(
      takeUntil(this.rejectVideoCall$.pipe(merge(this.agreeToVideoCall$)))
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
    this.socket.emit(EMessageEvent.SEND_MESSAGE, msg);
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

  public disconnect() {
    this.socket.disconnect();
  }

  public async initSocket() {
    const own = await this.userManager.getOwnInfo();
    if (!own.uid) return;

    this.socket = io.connect(`ws://${host}:${port}/im`, {
      transports: ['websocket'],
      query: {
        uid: own.uid,
      },
    });

    this.socket.on('connect', () => {
      console.red(`socket connected ${this.socket.id}`);
      // socket连接时拉取离线期间的消息
      loadUnreadMessage();
    });

    this.socket.on('disconnect', () => {
      console.red(`socket disconnected ${this.socket.id}`);
      // socket断连时修改offline时间戳
      offline({ uid: own.uid, timestamp: Date.now() });
    });

    this.socket.on(EMessageEvent.THROW_ERROR, (e: Error) => {
      messageBox.error(e);
    });

    this.socket.on(EMessageEvent.OBTAIN_MESSAGE, (message: IMessage) => {
      console.green(EMessageEvent.OBTAIN_MESSAGE, message);
      this.messageManager.insert(message);
    });
  }
}

async function loadUnreadMessage() {
  const own = await getUserManager().getOwnInfo();
  if (!own.access_token || !own.uid) {
    return;
  }
  // 获取未读消息
  const msgs = await getMessageManager().loadMessage(own.uid);

  if (msgs && msgs.length === 0) return;

  // 计算每个会话未读消息的数量
  const unreadMap: Map<string, IConversation> = new Map();
  msgs.forEach((msg) => {
    const cid = `${own.uid}:${msg.fromId}`;
    const con = unreadMap.get(cid);
    if (con) {
      unreadMap.set(cid, { ...con, unread: con.unread + 1 });
    } else {
      unreadMap.set(cid, {
        cid,
        toId: own.uid,
        title: msg.sender,
        unread: 1,
        avatarUrl: msg.avatarUrl,
      });
    }
  });
  // 更新conversation
  const conversations = await getConversationManager().getAllDocuments(false);
  conversations.forEach((con: RxDocument<IConversation, any>) => {
    const doc: IConversation = con.toJSON();
    if (!unreadMap.get(doc.cid)) {
      return;
    }
    const unreadNum = unreadMap.get(doc.cid).unread;
    if (unreadNum) {
      con.update({
        $set: {
          unread: unreadNum,
        },
      });
      unreadMap.delete(doc.cid);
    }
  });
  // 插入新的conversation
  getConversationManager().bulkInsert([...unreadMap.values()]);
}
