import * as React from 'react';
import { fromEvent } from 'rxjs';
import { concatMap, map, merge, takeUntil } from 'rxjs/operators';
import Peer from 'peerjs';
import { useReduxData } from '@src/hooks/useRedux';
import { queryString } from '@src/utils';
import { host, stunList } from '@src/constants';

import './VideoCall.less';

export const VideoCall: React.FC<unknown> = React.memo(() => {
  const localVideoRef = React.useRef<HTMLVideoElement>(null);
  const remoteVideoRef = React.useRef<HTMLVideoElement>(null);
  const [, { uid }] = useReduxData();

  const [peer, remotePeerId, fromId] = React.useMemo(() => {
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
    return [peer, remotePeerId, fromId];
  }, [uid]);

  // 获取本机视频流
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
        }
      );

      const dragSub = drag$(localVideo).subscribe((event) => {
        if (0 < event.x && event.x < 540 && 0 < event.y && event.y < 380) {
          localVideo.style.left = `${event.x}px`;
          localVideo.style.top = `${event.y}px`;
        }
      });

      navigator.mediaDevices
        .getUserMedia({
          video: true,
          audio: true,
        })
        .then((stream) => {
          localVideo.srcObject = stream;
          if (fromId === uid) {
            const call = peer.call(remotePeerId, stream);
            call.on('stream', (remoteStream) => {
              console.log(111, remoteStream);
              remoteVideo.srcObject = remoteStream;
            });
          } else {
            peer.on('call', (call) => {
              call.answer(stream);
              call.on('stream', (remoteStream) => {
                console.log(222, remoteStream);
                remoteVideo.srcObject = remoteStream;
              });
            });
          }
        });

      return () => {
        localVideoPlaySub.unsubscribe();
        remoteVideoPlaySub.unsubscribe();
        dragSub.unsubscribe();
      };
    }
  }, [localVideoRef, remoteVideoRef, fromId]);

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
      <video ref={remoteVideoRef} className="remote-video" />
      <video ref={localVideoRef} className="local-video" />
    </div>
  );
});
