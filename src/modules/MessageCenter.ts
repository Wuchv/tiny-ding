import { useSelector } from 'react-redux';
import { selectUser } from '@src/redux/reducers/userReducer';
import { selectChat } from '@src/redux/reducers/chatReducer';

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
  public sendMsg(msg: IMessage) {
    localMessages.insert(msg);
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

  public msgWrap(msg: Partial<IMessage>): IMessage {
    const timestamp = Date.now();
    const { uid } = useSelector(selectUser);
    const { currentTo } = useSelector(selectChat);
    return {
      ...msg,
      msgId: `${uid}:${currentTo}:${timestamp}`,
      from: uid,
      to: currentTo,
      timestamp,
    } as IMessage;
  }
}

export default new MessageCenter();
