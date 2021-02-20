import * as React from 'react';
import MessageCenter from '@src/modules/MessageCenter';

import './style.less';

interface IChatBox {}

export const ChatBox: React.FunctionComponent<IChatBox> = React.memo(() => {
  const [msgList, setMsgList] = React.useState<any[]>([]);

  React.useEffect(() => {
    const { msgChange$, filterMsg } = MessageCenter;
    msgChange$().subscribe(() => {
      filterMsg().then((docs) => {
        const msgList = docs.map((doc) => doc.get('content'));
        setMsgList(msgList);
      });
    });
  }, []);
  return <div className="chat-box">{msgList.join('.')}</div>;
});
