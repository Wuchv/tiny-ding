import * as React from 'react';
import { Layout, Typography } from 'antd';
import { MessageOutlined, TeamOutlined } from '@ant-design/icons';

import { useReduxData } from '@src/hooks/useRedux';

import { Avatar } from '@src/components/Avatar';

import './style.less';

interface IHeader {}

export const Header: React.FunctionComponent<IHeader> = React.memo(() => {
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

  const handleIconClick = React.useCallback(
    (type: 'message' | 'friendList') => {
      setIsMessageIconClicked(!isMessageIconClicked);
      setIsTeamIconClicked(!isTeamIconClicked);
      console.log(type);
    },
    [isMessageIconClicked, isTeamIconClicked]
  );

  return (
    <Layout.Header className="header-container flex">
      <div className="flex header-lt">
        <Avatar text={nickname} src={avatarUrl} size="small" />
        <MessageOutlined
          className={isMessageIconClicked ? 'icon-active' : ''}
          onClick={() => !isMessageIconClicked && handleIconClick('message')}
        />
        <TeamOutlined
          className={isTeamIconClicked ? 'icon-active' : ''}
          onClick={() => !isTeamIconClicked && handleIconClick('friendList')}
        />
      </div>
      <div className="flex header-rt">
        <Avatar
          text={currentConversationTitle}
          src={currentConversationAvatar}
          size="middle"
        />
        <Typography.Title level={5}>
          {currentConversationTitle}
        </Typography.Title>
      </div>
    </Layout.Header>
  );
});
