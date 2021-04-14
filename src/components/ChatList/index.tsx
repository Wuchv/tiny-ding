import * as React from 'react';
import { List } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { chooseChatPartnerAction } from '@src/redux/reducers/chatReducer';
import { ConversationManager } from '@src/modules/RxdbManager';

import { Avatar } from '@src/components/Avatar';

import './style.less';
import { useReduxData } from '@src/hooks/useRedux';

interface IChatList {}

export const ChatList: React.FC<IChatList> = React.memo(() => {
  const [dispatch, { currentCid }] = useReduxData();
  const [chatList, setChatList] = React.useState<IConversation[]>([]);

  React.useEffect(() => {
    ConversationManager.getAllDocuments().then((res: IConversation[]) =>
      setChatList(res as IConversation[])
    );
  }, []);

  const handleChooseChatPartner = React.useCallback(
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

  return (
    <List
      className="list"
      itemLayout="horizontal"
      dataSource={chatList}
      renderItem={(conversation: IConversation) => (
        <List.Item
          className={`${conversation.cid === currentCid ? 'active' : ''}`}
          onClick={() => handleChooseChatPartner(conversation)}
        >
          <CloseOutlined />
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
