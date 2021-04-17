import * as React from 'react';
import { notification, message, Progress } from 'antd';
import {
  PauseCircleOutlined,
  PlayCircleOutlined,
  SendOutlined,
  StopOutlined,
} from '@ant-design/icons';
import { fromEvent } from 'rxjs';
import Recorder from 'recorder-core';
import 'recorder-core/src/engine/mp3';
import 'recorder-core/src/engine/mp3-engine';
import 'recorder-core/src/extensions/waveview';
import { EMsgType } from '@src/modules/RemoteGlobal';
import FileUploader from '@src/modules/FileUploader';
import { useSubject, ofAction } from '@src/hooks/useSubject';
import { IToolbar } from '..';

import './style.less';

interface IAudioControl {
  isShow: boolean;
  audioRef: React.RefObject<HTMLAudioElement>;
}

export const AudioControl: React.FC<IAudioControl> = React.memo(
  ({ audioRef, isShow }) => {
    if (!isShow) return null;

    const [isAudioPlay, setIsAudioPlay] = React.useState<boolean>(false);
    const [currentTime, setCurrentTime] = React.useState<number>(0);
    const [duration, setDuration] = React.useState<number>(0);

    React.useEffect(() => {
      if (audioRef.current) {
        const audioLoaded = fromEvent(audioRef.current, 'loadeddata').subscribe(
          () => {
            setDuration(parseFloat(audioRef.current.duration.toFixed(2)));
          }
        );
        const playSub = fromEvent(
          audioRef.current,
          'timeupdate'
        ).subscribe(() =>
          setCurrentTime(parseFloat(audioRef.current.currentTime.toFixed(2)))
        );
        const endSub = fromEvent(audioRef.current, 'ended').subscribe(() => {
          setCurrentTime(0);
          setIsAudioPlay(false);
        });
        return () => {
          playSub.unsubscribe();
          endSub.unsubscribe();
          audioLoaded.unsubscribe();
        };
      }
    }, [audioRef]);

    const audioPlay = React.useCallback(() => {
      audioRef.current.play().catch((e) => {
        message.error(e.toString());
      });
      setIsAudioPlay(true);
    }, [audioRef]);

    const audioPause = React.useCallback(() => {
      setIsAudioPlay(false);
      audioRef.current.pause();
    }, [audioRef]);

    return (
      <>
        {!isAudioPlay && <PauseCircleOutlined onClick={audioPlay} />}
        {isAudioPlay && <PlayCircleOutlined onClick={audioPause} />}
        <div className="audio-control-progress">
          <Progress
            percent={(currentTime / duration) * 100}
            showInfo={false}
            width={100}
            strokeWidth={3}
            strokeLinecap={'round'}
            strokeColor={{ from: '#806d9e', to: '#35c7fd' }}
          />
          <span>{`${duration}s`}</span>
        </div>
      </>
    );
  }
);

interface IAudioModal extends IToolbar {}

export const AudioModal: React.FC<IAudioModal> = React.memo(
  ({ sendMessage, uid, currentTo }) => {
    const [isRecord, setIsRecord] = React.useState<boolean>(false);
    const [isRecordShow, setIsRecordShow] = React.useState<boolean>(true);
    const [recorder] = React.useState(
      Recorder({
        type: 'mp3',
        sampleRate: 16000,
        bitRate: 16,
        onProcess: (
          buffers: Buffer[],
          powerLevel: number,
          bufferDuration: number,
          bufferSampleRate: number
        ) => {
          wave.current.input(
            buffers[buffers.length - 1],
            powerLevel,
            bufferSampleRate
          );
        },
      })
    );
    const audioRef: React.RefObject<HTMLAudioElement> = React.useRef<HTMLAudioElement>(
      null
    );
    const wave = React.useRef(null);
    const [globalSubject$, ERxEvent] = useSubject();

    React.useEffect(() => {
      const audioCloseSub = globalSubject$
        .pipe(ofAction(ERxEvent.AUDIO_CLOSE))
        .subscribe(() => {
          recorder.close();
          (window.URL || webkitURL).revokeObjectURL(audioRef.current.src);
        });
      recorder.open(
        () => {
          wave.current = Recorder.WaveView({
            elem: '.wave',
            lineWidth: 1,
          });
          //初始化波浪线
          wave.current.input(new Int16Array(1), 0, 16000);
        },
        (msg: string, isUserNotAllow: boolean) => {
          message.error(msg);
          notification.close('audio');
        }
      );

      return () => audioCloseSub.unsubscribe();
    }, [recorder]);

    const startRecord = () => {
      setIsRecord(true);
      recorder.start();
    };

    const stopRecord = React.useCallback(() => {
      setIsRecord(false);
      recorder.stop(
        (blob: Blob) => {
          setIsRecordShow(false);
          const audioURL = (window.URL || webkitURL).createObjectURL(blob);
          audioRef.current.src = audioURL;
        },
        (msg: string) => {
          console.log(msg);
        },
        () => {
          // 释放录音资源
          recorder.close();
        }
      );
    }, [recorder]);

    const recorderControl: JSX.Element = React.useMemo(() => {
      let result = null;
      if (!!isRecordShow) {
        result = (
          <>
            {!isRecord ? (
              <PlayCircleOutlined onClick={startRecord} />
            ) : (
              <StopOutlined onClick={stopRecord} />
            )}
            <div className="wave"></div>
          </>
        );
      }
      return result;
    }, [isRecordShow, isRecord]);

    const sendAudioMessage = React.useCallback(async () => {
      if (audioRef.current && audioRef.current.src) {
        let blob: Blob = await fetch(audioRef.current.src).then((r) =>
          r.blob()
        );
        const [err, result] = await FileUploader.putObjectAudioBlob(
          blob,
          `${uid}:${currentTo}:${Date.now()}`
        );
        if (err) {
          message.error(err);
          return;
        }
        audioRef.current.src = result.url;
        sendMessage(result.url, EMsgType.AUDIO, result, {
          name: result.name,
          type: 'audio/mpeg',
          data: blob,
        });
        notification.close('audio');
        globalSubject$.next({ action: ERxEvent.AUDIO_CLOSE });
      } else {
        message.error('请先录音！');
      }
    }, [audioRef]);

    return (
      <>
        {recorderControl}
        <audio ref={audioRef} />
        <AudioControl audioRef={audioRef} isShow={!isRecordShow} />
        <SendOutlined onClick={sendAudioMessage} />
      </>
    );
  }
);
