import * as React from 'react';
import { notification } from 'antd';
import { AudioOutlined } from '@ant-design/icons';
import { filter } from 'rxjs/operators';
import { generalSubject$, ERxEvent } from '@src/modules/RxSubject';

import { AudioModal } from './AudioModal';

import './style.less';

interface IToolbar {
  sendMessage: (content: string, msgType: EMsgType, attachment?: any) => void;
  uid: string;
  currentTo: string;
}

export const Toolbar: React.FC<IToolbar> = React.memo(
  ({ sendMessage, uid, currentTo }) => {
    const [isAudioShow, setIsAudioShow] = React.useState<boolean>(false);

    React.useEffect(() => {
      const audioCloseSub = generalSubject$
        .pipe(filter((next) => next.action === ERxEvent.AUDIO_CLOSE))
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
  }
);
