import * as React from 'react';
import { Layout } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import {
  increment,
  selectCount,
  incrementByAmount,
} from '../redux/reducers/counterReducer';

import { ChatList } from '@src/components/main/ChatList';

import './Main.less';

export const Main: React.FunctionComponent<unknown> = React.memo(() => {
  const dispatch = useDispatch();
  const count = useSelector(selectCount);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Layout.Header
        onClick={() => {
          console.log(incrementByAmount(10));
          dispatch(increment());
        }}
      >
        {count}
      </Layout.Header>
      <Layout>
        <Layout.Sider theme="light" width="250">
          <ChatList />
        </Layout.Sider>
        <Layout.Content>content</Layout.Content>
      </Layout>
    </Layout>
  );
});
