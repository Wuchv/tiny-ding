import * as React from 'react';
import { notification } from 'antd';
import {
  AudioOutlined,
  PauseCircleOutlined,
  PlayCircleOutlined,
  SendOutlined,
} from '@ant-design/icons';
import Recorder from 'recorder-core';
import 'recorder-core/src/engine/mp3';
import 'recorder-core/src/engine/mp3-engine';

import './style.less';

const AudioModal: React.FC<unknown> = React.memo(() => {
  const [isRecord, setIsRecord] = React.useState<boolean>(false);
  const [recorder, setRecorder] = React.useState(
    Recorder({
      type: 'mp3',
      sampleRate: 16000,
      bitRate: 16,
    })
  );
  const [mediaRecorder, setMediaRecorder] = React.useState(null);
  const audioRef = React.useRef<HTMLAudioElement>(null);

  React.useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then(function (stream) {
        setMediaRecorder(new MediaRecorder(stream));
      })
      .catch(function (err) {
        console.log(err);
      });
    // 调用open方法进行授权
    // recorder.open(
    //   () => {
    //     console.log('授权成功');
    //   },
    //   (msg: any, isUserNotAllow: boolean) => {
    //     //用户拒绝未授权或不支持
    //     console.log(msg, isUserNotAllow);
    //   },
    //   function (msg: any) {
    //     console.log(msg);
    //   }
    // );
  }, []);

  const startRecord = () => {
    setIsRecord(true);
    // recorder.start();
    const chunks: Blob[] = [];
    mediaRecorder.onstart = () => {
      console.log('start', mediaRecorder.state);
    };
    mediaRecorder.onstop = () => {
      console.log('stop', mediaRecorder.state);
      // 数据块合成blob对象
      const blob = new Blob(chunks, { type: 'audio/webm;codecs=opus' });
      console.log(chunks, blob);

      const url = (window.URL || webkitURL).createObjectURL(blob);
      audioRef.current.src = url;
      audioRef.current.controls = true;
    };

    mediaRecorder.ondataavailable = (e: any) => {
      console.log('data');
      console.log(e.data);
      chunks.push(e.data);
    };

    mediaRecorder.start();
  };

  const pauseRecord = React.useCallback(() => {
    setIsRecord(false);
    // recorder.stop(
    //   (blob: Blob, duration: number) => {
    //     // 创建指向音频文件的URL
    //     const audioURL = (window.URL || webkitURL).createObjectURL(blob);
    //     console.log('blob:', blob, duration, audioURL);
    //     const testUrl = 'https://www.w3school.com.cn/i/horse.ogg';
    //     audioRef.current.src = audioURL;
    //     audioRef.current.controls = true;
    //     // (window.URL || webkitURL).revokeObjectURL(audioURL);
    //   },
    //   (msg: any) => {
    //     console.log(msg);
    //   },
    //   () => {
    //     // 释放录音资源
    //     recorder.close();
    //   }
    // );
    mediaRecorder.stop();
  }, [recorder, mediaRecorder]);

  return (
    <>
      {!!isRecord && <PauseCircleOutlined onClick={pauseRecord} />}
      {!isRecord && <PlayCircleOutlined onClick={startRecord} />}
      <audio ref={audioRef} />
      <SendOutlined />
    </>
  );
});

export const Toolbar: React.FC<unknown> = React.memo(() => {
  const [isAudioShow, setIsAudioShow] = React.useState<boolean>(false);

  const showAudioModal = React.useCallback(() => {
    if (!isAudioShow) {
      setIsAudioShow(true);
      notification.open({
        key: 'audio',
        message: <AudioModal />,
        placement: 'bottomRight',
        duration: null,
        className: 'audio-modal',
        bottom: 170,
        onClose: () => {
          setIsAudioShow(false);
        },
      });
    }
  }, [isAudioShow]);

  return (
    <div className="toolbar">
      <AudioOutlined onClick={showAudioModal} />
    </div>
  );
});
