import * as React from 'react';
import { Layout } from 'antd';

import { ChatList } from '@src/components/main/ChatList';

import './Main.less';

export const Main: React.FunctionComponent<unknown> = React.memo(() => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Layout.Header></Layout.Header>
      <Layout>
        <Layout.Sider theme="light" width="250">
          <ChatList />
        </Layout.Sider>
        <Layout.Content>content</Layout.Content>
      </Layout>
    </Layout>
  );
});