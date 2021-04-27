import * as React from 'react';
import { Layout, Divider } from 'antd';
import { Route, Switch } from 'react-router-dom';
import { useReduxData } from '@src/hooks/useRedux';

import { Header } from '@src/components/Header';
import { ChatList } from '@src/components/ChatList';
import { FriendList } from '@src/components/FriendList';
import { ChatBox } from '@src/components/ChatBox';
import { InputField } from '@src/components/InputField';

import './Main.less';
import { openLoginWindow } from '@src/utils';

export const Main: React.FC<unknown> = React.memo(() => {
  const [, { uid, currentTo, access_token }] = useReduxData();
  const [comMap, setComMap] = React.useState<any>({});

  React.useEffect(() => {
    if (!uid || !access_token) {
      openLoginWindow();
    }
  }, [uid, access_token]);

  React.useEffect(() => {
    setComMap({ ...comMap, [currentTo]: <ChatBox /> });
    console.log(comMap);
  }, [currentTo]);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header />
      <Layout>
        <Layout.Sider theme="light" width="260" className="main-sider">
          <Switch>
            <Route path="/main/chat-list" component={ChatList}></Route>
            <Route path="/main/friend-list" component={FriendList}></Route>
          </Switch>
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
