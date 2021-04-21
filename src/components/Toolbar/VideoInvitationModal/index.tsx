// 发起视频通话的弹窗
import * as React from 'react';
import { Typography, notification, message } from 'antd';
import { Siri } from '@src/modules/Siri';
import { useSubject } from '@src/hooks/useSubject';
import { MessageCenter, ESignalType, RTCPeer } from '@src/modules/RemoteGlobal';
import { openVideoCallWindow } from '@src/utils';

import './style.less';

interface IVideoInvitationModal {
  fromId: string;
  toId: string;
  addRTCPeerConnection: (fromId: string, toId: string) => void;
}

export const VideoInvitationModal: React.FunctionComponent<IVideoInvitationModal> = React.memo(
  ({ fromId, toId, addRTCPeerConnection }) => {
    const siriCanvasRef = React.useRef<HTMLCanvasElement>(null);
    const [siri, setSiri] = React.useState<Siri>(null);
    const [globalSubject$, RxEvent] = useSubject();

    // 渲染siri
    React.useEffect(() => {
      if (siriCanvasRef.current) {
        const siri = new Siri(siriCanvasRef.current);
        siri.init(siri);
        setSiri(siri);
        let isRender = true;
        const render = () => {
          window.requestAnimationFrame(() => {
            siri.render();
            isRender && render();
          });
        };
        render();
        return () => {
          isRender = false;
        };
      }
    }, [siriCanvasRef]);

    // 订阅signal
    React.useEffect(() => {
      const rejectVideoCall$ = MessageCenter.rejectVideoCall$;
      const agreeToVideoCall$ = MessageCenter.agreeToVideoCall$;
      const userOffline$ = MessageCenter.userOffline$;

      const noCall$ = MessageCenter.noCall(5000);

      // 收到拒绝视频通话的signal
      const rejectCallSub = rejectVideoCall$.subscribe(
        (rejectVideoCall: ISignal) => {
          notification.close('initiateVideoCall');
          RTCPeer.close(fromId, toId);
          message.warning('对方拒绝视频通话邀请');
        }
      );

      // 收到同意视频通话的signal
      const agreeCallSub = agreeToVideoCall$.subscribe(
        (agreeVideoCall: ISignal) => {
          notification.close('initiateVideoCall');
          if (agreeVideoCall.payload.sdp) {
            RTCPeer.setRemoteSDP(agreeVideoCall.payload.sdp);
            openVideoCallWindow(false);
          } else {
            RTCPeer.close(fromId, toId);
            message.warning('通话失败');
          }
        }
      );

      // 对方未接听，5s后取消
      const noCallSub = noCall$.subscribe(() => {
        notification.close('initiateVideoCall');
        MessageCenter.sendSignal({
          type: ESignalType.NOT_ANSWERED,
          payload: { fromId, toId },
        });
        RTCPeer.close(fromId, toId);
        message.warning('对方未接听');
      });

      // 对方离线
      const userOfflineSub = userOffline$.subscribe(
        (userOfflineSignal: ISignal) => {
          notification.close('initiateVideoCall');
          RTCPeer.close(fromId, toId);
          message.warning('对方已离线');
        }
      );

      return () => {
        rejectCallSub.unsubscribe();
        agreeCallSub.unsubscribe();
        noCallSub.unsubscribe();
        userOfflineSub.unsubscribe();
      };
    }, []);

    React.useEffect(() => {
      // 发出视频通话邀请，建立RTCPeerConnection
      addRTCPeerConnection(fromId, toId);
      RTCPeer.createLocalSDP().then((offerSDP: RTCSessionDescriptionInit) => {
        MessageCenter.sendSignal({
          type: ESignalType.INITIATE_VIDEO_CALL,
          payload: { fromId, toId, sdp: offerSDP },
        });
      });

      return () => {
        globalSubject$.next({ action: RxEvent.VIDEO_INVITATION_MODAL_CLOSE });
      };
    }, [fromId, toId]);

    return (
      <>
        <canvas ref={siriCanvasRef} onClick={() => siri.init()} />
        <Typography.Text>正在呼叫</Typography.Text>
        <span> .</span>
        <span> .</span>
        <span> .</span>
      </>
    );
  }
);
