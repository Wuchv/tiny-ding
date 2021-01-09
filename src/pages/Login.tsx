import * as React from 'react';
import { Input, Divider, Checkbox, Typography } from 'antd';
import { LoginOutlined, CloseOutlined } from '@ant-design/icons';
import { openMainWindow } from '@src/utils';
import { login } from '@src/services/login';

import './Login.less';

export const Login: React.FunctionComponent<unknown> = React.memo(() => {
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
    login().then(console.log);
    openMainWindow();
    console.log(`account:${account};password:${password}`);
  }, [account, password]);

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
              style={{ visibility: !!password ? 'visible' : 'hidden' }}
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
