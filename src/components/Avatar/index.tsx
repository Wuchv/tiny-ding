import * as React from 'react';
import { Avatar as AntdAvatar, Image } from 'antd';

import './style.less';

interface IAvatar {
  size?: 'small' | 'middle' | 'large';
  src?: string;
  nickname?: string;
}

export const Avatar: React.FunctionComponent<IAvatar> = React.memo(
  ({ size = 'middle', src, nickname }) => {
    const avatarComponent = React.useMemo(() => {
      let text = nickname;
      if (nickname && nickname.length > 2) {
        text = nickname.slice(nickname.length - 2, nickname.length);
      }
      let result = (
        <AntdAvatar shape="square" className={`avatar ${size}`}>
          {!!text ? text : 'Ding'}
        </AntdAvatar>
      );
      if (src) {
        result = (
          <AntdAvatar
            shape="square"
            className={`avatar ${size}`}
            src={<Image src={src} />}
          />
        );
      }
      return result;
    }, [size, src, nickname]);

    return avatarComponent;
  }
);
