import * as React from 'react';
import { useSelector } from 'react-redux';
import { Layout } from 'antd';

import { selectUser } from '@src/redux/reducers/userReducer';
import { Avatar } from '@src/components/Avatar';

import './style.less';

interface IHeader {}

export const Header: React.FunctionComponent<IHeader> = React.memo(() => {
  const { nickname, avatarUrl } = useSelector(selectUser);

  return (
    <Layout.Header className="header-container">
      <div className="header-lt">
        <Avatar nickname={nickname} src={avatarUrl} />
      </div>
    </Layout.Header>
  );
});
