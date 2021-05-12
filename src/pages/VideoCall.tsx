import * as React from 'react';
import { message, Spin, Button } from 'antd';
import { PhoneOutlined } from '@ant-design/icons';
import { fromEvent, Subscription } from 'rxjs';
import { concatMap, map, merge, takeUntil } from 'rxjs/operators';
import Peer from 'peerjs';
import { MessageCenter, ESignalType } from '../modules/RemoteGlobal';
import { useReduxData } from '@src/hooks/useRedux';
import { queryString, closeVideoCallWindow } from '@src/utils';
import { host, stunList } from '@src/constants';

import './VideoCall.less';

export const VideoCall: React.FC<unknown> = React.memo(() => {
  const [, { uid }] = useReduxData();
  const localVideoRef = React.useRef<HTMLVideoElement>(null);
  const remoteVideoRef = React.useRef<HTMLVideoElement>(null);
  const [isSpin, setIsSpin] = React.useState<boolean>(true);
  const [isButtonDisabled, setIsButtonDisabled] = React.useState<boolean>(true);

  const [peer, remotePeerId, fromId, toId] = React.useMemo(() => {
    const fromId = queryString('fromId');
    const toId = queryString('toId');
    let peerId = `${fromId}-${toId}`;
    let remotePeerId = `${toId}-${fromId}`;
    if (uid === toId) {
      peerId = `${toId}-${fromId}`;
      remotePeerId = `${fromId}-${toId}`;
    }
    const peer = new Peer(peerId, {
      host,
      port: 9000,
      path: '/video',
      debug: 3,
      secure: false,
      config: {
        iceServers: [{ urls: stunList }],
      },
    });
    return [peer, remotePeerId, fromId as string, toId as string];
  }, [uid]);

  React.useEffect(() => {
    const hangUpSub = MessageCenter.hangUp$.subscribe(() => {
      closeWithError('对方已挂断');
    });

    return () => {
      hangUpSub.unsubscribe();
    };
  }, []);

  // 获取local和remote视频流
  React.useEffect(() => {
    const localVideo: HTMLVideoElement = localVideoRef.current;
    const remoteVideo: HTMLVideoElement = remoteVideoRef.current;
    if (localVideo && remoteVideo && fromId) {
      const localVideoPlaySub = fromEvent(localVideo, 'loadeddata').subscribe(
        () => {
          localVideo.play();
        }
      );

      const remoteVideoPlaySub = fromEvent(remoteVideo, 'loadeddata').subscribe(
        () => {
          remoteVideo.play();
          setIsSpin(false);
          setIsButtonDisabled(false);
        }
      );

      const dragSub = drag$(localVideo).subscribe((event) => {
        if (0 < event.x && event.x < 440 && 0 < event.y && event.y < 330) {
          localVideo.style.left = `${event.x}px`;
          localVideo.style.top = `${event.y}px`;
        }
      });

      let sendStreamSub: Subscription = null;
      let sendPrepareSub: Subscription = null;
      navigator.mediaDevices
        .getUserMedia({
          video: true,
          audio: true,
        })
        .then((stream) => {
          localVideo.srcObject = stream;
          if (fromId === uid) {
            sendStreamSub = MessageCenter.sendVideoStream$.subscribe(() => {
              // 向通话接受者发送已收到准备好的信号
              MessageCenter.sendSignal({
                type: ESignalType.STOP_SEND_PREPARE,
                payload: {
                  fromId,
                  toId,
                },
              });
              // 呼叫对方
              const call = peer.call(remotePeerId, stream);
              // 监听回应
              call.on('stream', (remoteStream) => {
                remoteVideo.srcObject = remoteStream;
              });
              changeIceStateListener(call);
            });
          } else {
            // 监听呼叫
            peer.on('call', (call) => {
              // 应答
              call.answer(stream);
              call.on('stream', (remoteStream) => {
                remoteVideo.srcObject = remoteStream;
              });
            });

            // 不断向通话发起者发送准备好的信号
            sendPrepareSub = MessageCenter.sendPrepareToReceiveStream$.subscribe(
              (code: number) => {
                if (code === -1) {
                  closeWithError('无法连接');
                } else {
                  MessageCenter.sendSignal({
                    type: ESignalType.PREPARE_TO_RECEIVE_VIDEO_STREAM,
                    payload: {
                      fromId: toId,
                      toId: fromId,
                    },
                  });
                }
              }
            );
          }
        });

      return () => {
        localVideoPlaySub.unsubscribe();
        remoteVideoPlaySub.unsubscribe();
        dragSub.unsubscribe();
        sendStreamSub && sendStreamSub.unsubscribe();
        sendStreamSub && sendPrepareSub.unsubscribe();
      };
    }
  }, [localVideoRef, remoteVideoRef, fromId, toId]);

  const changeIceStateListener = React.useCallback(
    (call: Peer.MediaConnection) => {
      const _oniceconnectionstatechange = call.peerConnection.oniceconnectionstatechange.bind(
        call.peerConnection
      );
      call.peerConnection.oniceconnectionstatechange = () => {
        _oniceconnectionstatechange();
        if (call.peerConnection.iceConnectionState === 'disconnected') {
          closeWithError('对方已挂断');
        }
      };
    },
    []
  );

  const closeWithError = React.useCallback(async (err: string) => {
    await message.warning(err);
    peer.destroy();
    closeVideoCallWindow();
  }, []);

  const hangUp = React.useCallback(() => {
    let payload = { fromId, toId };
    if (fromId !== uid) {
      payload = { fromId: toId, toId: fromId };
    }
    MessageCenter.sendSignal({ type: ESignalType.HANG_UP, payload });
    peer.destroy();
    closeVideoCallWindow();
  }, []);

  const drag$ = React.useCallback((video: HTMLVideoElement) => {
    const mouseDown$ = fromEvent(video, 'mousedown');
    const mouseUp$ = fromEvent(video, 'mouseup');
    const mouseOut$ = fromEvent(video, 'mouseout');
    const mouseMove$ = fromEvent(video, 'mousemove');

    return mouseDown$.pipe(
      concatMap((startEvent: MouseEvent) => {
        const initialLeft = video.offsetLeft;
        const initialTop = video.offsetTop;
        const stop$ = mouseUp$.pipe(merge(mouseOut$));
        return mouseMove$.pipe(
          takeUntil(stop$),
          map((mouseEvent: MouseEvent) => ({
            x: mouseEvent.x - startEvent.x + initialLeft,
            y: mouseEvent.y - startEvent.y + initialTop,
          }))
        );
      })
    );
  }, []);

  return (
    <div className="video-call">
      <Spin className="loading" spinning={isSpin} />
      <video ref={remoteVideoRef} className="remote-video" />
      <video ref={localVideoRef} className="local-video" />
      <Button
        className="hang-up-button"
        type="primary"
        shape="circle"
        size="large"
        danger
        icon={<PhoneOutlined />}
        disabled={isButtonDisabled}
        onClick={hangUp}
      />
    </div>
  );
});
