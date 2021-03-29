import * as React from 'react';
import { notification } from 'antd';
import {
  AudioOutlined,
  PauseCircleOutlined,
  PlayCircleOutlined,
  SendOutlined,
} from '@ant-design/icons';

import './style.less';

const AudioModal: React.FC<unknown> = React.memo(() => {
  const [isRecord, setIsRecord] = React.useState<boolean>(false);

  const startRecord = React.useCallback(() => {
    setIsRecord(true);
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((mediaStream: MediaStream) => {
        console.log(mediaStream);
      });
  }, []);

  const pauseRecord = React.useCallback(() => {
    setIsRecord(false);
  }, []);

  return (
    <>
      {!!isRecord && <PauseCircleOutlined onClick={pauseRecord} />}
      {!isRecord && <PlayCircleOutlined onClick={startRecord} />}
      <SendOutlined />
    </>
  );
});

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
