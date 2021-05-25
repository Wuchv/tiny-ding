import { Observable } from 'rxjs';

export interface MessageCenter {
  socket: SocketIOClient.Socket;
  receiveVideoCall$: Observable<ISignal>;
  agreeToVideoCall$: Observable<ISignal>;
  rejectVideoCall$: Observable<ISignal>;
  userOffline$: Observable<ISignal>;
  notAnswered$: Observable<ISignal>;
  sendVideoStream$: Observable<ISignal>;
  stopSendPrepare$: Observable<ISignal>;
  sendPrepareToReceiveStream$: Observable<number>;
  hangUp$: Observable<ISignal>;

  initSocket(): void;
  noCall(delay: number): Observable<number>;
  sendMsg(msg: IMessage): void;
  sendSignal(signal: ISignal): void;
  disconnect(): void;
  insertMsg(
    msg: Partial<IMessage>,
    file: Pick<File, 'name' | 'type'> & { data?: any },
    isCache: boolean
  ): Promise<IMessage>;
  updateMsg(msg: Partial<IMessage>): Promise<Partial<IMessage>>;
  deleteMsg(msgId: string): Promise<void>;
}
