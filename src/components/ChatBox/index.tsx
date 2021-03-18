import * as React from 'react';
import MessageCenter from '@src/modules/MessageCenter';

import { Message } from '@src/components/Message';

import './style.less';

interface IChatBox {}

export const ChatBox: React.FunctionComponent<IChatBox> = React.memo(() => {
  const [msgList, setMsgList] = React.useState<any[]>([]);

  React.useEffect(() => {
    const { msgChange$, filterMsg } = MessageCenter;
    msgChange$().subscribe(() => {
      filterMsg().then((docs) => {
        const msgList = docs.map((doc) => doc.toJSON());
        setMsgList(msgList);
      });
    });
    filterMsg().then((docs) => {
      const msgList = docs.map((doc) => doc.toJSON());
      setMsgList(msgList);
    });
  }, []);

  return (
    <div className="chat-box">
      {msgList.map((msg: IMessage) => (
        <Message key={msg.msgId} {...msg} />
      ))}
    </div>
  );
});
