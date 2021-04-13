import * as React from 'react';
import { notification } from 'antd';
import { AudioOutlined, VideoCameraOutlined } from '@ant-design/icons';
import { useSubject, ofAction } from '@src/hooks/useSubject';
import { openVideoCallWindow } from '@src/utils';

import { AudioModal } from './AudioModal';
import { Uploader } from './Uploader';

import './style.less';

export interface IToolbar {
  sendMessage: (
    content: string,
    msgType: EMsgType,
    attachment?: IAttachment,
    file?: Pick<File, 'name' | 'type'> & { data?: any },
    cache?: boolean
  ) => void;
  uid: string;
  currentTo: string;
}

export const Toolbar: React.FC<IToolbar> = React.memo(
  ({ sendMessage, uid, currentTo }) => {
    const [globalSubject$, RxEvent] = useSubject();
    const [isAudioShow, setIsAudioShow] = React.useState<boolean>(false);

    React.useEffect(() => {
      const audioCloseSub = globalSubject$
        .pipe(ofAction(RxEvent.AUDIO_CLOSE))
        .subscribe(() => setIsAudioShow(false));

      return () => audioCloseSub.unsubscribe();
    }, []);

    const showAudioModal = React.useCallback(() => {
      if (!isAudioShow) {
        setIsAudioShow(true);
        notification.open({
          key: 'audio',
          message: (
            <AudioModal
              sendMessage={sendMessage}
              uid={uid}
              currentTo={currentTo}
            />
          ),
          placement: 'bottomRight',
          duration: null,
          className: 'audio-modal',
          bottom: 170,
          onClose: () => {
            setIsAudioShow(false);
            globalSubject$.next({ action: RxEvent.AUDIO_CLOSE });
          },
        });
      }
    }, [isAudioShow]);

    return (
      <div className="toolbar">
        <AudioOutlined onClick={showAudioModal} />
        <Uploader sendMessage={sendMessage} />
        <VideoCameraOutlined onClick={() => openVideoCallWindow(false)} />
      </div>
    );
  }
);
