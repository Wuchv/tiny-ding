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
    },
    {
      title: 'Ant Design Title 2',
    },
    {
      title: 'Ant Design Title 3',
    },
    {
      title: 'Ant Design Title 4',
    },
    {
      title: 'Ant Design Title 3',
    },
    {
      title: 'Ant Design Title 4',
    },
  ];
  const handleChooseChatPartner = React.useCallback(() => {
    console.log('aa')
    dispatch(
      chooseChatPartnerAction({
        currentConversationTitle: 'aaa',
        currentConversationAvatar: '',
      })
    );
  }, [data]);

  return (
    <List
      className="list"
      itemLayout="horizontal"
      dataSource={data}
      renderItem={(item) => (
        <List.Item onClick={handleChooseChatPartner}>
          <CloseOutlined />
          <List.Item.Meta
            avatar={
              <Avatar
                text={item.title}
                src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
              />
            }
            title={item.title}
            description="Ant Design"
          />
        </List.Item>
      )}
    />
  );
});
