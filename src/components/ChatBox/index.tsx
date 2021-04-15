import * as React from 'react';
import { MessageManager } from '@src/modules/RemoteGlobal';
import { Message } from '@src/components/Message';
import { useReduxData } from '@src/hooks/useRedux';

import './style.less';

export const ChatBox: React.FC<unknown> = React.memo(() => {
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
    const msgSub = MessageManager.collectionFilterById$(
      uid,
      currentTo
    ).subscribe(updateMsg);

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
