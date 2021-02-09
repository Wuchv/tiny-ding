import * as React from 'react';

import './style.less';

interface IAvatar {}

export const Avatar: React.FunctionComponent<IAvatar> = React.memo(() => {
  React.useEffect(() => {}, []);
  return <div>Avatar</div>;
});
