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
    return [peer, remotePeerId, fromId, toId];
  }, [uid]);

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
        }
      );

      const dragSub = drag$(localVideo).subscribe((event) => {
        if (0 < event.x && event.x < 440 && 0 < event.y && event.y < 330) {
          localVideo.style.left = `${event.x}px`;
          localVideo.style.top = `${event.y}px`;
        }
      });

      let sendStreamSub: Subscription = null;
      navigator.mediaDevices
        .getUserMedia({
          video: true,
          audio: true,
        })
        .then((stream) => {
          localVideo.srcObject = stream;
          if (fromId === uid) {
            sendStreamSub = MessageCenter.sendVideoStream$.subscribe(() => {
              const call = peer.call(remotePeerId, stream);
              call.on('stream', (remoteStream) => {
                remoteVideo.srcObject = remoteStream;
              });
            });
          } else {
            peer.on('call', (call) => {
              call.answer(stream);
              call.on('stream', (remoteStream) => {
                remoteVideo.srcObject = remoteStream;
              });
            });
            MessageCenter.sendSignal({
              type: ESignalType.PREPARE_TO_RECEIVE_VIDEO_STREAM,
              payload: {
                fromId: toId as string,
                toId: fromId as string,
              },
            });
          }
        });

      return () => {
        localVideoPlaySub.unsubscribe();
        remoteVideoPlaySub.unsubscribe();
        dragSub.unsubscribe();
        sendStreamSub && sendStreamSub.unsubscribe();
      };
    }
  }, [localVideoRef, remoteVideoRef, fromId, toId]);

  React.useEffect(() => {
    const hangUdSub = MessageCenter.hangUp$.subscribe(() => {
      message.warning('对方已挂断').then(() => closeVideoCallWindow());
    });
    return () => {
      sendHangUpSignal();
      hangUdSub.unsubscribe();
      peer.destroy();
    };
  }, []);

  const sendHangUpSignal = React.useCallback(() => {
    let payload: ISignal['payload'] = {
      fromId: fromId as string,
      toId: toId as string,
    };
    if (uid !== fromId) {
      payload = { fromId: toId as string, toId: fromId as string };
    }
    MessageCenter.sendSignal({ type: ESignalType.HANG_UP, payload });
  }, [fromId, toId]);

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
        onClick={() => closeVideoCallWindow()}
      />
    </div>
  );
});
