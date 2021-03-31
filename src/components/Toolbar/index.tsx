import * as React from 'react';
import { notification } from 'antd';
import { AudioOutlined } from '@ant-design/icons';
import { generalSubject$, ERxEvent } from '@src/modules/RxSubject';

import { AudioModal } from './AudioModal';

import './style.less';

export const Toolbar: React.FC<unknown> = React.memo(() => {
  const [isAudioShow, setIsAudioShow] = React.useState<boolean>(false);

  const showAudioModal = React.useCallback(() => {
    if (!isAudioShow) {
      setIsAudioShow(true);
      notification.open({
        key: 'audio',
        message: <AudioModal />,
        placement: 'bottomRight',
        duration: null,
        className: 'audio-modal',
        bottom: 170,
        onClose: () => {
          setIsAudioShow(false);
          generalSubject$.next({ action: ERxEvent.AUDIO_CLOSE });
        },
      });
    }
  }, [isAudioShow]);

  return (
    <div className="toolbar">
      <AudioOutlined onClick={showAudioModal} />
    </div>
  );
});
