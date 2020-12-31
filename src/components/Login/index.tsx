import * as React from 'react';
import { Button } from 'antd';

import './index.less';

export const Login: React.FunctionComponent<unknown> = React.memo(() => {
  return (
    <div>
      <Button type="primary">login</Button>
    </div>
  );
});
