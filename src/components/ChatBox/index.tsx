import * as React from 'react';

import './style.less';

interface IChatBox {}

export const ChatBox: React.FunctionComponent<IChatBox> = React.memo(() => {
  React.useEffect(() => {}, []);
  return <div style={{ height: '300px' }}>ChatBox</div>;
});
