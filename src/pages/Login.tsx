import * as React from 'react';
import { Input, Divider, Checkbox, Typography, message } from 'antd';
import { LoginOutlined, CloseOutlined } from '@ant-design/icons';
import { openMainWindow } from '@src/utils';
import { loginAction } from '@src/redux/reducers/userReducer';
import { useReduxData } from '@src/hooks/useRedux';

import './Login.less';

export const Login: React.FunctionComponent<unknown> = React.memo(() => {
  const [dispatch, { uid, access_token }] = useReduxData();
  const [account, setAccount] = React.useState<string>('');
  const [password, setPassword] = React.useState<string>('');

  const inputChange = React.useCallback((e, name: string): void => {
    const value = e.target.value;
    if (name === 'account') {
      setAccount(value);
    } else if (name === 'password') {
      setPassword(value);
    }
  }, []);

  const autoLogin = React.useCallback((e) => {
    console.log(`autoLogin checked = ${e.target.checked}`);
  }, []);

  const submit = React.useCallback(() => {
    dispatch(loginAction({ account, password, username: account }));
  }, [account, password]);

  React.useEffect(() => {
    if (uid && access_token) {
      openMainWindow();
    }
  }, [uid, access_token]);

  return (
    <div className="login-container">
      <div className="close" onClick={() => window.$client.closeWindow()}>
        <CloseOutlined />
      </div>
      <div className="avatar"></div>
      <div className="input-wrap">
        <Input
          placeholder="请输入手机号"
          bordered={false}
          onChange={(e) => inputChange(e, 'account')}
        />
        <Divider />
        <Input
          placeholder="请输入密码"
          type="password"
          bordered={false}
          onChange={(e) => inputChange(e, 'password')}
          addonAfter={
            <LoginOutlined
              onClick={submit}
              style={{
                visibility: !!account && !!password ? 'visible' : 'hidden',
              }}
            />
          }
        />
        <Divider />
      </div>
      <footer className="footer">
        <Checkbox onChange={autoLogin}>自动登录</Checkbox>
        <div className="operation-wrap">
          <Typography.Text type="secondary">忘记密码</Typography.Text>
          <span> | </span>
          <Typography.Text type="secondary">新用户注册</Typography.Text>
        </div>
      </footer>
    </div>
  );
});
