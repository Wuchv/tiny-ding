import * as React from 'react';
import { Avatar as AntdAvatar, Image } from 'antd';

import './style.less';

interface IAvatar {
  size?: 'small' | 'middle' | 'large';
  src?: string;
  text?: string;
}

export const Avatar: React.FC<IAvatar> = React.memo(
  ({ size = 'middle', src, text }) => {
    const avatarComponent = React.useMemo(() => {
      let textInterception = text;
      if (text && text.length > 2) {
        textInterception = text.slice(text.length - 2, text.length);
      }
      let result = (
        <AntdAvatar shape="square" className={`avatar ${size}`}>
          {!!textInterception ? textInterception : 'Ding'}
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
    }, [size, src, text]);

    return avatarComponent;
  }
);
