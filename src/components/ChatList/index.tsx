import * as React from 'react';
import { RxDocument } from 'rxdb';
import { List, Badge } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import {
  chooseChatPartnerAction,
  noConversation,
} from '@src/redux/reducers/chatReducer';
import { ConversationManager, MessageManager } from '@src/modules/RemoteGlobal';
import { useReduxData } from '@src/hooks/useRedux';

import { Avatar } from '@src/components/Avatar';

import './style.less';

interface IChatList {}

export const ChatList: React.FC<IChatList> = React.memo(() => {
  const [
    dispatch,
    { uid, currentTo, currentCid, access_token },
  ] = useReduxData();
  const [chatList, setChatList] = React.useState<IConversation[]>([]);

  // 获取conversations
  React.useEffect(() => {
    ConversationManager.getAllDocuments().then((res: IConversation[]) => {
      setChatList(res);
    });
  }, [uid, access_token]);

  React.useEffect(() => {
    const insertConSub = ConversationManager.insert$.subscribe(
      (conversation: IConversation) => {
        setChatList([...chatList, conversation]);
      }
    );

    // 订阅其它conversation的message insert，增加未读消息的数量
    const unreadDotSub = MessageManager.unreadDot$(uid, currentTo).subscribe(
      async (msg) => {
        const cid = `${msg.toId}:${msg.fromId}`;
        const conversationDoc: RxDocument<IConversation> = await ConversationManager.findOne(
          cid
        );
        if (conversationDoc) {
          conversationDoc.update({
            $inc: {
              unread: 1,
            },
          });
        } else {
          ConversationManager.insert({
            cid,
            toId: msg.toId,
            title: msg.sender,
            unread: 0,
            avatarUrl: msg.avatarUrl,
          });
        }
      }
    );

    const unreadDotUpdateSub = ConversationManager.update$.subscribe(
      (conversation: IConversation) => {
        const _chatList = chatList.map((chat) => {
          if (chat.cid === conversation.cid) {
            chat.unread = conversation.unread;
          }
          return chat;
        });
        setChatList(_chatList);
      }
    );

    return () => {
      insertConSub.unsubscribe();
      unreadDotSub.unsubscribe();
      unreadDotUpdateSub.unsubscribe();
    };
  }, [uid, currentTo, chatList]);

  // 切换conversation，拉取所有未读消息，清空未读消息数量
  const changeConversation = React.useCallback(
    async (conversation: IConversation) => {
      dispatch(
        chooseChatPartnerAction({
          currentCid: conversation.cid,
          currentTo: conversation.toId,
          currentConversationTitle: conversation.title,
          currentConversationAvatar: conversation.avatarUrl,
        })
      );

      // 清空未读消息红点
      if (conversation.unread > 0) {
        const conversationDoc: RxDocument<IConversation> = await ConversationManager.findOne(
          conversation.cid
        );
        if (conversationDoc) {
          conversationDoc.update({
            $set: {
              unread: 0,
            },
          });
        }
      }
    },
    []
  );

  const deleteConversation = React.useCallback(
    async (cid: string) => {
      const conversation = await ConversationManager.findOne(cid);
      conversation.remove();
      const _chatList = chatList.filter((con) => con.cid !== cid);
      setChatList(_chatList);
      if (_chatList.length > 0) {
        changeConversation(_chatList[0]);
      } else {
        dispatch(noConversation());
      }
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
          <Badge count={conversation.unread} offset={[-12, 4]} size="small">
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
          </Badge>
        </List.Item>
      )}
    />
  );
});
