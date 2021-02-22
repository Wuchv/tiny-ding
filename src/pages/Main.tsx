import * as React from 'react';
import { Layout } from 'antd';

import { Header } from '@src/components/Header';
import { ChatList } from '@src/components/ChatList';
import { ChatBox } from '@src/components/ChatBox';
import { InputField } from '@src/components/InputField';

import './Main.less';

export const Main: React.FunctionComponent<unknown> = React.memo(() => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header />
      <Layout>
        <Layout.Sider theme="light" width="260" className="main-sider">
          <ChatList />
        </Layout.Sider>
        <Layout.Content className='main-content'>
          <ChatBox />
          <InputField />
        </Layout.Content>
      </Layout>
    </Layout>
  );
});
