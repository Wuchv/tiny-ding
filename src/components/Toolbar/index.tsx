import * as React from 'react';
import { notification } from 'antd';
import { AudioOutlined, VideoCameraOutlined } from '@ant-design/icons';
import { useSubject, ofAction } from '@src/hooks/useSubject';
import { openVideoCallWindow } from '@src/utils';
import { MessageCenter, ESignalType } from '@src/modules/RemoteGlobal';

import { AudioModal } from './AudioModal';
import { Uploader } from './Uploader';
import { VideoInvitationModal } from './VideoInvitationModal';
import { VideoReceivedModal } from './VideoReceivedModal';

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
      // 监听录音弹窗关闭
      const audioCloseSub = globalSubject$
        .pipe(ofAction(RxEvent.AUDIO_CLOSE))
        .subscribe(() => setIsAudioShow(false));

      // 收到视频通话邀请
      const receiveCallSub = MessageCenter.receiveVideoCall$.subscribe(
        (receivedVideoSignal: ISignal) => {
          const { fromId, toId } = receivedVideoSignal.payload;
          notification.open({
            key: 'receivedVideoCall',
            message: <VideoReceivedModal fromId={fromId} toId={toId} />,
            duration: null,
            className: 'video-received-modal',
            placement: 'topRight',
            onClose: () => {
              MessageCenter.sendSignal({
                type: ESignalType.REJECT_VIDEO_CALL,
                payload: { fromId: toId, toId: fromId },
              });
            },
          });
        }
      );

      //TODO:同意/拒绝/未接听视频通话的处理

      return () => {
        receiveCallSub.unsubscribe();
        audioCloseSub.unsubscribe();
      };
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
        bottom: 170,
        duration: null,
        placement: 'bottomRight',
        className: 'audio-modal',
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
        bottom: 170,
        duration: null,
        className: 'video-invitation-modal',
        placement: 'bottomRight',
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
