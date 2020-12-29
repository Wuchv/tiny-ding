import * as React from 'react';
import { Button } from 'antd';

import './Hello.less';

export const Hello: React.FunctionComponent<unknown> = React.memo(() => {
  return (
    <div>
      <Button type="primary">test</Button>
    </div>
  );
});
