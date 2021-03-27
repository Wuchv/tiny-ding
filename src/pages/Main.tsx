import * as React from 'react';
import { Layout, Divider } from 'antd';
import { useReduxData } from '@src/hooks/useRedux';

import { Header } from '@src/components/Header';
import { ChatList } from '@src/components/ChatList';
import { ChatBox } from '@src/components/ChatBox';
import { InputField } from '@src/components/InputField';

import './Main.less';
import { openLoginWindow } from '@src/utils';

export const Main: React.FC<unknown> = React.memo(() => {
  const [, { uid, currentTo }] = useReduxData();
  const [comMap, setComMap] = React.useState<any>({});

  React.useEffect(() => {
    if (!uid) {
      openLoginWindow();
    }
  }, []);

  React.useEffect(() => {
    setComMap({ ...comMap, [currentTo]: <ChatBox /> });
    console.log(comMap);
  }, [currentTo]);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header />
      <Layout>
        <Layout.Sider theme="light" width="260" className="main-sider">
          <ChatList />
        </Layout.Sider>
        <Layout.Content className="main-content">
          <Divider />
          <ChatBox />
          <InputField />
        </Layout.Content>
      </Layout>
    </Layout>
  );
});
