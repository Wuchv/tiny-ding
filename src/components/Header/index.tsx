import * as React from 'react';
import { Layout } from 'antd';

import { Avatar } from '@src/components/Avatar';

import './style.less';

interface IHeader {}

export const Header: React.FunctionComponent<IHeader> = React.memo(() => {
  return (
    <Layout.Header className="header-container">
      <div className="header-lt">
        <Avatar />
      </div>
    </Layout.Header>
  );
});
