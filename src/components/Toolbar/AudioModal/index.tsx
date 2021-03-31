import * as React from 'react';
import {
  PauseCircleOutlined,
  PlayCircleOutlined,
  SendOutlined,
  StopOutlined,
} from '@ant-design/icons';
import { filter } from 'rxjs/operators';
import Recorder from 'recorder-core';
import 'recorder-core/src/engine/mp3';
import 'recorder-core/src/engine/mp3-engine';
import 'recorder-core/src/extensions/waveview';

import { generalSubject$, ERxEvent } from '@src/modules/RxSubject';

import './style.less';

export const AudioModal: React.FC<unknown> = React.memo(() => {
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
  const audioRef = React.useRef<HTMLAudioElement>(null);
  const wave = React.useRef(null);

  React.useEffect(() => {
    //TODO: 需优化
    generalSubject$
      .pipe(filter((next) => next.action === ERxEvent.AUDIO_CLOSE))
      .subscribe(() => recorder.close());
    recorder.open(
      () => {
        wave.current = Recorder.WaveView({
          elem: '.wave',
          lineWidth: 1,
        });
        //初始化波浪线
        wave.current.input(new Int16Array(1), 0, 16000);
      },
      (msg: any, isUserNotAllow: boolean) => {
        console.log(msg, isUserNotAllow);
      }
    );
  }, [recorder]);

  const startRecord = () => {
    setIsRecord(true);
    recorder.start();
  };

  const stopRecord = React.useCallback(() => {
    setIsRecord(false);
    recorder.stop(
      (blob: Blob, duration: number) => {
        setIsRecordShow(false);
        const audioURL = (window.URL || webkitURL).createObjectURL(blob);
        console.log(blob);
        audioRef.current.src = audioURL;
        //TODO: 需优化
        generalSubject$
          .pipe(filter((next) => next.action === ERxEvent.AUDIO_CLOSE))
          .subscribe(() => (window.URL || webkitURL).revokeObjectURL(audioURL));
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

  const audioControl: JSX.Element = React.useMemo(() => {
    let result = null;
    if (!isRecordShow) {
      return (
        <div className="audio-control">
          <audio ref={audioRef} />
        </div>
      );
    }
    return result;
  }, [isRecordShow]);

  return (
    <>
      {recorderControl}
      {audioControl}
      <SendOutlined />
    </>
  );
});
