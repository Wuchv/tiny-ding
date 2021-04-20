import * as React from 'react';
import { fromEvent } from 'rxjs';
import { concatMap, map, merge, takeUntil } from 'rxjs/operators';
import { MessageCenter, ESignalType } from '@src/modules/RemoteGlobal';

import './VideoCall.less';

export const VideoCall: React.FC<unknown> = React.memo(() => {
  const localVideoRef = React.useRef<HTMLVideoElement>(null);
  const remoteVideoRef = React.useRef<HTMLVideoElement>(null);

  React.useEffect(() => {
    const localVideo: HTMLVideoElement = localVideoRef.current;
    if (localVideo) {
      const localVideoPlaySub = fromEvent(localVideo, 'loadeddata').subscribe(
        () => {
          localVideoRef.current.play();
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
        });

      return () => {
        localVideoPlaySub.unsubscribe();
        dragSub.unsubscribe();
      };
    }
  }, [localVideoRef]);

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
