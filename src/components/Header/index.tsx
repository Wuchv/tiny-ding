import * as React from 'react';
import { useSelector } from 'react-redux';
import { Layout } from 'antd';
import { MessageOutlined, TeamOutlined } from '@ant-design/icons';

import { selectUser } from '@src/redux/reducers/userReducer';
import { Avatar } from '@src/components/Avatar';

import './style.less';

interface IHeader {}

export const Header: React.FunctionComponent<IHeader> = React.memo(() => {
  const { nickname, avatarUrl } = useSelector(selectUser);
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
    <Layout.Header className="header-container">
      <div className="header-lt">
        <Avatar nickname={nickname} src={avatarUrl} size="small" />
        <MessageOutlined
          className={isMessageIconClicked ? 'icon-active' : ''}
          onClick={() => !isMessageIconClicked && handleIconClick('message')}
        />
        <TeamOutlined
          className={isTeamIconClicked ? 'icon-active' : ''}
          onClick={() => !isTeamIconClicked && handleIconClick('friendList')}
        />
      </div>
    </Layout.Header>
  );
});
