import * as React from 'react';
import { useHistory } from 'react-router-dom';
import { Layout, Typography, Menu, Dropdown } from 'antd';
import { MessageOutlined, TeamOutlined } from '@ant-design/icons';
import { useReduxData } from '@src/hooks/useRedux';
import { UserManager, MessageCenter } from '@src/modules/RemoteGlobal';
import { logoutAction } from '@src/redux/reducers/userReducer';

import { Avatar } from '@src/components/Avatar';

import './style.less';

interface IHeader {}

export const Header: React.FC<IHeader> = React.memo(() => {
  const history = useHistory();
  const [
    dispatch,
    {
      uid,
      nickname,
      avatarUrl,
      currentConversationTitle,
      currentConversationAvatar,
    },
  ] = useReduxData();
  const [isMessageIconClicked, setIsMessageIconClicked] =
    React.useState<boolean>(true);
  const [isTeamIconClicked, setIsTeamIconClicked] =
    React.useState<boolean>(false);

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

  const changeIconState = React.useCallback((messageIconState: boolean) => {
    setIsMessageIconClicked(messageIconState);
    setIsTeamIconClicked(!messageIconState);
  }, []);

  const exitLogin = React.useCallback(async () => {
    const userDoc = await UserManager.findOne(uid);
    if (userDoc) {
      await userDoc.remove();
    }
    MessageCenter.disconnect();
    dispatch(logoutAction());
  }, []);

  const avatarMenu = React.useMemo(
    () => (
      <Menu>
        <Menu.Item key="exit" onClick={exitLogin}>
          <Typography.Text>退出登录</Typography.Text>
        </Menu.Item>
      </Menu>
    ),
    [exitLogin]
  );

  return (
    <Layout.Header className="header-container flex">
      <div className="flex header-lt">
        <Dropdown
          overlay={avatarMenu}
          trigger={['click']}
          overlayClassName="avatar-dropdown"
        >
          <div style={{ height: '56px' }}>
            <Avatar text={nickname} src={avatarUrl} size="small" />
          </div>
        </Dropdown>
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
