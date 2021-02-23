import * as React from 'react';
import { List } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { chooseChatPartnerAction } from '@src/redux/reducers/chatReducer';

import { Avatar } from '@src/components/Avatar';

import './style.less';

interface IChatList {}

export const ChatList: React.FunctionComponent<IChatList> = React.memo(() => {
  const dispatch = useDispatch();

  const data = [
    {
      title: 'Ant Design Title 1',
      subtitle: 'subtitle',
      avatarUrl: '',
    },
    {
      title: 'Ant Design Title 2',
      subtitle: 'subtitle',
      avatarUrl: '',
    },
    {
      title: 'Ant Design Title 3',
      subtitle: 'subtitle',
      avatarUrl: '',
    },
  ];

  const handleChooseChatPartner = React.useCallback(
    (chatPartner) =>
      dispatch(
        chooseChatPartnerAction({
          currentConversationTitle: chatPartner.title,
          currentConversationAvatar: chatPartner.avatarUrl,
        })
      ),
    []
  );

  return (
    <List
      className="list"
      itemLayout="horizontal"
      dataSource={data}
      renderItem={(item) => (
        <List.Item onClick={() => handleChooseChatPartner(item)}>
          <CloseOutlined />
          <List.Item.Meta
            avatar={
              <Avatar text={item.title} src={item.avatarUrl} size="large" />
            }
            title={item.title}
            description={item.subtitle}
          />
        </List.Item>
      )}
    />
  );
});
