// 收到视频通话邀请的弹窗
import * as React from 'react';
import { Typography, Button, notification } from 'antd';
import { MessageCenter, ESignalType, RTCPeer } from '@src/modules/RemoteGlobal';

import './style.less';

interface IVideoReceivedModal {
  fromId: string;
  toId: string;
  offerSDP: RTCSessionDescriptionInit;
  addRTCPeerConnection: (fromId: string, toId: string) => void;
}

export const VideoReceivedModal: React.FunctionComponent<IVideoReceivedModal> = React.memo(
  ({ fromId, toId, offerSDP, addRTCPeerConnection }) => {
    React.useEffect(() => {
      // 未接收对方通话邀请
      const notAnswered$ = MessageCenter.notAnswered$;

      const notAnsweredSub = notAnswered$.subscribe(
        (notAnsweredSignal: ISignal) => {
          notification.close(`receivedVideoCall:${fromId}`);
        }
      );

      return () => {
        notAnsweredSub.unsubscribe();
      };
    }, []);

    const sendVideoCallSignal = React.useCallback(
      async (type: ESignalType) => {
        let payload: ISignal['payload'] = { fromId: toId, toId: fromId };
        if (type === ESignalType.AGREE_TO_VIDEO_CALL) {
          addRTCPeerConnection(fromId, toId);
          const answerSDP = await RTCPeer.acceptRemoteSDP(offerSDP);
          payload = { fromId: toId, toId: fromId, sdp: answerSDP };
        }
        MessageCenter.sendSignal({
          type,
          payload,
        });
        notification.close(`receivedVideoCall:${fromId}`);
      },
      [fromId, toId]
    );

    return (
      <>
        <Typography.Text>
          来自 <a>{fromId}</a> 的视频通话邀请
        </Typography.Text>
        <div className="button-wrapper">
          <Button
            type="primary"
            size="small"
            onClick={() => sendVideoCallSignal(ESignalType.AGREE_TO_VIDEO_CALL)}
          >
            同意
          </Button>
          <Button
            type="primary"
            size="small"
            danger
            onClick={() => sendVideoCallSignal(ESignalType.REJECT_VIDEO_CALL)}
          >
            拒绝
          </Button>
        </div>
      </>
    );
  }
);
