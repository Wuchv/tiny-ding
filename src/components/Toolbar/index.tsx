import * as React from 'react';
import { notification } from 'antd';
import { AudioOutlined, VideoCameraOutlined } from '@ant-design/icons';
import { useSubject, ofAction } from '@src/hooks/useSubject';
import { openVideoCallWindow } from '@src/utils';
import { MessageCenter, ESignalType } from '@src/modules/RemoteGlobal';

import { AudioModal } from './AudioModal';
import { Uploader } from './Uploader';
import { VideoInvitationModal } from './VideoInvitationModal';

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
    const [
      isVideoCallInviteShow,
      setIsVideoCallInviteShow,
    ] = React.useState<boolean>(false);

    React.useEffect(() => {
      const audioCloseSub = globalSubject$
        .pipe(ofAction(RxEvent.AUDIO_CLOSE))
        .subscribe(() => setIsAudioShow(false));

      return () => audioCloseSub.unsubscribe();
    }, []);

    const showAudioModal = React.useCallback(() => {
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
    }, [isAudioShow]);

    const initiateVideoCall = React.useCallback(() => {
      setIsVideoCallInviteShow(true);
      MessageCenter.sendSignal({
        type: ESignalType.INITIATE_VIDEO_CALL,
        payload: { fromId: uid, toId: currentTo },
      });
      notification.open({
        key: 'initiateVideoCall',
        message: <VideoInvitationModal />,
        className: 'video-invitation-modal',
        placement: 'bottomRight',
        duration: null,
        bottom: 170,
        onClose: () => {
          setIsVideoCallInviteShow(false);
        },
      });
      // openVideoCallWindow(false);
    }, [uid, currentTo]);

    return (
      <div className="toolbar">
        <AudioOutlined onClick={showAudioModal} disabled={isAudioShow} />
        <Uploader sendMessage={sendMessage} />
        <VideoCameraOutlined
          onClick={initiateVideoCall}
          disabled={isVideoCallInviteShow}
        />
      </div>
    );
  }
);
