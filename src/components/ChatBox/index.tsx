import * as React from 'react';
import MessageManager from '@src/modules/dbManager/MessageManager';
import { Message } from '@src/components/Message';

import './style.less';
import { useReduxData } from '@src/hooks/useRedux';
import MessageCenter, { EMessageEvent } from '@src/modules/MessageCenter';
import { filter } from 'rxjs/operators';
import { RxChangeEvent } from 'rxdb';

interface IChatBox {}

export const ChatBox: React.FunctionComponent<IChatBox> = React.memo(() => {
  const chatBoxRef: React.RefObject<HTMLDivElement> = React.useRef(null);
  const [, { uid, currentTo }] = useReduxData();
  const [msgList, setMsgList] = React.useState<IMessage[]>([]);

  const updateMsg = React.useCallback(() => {
    MessageManager.filterMsgByCid(uid, currentTo)
      .then(setMsgList)
      .then(() => {
        chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
      });
  }, [uid, currentTo]);

  React.useEffect(() => {
    updateMsg();
    const msgSub = MessageManager.insert$
      .pipe(
        filter((changeEvent: RxChangeEvent) => {
          const msg = changeEvent.rxDocument.toJSON();
          return msg.fromId === uid && msg.toId === currentTo;
        })
      )
      .subscribe(() => {
        updateMsg();
      });

    return () => msgSub.unsubscribe();
  }, [uid, currentTo]);

  return (
    <div ref={chatBoxRef} className="chat-box">
      {msgList.map((msg: IMessage) => (
        <Message key={msg.msgId} {...msg} />
      ))}
    </div>
  );
});
