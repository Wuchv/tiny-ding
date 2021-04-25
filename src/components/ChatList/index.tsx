import * as React from 'react';
import { filter } from 'rxjs/operators';
import { RxChangeEvent } from 'rxdb';
import { List } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { chooseChatPartnerAction } from '@src/redux/reducers/chatReducer';
import {
  ConversationManager,
  MessageManager,
  UserManager,
} from '@src/modules/RemoteGlobal';
import { useReduxData } from '@src/hooks/useRedux';

import { Avatar } from '@src/components/Avatar';

import './style.less';

interface IChatList {}

export const ChatList: React.FC<IChatList> = React.memo(() => {
  const [dispatch, { uid, currentTo, currentCid }] = useReduxData();
  const [chatList, setChatList] = React.useState<IConversation[]>([]);

  React.useEffect(() => {
    ConversationManager.getAllDocuments().then((res: IConversation[]) =>
      setChatList(res)
    );

    const insertConSub = ConversationManager.insert$.subscribe(
      (changeEvent: RxChangeEvent) => {
        const conversation = changeEvent.rxDocument.toJSON();
        setChatList([...chatList, conversation]);
      }
    );
    //TODO：未读消息红点；未读消息增量式拉取
    // 订阅其它conversation的message insert，增加未读消息的数量
    // MessageManager.insert$.pipe(
    //   filter((changeEvent: RxChangeEvent) => {
    //     const msg = changeEvent.rxDocument.toJSON();
    //     return (
    //       (msg.fromId !== uid && msg.toId !== currentTo) ||
    //       (msg.fromId !== currentTo && msg.toId !== uid)
    //     );
    //   })
    // );
    return () => {
      insertConSub.unsubscribe();
    };
  }, []);

  // 切换conversation，拉取所有未读消息，清空未读消息数量
  const changeConversation = React.useCallback(
    (conversation: IConversation) =>
      dispatch(
        chooseChatPartnerAction({
          currentCid: conversation.cid,
          currentTo: conversation.toId,
          currentConversationTitle: conversation.title,
          currentConversationAvatar: conversation.avatarUrl,
        })
      ),
    []
  );

  const deleteConversation = React.useCallback(
    async (cid: string) => {
      const conversation = await ConversationManager.findOne(cid);
      conversation.remove();
      const _chatList = chatList.filter((con) => con.cid !== cid);
      setChatList(_chatList);
      !!_chatList[0] && changeConversation(_chatList[0]);
    },
    [chatList]
  );

  return (
    <List
      className="chat-list"
      itemLayout="horizontal"
      dataSource={chatList}
      renderItem={(conversation: IConversation) => (
        <List.Item
          className={`${conversation.cid === currentCid ? 'active' : ''}`}
          onClick={() => changeConversation(conversation)}
        >
          <CloseOutlined onClick={() => deleteConversation(conversation.cid)} />
          <List.Item.Meta
            avatar={
              <Avatar
                text={conversation.title}
                src={conversation.avatarUrl}
                size="large"
              />
            }
            title={conversation.title}
            description={conversation.subtitle}
          />
        </List.Item>
      )}
    />
  );
});
