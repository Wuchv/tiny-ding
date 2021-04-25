import * as React from 'react';
import { useHistory } from 'react-router-dom';
import { Layout, Typography } from 'antd';
import { MessageOutlined, TeamOutlined } from '@ant-design/icons';

import { useReduxData } from '@src/hooks/useRedux';

import { Avatar } from '@src/components/Avatar';

import './style.less';

interface IHeader {}

export const Header: React.FC<IHeader> = React.memo(() => {
  const history = useHistory();
  const {
    nickname,
    avatarUrl,
    currentConversationTitle,
    currentConversationAvatar,
  } = useReduxData()[1];
  const [
    isMessageIconClicked,
    setIsMessageIconClicked,
  ] = React.useState<boolean>(true);
  const [isTeamIconClicked, setIsTeamIconClicked] = React.useState<boolean>(
    false
  );

  const changeIconState = React.useCallback((messageIconState: boolean) => {
    setIsMessageIconClicked(messageIconState);
    setIsTeamIconClicked(!messageIconState);
  }, []);

  React.useEffect(() => {
    // 监听路由变化，设置icon
    if (location.href.includes('friend-list')) {
      changeIconState(false);
    } else {
      changeIconState(true);
    }
    history.listen((route) => {
      const { pathname } = route;
      if (pathname === '/main/chat-list') {
        changeIconState(true);
      } else if (pathname === '/main/friend-list') {
        changeIconState(false);
      }
    });
  }, []);

  return (
    <Layout.Header className="header-container flex">
      <div className="flex header-lt">
        <Avatar text={nickname} src={avatarUrl} size="small" />
        <MessageOutlined
          className={isMessageIconClicked ? 'icon-active' : ''}
          onClick={() =>
            !isMessageIconClicked && history.push('/main/chat-list')
          }
        />
        <TeamOutlined
          className={isTeamIconClicked ? 'icon-active' : ''}
          onClick={() =>
            !isTeamIconClicked && history.push('/main/friend-list')
          }
        />
      </div>
      <div className="flex header-rt">
        <Avatar
          text={currentConversationTitle}
          src={currentConversationAvatar}
        />
        <Typography.Title level={5}>
          {currentConversationTitle}
        </Typography.Title>
      </div>
    </Layout.Header>
  );
});
